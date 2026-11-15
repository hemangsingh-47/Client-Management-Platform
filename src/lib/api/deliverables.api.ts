import { apiRequest } from './client';
import { Deliverable, DeliverableStatus, AttachmentType } from '@/types/deliverable';

export interface DeliverableListResponse {
  items: Array<
    Deliverable & {
      projectName: string;
      clientName: string;
    }
  >;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DeliverableQueryParams {
  projectId?: string;
  status?: DeliverableStatus | 'ALL';
  sortBy?: 'submissionDate' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CreateDeliverableDTO {
  title: string;
  description?: string | null;
  projectId: string;
  submissionDate: string;
  attachmentUrl?: string | null;
  attachmentType?: AttachmentType;
  status?: DeliverableStatus;
  notes?: string | null;
}

export type UpdateDeliverableDTO = Partial<Omit<CreateDeliverableDTO, 'projectId'>>;

export const deliverablesApi = {
  async getDeliverables(params?: DeliverableQueryParams): Promise<DeliverableListResponse> {
    return apiRequest<DeliverableListResponse>('/api/deliverables', {
      method: 'GET',
      params: params as Record<string, string | number>,
    });
  },

  async getDeliverableById(id: string): Promise<Deliverable> {
    return apiRequest<Deliverable>(`/api/deliverables/${id}`, {
      method: 'GET',
    });
  },

  async createDeliverable(data: CreateDeliverableDTO): Promise<Deliverable> {
    return apiRequest<Deliverable>('/api/deliverables', {
      method: 'POST',
      body: data,
    });
  },

  async updateDeliverable(id: string, data: UpdateDeliverableDTO): Promise<Deliverable> {
    return apiRequest<Deliverable>(`/api/deliverables/${id}`, {
      method: 'PATCH',
      body: data,
    });
  },

  async deleteDeliverable(id: string): Promise<{ id: string }> {
    return apiRequest<{ id: string }>(`/api/deliverables/${id}`, {
      method: 'DELETE',
    });
  },
};

