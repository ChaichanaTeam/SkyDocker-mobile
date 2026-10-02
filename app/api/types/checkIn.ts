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
  ends_at: string;
};

export type CreateDemoCheckInResponse = {
  message: string;
  id: number;
  pilot_id: number;
  point: [number, number];
  h3_index: string;
};
