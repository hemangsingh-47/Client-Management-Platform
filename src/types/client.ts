export type ClientStatus = 'ACTIVE' | 'INACTIVE';

export interface Client {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  phone?: string;
  address?: string;
  notes?: string;
  status: ClientStatus;
  createdAt: string;
  updatedAt?: string;
  totalProjects: number;
  totalPaid: number;
  outstanding: number;
  lastActivity?: string;
}

export interface ClientProjectSummary {
  id: string;
  title: string;
  budget: number;
  status: string;
  progress: number;
  deadline: string;
  totalPaid: number;
  outstanding: number;
  tasksCount: number;
  completedTasksCount: number;
}

export interface ClientDetails extends Client {
  projects: ClientProjectSummary[];
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    createdAt: string;
  }>;
}
