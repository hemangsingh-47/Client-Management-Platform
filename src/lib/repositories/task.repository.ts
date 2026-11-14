import { prisma } from '@/lib/prisma';
import { Prisma, TaskStatus, Priority } from '@prisma/client';
import { TaskQueryParams, CreateTaskInput, UpdateTaskInput } from '../validations/task.schema';

export class TaskRepository {
  static async findMany(params: TaskQueryParams) {
    const where: Prisma.TaskWhereInput = {};

    if (params.projectId) {
      where.projectId = params.projectId;
    }

    if (params.status && params.status !== 'ALL') {
      where.status = params.status as TaskStatus;
    }

    if (params.priority && params.priority !== 'ALL') {
      where.priority = params.priority as Priority;
    }

    if (params.overdue === 'true') {
      where.status = { not: TaskStatus.COMPLETED };
      where.dueDate = { lt: new Date() };
    } else if (params.overdue === 'false') {
      where.OR = [
        { status: TaskStatus.COMPLETED },
        { dueDate: { gte: new Date() } },
      ];
    }

    const skip = (params.page - 1) * params.limit;
    const take = params.limit;

    const [total, tasks] = await Promise.all([
      prisma.task.count({ where }),
      prisma.task.findMany({
        where,
        skip,
        take,
        orderBy: { [params.sortBy]: params.sortOrder },
        include: {
          project: {
            select: {
              id: true,
              title: true,
              client: { select: { id: true, name: true } },
            },
          },
        },
      }),
    ]);

    return { total, tasks };
  }

  static async findById(id: string) {
    return prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            client: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  static async create(data: CreateTaskInput) {
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        projectId: data.projectId,
        dueDate: new Date(data.dueDate),
        priority: data.priority as Priority,
        status: data.status as TaskStatus,
        completedAt: data.status === 'COMPLETED' ? new Date() : null,
      },
      include: {
        project: { select: { id: true, title: true } },
      },
    });
  }

  static async update(id: string, data: UpdateTaskInput) {
    const updateData: Prisma.TaskUpdateInput = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.dueDate !== undefined) updateData.dueDate = new Date(data.dueDate);
    if (data.priority !== undefined) updateData.priority = data.priority as Priority;

    if (data.status !== undefined) {
      updateData.status = data.status as TaskStatus;
      if (data.status === 'COMPLETED') {
        updateData.completedAt = new Date();
      } else {
        updateData.completedAt = null;
      }
    }

    return prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        project: { select: { id: true, title: true } },
      },
    });
  }

  static async delete(id: string) {
    return prisma.task.delete({
      where: { id },
    });
  }
}

