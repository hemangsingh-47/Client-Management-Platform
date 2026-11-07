'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSidebar } from '@/components/layout/sidebar-context';
import { SidebarNavItem } from '@/components/layout/sidebar-nav-item';
import { WorkspaceSwitcher } from '@/components/layout/workspace-switcher';
import { MAIN_NAV_ITEMS, SECONDARY_NAV_ITEMS } from '@/config/navigation';
import { APP_CONFIG } from '@/lib/constants';
import { Leaf, X } from 'lucide-react';

export function MobileSidebar() {
  const { isMobileOpen, closeMobile } = useSidebar();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        closeMobile();
      }
    };

    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileOpen, closeMobile]);

  if (!isMobileOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200"
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        className="relative flex flex-col w-72 max-w-[85vw] h-full bg-surface border-r border-border shadow-xl z-10 animate-in slide-in-from-left duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border-subtle shrink-0">
          <Link
            href="/dashboard"
            onClick={closeMobile}
            className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-lg"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-forest text-brand-sage-light shadow-2xs">
              <Leaf size={16} strokeWidth={2.2} />
            </div>
            <span className="font-bold text-base tracking-tight text-text-primary">
              {APP_CONFIG.name}
            </span>
          </Link>

          <button
            type="button"
            onClick={closeMobile}
            aria-label="Close menu"
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <X size={18} />
          </button>
        </div>

        {/* Workspace Switcher */}
        <div className="p-3 border-b border-border-subtle shrink-0">
          <WorkspaceSwitcher isCollapsed={false} />
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div>
            <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              Workspace
            </div>
            <nav className="space-y-1">
              {MAIN_NAV_ITEMS.map((item) => (
                <SidebarNavItem
                  key={item.href}
                  item={item}
                  isCollapsed={false}
                  onNavigate={closeMobile}
                />
              ))}
            </nav>
          </div>

          <div>
            <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              Preferences
            </div>
            <nav className="space-y-1">
              {SECONDARY_NAV_ITEMS.map((item) => (
                <SidebarNavItem
                  key={item.href}
                  item={item}
                  isCollapsed={false}
                  onNavigate={closeMobile}
                />
              ))}
            </nav>
          </div>
        </div>

        {/* Footer Brand Info */}
        <div className="p-4 border-t border-border-subtle text-xs text-text-muted bg-surface-subtle/50">
          <p className="font-medium text-text-primary">{APP_CONFIG.name}</p>
          <p className="text-[11px]">Bonsai-inspired Freelancer Platform</p>
        </div>
      </div>
    </div>
  );
}

export default MobileSidebar;

