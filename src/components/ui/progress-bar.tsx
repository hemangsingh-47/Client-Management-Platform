import React from 'react';
import { cn } from '@/lib/utils';

export type ProgressBarVariant = 'brand' | 'success' | 'warning' | 'error' | 'default';
export type ProgressBarSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: ProgressBarVariant;
  size?: ProgressBarSize;
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  variant = 'brand',
  size = 'md',
  showLabel = false,
  className,
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const sizeClasses: Record<ProgressBarSize, string> = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantBarClasses: Record<ProgressBarVariant, string> = {
    brand: 'bg-brand-primary',
    success: 'bg-success-text',
    warning: 'bg-warning-text',
    error: 'bg-error-text',
    default: 'bg-text-secondary',
  };

  return (
    <div className={cn('w-full space-y-1', className)} {...props}>
      <div
        className={cn(
          'w-full bg-surface-subtle border border-border-subtle rounded-full overflow-hidden',
          sizeClasses[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            variantBarClasses[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-[11px] text-text-muted font-mono">
          <span>{percentage}%</span>
        </div>
      )}
    </div>
  );
}

export default ProgressBar;

