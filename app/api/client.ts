import { DEFAULT_TIMEOUT_MS } from "@app/api/constants/client";
import { AUTH_CONFIG } from "@app/api/endpoints-config";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "@app/api/storage/tokenStorage";
import { isApiError, type ApiError } from "@app/api/types/apiError";
import type { HttpResult, RequestOptions } from "@app/api/types/client";

const fail = (
  kind: ApiError["kind"],
  message: string,
  status = 0,
  details?: unknown,
): ApiError => ({ kind, message, status, details });

const getApiUrl = (path: string): string => {
  const base = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (!base)
    throw fail("configuration", "SkyDocker API URL is not configured.");
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
};

const responseError = ({ body, status }: HttpResult): ApiError => {
  const detail =
    typeof body === "object" && body !== null && "detail" in body
      ? body.detail
      : undefined;
  return fail(
    "http",
    typeof detail === "string" ? detail : "Something go wrong",
    status,
    Array.isArray(detail) ? detail : undefined,
  );
};

const send = async (
  path: string,
  options: RequestOptions,
  accessToken: string | null,
): Promise<HttpResult> => {
  const requestUrl = getApiUrl(path);
  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const controller = new AbortController();
  let abortReason: "timeout" | "cancelled" | null = null;
  const abort = (reason: "timeout" | "cancelled") => {
    if (controller.signal.aborted) return;
    abortReason = reason;
    controller.abort();
  };
  const onAbort = () => abort("cancelled");
  const abortError = () =>
    abortReason === "cancelled"
      ? fail("cancelled", "Request was cancelled.")
      : fail("timeout", "Request timed out.");
  options.signal?.addEventListener("abort", onAbort, { once: true });
  if (options.signal?.aborted) onAbort();
  const timer = setTimeout(
    () => abort("timeout"),
    options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  );

  try {
    const response = await fetch(requestUrl, {
      method: options.method,
      headers,
      body:
        options.body === undefined
          ? undefined
          : isFormData
            ? (options.body as FormData)
            : JSON.stringify(options.body),
      signal: controller.signal,
    });
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      if (controller.signal.aborted) throw abortError();
      if (response.ok)
        throw fail(
          "invalid-response",
          "Server returned an invalid response.",
        );
      body = null;
    }
    return { ok: response.ok, status: response.status, body };
  } catch (error) {
    if (isApiError(error)) throw error;
    if (controller.signal.aborted) throw abortError();
    throw fail("network", "Not connect to server");
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener("abort", onAbort);
  }
};

let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = async (
  failedToken: string | null,
): Promise<string> => {
  const current = await getAccessToken();
  if (failedToken !== null && current && current !== failedToken) return current;
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      await clearTokens();
      throw fail(
        "http",
        "Your session has expired. Please sign in again.",
        401,
      );
    }
    const response = await send(
      AUTH_CONFIG.REFRESH(),
      {
        method: "POST",
        body: { refresh_token: refreshToken },
        requiresAuth: false,
      },
      null,
    );
    if (!response.ok) {
      if (response.status === 401 || response.status === 422) {
        await clearTokens();
        throw fail(
          "http",
          "Your session has expired. Please sign in again.",
          401,
        );
      }
      throw responseError(response);
    }
    const value = response.body;
    if (
      typeof value !== "object" ||
      value === null ||
      !("access_token" in value) ||
      typeof value.access_token !== "string" ||
      !value.access_token ||
      !("refresh_token" in value) ||
      typeof value.refresh_token !== "string" ||
      !value.refresh_token
    ) {
      throw fail("invalid-response", "Server returned invalid session data.");
    }
    await saveTokens(value.access_token, value.refresh_token);
    return value.access_token;
  })();
  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
};

export const apiRequest = async <T>(
  path: string,
  options: RequestOptions,
  parseResponse: (body: unknown) => T,
): Promise<T> => {
  const shouldRefresh =
    options.requiresAuth !== false &&
    !options.token &&
    path !== AUTH_CONFIG.REFRESH();
  let accessToken =
    options.token ?? (shouldRefresh ? await getAccessToken() : null);
  if (shouldRefresh && !accessToken)
    accessToken = await refreshAccessToken(null);

  let response = await send(path, options, accessToken);
  if (shouldRefresh && response.status === 401 && !options.signal?.aborted) {
    accessToken = await refreshAccessToken(accessToken);
    response = await send(path, options, accessToken);
    if (response.status === 401 && (await getAccessToken()) === accessToken)
      await clearTokens();
  }
  if (!response.ok) throw responseError(response);
  if (response.status === 204)
    throw fail("invalid-response", "Server returned an empty response.", 204);
  try {
    return parseResponse(response.body);
  } catch {
    throw fail("invalid-response", "Server returned an invalid response.", response.status);
  }
};
