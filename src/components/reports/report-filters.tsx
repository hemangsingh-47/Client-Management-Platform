'use client';

import React from 'react';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Client } from '@/lib/mock-data/clients';
import { ProjectStatus } from '@/types/project';
import { RotateCcw, Filter } from 'lucide-react';

export type ReportDateRange = 'ALL' | 'THIS_MONTH' | 'LAST_3_MONTHS' | 'THIS_YEAR';
export type ReportStatusFilter = 'ALL' | ProjectStatus;

export interface ReportFiltersProps {
  dateRange: ReportDateRange;
  onDateRangeChange: (val: ReportDateRange) => void;
  clientFilter: string;
  onClientChange: (val: string) => void;
  statusFilter: ReportStatusFilter;
  onStatusChange: (val: ReportStatusFilter) => void;
  clients: Client[];
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function ReportFilters({
  dateRange,
  onDateRangeChange,
  clientFilter,
  onClientChange,
  statusFilter,
  onStatusChange,
  clients,
  onClearFilters,
  hasActiveFilters,
}: ReportFiltersProps) {
  const clientOptions = [
    { value: 'ALL', label: 'All Clients' },
    ...clients.map((c) => ({
      value: c.id,
      label: c.companyName ? `${c.name} (${c.companyName})` : c.name,
    })),
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-surface">
      <div className="flex items-center gap-2 text-xs font-semibold text-text-primary">
        <Filter size={14} className="text-brand-forest dark:text-brand-sage" />
        <span>Report Controls:</span>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Date Range */}
        <div className="w-40">
          <Select
            size="sm"
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value as ReportDateRange)}
            options={[
              { value: 'ALL', label: 'All Time' },
              { value: 'THIS_MONTH', label: 'This Month (Nov 26)' },
              { value: 'LAST_3_MONTHS', label: 'Last 3 Months' },
              { value: 'THIS_YEAR', label: 'This Year (2026)' },
            ]}
          />
        </div>

        {/* Client Filter */}
        <div className="w-44">
          <Select
            size="sm"
            value={clientFilter}
            onChange={(e) => onClientChange(e.target.value)}
            options={clientOptions}
          />
        </div>

        {/* Status Filter */}
        <div className="w-36">
          <Select
            size="sm"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as ReportStatusFilter)}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'IN_PROGRESS', label: 'In Progress' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'ON_HOLD', label: 'On Hold' },
              { value: 'PLANNING', label: 'Planning' },
            ]}
          />
        </div>

        {/* Clear Filters */}
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

export default ReportFilters;

