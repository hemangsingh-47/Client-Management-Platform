import React from 'react';
import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-xl border border-dashed border-border bg-surface-subtle',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary shadow-xs mb-4">
        {icon || <Inbox size={22} strokeWidth={1.75} />}
      </div>

      <h3 className="text-sm sm:text-base font-semibold text-text-primary tracking-tight">
        {title}
      </h3>

      {description && (
        <p className="mt-1 max-w-sm text-xs sm:text-sm text-text-secondary leading-normal">
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export default EmptyState;

