import { create } from 'zustand';
import * as authService from '@/services/authService';
import type {
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordInput,
  UpdateProfileInput,
  User,
} from '@/types/api';
import {
  clearStoredTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredTokens,
} from '@/utils/storage';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshSession: () => Promise<void>;
  fetchMe: () => Promise<void>;
  initialize: () => Promise<void>;
  forgotPassword: (input: ForgotPasswordInput) => Promise<{ message: string; resetUrl?: string }>;
  resetPassword: (input: ResetPasswordInput) => Promise<void>;
  updateProfile: (input: UpdateProfileInput) => Promise<void>;
  changePassword: (input: ChangePasswordInput) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  setSession: (user: User, accessToken: string, refreshToken: string) => void;
  clearError: () => void;
}

function persistSession(user: User, accessToken: string, refreshToken: string): void {
  setStoredTokens(accessToken, refreshToken);
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: getStoredAccessToken(),
  refreshToken: getStoredRefreshToken(),
  isLoading: false,
  isInitialized: false,
  error: null,

  clearError: () => set({ error: null }),

  setSession: (user, accessToken, refreshToken) => {
    persistSession(user, accessToken, refreshToken);
    set({ user, accessToken, refreshToken, error: null });
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { user, accessToken, refreshToken } = await authService.login(credentials);
      persistSession(user, accessToken, refreshToken);
      set({ user, accessToken, refreshToken, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  register: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { user, accessToken, refreshToken } = await authService.register(credentials);
      persistSession(user, accessToken, refreshToken);
      set({ user, accessToken, refreshToken, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  refreshSession: async () => {
    const refreshToken = get().refreshToken ?? getStoredRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token');
    }
    const { user, accessToken, refreshToken: newRefresh } =
      await authService.refreshSession(refreshToken);
    persistSession(user, accessToken, newRefresh);
    set({ user, accessToken, refreshToken: newRefresh });
  },

  logout: async () => {
    const refreshToken = get().refreshToken ?? getStoredRefreshToken();
    try {
      await authService.logout(refreshToken);
    } finally {
      clearStoredTokens();
      set({ user: null, accessToken: null, refreshToken: null, error: null });
    }
  },

  logoutAll: async () => {
    try {
      await authService.logoutAll();
    } finally {
      clearStoredTokens();
      set({ user: null, accessToken: null, refreshToken: null, error: null });
    }
  },

  fetchMe: async () => {
    const user = await authService.fetchCurrentUser();
    set({ user });
  },

  initialize: async () => {
    const accessToken = getStoredAccessToken();
    const refreshToken = getStoredRefreshToken();

    if (!accessToken && !refreshToken) {
      set({ isInitialized: true });
      return;
    }

    set({ isLoading: true, accessToken, refreshToken });
    try {
      await get().fetchMe();
    } catch {
      if (refreshToken) {
        try {
          await get().refreshSession();
          await get().fetchMe();
        } catch {
          clearStoredTokens();
          set({ user: null, accessToken: null, refreshToken: null });
        }
      } else {
        clearStoredTokens();
        set({ user: null, accessToken: null, refreshToken: null });
      }
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },

  forgotPassword: async (input) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authService.forgotPassword(input);
      set({ isLoading: false });
      return result;
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  resetPassword: async (input) => {
    set({ isLoading: true, error: null });
    try {
      await authService.resetPassword(input);
      set({ isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  updateProfile: async (input) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.updateProfile(input);
      set({ user, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  changePassword: async (input) => {
    set({ isLoading: true, error: null });
    try {
      await authService.changePassword(input);
      clearStoredTokens();
      set({ user: null, accessToken: null, refreshToken: null, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  uploadAvatar: async (file) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.uploadAvatar(file);
      set({ user, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },
}));
