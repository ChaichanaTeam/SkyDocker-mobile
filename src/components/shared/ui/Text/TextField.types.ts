import { StyleProp, TextStyle } from "react-native";

export type TextVariant =
  | "title"
  | "subtitle"
  | "body"
  | "label"
  | "hint"
  | "error"
  | "link";

export type CommonTextProps = {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: string;
  style?: StyleProp<TextStyle>;
};
