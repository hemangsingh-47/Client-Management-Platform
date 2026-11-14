import { prisma } from '@/lib/prisma';

export interface CreateActivityData {
  type: string;
  description: string;
  projectId?: string | null;
  clientId?: string | null;
}

export class ActivityRepository {
  static async create(data: CreateActivityData) {
    return prisma.activity.create({
      data: {
        type: data.type,
        description: data.description,
        projectId: data.projectId ?? null,
        clientId: data.clientId ?? null,
      },
    });
  }

  static async findRecent(limit = 10) {
    return prisma.activity.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        project: {
          select: { id: true, title: true },
        },
        client: {
          select: { id: true, name: true },
        },
      },
    });
  }

  static async findByProjectId(projectId: string, limit = 10) {
    return prisma.activity.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}

