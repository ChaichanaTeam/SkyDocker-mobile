import { apiRequest } from "@app/api/client";
import {
  CHECK_IN_CONFIG,
  GEO_ZONE_CONFIG,
  PILOTS_CONFIG,
} from "@app/api/endpoints-config";
import { isApiError } from "@app/api/types/apiError";
import type {
  CheckInCollection,
  CheckInFeature,
  CheckInPreview,
  CheckInPreviewRequest,
  CustomDroneCreateRequest,
} from "@app/api/types/checkIn";
import type { BoundingBox } from "@app/api/types/geoZone";
import type {
  DroneOption,
  MissionOption,
} from "@features/tracking/types/checkIn";
import {
  parseCheckInCollection,
  parseCheckInFeature,
  parseCountry,
  parseDrone,
  parseDrones,
  parseMissions,
  parsePilot,
  parsePreview,
  parsePrivileges,
  parseSupportedCountries,
} from "@/validators/checkIn.schema";
import type { PilotContact } from "@/validators/types/checkIn";

export const fetchPilot = (): Promise<PilotContact> =>
  apiRequest(PILOTS_CONFIG.ME(), { method: "GET" }, parsePilot);

export const fetchDrones = (): Promise<DroneOption[]> =>
  apiRequest(PILOTS_CONFIG.DRONES(), { method: "GET" }, parseDrones);

export const createCustomDrone = (
  request: CustomDroneCreateRequest,
): Promise<DroneOption> =>
  apiRequest(
    PILOTS_CONFIG.DRONES(),
    { method: "POST", body: request },
    parseDrone,
  );

export const fetchMissions = async (): Promise<MissionOption[]> => {
  const missions: MissionOption[] = [];
  for (let offset = 0; ; offset += 100) {
    const page = await apiRequest(
      `${PILOTS_CONFIG.MISSIONS()}?limit=100&offset=${offset}`,
      { method: "GET" },
      parseMissions,
    );
    missions.push(...page);
    if (page.length < 100) return missions;
  }
};

export const fetchPrivileges = (): Promise<string[]> =>
  apiRequest(PILOTS_CONFIG.PRIVILEGES(), { method: "GET" }, parsePrivileges);

export const resolveCountry = (lon: number, lat: number): Promise<string> => {
  const params = new URLSearchParams({ lon: String(lon), lat: String(lat) });
  return apiRequest(
    `${GEO_ZONE_CONFIG.COUNTRY()}?${params}`,
    { method: "GET" },
    parseCountry,
  );
};

export const fetchSupportedCountries = (): Promise<string[]> =>
  apiRequest(
    GEO_ZONE_CONFIG.SUPPORTED_COUNTRIES(),
    { method: "GET" },
    parseSupportedCountries,
  );

export const previewCheckIn = (
  request: CheckInPreviewRequest,
): Promise<CheckInPreview> =>
  apiRequest(
    CHECK_IN_CONFIG.PREVIEW(),
    { method: "POST", body: request },
    parsePreview,
  );

export const createCheckIn = (checkinToken: string): Promise<CheckInFeature> =>
  apiRequest(
    CHECK_IN_CONFIG.CREATE(),
    { method: "POST", body: { checkin_token: checkinToken } },
    parseCheckInFeature,
  );

export const endCheckIn = (): Promise<CheckInFeature> =>
  apiRequest(CHECK_IN_CONFIG.END(), { method: "POST" }, parseCheckInFeature);

export const fetchActiveCheckIn = async (): Promise<CheckInFeature | null> => {
  try {
    return await apiRequest(
      PILOTS_CONFIG.ACTIVE_CHECK_IN(),
      { method: "GET" },
      parseCheckInFeature,
    );
  } catch (error) {
    if (isApiError(error) && error.kind === "http" && error.status === 404)
      return null;
    throw error;
  }
};

export const fetchCheckIns = async (
  box: BoundingBox,
  countryTag: string,
): Promise<CheckInCollection> => {
  const params = new URLSearchParams({
    min_lon: String(box.min_lon),
    min_lat: String(box.min_lat),
    max_lon: String(box.max_lon),
    max_lat: String(box.max_lat),
    country_tag: countryTag,
  });
  try {
    return await apiRequest(
      `${CHECK_IN_CONFIG.CREATE()}?${params}`,
      { method: "GET" },
      parseCheckInCollection,
    );
  } catch (error) {
    if (
      isApiError(error) &&
      error.kind === "http" &&
      error.status === 404 &&
      error.message === "No checkins in this region"
    ) {
      return { type: "FeatureCollection", features: [] };
    }
    throw error;
  }
};
