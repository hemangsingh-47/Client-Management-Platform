import { ProjectPriority } from './project';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  projectName?: string;
  clientName?: string;
  dueDate: string;
  priority: ProjectPriority;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
  isOverdue?: boolean;
}

