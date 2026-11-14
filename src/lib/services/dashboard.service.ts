import { prisma } from '@/lib/prisma';
import { ProjectStatus, TaskStatus, PaymentStatus } from '@prisma/client';
import { toNumber, calculateCompletedTotal, calculateOutstanding } from '../utils/financial-calculator';

export class DashboardService {
  static async getDashboardMetrics() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Run parallel queries against PostgreSQL for high throughput
    const [
      paidThisMonthAgg,
      activeProjects,
      allProjectsWithPayments,
      tasksDueSoonCount,
      overdueTasksCount,
      recentProjects,
      upcomingTasks,
      recentActivities,
      allCompletedPayments,
    ] = await Promise.all([
      // 1. Paid this month (completed payments in current calendar month)
      prisma.payment.aggregate({
        where: {
          status: PaymentStatus.COMPLETED,
          paymentDate: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        _sum: { amount: true },
      }),

      // 2. Active Projects count (Planning + In Progress)
      prisma.project.count({
        where: {
          status: { in: [ProjectStatus.PLANNING, ProjectStatus.IN_PROGRESS] },
        },
      }),

      // 3. Projects with completed payments for global outstanding computation
      prisma.project.findMany({
        where: {
          status: { in: [ProjectStatus.PLANNING, ProjectStatus.IN_PROGRESS, ProjectStatus.ON_HOLD] },
        },
        select: {
          id: true,
          budget: true,
          payments: {
            where: { status: PaymentStatus.COMPLETED },
            select: { amount: true, status: true },
          },
        },
      }),

      // 4. Tasks due soon (due within next 7 days, incomplete)
      prisma.task.count({
        where: {
          status: { not: TaskStatus.COMPLETED },
          dueDate: {
            gte: startOfToday,
            lte: sevenDaysFromNow,
          },
        },
      }),

      // 5. Overdue tasks (due before today, incomplete)
      prisma.task.count({
        where: {
          status: { not: TaskStatus.COMPLETED },
          dueDate: { lt: startOfToday },
        },
      }),

      // 6. Recent Projects (latest 5)
      prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          client: { select: { id: true, name: true, companyName: true } },
          payments: {
            where: { status: PaymentStatus.COMPLETED },
            select: { amount: true, status: true },
          },
        },
      }),

      // 7. Upcoming Tasks (latest 5 incomplete tasks sorted by due date)
      prisma.task.findMany({
        where: { status: { not: TaskStatus.COMPLETED } },
        orderBy: { dueDate: 'asc' },
        take: 5,
        include: {
          project: { select: { id: true, title: true } },
        },
      }),

      // 8. Recent Activities (latest 8)
      prisma.activity.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: {
          project: { select: { id: true, title: true } },
          client: { select: { id: true, name: true } },
        },
      }),

      // 9. All completed payments for monthly chart (last 6 months)
      prisma.payment.findMany({
        where: {
          status: PaymentStatus.COMPLETED,
          paymentDate: {
            gte: new Date(now.getFullYear(), now.getMonth() - 5, 1),
          },
        },
        select: {
          amount: true,
          paymentDate: true,
        },
      }),
    ]);

    // Calculate total outstanding balance
    let totalOutstanding = 0;
    for (const proj of allProjectsWithPayments) {
      const paid = calculateCompletedTotal(proj.payments);
      const remaining = calculateOutstanding(proj.budget, paid);
      totalOutstanding += toNumber(remaining);
    }

    // Process last 6 months revenue chart
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyRevenueMap = new Map<string, number>();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      monthlyRevenueMap.set(key, 0);
    }

    for (const payment of allCompletedPayments) {
      const pDate = new Date(payment.paymentDate);
      const key = `${monthNames[pDate.getMonth()]} ${pDate.getFullYear()}`;
      if (monthlyRevenueMap.has(key)) {
        monthlyRevenueMap.set(key, (monthlyRevenueMap.get(key) || 0) + toNumber(payment.amount));
      }
    }

    const monthlyRevenueData = Array.from(monthlyRevenueMap.entries()).map(([month, revenue]) => ({
      month,
      revenue,
    }));

    return {
      kpis: {
        paidThisMonth: toNumber(paidThisMonthAgg._sum.amount),
        outstandingPayments: totalOutstanding,
        activeProjects,
        tasksDueSoon: tasksDueSoonCount,
        overdueTasks: overdueTasksCount,
      },
      recentProjects: recentProjects.map((p) => {
        const paid = toNumber(calculateCompletedTotal(p.payments));
        return {
          id: p.id,
          title: p.title,
          clientName: p.client.name,
          budget: toNumber(p.budget),
          totalPaid: paid,
          status: p.status,
          priority: p.priority,
          progress: p.progress,
          deadline: p.deadline.toISOString(),
        };
      }),
      upcomingTasks: upcomingTasks.map((t) => ({
        id: t.id,
        title: t.title,
        projectName: t.project.title,
        dueDate: t.dueDate.toISOString(),
        priority: t.priority,
        status: t.status,
      })),
      recentActivity: recentActivities.map((a) => ({
        id: a.id,
        type: a.type,
        description: a.description,
        timestamp: a.createdAt.toISOString(),
        projectName: a.project?.title,
        clientName: a.client?.name,
      })),
      monthlyRevenue: monthlyRevenueData,
    };
  }
}

