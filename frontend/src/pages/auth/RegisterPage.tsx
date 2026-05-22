import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthFormLayout } from '@/components/auth/AuthFormLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { validateRegister } from '@/utils/validators';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    const validationError = validateRegister({ name, email, password });
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setFormError(null);
    try {
      await register({ name, email, password });
      navigate('/dashboard');
    } catch {
      /* error handled in store */
    }
  }

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
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
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
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {(formError || error) && (
          <p className="text-sm text-red-500">{formError ?? error}</p>
        )}
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Create account
        </Button>
      </form>
    </AuthFormLayout>
  );
}
