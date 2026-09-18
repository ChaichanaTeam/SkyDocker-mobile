import type { UserCoordinates } from "./types";

export type CheckInDraftValues = Record<
  | "category"
  | "drone"
  | "duration"
  | "height"
  | "mission"
  | "range"
  | "start"
  | "weight",
  string
>;

export type DemoCheckInRecord = {
  coordinate: UserCoordinates;
  createdAt: number;
  id: string;
  values: CheckInDraftValues;
};
