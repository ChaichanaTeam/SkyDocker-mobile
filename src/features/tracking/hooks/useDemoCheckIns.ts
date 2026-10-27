import { useCallback, useEffect, useRef, useState } from "react";

import { createDemoCheckIn, endDemoCheckIn } from "@app/api/services/checkIn.service";
import { isApiError } from "@app/api/types/apiError";
import { mapCheckInErrorToMessage } from "@features/tracking/mappers/checkInErrorMapper";
import { mapValidatedDraftToDemoCheckInRequest } from "@features/tracking/mappers/demoCheckInMapper";
import { validateCheckInDraft } from "@validators/checkIn.schema";

import type {
  CheckInDraftValues,
  CheckInMutation,
  DemoCheckInRecord,
} from "@features/tracking/types/demoCheckIn";
import type {
  UseDemoCheckInsParams,
  UseDemoCheckInsResult,
} from "@features/tracking/types/useDemoCheckIns";

export const useDemoCheckIns = ({
  getFreshCoordinates,
  onChanged,
}: UseDemoCheckInsParams): UseDemoCheckInsResult => {
  const [sessionCheckIn, setSessionCheckIn] = useState<DemoCheckInRecord | null>(null);
  const [mutation, setMutation] = useState<CheckInMutation>(null);
  const [endError, setEndError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const mutationLock = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const dismissNotice = useCallback(() => setNotice(null), []);

  const submitCheckIn = useCallback(
    async (values: CheckInDraftValues): Promise<void> => {
      if (!mounted.current) return;
      if (mutationLock.current) {
        throw new Error("Please wait for the current check-in request to finish.");
      }
      mutationLock.current = true;
      setMutation("create");
      setNotice(null);
      try {
        const validatedDraft = validateCheckInDraft(values);
        const coordinate = await getFreshCoordinates();
        if (!mounted.current) return;
        const submittedAt = new Date();
        const payload = mapValidatedDraftToDemoCheckInRequest(
          validatedDraft,
          coordinate,
          submittedAt,
        );

        const response = await createDemoCheckIn(payload);
        if (mounted.current) {
          setSessionCheckIn({ ...response, values: validatedDraft.values });
          setEndError(null);
          onChanged();
        }
      } catch (error: unknown) {
        if (!mounted.current) return;
        throw new Error(mapCheckInErrorToMessage(error));
      } finally {
        mutationLock.current = false;
        if (mounted.current) setMutation(null);
      }
    },
    [getFreshCoordinates, onChanged],
  );

  const endCheckIn = useCallback(async (): Promise<void> => {
    if (!sessionCheckIn || mutationLock.current) return;
    mutationLock.current = true;
    setMutation("end");
    setEndError(null);
    setNotice(null);
    try {
      await endDemoCheckIn(sessionCheckIn.id);
      if (mounted.current) {
        setSessionCheckIn(null);
        setNotice("Flight ended.");
        onChanged();
      }
    } catch (error: unknown) {
      if (!mounted.current) return;
      if (isApiError(error) && error.kind === "http" && (error.status === 404 || error.status === 409)) {
        setSessionCheckIn(null);
        setNotice(error.status === 404
          ? "This check-in no longer exists."
          : "This check-in has already ended or was cancelled.");
        onChanged();
      } else {
        setEndError(mapCheckInErrorToMessage(error, "end"));
      }
    } finally {
      mutationLock.current = false;
      if (mounted.current) setMutation(null);
    }
  }, [sessionCheckIn, onChanged]);

  return {
    sessionCheckIn,
    mutation,
    endError,
    notice,
    dismissNotice,
    submitCheckIn,
    endCheckIn,
  };
};
