import { z } from 'zod';

const projectStatusEnum = z.preprocess(
  (val) => (typeof val === 'string' ? val.toUpperCase().replace(/\s+/g, '_') : val),
  z.enum([
    'PLANNING',
    'IN_PROGRESS',
    'ON_HOLD',
    'COMPLETED',
    'CANCELLED',
  ])
);

const projectPriorityEnum = z.preprocess(
  (val) => (typeof val === 'string' ? val.toUpperCase() : val),
  z.enum(['LOW', 'MEDIUM', 'HIGH'])
);

export const createProjectSchema = z
  .object({
    title: z.string().trim().min(2, 'Project title must be at least 2 characters').max(150),
    description: z.string().trim().max(2000).optional().nullable(),
    clientId: z.string().trim().min(1, 'Client ID is required'),
    budget: z.coerce.number().positive('Budget must be a positive number'),
    startDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/, 'Invalid start date format')),
    deadline: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/, 'Invalid deadline format')),
    status: projectStatusEnum.default('PLANNING'),
    priority: projectPriorityEnum.default('MEDIUM'),
    progress: z.coerce.number().int().min(0).max(100, 'Progress must be between 0 and 100').default(0),
    notes: z.string().trim().max(1000).optional().nullable(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate).getTime();
      const end = new Date(data.deadline).getTime();
      return end >= start;
    },
    {
      message: 'Deadline cannot be before the start date',
      path: ['deadline'],
    }
  );

export const updateProjectSchema = z
  .object({
    title: z.string().trim().min(2).max(150).optional(),
    description: z.string().trim().max(2000).optional().nullable(),
    clientId: z.string().trim().min(1).optional(),
    budget: z.coerce.number().positive('Budget must be positive').optional(),
    startDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)).optional(),
    deadline: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)).optional(),
    status: projectStatusEnum.optional(),
    priority: projectPriorityEnum.optional(),
    progress: z.coerce.number().int().min(0).max(100).optional(),
    notes: z.string().trim().max(1000).optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.deadline) {
        return new Date(data.deadline).getTime() >= new Date(data.startDate).getTime();
      }
      return true;
    },
    {
      message: 'Deadline cannot be before the start date',
      path: ['deadline'],
    }
  );

export const projectQuerySchema = z.object({
  search: z.string().optional(),
  clientId: z.string().optional(),
  status: z.enum(['ALL', 'PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED']).optional().default('ALL'),
  priority: z.enum(['ALL', 'LOW', 'MEDIUM', 'HIGH']).optional().default('ALL'),
  sortBy: z.enum(['createdAt', 'deadline', 'budget', 'title']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectQueryParams = z.infer<typeof projectQuerySchema>;

