import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Sparkles } from 'lucide-react';

export function AiAssistantPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-content">
          <Sparkles className="h-6 w-6 text-brand" />
          AI Assistant
        </h1>
        <p className="mt-1 text-sm text-content-muted">
          Draft tasks, summarize threads, and plan sprints with context from your workspace.
        </p>
      </div>
      <Card className="min-h-[320px] flex flex-col">
        <div className="flex-1 rounded-xl border border-dashed border-border bg-surface-muted p-6 text-sm text-content-muted">
          Connect your OpenAI or Anthropic API key in Settings to enable live AI responses.
          This page is scaffolded for your integration layer.
        </div>
        <div className="mt-4 flex gap-2">
          <input
            className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm focus-ring"
            placeholder="Ask SyncSpace to plan your next sprint…"
          />
          <Button>Send</Button>
        </div>
      </Card>
    </div>
  );
}
