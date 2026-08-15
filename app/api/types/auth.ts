export interface RequestOtpPayload {
  email: string;
}

export interface RequestOtpResponse {
  token: string;
  token_type: string;
}

export interface VerifyOtpPayload {
  code: string;
}

export interface VerifyOtpResponse {
  token: string;
  token_type: string;
}

export interface RegisterPayload {
  phone_number: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface RegisterResponse {
  access_token: string;
  refresh_token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export type RegistrationStep = "email" | "otp" | "phone" | "password" | "name";

export interface RegistrationDraft extends Partial<RegisterPayload> {
  email?: string;
  otp?: string;
  verify_token?: string;
  registration_token?: string;
}
