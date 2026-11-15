import { apiRequest } from './client';
import { Project, ProjectStatus, ProjectPriority } from '@/types/project';

export interface ProjectListResponse {
  items: Array<
    Project & {
      clientName: string;
      companyName?: string | null;
      totalPaid: number;
      outstanding: number;
      tasksCount: number;
      milestonesCount: number;
      deliverablesCount: number;
    }
  >;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProjectDetailsResponse extends Project {
  client: {
    id: string;
    name: string;
    companyName?: string | null;
    email: string;
    phone?: string | null;
  };
  financials: {
    budget: number;
    totalPaid: number;
    outstanding: number;
  };
  tasks: Array<{
    id: string;
    title: string;
    description?: string | null;
    dueDate: string;
    priority: ProjectPriority;
    status: string;
    completedAt?: string | null;
  }>;
  milestones: Array<{
    id: string;
    title: string;
    description?: string | null;
    dueDate: string;
    status: string;
    completedAt?: string | null;
  }>;
  deliverables: Array<{
    id: string;
    title: string;
    description?: string | null;
    submissionDate: string;
    attachmentUrl?: string | null;
    attachmentType: string;
    status: string;
    notes?: string | null;
  }>;
  payments: Array<{
    id: string;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    referenceNumber?: string | null;
    status: string;
    notes?: string | null;
  }>;
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    createdAt: string;
  }>;
}

export interface ProjectQueryParams {
  search?: string;
  clientId?: string;
  status?: ProjectStatus | 'ALL';
  priority?: ProjectPriority | 'ALL';
  sortBy?: 'createdAt' | 'deadline' | 'budget' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CreateProjectDTO {
  title: string;
  description?: string | null;
  clientId: string;
  budget: number;
  startDate: string;
  deadline: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  progress?: number;
  notes?: string | null;
}

export type UpdateProjectDTO = Partial<CreateProjectDTO>;

export const projectsApi = {
  async getProjects(params?: ProjectQueryParams): Promise<ProjectListResponse> {
    return apiRequest<ProjectListResponse>('/api/projects', {
      method: 'GET',
      params: params as Record<string, string | number>,
    });
  },

  async getProjectById(id: string): Promise<ProjectDetailsResponse> {
    return apiRequest<ProjectDetailsResponse>(`/api/projects/${id}`, {
      method: 'GET',
    });
  },

  async createProject(data: CreateProjectDTO): Promise<Project> {
    return apiRequest<Project>('/api/projects', {
      method: 'POST',
      body: data,
    });
  },

  async updateProject(id: string, data: UpdateProjectDTO): Promise<Project> {
    return apiRequest<Project>(`/api/projects/${id}`, {
      method: 'PATCH',
      body: data,
    });
  },

  async deleteProject(id: string): Promise<{ id: string }> {
    return apiRequest<{ id: string }>(`/api/projects/${id}`, {
      method: 'DELETE',
    });
  },
};

