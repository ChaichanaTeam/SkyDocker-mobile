import type { ComponentProps } from "react";
import type { Ionicons } from "@expo/vector-icons";
import type { MapType } from "react-native-maps";

export type MapAppearance = "light" | "dark";
export type SessionMapType = Extract<MapType, "standard" | "satellite">;
export type ControlIconName = ComponentProps<typeof Ionicons>["name"];

export type MapControlButtonProps = {
  accessibilityLabel: string;
  isActive?: boolean;
  iconName: ControlIconName;
  onPress: () => void;
};
