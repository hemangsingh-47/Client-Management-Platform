/**
 * FreelanceHub — Task & Milestone Business Logic Utilities
 */

import { Task } from '@/types/task';
import { Milestone } from '@/types/milestone';

/**
 * Checks if a task is overdue.
 * Rule: Completed tasks are NEVER overdue.
 */
export function isTaskOverdue(task: Task, referenceDate?: string): boolean {
  if (task.status === 'COMPLETED') {
    return false;
  }
  const ref = referenceDate || new Date().toISOString().split('T')[0];
  const taskDue = task.dueDate.includes('T') ? task.dueDate.split('T')[0] : task.dueDate;
  return taskDue < ref;
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
  referenceDate?: string
): TaskSummaryStats {
  const ref = referenceDate || new Date().toISOString().split('T')[0];
  const total = tasks.length;
  const todo = tasks.filter((t) => t.status === 'TODO').length;
  const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
  const overdue = tasks.filter((t) => isTaskOverdue(t, ref)).length;
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

