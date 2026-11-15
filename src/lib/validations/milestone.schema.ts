import { z } from 'zod';

const milestoneStatusEnum = z.preprocess(
  (val) => (typeof val === 'string' ? val.toUpperCase().replace(/\s+/g, '_') : val),
  z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
);

export const createMilestoneSchema = z.object({
  title: z.string().trim().min(2, 'Milestone title must be at least 2 characters').max(150),
  description: z.string().trim().max(1000).optional().nullable(),
  projectId: z.string().trim().min(1, 'Project ID is required'),
  dueDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/, 'Invalid due date format')),
  status: milestoneStatusEnum.default('PENDING'),
});

export const updateMilestoneSchema = createMilestoneSchema.partial().omit({ projectId: true });

export const milestoneQuerySchema = z.object({
  projectId: z.string().optional(),
  status: z.enum(['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED']).optional().default('ALL'),
});

export type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>;
export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>;
export type MilestoneQueryParams = z.infer<typeof milestoneQuerySchema>;

