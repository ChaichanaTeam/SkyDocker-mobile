import { CHECK_IN_STATUSES } from "@app/api/constants/checkIn";

export { CHECK_IN_STATUSES };

export const COUNTRY_TAG_PATTERN = /^[A-Z]{2}$/;
export const WHOLE_NUMBER_PATTERN = /^[1-9]\d*$/;
export const MIN_ENTITY_ID = 1;
export const MAX_ENTITY_ID = Number.MAX_SAFE_INTEGER;
export const COORDINATE_LIMITS = {
  longitude: 180,
  latitude: 90,
} as const;

export const CHECK_IN_LIMITS = {
  height: { min: 5, max: 120 },
  range: { min: 5, max: 500 },
  duration: { min: 5, max: 180 },
  weight: { min: 1, max: 25_000 },
} as const;

export const CUSTOM_DRONE_MODEL = {
  manufacturer: "SkyDocker Test",
  model_name: "Custom Drone",
  speed: 10,
  max_height: 120,
  max_range: 500,
  category: "pb",
  is_drone_modified: false,
} as const;

export const PREVIEW_EXPIRY_MARGIN_MS = 1_000;
