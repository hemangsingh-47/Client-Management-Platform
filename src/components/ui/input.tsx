import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  hasError?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', size = 'md', hasError, leftIcon, rightIcon, disabled, ...props }, ref) => {
    const sizeStyles: Record<InputSize, string> = {
      sm: 'h-8 text-xs px-2.5',
      md: 'h-9 text-sm px-3',
      lg: 'h-10 text-sm px-3.5',
    };

    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-text-muted">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          className={cn(
            'w-full rounded-lg border bg-surface text-text-primary placeholder:text-text-muted transition-colors',
            'border-border focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary',
            'disabled:bg-surface-subtle disabled:text-text-muted disabled:cursor-not-allowed',
            hasError && 'border-error-border focus:border-error-text focus:ring-error-text text-error-text',
            leftIcon && (size === 'sm' ? 'pl-8' : 'pl-9'),
            rightIcon && (size === 'sm' ? 'pr-8' : 'pr-9'),
            sizeStyles[size],
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 flex items-center pointer-events-none text-text-muted">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

