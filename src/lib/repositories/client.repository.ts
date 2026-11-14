import { prisma } from '@/lib/prisma';
import { Prisma, ClientStatus } from '@prisma/client';
import { ClientQueryParams, CreateClientInput, UpdateClientInput } from '../validations/client.schema';

export class ClientRepository {
  static async findMany(params: ClientQueryParams) {
    const where: Prisma.ClientWhereInput = {};

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { companyName: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.status && params.status !== 'ALL') {
      where.status = params.status as ClientStatus;
    }

    const skip = (params.page - 1) * params.limit;
    const take = params.limit;

    const [total, clients] = await Promise.all([
      prisma.client.count({ where }),
      prisma.client.findMany({
        where,
        skip,
        take,
        orderBy: { [params.sortBy]: params.sortOrder },
        include: {
          projects: {
            select: {
              id: true,
              title: true,
              budget: true,
              status: true,
              payments: {
                select: {
                  amount: true,
                  status: true,
                },
              },
            },
          },
          _count: {
            select: { projects: true },
          },
        },
      }),
    ]);

    return { total, clients };
  }

  static async findById(id: string) {
    return prisma.client.findUnique({
      where: { id },
      include: {
        projects: {
          include: {
            payments: true,
            tasks: { select: { id: true, status: true } },
          },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        _count: {
          select: { projects: true },
        },
      },
    });
  }

  static async findByEmail(email: string) {
    return prisma.client.findUnique({
      where: { email },
    });
  }

  static async create(data: CreateClientInput) {
    return prisma.client.create({
      data: {
        name: data.name,
        email: data.email,
        companyName: data.companyName ?? null,
        phone: data.phone ?? null,
        address: data.address ?? null,
        notes: data.notes ?? null,
        status: data.status as ClientStatus,
      },
    });
  }

  static async update(id: string, data: UpdateClientInput) {
    return prisma.client.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.companyName !== undefined && { companyName: data.companyName }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.status !== undefined && { status: data.status as ClientStatus }),
      },
    });
  }

  static async delete(id: string) {
    return prisma.client.delete({
      where: { id },
    });
  }

  static async countProjects(id: string) {
    return prisma.project.count({
      where: { clientId: id },
    });
  }
}

