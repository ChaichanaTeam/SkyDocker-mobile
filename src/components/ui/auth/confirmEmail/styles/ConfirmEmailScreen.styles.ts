import { colors } from "@/theme";
import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: Platform.OS === "android" ? 72 : 84,
    paddingBottom: 62,
  },
  header: {
    marginTop: 56,
  },
  title: {
    color: colors.text2,
    fontFamily: "Inter_600SemiBold",
    fontSize: 36,
    fontWeight: "600",
    letterSpacing: 0,
  },
  subtitle: {
    marginTop: 8,
    color: colors.text3,
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    letterSpacing: 0,
  },
  codeRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 89,
  },
  codeInput: {
    flex: 1,
    height: 64,
    width:48,
    borderRadius: 8,
    backgroundColor: "#FFFDFD",
    color: colors.pressableActive1,
    fontFamily: "Inter_600SemiBold",
    fontSize: 32,
    fontWeight: "600",
    letterSpacing: 0,
    padding: 0,
    textAlign: "center",
    textAlignVertical: "center",
  },
  centerBackButton: {
    alignSelf: "center",
    marginTop: 43,
    padding: 8,
  },
  centerBackText: {
    color: colors.text1,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    letterSpacing: 0,
  },
  bottomRow: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bottomBackText: {
    color: colors.text2,
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    letterSpacing: 0,
  },
  nextButton: {
    height: 52,
    width:87,
    paddingHorizontal: 22,
    borderRadius: 24,
    backgroundColor: colors.pressableActive1,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: colors.text2,
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    letterSpacing: 0,
  },
});
