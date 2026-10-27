import type { CheckInDraftValues, CheckInMutation, DemoCheckInRecord } from "./demoCheckIn";
import type { UserCoordinates } from "./types";

export type UseDemoCheckInsParams = {
  getFreshCoordinates: () => Promise<UserCoordinates>;
  onChanged: () => void;
};

export type UseDemoCheckInsResult = {
  sessionCheckIn: DemoCheckInRecord | null;
  mutation: CheckInMutation;
  endError: string | null;
  notice: string | null;
  dismissNotice: () => void;
  submitCheckIn: (values: CheckInDraftValues) => Promise<void>;
  endCheckIn: () => Promise<void>;
};
