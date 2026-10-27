import type { CHECK_IN_STATUSES } from "@app/api/constants/checkIn";

export type FlyingPrivilege = "a1" | "a2" | "a3" | "sts01" | "sts02";

export type CreateDemoCheckInRequest = {
  lon: number;
  lat: number;
  flying_privilege: FlyingPrivilege;
  description: null;
  height: number;
  range: number;
  time: number;
  starts_at: string;
};

export type CreateDemoCheckInResponse = {
  message: string;
  id: number;
  pilot_id: number;
  drone_id: number;
  cancelled: number;
  point: [number, number];
  h3_index: string;
};

export type CheckInStatus = (typeof CHECK_IN_STATUSES)[number];

export type CheckInFeature = {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: {
    country_id: number;
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

export type EndDemoCheckInResponse = {
  message: string;
  id: number;
  status: "ended_intime" | "late_end";
};
