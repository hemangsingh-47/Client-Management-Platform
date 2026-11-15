export type PaymentMethod =
  | 'Bank Transfer'
  | 'UPI'
  | 'Cash'
  | 'Other'
  | 'BANK_TRANSFER'
  | 'CASH'
  | 'OTHER';

export type PaymentStatus =
  | 'Completed'
  | 'Pending'
  | 'Failed'
  | 'COMPLETED'
  | 'PENDING'
  | 'FAILED';

export interface Payment {
  id: string;
  projectId: string;
  clientId?: string;
  projectName?: string;
  clientName?: string;
  companyName?: string | null;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  reference?: string;
  referenceNumber?: string | null;
  status: PaymentStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string;
}

