import { create } from 'zustand';
import * as authService from '@/services/authService';
import type { LoginCredentials, RegisterCredentials, User } from '@/types/api';
import { clearStoredToken, getStoredToken, setStoredToken } from '@/utils/storage';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: getStoredToken(),
  isLoading: false,
  isInitialized: false,
  error: null,

  clearError: () => set({ error: null }),

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authService.login(credentials);
      setStoredToken(token);
      set({ user, token, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  register: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authService.register(credentials);
      setStoredToken(token);
      set({ user, token, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  logout: () => {
    clearStoredToken();
    set({ user: null, token: null, error: null });
  },

  fetchMe: async () => {
    const user = await authService.fetchCurrentUser();
    set({ user });
  },

  initialize: async () => {
    const token = getStoredToken();
    if (!token) {
      set({ isInitialized: true });
      return;
    }
    set({ isLoading: true });
    try {
      await get().fetchMe();
    } catch {
      clearStoredToken();
      set({ user: null, token: null });
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },
}));
