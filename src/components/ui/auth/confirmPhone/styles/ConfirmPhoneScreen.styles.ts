import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#1E293B",
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
    color: "#E8EEFF",
    fontFamily: "Inter_600SemiBold",
    fontSize: 36,
    fontWeight: "600",
    letterSpacing: 0,
  },
  subtitle: {
    marginTop: 8,
    color: "#CAD4E380",
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
    borderRadius: 8,
    backgroundColor: "#FFFDFD",
    color: "#536BBA",
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
    color: "#6987E9",
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
    color: "#E8EEFF",
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    letterSpacing: 0,
  },
  nextButton: {
    height: 46,
    paddingHorizontal: 22,
    borderRadius: 24,
    backgroundColor: "#536BBA",
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: "#E8EEFF",
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    letterSpacing: 0,
  },
});
