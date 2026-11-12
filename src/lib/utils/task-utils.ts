/**
 * FreelanceHub — Task & Milestone Business Logic Utilities
 */

import { Task } from '@/types/task';
import { Milestone } from '@/types/milestone';

/**
 * Checks if a task is overdue.
 * Rule: Completed tasks are NEVER overdue.
 */
export function isTaskOverdue(task: Task, referenceDate = '2026-11-12'): boolean {
  if (task.status === 'COMPLETED') {
    return false;
  }
  return task.dueDate < referenceDate;
}

export interface TaskSummaryStats {
  total: number;
  todo: number;
  inProgress: number;
  completed: number;
  overdue: number;
  completionRate: number;
}

export function getTaskSummaryStats(
  tasks: Task[],
  referenceDate = '2026-11-12'
): TaskSummaryStats {
  const total = tasks.length;
  const todo = tasks.filter((t) => t.status === 'TODO').length;
  const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
  const overdue = tasks.filter((t) => isTaskOverdue(t, referenceDate)).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    todo,
    inProgress,
    completed,
    overdue,
    completionRate,
  };
}

export interface MilestoneSummaryStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  completionRate: number;
}

export function getMilestoneSummaryStats(milestones: Milestone[]): MilestoneSummaryStats {
  const total = milestones.length;
  const pending = milestones.filter((m) => m.status === 'PENDING').length;
  const inProgress = milestones.filter((m) => m.status === 'IN_PROGRESS').length;
  const completed = milestones.filter((m) => m.status === 'COMPLETED').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    pending,
    inProgress,
    completed,
    completionRate,
  };
}

