import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError, disabled, rows = 3, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        disabled={disabled}
        className={cn(
          'w-full rounded-lg border bg-surface p-3 text-sm text-text-primary placeholder:text-text-muted transition-colors',
          'border-border focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary',
          'disabled:bg-surface-subtle disabled:text-text-muted disabled:cursor-not-allowed',
          hasError && 'border-error-border focus:border-error-text focus:ring-error-text text-error-text',
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

