export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export type RequestOptions = {
  method: HttpMethod;
  body?: unknown;
  requiresAuth?: boolean;
  timeoutMs?: number;
  token?: string;
};
