'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  type: 'invoice' | 'project' | 'client';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Invoice INV-001 viewed',
    description: 'Acme Corporation viewed your milestone invoice.',
    time: '15m ago',
    isRead: false,
    type: 'invoice',
  },
  {
    id: 'notif-2',
    title: 'Milestone delivery approaching',
    description: 'Design System Delivery due in 3 business days.',
    time: '2h ago',
    isRead: false,
    type: 'project',
  },
  {
    id: 'notif-3',
    title: 'Contract approved',
    description: 'Starlight Media signed the Q4 retainer agreement.',
    time: 'Yesterday',
    isRead: true,
    type: 'client',
  },
];

export function NotificationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const menuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'invoice':
        return <FileText size={14} className="text-brand-primary" />;
      case 'project':
        return <Clock size={14} className="text-warning-text" />;
      case 'client':
        return <CheckCircle2 size={14} className="text-success-text" />;
    }
  };

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="View notifications"
        aria-expanded={isOpen}
        className={cn(
          'relative p-2 rounded-lg border border-border bg-surface text-text-secondary transition-colors',
          'hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary'
        )}
      >
        <Bell size={16} strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span
            className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-primary ring-2 ring-surface"
            aria-hidden="true"
          />
        )}
      </button>

      {isOpen && (
        <div
          role="region"
          aria-label="Notifications panel"
          className="absolute right-0 top-full z-40 mt-1.5 w-80 sm:w-96 rounded-xl border border-border bg-surface shadow-xl animate-in fade-in-0 zoom-in-95 duration-100 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3.5 border-b border-border-subtle bg-surface-subtle/50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-text-primary">Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="brand" size="sm">
                  {unreadCount} new
                </Badge>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-primary hover:underline cursor-pointer"
              >
                <CheckCheck size={13} />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-border-subtle">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    'flex items-start gap-3 p-3 text-left transition-colors',
                    !item.isRead ? 'bg-brand-sage-light/20 dark:bg-brand-forest/10' : 'bg-surface'
                  )}
                >
                  <div className="mt-0.5 p-1.5 rounded-md bg-surface-subtle border border-border shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text-primary leading-tight">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-text-secondary mt-0.5 leading-normal">
                      {item.description}
                    </p>
                    <span className="text-[10px] text-text-muted mt-1 block font-mono">
                      {item.time}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-text-muted">
                No notifications to display.
              </div>
            )}
          </div>

          {/* Footer Notice */}
          <div className="p-2 border-t border-border-subtle bg-surface-subtle text-center text-[10px] text-text-muted">
            Sample UI notifications (backend integration in future phase)
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationButton;

