import { useCallback, useEffect, useRef } from "react";
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
import { getGeoZoneDescription } from "@/utils/geoZoneDescription";
import { NoEntry } from "@assets/icons";
import type { GeoZoneFeature } from "@app/api/types/geoZone";

import {
  GEO_ZONE_RESTRICTION,
  GEO_ZONE_TYPE_CODE_PATTERN,
} from "./constants/geoZoneInfoSheet";
import { useCheckInSheetGesture } from "./hooks/useCheckInSheetGesture";
import { styles } from "./styles/GeoZoneInfoSheet.styles";
import type { GeoZoneInfoSheetProps } from "./types/types";

const GeoZoneDetails = ({
  zone,
  layer,
  showLayer,
}: {
  zone: GeoZoneFeature;
  layer: number;
  showLayer: boolean;
}) => {
  const zoneType = zone.properties.type;
  const normalizedZoneType = normalizeGeoZoneType(zoneType);
  const displayZoneType = GEO_ZONE_TYPE_CODE_PATTERN.test(normalizedZoneType)
    ? normalizedZoneType
    : zoneType;
  const description = getGeoZoneDescription(zone.properties);
  const cardStyle = getGeoZoneCardStyle(zoneType);

  return (
    <View style={showLayer ? styles.layer : styles.singleZone}>
      {showLayer ? (
        <Text style={[styles.layerLabel, { color: cardStyle.accentColor }]}>
          Layer {layer}
        </Text>
      ) : null}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCell}>
          <Text style={styles.summaryText}>Zone type: {displayZoneType}</Text>
        </View>
        <View style={styles.summaryCell}>
          <Text style={styles.summaryText}>
            Restriction: {GEO_ZONE_RESTRICTION}
          </Text>
        </View>
      </View>
      <Text style={styles.description}>Description: {description}</Text>
    </View>
  );
};

export const GeoZoneInfoSheet = ({ zones, onClose }: GeoZoneInfoSheetProps) => {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const { dragGesture, handleSheetLayout, sheetAnimatedStyle } =
    useCheckInSheetGesture({
      isVisible: zones.length > 0,
      onClose,
      resetKey: zones,
      windowHeight,
    });

  useEffect(() => {
    if (zones.length === 0) return;

    const backSubscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onClose();
        return true;
      },
    );

    return () => backSubscription.remove();
  }, [onClose, zones.length]);

  useEffect(() => {
    if (zones.length > 0) scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [zones]);

  const handleAccessibilityAction = useCallback(
    (event: AccessibilityActionEvent): void => {
      if (event.nativeEvent.actionName === "dismiss") onClose();
    },
    [onClose],
  );

  const topZone = zones[0];
  if (!topZone) return null;

  const cardStyle = getGeoZoneCardStyle(topZone.properties.type);
  const showLayers = zones.length > 1;

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
      {!showLayers && isProhibitedGeoZoneType(topZone.properties.type) ? (
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
        ref={scrollRef}
        style={[
          styles.contentScroll,
          {
            maxHeight:
              windowHeight * 0.65 - Math.max(insets.bottom, 16) - 42,
          },
        ]}
      >
        {showLayers ? (
          <Text style={styles.zoneCount}>{zones.length} geo-zones</Text>
        ) : null}
        {zones.map((zone, index) => (
          <GeoZoneDetails
            key={zone.properties.tag}
            layer={index + 1}
            showLayer={showLayers}
            zone={zone}
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
};
