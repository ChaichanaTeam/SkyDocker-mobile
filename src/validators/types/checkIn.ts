import type { CheckInPreview } from "@app/api/types/checkIn";

export type CheckInPoint = {
  longitude: number;
  latitude: number;
};

export type PilotContact = {
  phone_number: string | null;
};

export type ReceivedCheckInPreview = CheckInPreview & {
  receivedAt: number;
};
