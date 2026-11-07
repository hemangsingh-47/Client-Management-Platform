'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge, BadgeVariant } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { DashboardTask, MOCK_UPCOMING_TASKS, TaskPriorityType } from '@/lib/mock-data/dashboard';
import { ArrowUpRight, CheckSquare, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UpcomingTasksListProps {
  initialTasks?: DashboardTask[];
}

export function UpcomingTasksList({ initialTasks = MOCK_UPCOMING_TASKS }: UpcomingTasksListProps) {
  const [tasks, setTasks] = useState<DashboardTask[]>(initialTasks);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const getPriorityVariant = (priority: TaskPriorityType): BadgeVariant => {
    switch (priority) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'default';
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
      {tasks.length > 0 ? (
        <div className="divide-y divide-border-subtle bg-surface flex-1">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                'flex items-start gap-3 p-3.5 sm:px-5 transition-colors hover:bg-surface-hover/50',
                task.isCompleted && 'opacity-50 bg-surface-subtle/30'
              )}
            >
              {/* Interactive Checkbox */}
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={() => toggleTask(task.id)}
                aria-label={`Mark "${task.title}" as completed`}
                className="mt-0.5 h-4 w-4 rounded border-border text-brand-primary focus:ring-brand-primary cursor-pointer accent-[#287A58]"
              />

              {/* Task Details */}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    'text-xs sm:text-sm font-medium text-text-primary leading-tight transition-all',
                    task.isCompleted && 'line-through text-text-muted'
                  )}
                >
                  {task.title}
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-text-muted">
                  <span className="truncate max-w-[140px] text-text-secondary">
                    {task.project}
                  </span>

                  <span>•</span>

                  <span
                    className={cn(
                      'inline-flex items-center gap-1',
                      task.isOverdue && !task.isCompleted
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
          ))}
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
        Checkbox toggles local UI state
      </div>
    </Card>
  );
}

export default UpcomingTasksList;

