import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

import { colors } from "@/theme";

import { styles } from "./styles/MapScreen.styles";

import type { MapControlButtonProps } from "./types/types";

export const MapControlButton = ({
  accessibilityLabel,
  iconName,
  isActive = false,
  onPress,
}: MapControlButtonProps) => (
  <TouchableOpacity
    accessibilityLabel={accessibilityLabel}
    accessibilityRole="button"
    activeOpacity={0.76}
    onPress={onPress}
    style={[
      styles.controlTouchable,
      isActive && styles.controlTouchableActive,
    ]}
  >
    <Ionicons
      color={isActive ? colors.mapControlTextActive : colors.mapControlText}
      name={iconName}
      size={22}
      style={styles.controlIcon}
    />
  </TouchableOpacity>
);
