import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { AvatarUpload } from '@/components/auth/AvatarUpload';
import { FormField } from '@/components/form/FormField';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import {
  changePasswordSchema,
  profileSchema,
  type ChangePasswordFormValues,
  type ProfileFormValues,
} from '@/utils/authSchemas';
import type { ThemeMode } from '@/utils/storage';

const themeOptions: { value: ThemeMode; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, isLoading, error, clearError, updateProfile, changePassword, uploadAvatar, logoutAll } =
    useAuth();
  const { mode, setMode } = useTheme();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', email: '' },
  });

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({ name: user.name, email: user.email });
    }
  }, [user, profileForm]);

  const onProfileSubmit = profileForm.handleSubmit(async (values) => {
    clearError();
    await updateProfile(values);
  });

  const onPasswordSubmit = passwordForm.handleSubmit(async (values) => {
    clearError();
    await changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
    navigate('/login', { replace: true });
  });

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-content">Settings</h1>
        <p className="text-sm text-content-muted">Profile, security, and workspace preferences.</p>
      </div>

      <Card>
        <h2 className="font-medium text-content">Profile</h2>
        <p className="mt-1 text-sm text-content-muted">Update your name, email, and avatar.</p>
        <div className="mt-6">
          <AvatarUpload
            name={user.name}
            avatarUrl={user.avatarUrl}
            isLoading={isLoading}
            onUpload={uploadAvatar}
          />
        </div>
        <form onSubmit={onProfileSubmit} className="mt-6 space-y-4" noValidate>
          <FormField
            label="Full name"
            registration={profileForm.register('name')}
            error={profileForm.formState.errors.name}
          />
          <FormField
            label="Email"
            type="email"
            registration={profileForm.register('email')}
            error={profileForm.formState.errors.email}
          />
          <p className="text-xs text-content-muted capitalize">Role: {user.role}</p>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" isLoading={isLoading}>
            Save profile
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="font-medium text-content">Password</h2>
        <p className="mt-1 text-sm text-content-muted">
          Changing your password signs you out of all devices.
        </p>
        <form onSubmit={onPasswordSubmit} className="mt-6 space-y-4" noValidate>
          <FormField
            label="Current password"
            type="password"
            registration={passwordForm.register('currentPassword')}
            error={passwordForm.formState.errors.currentPassword}
          />
          <FormField
            label="New password"
            type="password"
            registration={passwordForm.register('newPassword')}
            error={passwordForm.formState.errors.newPassword}
          />
          <FormField
            label="Confirm new password"
            type="password"
            registration={passwordForm.register('confirmPassword')}
            error={passwordForm.formState.errors.confirmPassword}
          />
          <Button type="submit" variant="secondary" isLoading={isLoading}>
            Update password
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="font-medium text-content">Appearance</h2>
        <p className="mt-1 text-sm text-content-muted">Choose how SyncSpace looks on your device.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {themeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setMode(opt.value)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                mode === opt.value
                  ? 'border-brand bg-brand-muted text-brand'
                  : 'border-border text-content-muted hover:bg-surface-muted'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-medium text-content">Sessions</h2>
        <p className="mt-1 text-sm text-content-muted">
          Revoke refresh tokens on all devices where you are signed in.
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-4"
          isLoading={isLoading}
          onClick={() => void logoutAll().then(() => navigate('/login'))}
        >
          Sign out everywhere
        </Button>
      </Card>
    </div>
  );
}
