import { z } from 'zod';

export const reportQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  clientId: z.string().optional(),
  projectStatus: z
    .enum(['ALL', 'PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'])
    .optional()
    .default('ALL'),
});

export type ReportQueryParams = z.infer<typeof reportQuerySchema>;

