import { prisma } from '@/lib/prisma';
import { Prisma, ProjectStatus, Priority } from '@prisma/client';
import { ProjectQueryParams, CreateProjectInput, UpdateProjectInput } from '../validations/project.schema';

export class ProjectRepository {
  static async findMany(params: ProjectQueryParams) {
    const where: Prisma.ProjectWhereInput = {};

    if (params.search) {
      where.title = { contains: params.search, mode: 'insensitive' };
    }

    if (params.clientId) {
      where.clientId = params.clientId;
    }

    if (params.status && params.status !== 'ALL') {
      where.status = params.status as ProjectStatus;
    }

    if (params.priority && params.priority !== 'ALL') {
      where.priority = params.priority as Priority;
    }

    const skip = (params.page - 1) * params.limit;
    const take = params.limit;

    const [total, projects] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        skip,
        take,
        orderBy: { [params.sortBy]: params.sortOrder },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              companyName: true,
              email: true,
            },
          },
          payments: {
            select: {
              amount: true,
              status: true,
            },
          },
          _count: {
            select: {
              tasks: true,
              milestones: true,
              deliverables: true,
              payments: true,
            },
          },
        },
      }),
    ]);

    return { total, projects };
  }

  static async findById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        client: true,
        tasks: {
          orderBy: { dueDate: 'asc' },
        },
        milestones: {
          orderBy: { dueDate: 'asc' },
        },
        deliverables: {
          orderBy: { submissionDate: 'desc' },
        },
        payments: {
          orderBy: { paymentDate: 'desc' },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  static async create(data: CreateProjectInput) {
    return prisma.project.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        clientId: data.clientId,
        budget: new Prisma.Decimal(data.budget),
        startDate: new Date(data.startDate),
        deadline: new Date(data.deadline),
        status: data.status as ProjectStatus,
        priority: data.priority as Priority,
        progress: data.progress ?? 0,
        notes: data.notes ?? null,
      },
      include: {
        client: true,
      },
    });
  }

  static async update(id: string, data: UpdateProjectInput) {
    return prisma.project.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.clientId !== undefined && { clientId: data.clientId }),
        ...(data.budget !== undefined && { budget: new Prisma.Decimal(data.budget) }),
        ...(data.startDate !== undefined && { startDate: new Date(data.startDate) }),
        ...(data.deadline !== undefined && { deadline: new Date(data.deadline) }),
        ...(data.status !== undefined && { status: data.status as ProjectStatus }),
        ...(data.priority !== undefined && { priority: data.priority as Priority }),
        ...(data.progress !== undefined && { progress: data.progress }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
      include: {
        client: true,
      },
    });
  }

  static async delete(id: string) {
    return prisma.project.delete({
      where: { id },
    });
  }

  static async countPayments(id: string) {
    return prisma.payment.count({
      where: { projectId: id },
    });
  }
}

