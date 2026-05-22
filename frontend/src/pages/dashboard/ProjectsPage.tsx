import { useState } from 'react';
import { FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CreateProjectModal } from '@/components/workspace/CreateProjectModal';
import { ProjectCard } from '@/components/workspace/ProjectCard';
import { useWorkspaceStore } from '@/stores/workspaceStore';

export function ProjectsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const projects = useWorkspaceStore((s) => s.projects);
  const current = useWorkspaceStore((s) => s.currentWorkspace);
  const canCreate = useWorkspaceStore((s) => s.canCreateProject);
  const canManage = useWorkspaceStore((s) => s.canManageTeam);
  const deleteProject = useWorkspaceStore((s) => s.deleteProject);

  if (!current) return null;

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-content">Projects</h1>
          <p className="text-sm text-content-muted">
            {projects.length} project{projects.length !== 1 ? 's' : ''} in {current.name}
          </p>
        </div>
        {canCreate() && (
          <Button onClick={() => setCreateOpen(true)}>
            <FolderPlus className="h-4 w-4" />
            New project
          </Button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface-muted/30 px-6 py-16 text-center">
          <p className="text-content-muted">No projects yet. Create one to get started.</p>
          {canCreate() && (
            <Button className="mt-4" variant="secondary" onClick={() => setCreateOpen(true)}>
              Create project
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 animate-stagger">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              canDelete={canManage()}
              onDelete={(id) => void deleteProject(id)}
            />
          ))}
        </div>
      )}

      <CreateProjectModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
