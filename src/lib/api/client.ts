/**
 * FreelanceHub Centralized API Client
 * Provides robust, type-safe HTTP fetch wrapper with error handling and query serialization.
 */

export class ApiClientError extends Error {
  public statusCode: number;
  public errors?: Record<string, string[] | string>;

  constructor(
    message: string,
    statusCode: number,
    errors?: Record<string, string[] | string>
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
}

interface ApiResponsePayload<T> {
  success?: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string | string[]>;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, body, headers = {}, ...rest } = options;

  let url = endpoint;
  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...rest,
    headers: reqHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  let payload: ApiResponsePayload<T>;
  try {
    payload = (await response.json()) as ApiResponsePayload<T>;
  } catch {
    if (!response.ok) {
      throw new ApiClientError(
        `HTTP Error ${response.status}: ${response.statusText}`,
        response.status
      );
    }
    return {} as T;
  }

  if (!response.ok || payload?.success === false) {
    const errorMsg = payload?.message || `Request failed with status ${response.status}`;
    throw new ApiClientError(errorMsg, response.status, payload?.errors);
  }

  return (payload.data !== undefined ? payload.data : payload) as T;
}

