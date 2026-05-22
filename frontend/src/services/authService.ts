import type { ApiResponse, AuthPayload, LoginCredentials, RegisterCredentials, User } from '@/types/api';
import { apiClient } from './apiClient';

export async function login(credentials: LoginCredentials): Promise<AuthPayload> {
  const { data } = await apiClient.post<ApiResponse<AuthPayload>>('/auth/login', credentials);
  return data.data;
}

export async function register(credentials: RegisterCredentials): Promise<AuthPayload> {
  const { data } = await apiClient.post<ApiResponse<AuthPayload>>('/auth/register', credentials);
  return data.data;
}

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me');
  return data.data.user;
}
