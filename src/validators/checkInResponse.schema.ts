import { CHECK_IN_STATUSES } from "@app/api/constants/checkIn";
import type {
  CheckInCollection,
  CheckInFeature,
  CreateDemoCheckInResponse,
  EndDemoCheckInResponse,
} from "@app/api/types/checkIn";
import type { ApiError } from "@app/api/types/apiError";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isInteger = (value: unknown, minimum = 1): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= minimum;

const isPoint = (value: unknown): value is [number, number] =>
  Array.isArray(value) && value.length === 2 &&
  typeof value[0] === "number" && Number.isFinite(value[0]) && Math.abs(value[0]) <= 180 &&
  typeof value[1] === "number" && Number.isFinite(value[1]) && Math.abs(value[1]) <= 90;

const invalidResponse = (): ApiError => ({
  kind: "invalid-response",
  status: 0,
  message: "The server returned an unexpected check-in response.",
});

export const parseCreatedCheckIn = (value: unknown): CreateDemoCheckInResponse => {
  if (!isRecord(value) || !isInteger(value.id) || !isInteger(value.pilot_id) ||
      !isInteger(value.drone_id) || !isInteger(value.cancelled, 0) ||
      !isPoint(value.point) || typeof value.h3_index !== "string" ||
      typeof value.message !== "string") {
    throw invalidResponse();
  }
  return value as CreateDemoCheckInResponse;
};

const isFeature = (value: unknown): value is CheckInFeature => {
  if (!isRecord(value) || value.type !== "Feature" ||
      !isRecord(value.geometry) || value.geometry.type !== "Point" ||
      !isPoint(value.geometry.coordinates) || !isRecord(value.properties)) return false;

  const properties = value.properties;
  return isInteger(properties.country_id) && typeof properties.country === "string" &&
    typeof properties.contact === "string" && isInteger(properties.range) &&
    isInteger(properties.height) && isInteger(properties.time) &&
    typeof properties.start_at === "string" && Number.isFinite(Date.parse(properties.start_at)) &&
    CHECK_IN_STATUSES.some(status => status === properties.status);
};

export const parseCheckInCollection = (value: unknown): CheckInCollection => {
  if (!isRecord(value) || value.type !== "FeatureCollection" ||
      !Array.isArray(value.features) || !value.features.every(isFeature)) {
    throw invalidResponse();
  }
  return { type: "FeatureCollection", features: value.features };
};

export const parseEndedCheckIn = (value: unknown, id: number): EndDemoCheckInResponse => {
  if (!isRecord(value) || value.id !== id || typeof value.message !== "string" ||
      (value.status !== "ended_intime" && value.status !== "late_end")) {
    throw invalidResponse();
  }
  return value as EndDemoCheckInResponse;
};
