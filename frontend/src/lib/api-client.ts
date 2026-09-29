import { ApiResponse } from '@/types';

function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // In local browser environment, default to local backend port 5000 if running locally
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5000/api';
  }
  return '/api';
}

async function fetcher<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = res.headers.get('content-type');
    
    // Check if response is valid JSON
    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();
      return data;
    }

    // If server returned HTML (e.g., 404 / 500 HTML page starting with <!DOCTYPE)
    const textResponse = await res.text();
    console.warn(`[API Client Warning] Non-JSON response received from ${url} (Status: ${res.status}):`, textResponse.substring(0, 150));

    return {
      success: false,
      error: {
        code: 'NON_JSON_RESPONSE',
        message: `API endpoint returned non-JSON content (Status: ${res.status}).`,
      },
    };
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
