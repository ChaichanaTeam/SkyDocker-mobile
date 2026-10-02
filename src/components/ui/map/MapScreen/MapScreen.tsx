import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Linking,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import MapView, { Polygon, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/theme";
import {
  blackGoogleMapStyle,
  useFocusedForegroundLocation,
} from "@features/tracking";

import { MapControlButton } from "./MapControlButton";
import { toUserRegion, WORLD_REGION } from "./constants/mapRegion";
import { styles } from "./styles/MapScreen.styles";

import { useGeoZones } from "@/hooks/useGeoZones";
import { polygonGeometryToLatLngs } from "@/utils/geoConvert";
import { getGeoZoneStyle } from "@/utils/geoZoneStyle";
import { BoundingBox } from "@app/api/types/geoZone";
import type { MapAppearance, SessionMapType } from "./types/types";

const regionToBoundingBox = (region: Region): BoundingBox => {
  const halfLat = region.latitudeDelta / 2;
  const halfLon = region.longitudeDelta / 2;

  return {
    min_lat: region.latitude - halfLat,
    max_lat: region.latitude + halfLat,
    min_lon: region.longitude - halfLon,
    max_lon: region.longitude + halfLon,
  };
};

export const MapScreen = () => {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const hasFocusedOnFirstLocation = useRef<boolean>(false);
  const [appearance, setAppearance] = useState<MapAppearance>(
    colorScheme === "dark" ? "dark" : "light",
  );
  const [mapType, setMapType] = useState<SessionMapType>("standard");
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const { error, isLocating, permission, retry, userCoordinates } =
    useFocusedForegroundLocation();

  const { zones, onRegionChange } = useGeoZones();

  const userRegion = useMemo(
    () => (userCoordinates ? toUserRegion(userCoordinates) : null),
    [userCoordinates],
  );

  useEffect(() => {
    if (!userRegion || hasFocusedOnFirstLocation.current) {
      return;
    }

    hasFocusedOnFirstLocation.current = true;
    mapRef.current?.animateToRegion(userRegion, 700);
    if (userCoordinates) {
      onRegionChange(regionToBoundingBox(userRegion), {
        lon: userCoordinates.longitude,
        lat: userCoordinates.latitude,
      });
    }
  }, [userRegion, userCoordinates, onRegionChange]);

  const handleRegionChangeComplete = useCallback(
    (region: Region) => {
      if (!hasFocusedOnFirstLocation.current || !userCoordinates) return;

      onRegionChange(regionToBoundingBox(region), {
        lon: userCoordinates.longitude,
        lat: userCoordinates.latitude,
      });
    },
    [onRegionChange, userCoordinates],
  );

  const toggleAppearance = (): void => {
    setAppearance((currentAppearance) =>
      currentAppearance === "dark" ? "light" : "dark",
    );
  };

  const toggleMapType = (): void => {
    setMapType((currentMapType) =>
      currentMapType === "standard" ? "satellite" : "standard",
    );
  };

  const recenterOnUser = (): void => {
    if (!userRegion) {
      retry();
      return;
    }

    mapRef.current?.animateToRegion(userRegion, 700);
  };

  const handleNoticeAction = (): void => {
    if (error?.reason === "permission-denied" && !permission.canAskAgain) {
      Linking.openSettings().catch(() => {
        setSettingsError(
          "SkyDocker could not open system settings. Please open them manually to enable location access.",
        );
      });
      return;
    }

    setSettingsError(null);
    retry();
  };

  const noticeMessage = settingsError ?? error?.message;

  const noticeActionLabel =
    error?.reason === "permission-denied" && !permission.canAskAgain
      ? "Open settings"
      : "Retry";

  return (
    <View style={styles.container}>
      <MapView
        customMapStyle={appearance === "dark" ? blackGoogleMapStyle : []}
        initialRegion={WORLD_REGION}
        mapType={mapType}
        onRegionChangeComplete={handleRegionChangeComplete}
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        showsCompass
        showsMyLocationButton={false}
        showsUserLocation={permission.granted}
        style={styles.map}
      >
        {Array.from(zones.values()).map((feature) => {
          const style = getGeoZoneStyle(feature.properties.tag);
          return (
            <Polygon
              key={feature.properties.name}
              coordinates={polygonGeometryToLatLngs(feature.geometry)}
              fillColor={style.fillColor}
              strokeColor={style.strokeColor}
              strokeWidth={style.strokeWidth}
            />
          );
        })}
      </MapView>

      <View
        style={[styles.controlStack, { top: Math.max(insets.top + 16, 32) }]}
      >
        <MapControlButton
          accessibilityLabel={
            appearance === "dark"
              ? "Switch to light map appearance"
              : "Switch to dark map appearance"
          }
          iconName={appearance === "dark" ? "moon" : "sunny"}
          isActive={appearance === "dark"}
          onPress={toggleAppearance}
        />
        <MapControlButton
          accessibilityLabel={
            mapType === "satellite"
              ? "Switch to standard map"
              : "Switch to satellite map"
          }
          iconName={mapType === "satellite" ? "earth" : "map"}
          isActive={mapType === "satellite"}
          onPress={toggleMapType}
        />
        <MapControlButton
          accessibilityLabel="Recenter on current location"
          iconName={isLocating ? "locate" : "navigate"}
          onPress={recenterOnUser}
        />
      </View>

      {noticeMessage ? (
        <View
          accessibilityLiveRegion="polite"
          style={[styles.notice, { bottom: Math.max(insets.bottom + 20, 28) }]}
        >
          <Text style={styles.noticeText}>{noticeMessage}</Text>
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.76}
            onPress={handleNoticeAction}
            style={styles.noticeAction}
          >
            <Ionicons
              color={colors.mapControlTextActive}
              name={
                noticeActionLabel === "Open settings" ? "settings" : "refresh"
              }
              size={18}
            />
            <Text style={styles.noticeActionText}>{noticeActionLabel}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};
