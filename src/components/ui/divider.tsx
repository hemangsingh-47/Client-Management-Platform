import React from 'react';
import { cn } from '@/lib/utils';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  label?: React.ReactNode;
}

export function Divider({
  orientation = 'horizontal',
  label,
  className,
  ...props
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn('inline-block h-full min-h-[1em] w-px self-stretch bg-border', className)}
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={cn('flex items-center my-4 text-xs text-text-muted', className)}
        {...props}
      >
        <div className="flex-grow border-t border-border" />
        <span className="px-3 uppercase tracking-wider text-[11px] font-medium">{label}</span>
        <div className="flex-grow border-t border-border" />
      </div>
    );
  }

  return (
    <hr
      role="separator"
      aria-orientation="horizontal"
      className={cn('my-4 border-0 border-t border-border', className)}
      {...props}
    />
  );
}

export default Divider;

