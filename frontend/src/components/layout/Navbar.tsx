import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/Button';

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-surface/80 px-4 backdrop-blur-md lg:px-6">
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden !px-2"
        aria-label="Open menu"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="relative hidden flex-1 max-w-md md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-subtle" />
        <input
          type="search"
          placeholder="Search projects, tasks…"
          className="h-9 w-full rounded-lg border border-border bg-surface-muted pl-9 pr-3 text-sm focus-ring"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="sm" className="!px-2" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <ThemeToggle />
        <div className="hidden items-center gap-3 sm:flex">
          <div className="text-right">
            <p className="text-sm font-medium text-content">{user?.name}</p>
            <p className="text-xs text-content-subtle">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-content-muted hover:bg-surface-muted hover:text-content transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
