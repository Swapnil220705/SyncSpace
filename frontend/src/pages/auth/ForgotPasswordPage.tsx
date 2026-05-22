import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { AuthFormLayout } from '@/components/auth/AuthFormLayout';
import { FormField } from '@/components/form/FormField';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/utils/authSchemas';

export function ForgotPasswordPage() {
  const { forgotPassword, isLoading, error, clearError } = useAuth();
  const [success, setSuccess] = useState<{ message: string; resetUrl?: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    clearError();
    setSuccess(null);
    try {
      const result = await forgotPassword(values);
      setSuccess(result);
    } catch {
      /* store handles error */
    }
  });

  return (
    <AuthFormLayout
      title="Reset your password"
      subtitle="We'll send instructions if an account exists for this email"
      footer={
        <Link to="/login" className="font-medium text-brand hover:underline">
          Back to sign in
        </Link>
      }
    >
      {success ? (
        <div className="space-y-3 rounded-lg border border-border bg-surface-muted p-4 text-sm text-content">
          <p>{success.message}</p>
          {success.resetUrl && (
            <p className="break-all text-content-muted">
              Dev reset link:{' '}
              <a href={success.resetUrl} className="text-brand hover:underline">
                {success.resetUrl}
              </a>
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <FormField
            label="Email"
            type="email"
            autoComplete="email"
            registration={register('email')}
            error={errors.email}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Send reset link
          </Button>
        </form>
      )}
    </AuthFormLayout>
  );
}
