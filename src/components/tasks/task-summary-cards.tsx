'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Task } from '@/types/task';
import { getTaskSummaryStats } from '@/lib/utils/task-utils';
import { CheckSquare, Clock, CheckCircle2, AlertTriangle, ListTodo } from 'lucide-react';

export interface TaskSummaryCardsProps {
  tasks: Task[];
}

export function TaskSummaryCards({ tasks }: TaskSummaryCardsProps) {
  const stats = getTaskSummaryStats(tasks);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4">
      {/* 1. Total Tasks */}
      <Card className="p-4 sm:p-5 flex items-center justify-between hover:border-brand-primary/40 transition-all">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Total Tasks
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-text-primary">
            {stats.total}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            {stats.completionRate}% completion rate
          </span>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-subtle border border-border text-text-secondary">
          <ListTodo size={18} strokeWidth={1.8} />
        </div>
      </Card>

      {/* 2. To Do */}
      <Card className="p-4 sm:p-5 flex items-center justify-between hover:border-border transition-all">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Backlog
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-text-primary">
            {stats.todo}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Queued for sprint
          </span>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-subtle border border-border text-text-secondary">
          <CheckSquare size={18} strokeWidth={1.8} />
        </div>
      </Card>

      {/* 3. In Progress */}
      <Card className="p-4 sm:p-5 flex items-center justify-between hover:border-brand-primary/40 transition-all">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            In Progress
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-brand-forest dark:text-brand-sage">
            {stats.inProgress}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Active deliverables
          </span>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-sage-light border border-brand-sage/40 text-brand-forest dark:text-brand-sage">
          <Clock size={18} strokeWidth={1.8} />
        </div>
      </Card>

      {/* 4. Completed */}
      <Card className="p-4 sm:p-5 flex items-center justify-between hover:border-success-border transition-all">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Completed
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-success-text">
            {stats.completed}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Approved &amp; signed off
          </span>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success-bg border border-success-border text-success-text">
          <CheckCircle2 size={18} strokeWidth={1.8} />
        </div>
      </Card>

      {/* 5. Overdue */}
      <Card className="p-4 sm:p-5 flex items-center justify-between col-span-2 md:col-span-1 hover:border-error-border transition-all">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Overdue
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-error-text">
            {stats.overdue}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            {stats.overdue > 0 ? 'Requires attention' : 'All milestones on track'}
          </span>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-error-bg border border-error-border text-error-text">
          <AlertTriangle size={18} strokeWidth={1.8} />
        </div>
      </Card>
    </div>
  );
}

export default TaskSummaryCards;
