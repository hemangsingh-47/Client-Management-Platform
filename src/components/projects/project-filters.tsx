'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ProjectStatus, ProjectPriority } from '@/lib/mock-data/projects';
import { Search, LayoutGrid, List, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StatusFilterValue = 'ALL' | ProjectStatus;
export type PriorityFilterValue = 'ALL' | ProjectPriority;
export type SortOptionValue = 'newest' | 'oldest' | 'deadline' | 'budget';
export type ViewMode = 'list' | 'grid';

export interface ProjectFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilterValue;
  onStatusChange: (status: StatusFilterValue) => void;
  priorityFilter: PriorityFilterValue;
  onPriorityChange: (priority: PriorityFilterValue) => void;
  sortBy: SortOptionValue;
  onSortChange: (sort: SortOptionValue) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function ProjectFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onClearFilters,
  hasActiveFilters,
}: ProjectFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Input
          size="md"
          leftIcon={<Search size={15} />}
          placeholder="Search by project title or client..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filters, Sorters & View Switcher */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Status Filter */}
        <div className="w-36">
          <Select
            size="sm"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as StatusFilterValue)}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'PLANNING', label: 'Planning' },
              { value: 'IN_PROGRESS', label: 'In Progress' },
              { value: 'ON_HOLD', label: 'On Hold' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'CANCELLED', label: 'Cancelled' },
            ]}
          />
        </div>

        {/* Priority Filter */}
        <div className="w-32">
          <Select
            size="sm"
            value={priorityFilter}
            onChange={(e) =>
              onPriorityChange(e.target.value as PriorityFilterValue)
            }
            options={[
              { value: 'ALL', label: 'All Priorities' },
              { value: 'HIGH', label: 'High Priority' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'LOW', label: 'Low' },
            ]}
          />
        </div>

        {/* Sort Selector */}
        <div className="w-40">
          <Select
            size="sm"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOptionValue)}
            options={[
              { value: 'newest', label: 'Sort: Newest' },
              { value: 'oldest', label: 'Sort: Oldest' },
              { value: 'deadline', label: 'Sort: Deadline' },
              { value: 'budget', label: 'Sort: Budget (High)' },
            ]}
          />
        </div>

        {/* Clear Filters Action */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs text-text-secondary hover:text-text-primary h-8 px-2.5 gap-1.5"
            title="Reset search and filters"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </Button>
        )}

        {/* View Switcher: List vs Grid */}
        <div className="flex items-center rounded-lg border border-border bg-surface p-0.5 ml-auto sm:ml-0">
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            aria-label="List view"
            title="List view"
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
              viewMode === 'list'
                ? 'bg-brand-primary text-white shadow-2xs'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
            )}
          >
            <List size={14} strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            aria-label="Grid view"
            title="Grid view"
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
              viewMode === 'grid'
                ? 'bg-brand-primary text-white shadow-2xs'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
            )}
          >
            <LayoutGrid size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectFilters;
