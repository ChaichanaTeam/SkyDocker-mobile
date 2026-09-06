export const AUTH_CONFIG = {
  LOGIN: () => "api/v1/auth/login",
  SIGNUP: () => "api/v1/auth/register",
  VERIFYOTP: () => "api/v1/auth/register/verify-otp",
  REQUESTOTP: () => "api/v1/auth/register/request-otp",
} as const;

export const DEMO_CHECK_IN_CONFIG = {
  CREATE: () => "api/demo/check-in/",
} as const;
