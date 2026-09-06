import { StyleSheet } from "react-native";

import { colors, typography } from "@/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controlIcon: {
    textAlign: "center",
  },
  controlStack: {
    gap: 10,
    position: "absolute",
    right: 16,
  },
  controlTouchable: {
    alignItems: "center",
    backgroundColor: colors.mapControlBackground,
    borderColor: colors.mapControlBorder,
    borderRadius: 24,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    shadowColor: colors.startupLogo,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    width: 48,
  },
  controlTouchableActive: {
    backgroundColor: colors.mapControlBackgroundActive,
  },
  dronePin: {
    alignItems: "center",
    backgroundColor: colors.pressableActive1,
    borderColor: colors.text2,
    borderRadius: 8,
    borderWidth: 1,
    height: 38,
    justifyContent: "center",
    shadowColor: colors.startupLogo,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    width: 38,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  notice: {
    backgroundColor: colors.mapNoticeBackground,
    borderColor: colors.mapNoticeBorder,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    left: 16,
    padding: 14,
    position: "absolute",
    right: 16,
  },
  noticeAction: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.mapControlBackgroundActive,
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    minHeight: 38,
    paddingHorizontal: 12,
  },
  noticeActionText: {
    color: colors.mapControlTextActive,
    fontFamily: typography.interRegular,
    fontSize: 14,
  },
  noticeText: {
    color: colors.mapControlText,
    fontFamily: typography.interRegular,
    fontSize: 14,
    lineHeight: 20,
  },
});
