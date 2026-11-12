import { apiRequest } from "@app/api/client";
import { PILOTS_CONFIG } from "@app/api/endpoints-config";
import {
  PilotDocument,
  PilotProfile,
  UpdateProfilePayload,
} from "@app/api/types/pilots";

export const getMyProfile = (): Promise<PilotProfile> =>
  apiRequest<PilotProfile>(PILOTS_CONFIG.ME(), { method: "GET" });

export const updateMyProfile = (
  payload: UpdateProfilePayload,
): Promise<PilotProfile> =>
  apiRequest<PilotProfile>(PILOTS_CONFIG.UPDATE_ME(), {
    method: "PATCH",
    body: payload,
  });

export const getMyDocuments = (): Promise<PilotDocument[]> =>
  apiRequest<PilotDocument[]>(PILOTS_CONFIG.DOCUMENTS(), { method: "GET" });
