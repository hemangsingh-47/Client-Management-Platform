'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Theme } from '@/types/theme';

export interface ThemeToggleProps {
  className?: string;
  variant?: 'segmented' | 'button';
}

export function ThemeToggle({ className, variant = 'segmented' }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frameId);
  }, []);

  if (!mounted) {
    if (variant === 'button') {
      return (
        <div
          aria-hidden="true"
          className={cn(
            'h-8 w-8 rounded-lg border border-border bg-surface shrink-0',
            className
          )}
        />
      );
    }
    return (
      <div
        aria-hidden="true"
        className={cn(
          'h-8 w-24 rounded-lg bg-surface-subtle border border-border shrink-0',
          className
        )}
      />
    );
  }

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
        className={cn(
          'inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary shrink-0',
          className
        )}
      >
        {resolvedTheme === 'dark' ? (
          <Sun size={16} strokeWidth={1.75} />
        ) : (
          <Moon size={16} strokeWidth={1.75} />
        )}
      </button>
    );
  }

  const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun size={14} strokeWidth={1.75} /> },
    { value: 'system', label: 'System', icon: <Monitor size={14} strokeWidth={1.75} /> },
    { value: 'dark', label: 'Dark', icon: <Moon size={14} strokeWidth={1.75} /> },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Theme selection"
      className={cn(
        'inline-flex items-center p-0.5 rounded-lg border border-border bg-surface-subtle text-text-secondary shrink-0',
        className
      )}
    >
      {options.map((opt) => {
        const isActive = theme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => setTheme(opt.value)}
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
              isActive
                ? 'bg-surface text-text-primary shadow-xs border border-border'
                : 'text-text-muted hover:text-text-primary'
            )}
          >
            {opt.icon}
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default ThemeToggle;
