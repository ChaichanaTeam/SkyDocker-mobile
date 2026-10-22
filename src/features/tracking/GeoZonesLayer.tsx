import {
  polygonAreaDeg2,
  polygonGeometryToLatLngsWithHoles,
} from "@/utils/geoConvert";
import { getGeoZoneStyle } from "@/utils/geoZoneStyle";
import { GeoZoneFeature } from "@app/api/types/geoZone";
import { memo, useMemo } from "react";
import { Polygon } from "react-native-maps";

const zIndexFromArea = (area: number): number =>
  Math.round(1000 - Math.log10(Math.max(area, 1e-9)) * 100);

const GeoZonePolygon = memo(function GeoZonePolygon({
  feature,
}: {
  feature: GeoZoneFeature;
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
      zIndex={zIndexFromArea(area)}
    />
  );
});

export const GeoZonesLayer = memo(function GeoZonesLayer({
  zones,
}: {
  zones: Map<string, GeoZoneFeature>;
}) {
  return (
    <>
      {Array.from(zones.values()).map((feature) => (
        <GeoZonePolygon key={feature.properties.tag} feature={feature} />
      ))}
    </>
  );
});
