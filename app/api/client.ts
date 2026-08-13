import { getAccessToken } from "@app/api/storage/tokenStorage";
import type { ApiError } from "@app/api/types/apiError";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

interface RequestOptions {
  method: HttpMethod;
  body?: unknown;
  requiresAuth?: boolean;
  token?: string;
}

const parseErrorResponse = async (response: Response): Promise<ApiError> => {
  let detail: unknown = undefined;

  try {
    const json = await response.json();
    detail = json?.detail;
  } catch {}

  const message = typeof detail === "string" ? detail : "Something go wrong";

  return {
    status: response.status,
    message,
    details: Array.isArray(detail) ? detail : undefined,
  };
};

export const apiRequest = async <T>(
  path: string,
  { method, body, requiresAuth = true, token }: RequestOptions,
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

  let response: Response;
  try {
    response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    const networkError: ApiError = {
      status: 0,
      message: "Not connect to server",
    };
    throw networkError;
  }

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};
