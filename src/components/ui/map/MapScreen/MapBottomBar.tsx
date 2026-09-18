import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { colors } from "@/theme";
import { DroneIcon, UserIcon } from "@assets/icons";

import { MAP_BOTTOM_BAR_ITEMS } from "./constants/mapBottomBar";
import { styles } from "./styles/MapBottomBar.styles";

import type { MapBottomBarItem, MapBottomBarProps } from "./types/types";

export const MapBottomBar = ({
  activeItem,
  bottomInset,
  onCheckInPress,
  onMapPress,
  onProfilePress,
}: MapBottomBarProps) => {
  const getItemPressHandler = (
    item: MapBottomBarItem,
  ): (() => void) => {
    if (item.key === "checkIn") {
      return onCheckInPress;
    }

    if (item.key === "map") {
      return onMapPress;
    }

    return onProfilePress;
  };

  return (
    <View style={[styles.bar, { bottom: Math.max(bottomInset + 12, 18) }]}>
      {MAP_BOTTOM_BAR_ITEMS.map((item) => {
        const isActive = activeItem === item.key;
        const iconColor = isActive
          ? colors.pressableActive3
          : colors.pressableActive2;

        return (
          <Pressable
            accessibilityLabel={item.accessibilityLabel}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            key={item.key}
            onPress={getItemPressHandler(item)}
            style={[styles.item, isActive && styles.itemActive]}
          >
            <View style={styles.iconWrap}>
              {item.key === "checkIn" ? (
                <DroneIcon color={iconColor} height={24} width={25} />
              ) : null}
              {item.key === "map" ? (
                <Ionicons
                  color={iconColor}
                  name="map-outline"
                  size={28}
                />
              ) : null}
              {item.key === "profile" ? (
                <UserIcon color={iconColor} height={21} width={16} />
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};
