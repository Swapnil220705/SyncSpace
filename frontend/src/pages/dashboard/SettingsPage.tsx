import { Card } from '@/components/ui/Card';
import { useTheme } from '@/hooks/useTheme';
import type { ThemeMode } from '@/utils/storage';

const themeOptions: { value: ThemeMode; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

export function SettingsPage() {
  const { mode, setMode } = useTheme();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-content">Settings</h1>
        <p className="text-sm text-content-muted">Workspace preferences and integrations.</p>
      </div>
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
        <h2 className="font-medium text-content">API integrations</h2>
        <p className="mt-2 text-sm text-content-muted">
          Add <code className="rounded bg-surface-muted px-1">OPENAI_API_KEY</code> on the backend
          when you implement the AI service module.
        </p>
      </Card>
    </div>
  );
}
