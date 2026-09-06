import { apiRequest } from "@app/api/client";
import { DEMO_CHECK_IN_CONFIG } from "@app/api/endpoints-config";

export const triggerDemoCheckIn = async (): Promise<void> => {
  await apiRequest<unknown>(DEMO_CHECK_IN_CONFIG.CREATE(), {
    method: "POST",
    requiresAuth: false,
  });
};
