export const AUTH_CONFIG = {
  LOGIN: () => "auth/login",
  SIGNUP: () => "auth/register",
  VERIFYOTP: () => "auth/register/verify-otp",
  REQUESTOTP: () => "auth/register/request-otp",
} as const;
