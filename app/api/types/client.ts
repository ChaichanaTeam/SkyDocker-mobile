export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export type HttpResult = {
  ok: boolean;
  status: number;
  body: unknown;
};

export type RequestOptions = {
  method: HttpMethod;
  body?: unknown;
  requiresAuth?: boolean;
  timeoutMs?: number;
  signal?: AbortSignal;
  token?: string;
  headers?: Record<string, string>;
};
