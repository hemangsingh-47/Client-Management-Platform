import { apiRequest } from './client';
import type { Client, ClientDetails, ClientStatus } from '@/types/client';
export type { Client, ClientDetails, ClientStatus };

export interface ClientListResponse {
  items: Client[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ClientQueryParams {
  search?: string;
  status?: ClientStatus | 'ALL';
  sortBy?: 'name' | 'createdAt' | 'companyName';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CreateClientDTO {
  name: string;
  email: string;
  companyName?: string | null;
  phone?: string | null;
  address?: string | null;
  notes?: string | null;
  status?: ClientStatus;
}

export type UpdateClientDTO = Partial<CreateClientDTO>;

export const clientsApi = {
  async getClients(params?: ClientQueryParams): Promise<ClientListResponse> {
    return apiRequest<ClientListResponse>('/api/clients', {
      method: 'GET',
      params: params as Record<string, string | number>,
    });
  },

  async getClientById(id: string): Promise<ClientDetails> {
    return apiRequest<ClientDetails>(`/api/clients/${id}`, {
      method: 'GET',
    });
  },

  async createClient(data: CreateClientDTO): Promise<Client> {
    return apiRequest<Client>('/api/clients', {
      method: 'POST',
      body: data,
    });
  },

  async updateClient(id: string, data: UpdateClientDTO): Promise<Client> {
    return apiRequest<Client>(`/api/clients/${id}`, {
      method: 'PATCH',
      body: data,
    });
  },

  async deleteClient(id: string): Promise<{ id: string }> {
    return apiRequest<{ id: string }>(`/api/clients/${id}`, {
      method: 'DELETE',
    });
  },
};

