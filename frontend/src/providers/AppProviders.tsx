import { useEffect, type ReactNode } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { useWorkspaceStore } from '@/stores/workspaceStore';

function Bootstrap({ children }: { children: ReactNode }) {
  const initialize = useAuthStore((s) => s.initialize);
  const initTheme = useThemeStore((s) => s.init);
  const fetchWorkspaces = useWorkspaceStore((s) => s.fetchWorkspaces);
  const isAuthInitialized = useAuthStore((s) => s.isInitialized);
  const token = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    initTheme();
    void initialize();
  }, [initTheme, initialize]);

  useEffect(() => {
    if (isAuthInitialized && token) {
      void fetchWorkspaces();
    }
  }, [isAuthInitialized, token, fetchWorkspaces]);

  return <>{children}</>;
}

export function AppProviders() {
  return (
    <Bootstrap>
      <RouterProvider router={router} />
    </Bootstrap>
  );
}
