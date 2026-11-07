'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/tooltip';
import { NavItem } from '@/config/navigation';

export interface SidebarNavItemProps {
  item: NavItem;
  isCollapsed?: boolean;
  onNavigate?: () => void;
}

export function SidebarNavItem({ item, isCollapsed = false, onNavigate }: SidebarNavItemProps) {
  const pathname = usePathname();
  const Icon = item.icon;

  // Determine active state: exact match for root/overview, prefix for nested routes
  const isActive = item.exact
    ? pathname === item.href || (item.href === '/dashboard' && pathname === '/')
    : pathname === item.href || pathname.startsWith(`${item.href}/`);

  const linkContent = (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'group flex items-center rounded-lg text-sm font-medium transition-colors select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1',
        isCollapsed ? 'justify-center h-10 w-10 mx-auto' : 'px-3 py-2 gap-3 w-full',
        isActive
          ? 'bg-brand-sage-light/60 text-brand-forest dark:bg-brand-forest/30 dark:text-brand-sage font-semibold shadow-2xs'
          : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
      )}
    >
      <Icon
        size={18}
        strokeWidth={isActive ? 2.25 : 1.75}
        className={cn(
          'shrink-0 transition-colors',
          isActive
            ? 'text-brand-primary dark:text-brand-sage'
            : 'text-text-muted group-hover:text-text-primary'
        )}
      />

      {!isCollapsed && (
        <span className="truncate flex-1 text-left">{item.title}</span>
      )}

      {!isCollapsed && item.badge && (
        <span
          className={cn(
            'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase',
            isActive
              ? 'bg-brand-primary text-white dark:bg-brand-sage dark:text-brand-forest'
              : 'bg-surface-subtle text-text-muted border border-border-subtle'
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip content={item.title} position="right">
        {linkContent}
      </Tooltip>
    );
  }

  return linkContent;
}

export default SidebarNavItem;

