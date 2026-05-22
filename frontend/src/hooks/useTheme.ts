import { useThemeStore } from '@/stores/themeStore';

export function useTheme() {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const toggle = useThemeStore((s) => s.toggle);

  return { mode, setMode, toggle, isDark: mode === 'dark' };
}
