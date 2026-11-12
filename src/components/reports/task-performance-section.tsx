'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Task } from '@/types/task';
import { Milestone } from '@/types/milestone';
import { getTaskSummaryStats, getMilestoneSummaryStats } from '@/lib/utils/task-utils';
import { ListTodo, Flag } from 'lucide-react';

export interface TaskPerformanceSectionProps {
  tasks: Task[];
  milestones: Milestone[];
}

export function TaskPerformanceSection({ tasks, milestones }: TaskPerformanceSectionProps) {
  const taskStats = getTaskSummaryStats(tasks);
  const milestoneStats = getMilestoneSummaryStats(milestones);

  const taskCompletionRate =
    taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0;
  const milestoneCompletionRate =
    milestoneStats.total > 0
      ? Math.round((milestoneStats.completed / milestoneStats.total) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. Task Velocity */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-surface-subtle border border-border flex items-center justify-center text-brand-forest dark:text-brand-sage">
              <ListTodo size={17} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Task Execution Velocity</h3>
              <p className="text-xs text-text-secondary">Progress across individual sprint deliverables</p>
            </div>
          </div>
          <span className="text-base font-bold text-text-primary font-mono">
            {taskCompletionRate}%
          </span>
        </div>

        <ProgressBar value={taskCompletionRate} size="sm" variant="brand" />

        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-border-subtle text-center">
          <div className="p-2 rounded-lg bg-surface-subtle/60">
            <span className="text-[11px] text-text-muted block">Total</span>
            <span className="text-sm font-semibold text-text-primary">{taskStats.total}</span>
          </div>
          <div className="p-2 rounded-lg bg-success-bg/40 border border-success-border/30">
            <span className="text-[11px] text-success-text block">Done</span>
            <span className="text-sm font-semibold text-success-text">{taskStats.completed}</span>
          </div>
          <div className="p-2 rounded-lg bg-info-bg/40 border border-info-border/30">
            <span className="text-[11px] text-info-text block">Active</span>
            <span className="text-sm font-semibold text-info-text">{taskStats.inProgress}</span>
          </div>
          <div className="p-2 rounded-lg bg-error-bg/40 border border-error-border/30">
            <span className="text-[11px] text-error-text block">Overdue</span>
            <span className="text-sm font-semibold text-error-text">{taskStats.overdue}</span>
          </div>
        </div>
      </Card>

      {/* 2. Milestone Achievement */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-surface-subtle border border-border flex items-center justify-center text-brand-forest dark:text-brand-sage">
              <Flag size={17} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Milestone Deliveries</h3>
              <p className="text-xs text-text-secondary">Key contract stages and payment gate posts</p>
            </div>
          </div>
          <span className="text-base font-bold text-text-primary font-mono">
            {milestoneCompletionRate}%
          </span>
        </div>

        <ProgressBar value={milestoneCompletionRate} size="sm" variant="success" />

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border-subtle text-center">
          <div className="p-2 rounded-lg bg-surface-subtle/60">
            <span className="text-[11px] text-text-muted block">Total Gates</span>
            <span className="text-sm font-semibold text-text-primary">{milestoneStats.total}</span>
          </div>
          <div className="p-2 rounded-lg bg-success-bg/40 border border-success-border/30">
            <span className="text-[11px] text-success-text block">Approved</span>
            <span className="text-sm font-semibold text-success-text">{milestoneStats.completed}</span>
          </div>
          <div className="p-2 rounded-lg bg-warning-bg/40 border border-warning-border/30">
            <span className="text-[11px] text-warning-text block">Pending</span>
            <span className="text-sm font-semibold text-warning-text">{milestoneStats.pending}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default TaskPerformanceSection;

