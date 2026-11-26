import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, {
  Circle,
  MapPressEvent,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/theme";
import {
  blackGoogleMapStyle,
  useCheckInMap,
  useCheckIns,
  useFocusedForegroundLocation,
} from "@features/tracking";

import { useGeoZones } from "@/hooks/useGeoZones";
import { findZonesAtPoint } from "@/utils/geoConvert";
import { BoundingBox, GeoZoneFeature } from "@app/api/types/geoZone";

import { CheckInMarker } from "@components/ui/map/MapScreen/CheckInMarker";
import { DroneInfoSheet } from "@components/ui/map/MapScreen/DroneInfoSheet";
import { GeoZoneInfoSheet } from "@components/ui/map/MapScreen/GeoZoneInfoSheet";
import { MapControlButton } from "@components/ui/map/MapScreen/MapControlButton";
import { ProfileSheet } from "@components/ui/map/MapScreen/ProfileSheet";
import { toUserRegion } from "@components/ui/map/MapScreen/constants/mapRegion";
import { styles } from "@components/ui/map/MapScreen/styles/MapScreen.styles";
import type {
  MapAppearance,
  SessionMapType,
} from "@components/ui/map/MapScreen/types/types";
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
  const [isDroneSheetVisible, setIsDroneSheetVisible] = useState(true);
  const [collapseToken, setCollapseToken] = useState(0);
  const [isProfileSheetVisible, setIsProfileSheetVisible] = useState(false);
  const [checkInOpenToken, setCheckInOpenToken] = useState(0);
  const [draftRangeM, setDraftRangeM] = useState<number | null>(null);
  const [mapType, setMapType] = useState<SessionMapType>("standard");
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const [isZoomedOut, setIsZoomedOut] = useState<boolean>(false);
  const [zonesAtTap, setZonesAtTap] = useState<GeoZoneFeature[]>([]);
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
    error: checkInMapError,
    onRegionChange: onCheckInRegionChange,
    refresh: refreshCheckIns,
  } = useCheckInMap();
  const checkInSession = useCheckIns(getFreshCoordinates, refreshCheckIns);

  const userRegion = useMemo(
    () => (userCoordinates ? toUserRegion(userCoordinates) : null),
    [userCoordinates],
  );

  const activeCheckInFeature = checkInSession.active;
  const rangeCircle = activeCheckInFeature
    ? {
        center: {
          latitude: activeCheckInFeature.geometry.coordinates[1],
          longitude: activeCheckInFeature.geometry.coordinates[0],
        },
        radius: activeCheckInFeature.properties.range,
      }
    : draftRangeM && userCoordinates
      ? {
          center: {
            latitude: userCoordinates.latitude,
            longitude: userCoordinates.longitude,
          },
          radius: draftRangeM,
        }
      : null;

  useEffect(() => {
    if (userRegion) {
      if (!initialRegion) {
        setInitialRegion(userRegion);
      } else if (initialRegion === DEFAULT_REGION) {
        mapRef.current?.animateToRegion(userRegion, 700);
        setInitialRegion(userRegion);
      }
    } else if (!initialRegion && error) {
      setInitialRegion(DEFAULT_REGION);
    }
  }, [initialRegion, userRegion, error]);

  useEffect(() => {
    if (initialRegion) {
      onCheckInRegionChange(regionToBoundingBox(initialRegion), {
        lon: initialRegion.longitude,
        lat: initialRegion.latitude,
      });
    }
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
      onCheckInRegionChange(regionToBoundingBox(region), {
        lon: region.longitude,
        lat: region.latitude,
      });
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

  const openDroneSheet = useCallback(() => setIsDroneSheetVisible(true), []);
  const closeDroneSheet = useCallback(() => setIsDroneSheetVisible(false), []);
  const collapseDroneSheet = useCallback(
    () => setCollapseToken((token) => token + 1),
    [],
  );
  const openProfileSheet = useCallback((): void => {
    setIsDroneSheetVisible(false);
    setIsProfileSheetVisible(true);
  }, []);
  const closeProfileSheet = useCallback(
    () => setIsProfileSheetVisible(false),
    [],
  );
  const handleProfileSheetClose = useCallback((): void => {
    closeProfileSheet();
    openDroneSheet();
  }, [closeProfileSheet, openDroneSheet]);

  const openCheckInFromProfile = useCallback((): void => {
    setZonesAtTap([]);
    closeProfileSheet();
    setCheckInOpenToken((token) => token + 1);
    openDroneSheet();
  }, [closeProfileSheet, openDroneSheet]);

  const closeGeoZoneInfoSheet = useCallback((): void => {
    setZonesAtTap([]);
  }, []);

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

  const handleMapPress = useCallback(
    (event: MapPressEvent): void => {
      collapseDroneSheet();
      closeProfileSheet();
      const { latitude, longitude } = event.nativeEvent.coordinate;
      setZonesAtTap(findZonesAtPoint(zones, latitude, longitude));
    },
    [collapseDroneSheet, closeProfileSheet, zones],
  );

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
            <CheckInMarker checkIn={checkIn} key={checkIn.key} />
          ))}

          {rangeCircle ? (
            <Circle
              center={rangeCircle.center}
              fillColor="rgba(27, 35, 64, 0.12)"
              radius={rangeCircle.radius}
              strokeColor="#1B2340"
              strokeWidth={2}
            />
          ) : null}
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
          style={[styles.notice, { bottom: Math.max(insets.bottom + 88, 96) }]}
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
      ) : checkInMapError ? (
        <View
          style={[styles.notice, { bottom: Math.max(insets.bottom + 88, 96) }]}
        >
          <Text style={styles.noticeText}>{checkInMapError}</Text>
        </View>
      ) : isZoomedOut ? (
        <View
          style={[styles.notice, { bottom: Math.max(insets.bottom + 88, 96) }]}
        >
          <Text style={styles.noticeText}>Zoom in to see geo-zones</Text>
        </View>
      ) : null}

      <DroneInfoSheet
        collapseToken={collapseToken}
        onDraftRangeChange={setDraftRangeM}
        openCheckInToken={checkInOpenToken}
        drone={null}
        isVisible={isDroneSheetVisible}
        isMutationPending={checkInSession.mutation !== null}
        checkIns={checkInSession}
        onClose={closeDroneSheet}
        onCheckInPress={() => setZonesAtTap([])}
        onProfilePress={openProfileSheet}
        onWikiPress={() => {}}
      />

      {isProfileSheetVisible ? (
        <ProfileSheet
          onCheckInPress={openCheckInFromProfile}
          onClose={handleProfileSheetClose}
        />
      ) : null}

      <GeoZoneInfoSheet
        zones={zonesAtTap}
        onClose={closeGeoZoneInfoSheet}
      />
    </GestureHandlerRootView>
  );
};
