import { useCallback, useState } from "react";

import { triggerDemoCheckIn } from "@app/api/services/checkIn.service";
import { isApiError } from "@app/api/types/apiError";

import type {
  CheckInDraftValues,
  DemoCheckInRecord,
} from "../types/demoCheckIn";
import type { UserCoordinates } from "../types/types";

export type UseDemoCheckInsParams = {
  onMissingLocation: () => void;
  userCoordinates: UserCoordinates | null;
};

export type UseDemoCheckInsResult = {
  checkIns: readonly DemoCheckInRecord[];
  submitCheckIn: (values: CheckInDraftValues) => Promise<void>;
};

export const useDemoCheckIns = ({
  onMissingLocation,
  userCoordinates,
}: UseDemoCheckInsParams): UseDemoCheckInsResult => {
  const [checkIns, setCheckIns] = useState<DemoCheckInRecord[]>([]);

  const submitCheckIn = useCallback(
    async (values: CheckInDraftValues): Promise<void> => {
      if (!userCoordinates) {
        onMissingLocation();
        throw new Error(
          "Current location is required to create a check-in. Please try again.",
        );
      }

      try {
        await triggerDemoCheckIn();
      } catch (error: unknown) {
        if (isApiError(error)) {
          throw new Error("Could not create check-in. Please try again.");
        }

        throw error;
      }

      const coordinate = userCoordinates;
      const createdAt = Date.now();

      setCheckIns((currentCheckIns) => [
        ...currentCheckIns,
        {
          coordinate,
          createdAt,
          id: `check-in-${createdAt}-${currentCheckIns.length + 1}`,
          values,
        },
      ]);
    },
    [onMissingLocation, userCoordinates],
  );

  return {
    checkIns,
    submitCheckIn,
  };
};
