import type {
  CheckInCollection,
  CheckInFeature,
  CheckInPreview,
  CheckInPreviewRequest,
  CheckInStatus,
  CustomDroneCreateRequest,
} from "@app/api/types/checkIn";
import type {
  CheckInDraftValues,
  DroneOption,
  MissionOption,
} from "@features/tracking/types/checkIn";
import {
  CHECK_IN_LIMITS,
  CHECK_IN_STATUSES,
  COORDINATE_LIMITS,
  COUNTRY_TAG_PATTERN,
  CUSTOM_DRONE_MODEL,
  MAX_ENTITY_ID,
  MIN_ENTITY_ID,
  PREVIEW_EXPIRY_MARGIN_MS,
  WHOLE_NUMBER_PATTERN,
} from "./constants/checkIn";
import type {
  CheckInPoint,
  PilotContact,
  ReceivedCheckInPreview,
} from "./types/checkIn";

const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const id = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= MIN_ENTITY_ID;
const tag = (value: unknown): value is string =>
  typeof value === "string" && COUNTRY_TAG_PATTERN.test(value);
const checkInStatus = (value: unknown): value is CheckInStatus =>
  typeof value === "string" &&
  CHECK_IN_STATUSES.some((status) => status === value);
const invalid = (): never => {
  throw new Error("The server returned invalid check-in data.");
};
const bounded = (
  value: string,
  min: number,
  max: number,
  name: string,
): number => {
  if (!WHOLE_NUMBER_PATTERN.test(value.trim()))
    throw new Error(`${name} must be a whole number from ${min} to ${max}.`);
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < min || parsed > max)
    throw new Error(`${name} must be from ${min} to ${max}.`);
  return parsed;
};
export const buildPreviewRequest = (
  values: CheckInDraftValues,
  point: CheckInPoint,
  countryTag: string,
  drones: DroneOption[],
  privileges: string[],
  missions: MissionOption[],
): CheckInPreviewRequest => {
  if (!tag(countryTag))
    throw new Error("This country is not supported for check-ins.");
  if (
    !Number.isFinite(point.longitude) ||
    Math.abs(point.longitude) > COORDINATE_LIMITS.longitude ||
    !Number.isFinite(point.latitude) ||
    Math.abs(point.latitude) > COORDINATE_LIMITS.latitude
  )
    throw new Error("Current GPS coordinates are invalid.");
  const droneId = bounded(values.drone, MIN_ENTITY_ID, MAX_ENTITY_ID, "Drone");
  const selectedDrone = drones.find((drone) => drone.id === droneId);
  if (!selectedDrone) throw new Error("Select one of your drones.");
  const base = {
    country_tag: countryTag,
    home_point: { lon: point.longitude, lat: point.latitude },
  };
  if (values.mission) {
    const missionId = bounded(
      values.mission,
      MIN_ENTITY_ID,
      MAX_ENTITY_ID,
      "Mission",
    );
    const mission = missions.find((item) => item.id === missionId);
    if (!mission) throw new Error("Select one of your missions.");
    if (mission.droneId !== null && mission.droneId !== droneId)
      throw new Error("This mission belongs to another drone.");
    return { ...base, drone_id: droneId, mission_id: missionId };
  }
  const category = values.category.toLowerCase();
  if (!privileges.includes(category))
    throw new Error("Select a valid flying category.");
  return {
    ...base,
    drone_id: droneId,
    category,
    height: bounded(
      values.height,
      CHECK_IN_LIMITS.height.min,
      Math.min(CHECK_IN_LIMITS.height.max, selectedDrone.maxHeightM),
      "Height",
    ),
    range: bounded(
      values.range,
      CHECK_IN_LIMITS.range.min,
      Math.min(CHECK_IN_LIMITS.range.max, selectedDrone.maxRangeM),
      "Range",
    ),
    duration: bounded(
      values.duration,
      CHECK_IN_LIMITS.duration.min,
      CHECK_IN_LIMITS.duration.max,
      "Duration",
    ),
  };
};

export const buildCustomDroneCreateRequest = (
  weight: string,
  serialNumber: string,
): CustomDroneCreateRequest => ({
  custom_model: {
    manufacturer: CUSTOM_DRONE_MODEL.manufacturer,
    model_name: CUSTOM_DRONE_MODEL.model_name,
    speed: CUSTOM_DRONE_MODEL.speed,
    mtom: bounded(
      weight,
      CHECK_IN_LIMITS.weight.min,
      CHECK_IN_LIMITS.weight.max,
      "Weight",
    ),
    max_height: CUSTOM_DRONE_MODEL.max_height,
    max_range: CUSTOM_DRONE_MODEL.max_range,
  },
  serial_number: serialNumber,
  category: CUSTOM_DRONE_MODEL.category,
  is_drone_modified: CUSTOM_DRONE_MODEL.is_drone_modified,
});

export const parseCountry = (value: unknown): string =>
  record(value) && tag(value.country_tag) ? value.country_tag : invalid();
export const parseSupportedCountries = (value: unknown): string[] =>
  record(value) && Array.isArray(value.countries) && value.countries.every(tag)
    ? value.countries
    : invalid();
export const parsePilot = (value: unknown): PilotContact =>
  record(value) &&
  id(value.id) &&
  (typeof value.phone_number === "string" || value.phone_number === null)
    ? { phone_number: value.phone_number }
    : invalid();
export const parseDrone = (item: unknown): DroneOption => {
  if (
    !record(item) ||
    !id(item.id) ||
    typeof item.serial_number !== "string" ||
    !record(item.model) ||
    typeof item.model.manufacturer !== "string" ||
    typeof item.model.model_name !== "string" ||
    typeof item.model.mtom !== "number" ||
    typeof item.model.max_height !== "number" ||
    typeof item.model.max_range !== "number" ||
    !(item.mtom_override === null || typeof item.mtom_override === "number")
  )
    return invalid();
  return {
    id: item.id,
    label: `${item.model.manufacturer} ${item.model.model_name} (${item.serial_number})`,
    weightG: item.mtom_override ?? item.model.mtom,
    maxHeightM: item.model.max_height,
    maxRangeM: item.model.max_range,
  };
};
export const parseDrones = (value: unknown): DroneOption[] => {
  if (!Array.isArray(value)) return invalid();
  return value.map(parseDrone);
};
export const parsePrivileges = (value: unknown): string[] => {
  if (!Array.isArray(value)) return invalid();
  return value
    .map((item) => {
      if (
        !record(item) ||
        typeof item.flying_privilege !== "string" ||
        !(item.expires_at === null || typeof item.expires_at === "string")
      )
        return invalid();
      return item.flying_privilege;
    })
    .filter((privilege) => privilege !== "unknown");
};
export const parseMissions = (value: unknown): MissionOption[] => {
  if (
    !record(value) ||
    value.type !== "FeatureCollection" ||
    !Array.isArray(value.features)
  )
    return invalid();
  return value.features.map((feature) => {
    if (
      !record(feature) ||
      feature.type !== "Feature" ||
      !record(feature.properties) ||
      !id(feature.properties.id)
    )
      return invalid();
    const properties = feature.properties;
    const missionId = properties.id;
    if (!id(missionId)) return invalid();
    const droneId = id(properties.drone_id) ? properties.drone_id : null;
    const label =
      typeof properties.name === "string" && properties.name.trim()
        ? properties.name
        : `Mission ${properties.id}`;
    return { id: missionId, droneId, label };
  });
};
export const parsePreview = (value: unknown): CheckInPreview =>
  record(value) &&
  typeof value.checkin_token === "string" &&
  value.checkin_token.length > 0 &&
  id(value.expires_in)
    ? { checkin_token: value.checkin_token, expires_in: value.expires_in }
    : invalid();
export const previewIsValid = (
  preview: ReceivedCheckInPreview,
  now: number,
): boolean =>
  now <
  preview.receivedAt + preview.expires_in * 1000 - PREVIEW_EXPIRY_MARGIN_MS;

export const parseCheckInFeature = (value: unknown): CheckInFeature => {
  if (
    !record(value) ||
    value.type !== "Feature" ||
    !record(value.geometry) ||
    value.geometry.type !== "Point" ||
    !Array.isArray(value.geometry.coordinates) ||
    value.geometry.coordinates.length !== 2 ||
    typeof value.geometry.coordinates[0] !== "number" ||
    Math.abs(value.geometry.coordinates[0]) > COORDINATE_LIMITS.longitude ||
    typeof value.geometry.coordinates[1] !== "number" ||
    Math.abs(value.geometry.coordinates[1]) > COORDINATE_LIMITS.latitude ||
    !record(value.properties)
  )
    return invalid();
  const p = value.properties;
  if (
    !id(p.id) ||
    !tag(p.country_tag) ||
    typeof p.country !== "string" ||
    typeof p.status !== "string" ||
    typeof p.contact !== "string" ||
    typeof p.range !== "number" ||
    typeof p.height !== "number" ||
    typeof p.time !== "number" ||
    typeof p.start_at !== "string" ||
    !Number.isFinite(Date.parse(p.start_at))
  )
    return invalid();
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [
        value.geometry.coordinates[0],
        value.geometry.coordinates[1],
      ],
    },
    properties: {
      id: p.id,
      country_tag: p.country_tag,
      country: p.country,
      status: checkInStatus(p.status) ? p.status : "unknown",
      contact: p.contact,
      range: p.range,
      height: p.height,
      time: p.time,
      start_at: p.start_at,
    },
  };
};
export const parseCheckInCollection = (value: unknown): CheckInCollection => {
  if (
    !record(value) ||
    value.type !== "FeatureCollection" ||
    !Array.isArray(value.features)
  )
    return invalid();
  return {
    type: "FeatureCollection",
    features: value.features.map(parseCheckInFeature),
  };
};
