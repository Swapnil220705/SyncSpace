import { Sparkles, CheckCircle2, Clock, FolderKanban } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';

const stats = [
  { label: 'Active projects', value: '12', icon: FolderKanban },
  { label: 'Tasks due today', value: '8', icon: Clock },
  { label: 'Completed this week', value: '34', icon: CheckCircle2 },
  { label: 'AI suggestions', value: '5', icon: Sparkles },
];

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-content">
          Good morning, {user?.name?.split(' ')[0] ?? 'there'}
        </h1>
        <p className="mt-1 text-sm text-content-muted">
          Here&apos;s what&apos;s happening across your workspace today.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="flex items-start gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-muted text-brand">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-content">{value}</p>
              <p className="text-sm text-content-muted">{label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold text-content">Recent activity</h2>
          <ul className="mt-4 space-y-3 text-sm text-content-muted">
            <li>Design system sprint moved to In Review</li>
            <li>AI generated 6 subtasks for &quot;API v2 rollout&quot;</li>
            <li>@alex commented on onboarding flow</li>
          </ul>
        </Card>
        <Card>
          <h2 className="font-semibold text-content">AI insights</h2>
          <p className="mt-2 text-sm text-content-muted">
            3 projects are at risk of slipping this week. Ask the assistant to
            rebalance workload or draft standup notes.
          </p>
        </Card>
      </div>
    </div>
  );
}
