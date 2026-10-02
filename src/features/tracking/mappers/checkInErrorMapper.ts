import { isApiError } from "@app/api/types/apiError";

export const mapCheckInErrorToMessage = (error: unknown): string => {
  if (!isApiError(error)) {
    return error instanceof Error
      ? error.message
      : "Could not create check-in. Please try again.";
  }

  if (error.kind === "timeout") {
    return "Check-in request timed out. Please try again.";
  }

  if (error.kind === "network") {
    return "SkyDocker could not connect to the server. Please check your connection and try again.";
  }

  if (error.kind === "http" && error.status === 422) {
    return "The server could not validate this check-in. Please review the fields and try again.";
  }

  if (error.kind === "configuration") {
    return "SkyDocker API URL is not configured.";
  }

  if (error.kind === "invalid-response") {
    return "The server returned an unexpected check-in response. Please try again.";
  }

  return "Could not create check-in. Please try again.";
};
