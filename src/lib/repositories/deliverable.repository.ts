import { prisma } from '@/lib/prisma';
import { Prisma, DeliverableStatus, AttachmentType } from '@prisma/client';
import { DeliverableQueryParams, CreateDeliverableInput, UpdateDeliverableInput } from '../validations/deliverable.schema';

export class DeliverableRepository {
  static async findMany(params: DeliverableQueryParams) {
    const where: Prisma.DeliverableWhereInput = {};

    if (params.projectId) {
      where.projectId = params.projectId;
    }

    if (params.status && params.status !== 'ALL') {
      where.status = params.status as DeliverableStatus;
    }

    const skip = (params.page - 1) * params.limit;
    const take = params.limit;

    const [total, deliverables] = await Promise.all([
      prisma.deliverable.count({ where }),
      prisma.deliverable.findMany({
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

    return { total, deliverables };
  }

  static async findById(id: string) {
    return prisma.deliverable.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            clientId: true,
            client: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  static async create(data: CreateDeliverableInput) {
    return prisma.deliverable.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        projectId: data.projectId,
        submissionDate: new Date(data.submissionDate),
        attachmentUrl: data.attachmentUrl || null,
        attachmentType: data.attachmentType as AttachmentType,
        status: data.status as DeliverableStatus,
        notes: data.notes ?? null,
      },
      include: {
        project: { select: { id: true, title: true, clientId: true } },
      },
    });
  }

  static async update(id: string, data: UpdateDeliverableInput) {
    return prisma.deliverable.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.submissionDate !== undefined && { submissionDate: new Date(data.submissionDate) }),
        ...(data.attachmentUrl !== undefined && { attachmentUrl: data.attachmentUrl || null }),
        ...(data.attachmentType !== undefined && { attachmentType: data.attachmentType as AttachmentType }),
        ...(data.status !== undefined && { status: data.status as DeliverableStatus }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
      include: {
        project: { select: { id: true, title: true, clientId: true } },
      },
    });
  }

  static async delete(id: string) {
    return prisma.deliverable.delete({
      where: { id },
    });
  }
}

