export type ApiErrorKind =
  | "configuration"
  | "network"
  | "timeout"
  | "http"
  | "invalid-response";

export type ApiError = {
  kind: ApiErrorKind;
  status: number;
  message: string;
  details?: unknown;
};

const API_ERROR_KINDS = [
  "configuration",
  "network",
  "timeout",
  "http",
  "invalid-response",
] as const satisfies readonly ApiErrorKind[];

export const isApiError = (error: unknown): error is ApiError =>
  typeof error === "object" &&
  error !== null &&
  "kind" in error &&
  "status" in error &&
  "message" in error &&
  typeof error.kind === "string" &&
  API_ERROR_KINDS.includes(error.kind as ApiErrorKind) &&
  typeof error.status === "number" &&
  typeof error.message === "string";
