'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge, BadgeVariant } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { isTaskOverdue } from '@/lib/utils/task-utils';
import { useAppContext } from '@/context/app-context';
import { ArrowUpRight, CheckSquare, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export function UpcomingTasksList() {
  const { tasks, projects, toggleTaskCompleted } = useAppContext();

  // Take top 5 non-completed tasks (or most urgent)
  const displayTasks = [...tasks]
    .sort((a, b) => {
      if (a.status === 'COMPLETED' && b.status !== 'COMPLETED') return 1;
      if (a.status !== 'COMPLETED' && b.status === 'COMPLETED') return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, 5);

  const getPriorityVariant = (priority: string): BadgeVariant => {
    switch (priority) {
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
      default:
        return 'default';
    }
  };

  return (
    <Card className="p-0 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border-subtle bg-surface">
        <div>
          <h2 className="text-base font-semibold text-text-primary tracking-tight">
            Upcoming Tasks
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Deliverable items due soon
          </p>
        </div>

        <Link
          href="/tasks"
          className="inline-flex items-center gap-1 text-xs font-medium text-brand-primary hover:underline group"
        >
          <span>View all</span>
          <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Task List or Empty State */}
      {displayTasks.length > 0 ? (
        <div className="divide-y divide-border-subtle bg-surface flex-1">
          {displayTasks.map((task) => {
            const project = projects.find((p) => p.id === task.projectId);
            const isDone = task.status === 'COMPLETED';
            const overdue = isTaskOverdue(task);

            return (
              <div
                key={task.id}
                className={cn(
                  'flex items-start gap-3 p-3.5 sm:px-5 transition-colors hover:bg-surface-hover/50',
                  isDone && 'opacity-50 bg-surface-subtle/30'
                )}
              >
                {/* Interactive Checkbox */}
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => toggleTaskCompleted(task.id)}
                  aria-label={`Mark "${task.title}" as completed`}
                  className="mt-0.5 h-4 w-4 rounded border-border text-brand-primary focus:ring-brand-primary cursor-pointer accent-brand-primary"
                />

                {/* Task Details */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'text-xs sm:text-sm font-medium text-text-primary leading-tight transition-all',
                      isDone && 'line-through text-text-muted'
                    )}
                  >
                    {task.title}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-text-muted">
                    <span className="truncate max-w-[140px] text-text-secondary">
                      {project?.title || 'Direct Task'}
                    </span>

                    <span>•</span>

                    <span
                      className={cn(
                        'inline-flex items-center gap-1',
                        overdue && !isDone
                          ? 'text-error-text font-semibold'
                          : 'text-text-muted'
                      )}
                    >
                      <Clock size={11} />
                      <span>{task.dueDate}</span>
                    </span>
                  </div>
                </div>

                {/* Priority Badge */}
                <div className="shrink-0">
                  <Badge variant={getPriorityVariant(task.priority)} size="sm">
                    {task.priority}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6">
          <EmptyState
            icon={<CheckSquare size={20} className="text-text-muted" />}
            title="All tasks cleared"
            description="You have no urgent tasks scheduled for this period."
          />
        </div>
      )}

      {/* Footer notice */}
      <div className="p-2.5 border-t border-border-subtle bg-surface-subtle/50 text-[11px] text-text-muted text-center">
        Synced with Tasks &amp; Milestones module
      </div>
    </Card>
  );
}

export default UpcomingTasksList;
