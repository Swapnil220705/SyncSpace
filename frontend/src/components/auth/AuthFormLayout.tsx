import type { ReactNode } from 'react';
import { Logo } from '@/components/ui/Logo';
import { Card } from '@/components/ui/Card';

interface AuthFormLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthFormLayout({ title, subtitle, children, footer }: AuthFormLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-muted px-4 py-12">
      <div className="mb-8">
        <Logo />
      </div>
      <Card className="w-full max-w-md">
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-content">{title}</h1>
          <p className="text-sm text-content-muted">{subtitle}</p>
        </div>
        {children}
        {footer && <div className="mt-6 border-t border-border pt-4 text-center text-sm">{footer}</div>}
      </Card>
    </div>
  );
}
