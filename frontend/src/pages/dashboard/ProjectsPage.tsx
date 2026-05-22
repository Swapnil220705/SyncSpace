import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const placeholderProjects = [
  { name: 'Platform rebuild', status: 'In progress', progress: 68 },
  { name: 'Mobile launch', status: 'Planning', progress: 22 },
  { name: 'Customer portal', status: 'Review', progress: 91 },
];

export function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-content">Projects</h1>
          <p className="text-sm text-content-muted">Manage boards, milestones, and delivery.</p>
        </div>
        <Button>New project</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {placeholderProjects.map((project) => (
          <Card key={project.name} className="cursor-pointer transition-shadow hover:shadow-elevated">
            <h3 className="font-medium text-content">{project.name}</h3>
            <p className="mt-1 text-xs text-content-subtle">{project.status}</p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-brand"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
