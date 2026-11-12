export type PaymentMethod = 'Bank Transfer' | 'UPI' | 'Cash' | 'Other';
export type PaymentStatus = 'Completed' | 'Pending' | 'Failed';

export interface Payment {
  id: string;
  projectId: string;
  clientId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  reference: string;
  status: PaymentStatus;
  notes?: string;
  createdAt: string;
}

