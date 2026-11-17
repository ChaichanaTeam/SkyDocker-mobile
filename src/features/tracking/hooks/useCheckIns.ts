import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";

import {
  createCheckIn,
  createCustomDrone,
  endCheckIn,
  fetchActiveCheckIn,
  fetchDrones,
  fetchMissions,
  fetchPilot,
  fetchPrivileges,
  fetchSupportedCountries,
  previewCheckIn,
  resolveCountry,
} from "@app/api/services/checkIn.service";
import { isApiError } from "@app/api/types/apiError";
import type { CheckInFeature } from "@app/api/types/checkIn";
import { mapCheckInErrorToMessage } from "@features/tracking/mappers/checkInErrorMapper";
import type {
  CachedCustomDrone,
  CheckInDraftValues,
  CheckInMutation,
  CheckInSession,
  DroneOption,
  MissionOption,
  PreparedCheckIn,
  ReceivedCheckInToken,
} from "@features/tracking/types/checkIn";
import type { UserCoordinates } from "@features/tracking/types/types";
import {
  buildCustomDroneCreateRequest,
  buildPreviewRequest,
  previewIsValid,
} from "@validators/checkIn.schema";

const isAmbiguousMutationFailure = (error: unknown): boolean =>
  isApiError(error) &&
  (error.kind === "timeout" ||
    error.kind === "network" ||
    error.kind === "invalid-response");

export const useCheckIns = (
  getFreshCoordinates: () => Promise<UserCoordinates>,
  onChanged: () => void,
): CheckInSession => {
  const [drones, setDrones] = useState<DroneOption[]>([]);
  const [missions, setMissions] = useState<MissionOption[]>([]);
  const [privileges, setPrivileges] = useState<string[]>([]);
  const [phone, setPhone] = useState<string | null>(null);
  const [active, setActive] = useState<CheckInFeature | null>(null);
  const [prepared, setPrepared] = useState<PreparedCheckIn | null>(null);
  const [loading, setLoading] = useState(true);
  const [mutation, setMutation] = useState<CheckInMutation | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [uncertain, setUncertain] = useState(false);
  const token = useRef<ReceivedCheckInToken | null>(null);
  const customDrone = useRef<CachedCustomDrone | null>(
    null,
  );
  const lock = useRef(false);
  const revision = useRef(0);

  const reconcileActive = useCallback(async () => {
    const current = await fetchActiveCheckIn();
    setActive(current);
    setUncertain(false);
    return current;
  }, []);

  const refreshActive = useCallback(async () => {
    if (lock.current)
      throw new Error("Wait for the current check-in request to finish.");
    const requestRevision = revision.current;
    const current = await fetchActiveCheckIn();
    if (requestRevision === revision.current && !lock.current) {
      setActive(current);
      setUncertain(false);
    }
    return current;
  }, []);

  useFocusEffect(
    useCallback(() => {
      let current = true;
      setLoading(true);
      setError(null);
      setPrepared(null);
      token.current = null;
      revision.current += 1;
      const activeRequest = fetchActiveCheckIn()
        .then((activeCheckIn) => {
          if (current) setActive(activeCheckIn);
        })
        .catch((caught) => {
          if (current) setError(mapCheckInErrorToMessage(caught, "load"));
        });
      const pilotRequest = Promise.all([
        fetchPilot(),
        fetchDrones(),
        fetchMissions(),
        fetchPrivileges(),
      ])
        .then(([pilot, ownDrones, ownMissions, ownPrivileges]) => {
          if (!current) return;
          setPhone(pilot.phone_number);
          setDrones(ownDrones);
          setMissions(ownMissions);
          setPrivileges([...new Set(ownPrivileges)]);
        })
        .catch((caught) => {
          if (current) setError(mapCheckInErrorToMessage(caught, "load"));
        });
      void Promise.all([activeRequest, pilotRequest]).then(() => {
        if (current) setLoading(false);
      });
      return () => {
        current = false;
        token.current = null;
        revision.current += 1;
      };
    }, []),
  );

  const invalidatePreview = useCallback(() => {
    revision.current += 1;
    token.current = null;
    setPrepared(null);
  }, []);

  const prepare = useCallback(
    async (
      values: CheckInDraftValues,
      onCustomDroneCreated?: (drone: DroneOption) => void,
    ): Promise<void> => {
      if (lock.current || uncertain) return;
      if (active)
        throw new Error("End your active check-in before starting another.");
      if (!phone?.trim())
        throw new Error(
          "Add a phone number to your pilot profile before check-in.",
        );
      lock.current = true;
      setMutation("preview");
      setError(null);
      invalidatePreview();
      const previewRevision = revision.current;
      try {
        let previewValues = values;
        let previewDrones = drones;
        if (values.drone === "custom") {
          if (!privileges.includes(values.category.toLowerCase())) {
            throw new Error("Select a valid flying category.");
          }
          const savedDrone =
            customDrone.current?.weight === values.weight
              ? customDrone.current.drone
              : await createCustomDrone(
                  buildCustomDroneCreateRequest(
                    values.weight,
                    `TEST-CUSTOM-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
                  ),
                );
          customDrone.current = { weight: values.weight, drone: savedDrone };
          setDrones((current) =>
            current.some((drone) => drone.id === savedDrone.id)
              ? current
              : [...current, savedDrone],
          );
          previewValues = {
            ...values,
            drone: String(savedDrone.id),
            weight: String(savedDrone.weightG),
          };
          previewDrones = [
            ...drones.filter((drone) => drone.id !== savedDrone.id),
            savedDrone,
          ];
          onCustomDroneCreated?.(savedDrone);
        }
        const point = await getFreshCoordinates();
        const [country, supported] = await Promise.all([
          resolveCountry(point.longitude, point.latitude),
          fetchSupportedCountries(),
        ]);
        if (!supported.includes(country))
          throw new Error(`Check-ins are not available in ${country}.`);
        const request = buildPreviewRequest(
          previewValues,
          point,
          country,
          previewDrones,
          privileges,
          missions,
        );
        const response = await previewCheckIn(request);
        if (previewRevision !== revision.current) return;
        const receivedAt = Date.now();
        token.current = { ...response, receivedAt };
        setPrepared({
          request,
          expiresAt: receivedAt + response.expires_in * 1000,
        });
      } catch (caught) {
        throw new Error(mapCheckInErrorToMessage(caught, "preview"));
      } finally {
        lock.current = false;
        setMutation(null);
      }
    },
    [
      active,
      drones,
      getFreshCoordinates,
      invalidatePreview,
      missions,
      phone,
      privileges,
      uncertain,
    ],
  );

  const confirm = useCallback(async (): Promise<void> => {
    if (lock.current || uncertain) return;
    const currentToken = token.current;
    if (!currentToken || !previewIsValid(currentToken, Date.now())) {
      invalidatePreview();
      throw new Error("Preview expired. Review the flight again.");
    }
    lock.current = true;
    revision.current += 1;
    setMutation("create");
    try {
      const created = await createCheckIn(currentToken.checkin_token);
      setActive(created);
      invalidatePreview();
      onChanged();
    } catch (caught) {
      if (isAmbiguousMutationFailure(caught)) {
        try {
          const current = await reconcileActive();
          if (current) {
            invalidatePreview();
            onChanged();
            return;
          }
        } catch {
          /* status still unknown */
        }
        setUncertain(true);
        throw new Error(
          "Creation status is uncertain. Refresh check-in status before trying again.",
        );
      }
      if (isApiError(caught) && caught.kind === "http" && caught.status === 404)
        invalidatePreview();
      throw new Error(mapCheckInErrorToMessage(caught, "create"));
    } finally {
      lock.current = false;
      setMutation(null);
    }
  }, [invalidatePreview, onChanged, reconcileActive, uncertain]);

  const finish = useCallback(async (): Promise<void> => {
    if (lock.current || uncertain || !active) return;
    lock.current = true;
    revision.current += 1;
    setMutation("end");
    try {
      await endCheckIn();
      setActive(null);
      onChanged();
    } catch (caught) {
      if (
        isAmbiguousMutationFailure(caught) ||
        (isApiError(caught) && caught.kind === "http" && caught.status === 404)
      ) {
        try {
          const current = await reconcileActive();
          if (!current) {
            onChanged();
            return;
          }
        } catch {
          /* status still unknown */
        }
        setUncertain(true);
        throw new Error(
          "Ending status is uncertain. Refresh check-in status before trying again.",
        );
      }
      throw new Error(mapCheckInErrorToMessage(caught, "end"));
    } finally {
      lock.current = false;
      setMutation(null);
    }
  }, [active, onChanged, reconcileActive, uncertain]);

  return {
    active,
    confirm,
    drones,
    error,
    finish,
    invalidatePreview,
    loading,
    missions,
    mutation,
    phone,
    prepare,
    prepared,
    privileges,
    refreshActive,
    uncertain,
  };
};
