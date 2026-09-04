import {
  ButtonSize,
  ButtonVariant,
} from "@/components/shared/ui/Button/Button.types";
import { colors } from "@/theme";
import { StyleSheet, TextStyle, ViewStyle } from "react-native";

export const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});

export const variantStyles: Record<
  ButtonVariant,
  { container: ViewStyle; text: TextStyle }
> = {
  primary: {
    container: { backgroundColor: colors.pressableActive3 },
    text: { color: colors.backgroundWhite },
  },
  secondary: {
    container: { backgroundColor: colors.pressableActive1 },
    text: { color: colors.backgroundWhite },
  },
  text: {
    container: {
      backgroundColor: "transparent",
      width: "auto",
      height: "auto",
      paddingVertical: 8,
      paddingHorizontal: 4,
    },
    text: { color: colors.text2 },
  },
};

export const sizeStyles: Record<ButtonSize, object> = {
  large: { width: 351, height: 64, borderRadius: 16 },
  small: { width: 87, height: 52, borderRadius: 28 },
};
