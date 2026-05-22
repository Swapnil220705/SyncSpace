import type {
  ApiResponse,
  AuthPayload,
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordInput,
  UpdateProfileInput,
  User,
} from '@/types/api';
import { apiClient, publicClient } from './apiClient';

export async function login(credentials: LoginCredentials): Promise<AuthPayload> {
  const { data } = await publicClient.post<ApiResponse<AuthPayload>>('/auth/login', credentials);
  return data.data;
}

export async function register(credentials: RegisterCredentials): Promise<AuthPayload> {
  const { data } = await publicClient.post<ApiResponse<AuthPayload>>('/auth/register', credentials);
  return data.data;
}

export async function refreshSession(refreshToken: string): Promise<AuthPayload> {
  const { data } = await publicClient.post<ApiResponse<AuthPayload>>('/auth/refresh', {
    refreshToken,
  });
  return data.data;
}

export async function logout(refreshToken: string | null): Promise<void> {
  if (refreshToken) {
    await publicClient.post('/auth/logout', { refreshToken });
  }
}

export async function logoutAll(): Promise<void> {
  await apiClient.post('/auth/logout-all');
}

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me');
  return data.data.user;
}

export async function forgotPassword(input: ForgotPasswordInput): Promise<{
  message: string;
  resetUrl?: string;
}> {
  const { data } = await publicClient.post<ApiResponse<{ message: string; resetUrl?: string }>>(
    '/auth/forgot-password',
    input,
  );
  return data.data;
}

export async function resetPassword(input: ResetPasswordInput): Promise<void> {
  await publicClient.post('/auth/reset-password', input);
}

export async function updateProfile(input: UpdateProfileInput): Promise<User> {
  const { data } = await apiClient.patch<ApiResponse<{ user: User }>>('/auth/profile', input);
  return data.data.user;
}

export async function changePassword(input: ChangePasswordInput): Promise<void> {
  await apiClient.post('/auth/change-password', input);
}

export async function uploadAvatar(file: File): Promise<User> {
  const formData = new FormData();
  formData.append('avatar', file);
  const { data } = await apiClient.post<ApiResponse<{ user: User }>>('/auth/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data.user;
}
