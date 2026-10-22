import { apiRequest } from "@app/api/client";
import { DEMO_CHECK_IN_CONFIG } from "@app/api/endpoints-config";
import type {
  CreateDemoCheckInRequest,
  CreateDemoCheckInResponse,
  CheckInCollection,
  EndDemoCheckInResponse,
} from "@app/api/types/checkIn";
import type { BoundingBox } from "@app/api/types/geoZone";
import {
  parseCheckInCollection,
  parseCreatedCheckIn,
  parseEndedCheckIn,
} from "@validators/checkInResponse.schema";

export const createDemoCheckIn = async (
  payload: CreateDemoCheckInRequest,
): Promise<CreateDemoCheckInResponse> => {
  const response = await apiRequest<unknown>(DEMO_CHECK_IN_CONFIG.CREATE(), {
    method: "POST",
    body: payload,
    requiresAuth: false,
  });
  return parseCreatedCheckIn(response);
};

export const fetchDemoCheckIns = async (
  boundingBox: BoundingBox,
): Promise<CheckInCollection> => {
  const params = new URLSearchParams({
    min_lon: String(boundingBox.min_lon),
    min_lat: String(boundingBox.min_lat),
    max_lon: String(boundingBox.max_lon),
    max_lat: String(boundingBox.max_lat),
  });
  const response = await apiRequest<unknown>(
    `${DEMO_CHECK_IN_CONFIG.BBOX()}?${params.toString()}`,
    { method: "GET", requiresAuth: false },
  );
  return parseCheckInCollection(response);
};

export const endDemoCheckIn = async (id: number): Promise<EndDemoCheckInResponse> => {
  const response = await apiRequest<unknown>(DEMO_CHECK_IN_CONFIG.END(id), {
    method: "POST",
    requiresAuth: false,
  });
  return parseEndedCheckIn(response, id);
};
