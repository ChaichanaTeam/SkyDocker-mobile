import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { colors } from "@/theme";
import {
  blackGoogleMapStyle,
  useCheckInMap,
  useDemoCheckIns,
  useFocusedForegroundLocation,
} from "@features/tracking";

import { useGeoZones } from "@/hooks/useGeoZones";
import { BoundingBox } from "@app/api/types/geoZone";

import { CheckInSheet } from "@components/ui/map/MapScreen/CheckInSheet";
import { GeoZoneInfoSheet } from "@components/ui/map/MapScreen/GeoZoneInfoSheet";
import { MapBottomBar } from "@components/ui/map/MapScreen/MapBottomBar";
import { DroneInfoSheet } from "@components/ui/map/MapScreen/DroneInfoSheet";
import { MapControlButton } from "@components/ui/map/MapScreen/MapControlButton";
import { toUserRegion } from "@components/ui/map/MapScreen/constants/mapRegion";
import { styles } from "@components/ui/map/MapScreen/styles/MapScreen.styles";
import type {
  MapAppearance,
  SessionMapType,
} from "@components/ui/map/MapScreen/types/types";
import type { CheckInDraftValues } from "@features/tracking";
import { GeoZonesLayer } from "@features/tracking/GeoZonesLayer";

const MAX_ZONES_DELTA = 0.5;

const DEFAULT_REGION: Region = {
  latitude: 52.2297,
  longitude: 21.0122,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

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
  const [appearance, setAppearance] = useState<MapAppearance>(
    colorScheme === "dark" ? "dark" : "light",
  );
  const [isCheckInSheetVisible, setIsCheckInSheetVisible] =
    useState<boolean>(false);
  const [isDroneSheetVisible, setIsDroneSheetVisible] = useState(false);
  const [mapType, setMapType] = useState<SessionMapType>("standard");
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const [isZoomedOut, setIsZoomedOut] = useState<boolean>(false);
  const {
    error,
    getFreshCoordinates,
    isLocating,
    permission,
    retry,
    userCoordinates,
  } = useFocusedForegroundLocation();
  const { zones, onRegionChange } = useGeoZones();
  const {
    markers: checkIns,
    onRegionChange: onCheckInRegionChange,
    refresh: refreshCheckIns,
  } = useCheckInMap();
  const {
    mutation,
    submitCheckIn,
  } = useDemoCheckIns({
    getFreshCoordinates,
    onChanged: refreshCheckIns,
  });

  const userRegion = useMemo(
    () => (userCoordinates ? toUserRegion(userCoordinates) : null),
    [userCoordinates],
  );

  useEffect(() => {
    if (initialRegion) return;

    if (userRegion) {
      setInitialRegion(userRegion);
    } else if (error) {
      setInitialRegion(DEFAULT_REGION);
    }
  }, [initialRegion, userRegion, error]);

  useEffect(() => {
    if (initialRegion) onCheckInRegionChange(regionToBoundingBox(initialRegion));
  }, [initialRegion, onCheckInRegionChange]);

  const handleRegionChangeComplete = useCallback(
    (region: Region) => {
      if (
        region.latitudeDelta > MAX_ZONES_DELTA ||
        region.longitudeDelta > MAX_ZONES_DELTA
      ) {
        setIsZoomedOut(true);
        onCheckInRegionChange(null);
        return;
      }

      setIsZoomedOut(false);
      onCheckInRegionChange(regionToBoundingBox(region));
      onRegionChange(regionToBoundingBox(region), {
        lon: userCoordinates?.longitude ?? region.longitude,
        lat: userCoordinates?.latitude ?? region.latitude,
      });
    },
    [onRegionChange, onCheckInRegionChange, userCoordinates],
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

  const openDroneSheet = useCallback(
    () => setIsDroneSheetVisible(true),
    [],
  );
  const closeDroneSheet = useCallback(
    () => setIsDroneSheetVisible(false),
    [],
  );

  const openCheckInSheet = useCallback((): void => {
    setZonesAtTap([]);
    setSelectedBottomTab("checkIn");
    setIsCheckInSheetVisible(true);
  }, []);

  const closeGeoZoneInfoSheet = useCallback((): void => {
    setZonesAtTap([]);
  }, []);

  const closeCheckInSheet = useCallback((): void => {
    setIsCheckInSheetVisible(false);
  }, []);

  const handleCreateCheckIn = useCallback(
    async (values: CheckInDraftValues): Promise<void> => {
      await submitCheckIn(values);
      setIsCheckInSheetVisible(false);
    },
    [submitCheckIn],
  );

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

  const handleMapPress = useCallback((): void => {
    closeDroneSheet();
  }, [closeDroneSheet]);

  return (
    <GestureHandlerRootView style={styles.container}>
      {initialRegion ? (
        <MapView
          customMapStyle={appearance === "dark" ? blackGoogleMapStyle : []}
          initialRegion={initialRegion}
          mapType={mapType}
          onPress={handleMapPress}
          onRegionChangeComplete={handleRegionChangeComplete}
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
          showsCompass
          showsMyLocationButton={false}
          showsUserLocation={permission.granted}
          style={styles.map}
        >
          <GeoZonesLayer zones={zones} />

          {checkIns.map((checkIn) => (
            <Marker
              coordinate={checkIn.coordinate}
              key={checkIn.id}
              tracksViewChanges={false}
            >
              <View style={styles.dronePin}>
                <Ionicons color={colors.text2} name="airplane" size={22} />
              </View>
            </Marker>
          ))}
        </MapView>
      ) : (
        <View style={styles.mapLoading}>
          <ActivityIndicator size="large" />
        </View>
      )}

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
            { bottom: Math.max(insets.bottom + 88, 96) },
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
      ) : isZoomedOut ? (
        <View
          style={[
            styles.notice,
            { bottom: Math.max(insets.bottom + 88, 96) },
          ]}
        >
          <Text style={styles.noticeText}>Zoom in to see geo-zones</Text>
        </View>
      ) : null}

      {!isDroneSheetVisible ? (
        <Pressable
          accessibilityLabel="Open drone info"
          accessibilityRole="button"
          onPress={openDroneSheet}
          style={[styles.bottomTouchZone, { height: 72 + insets.bottom }]}
        />
      ) : null}

      <DroneInfoSheet
        drone={null}
        isVisible={isDroneSheetVisible}
        onClose={closeDroneSheet}
        onCheckInPress={openCheckInSheet}
        onProfilePress={() => {}}
        onWikiPress={() => {}}
      />

      <GeoZoneInfoSheet
        zone={zonesAtTap[0] ?? null}
        onClose={closeGeoZoneInfoSheet}
      />

      <CheckInSheet
        appearance={appearance}
        isVisible={isCheckInSheetVisible}
        isMutationPending={mutation !== null}
        onClose={closeCheckInSheet}
        onSubmit={handleCreateCheckIn}
      />
    </GestureHandlerRootView>
  );
};
