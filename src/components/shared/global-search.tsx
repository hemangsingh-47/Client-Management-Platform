'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MAIN_NAV_ITEMS } from '@/config/navigation';

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  // Listen for ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const filteredItems = MAIN_NAV_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(href);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open search dialog"
        className={cn(
          'flex items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-text-secondary transition-colors',
          'hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary'
        )}
      >
        <Search size={14} className="text-text-muted" />
        <span className="hidden sm:inline">Search workspace...</span>
        <span className="inline sm:hidden">Search</span>
        <kbd className="hidden md:inline-flex items-center gap-0.5 rounded border border-border bg-surface-subtle px-1.5 py-0.5 text-[10px] font-mono text-text-muted">
          ⌘K
        </kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-150"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Dialog Container */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Quick search and navigation"
            className="relative w-full max-w-lg rounded-xl border border-border bg-surface text-text-primary shadow-2xl z-10 animate-in fade-in-0 zoom-in-95 duration-150 overflow-hidden"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 border-b border-border">
              <Search size={18} className="text-text-muted shrink-0 mr-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a destination or shortcut..."
                autoFocus
                className="w-full py-3.5 text-sm bg-transparent text-text-primary placeholder:text-text-muted focus:outline-none"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="p-1 rounded text-text-muted hover:text-text-primary"
                >
                  <X size={16} />
                </button>
              ) : (
                <kbd className="hidden sm:inline text-[10px] font-mono text-text-muted border border-border px-1.5 py-0.5 rounded">
                  ESC
                </kbd>
              )}
            </div>

            {/* Results / Navigation Shortcuts */}
            <div className="p-2 max-h-72 overflow-y-auto">
              <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Quick Navigation
              </div>

              {filteredItems.length > 0 ? (
                <div className="space-y-0.5 mt-1">
                  {filteredItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.href}
                        type="button"
                        onClick={() => handleSelect(item.href)}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon size={16} className="text-text-muted group-hover:text-brand-primary" />
                          <span>{item.title}</span>
                        </div>
                        <CornerDownLeft size={13} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-text-muted">
                  No matching workspace destination found for &quot;{query}&quot;.
                </div>
              )}
            </div>

            {/* Footer Notice */}
            <div className="px-4 py-2 border-t border-border-subtle bg-surface-subtle flex items-center justify-between text-[11px] text-text-muted">
              <span>Navigation shell (UI search placeholder)</span>
              <span className="flex items-center gap-1">
                <span>Select</span> <ArrowRight size={11} />
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GlobalSearch;

