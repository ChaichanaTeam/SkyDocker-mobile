import { StyleSheet } from "react-native";

import { colors, typography } from "@/theme";

export const styles = StyleSheet.create({
  keyboardContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.backgroundWhite,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: "100%",
    width: "100%",
    shadowColor: colors.startupLogo,
    shadowOffset: { height: -2, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 12,
  },
  handle: {
    alignSelf: "center",
    backgroundColor: colors.pressableActive1,
    borderRadius: 3,
    height: 5,
    marginTop: 12,
    width: 120,
  },
  handleTouchArea: {
    height: 32,
    zIndex: 2,
  },

  collapsed: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 24,
    paddingTop: 44,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryText: {
    color: "#000000",
    fontFamily: typography.interRegular,
    fontSize: 15,
    fontWeight: "700",
  },
  summaryLabel: {
    color: "#6B6B6B",
    fontWeight: "600",
  },
  droneName: {
    color: "#000000",
    fontFamily: typography.interRegular,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 18,
    textAlign: "center",
  },

  expanded: {
    ...StyleSheet.absoluteFillObject,
    paddingBottom: 16,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  formScroll: {
    flex: 1,
    marginTop: 16,
  },
  formScrollContent: {
    flexGrow: 1,
    paddingBottom: 8,
  },
  actions: {
    borderColor: colors.main3,
    borderRadius: 28,
    borderWidth: 1,
    flexDirection: "row",
    overflow: "hidden",
    height: 52,
  },
  action: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingHorizontal: 4,
    height: "100%",
    borderRadius: 0,
  },
  actionDivider: {
    borderLeftColor: colors.main3,
    borderLeftWidth: 1,
  },
  actionText: {
    color: colors.text5,
    fontFamily: typography.interRegular,
    fontSize: 16,
    fontWeight: "700",
  },
  actionTextEmphasized: {
    color: colors.startupLogo,
    fontWeight: "800",
  },
  imageCard: {
    alignItems: "center",
    alignSelf: "center",
    borderColor: colors.mapControlBorder,
    borderRadius: 16,
    borderWidth: 1,
    height: 100,
    justifyContent: "center",
    marginTop: 16,
    width: 100,
  },
  specsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
    rowGap: 12,
  },
  specItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    width: "50%",
  },
  specText: {
    color: "#000000",
    fontFamily: typography.interRegular,
    fontSize: 13,
    fontWeight: "700",
  },
  currentMission: {
    color: "#000000",
    fontFamily: typography.interRegular,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 12,
  },
});
