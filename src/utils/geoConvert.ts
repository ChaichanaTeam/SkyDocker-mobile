import {
  GeoJsonPosition,
  GeoZonePolygonGeometry,
} from "@app/api/types/geoZone";
import type { LatLng } from "react-native-maps";

export const positionToLatLng = ([lon, lat]: GeoJsonPosition): LatLng => ({
  latitude: lat,
  longitude: lon,
});

export const polygonGeometryToLatLngs = (
  geometry: GeoZonePolygonGeometry,
): LatLng[] => {
  const [outerRing] = geometry.coordinates;
  return outerRing.map(positionToLatLng);
};

export const polygonGeometryToLatLngsWithHoles = (
  geometry: GeoZonePolygonGeometry,
): { outer: LatLng[]; holes: LatLng[][] } => {
  const [outerRing, ...innerRings] = geometry.coordinates;
  return {
    outer: outerRing.map(positionToLatLng),
    holes: innerRings.map((ring) => ring.map(positionToLatLng)),
  };
};
