import { StyleSheet } from "react-native";

export const socialButtonStyles = StyleSheet.create({
  button: {
    width: 351,
    height: 66,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    position: "absolute",
    left: 20,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: "#ffffff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    textAlign: "center",
  },
});
