import { StyleSheet } from "react-native";

import { colors, typography } from "@/theme";

export const tabsStyles = StyleSheet.create({
  container: {
    alignSelf: "center",
    borderColor: colors.main3,
    borderRadius: 28,
    borderWidth: 1,
    flexDirection: "row",
    height: 32,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  tab: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  tabDivider: {
    borderLeftColor: colors.main3,
    borderLeftWidth: 1,
  },
  tabActive: {
    backgroundColor: colors.pressableActive1,
  },
  text: {
    color: "#1B2340",
    fontFamily: typography.interRegular,
    fontSize: 15,
    fontWeight: "800",
  },
  textActive: {
    color: "#FFFFFF",
  },
});
