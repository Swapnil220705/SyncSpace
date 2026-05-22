import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/hooks/useAuth';
import { useWorkspaceStore } from '@/stores/workspaceStore';

export function InvitePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, isInitialized } = useAuth();
  const acceptInvite = useWorkspaceStore((s) => s.acceptInvite);
  const error = useWorkspaceStore((s) => s.error);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const token = searchParams.get('token');

  useEffect(() => {
    if (!isInitialized || !token) return;
    if (!isAuthenticated) return;

    setStatus('loading');
    acceptInvite(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [isInitialized, isAuthenticated, token, acceptInvite]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-muted px-4">
      <Logo />
      <Card className="mt-8 w-full max-w-md text-center animate-scale-in">
        {!token ? (
          <>
            <h1 className="text-xl font-semibold text-content">Invalid invitation</h1>
            <p className="mt-2 text-sm text-content-muted">This invite link is missing a token.</p>
            <Link
              to="/"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-brand px-4 text-sm font-medium text-white hover:bg-brand-hover"
            >
              Go home
            </Link>
          </>
        ) : !isAuthenticated ? (
          <>
            <h1 className="text-xl font-semibold text-content">You&apos;re invited!</h1>
            <p className="mt-2 text-sm text-content-muted">
              Sign in or create an account to join the workspace.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Link
                to={`/login?redirect=/invite?token=${encodeURIComponent(token)}`}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-brand px-4 text-sm font-medium text-white hover:bg-brand-hover"
              >
                Sign in
              </Link>
              <Link
                to={`/register?redirect=/invite?token=${encodeURIComponent(token)}`}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-surface-elevated px-4 text-sm font-medium text-content hover:bg-surface-muted"
              >
                Create account
              </Link>
            </div>
          </>
        ) : status === 'loading' ? (
          <div className="flex flex-col items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
            <p className="mt-4 text-sm text-content-muted">Joining workspace…</p>
          </div>
        ) : status === 'success' ? (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
            <h1 className="mt-4 text-xl font-semibold text-content">Welcome to the team!</h1>
            <p className="mt-2 text-sm text-content-muted">You&apos;ve joined the workspace.</p>
            <Button className="mt-6" onClick={() => navigate('/dashboard')}>
              Open dashboard
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-content">Couldn&apos;t accept invite</h1>
            <p className="mt-2 text-sm text-red-500">{error ?? 'The link may be expired.'}</p>
            <Button className="mt-6" variant="secondary" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
