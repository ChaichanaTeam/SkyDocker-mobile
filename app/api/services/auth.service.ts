import { apiRequest } from "@app/api/client";
import { AUTH_CONFIG } from "@app/api/endpoints-config";
import { saveTokens } from "@app/api/storage/tokenStorage";
import {
  parseLoginResponse,
  parseOtpResponse,
  parseRegisterResponse,
} from "@app/api/validators/response";
import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  RequestOtpResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from "@app/api/types/auth";

export const requestOtp = async (
  email: string,
): Promise<RequestOtpResponse> => {
  const res = await apiRequest(AUTH_CONFIG.REQUESTOTP(), {
    method: "POST",
    body: { email },
    requiresAuth: false,
  }, parseOtpResponse);
  return res;
};

export const verifyOtp = async (
  otp: string,
  verifyToken: string,
): Promise<VerifyOtpResponse> => {
  const payload: VerifyOtpPayload = { code: otp };

  return apiRequest(AUTH_CONFIG.VERIFYOTP(), {
    method: "POST",
    body: payload,
    token: verifyToken,
  }, parseOtpResponse);
};

export const signup = async (
  password: string,
  registrationToken: string,
): Promise<RegisterResponse> => {
  // Remove these placeholders when the backend accepts registration without phone and name fields.
  const createSixDigitSuffix = () => Math.floor(100000 + Math.random() * 900000);
  const payload: RegisterPayload = {
    password,
    phone_number: "+380666168366",
    first_name: `Demo${createSixDigitSuffix()}`,
    last_name: `User${createSixDigitSuffix()}`,
  };

  const data = await apiRequest(AUTH_CONFIG.SIGNUP(), {
    method: "POST",
    body: payload,
    token: registrationToken,
  }, parseRegisterResponse);

  await saveTokens(data.access_token, data.refresh_token);

  return data;
};

export const signIn = async (
  payload: LoginPayload,
): Promise<LoginResponse> => {
  const data = await apiRequest(AUTH_CONFIG.LOGIN(), {
    method: "POST",
    body: payload,
    requiresAuth: false,
  }, parseLoginResponse);

  await saveTokens(data.access_token, data.refresh_token);

  return data;
};

