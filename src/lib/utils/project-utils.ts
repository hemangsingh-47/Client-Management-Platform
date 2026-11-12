/**
 * FreelanceHub — Project Business Logic Utilities
 */

import { Project } from '@/types/project';
import { Task } from '@/types/task';
import { Milestone } from '@/types/milestone';

/**
 * Calculates project progress from its completed tasks and milestones.
 * Documented Rule:
 * - If both tasks and milestones exist: Tasks contribute 60%, Milestones contribute 40%.
 * - If only tasks exist: Tasks contribute 100%.
 * - If only milestones exist: Milestones contribute 100%.
 * - If neither exist: Return project's manually set baseline progress.
 */
export function calculateProjectProgress(
  project: Project,
  tasks: Task[] = [],
  milestones: Milestone[] = []
): number {
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const projectMilestones = milestones.filter((m) => m.projectId === project.id);

  const hasTasks = projectTasks.length > 0;
  const hasMilestones = projectMilestones.length > 0;

  if (hasTasks && hasMilestones) {
    const completedTasks = projectTasks.filter((t) => t.status === 'COMPLETED').length;
    const completedMilestones = projectMilestones.filter((m) => m.status === 'COMPLETED').length;

    const taskRatio = completedTasks / projectTasks.length;
    const milestoneRatio = completedMilestones / projectMilestones.length;

    return Math.round((taskRatio * 0.6 + milestoneRatio * 0.4) * 100);
  }

  if (hasTasks) {
    const completedTasks = projectTasks.filter((t) => t.status === 'COMPLETED').length;
    return Math.round((completedTasks / projectTasks.length) * 100);
  }

  if (hasMilestones) {
    const completedMilestones = projectMilestones.filter((m) => m.status === 'COMPLETED').length;
    return Math.round((completedMilestones / projectMilestones.length) * 100);
  }

  return project.progress;
}

export interface ProjectStatusCounts {
  total: number;
  planning: number;
  inProgress: number;
  onHold: number;
  completed: number;
  cancelled: number;
}

export function getProjectStatusCounts(projects: Project[]): ProjectStatusCounts {
  return {
    total: projects.length,
    planning: projects.filter((p) => p.status === 'PLANNING').length,
    inProgress: projects.filter((p) => p.status === 'IN_PROGRESS').length,
    onHold: projects.filter((p) => p.status === 'ON_HOLD').length,
    completed: projects.filter((p) => p.status === 'COMPLETED').length,
    cancelled: projects.filter((p) => p.status === 'CANCELLED').length,
  };
}

export function isProjectOverdue(project: Project, referenceDate = '2026-11-12'): boolean {
  if (project.status === 'COMPLETED' || project.status === 'CANCELLED') {
    return false;
  }
  return project.deadline < referenceDate;
}

