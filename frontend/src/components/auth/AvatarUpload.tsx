import { useEffect, useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { resolveMediaUrl } from '@/utils/media';

interface AvatarUploadProps {
  name: string;
  avatarUrl?: string;
  isLoading?: boolean;
  onUpload: (file: File) => Promise<void>;
}

export function AvatarUpload({ name, avatarUrl, isLoading, onUpload }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(resolveMediaUrl(avatarUrl));

  useEffect(() => {
    setPreview(resolveMediaUrl(avatarUrl));
  }, [avatarUrl]);
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  async function handleChange(file: File | undefined) {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    try {
      await onUpload(file);
    } catch {
      setPreview(resolveMediaUrl(avatarUrl));
    }
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        disabled={isLoading}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-muted text-lg font-semibold text-content-muted transition hover:border-brand',
          isLoading && 'opacity-70',
        )}
      >
        {preview ? (
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          initials
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition hover:opacity-100">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          ) : (
            <Camera className="h-5 w-5 text-white" />
          )}
        </span>
      </button>
      <div className="space-y-1">
        <p className="text-sm font-medium text-content">Profile photo</p>
        <p className="text-xs text-content-muted">JPG, PNG, WebP or GIF. Max 2MB.</p>
        <button
          type="button"
          disabled={isLoading}
          onClick={() => inputRef.current?.click()}
          className="text-sm font-medium text-brand hover:underline disabled:opacity-50"
        >
          Upload new photo
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => void handleChange(e.target.files?.[0])}
      />
    </div>
  );
}
