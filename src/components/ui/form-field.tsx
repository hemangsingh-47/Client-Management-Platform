import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

export interface FormFieldProps {
  id?: string;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function FormField({
  id,
  label,
  hint,
  error,
  required,
  optional,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col space-y-1.5 w-full', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={id}
            className="text-xs sm:text-[13px] font-medium text-text-primary flex items-center gap-1"
          >
            <span>{label}</span>
            {required && <span className="text-error-text" title="Required">*</span>}
          </label>
          {optional && (
            <span className="text-[11px] text-text-muted">Optional</span>
          )}
        </div>
      )}

      {children}

      {error ? (
        <div className="flex items-center gap-1 text-xs text-error-text mt-0.5">
          <AlertCircle size={13} className="shrink-0" strokeWidth={2} />
          <span>{error}</span>
        </div>
      ) : hint ? (
        <p className="text-xs text-text-muted mt-0.5">{hint}</p>
      ) : null}
    </div>
  );
}

export default FormField;

