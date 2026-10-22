import type { CheckInFeature, CreateDemoCheckInResponse } from "@app/api/types/checkIn";
import type { UserCoordinates } from "./types";

export type CheckInAction = "create" | "end" | "load";
export type CheckInMutation = "create" | "end" | null;

export type CheckInDraftValues = Record<
  | "category"
  | "drone"
  | "duration"
  | "height"
  | "mission"
  | "range"
  | "weight",
  string
>;

export type DemoCheckInRecord = CreateDemoCheckInResponse & {
  values: CheckInDraftValues;
};

export type CheckInMapMarker = {
  key: string;
  coordinate: UserCoordinates;
  properties: CheckInFeature["properties"];
};
