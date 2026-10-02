import { useCallback, useState } from "react";

import { createDemoCheckIn } from "@app/api/services/checkIn.service";
import { mapCheckInErrorToMessage } from "@features/tracking/mappers/checkInErrorMapper";
import { mapValidatedDraftToDemoCheckInRequest } from "@features/tracking/mappers/demoCheckInMapper";
import { validateCheckInDraft } from "@validators/checkIn.schema";

import type {
  CheckInDraftValues,
  DemoCheckInRecord,
} from "@features/tracking/types/demoCheckIn";
import type {
  UseDemoCheckInsParams,
  UseDemoCheckInsResult,
} from "@features/tracking/types/useDemoCheckIns";

export const useDemoCheckIns = ({
  getFreshCoordinates,
}: UseDemoCheckInsParams): UseDemoCheckInsResult => {
  const [checkIns, setCheckIns] = useState<DemoCheckInRecord[]>([]);

  const submitCheckIn = useCallback(
    async (values: CheckInDraftValues): Promise<void> => {
      try {
        const validatedDraft = validateCheckInDraft(values);
        const coordinate = await getFreshCoordinates();
        const submittedAt = new Date();
        const payload = mapValidatedDraftToDemoCheckInRequest(
          validatedDraft,
          coordinate,
          submittedAt,
        );

        await createDemoCheckIn(payload);

        setCheckIns((currentCheckIns) => [
          ...currentCheckIns,
          {
            coordinate,
            createdAt: submittedAt.getTime(),
            id: `check-in-${submittedAt.getTime()}-${
              currentCheckIns.length + 1
            }`,
            values: validatedDraft.values,
          },
        ]);
      } catch (error: unknown) {
        throw new Error(mapCheckInErrorToMessage(error));
      }
    },
    [getFreshCoordinates],
  );

  return {
    checkIns,
    submitCheckIn,
  };
};
