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
    error.kind === "cancelled" ||
    error.kind === "network" ||
    error.kind === "invalid-response");

const isAmbiguousCreateFailure = (error: unknown): boolean =>
  isAmbiguousMutationFailure(error) ||
  (isApiError(error) &&
    error.kind === "http" &&
    (error.status === 408 ||
      error.status === 409 ||
      (error.status >= 500 && error.status < 600)));

export const useCheckIns = (
  getFreshCoordinates: () => Promise<UserCoordinates>,
  onChanged: () => void,
): CheckInSession => {
  const [drones, setDrones] = useState<DroneOption[]>([]);
  const [missions, setMissions] = useState<MissionOption[]>([]);
  const [privileges, setPrivileges] = useState<string[]>([]);
  const [phone, setPhone] = useState<string | null>(null);
  const [active, setActive] = useState<CheckInFeature | null>(null);
  const [loading, setLoading] = useState(true);
  const [mutation, setMutation] = useState<CheckInMutation | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [uncertain, setUncertain] = useState(false);
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
      customDrone.current = null;
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
        revision.current += 1;
      };
    }, []),
  );

  const invalidatePreview = useCallback(() => {
    revision.current += 1;
  }, []);

  const create = useCallback(
    async (
      values: CheckInDraftValues,
      onCustomDroneCreated?: (drone: DroneOption) => void,
    ): Promise<void> => {
      if (lock.current) return;
      if (uncertain)
        throw new Error("Check-in status is uncertain. Refresh status first.");
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
      let createStarted = false;
      try {
        let previewValues = values;
        let previewDrones = drones;
        if (values.drone === "custom") {
          if (!privileges.includes(values.category.toLowerCase())) {
            throw new Error("Select a valid flying category.");
          }
          const savedDrone =
            customDrone.current?.weight === values.weight &&
            drones.some((drone) => drone.id === customDrone.current?.drone.id)
              ? customDrone.current.drone
              : await createCustomDrone(
                  buildCustomDroneCreateRequest(
                    values.weight,
                    `CUSTOM-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
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
        if (!previewIsValid({ ...response, receivedAt }, Date.now())) {
          throw new Error("Preview expired. Please try again.");
        }
        createStarted = true;
        setMutation("create");
        const created = await createCheckIn(response.checkin_token);
        setActive(created);
        onChanged();
      } catch (caught) {
        if (createStarted && isAmbiguousCreateFailure(caught)) {
          try {
            const current = await reconcileActive();
            if (current) {
              onChanged();
              return;
            }
          } catch {
            /* status still unknown */
          }
          setUncertain(true);
          throw new Error(
            "Creation status is uncertain. Check-in status will be checked before trying again.",
          );
        }
        throw new Error(mapCheckInErrorToMessage(caught, createStarted ? "create" : "preview"));
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
      onChanged,
      phone,
      privileges,
      reconcileActive,
      uncertain,
    ],
  );

  const finish = useCallback(async (): Promise<void> => {
    if (lock.current || !active) return;
    if (uncertain)
      throw new Error("Check-in status is uncertain. Refresh status first.");
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
    create,
    drones,
    error,
    finish,
    invalidatePreview,
    loading,
    missions,
    mutation,
    phone,
    privileges,
    refreshActive,
    uncertain,
  };
};
