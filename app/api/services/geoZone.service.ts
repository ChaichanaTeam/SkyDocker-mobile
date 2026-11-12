import { apiRequest } from "@app/api/client";
import { GEO_ZONE_CONFIG } from "@app/api/endpoints-config";
import type {
  BoundingBox,
  CountryAtPoint,
  GeoZoneCollection,
  LatLon,
} from "@app/api/types/geoZone";

let cachedPositionKey: string | null = null;
let cachedCountryRequest: Promise<CountryAtPoint> | null = null;

const fetchCountryAtPoint = (position: LatLon): Promise<CountryAtPoint> => {
  const positionKey = `${position.lon},${position.lat}`;
  if (positionKey === cachedPositionKey && cachedCountryRequest) {
    return cachedCountryRequest;
  }

  const params = new URLSearchParams({
    lon: String(position.lon),
    lat: String(position.lat),
  });
  const request = apiRequest<CountryAtPoint>(
    `${GEO_ZONE_CONFIG.COUNTRY()}?${params.toString()}`,
    { method: "GET" },
  );
  cachedPositionKey = positionKey;
  cachedCountryRequest = request;

  void request.catch(() => {
    if (cachedCountryRequest === request) {
      cachedPositionKey = null;
      cachedCountryRequest = null;
    }
  });

  return request;
};

export const fetchGeoZones = async (
  boundingBox: BoundingBox,
  userPos: LatLon,
  signal?: AbortSignal,
): Promise<GeoZoneCollection> => {
  const { country_tag } = await fetchCountryAtPoint(userPos);
  const params = new URLSearchParams({
    country_tag,
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
