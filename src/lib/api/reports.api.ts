import { apiRequest } from './client';

export interface ReportQueryParams {
  startDate?: string;
  endDate?: string;
  clientId?: string;
  projectStatus?: string;
}

export interface ReportData {
  revenueSummary: {
    totalBudget: number;
    totalReceived: number;
    totalOutstanding: number;
    collectionRate: number;
  };
  projectStatusDistribution: Record<string, number>;
  clientPerformance: Array<{
    clientId: string;
    clientName: string;
    companyName?: string | null;
    totalProjects: number;
    totalBudget: number;
    totalPaid: number;
    outstanding: number;
  }>;
  projectPerformance: Array<{
    id: string;
    title: string;
    clientName: string;
    budget: number;
    totalPaid: number;
    outstanding: number;
    progress: number;
    status: string;
  }>;
  taskMetrics: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    todoTasks: number;
    overdueTasks: number;
    completionRate: number;
  };
}

export const reportsApi = {
  async getReports(params?: ReportQueryParams): Promise<ReportData> {
    return apiRequest<ReportData>('/api/reports', {
      method: 'GET',
      params: params as Record<string, string>,
    });
  },
};

