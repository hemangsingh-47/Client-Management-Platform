'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form-field';
import { Plus, Calendar } from 'lucide-react';

export interface DashboardHeaderProps {
  selectedRange?: string;
  onRangeChange?: (range: string) => void;
}

export function DashboardHeader({
  selectedRange = 'this-month',
  onRangeChange,
}: DashboardHeaderProps) {
  const [currentRange, setCurrentRange] = useState(selectedRange);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCurrentRange(val);
    onRangeChange?.(val);
  };

  // Format a realistic, professional current date string
  const formattedDate = 'Saturday, 7 November 2026';

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-border-subtle">
        {/* Left: Titles & Date */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              Overview
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-border bg-surface text-xs font-medium text-text-muted">
              <Calendar size={13} className="text-brand-primary" />
              <span>{formattedDate}</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary">
            Here&apos;s what&apos;s happening with your freelance business.
          </p>
        </div>

        {/* Right: Date Range Selector + Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-36 sm:w-40">
            <Select
              size="sm"
              value={currentRange}
              onChange={handleRangeChange}
              options={[
                { value: 'this-month', label: 'This Month' },
                { value: 'last-30', label: 'Last 30 Days' },
                { value: 'this-quarter', label: 'This Quarter' },
                { value: 'year-to-date', label: 'Year to Date' },
              ]}
            />
          </div>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={15} />}
            onClick={() => setIsModalOpen(true)}
          >
            <span>New Project</span>
          </Button>
        </div>
      </div>

      {/* New Project UI-only Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
        description="Define a new client engagement scope and budget."
        size="md"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-surface-subtle border border-border text-xs text-text-muted leading-relaxed">
            <span className="font-semibold text-text-primary">Phase 4 Notice:</span> This action is a UI shell demonstration. Database and project CRUD operations will be connected in Phase 6.
          </div>

          <FormField id="p-name" label="Project Title" required>
            <Input id="p-name" placeholder="e.g. Design System & Frontend" />
          </FormField>

          <FormField id="p-client" label="Client Organization" required>
            <Input id="p-client" placeholder="e.g. Acme Studio" />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField id="p-budget" label="Budget (₹ INR)" required>
              <Input id="p-budget" placeholder="50000" type="number" />
            </FormField>

            <FormField id="p-date" label="Target Deadline">
              <Input id="p-date" type="date" />
            </FormField>
          </div>
        </div>

        <ModalFooter>
          <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(false)}
          >
            Create Project (UI Shell)
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default DashboardHeader;

