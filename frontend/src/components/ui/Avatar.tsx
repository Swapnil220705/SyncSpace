import { cn } from '@/utils/cn';
import { resolveMediaUrl } from '@/utils/media';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

export function Avatar({ name, src, size = 'md', color, className }: AvatarProps) {
  const url = resolveMediaUrl(src);
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (url) {
    return (
      <img
        src={url}
        alt=""
        className={cn('rounded-full object-cover ring-2 ring-surface', sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-semibold text-white ring-2 ring-surface',
        sizes[size],
        className,
      )}
      style={{ backgroundColor: color ?? '#6366f1' }}
    >
      {initials}
    </div>
  );
}
