export const AUTH_CONFIG = {
  LOGIN: () => "api/v1/auth/login",
  SIGNUP: () => "api/v1/auth/register",
  VERIFYOTP: () => "api/v1/auth/register/verify-otp",
  REQUESTOTP: () => "api/v1/auth/register/request-otp",
} as const;

export const GEO_ZONE_CONFIG = {
  GEOZONE: () => "api/v1/geo-zone/",
} as const;

export const DEMO_CHECK_IN_CONFIG = {
  CREATE: () => "api/demo/check-in/",
  BBOX: () => "api/demo/check-in/bbox",
  END: (id: number) => `api/demo/check-in/${id}/end`,
} as const;

export const PILOTS_CONFIG = {
  ME: () => "api/v1/pilots/me",
  UPDATE_ME: () => "api/v1/pilots/me",
  DOCUMENTS: () => "api/v1/pilots/me/documents",
} as const;

export const VERIFICATION_CONFIG = {
  PREVIEW: () => "api/v1/verification-requests/preview",
  CREATE: () => "api/v1/verification-requests/",
} as const;
