import type { CheckInStatus } from "@app/api/types/checkIn";

type CheckInStatusAppearance = {
  backgroundColor: string;
  iconColor: string;
  label: string;
  visible: boolean;
};

export const CHECK_IN_STATUS_CONFIG = {
  created: { backgroundColor: "#FFFFFF", iconColor: "#1F2937", label: "Mission", visible: true },
  pending: { backgroundColor: "#FFFFFF", iconColor: "#1F2937", label: "Mission", visible: true },
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
