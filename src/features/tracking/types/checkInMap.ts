import type { CheckInFeature } from "@app/api/types/checkIn";
import type { UserCoordinates } from "./types";

export type CheckInMapMarker = {
  key: string;
  coordinate: UserCoordinates;
  properties: CheckInFeature["properties"];
};

export type CheckInStatusAppearance = {
  backgroundColor: string;
  iconColor: string;
  label: string;
  visible: boolean;
};
