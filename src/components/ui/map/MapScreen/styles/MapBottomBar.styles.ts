import { StyleSheet } from "react-native";

import { colors } from "@/theme";

export const styles = StyleSheet.create({
  bar: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.mapControlBackground,
    borderRadius: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 92,
    left: 22,
    overflow: "hidden",
    position: "absolute",
    right: 22,
  },
  iconWrap: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
  item: {
    alignItems: "center",
    flexBasis: "33.333333%",
    height: "100%",
    justifyContent: "center",
    width: "33.333333%",
  },
  itemActive: {
    backgroundColor: colors.pressableActive1,
    borderRadius: 48,
  },
});
