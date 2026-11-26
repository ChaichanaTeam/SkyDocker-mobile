import { StyleSheet } from "react-native";

import { colors, typography } from "@/theme";

export const styles = StyleSheet.create({
  dropdownMenu: {
    borderRadius: 8,
    borderWidth: 1,
    elevation: 8,
    left: 0,
    marginTop: 8,
    maxHeight: 220,
    overflow: "hidden",
    position: "absolute",
    right: 0,
    top: "100%",
    zIndex: 30,
    shadowColor: colors.checkInShadow,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
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
    position: "relative",
    zIndex: 2,
  },
  dropdownRootOpen: {
    elevation: 12,
    zIndex: 12,
  },
  dropdownValue: {
    flex: 1,
    fontFamily: typography.interRegular,
    fontSize: 14,
    textAlign: "left",
  },
  dropdownCategoryValue: {
    fontSize: 14,
    textAlign: "center",
  },
  dropdownTrigger: {
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 8,
    shadowColor: colors.checkInShadow,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  outlinedDropdownCompact: {
    minHeight: 44,
  },
  fieldLabel: {
    color: colors.checkInLightText,
    fontFamily: typography.interRegular,
    fontSize: 14,
    marginBottom: 5,
  },
});
