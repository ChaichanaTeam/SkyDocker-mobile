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

const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const string = (value: unknown): value is string => typeof value === "string";
const number = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);
const nullableString = (value: unknown): value is string | null =>
  value === null || string(value);
const optionalNullableString = (value: unknown): value is string | null | undefined =>
  value === undefined || nullableString(value);

const invalid = (): never => {
  throw new Error("The server returned an invalid response.");
};

export const parseOtpResponse = (
  value: unknown,
): RequestOtpResponse | VerifyOtpResponse =>
  record(value) && string(value.token) && string(value.token_type)
    ? { token: value.token, token_type: value.token_type }
    : invalid();

export const parseRegisterResponse = (value: unknown): RegisterResponse =>
  record(value) && string(value.access_token) && string(value.refresh_token)
    ? { access_token: value.access_token, refresh_token: value.refresh_token }
    : invalid();

export const parseLoginResponse = (value: unknown): LoginResponse =>
  record(value) &&
  string(value.access_token) &&
  string(value.refresh_token) &&
  string(value.token_type) &&
  number(value.expires_in)
    ? {
        access_token: value.access_token,
        refresh_token: value.refresh_token,
        token_type: value.token_type,
        expires_in: value.expires_in,
      }
    : invalid();

export const parseCountryAtPoint = (value: unknown): CountryAtPoint =>
  record(value) && string(value.country_tag)
    ? { country_tag: value.country_tag }
    : invalid();

const geoZoneFeature = (
  value: unknown,
): value is GeoZoneCollection["features"][number] =>
  record(value) &&
  value.type === "Feature" &&
  record(value.geometry) &&
  value.geometry.type === "Polygon" &&
  Array.isArray(value.geometry.coordinates) &&
  value.geometry.coordinates.every(
    (ring: unknown) =>
      Array.isArray(ring) &&
      ring.every(
        (point: unknown) =>
          Array.isArray(point) && point.length === 2 && point.every(number),
      ),
  ) &&
  record(value.properties) &&
  number(value.properties.country_id) &&
  string(value.properties.country) &&
  string(value.properties.type) &&
  string(value.properties.tag) &&
  optionalNullableString(value.properties.description_en) &&
  optionalNullableString(value.properties.description_pl);

export const parseGeoZoneCollection = (value: unknown): GeoZoneCollection =>
  record(value) &&
  value.type === "FeatureCollection" &&
  Array.isArray(value.features) &&
  value.features.every(geoZoneFeature)
    ? { type: "FeatureCollection", features: value.features }
    : invalid();

export const parsePilotProfile = (value: unknown): PilotProfile =>
  record(value) &&
  number(value.id) &&
  nullableString(value.first_name) &&
  nullableString(value.last_name) &&
  string(value.email) &&
  nullableString(value.phone_number) &&
  nullableString(value.pilot_number) &&
  typeof value.show_to_public === "boolean"
    ? {
        id: value.id,
        first_name: value.first_name,
        last_name: value.last_name,
        email: value.email,
        phone_number: value.phone_number,
        pilot_number: value.pilot_number,
        show_to_public: value.show_to_public,
      }
    : invalid();

const pilotDocument = (value: unknown): value is PilotDocument =>
  record(value) &&
  string(value.document_type) &&
  number(value.size) &&
  string(value.uploaded_at) &&
  string(value.url);

export const parsePilotDocuments = (value: unknown): PilotDocument[] =>
  Array.isArray(value) && value.every(pilotDocument) ? value : invalid();

export const parseVerificationPreview = (
  value: unknown,
): VerificationPreviewResponse =>
  record(value) && string(value.verification_token) && number(value.expires_in)
    ? {
        verification_token: value.verification_token,
        expires_in: value.expires_in,
      }
    : invalid();

export const parseVerificationRequest = (
  value: unknown,
): VerificationRequest =>
  record(value) &&
  number(value.id) &&
  number(value.pilot_id) &&
  string(value.status) &&
  string(value.first_name) &&
  string(value.last_name)
    ? {
        id: value.id,
        pilot_id: value.pilot_id,
        status: value.status,
        first_name: value.first_name,
        last_name: value.last_name,
      }
    : invalid();
