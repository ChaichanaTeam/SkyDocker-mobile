import type { CheckInDraftValues, DemoCheckInRecord } from "./demoCheckIn";
import type { UserCoordinates } from "./types";

export type UseDemoCheckInsParams = {
  getFreshCoordinates: () => Promise<UserCoordinates>;
};

export type UseDemoCheckInsResult = {
  checkIns: readonly DemoCheckInRecord[];
  submitCheckIn: (values: CheckInDraftValues) => Promise<void>;
};
