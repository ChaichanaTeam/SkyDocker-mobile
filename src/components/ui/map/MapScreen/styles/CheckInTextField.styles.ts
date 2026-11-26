import { StyleSheet } from "react-native";

import { colors, typography } from "@/theme";

export const styles = StyleSheet.create({
  inputSuffix: {
    fontFamily: typography.interRegular,
    fontSize: 16,
    lineHeight: 20,
    position: "absolute",
    right: 12,
  },
  inputSuffixDark: {
    color: colors.text2,
  },
  inputSuffixLight: {
    color: colors.checkInLightText,
  },
  inputValueRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  fieldContainer: {
    width: "100%",
  },
  fieldLabel: {
    color: colors.checkInLightText,
    fontFamily: typography.interRegular,
    fontSize: 14,
    marginBottom: 5,
  },
  outlinedInput: {
    backgroundColor: colors.checkInLightSurface,
    borderRadius: 10,
    elevation: 2,
    flex: 1,
    fontFamily: typography.interRegular,
    fontSize: 14,
    height: 48,
    minWidth: 0,
    paddingHorizontal: 8,
    shadowColor: colors.checkInShadow,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    textAlign: "center",
  },
  outlinedInputCompact: {
    height: 44,
  },
  outlinedInputDark: {
    color: colors.text2,
  },
  outlinedInputLight: {
    color: colors.checkInLightText,
  },
  outlinedInputLocked: {
    opacity: 1,
  },
  outlinedInputWithSuffix: {
    paddingHorizontal: 32,
  },
});
