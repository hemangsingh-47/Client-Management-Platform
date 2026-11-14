import { z } from 'zod';

const paymentMethodEnum = z.enum(['BANK_TRANSFER', 'UPI', 'CASH', 'OTHER']);
const paymentStatusEnum = z.enum(['COMPLETED', 'PENDING', 'FAILED']);

export const createPaymentSchema = z.object({
  projectId: z.string().trim().min(1, 'Project ID is required'),
  amount: z.coerce.number().positive('Payment amount must be greater than zero'),
  paymentDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/, 'Invalid payment date format')),
  paymentMethod: paymentMethodEnum,
  referenceNumber: z.string().trim().max(100).optional().nullable(),
  status: paymentStatusEnum.default('COMPLETED'),
  notes: z.string().trim().max(1000).optional().nullable(),
});

export const updatePaymentSchema = createPaymentSchema.partial().omit({ projectId: true });

export const paymentQuerySchema = z.object({
  projectId: z.string().optional(),
  status: z.enum(['ALL', 'COMPLETED', 'PENDING', 'FAILED']).optional().default('ALL'),
  paymentMethod: z.enum(['ALL', 'BANK_TRANSFER', 'UPI', 'CASH', 'OTHER']).optional().default('ALL'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z.enum(['paymentDate', 'amount', 'createdAt']).optional().default('paymentDate'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(30),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
export type PaymentQueryParams = z.infer<typeof paymentQuerySchema>;

