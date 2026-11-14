'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { ProjectFormModal, ProjectFormData } from '@/components/projects/project-form-modal';
import { useAppContext } from '@/context/app-context';
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
  const [formattedDate, setFormattedDate] = useState('Saturday, 7 Nov 2026');
  const { clients, addProject } = useAppContext();

  useEffect(() => {
    setFormattedDate(
      new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    );
  }, []);

  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCurrentRange(val);
    onRangeChange?.(val);
  };

  const handleCreateProject = (data: ProjectFormData) => {
    addProject({
      title: data.title,
      clientId: data.clientId,
      description: data.description,
      budget: data.budget,
      startDate: data.startDate,
      deadline: data.deadline,
      status: data.status,
      priority: data.priority,
      progress: data.progress,
      notes: data.notes,
    });
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-border-subtle">
        {/* Left: Titles & Date */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              Overview
            </h1>
            <span suppressHydrationWarning className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-surface text-xs font-medium text-text-muted shadow-xs">
              <Calendar size={13} className="text-brand-primary" />
              <span suppressHydrationWarning>{formattedDate}</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary">
            Here&apos;s what&apos;s happening with your freelance business today.
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

      {/* Real Project Form Modal */}
      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateProject}
        clients={clients}
      />
    </>
  );
}

export default DashboardHeader;
