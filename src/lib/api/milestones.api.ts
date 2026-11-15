import { apiRequest } from './client';
import { Milestone, MilestoneStatus } from '@/types/milestone';

export interface MilestoneQueryParams {
  projectId?: string;
  status?: MilestoneStatus | 'ALL';
}

export interface CreateMilestoneDTO {
  title: string;
  description?: string | null;
  projectId: string;
  dueDate: string;
  status?: MilestoneStatus;
}

export type UpdateMilestoneDTO = Partial<Omit<CreateMilestoneDTO, 'projectId'>>;

export const milestonesApi = {
  async getMilestones(params?: MilestoneQueryParams): Promise<Milestone[]> {
    return apiRequest<Milestone[]>('/api/milestones', {
      method: 'GET',
      params: params as Record<string, string>,
    });
  },

  async getMilestoneById(id: string): Promise<Milestone> {
    return apiRequest<Milestone>(`/api/milestones/${id}`, {
      method: 'GET',
    });
  },

  async createMilestone(data: CreateMilestoneDTO): Promise<Milestone> {
    return apiRequest<Milestone>('/api/milestones', {
      method: 'POST',
      body: data,
    });
  },

  async updateMilestone(id: string, data: UpdateMilestoneDTO): Promise<Milestone> {
    return apiRequest<Milestone>(`/api/milestones/${id}`, {
      method: 'PATCH',
      body: data,
    });
  },

  async deleteMilestone(id: string): Promise<{ id: string }> {
    return apiRequest<{ id: string }>(`/api/milestones/${id}`, {
      method: 'DELETE',
    });
  },
};

