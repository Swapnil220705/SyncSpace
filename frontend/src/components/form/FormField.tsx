import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { Input } from '@/components/ui/Input';

interface FormFieldProps {
  label: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
}

export function FormField({
  label,
  registration,
  error,
  type = 'text',
  autoComplete,
  placeholder,
}: FormFieldProps) {
  return (
    <Input
      label={label}
      type={type}
      autoComplete={autoComplete}
      placeholder={placeholder}
      error={error?.message}
      {...registration}
    />
  );
}
