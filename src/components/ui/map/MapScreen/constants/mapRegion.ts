import type { UserCoordinates } from "@features/tracking";
import type { Region } from "react-native-maps";

export const WORLD_REGION: Region = {
  latitude: 20,
  latitudeDelta: 120,
  longitude: 0,
  longitudeDelta: 160,
};

const USER_REGION_DELTA = 0.012;

export const toUserRegion = (coordinates: UserCoordinates): Region => ({
  latitude: coordinates.latitude,
  latitudeDelta: USER_REGION_DELTA,
  longitude: coordinates.longitude,
  longitudeDelta: USER_REGION_DELTA,
});
