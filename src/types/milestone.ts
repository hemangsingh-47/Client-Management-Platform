export type MilestoneStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  dueDate: string;
  status: MilestoneStatus;
  completedAt?: string;
  createdAt: string;
}

