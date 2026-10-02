import { DEFAULT_TIMEOUT_MS } from "@app/api/constants/client";
import { getAccessToken } from "@app/api/storage/tokenStorage";
import type { ApiError } from "@app/api/types/apiError";
import type { RequestOptions } from "@app/api/types/client";

const parseErrorResponse = async (response: Response): Promise<ApiError> => {
  let detail: unknown = undefined;

  try {
    const json = await response.json();
    detail = json?.detail;
  } catch {
    detail = undefined;
  }

  const message = typeof detail === "string" ? detail : "Something go wrong";

  return {
    kind: "http",
    status: response.status,
    message,
    details: Array.isArray(detail) ? detail : undefined,
  };
};

const joinUrl = (baseUrl: string, path: string): string => {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  const normalizedPath = path.replace(/^\/+/, "");

  return `${normalizedBaseUrl}/${normalizedPath}`;
};

const getApiUrl = (path: string): string => {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

  if (!baseUrl) {
    const configurationError: ApiError = {
      kind: "configuration",
      status: 0,
      message: "SkyDocker API URL is not configured.",
    };
    throw configurationError;
  }

  return joinUrl(baseUrl, path);
};

export const apiRequest = async <T>(
  path: string,
  {
    method,
    body,
    requiresAuth = true,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    token,
  }: RequestOptions,
): Promise<T> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else if (requiresAuth) {
    const storedToken = await getAccessToken();
    if (storedToken) {
      headers.Authorization = `Bearer ${storedToken}`;
    }
  }

  const requestUrl = getApiUrl(path);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  let response: Response;
  try {
    response = await fetch(requestUrl, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      const timeoutError: ApiError = {
        kind: "timeout",
        status: 0,
        message: "Request timed out.",
      };
      throw timeoutError;
    }

    const networkError: ApiError = {
      kind: "network",
      status: 0,
      message: "Not connect to server",
    };
    throw networkError;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  if (response.status === 204) {
    const invalidResponseError: ApiError = {
      kind: "invalid-response",
      status: 204,
      message: "Server returned an empty response.",
    };
    throw invalidResponseError;
  }

  try {
    return (await response.json()) as T;
  } catch {
    const invalidResponseError: ApiError = {
      kind: "invalid-response",
      status: 0,
      message: "Server returned an invalid response.",
    };
    throw invalidResponseError;
  }
};
