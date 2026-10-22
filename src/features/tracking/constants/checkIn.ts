import type { CheckInStatus } from "@app/api/types/checkIn";

export const OPEN_CHECK_IN_STATUSES = new Set<CheckInStatus>([
  "created", "pending", "accepted", "active", "late", "loss_of_control", 
]);

export const CHECK_IN_MAP_DEBOUNCE_MS = 300;
