import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthFormLayout } from '@/components/auth/AuthFormLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { validateLogin } from '@/utils/validators';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    const validationError = validateLogin({ email, password });
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setFormError(null);
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch {
      /* error handled in store */
    }
  }

  return (
    <AuthFormLayout
      title="Welcome back"
      subtitle="Sign in to your SyncSpace workspace"
      footer={
        <span className="text-content-muted">
          No account?{' '}
          <Link to="/register" className="font-medium text-brand hover:underline">
            Create one
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {(formError || error) && (
          <p className="text-sm text-red-500">{formError ?? error}</p>
        )}
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Sign in
        </Button>
      </form>
    </AuthFormLayout>
  );
}
