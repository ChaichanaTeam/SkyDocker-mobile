import type { FlyingPrivilege } from "@app/api/types/checkIn";
import type { CheckInDraftValues } from "@features/tracking";

export type ValidatedCheckInDraft = {
  category: FlyingPrivilege;
  durationMinutes: number;
  height: number;
  range: number;
  values: CheckInDraftValues;
};
