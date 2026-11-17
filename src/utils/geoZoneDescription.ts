import type { GeoZoneProperties } from "@app/api/types/geoZone";

export const getGeoZoneDescription = (properties: GeoZoneProperties): string =>
  properties.description_en?.trim() ||
  properties.description_pl?.trim() ||
  "description";
