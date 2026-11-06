import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: SelectSize;
  hasError?: boolean;
  options?: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, size = 'md', hasError, options, placeholder, children, disabled, ...props }, ref) => {
    const sizeStyles: Record<SelectSize, string> = {
      sm: 'h-8 text-xs pl-2.5 pr-8',
      md: 'h-9 text-sm pl-3 pr-9',
      lg: 'h-10 text-sm pl-3.5 pr-10',
    };

    return (
      <div className="relative flex items-center w-full">
        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            'w-full appearance-none rounded-lg border bg-surface text-text-primary transition-colors cursor-pointer',
            'border-border focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary',
            'disabled:bg-surface-subtle disabled:text-text-muted disabled:cursor-not-allowed',
            hasError && 'border-error-border focus:border-error-text focus:ring-error-text text-error-text',
            sizeStyles[size],
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <div className="absolute right-3 flex items-center pointer-events-none text-text-muted">
          <ChevronDown size={14} strokeWidth={2} />
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';

