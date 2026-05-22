import { useEffect, type ReactNode } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';

function Bootstrap({ children }: { children: ReactNode }) {
  const initialize = useAuthStore((s) => s.initialize);
  const initTheme = useThemeStore((s) => s.init);

  useEffect(() => {
    initTheme();
    void initialize();
  }, [initTheme, initialize]);

  return <>{children}</>;
}

export function AppProviders() {
  return (
    <Bootstrap>
      <RouterProvider router={router} />
    </Bootstrap>
  );
}
