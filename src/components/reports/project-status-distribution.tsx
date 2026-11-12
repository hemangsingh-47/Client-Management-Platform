'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Project } from '@/types/project';
import { getProjectStatusCounts } from '@/lib/utils/project-utils';

export interface ProjectStatusDistributionProps {
  projects: Project[];
}

export function ProjectStatusDistribution({ projects }: ProjectStatusDistributionProps) {
  const counts = getProjectStatusCounts(projects);
  const total = counts.total || 1;

  const inProgressPct = Math.round((counts.inProgress / total) * 100);
  const completedPct = Math.round((counts.completed / total) * 100);
  const onHoldPct = Math.round((counts.onHold / total) * 100);
  const planningPct = Math.round((counts.planning / total) * 100);
  const cancelledPct = Math.round((counts.cancelled / total) * 100);

  return (
    <Card className="p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-text-primary tracking-tight">
            Project Status Distribution
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Active deliverable velocity across {counts.total} client engagements.
          </p>
        </div>
      </div>

      {/* Multi-segment Progress Bar */}
      <div className="h-3 w-full rounded-full bg-surface-subtle overflow-hidden flex border border-border-subtle">
        <div
          className="bg-brand-primary h-full transition-all"
          style={{ width: `${inProgressPct}%` }}
          title={`In Progress: ${counts.inProgress} (${inProgressPct}%)`}
        />
        <div
          className="bg-success-text h-full transition-all"
          style={{ width: `${completedPct}%` }}
          title={`Completed: ${counts.completed} (${completedPct}%)`}
        />
        <div
          className="bg-warning-text h-full transition-all"
          style={{ width: `${onHoldPct}%` }}
          title={`On Hold: ${counts.onHold} (${onHoldPct}%)`}
        />
        <div
          className="bg-info-text h-full transition-all"
          style={{ width: `${planningPct}%` }}
          title={`Planning: ${counts.planning} (${planningPct}%)`}
        />
        <div
          className="bg-error-text h-full transition-all"
          style={{ width: `${cancelledPct}%` }}
          title={`Cancelled: ${counts.cancelled} (${cancelledPct}%)`}
        />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
        <div className="p-3 rounded-lg bg-surface-subtle border border-border-subtle">
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <span className="w-2 h-2 rounded-full bg-brand-primary" />
            <span>In Progress</span>
          </div>
          <div className="text-xl font-bold font-mono text-text-primary mt-1">
            {counts.inProgress}
          </div>
          <span className="text-[11px] text-text-muted">{inProgressPct}% of total</span>
        </div>

        <div className="p-3 rounded-lg bg-surface-subtle border border-border-subtle">
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <span className="w-2 h-2 rounded-full bg-success-text" />
            <span>Completed</span>
          </div>
          <div className="text-xl font-bold font-mono text-text-primary mt-1">
            {counts.completed}
          </div>
          <span className="text-[11px] text-text-muted">{completedPct}% of total</span>
        </div>

        <div className="p-3 rounded-lg bg-surface-subtle border border-border-subtle">
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <span className="w-2 h-2 rounded-full bg-warning-text" />
            <span>On Hold</span>
          </div>
          <div className="text-xl font-bold font-mono text-text-primary mt-1">
            {counts.onHold}
          </div>
          <span className="text-[11px] text-text-muted">{onHoldPct}% of total</span>
        </div>

        <div className="p-3 rounded-lg bg-surface-subtle border border-border-subtle">
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <span className="w-2 h-2 rounded-full bg-info-text" />
            <span>Planning</span>
          </div>
          <div className="text-xl font-bold font-mono text-text-primary mt-1">
            {counts.planning}
          </div>
          <span className="text-[11px] text-text-muted">{planningPct}% of total</span>
        </div>

        <div className="p-3 rounded-lg bg-surface-subtle border border-border-subtle col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <span className="w-2 h-2 rounded-full bg-error-text" />
            <span>Cancelled</span>
          </div>
          <div className="text-xl font-bold font-mono text-text-primary mt-1">
            {counts.cancelled}
          </div>
          <span className="text-[11px] text-text-muted">{cancelledPct}% of total</span>
        </div>
      </div>
    </Card>
  );
}

export default ProjectStatusDistribution;

