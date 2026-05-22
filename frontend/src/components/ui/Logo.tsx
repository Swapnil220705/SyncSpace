import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <Link to="/" className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
        S
      </span>
      {showText && (
        <span className="text-base font-semibold tracking-tight text-content">
          SyncSpace
        </span>
      )}
    </Link>
  );
}
