import { z } from 'zod';

const deliverableStatusEnum = z.enum([
  'PENDING',
  'SUBMITTED',
  'APPROVED',
  'REVISION_REQUIRED',
]);

const attachmentTypeEnum = z.enum([
  'FIGMA',
  'GITHUB',
  'DOCUMENT',
  'ARCHIVE',
  'EXTERNAL_LINK',
]);

export const createDeliverableSchema = z.object({
  title: z.string().trim().min(2, 'Deliverable title must be at least 2 characters').max(150),
  description: z.string().trim().max(1000).optional().nullable(),
  projectId: z.string().trim().min(1, 'Project ID is required'),
  submissionDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/, 'Invalid submission date format')),
  attachmentUrl: z.string().trim().url('Invalid attachment URL').optional().nullable().or(z.literal('')),
  attachmentType: attachmentTypeEnum.default('EXTERNAL_LINK'),
  status: deliverableStatusEnum.default('PENDING'),
  notes: z.string().trim().max(1000).optional().nullable(),
});

export const updateDeliverableSchema = createDeliverableSchema.partial().omit({ projectId: true });

export const deliverableQuerySchema = z.object({
  projectId: z.string().optional(),
  status: z.enum(['ALL', 'PENDING', 'SUBMITTED', 'APPROVED', 'REVISION_REQUIRED']).optional().default('ALL'),
  sortBy: z.enum(['submissionDate', 'createdAt', 'title']).optional().default('submissionDate'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(30),
});

export type CreateDeliverableInput = z.infer<typeof createDeliverableSchema>;
export type UpdateDeliverableInput = z.infer<typeof updateDeliverableSchema>;
export type DeliverableQueryParams = z.infer<typeof deliverableQuerySchema>;

