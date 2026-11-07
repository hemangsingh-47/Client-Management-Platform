'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { User, Settings, Sliders, LogOut } from 'lucide-react';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="User profile menu"
        aria-expanded={isOpen}
        className={cn(
          'flex items-center gap-2 rounded-lg p-1 text-left transition-colors cursor-pointer',
          'hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary'
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-forest text-brand-sage-light text-xs font-bold ring-1 ring-border shadow-2xs">
          JD
        </div>
        <div className="hidden md:flex flex-col text-left pr-1">
          <span className="text-xs font-semibold text-text-primary leading-tight">Jane Doe</span>
          <span className="text-[10px] text-text-muted leading-tight">Pro Freelancer</span>
        </div>
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 top-full z-40 mt-1.5 w-56 rounded-xl border border-border bg-surface p-1 shadow-xl animate-in fade-in-0 zoom-in-95 duration-100"
        >
          {/* User Details */}
          <div className="px-3 py-2 border-b border-border-subtle mb-1">
            <p className="text-xs font-semibold text-text-primary leading-tight">Jane Doe</p>
            <p className="text-[11px] text-text-muted mt-0.5 truncate">jane@freelancehub.dev</p>
          </div>

          {/* Menu Items */}
          <div className="space-y-0.5">
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              role="menuitem"
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
            >
              <User size={14} className="text-text-muted" />
              <span>Profile</span>
            </Link>

            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              role="menuitem"
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
            >
              <Sliders size={14} className="text-text-muted" />
              <span>Preferences</span>
            </Link>

            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              role="menuitem"
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
            >
              <Settings size={14} className="text-text-muted" />
              <span>Workspace Settings</span>
            </Link>
          </div>

          <div className="my-1 h-px bg-border-subtle" />

          {/* Sign out placeholder */}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              alert('Authentication & Sign-out logic will be implemented in future phases.');
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-error-text hover:bg-error-bg transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign out (Placeholder)</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;

