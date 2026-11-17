import { apiRequest } from "@app/api/client";
import { PILOTS_CONFIG } from "@app/api/endpoints-config";
import { parsePilotDocuments, parsePilotProfile } from "@app/api/validators/response";
import {
  PilotDocument,
  PilotProfile,
  UpdateProfilePayload,
} from "@app/api/types/pilots";

export const getMyProfile = (): Promise<PilotProfile> =>
  apiRequest(PILOTS_CONFIG.ME(), { method: "GET" }, parsePilotProfile);

export const updateMyProfile = (
  payload: UpdateProfilePayload,
): Promise<PilotProfile> =>
  apiRequest(PILOTS_CONFIG.UPDATE_ME(), {
    method: "PATCH",
    body: payload,
  }, parsePilotProfile);

export const getMyDocuments = (): Promise<PilotDocument[]> =>
  apiRequest(PILOTS_CONFIG.DOCUMENTS(), { method: "GET" }, parsePilotDocuments);
