import { apiRequest } from './client';
import { Task, TaskStatus } from '@/types/task';
import { ProjectPriority } from '@/types/project';

export interface TaskListResponse {
  items: Array<
    Task & {
      projectName: string;
      clientName: string;
      isOverdue: boolean;
    }
  >;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TaskQueryParams {
  projectId?: string;
  status?: TaskStatus | 'ALL';
  priority?: ProjectPriority | 'ALL';
  overdue?: 'true' | 'false' | 'all';
  sortBy?: 'dueDate' | 'createdAt' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CreateTaskDTO {
  title: string;
  description?: string | null;
  projectId: string;
  dueDate: string;
  priority?: ProjectPriority;
  status?: TaskStatus;
}

export type UpdateTaskDTO = Partial<Omit<CreateTaskDTO, 'projectId'>>;

export const tasksApi = {
  async getTasks(params?: TaskQueryParams): Promise<TaskListResponse> {
    return apiRequest<TaskListResponse>('/api/tasks', {
      method: 'GET',
      params: params as Record<string, string | number>,
    });
  },

  async getTaskById(id: string): Promise<Task> {
    return apiRequest<Task>(`/api/tasks/${id}`, {
      method: 'GET',
    });
  },

  async createTask(data: CreateTaskDTO): Promise<Task> {
    return apiRequest<Task>('/api/tasks', {
      method: 'POST',
      body: data,
    });
  },

  async updateTask(id: string, data: UpdateTaskDTO): Promise<Task> {
    return apiRequest<Task>(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: data,
    });
  },

  async deleteTask(id: string): Promise<{ id: string }> {
    return apiRequest<{ id: string }>(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};

