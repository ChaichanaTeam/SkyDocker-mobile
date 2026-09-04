import {
  sizeStyles,
  styles,
  variantStyles,
} from "@/components/shared/ui/Button/Button.styles";
import { CommonButtonProps } from "@/components/shared/ui/Button/Button.types";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

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
  activeOpacity = 0.8,
}: CommonButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        sizeStyles[size],
        variantStyles[variant].container,
        isDisabled && styles.disabled,
        style,
      ]}
      disabled={isDisabled}
      onPress={onPress}
      activeOpacity={activeOpacity}
      hitSlop={hitSlop}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles[variant].text.color} />
      ) : children ? (
        children
      ) : (
        <Text style={[styles.text, variantStyles[variant].text]}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};
