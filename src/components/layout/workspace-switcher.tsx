'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { SAMPLE_WORKSPACES, Workspace } from '@/config/navigation';
import { ChevronsUpDown, Check, Plus } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';

export interface WorkspaceSwitcherProps {
  isCollapsed?: boolean;
}

export function WorkspaceSwitcher({ isCollapsed = false }: WorkspaceSwitcherProps) {
  const [selectedWs, setSelectedWs] = useState<Workspace>(SAMPLE_WORKSPACES[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (ws: Workspace) => {
    setSelectedWs(ws);
    setIsOpen(false);
  };

  if (isCollapsed) {
    return (
      <div className="py-2 flex justify-center">
        <Tooltip content={`Workspace: ${selectedWs.name} (${selectedWs.plan})`} position="right">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Switch workspace"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-xs font-bold text-brand-forest dark:text-brand-sage hover:bg-surface-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            {selectedWs.initials}
          </button>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={cn(
          'flex w-full items-center justify-between rounded-lg border border-border bg-surface px-2.5 py-1.5 text-left transition-colors',
          'hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary'
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-forest text-brand-sage-light text-xs font-bold dark:bg-brand-sage dark:text-brand-forest">
            {selectedWs.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-text-primary leading-tight">
              {selectedWs.name}
            </p>
            <p className="truncate text-[11px] text-text-muted leading-tight">
              {selectedWs.plan}
            </p>
          </div>
        </div>

        <ChevronsUpDown size={14} className="shrink-0 text-text-muted ml-1" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            role="listbox"
            aria-label="Select workspace"
            className="absolute left-0 right-0 top-full z-40 mt-1.5 rounded-xl border border-border bg-surface p-1 shadow-lg animate-in fade-in-0 zoom-in-95 duration-100"
          >
            <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              Workspaces
            </div>

            {SAMPLE_WORKSPACES.map((ws) => {
              const isSelected = ws.id === selectedWs.id;
              return (
                <button
                  key={ws.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(ws)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs text-left transition-colors cursor-pointer',
                    isSelected
                      ? 'bg-surface-hover font-medium text-text-primary'
                      : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-surface-subtle border border-border text-[10px] font-bold text-text-secondary">
                      {ws.initials}
                    </span>
                    <span className="truncate">{ws.name}</span>
                  </div>
                  {isSelected && <Check size={14} className="text-brand-primary shrink-0" />}
                </button>
              );
            })}

            <div className="my-1 h-px bg-border-subtle" />

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                alert('Workspace creation will be available in a future phase.');
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors cursor-pointer"
            >
              <Plus size={14} className="text-text-muted" />
              <span>Create new workspace</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default WorkspaceSwitcher;

