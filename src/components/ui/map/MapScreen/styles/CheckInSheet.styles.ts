import { StyleSheet } from "react-native";

import { colors, typography } from "@/theme";

export const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.checkInBackdrop,
  },
  createListButton: {
    alignSelf: "flex-end",
    borderRadius: 28,
    height: 56,
    marginTop: 0,
    width: 200,
  },
  createListButtonCompact: {
    borderRadius: 24,
    height: 48,
    width: 180,
  },
  buttonSpacer: {
    flex: 1,
    minHeight: 8,
  },
  dropdownStack: {
    gap: 14,
    zIndex: 2,
  },
  dropdownStackCompact: {
    gap: 7,
  },
  fieldCell: {
    width: "31%",
  },
  fieldGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 8,
    rowGap: 14,
    justifyContent: "space-between",
    paddingTop: 22,
    zIndex: 1,
  },
  fieldGridCompact: {
    paddingTop: 14,
    rowGap: 10,
  },
  formError: {
    color: colors.text6,
    fontFamily: typography.interRegular,
    fontSize: 14,
    marginTop: 12,
    textAlign: "right",
  },
  gestureRoot: {
    flex: 1,
  },
  handle: {
    backgroundColor: colors.pressableActive2,
    borderRadius: 3,
    height: 6,
    width: 225,
  },
  handleTouchArea: {
    alignItems: "center",
    height: 30,
    justifyContent: "flex-start",
  },
  handleTouchAreaCompact: {
    height: 20,
  },
  inputSuffix: {
    fontFamily: typography.interRegular,
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 2,
  },
  inputValueRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
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
  outlinedInputWithSuffix: {
    flexGrow: 0,
    flexShrink: 1,
    maxWidth: "70%",
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
  sheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: "60%",
    paddingHorizontal: 36,
    paddingTop: 6,
  },
  sheetContent: {
    flex: 1,
  },
  sheetContentCompact: {
    gap: 0,
  },
  sheetDark: {
    backgroundColor: colors.backgroundMain,
  },
  sheetLight: {
    backgroundColor: colors.checkInLightSurface,
  },
  title: {
    fontFamily: typography.interBold,
    fontSize: 30,
    marginBottom: 22,
  },
  titleCompact: {
    marginBottom: 10,
  },
});
