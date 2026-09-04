import { ReactNode } from "react";
import { Insets, StyleProp, TextStyle, ViewStyle } from "react-native";

export type ButtonVariant = "primary" | "secondary" | "text";
export type ButtonSize = "large" | "small";

export type CommonButtonProps = {
  text?: string;
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: string;
  disabled?: boolean;
  activeOpacity?: number;
  loading?: boolean;
  hitSlop?: Insets;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
};
