import type { CheckInFeature } from "@app/api/types/checkIn";

export type CheckInDraftValues = {
  drone: string;
  mission: string;
  category: string;
  height: string;
  range: string;
  duration: string;
  weight: string;
};

export type MissionOption = {
  id: number;
  droneId: number | null;
  label: string;
};
export type DroneOption = {
  id: number;
  label: string;
  weightG: number;
  maxHeightM: number;
  maxRangeM: number;
};
export type CheckInMutation = "preview" | "create" | "end";
export type CachedCustomDrone = { weight: string; drone: DroneOption };

export type CheckInSession = {
  active: CheckInFeature | null;
  create: (
    values: CheckInDraftValues,
    onCustomDroneCreated?: (drone: DroneOption) => void,
  ) => Promise<void>;
  drones: DroneOption[];
  error: string | null;
  finish: () => Promise<void>;
  invalidatePreview: () => void;
  loading: boolean;
  missions: MissionOption[];
  mutation: CheckInMutation | null;
  phone: string | null;
  privileges: string[];
  refreshActive: () => Promise<CheckInFeature | null>;
  uncertain: boolean;
};
