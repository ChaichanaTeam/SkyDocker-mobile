export const AUTH_CONFIG = {
  LOGIN: () => "api/v1/auth/login",
  REFRESH: () => "api/v1/auth/refresh",
  SIGNUP: () => "api/v1/auth/register",
  VERIFYOTP: () => "api/v1/auth/register/verify-otp",
  REQUESTOTP: () => "api/v1/auth/register/request-otp",
} as const;

export const GEO_ZONE_CONFIG = {
  GEOZONE: () => "api/v1/geo-zone/",
  COUNTRY: () => "api/v1/geo-zone/country",
  SUPPORTED_COUNTRIES: () => "api/v1/geo-zone/country/supported",
} as const;

export const CHECK_IN_CONFIG = {
  CREATE: () => "api/v1/check-in/",
  PREVIEW: () => "api/v1/check-in/preview",
  END: () => "api/v1/check-in/end",
} as const;

export const PILOTS_CONFIG = {
  ME: () => "api/v1/pilots/me",
  UPDATE_ME: () => "api/v1/pilots/me",
  DOCUMENTS: () => "api/v1/pilots/me/documents",
  DRONES: () => "api/v1/pilots/me/drones",
  MISSIONS: () => "api/v1/pilots/me/missions",
  PRIVILEGES: () => "api/v1/pilots/me/privileges",
  ACTIVE_CHECK_IN: () => "api/v1/pilots/me/check-ins/active",
} as const;

export const VERIFICATION_CONFIG = {
  PREVIEW: () => "api/v1/verification-requests/preview",
  CREATE: () => "api/v1/verification-requests/",
} as const;
