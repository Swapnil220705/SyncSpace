const TOKEN_KEY = 'syncspace_token';
const THEME_KEY = 'syncspace_theme';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export type ThemeMode = 'light' | 'dark' | 'system';

export function getStoredTheme(): ThemeMode {
  const value = localStorage.getItem(THEME_KEY);
  if (value === 'light' || value === 'dark' || value === 'system') {
    return value;
  }
  return 'system';
}

export function setStoredTheme(theme: ThemeMode): void {
  localStorage.setItem(THEME_KEY, theme);
}

export function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return mode;
}

export function applyThemeToDocument(mode: ThemeMode): void {
  const resolved = resolveTheme(mode);
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}
