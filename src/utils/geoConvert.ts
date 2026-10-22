import {
  GeoJsonPosition,
  GeoZoneFeature,
  GeoZonePolygonGeometry,
} from "@app/api/types/geoZone";
import type { LatLng } from "react-native-maps";

export const positionToLatLng = ([lon, lat]: GeoJsonPosition): LatLng => ({
  latitude: lat,
  longitude: lon,
});

export const polygonAreaDeg2 = (geometry: GeoZonePolygonGeometry): number => {
  const outer = geometry.coordinates[0];
  if (!outer) return 0;

  let sum = 0;
  for (let i = 0, j = outer.length - 1; i < outer.length; j = i++) {
    sum += outer[j][0] * outer[i][1] - outer[i][0] * outer[j][1];
  }
  return Math.abs(sum / 2);
};

const isInsideRing = (lon: number, lat: number, ring: GeoJsonPosition[]) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (
      yi > lat !== yj > lat &&
      lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
    ) {
      inside = !inside;
    }
  }
  return inside;
};

export const polygonGeometryToLatLngs = (
  geometry: GeoZonePolygonGeometry,
): LatLng[] => {
  const [outerRing] = geometry.coordinates;
  return outerRing.map(positionToLatLng);
};

export const zoneContainsPoint = (
  geometry: GeoZonePolygonGeometry,
  lon: number,
  lat: number,
): boolean => {
  const [outer, ...holes] = geometry.coordinates;
  if (!outer || !isInsideRing(lon, lat, outer)) return false;
  return !holes.some((hole) => isInsideRing(lon, lat, hole));
};

export const findZonesAtPoint = (
  zones: Map<string, GeoZoneFeature>,
  lat: number,
  lon: number,
): GeoZoneFeature[] =>
  Array.from(zones.values())
    .filter((zone) => zoneContainsPoint(zone.geometry, lon, lat))
    .sort((a, b) => polygonAreaDeg2(a.geometry) - polygonAreaDeg2(b.geometry));

export const polygonGeometryToLatLngsWithHoles = (
  geometry: GeoZonePolygonGeometry,
): { outer: LatLng[]; holes: LatLng[][] } => {
  const [outerRing, ...innerRings] = geometry.coordinates;
  return {
    outer: outerRing.map(positionToLatLng),
    holes: innerRings.map((ring) => ring.map(positionToLatLng)),
  };
};
