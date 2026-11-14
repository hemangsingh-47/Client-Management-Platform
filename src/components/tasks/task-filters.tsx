'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Project } from '@/types/project';
import { TaskStatus } from '@/types/task';
import { Search, RotateCcw, AlertTriangle } from 'lucide-react';

export type TaskStatusFilter = 'ALL' | TaskStatus;
export type TaskPriorityFilter = 'ALL' | 'LOW' | 'MEDIUM' | 'HIGH';
export type TaskSortOption = 'due_asc' | 'due_desc' | 'priority' | 'title';

export interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  projectFilter: string;
  onProjectChange: (val: string) => void;
  statusFilter: TaskStatusFilter;
  onStatusChange: (val: TaskStatusFilter) => void;
  priorityFilter: TaskPriorityFilter;
  onPriorityChange: (val: TaskPriorityFilter) => void;
  isOverdueOnly: boolean;
  onOverdueToggle: () => void;
  sortBy: TaskSortOption;
  onSortChange: (val: TaskSortOption) => void;
  projects: Project[];
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function TaskFilters({
  searchQuery,
  onSearchChange,
  projectFilter,
  onProjectChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  isOverdueOnly,
  onOverdueToggle,
  sortBy,
  onSortChange,
  projects,
  onClearFilters,
  hasActiveFilters,
}: TaskFiltersProps) {
  const projectOptions = [
    { value: 'ALL', label: 'All Projects' },
    ...projects.map((p) => ({ value: p.id, label: p.title })),
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-sm">
        <Input
          size="sm"
          leftIcon={<Search size={14} />}
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Selectors & Sorters */}
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
        <div className="w-32">
          <Select
            size="sm"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as TaskStatusFilter)}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'TODO', label: 'To Do' },
              { value: 'IN_PROGRESS', label: 'In Progress' },
              { value: 'COMPLETED', label: 'Completed' },
            ]}
          />
        </div>

        {/* Priority Filter */}
        <div className="w-32">
          <Select
            size="sm"
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value as TaskPriorityFilter)}
            options={[
              { value: 'ALL', label: 'All Priorities' },
              { value: 'HIGH', label: 'High Priority' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'LOW', label: 'Low' },
            ]}
          />
        </div>

        {/* Sort */}
        <div className="w-36">
          <Select
            size="sm"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as TaskSortOption)}
            options={[
              { value: 'due_asc', label: 'Sort: Due Soonest' },
              { value: 'due_desc', label: 'Sort: Due Latest' },
              { value: 'priority', label: 'Sort: Highest Priority' },
              { value: 'title', label: 'Sort: Title (A-Z)' },
            ]}
          />
        </div>

        {/* Overdue Toggle */}
        <button
          type="button"
          onClick={onOverdueToggle}
          className={`h-8 px-2.5 rounded-lg border text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
            isOverdueOnly
              ? 'bg-error-bg text-error-text border-error-border font-semibold shadow-2xs'
              : 'bg-surface text-text-secondary border-border hover:text-text-primary hover:bg-surface-hover'
          }`}
          title="Filter overdue tasks"
        >
          <AlertTriangle size={13} className={isOverdueOnly ? 'text-error-text' : 'text-text-muted'} />
          <span>Overdue</span>
        </button>

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

export default TaskFilters;

