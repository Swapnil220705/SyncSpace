import { Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Project } from '@/types/workspace';
import { cn } from '@/utils/cn';

const statusVariant: Record<string, 'default' | 'brand' | 'success' | 'warning' | 'muted'> = {
  planning: 'muted',
  active: 'brand',
  paused: 'warning',
  completed: 'success',
  archived: 'default',
};

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => void;
  canDelete?: boolean;
}

export function ProjectCard({ project, onDelete, canDelete }: ProjectCardProps) {
  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-300',
        'hover:-translate-y-0.5 hover:border-border-strong hover:shadow-elevated',
      )}
    >
      <div
        className="absolute left-0 top-0 h-1 w-full"
        style={{ backgroundColor: project.color }}
      />
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold tracking-tight text-content">{project.name}</h3>
          {project.description && (
            <p className="mt-1 line-clamp-2 text-sm text-content-muted">{project.description}</p>
          )}
        </div>
        {canDelete && onDelete && (
          <button
            type="button"
            onClick={() => onDelete(project.id)}
            className="rounded-lg p-1.5 text-content-subtle opacity-0 transition group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500"
            aria-label="Delete project"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Badge variant={statusVariant[project.status] ?? 'default'}>{project.status}</Badge>
        <span className="text-xs font-medium text-content-muted">{project.progress}%</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${project.progress}%`, backgroundColor: project.color }}
        />
      </div>
    </Card>
  );
}
