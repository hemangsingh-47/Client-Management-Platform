import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'default' | 'brand' | 'success' | 'warning' | 'error' | 'info' | 'outline';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
    default: {
      container: 'bg-surface-subtle text-text-secondary border border-border',
      dot: 'bg-text-secondary',
    },
    brand: {
      container: 'bg-brand-sage-light text-brand-forest border border-brand-sage/40 dark:text-brand-sage',
      dot: 'bg-brand-primary',
    },
    success: {
      container: 'bg-success-bg text-success-text border border-success-border',
      dot: 'bg-success-text',
    },
    warning: {
      container: 'bg-warning-bg text-warning-text border border-warning-border',
      dot: 'bg-warning-text',
    },
    error: {
      container: 'bg-error-bg text-error-text border border-error-border',
      dot: 'bg-error-text',
    },
    info: {
      container: 'bg-info-bg text-info-text border border-info-border',
      dot: 'bg-info-text',
    },
    outline: {
      container: 'bg-transparent text-text-primary border border-border',
      dot: 'bg-text-primary',
    },
  };

  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'text-[11px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-0.5 gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full select-none tracking-wide transition-colors',
        variantStyles[variant].container,
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('h-1.5 w-1.5 rounded-full shrink-0', variantStyles[variant].dot)}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
}

export default Badge;

