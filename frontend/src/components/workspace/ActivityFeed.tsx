import { formatDistanceToNow } from '@/utils/date';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import type { ActivityItem } from '@/types/workspace';

interface ActivityFeedProps {
  activities: ActivityItem[];
  limit?: number;
  compact?: boolean;
}

export function ActivityFeed({ activities, limit, compact }: ActivityFeedProps) {
  const items = limit ? activities.slice(0, limit) : activities;

  if (items.length === 0) {
    return (
      <Card className={compact ? 'p-4' : undefined}>
        <p className="text-sm text-content-muted">No activity yet. Create a project or invite someone.</p>
      </Card>
    );
  }

  return (
    <Card className={compact ? 'p-4' : undefined}>
      {!compact && <h2 className="font-semibold text-content">Activity</h2>}
      <ul className={compact ? 'space-y-3' : 'mt-4 space-y-4'}>
        {items.map((item) => (
          <li key={item.id} className="flex gap-3 animate-slide-up">
            <Avatar name={item.user.name} src={item.user.avatarUrl} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-content">
                <span className="font-medium">{item.user.name}</span>{' '}
                <span className="text-content-muted">{item.message}</span>
              </p>
              <p className="mt-0.5 text-xs text-content-subtle">
                {formatDistanceToNow(item.createdAt)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
