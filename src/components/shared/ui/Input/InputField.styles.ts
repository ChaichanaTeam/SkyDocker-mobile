import { InputSize } from "@/components/shared/ui/Input/InputField.types";
import { colors } from "@/theme";
import { StyleSheet, TextStyle } from "react-native";

export const styles = StyleSheet.create({
  base: {
    fontFamily: "Inter_600SemiBold",
    padding: 0,
  },
  disabled: {
    opacity: 0.5,
  },
});

export const sizeStyles: Record<InputSize, TextStyle> = {
  large: {
    height: 36,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.backgroundWhite,
    textAlign: "left",
  },
  small: {
    height: 64,
    width: 48,
    borderRadius: 8,
    backgroundColor: "#FFFDFD",
    color: colors.pressableActive1,
    fontSize: 32,
    textAlign: "center",
    textAlignVertical: "center",
  },
};
