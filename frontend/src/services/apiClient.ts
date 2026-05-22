import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import {
  clearStoredTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
  getStoredWorkspaceId,
  setStoredTokens,
} from '@/utils/storage';
import type { ApiResponse, AuthPayload } from '@/types/api';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1';

export const publicClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

function processQueue(error: Error | null, token: string | null = null): void {
  refreshQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  refreshQueue = [];
}

function attachAuthInterceptor(client: typeof apiClient): void {
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getStoredAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const workspaceId = getStoredWorkspaceId();
    if (workspaceId) {
      config.headers['X-Workspace-Id'] = workspaceId;
    }
    return config;
  });
}

attachAuthInterceptor(apiClient);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      const message =
        error.response?.data?.message ?? error.message ?? 'Something went wrong';
      return Promise.reject(new Error(message));
    }

    const refreshToken = getStoredRefreshToken();
    if (!refreshToken) {
      clearStoredTokens();
      return Promise.reject(new Error('Session expired'));
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            originalRequest._retry = true;
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await publicClient.post<ApiResponse<AuthPayload>>('/auth/refresh', {
        refreshToken,
      });
      const payload = data.data;
      setStoredTokens(payload.accessToken, payload.refreshToken);
      processQueue(null, payload.accessToken);
      originalRequest.headers.Authorization = `Bearer ${payload.accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as Error);
      clearStoredTokens();
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign('/login');
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

publicClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message =
      error.response?.data?.message ?? error.message ?? 'Something went wrong';
    return Promise.reject(new Error(message));
  },
);
