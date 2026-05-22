import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { FormField } from '@/components/form/FormField';
import { Button } from '@/components/ui/Button';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import type { WorkspaceRole } from '@/types/workspace';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  role: z.enum(['admin', 'member', 'guest']),
});

type FormValues = z.infer<typeof schema>;

const roles: { value: WorkspaceRole; label: string; desc: string }[] = [
  { value: 'admin', label: 'Admin', desc: 'Manage team & settings' },
  { value: 'member', label: 'Member', desc: 'Create & edit projects' },
  { value: 'guest', label: 'Guest', desc: 'View-only access' },
];

interface InviteMemberModalProps {
  open: boolean;
  onClose: () => void;
}

export function InviteMemberModal({ open, onClose }: InviteMemberModalProps) {
  const inviteMember = useWorkspaceStore((s) => s.inviteMember);
  const isLoading = useWorkspaceStore((s) => s.isLoading);
  const error = useWorkspaceStore((s) => s.error);
  const [success, setSuccess] = useState<{ message: string; inviteUrl?: string } | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', role: 'member' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSuccess(null);
    const result = await inviteMember(values.email, values.role);
    setSuccess({
      message: 'Invitation sent!',
      inviteUrl: result.inviteUrl,
    });
    reset({ email: '', role: 'member' });
  });

  function handleClose() {
    setSuccess(null);
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Invite to workspace"
      description="Send an email invitation to join your team."
    >
      {success ? (
        <div className="space-y-4">
          <p className="text-sm text-content">{success.message}</p>
          {success.inviteUrl && (
            <p className="break-all rounded-lg bg-surface-muted p-3 text-xs text-content-muted">
              Dev link:{' '}
              <a href={success.inviteUrl} className="text-brand hover:underline">
                {success.inviteUrl}
              </a>
            </p>
          )}
          <Button type="button" className="w-full" onClick={handleClose}>
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            label="Email address"
            type="email"
            registration={register('email')}
            error={errors.email}
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-content">Role</label>
            <div className="grid gap-2">
              {roles.map((r) => (
                <label
                  key={r.value}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 transition has-[:checked]:border-brand has-[:checked]:bg-brand-muted/50"
                >
                  <input
                    type="radio"
                    value={r.value}
                    {...register('role')}
                    className="mt-1 accent-brand"
                  />
                  <span>
                    <span className="block text-sm font-medium text-content">{r.label}</span>
                    <span className="text-xs text-content-muted">{r.desc}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Send invite
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
