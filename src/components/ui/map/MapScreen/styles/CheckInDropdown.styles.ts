import { StyleSheet } from "react-native";

import { typography } from "@/theme";

export const styles = StyleSheet.create({
  dropdownMenu: {
    borderRadius: 8,
    borderWidth: 1,
    elevation: 8,
    left: 0,
    overflow: "hidden",
    position: "absolute",
    right: 0,
    top: 54,
    zIndex: 10,
  },
  dropdownMenuCompact: {
    top: 48,
  },
  dropdownOption: {
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 16,
  },
  dropdownOptionText: {
    fontFamily: typography.interRegular,
    fontSize: 15,
  },
  dropdownRoot: {
    zIndex: 2,
  },
  dropdownRootOpen: {
    zIndex: 12,
  },
  dropdownValue: {
    fontFamily: typography.interRegular,
    fontSize: 16,
    textAlign: "center",
  },
  outlinedDropdown: {
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 54,
    paddingHorizontal: 16,
  },
  outlinedDropdownCompact: {
    minHeight: 48,
  },
  outlinedLabel: {
    fontFamily: typography.interRegular,
    fontSize: 14,
    left: 12,
    paddingHorizontal: 4,
    position: "absolute",
    top: -11,
    zIndex: 1,
  },
});
