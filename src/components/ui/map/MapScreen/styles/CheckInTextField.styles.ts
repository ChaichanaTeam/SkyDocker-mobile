import { StyleSheet } from "react-native";

import { colors, typography } from "@/theme";

export const styles = StyleSheet.create({
  inputSuffix: {
    fontFamily: typography.interRegular,
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 2,
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
    paddingHorizontal: 8,
  },
  outlinedField: {
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 54,
  },
  outlinedFieldCompact: {
    minHeight: 48,
  },
  outlinedFieldDark: {
    backgroundColor: colors.backgroundMain,
    borderColor: colors.text1,
  },
  outlinedFieldLight: {
    backgroundColor: colors.checkInLightSurface,
    borderColor: colors.checkInLightFieldBorder,
  },
  outlinedInput: {
    backgroundColor: "transparent",
    fontFamily: typography.interRegular,
    fontSize: 16,
    height: 50,
    minWidth: 0,
    paddingHorizontal: 0,
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
  outlinedInputWithSuffix: {
    flexGrow: 0,
    flexShrink: 1,
    maxWidth: "70%",
  },
  outlinedLabel: {
    color: colors.text1,
    fontFamily: typography.interRegular,
    fontSize: 14,
    left: 12,
    paddingHorizontal: 4,
    position: "absolute",
    top: -11,
    zIndex: 1,
  },
  outlinedLabelDark: {
    backgroundColor: colors.backgroundMain,
  },
  outlinedLabelLight: {
    backgroundColor: colors.checkInLightSurface,
  },
});
