import type { MapBottomBarItem } from "../types/types";

export const MAP_BOTTOM_BAR_ITEMS = [
  {
    accessibilityLabel: "Create a check-in",
    key: "checkIn",
  },
  {
    accessibilityLabel: "Recenter map on current location",
    key: "map",
  },
  {
    accessibilityLabel: "Preview profile tab",
    key: "profile",
  },
] as const satisfies readonly MapBottomBarItem[];
