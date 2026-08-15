import { apiRequest } from "@app/api/client";
import { AUTH_CONFIG } from "@app/api/endpoints-config";
import { saveTokens } from "@app/api/storage/tokenStorage";
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
  const res = await apiRequest<RequestOtpResponse>(AUTH_CONFIG.REQUESTOTP(), {
    method: "POST",
    body: { email },
  });
  return res;
};

export const verifyOtp = async (
  otp: string,
  verifyToken: string,
): Promise<VerifyOtpResponse> => {
  const payload: VerifyOtpPayload = { code: otp };

  return apiRequest<VerifyOtpResponse>(AUTH_CONFIG.VERIFYOTP(), {
    method: "POST",
    body: payload,
    token: verifyToken,
  });
};

export const signup = async (
  payload: RegisterPayload,
  registrationToken: string,
): Promise<RegisterResponse> => {
  const data = await apiRequest<RegisterResponse>(AUTH_CONFIG.SIGNUP(), {
    method: "POST",
    body: payload,
    token: registrationToken,
  });

  await saveTokens(data.access_token, data.refresh_token);

  return data;
};

export const signIn = async (
  payload: LoginPayload,
): Promise<LoginResponse> => {
  const data = await apiRequest<LoginResponse>(AUTH_CONFIG.LOGIN(), {
    method: "POST",
    body: payload,
    requiresAuth: false,
  });

  await saveTokens(data.access_token, data.refresh_token);

  return data;
};

