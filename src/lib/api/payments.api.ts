import { apiRequest } from './client';
import { Payment, PaymentMethod, PaymentStatus } from '@/types/payment';

export interface PaymentListResponse {
  items: Array<
    Payment & {
      projectName: string;
      projectBudget: number;
      clientId: string;
      clientName: string;
      companyName?: string | null;
      referenceNumber?: string | null;
    }
  >;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaymentQueryParams {
  projectId?: string;
  status?: PaymentStatus | 'ALL';
  paymentMethod?: PaymentMethod | 'ALL';
  startDate?: string;
  endDate?: string;
  sortBy?: 'paymentDate' | 'amount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CreatePaymentDTO {
  projectId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  referenceNumber?: string | null;
  status?: string;
  notes?: string | null;
}

export type UpdatePaymentDTO = Partial<Omit<CreatePaymentDTO, 'projectId'>>;

export const paymentsApi = {
  async getPayments(params?: PaymentQueryParams): Promise<PaymentListResponse> {
    return apiRequest<PaymentListResponse>('/api/payments', {
      method: 'GET',
      params: params as Record<string, string | number>,
    });
  },

  async getPaymentById(id: string): Promise<Payment> {
    return apiRequest<Payment>(`/api/payments/${id}`, {
      method: 'GET',
    });
  },

  async createPayment(data: CreatePaymentDTO): Promise<Payment> {
    return apiRequest<Payment>('/api/payments', {
      method: 'POST',
      body: data,
    });
  },

  async updatePayment(id: string, data: UpdatePaymentDTO): Promise<Payment> {
    return apiRequest<Payment>(`/api/payments/${id}`, {
      method: 'PATCH',
      body: data,
    });
  },

  async deletePayment(id: string): Promise<{ id: string }> {
    return apiRequest<{ id: string }>(`/api/payments/${id}`, {
      method: 'DELETE',
    });
  },
};

