import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button';

export function ThemeToggle() {
  const { mode, setMode } = useTheme();

  const next = mode === 'dark' ? 'light' : 'dark';

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label="Toggle theme"
      onClick={() => setMode(next)}
      className="!px-2"
    >
      {mode === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
