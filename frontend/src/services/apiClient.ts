import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { getStoredToken, clearStoredToken } from '@/utils/storage';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      clearStoredToken();
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign('/login');
      }
    }
    const message =
      error.response?.data?.message ?? error.message ?? 'Something went wrong';
    return Promise.reject(new Error(message));
  },
);
