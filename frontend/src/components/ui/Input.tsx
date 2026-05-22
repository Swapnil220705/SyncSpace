import type { InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ className, label, error, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-content">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full h-10 rounded-lg border border-border bg-surface px-3 text-sm text-content placeholder:text-content-subtle transition-colors focus-ring focus:border-brand',
          error && 'border-red-500 focus:border-red-500',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
