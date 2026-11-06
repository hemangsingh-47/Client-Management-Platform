import React, { forwardRef, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Check, Minus } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, checked, disabled, indeterminate, onChange, id, ...props }, forwardedRef) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const inputRef = (forwardedRef as React.RefObject<HTMLInputElement>) || internalRef;

    useEffect(() => {
      if (inputRef && 'current' in inputRef && inputRef.current) {
        inputRef.current.indeterminate = !!indeterminate;
      }
    }, [indeterminate, inputRef]);

    const generatedId = id || (label ? `cb-${String(label).toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <label
        htmlFor={generatedId}
        className={cn(
          'inline-flex items-start gap-2.5 cursor-pointer select-none',
          disabled && 'cursor-not-allowed opacity-60',
          className
        )}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            ref={inputRef}
            id={generatedId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              'h-4 w-4 rounded border border-border bg-surface transition-colors',
              'peer-checked:bg-brand-primary peer-checked:border-brand-primary text-white',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-brand-primary peer-focus-visible:ring-offset-1',
              'hover:border-text-secondary'
            )}
          >
            {checked && !indeterminate && (
              <Check className="h-3 w-3 stroke-[3] mx-auto text-white" />
            )}
            {indeterminate && (
              <Minus className="h-3 w-3 stroke-[3] mx-auto text-white" />
            )}
          </div>
        </div>

        {(label || description) && (
          <div className="flex flex-col text-sm">
            {label && <span className="font-medium text-text-primary leading-tight">{label}</span>}
            {description && <span className="text-xs text-text-secondary mt-0.5">{description}</span>}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

