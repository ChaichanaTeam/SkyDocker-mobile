import type { CheckInStatus } from "@app/api/types/checkIn";
import type { CheckInStatusAppearance } from "@features/tracking/types/checkInMap";

export const CHECK_IN_STATUS_CONFIG = {
  created: { backgroundColor: "#FF7700", iconColor: "#1F2937", label: "Created", visible: true },
  pending: { backgroundColor: "#2F80ED", iconColor: "#FFFFFF", label: "Pending", visible: true },
  active: { backgroundColor: "#F1F906", iconColor: "#1F2937", label: "Active", visible: true },
  late: { backgroundColor: "#78560E", iconColor: "#FFFFFF", label: "Overdue", visible: true },
  loss_of_control: { backgroundColor: "#7C29E2", iconColor: "#FFFFFF", label: "Must land", visible: true },
  accepted: { backgroundColor: "#43DD1D", iconColor: "#1F2937", label: "Confirmed", visible: true },
  unknown: { backgroundColor: "#9CA3AF", iconColor: "#1F2937", label: "Unknown", visible: true },
  cancelled: { backgroundColor: "#9CA3AF", iconColor: "#1F2937", label: "Cancelled", visible: false },
  ended_intime: { backgroundColor: "#9CA3AF", iconColor: "#1F2937", label: "Ended", visible: false },
  late_end: { backgroundColor: "#9CA3AF", iconColor: "#1F2937", label: "Ended late", visible: false },
} as const satisfies Record<CheckInStatus, CheckInStatusAppearance>;

export const CHECK_IN_MAP_DEBOUNCE_MS = 300;
export const CHECK_IN_MAP_REFRESH_MS = 30_000;
