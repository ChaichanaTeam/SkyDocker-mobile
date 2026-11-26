import type { CHECK_IN_STATUSES } from "@app/api/constants/checkIn";

export type CheckInStatus = (typeof CHECK_IN_STATUSES)[number];
type CheckInPreviewBase = {
  country_tag: string;
  home_point: { lon: number; lat: number };
};
type CheckInFlightProperties = {
  category: string;
  height: number;
  range: number;
  duration: number;
};
export type CheckInPreviewRequest = CheckInPreviewBase &
  (
    | { drone_id: number; mission_id: number }
    | ({ drone_id: number } & CheckInFlightProperties)
  );

export type CustomDroneCreateRequest = {
  custom_model: {
    manufacturer: string;
    model_name: string;
    speed: number;
    mtom: number;
    max_height: number;
    max_range: number;
  };
  serial_number: string;
  category: "pb";
  is_drone_modified: false;
};
export type CheckInPreview = { checkin_token: string; expires_in: number };
export type CheckInFeature = {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: {
    id: number;
    country_tag: string;
    country: string;
    status: CheckInStatus;
    contact: string;
    range: number;
    height: number;
    start_at: string;
    time: number;
  };
};
export type CheckInCollection = {
  type: "FeatureCollection";
  features: CheckInFeature[];
};
