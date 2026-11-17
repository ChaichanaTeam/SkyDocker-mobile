import { StyleSheet } from "react-native";

import { colors, typography } from "@/theme";

export const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    bottom: 0,
    elevation: 12,
    left: 0,
    overflow: "hidden",
    paddingHorizontal: 24,
    position: "absolute",
    right: 0,
    shadowColor: colors.startupLogo,
    shadowOffset: { height: -3, width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    zIndex: 10,
  },
  handleTouchArea: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 42,
  },
  handle: {
    borderRadius: 3,
    height: 5,
    width: 72,
  },
  signContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.16,
  },
  content: {
    gap: 16,
    paddingBottom: 14,
    paddingTop: 4,
  },
  contentScroll: {
    flexGrow: 0,
  },
  singleZone: {
    gap: 22,
  },
  zoneCount: {
    color: colors.textPrimary,
    fontFamily: typography.interBold,
    fontSize: 16,
    textAlign: "center",
  },
  layer: {
    gap: 10,
    paddingBottom: 16,
    borderBottomColor: colors.textPrimary,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  layerLabel: {
    fontFamily: typography.interBold,
    fontSize: 16,
    textAlign: "center",
  },
  summaryRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  summaryCell: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    minWidth: 0,
    paddingHorizontal: 6,
  },
  summaryText: {
    color: colors.textPrimary,
    fontFamily: typography.interBold,
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
  },
  description: {
    color: colors.textPrimary,
    fontFamily: typography.interBold,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
});
