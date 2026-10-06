import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Linking,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import MapView, { Marker, Polygon, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/theme";
import {
  blackGoogleMapStyle,
  useDemoCheckIns,
  useFocusedForegroundLocation,
} from "@features/tracking";

import { useGeoZones } from "@/hooks/useGeoZones";
import { polygonGeometryToLatLngsWithHoles } from "@/utils/geoConvert";
import { getGeoZoneStyle } from "@/utils/geoZoneStyle";
import { BoundingBox } from "@app/api/types/geoZone";

import { CheckInSheet } from "./CheckInSheet";
import { MapBottomBar } from "./MapBottomBar";
import { MapControlButton } from "./MapControlButton";
import { toUserRegion, WORLD_REGION } from "./constants/mapRegion";
import { styles } from "./styles/MapScreen.styles";
import type { CheckInDraftValues } from "@features/tracking";
import type {
  MapBottomBarItemKey,
  MapAppearance,
  SessionMapType,
} from "./types/types";

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
  const [isCheckInSheetVisible, setIsCheckInSheetVisible] =
    useState<boolean>(false);
  const [selectedBottomTab, setSelectedBottomTab] =
    useState<MapBottomBarItemKey>("map");
  const [mapType, setMapType] = useState<SessionMapType>("standard");
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const {
    error,
    getFreshCoordinates,
    isLocating,
    permission,
    retry,
    userCoordinates,
  } = useFocusedForegroundLocation();
  const { zones, onRegionChange } = useGeoZones();
  const { checkIns, submitCheckIn } = useDemoCheckIns({
    getFreshCoordinates,
  });

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

  const toggleAppearance = useCallback((): void => {
    setAppearance((currentAppearance) =>
      currentAppearance === "dark" ? "light" : "dark",
    );
  }, []);

  const toggleMapType = useCallback((): void => {
    setMapType((currentMapType) =>
      currentMapType === "standard" ? "satellite" : "standard",
    );
  }, []);

  const recenterOnUser = useCallback((): void => {
    if (!userRegion) {
      retry();
      return;
    }

    mapRef.current?.animateToRegion(userRegion, 700);
  }, [retry, userRegion]);

  const openCheckInSheet = useCallback((): void => {
    setSelectedBottomTab("checkIn");
    setIsCheckInSheetVisible(true);
  }, []);

  const closeCheckInSheet = useCallback((): void => {
    setSelectedBottomTab("map");
    setIsCheckInSheetVisible(false);
  }, []);

  const handleMapBottomTabPress = useCallback((): void => {
    setSelectedBottomTab("map");
    recenterOnUser();
  }, [recenterOnUser]);

  const handleProfileBottomTabPress = useCallback((): void => {
    setSelectedBottomTab("profile");
    setIsCheckInSheetVisible(false);
  }, []);

  const handleCreateCheckIn = useCallback(async (
    values: CheckInDraftValues,
  ): Promise<void> => {
    await submitCheckIn(values);
    setSelectedBottomTab("map");
    setIsCheckInSheetVisible(false);
  }, [submitCheckIn]);

  const handleNoticeAction = useCallback((): void => {
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
  }, [error?.reason, permission.canAskAgain, retry]);

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
          const style = getGeoZoneStyle(feature.properties.type);
          const { outer, holes } = polygonGeometryToLatLngsWithHoles(
            feature.geometry,
          );

          return (
            <Polygon
              key={feature.properties.tag}
              coordinates={outer}
              holes={holes}
              fillColor={style.fillColor}
              strokeColor={style.strokeColor}
              strokeWidth={style.strokeWidth}
            />
          );
        })}

        {checkIns.map((checkIn) => (
          <Marker
            coordinate={checkIn.coordinate}
            key={checkIn.id}
            title="Drone check-in"
          >
            <View style={styles.dronePin}>
              <Ionicons color={colors.text2} name="airplane" size={22} />
            </View>
          </Marker>
        ))}
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
          style={[
            styles.notice,
            { bottom: Math.max(insets.bottom + 104, 112) },
          ]}
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

      <MapBottomBar
        activeItem={selectedBottomTab}
        bottomInset={insets.bottom}
        onCheckInPress={openCheckInSheet}
        onMapPress={handleMapBottomTabPress}
        onProfilePress={handleProfileBottomTabPress}
      />

      <CheckInSheet
        appearance={appearance}
        isVisible={isCheckInSheetVisible}
        onClose={closeCheckInSheet}
        onSubmit={handleCreateCheckIn}
      />
    </View>
  );
};
