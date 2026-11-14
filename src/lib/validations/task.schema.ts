import { z } from 'zod';

const taskStatusEnum = z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']);
const priorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);

export const createTaskSchema = z.object({
  title: z.string().trim().min(2, 'Task title must be at least 2 characters').max(150),
  description: z.string().trim().max(1000).optional().nullable(),
  projectId: z.string().trim().min(1, 'Project ID is required'),
  dueDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/, 'Invalid due date format')),
  priority: priorityEnum.default('MEDIUM'),
  status: taskStatusEnum.default('TODO'),
});

export const updateTaskSchema = createTaskSchema.partial().omit({ projectId: true });

export const taskQuerySchema = z.object({
  projectId: z.string().optional(),
  status: z.enum(['ALL', 'TODO', 'IN_PROGRESS', 'COMPLETED']).optional().default('ALL'),
  priority: z.enum(['ALL', 'LOW', 'MEDIUM', 'HIGH']).optional().default('ALL'),
  overdue: z.enum(['true', 'false', 'all']).optional().default('all'),
  sortBy: z.enum(['dueDate', 'createdAt', 'priority', 'title']).optional().default('dueDate'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(30),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryParams = z.infer<typeof taskQuerySchema>;

