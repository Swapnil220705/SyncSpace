import { create } from 'zustand';
import {
  applyThemeToDocument,
  getStoredTheme,
  setStoredTheme,
  type ThemeMode,
} from '@/utils/storage';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
  init: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: getStoredTheme(),

  setMode: (mode) => {
    setStoredTheme(mode);
    applyThemeToDocument(mode);
    set({ mode });
  },

  toggle: () => {
    const next = get().mode === 'dark' ? 'light' : 'dark';
    get().setMode(next);
  },

  init: () => {
    applyThemeToDocument(get().mode);
  },
}));
