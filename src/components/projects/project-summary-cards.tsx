'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Project } from '@/lib/mock-data/projects';
import { FolderKanban, Clock, CheckCircle2, PauseCircle } from 'lucide-react';

export interface ProjectSummaryCardsProps {
  projects: Project[];
}

export function ProjectSummaryCards({ projects }: ProjectSummaryCardsProps) {
  const total = projects.length;
  const inProgress = projects.filter(
    (p) => (p.status as string) === 'IN_PROGRESS' || (p.status as string) === 'In Progress'
  ).length;
  const completed = projects.filter(
    (p) => (p.status as string) === 'COMPLETED' || (p.status as string) === 'Completed'
  ).length;
  const onHold = projects.filter(
    (p) => (p.status as string) === 'ON_HOLD' || (p.status as string) === 'On Hold'
  ).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Total Projects */}
      <Card className="p-4 sm:p-5 flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-text-secondary">
            Total Projects
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-text-primary">
            {total}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Across all clients
          </span>
        </div>
        <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-surface-subtle border border-border text-text-secondary">
          <FolderKanban size={19} strokeWidth={1.8} />
        </div>
      </Card>

      {/* 2. In Progress */}
      <Card className="p-4 sm:p-5 flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-text-secondary">
            In Progress
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-brand-forest dark:text-brand-sage">
            {inProgress}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Active deliverable sprints
          </span>
        </div>
        <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-brand-sage-light border border-brand-sage/40 text-brand-forest dark:text-brand-sage">
          <Clock size={19} strokeWidth={1.8} />
        </div>
      </Card>

      {/* 3. Completed */}
      <Card className="p-4 sm:p-5 flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-text-secondary">
            Completed
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-text-primary">
            {completed}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Successfully delivered
          </span>
        </div>
        <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-success-bg border border-success-border text-success-text">
          <CheckCircle2 size={19} strokeWidth={1.8} />
        </div>
      </Card>

      {/* 4. On Hold */}
      <Card className="p-4 sm:p-5 flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-text-secondary">
            On Hold
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-text-primary">
            {onHold}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Pending client review
          </span>
        </div>
        <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-warning-bg border border-warning-border text-warning-text">
          <PauseCircle size={19} strokeWidth={1.8} />
        </div>
      </Card>
    </div>
  );
}

export default ProjectSummaryCards;
