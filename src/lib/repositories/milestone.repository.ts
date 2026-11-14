import { prisma } from '@/lib/prisma';
import { Prisma, MilestoneStatus } from '@prisma/client';
import { MilestoneQueryParams, CreateMilestoneInput, UpdateMilestoneInput } from '../validations/milestone.schema';

export class MilestoneRepository {
  static async findMany(params: MilestoneQueryParams) {
    const where: Prisma.MilestoneWhereInput = {};

    if (params.projectId) {
      where.projectId = params.projectId;
    }

    if (params.status && params.status !== 'ALL') {
      where.status = params.status as MilestoneStatus;
    }

    return prisma.milestone.findMany({
      where,
      orderBy: { dueDate: 'asc' },
      include: {
        project: {
          select: { id: true, title: true },
        },
      },
    });
  }

  static async findById(id: string) {
    return prisma.milestone.findUnique({
      where: { id },
      include: {
        project: {
          select: { id: true, title: true },
        },
      },
    });
  }

  static async create(data: CreateMilestoneInput) {
    return prisma.milestone.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        projectId: data.projectId,
        dueDate: new Date(data.dueDate),
        status: data.status as MilestoneStatus,
        completedAt: data.status === 'COMPLETED' ? new Date() : null,
      },
      include: {
        project: { select: { id: true, title: true } },
      },
    });
  }

  static async update(id: string, data: UpdateMilestoneInput) {
    const updateData: Prisma.MilestoneUpdateInput = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.dueDate !== undefined) updateData.dueDate = new Date(data.dueDate);

    if (data.status !== undefined) {
      updateData.status = data.status as MilestoneStatus;
      if (data.status === 'COMPLETED') {
        updateData.completedAt = new Date();
      } else {
        updateData.completedAt = null;
      }
    }

    return prisma.milestone.update({
      where: { id },
      data: updateData,
      include: {
        project: { select: { id: true, title: true } },
      },
    });
  }

  static async delete(id: string) {
    return prisma.milestone.delete({
      where: { id },
    });
  }
}

