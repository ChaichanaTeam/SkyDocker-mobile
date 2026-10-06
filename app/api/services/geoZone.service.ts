import { apiRequest } from "@app/api/client";
import { GEO_ZONE_CONFIG } from "@app/api/endpoints-config";
import { BoundingBox, GeoZoneCollection, LatLon } from "@app/api/types/geoZone";

export const fetchGeoZones = async (
  boundingBox: BoundingBox,
  userPos: LatLon,
  signal?: AbortSignal,
): Promise<GeoZoneCollection> => {
  const params = new URLSearchParams({
    lon: String(userPos.lon),
    lat: String(userPos.lat),
    min_lon: String(boundingBox.min_lon),
    min_lat: String(boundingBox.min_lat),
    max_lon: String(boundingBox.max_lon),
    max_lat: String(boundingBox.max_lat),
  });

  return apiRequest<GeoZoneCollection>(
    `${GEO_ZONE_CONFIG.GEOZONE()}?${params.toString()}`,
    { method: "GET", signal },
  );
};
