import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { FormField } from '@/components/form/FormField';
import { Button } from '@/components/ui/Button';
import { useWorkspaceStore } from '@/stores/workspaceStore';

const schema = z.object({
  name: z.string().min(1, 'Project name is required').max(120),
  description: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ open, onClose }: CreateProjectModalProps) {
  const createProject = useWorkspaceStore((s) => s.createProject);
  const isLoading = useWorkspaceStore((s) => s.isLoading);
  const error = useWorkspaceStore((s) => s.error);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    await createProject({
      name: values.name,
      description: values.description || undefined,
    });
    reset();
    onClose();
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New project"
      description="Organize tasks, milestones, and delivery in one place."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField label="Project name" registration={register('name')} error={errors.name} />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-content">Description (optional)</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus-ring focus:border-brand"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Create project
          </Button>
        </div>
      </form>
    </Modal>
  );
}
