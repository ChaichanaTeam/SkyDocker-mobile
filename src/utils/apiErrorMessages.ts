import { isApiError } from "@app/api/types/apiError";

type ErrorDetail = { loc?: (string | number)[]; msg?: string; type?: string };

const getDetails = (error: unknown): ErrorDetail[] =>
  isApiError(error) && Array.isArray(error.details)
    ? (error.details as ErrorDetail[])
    : [];

export const getApiErrorMessages = (error: unknown): string[] => {
  const msgs = getDetails(error)
    .map((d) => d.msg)
    .filter((m): m is string => Boolean(m));
  if (msgs.length) return msgs;
  return [isApiError(error) ? error.message : "Something go wrong"];
};

export const getVerificationErrorTypes = (error: unknown): string[] =>
  getDetails(error)
    .map((d) => d.type)
    .filter((t): t is string => !!t && t.startsWith("verification."));
