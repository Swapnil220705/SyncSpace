import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Kanban, Zap } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

const features = [
  {
    icon: Sparkles,
    title: 'AI-powered planning',
    description: 'Generate tasks, summaries, and sprint plans from natural language.',
  },
  {
    icon: Kanban,
    title: 'Unified workspace',
    description: 'Projects, docs, and timelines in one minimal dashboard.',
  },
  {
    icon: Zap,
    title: 'Built for speed',
    description: 'Keyboard-first UX inspired by Linear and Notion.',
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 lg:px-6">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm">
              Get started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-20 pt-16 text-center lg:px-6 lg:pt-24">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-3 py-1 text-xs font-medium text-content-muted">
          <Sparkles className="h-3.5 w-3.5 text-brand" />
          AI-powered project management
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-content sm:text-5xl lg:text-6xl">
          Ship faster with clarity across every project
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-content-muted">
          SyncSpace brings your team, tasks, and AI assistant into one clean workspace —
          designed for modern SaaS teams.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/register">
            <Button size="lg">Start free</Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg">
              View demo
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-24 sm:grid-cols-3 lg:px-6">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-2xl border border-border bg-surface-elevated p-6 shadow-card"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-muted text-brand">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-content">{title}</h3>
            <p className="mt-2 text-sm text-content-muted">{description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
