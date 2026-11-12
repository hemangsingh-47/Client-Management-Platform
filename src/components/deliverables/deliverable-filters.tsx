'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Project } from '@/types/project';
import { DeliverableStatus } from '@/types/deliverable';
import { Search, RotateCcw } from 'lucide-react';

export type DeliverableStatusFilter = 'ALL' | DeliverableStatus;
export type DeliverableSortOption = 'newest' | 'oldest' | 'title';

export interface DeliverableFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  projectFilter: string;
  onProjectChange: (val: string) => void;
  statusFilter: DeliverableStatusFilter;
  onStatusChange: (val: DeliverableStatusFilter) => void;
  sortBy: DeliverableSortOption;
  onSortChange: (val: DeliverableSortOption) => void;
  projects: Project[];
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function DeliverableFilters({
  searchQuery,
  onSearchChange,
  projectFilter,
  onProjectChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  projects,
  onClearFilters,
  hasActiveFilters,
}: DeliverableFiltersProps) {
  const projectOptions = [
    { value: 'ALL', label: 'All Projects' },
    ...projects.map((p) => ({ value: p.id, label: p.title })),
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm">
        <Input
          size="md"
          leftIcon={<Search size={15} />}
          placeholder="Search deliverables..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Options */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Project Filter */}
        <div className="w-40">
          <Select
            size="sm"
            value={projectFilter}
            onChange={(e) => onProjectChange(e.target.value)}
            options={projectOptions}
          />
        </div>

        {/* Status Filter */}
        <div className="w-40">
          <Select
            size="sm"
            value={statusFilter}
            onChange={(e) =>
              onStatusChange(e.target.value as DeliverableStatusFilter)
            }
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'SUBMITTED', label: 'Submitted' },
              { value: 'APPROVED', label: 'Approved' },
              { value: 'REVISION_REQUIRED', label: 'Revision Required' },
            ]}
          />
        </div>

        {/* Sort Selector */}
        <div className="w-36">
          <Select
            size="sm"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as DeliverableSortOption)}
            options={[
              { value: 'newest', label: 'Sort: Newest' },
              { value: 'oldest', label: 'Sort: Oldest' },
              { value: 'title', label: 'Sort: Title (A-Z)' },
            ]}
          />
        </div>

        {/* Clear Filters Action */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs text-text-secondary hover:text-text-primary h-8 px-2.5 gap-1 cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </Button>
        )}
      </div>
    </div>
  );
}

export default DeliverableFilters;

