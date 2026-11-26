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
    opacity: 1,
    shadowColor: colors.checkInShadow,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    width: 200,
  },
  actionFooter: {
    paddingTop: 20,
  },
  createListButtonCompact: {
    borderRadius: 24,
    height: 48,
    width: 180,
  },
  dropdownStack: {
    gap: 14,
    zIndex: 2,
  },
  dropdownStackOpen: {
    elevation: 12,
    zIndex: 20,
  },
  dropdownStackCompact: {
    gap: 7,
  },
  fieldCell: {
    width: "30%",
  },
  fieldCellOpen: {
    zIndex: 20,
  },
  fieldGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 0,
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
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: "60%",
    paddingHorizontal: 36,
    paddingTop: 6,
  },
  sheetContent: {
    flexGrow: 1,
  },
  sheetContentCompact: {
    gap: 0,
  },
  sheetDark: {
    backgroundColor: colors.backgroundMain,
  },
  sheetLight: {
    backgroundColor: colors.main1,
  },
  title: {
    fontFamily: typography.interBold,
    fontSize: 30,
    marginBottom: 22,
    marginLeft: 8,
  },
  titleCompact: {
    marginBottom: 10,
  },
});
