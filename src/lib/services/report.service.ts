import { prisma } from '@/lib/prisma';
import { Prisma, ProjectStatus, TaskStatus } from '@prisma/client';
import { reportQuerySchema, ReportQueryParams } from '../validations/report.schema';
import { toNumber, calculateCompletedTotal, calculateOutstanding } from '../utils/financial-calculator';

export class ReportService {
  static async generateReport(params: Partial<ReportQueryParams> = {}) {
    const validated = reportQuerySchema.parse(params);
    const projectWhere: Prisma.ProjectWhereInput = {};

    if (validated.clientId) {
      projectWhere.clientId = validated.clientId;
    }

    if (validated.projectStatus && validated.projectStatus !== 'ALL') {
      projectWhere.status = validated.projectStatus as ProjectStatus;
    }

    if (validated.startDate || validated.endDate) {
      projectWhere.createdAt = {};
      if (validated.startDate) {
        projectWhere.createdAt.gte = new Date(validated.startDate);
      }
      if (validated.endDate) {
        projectWhere.createdAt.lte = new Date(validated.endDate);
      }
    }

    const [projects, clients, tasks] = await Promise.all([
      prisma.project.findMany({
        where: projectWhere,
        include: {
          client: { select: { id: true, name: true, companyName: true } },
          payments: {
            select: { amount: true, status: true, paymentDate: true },
          },
          tasks: {
            select: { id: true, status: true, dueDate: true },
          },
        },
      }),

      prisma.client.findMany({
        where: validated.clientId ? { id: validated.clientId } : undefined,
        include: {
          projects: {
            include: {
              payments: { select: { amount: true, status: true } },
            },
          },
        },
      }),

      prisma.task.findMany({
        where: validated.clientId ? { project: { clientId: validated.clientId } } : undefined,
        select: {
          id: true,
          status: true,
          dueDate: true,
        },
      }),
    ]);

    // Financial calculations
    let totalBudget = 0;
    let totalPaid = 0;
    let totalOutstanding = 0;

    const statusCounts: Record<string, number> = {
      PLANNING: 0,
      IN_PROGRESS: 0,
      ON_HOLD: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };

    const projectPerformance = projects.map((p) => {
      const budget = toNumber(p.budget);
      const paid = toNumber(calculateCompletedTotal(p.payments));
      const outstanding = toNumber(calculateOutstanding(p.budget, paid));

      totalBudget += budget;
      totalPaid += paid;
      totalOutstanding += outstanding;

      statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;

      return {
        id: p.id,
        title: p.title,
        clientName: p.client.name,
        budget,
        totalPaid: paid,
        outstanding,
        progress: p.progress,
        status: p.status,
      };
    });

    const clientPerformance = clients.map((c) => {
      let clientPaid = 0;
      let clientOutstanding = 0;
      let clientBudget = 0;

      for (const p of c.projects) {
        const budget = toNumber(p.budget);
        const paid = toNumber(calculateCompletedTotal(p.payments));
        const outstanding = toNumber(calculateOutstanding(p.budget, paid));

        clientBudget += budget;
        clientPaid += paid;
        clientOutstanding += outstanding;
      }

      return {
        clientId: c.id,
        clientName: c.name,
        companyName: c.companyName,
        totalProjects: c.projects.length,
        totalBudget: clientBudget,
        totalPaid: clientPaid,
        outstanding: clientOutstanding,
      };
    });

    // Task statistics
    const now = new Date();
    let completedTasks = 0;
    let inProgressTasks = 0;
    let todoTasks = 0;
    let overdueTasks = 0;

    for (const t of tasks) {
      if (t.status === TaskStatus.COMPLETED) {
        completedTasks++;
      } else if (t.status === TaskStatus.IN_PROGRESS) {
        inProgressTasks++;
        if (new Date(t.dueDate) < now) overdueTasks++;
      } else {
        todoTasks++;
        if (new Date(t.dueDate) < now) overdueTasks++;
      }
    }

    return {
      revenueSummary: {
        totalBudget,
        totalReceived: totalPaid,
        totalOutstanding,
        collectionRate: totalBudget > 0 ? Number(((totalPaid / totalBudget) * 100).toFixed(1)) : 0,
      },
      projectStatusDistribution: statusCounts,
      clientPerformance,
      projectPerformance,
      taskMetrics: {
        totalTasks: tasks.length,
        completedTasks,
        inProgressTasks,
        todoTasks,
        overdueTasks,
        completionRate: tasks.length > 0 ? Number(((completedTasks / tasks.length) * 100).toFixed(1)) : 0,
      },
    };
  }
}

