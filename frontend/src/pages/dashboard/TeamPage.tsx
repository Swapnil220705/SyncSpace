import { Card } from '@/components/ui/Card';

const members = [
  { name: 'Alex Chen', role: 'Product Lead' },
  { name: 'Jordan Lee', role: 'Engineering' },
  { name: 'Sam Rivera', role: 'Design' },
];

export function TeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-content">Team</h1>
        <p className="text-sm text-content-muted">Invite collaborators and manage roles.</p>
      </div>
      <Card>
        <ul className="divide-y divide-border">
          {members.map((m) => (
            <li key={m.name} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div>
                <p className="font-medium text-content">{m.name}</p>
                <p className="text-xs text-content-subtle">{m.role}</p>
              </div>
              <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs text-content-muted">
                Member
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
