'use client';

import React from 'react';
import Link from 'next/link';
import { useSidebar } from '@/components/layout/sidebar-context';
import { SidebarNavItem } from '@/components/layout/sidebar-nav-item';
import { WorkspaceSwitcher } from '@/components/layout/workspace-switcher';
import { MAIN_NAV_ITEMS, SECONDARY_NAV_ITEMS } from '@/config/navigation';
import { APP_CONFIG } from '@/lib/constants';
import { Leaf, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/tooltip';

export function Sidebar() {
  const { isCollapsed, toggleCollapse } = useSidebar();

  return (
    <aside
      aria-label="Sidebar navigation"
      className={cn(
        'hidden lg:flex flex-col justify-between shrink-0 h-screen sticky top-0',
        'border-r border-border bg-surface transition-[width] duration-200 ease-in-out z-30 select-none',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Top Section: Brand + Workspace + Main Nav */}
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        {/* Brand Area */}
        <div
          className={cn(
            'flex items-center h-16 border-b border-border-subtle shrink-0 px-4',
            isCollapsed ? 'justify-center px-2' : 'justify-between'
          )}
        >
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-lg"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-forest text-brand-sage-light shadow-2xs group-hover:scale-105 transition-transform shrink-0">
              <Leaf size={16} strokeWidth={2.2} />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-base tracking-tight text-text-primary leading-none">
                {APP_CONFIG.name}
              </span>
            )}
          </Link>

          {!isCollapsed && (
            <Tooltip content="Collapse sidebar" position="bottom">
              <button
                type="button"
                onClick={toggleCollapse}
                aria-label="Collapse sidebar"
                className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                <ChevronLeft size={16} />
              </button>
            </Tooltip>
          )}
        </div>

        {/* Workspace Switcher */}
        <div className={cn('p-3 border-b border-border-subtle shrink-0', isCollapsed && 'px-2')}>
          <WorkspaceSwitcher isCollapsed={isCollapsed} />
        </div>

        {/* Main Workspace Navigation */}
        <div className="p-3 flex-1 space-y-1">
          {!isCollapsed && (
            <div className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              Workspace
            </div>
          )}
          <nav className="space-y-1" aria-label="Main navigation">
            {MAIN_NAV_ITEMS.map((item) => (
              <SidebarNavItem key={item.href} item={item} isCollapsed={isCollapsed} />
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom Section: Secondary Nav & Collapse Toggle for Collapsed State */}
      <div className="border-t border-border-subtle p-3 space-y-1 shrink-0">
        <nav className="space-y-1" aria-label="Secondary navigation">
          {SECONDARY_NAV_ITEMS.map((item) => {
            if (item.href === '#help') {
              // Help modal or link placeholder
              const content = (
                <button
                  type="button"
                  onClick={() => alert('FreelanceHub Help & Support guide will open here.')}
                  className={cn(
                    'group flex items-center rounded-lg text-sm font-medium transition-colors select-none text-text-secondary hover:bg-surface-hover hover:text-text-primary',
                    isCollapsed ? 'justify-center h-10 w-10 mx-auto' : 'px-3 py-2 gap-3 w-full'
                  )}
                >
                  <HelpCircle size={18} strokeWidth={1.75} className="text-text-muted group-hover:text-text-primary shrink-0" />
                  {!isCollapsed && <span className="truncate">Help & Support</span>}
                </button>
              );

              return isCollapsed ? (
                <Tooltip key="help" content="Help & Support" position="right">
                  {content}
                </Tooltip>
              ) : (
                <div key="help">{content}</div>
              );
            }

            return <SidebarNavItem key={item.href} item={item} isCollapsed={isCollapsed} />;
          })}
        </nav>

        {/* Expand toggle when collapsed */}
        {isCollapsed && (
          <div className="pt-2 flex justify-center">
            <Tooltip content="Expand sidebar" position="right">
              <button
                type="button"
                onClick={toggleCollapse}
                aria-label="Expand sidebar"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                <ChevronRight size={16} />
              </button>
            </Tooltip>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;

