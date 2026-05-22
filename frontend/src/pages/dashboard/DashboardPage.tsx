import { FolderKanban, Users, Mail, Activity } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { ActivityFeed } from '@/components/workspace/ActivityFeed';
import { EmptyWorkspace } from '@/components/workspace/EmptyWorkspace';

export function DashboardPage() {
  const { user } = useAuth();
  const current = useWorkspaceStore((s) => s.currentWorkspace);
  const projects = useWorkspaceStore((s) => s.projects);
  const members = useWorkspaceStore((s) => s.members);
  const invitations = useWorkspaceStore((s) => s.invitations);
  const activities = useWorkspaceStore((s) => s.activities);
  const workspaces = useWorkspaceStore((s) => s.workspaces);

  if (workspaces.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <EmptyWorkspace />
      </div>
    );
  }

  if (!current) return null;

  const activeProjects = projects.filter((p) => p.status === 'active').length;

  const stats = [
    { label: 'Projects', value: String(projects.length), icon: FolderKanban },
    { label: 'Active', value: String(activeProjects), icon: Activity },
    { label: 'Team members', value: String(members.length), icon: Users },
    { label: 'Pending invites', value: String(invitations.length), icon: Mail },
  ];

  return (
    <div className="space-y-6">
      <div className="animate-slide-up">
        <h1 className="text-2xl font-semibold tracking-tight text-content">
          Good morning, {user?.name?.split(' ')[0] ?? 'there'}
        </h1>
        <p className="mt-1 text-sm text-content-muted">
          Overview for <span className="font-medium text-content">{current.name}</span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 animate-stagger">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="flex items-start gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-muted text-brand">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold tabular-nums text-content">{value}</p>
              <p className="text-sm text-content-muted">{label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ActivityFeed activities={activities} limit={8} />
        <Card>
          <h2 className="font-semibold text-content">Quick links</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="/dashboard/projects" className="text-brand hover:underline">
                View all projects →
              </a>
            </li>
            <li>
              <a href="/dashboard/team" className="text-brand hover:underline">
                Manage team →
              </a>
            </li>
          </ul>
          <p className="mt-6 text-sm text-content-muted">
            Your role: <span className="capitalize font-medium text-content">{current.role}</span>
          </p>
        </Card>
      </div>
    </div>
  );
}
