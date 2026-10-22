import { isApiError } from "@app/api/types/apiError";
import type { CheckInAction } from "@features/tracking/types/demoCheckIn";

export const mapCheckInErrorToMessage = (
  error: unknown,
  action: CheckInAction = "create",
): string => {
  const fallback = action === "load"
    ? "Could not load check-ins. Please try again."
    : action === "end"
      ? "Could not end this flight. Please try again."
      : "Could not create check-in. Please try again.";
  if (!isApiError(error)) {
    return error instanceof Error
      ? error.message
      : fallback;
  }

  if (error.kind === "timeout") {
    return "The check-in request timed out. Please check its status before trying again.";
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

  return fallback;
};
