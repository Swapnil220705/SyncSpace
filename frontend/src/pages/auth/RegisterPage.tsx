import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { AuthFormLayout } from '@/components/auth/AuthFormLayout';
import { FormField } from '@/components/form/FormField';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { registerSchema, type RegisterFormValues } from '@/utils/authSchemas';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    clearError();
    try {
      await registerUser(values);
      navigate('/dashboard', { replace: true });
    } catch {
      /* store handles error */
    }
  });

  return (
    <AuthFormLayout
      title="Create your workspace"
      subtitle="Start managing projects with AI assistance"
      footer={
        <span className="text-content-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand hover:underline">
            Sign in
          </Link>
        </span>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <FormField
          label="Full name"
          autoComplete="name"
          registration={register('name')}
          error={errors.name}
        />
        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          registration={register('email')}
          error={errors.email}
        />
        <FormField
          label="Password"
          type="password"
          autoComplete="new-password"
          registration={register('password')}
          error={errors.password}
        />
        <p className="text-xs text-content-muted">
          At least 8 characters with uppercase, lowercase, and a number.
        </p>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Create account
        </Button>
      </form>
    </AuthFormLayout>
  );
}
