import { apiRequest } from "@app/api/client";
import { DEMO_CHECK_IN_CONFIG } from "@app/api/endpoints-config";
import type {
  CreateDemoCheckInRequest,
  CreateDemoCheckInResponse,
} from "@app/api/types/checkIn";

export const createDemoCheckIn = async (
  payload: CreateDemoCheckInRequest,
): Promise<CreateDemoCheckInResponse> => {
  return apiRequest<CreateDemoCheckInResponse>(DEMO_CHECK_IN_CONFIG.CREATE(), {
    method: "POST",
    body: payload,
    requiresAuth: false,
  });
};
