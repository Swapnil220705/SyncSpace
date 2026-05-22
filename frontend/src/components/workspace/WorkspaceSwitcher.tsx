import { useState } from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { CreateWorkspaceModal } from './CreateWorkspaceModal';

export function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const current = useWorkspaceStore((s) => s.currentWorkspace);
  const selectWorkspace = useWorkspaceStore((s) => s.selectWorkspace);
  const isLoading = useWorkspaceStore((s) => s.isLoading);

  return (
    <>
      <div className="relative px-3 pb-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          disabled={isLoading}
          className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2.5 text-left transition hover:border-border-strong hover:shadow-card"
        >
          {current ? (
            <>
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                style={{ backgroundColor: current.iconColor }}
              >
                {current.name.charAt(0).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-content">
                  {current.name}
                </span>
                <span className="block truncate text-xs text-content-subtle capitalize">
                  {current.role} · {current.memberCount} members
                </span>
              </span>
            </>
          ) : (
            <span className="text-sm text-content-muted">Select workspace</span>
          )}
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-content-subtle" />
        </button>

        {open && (
          <>
            <button
              type="button"
              aria-label="Close"
              className="fixed inset-0 z-30"
              onClick={() => setOpen(false)}
            />
            <div className="absolute left-3 right-3 top-full z-40 mt-1 overflow-hidden rounded-xl border border-border bg-surface-elevated py-1 shadow-elevated animate-scale-in">
              <p className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-content-subtle">
                Workspaces
              </p>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => {
                    void selectWorkspace(ws.id);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-surface-muted"
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white"
                    style={{ backgroundColor: ws.iconColor }}
                  >
                    {ws.name.charAt(0)}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-content">{ws.name}</span>
                  {current?.id === ws.id && <Check className="h-4 w-4 text-brand" />}
                </button>
              ))}
              <div className="border-t border-border p-1">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setCreateOpen(true);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-brand transition hover:bg-brand-muted"
                >
                  <Plus className="h-4 w-4" />
                  Create workspace
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <CreateWorkspaceModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
}
