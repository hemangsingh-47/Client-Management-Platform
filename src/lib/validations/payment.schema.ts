import { z } from 'zod';

const paymentMethodEnum = z.preprocess((val) => {
  if (typeof val === 'string') {
    const normalized = val.toUpperCase().replace(/\s+/g, '_');
    if (normalized === 'CREDIT_CARD' || normalized === 'STRIPE') return 'OTHER';
    return normalized;
  }
  return val;
}, z.enum(['BANK_TRANSFER', 'UPI', 'CASH', 'OTHER']));

const paymentStatusEnum = z.preprocess((val) => {
  if (typeof val === 'string') {
    return val.toUpperCase();
  }
  return val;
}, z.enum(['COMPLETED', 'PENDING', 'FAILED']));

export const createPaymentSchema = z
  .object({
    projectId: z.string().trim().min(1, 'Project ID is required'),
    amount: z.coerce.number().positive('Payment amount must be greater than zero'),
    paymentDate: z
      .string()
      .datetime({ offset: true })
      .or(z.string().regex(/^\d{4}-\d{2}-\d{2}/, 'Invalid payment date format')),
    paymentMethod: paymentMethodEnum,
    referenceNumber: z.string().trim().max(100).optional().nullable(),
    reference: z.string().trim().max(100).optional().nullable(),
    status: paymentStatusEnum.default('COMPLETED'),
    notes: z.string().trim().max(1000).optional().nullable(),
  })
  .transform((data) => ({
    projectId: data.projectId,
    amount: data.amount,
    paymentDate: data.paymentDate,
    paymentMethod: data.paymentMethod,
    referenceNumber: data.referenceNumber ?? data.reference ?? null,
    status: data.status,
    notes: data.notes ?? null,
  }));

export const updatePaymentSchema = z.object({
  amount: z.coerce.number().positive('Payment amount must be greater than zero').optional(),
  paymentDate: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}/, 'Invalid payment date format'))
    .optional(),
  paymentMethod: paymentMethodEnum.optional(),
  referenceNumber: z.string().trim().max(100).optional().nullable(),
  reference: z.string().trim().max(100).optional().nullable(),
  status: paymentStatusEnum.optional(),
  notes: z.string().trim().max(1000).optional().nullable(),
}).transform((data) => ({
  ...(data.amount !== undefined && { amount: data.amount }),
  ...(data.paymentDate !== undefined && { paymentDate: data.paymentDate }),
  ...(data.paymentMethod !== undefined && { paymentMethod: data.paymentMethod }),
  ...((data.referenceNumber !== undefined || data.reference !== undefined) && {
    referenceNumber: data.referenceNumber ?? data.reference ?? null,
  }),
  ...(data.status !== undefined && { status: data.status }),
  ...(data.notes !== undefined && { notes: data.notes }),
}));

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

export type CreatePaymentInput = z.input<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.input<typeof updatePaymentSchema>;
export type PaymentQueryParams = z.infer<typeof paymentQuerySchema>;

