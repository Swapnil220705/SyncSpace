import { Building2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CreateWorkspaceModal } from './CreateWorkspaceModal';
import { useState } from 'react';

export function EmptyWorkspace() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card className="mx-auto max-w-lg text-center animate-scale-in">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-muted text-brand">
          <Building2 className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-xl font-semibold tracking-tight text-content">
          Create your first workspace
        </h2>
        <p className="mt-2 text-sm text-content-muted">
          Workspaces are shared spaces for your team—like Slack channels or Notion teams.
        </p>
        <Button className="mt-6" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          New workspace
        </Button>
      </Card>
      <CreateWorkspaceModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
