'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/components/layout/sidebar-context';
import { GlobalSearch } from '@/components/shared/global-search';
import { NotificationButton } from '@/components/shared/notification-button';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { UserMenu } from '@/components/shared/user-menu';
import { Menu, ChevronRight } from 'lucide-react';
import { MAIN_NAV_ITEMS, SECONDARY_NAV_ITEMS } from '@/config/navigation';

export function TopHeader() {
  const { openMobile } = useSidebar();
  const pathname = usePathname();

  // Find current active item title
  const currentNav =
    [...MAIN_NAV_ITEMS, ...SECONDARY_NAV_ITEMS].find(
      (item) => item.href === pathname || (item.href !== '/dashboard' && pathname.startsWith(item.href))
    ) || { title: pathname === '/' ? 'Overview' : 'Workspace' };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full shrink-0 items-center justify-between border-b border-border bg-surface/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 transition-colors select-none">
      {/* Left side: Mobile trigger + Breadcrumb / Title */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={openMobile}
          aria-label="Open mobile navigation menu"
          className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          <Menu size={18} />
        </button>

        {/* Breadcrumb / Title */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm">
          <span className="text-text-muted hidden sm:inline">Workspace</span>
          <ChevronRight size={13} className="text-text-muted hidden sm:inline" />
          <h1 className="font-semibold text-text-primary text-sm sm:text-base capitalize">
            {currentNav.title}
          </h1>
        </nav>
      </div>

      {/* Right side: Global Search + Notifications + Theme Toggle + User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        <GlobalSearch />
        <NotificationButton />
        <div className="h-4 w-px bg-border hidden sm:block" />
        <ThemeToggle variant="button" />
        <div className="h-4 w-px bg-border hidden sm:block" />
        <UserMenu />
      </div>
    </header>
  );
}

export default TopHeader;

