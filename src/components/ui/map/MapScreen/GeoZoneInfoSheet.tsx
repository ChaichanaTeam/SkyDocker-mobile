import { useCallback, useEffect } from "react";
import {
  BackHandler,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import type { AccessibilityActionEvent } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  getGeoZoneCardStyle,
  isProhibitedGeoZoneType,
  normalizeGeoZoneType,
} from "@/utils/geoZoneStyle";
import { NoEntry } from "@assets/icons";

import {
  GEO_ZONE_DESCRIPTION,
  GEO_ZONE_RESTRICTION,
  GEO_ZONE_TYPE_CODE_PATTERN,
} from "./constants/geoZoneInfoSheet";
import { useCheckInSheetGesture } from "./hooks/useCheckInSheetGesture";
import { styles } from "./styles/GeoZoneInfoSheet.styles";
import type { GeoZoneInfoSheetProps } from "./types/types";

export const GeoZoneInfoSheet = ({ zone, onClose }: GeoZoneInfoSheetProps) => {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const { dragGesture, handleSheetLayout, sheetAnimatedStyle } =
    useCheckInSheetGesture({
      isVisible: zone !== null,
      onClose,
      resetKey: zone,
      windowHeight,
    });

  useEffect(() => {
    if (!zone) return;

    const backSubscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onClose();
        return true;
      },
    );

    return () => backSubscription.remove();
  }, [onClose, zone]);

  const handleAccessibilityAction = useCallback(
    (event: AccessibilityActionEvent): void => {
      if (event.nativeEvent.actionName === "dismiss") onClose();
    },
    [onClose],
  );

  if (!zone) return null;

  const zoneType = zone.properties.type;
  const normalizedZoneType = normalizeGeoZoneType(zoneType);
  const displayZoneType = GEO_ZONE_TYPE_CODE_PATTERN.test(normalizedZoneType)
    ? normalizedZoneType
    : zoneType;
  const cardStyle = getGeoZoneCardStyle(zoneType);

  return (
    <Animated.View
      onLayout={handleSheetLayout}
      style={[
        styles.sheet,
        {
          backgroundColor: cardStyle.backgroundColor,
          maxHeight: windowHeight * 0.65,
          paddingBottom: Math.max(insets.bottom, 16),
        },
        sheetAnimatedStyle,
      ]}
    >
      {isProhibitedGeoZoneType(zoneType) ? (
        <View pointerEvents="none" style={styles.signContainer}>
          <NoEntry height={176} width={176} />
        </View>
      ) : null}
      <GestureDetector gesture={dragGesture}>
        <Pressable
          accessibilityActions={[
            { label: "Dismiss geo-zone information", name: "dismiss" },
          ]}
          accessibilityHint="Tap or swipe down to close geo-zone information"
          accessibilityLabel="Close geo-zone information"
          accessibilityRole="button"
          onAccessibilityAction={handleAccessibilityAction}
          onPress={onClose}
          style={styles.handleTouchArea}
        >
          <View
            style={[styles.handle, { backgroundColor: cardStyle.accentColor }]}
          />
        </Pressable>
      </GestureDetector>
      <ScrollView
        contentContainerStyle={styles.content}
        style={[
          styles.contentScroll,
          {
            maxHeight:
              windowHeight * 0.65 - Math.max(insets.bottom, 16) - 42,
          },
        ]}
      >
        <View style={styles.summaryRow}>
          <View style={styles.summaryCell}>
            <Text style={styles.summaryText}>
              Zone type: {displayZoneType}
            </Text>
          </View>
          <View style={styles.summaryCell}>
            <Text style={styles.summaryText}>
              Restriction: {GEO_ZONE_RESTRICTION}
            </Text>
          </View>
        </View>
        <Text style={styles.description}>
          Description: {GEO_ZONE_DESCRIPTION}
        </Text>
      </ScrollView>
    </Animated.View>
  );
};
