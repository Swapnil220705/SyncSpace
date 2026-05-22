import { useState } from 'react';
import { Mail, UserPlus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { InviteMemberModal } from '@/components/workspace/InviteMemberModal';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import type { WorkspaceRole } from '@/types/workspace';

const roleBadge: Record<WorkspaceRole, 'brand' | 'success' | 'warning' | 'muted'> = {
  owner: 'brand',
  admin: 'success',
  member: 'default',
  guest: 'muted',
};

export function TeamPage() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const members = useWorkspaceStore((s) => s.members);
  const invitations = useWorkspaceStore((s) => s.invitations);
  const current = useWorkspaceStore((s) => s.currentWorkspace);
  const canManage = useWorkspaceStore((s) => s.canManageTeam);
  const updateMemberRole = useWorkspaceStore((s) => s.updateMemberRole);
  const removeMember = useWorkspaceStore((s) => s.removeMember);
  const revokeInvitation = useWorkspaceStore((s) => s.revokeInvitation);
  const isLoading = useWorkspaceStore((s) => s.isLoading);

  if (!current) return null;

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-content">Team</h1>
          <p className="text-sm text-content-muted">
            {current.memberCount} members in {current.name}
          </p>
        </div>
        {canManage() && (
          <Button onClick={() => setInviteOpen(true)}>
            <UserPlus className="h-4 w-4" />
            Invite member
          </Button>
        )}
      </div>

      <Card>
        <h2 className="font-medium text-content">Members</h2>
        <ul className="mt-4 divide-y divide-border">
          {members.map((m) => (
            <li
              key={m.id}
              className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <Avatar name={m.name} src={m.avatarUrl} />
                <div>
                  <p className="font-medium text-content">{m.name}</p>
                  <p className="text-xs text-content-subtle">{m.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {canManage() && m.role !== 'owner' ? (
                  <select
                    value={m.role}
                    disabled={isLoading}
                    onChange={(e) =>
                      void updateMemberRole(m.id, e.target.value as WorkspaceRole)
                    }
                    className="rounded-lg border border-border bg-surface px-2 py-1 text-xs capitalize focus-ring"
                  >
                    <option value="admin">admin</option>
                    <option value="member">member</option>
                    <option value="guest">guest</option>
                  </select>
                ) : (
                  <Badge variant={roleBadge[m.role]}>{m.role}</Badge>
                )}
                {canManage() && m.role !== 'owner' && (
                  <button
                    type="button"
                    onClick={() => void removeMember(m.id)}
                    className="text-xs text-content-subtle hover:text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {canManage() && invitations.length > 0 && (
        <Card>
          <h2 className="flex items-center gap-2 font-medium text-content">
            <Mail className="h-4 w-4" />
            Pending invitations
          </h2>
          <ul className="mt-4 space-y-3">
            {invitations.map((inv) => (
              <li
                key={inv.id}
                className="flex items-center justify-between rounded-xl border border-border bg-surface-muted/50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-content">{inv.email}</p>
                  <p className="text-xs text-content-subtle capitalize">
                    {inv.role} · invited by {inv.invitedBy.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void revokeInvitation(inv.id)}
                  className="text-xs font-medium text-content-muted hover:text-red-500"
                >
                  Revoke
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <InviteMemberModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  );
}
