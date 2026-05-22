import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  Settings,
  Users,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Logo } from '@/components/ui/Logo';

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/dashboard/projects', label: 'Projects', icon: FolderKanban },
  { to: '/dashboard/ai', label: 'AI Assistant', icon: Sparkles },
  { to: '/dashboard/team', label: 'Team', icon: Users },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface-elevated lg:flex">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-muted text-brand'
                  : 'text-content-muted hover:bg-surface-muted hover:text-content',
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-border p-4">
        <p className="text-xs text-content-subtle">SyncSpace v1.0 — AI project management</p>
      </div>
    </aside>
  );
}
