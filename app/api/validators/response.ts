import type {
  LoginResponse,
  RegisterResponse,
  RequestOtpResponse,
  VerifyOtpResponse,
} from "@app/api/types/auth";
import type { CountryAtPoint, GeoZoneCollection } from "@app/api/types/geoZone";
import type {
  PilotDocument,
  PilotProfile,
  VerificationPreviewResponse,
  VerificationRequest,
} from "@app/api/types/pilots";
import { z } from "zod";

const tokenSchema = z.object({ token: z.string(), token_type: z.string() });
const registerSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
});
const loginSchema = registerSchema.extend({
  token_type: z.string(),
  expires_in: z.number(),
});
const countryAtPointSchema = z.object({ country_tag: z.string() });
const geoZoneFeatureSchema = z.object({
  type: z.literal("Feature"),
  geometry: z.object({
    type: z.literal("Polygon"),
    coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
  }),
  properties: z.object({
    country_id: z.number(),
    country: z.string(),
    type: z.string(),
    tag: z.string(),
    description_en: z.string().nullish(),
    description_pl: z.string().nullish(),
  }),
});
const geoZoneCollectionSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(geoZoneFeatureSchema),
});
const pilotProfileSchema = z.object({
  id: z.number(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  email: z.string(),
  phone_number: z.string().nullable(),
  pilot_number: z.string().nullable(),
  show_to_public: z.boolean(),
});
const pilotDocumentSchema = z.object({
  document_type: z.string(),
  size: z.number(),
  uploaded_at: z.string(),
  url: z.string(),
});
const verificationPreviewSchema = z.object({
  verification_token: z.string(),
  expires_in: z.number(),
});
const verificationRequestSchema = z.object({
  id: z.number(),
  pilot_id: z.number(),
  status: z.string(),
  first_name: z.string(),
  last_name: z.string(),
});

export const parseOtpResponse = (
  value: unknown,
): RequestOtpResponse | VerifyOtpResponse =>
  tokenSchema.parse(value);

export const parseRegisterResponse = (value: unknown): RegisterResponse =>
  registerSchema.parse(value);

export const parseLoginResponse = (value: unknown): LoginResponse =>
  loginSchema.parse(value);

export const parseCountryAtPoint = (value: unknown): CountryAtPoint =>
  countryAtPointSchema.parse(value);

export const parseGeoZoneCollection = (value: unknown): GeoZoneCollection =>
  geoZoneCollectionSchema.parse(value);

export const parsePilotProfile = (value: unknown): PilotProfile =>
  pilotProfileSchema.parse(value);

export const parsePilotDocuments = (value: unknown): PilotDocument[] =>
  z.array(pilotDocumentSchema).parse(value);

export const parseVerificationPreview = (
  value: unknown,
): VerificationPreviewResponse =>
  verificationPreviewSchema.parse(value);

export const parseVerificationRequest = (
  value: unknown,
): VerificationRequest =>
  verificationRequestSchema.parse(value);
