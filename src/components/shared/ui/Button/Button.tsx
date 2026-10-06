import {
  sizeStyles,
  styles,
  variantStyles,
} from "@/components/shared/ui/Button/Button.styles";
import { CommonButtonProps } from "@/components/shared/ui/Button/Button.types";
import { ActivityIndicator, Pressable, Text } from "react-native";

export const Button = ({
  text,
  children,
  variant = "primary",
  size = "large",
  disabled,
  style,
  hitSlop,
  onPress,
  loading,
}: CommonButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={(state) => [
        styles.base,
        sizeStyles[size],
        variantStyles[variant].container,
        isDisabled && styles.disabled,
        state.pressed && !isDisabled && { opacity: 0.8 },
        typeof style === "function" ? style(state) : style,
      ]}
      disabled={isDisabled}
      onPress={onPress}
      hitSlop={hitSlop}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles[variant].text.color} />
      ) : children ? (
        children
      ) : (
        <Text style={[styles.text, variantStyles[variant].text]}>{text}</Text>
      )}
    </Pressable>
  );
};
