import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthFormLayout } from '@/components/auth/AuthFormLayout';
import { FormField } from '@/components/form/FormField';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/utils/authSchemas';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword, isLoading, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: searchParams.get('email') ?? '',
      token: searchParams.get('token') ?? '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    clearError();
    try {
      await resetPassword({
        email: values.email,
        token: values.token,
        password: values.password,
      });
      navigate('/login', { replace: true, state: { message: 'Password reset. Please sign in.' } });
    } catch {
      /* store handles error */
    }
  });

  return (
    <AuthFormLayout
      title="Choose a new password"
      subtitle="Enter the token from your email and a new password"
      footer={
        <Link to="/login" className="font-medium text-brand hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <FormField
          label="Email"
          type="email"
          registration={register('email')}
          error={errors.email}
        />
        <FormField
          label="Reset token"
          registration={register('token')}
          error={errors.token}
        />
        <FormField
          label="New password"
          type="password"
          autoComplete="new-password"
          registration={register('password')}
          error={errors.password}
        />
        <FormField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          registration={register('confirmPassword')}
          error={errors.confirmPassword}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Update password
        </Button>
      </form>
    </AuthFormLayout>
  );
}
