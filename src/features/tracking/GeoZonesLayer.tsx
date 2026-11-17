import {
  compareGeoZonesTopFirst,
  polygonAreaDeg2,
  polygonGeometryToLatLngsWithHoles,
} from "@/utils/geoConvert";
import { getGeoZoneStyle } from "@/utils/geoZoneStyle";
import { GeoZoneFeature } from "@app/api/types/geoZone";
import { memo, useMemo } from "react";
import { Polygon } from "react-native-maps";

const GeoZonePolygon = memo(function GeoZonePolygon({
  feature,
  zIndex,
}: {
  feature: GeoZoneFeature;
  zIndex: number;
}) {
  const { outer, holes } = useMemo(
    () => polygonGeometryToLatLngsWithHoles(feature.geometry),
    [feature.geometry],
  );

  const area = useMemo(
    () => polygonAreaDeg2(feature.geometry),
    [feature.geometry],
  );

  const style = getGeoZoneStyle(feature.properties.type, area);

  return (
    <Polygon
      coordinates={outer}
      holes={holes}
      fillColor={style.fillColor}
      strokeColor={style.strokeColor}
      strokeWidth={style.strokeWidth}
      zIndex={zIndex}
    />
  );
});

export const GeoZonesLayer = memo(function GeoZonesLayer({
  zones,
}: {
  zones: Map<string, GeoZoneFeature>;
}) {
  const orderedZones = useMemo(
    () => Array.from(zones.values()).sort((a, b) => compareGeoZonesTopFirst(b, a)),
    [zones],
  );

  return (
    <>
      {orderedZones.map((feature, index) => (
        <GeoZonePolygon key={feature.properties.tag} feature={feature} zIndex={index + 1} />
      ))}
    </>
  );
});
