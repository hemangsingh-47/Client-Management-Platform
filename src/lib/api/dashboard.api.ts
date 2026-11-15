import { apiRequest } from './client';

export interface DashboardMetrics {
  kpis: {
    paidThisMonth: number;
    outstandingPayments: number;
    activeProjects: number;
    tasksDueSoon: number;
    overdueTasks: number;
  };
  recentProjects: Array<{
    id: string;
    title: string;
    clientName: string;
    budget: number;
    totalPaid: number;
    status: string;
    priority: string;
    progress: number;
    deadline: string;
  }>;
  upcomingTasks: Array<{
    id: string;
    title: string;
    projectName: string;
    dueDate: string;
    priority: string;
    status: string;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    projectName?: string;
    clientName?: string;
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
  }>;
}

export const dashboardApi = {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return apiRequest<DashboardMetrics>('/api/dashboard', {
      method: 'GET',
    });
  },
};

