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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {/* 1. Total Tasks */}
      <Card className="p-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-text-secondary">Total Tasks</span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-text-primary">
            {stats.total}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            {stats.completionRate}% completed
          </span>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-subtle border border-border text-text-secondary">
          <ListTodo size={18} strokeWidth={1.8} />
        </div>
      </Card>

      {/* 2. To Do */}
      <Card className="p-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-text-secondary">To Do</span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-text-primary">
            {stats.todo}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Backlog queue
          </span>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-subtle border border-border text-text-secondary">
          <CheckSquare size={18} strokeWidth={1.8} />
        </div>
      </Card>

      {/* 3. In Progress */}
      <Card className="p-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-text-secondary">In Progress</span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-brand-forest dark:text-brand-sage">
            {stats.inProgress}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Currently working
          </span>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-sage-light border border-brand-sage/40 text-brand-forest dark:text-brand-sage">
          <Clock size={18} strokeWidth={1.8} />
        </div>
      </Card>

      {/* 4. Completed */}
      <Card className="p-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-text-secondary">Completed</span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-success-text">
            {stats.completed}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Signed off
          </span>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success-bg border border-success-border text-success-text">
          <CheckCircle2 size={18} strokeWidth={1.8} />
        </div>
      </Card>

      {/* 5. Overdue */}
      <Card className="p-4 flex items-center justify-between col-span-2 sm:col-span-1">
        <div>
          <span className="text-xs font-medium text-text-secondary">Overdue</span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-error-text">
            {stats.overdue}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            {stats.overdue > 0 ? 'Requires attention' : 'All on track'}
          </span>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-error-bg border border-error-border text-error-text">
          <AlertTriangle size={18} strokeWidth={1.8} />
        </div>
      </Card>
    </div>
  );
}

export default TaskSummaryCards;

