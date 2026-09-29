import { ApiResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

async function fetcher<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`[API Client Error] Request failed for ${endpoint}:`, error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Failed to connect to Hariom Pipes API server. Please try again later.',
      },
    };
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) => fetcher<T>(endpoint, { method: 'GET', ...options }),
  post: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    fetcher<T>(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),
  patch: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    fetcher<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body), ...options }),
  delete: <T>(endpoint: string, options?: RequestInit) => fetcher<T>(endpoint, { method: 'DELETE', ...options }),
};
