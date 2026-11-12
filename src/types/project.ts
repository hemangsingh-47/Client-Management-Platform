export type ProjectStatus =
  | 'PLANNING'
  | 'IN_PROGRESS'
  | 'ON_HOLD'
  | 'COMPLETED'
  | 'CANCELLED';

export type ProjectPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Project {
  id: string;
  title: string;
  clientId: string;
  description: string;
  budget: number;
  startDate: string;
  deadline: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  notes?: string;
  createdAt: string;
}

