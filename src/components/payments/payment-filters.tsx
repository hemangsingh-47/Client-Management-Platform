'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PaymentMethod, PaymentStatus } from '@/types/payment';
import { Search, RotateCcw } from 'lucide-react';

export type PaymentMethodFilter = 'ALL' | PaymentMethod;
export type PaymentStatusFilter = 'ALL' | PaymentStatus;
export type PaymentSortOption = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';

export interface PaymentFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  methodFilter: PaymentMethodFilter;
  onMethodChange: (val: PaymentMethodFilter) => void;
  statusFilter: PaymentStatusFilter;
  onStatusChange: (val: PaymentStatusFilter) => void;
  sortBy: PaymentSortOption;
  onSortChange: (val: PaymentSortOption) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function PaymentFilters({
  searchQuery,
  onSearchChange,
  methodFilter,
  onMethodChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  onClearFilters,
  hasActiveFilters,
}: PaymentFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm">
        <Input
          size="md"
          leftIcon={<Search size={15} />}
          placeholder="Search by project, client, or reference..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Options */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Method Filter */}
        <div className="w-36">
          <Select
            size="sm"
            value={methodFilter}
            onChange={(e) => onMethodChange(e.target.value as PaymentMethodFilter)}
            options={[
              { value: 'ALL', label: 'All Methods' },
              { value: 'Bank Transfer', label: 'Bank Transfer' },
              { value: 'UPI', label: 'UPI' },
              { value: 'Cash', label: 'Cash' },
              { value: 'Other', label: 'Other' },
            ]}
          />
        </div>

        {/* Status Filter */}
        <div className="w-36">
          <Select
            size="sm"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as PaymentStatusFilter)}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'Completed', label: 'Completed' },
              { value: 'Pending', label: 'Pending' },
              { value: 'Failed', label: 'Failed' },
            ]}
          />
        </div>

        {/* Sort Selector */}
        <div className="w-40">
          <Select
            size="sm"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as PaymentSortOption)}
            options={[
              { value: 'date_desc', label: 'Sort: Date (Newest)' },
              { value: 'date_asc', label: 'Sort: Date (Oldest)' },
              { value: 'amount_desc', label: 'Sort: Amount (High)' },
              { value: 'amount_asc', label: 'Sort: Amount (Low)' },
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

export default PaymentFilters;

