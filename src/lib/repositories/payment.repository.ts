import { prisma } from '@/lib/prisma';
import { Prisma, PaymentStatus, PaymentMethod } from '@prisma/client';
import { PaymentQueryParams, CreatePaymentInput, UpdatePaymentInput } from '../validations/payment.schema';

export class PaymentRepository {
  static async findMany(params: PaymentQueryParams) {
    const where: Prisma.PaymentWhereInput = {};

    if (params.projectId) {
      where.projectId = params.projectId;
    }

    if (params.status && params.status !== 'ALL') {
      where.status = params.status as PaymentStatus;
    }

    if (params.paymentMethod && params.paymentMethod !== 'ALL') {
      where.paymentMethod = params.paymentMethod as PaymentMethod;
    }

    if (params.startDate || params.endDate) {
      where.paymentDate = {};
      if (params.startDate) {
        where.paymentDate.gte = new Date(params.startDate);
      }
      if (params.endDate) {
        where.paymentDate.lte = new Date(params.endDate);
      }
    }

    const skip = (params.page - 1) * params.limit;
    const take = params.limit;

    const [total, payments] = await Promise.all([
      prisma.payment.count({ where }),
      prisma.payment.findMany({
        where,
        skip,
        take,
        orderBy: { [params.sortBy]: params.sortOrder },
        include: {
          project: {
            select: {
              id: true,
              title: true,
              budget: true,
              client: {
                select: {
                  id: true,
                  name: true,
                  companyName: true,
                },
              },
            },
          },
        },
      }),
    ]);

    return { total, payments };
  }

  static async findById(id: string) {
    return prisma.payment.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            client: true,
          },
        },
      },
    });
  }

  static async findCompletedByProjectId(projectId: string) {
    return prisma.payment.findMany({
      where: {
        projectId,
        status: PaymentStatus.COMPLETED,
      },
      select: {
        id: true,
        amount: true,
        status: true,
      },
    });
  }

  static async create(data: CreatePaymentInput) {
    return prisma.payment.create({
      data: {
        projectId: data.projectId,
        amount: new Prisma.Decimal(Number(data.amount)),
        paymentDate: new Date(data.paymentDate),
        paymentMethod: (typeof data.paymentMethod === 'string'
          ? (data.paymentMethod.toUpperCase().replace(/\s+/g, '_') as PaymentMethod)
          : PaymentMethod.BANK_TRANSFER),
        referenceNumber: data.referenceNumber ?? data.reference ?? null,
        status: (typeof data.status === 'string'
          ? (data.status.toUpperCase() as PaymentStatus)
          : PaymentStatus.COMPLETED),
        notes: data.notes ?? null,
      },
      include: {
        project: {
          include: {
            client: true,
          },
        },
      },
    });
  }

  static async update(id: string, data: UpdatePaymentInput) {
    return prisma.payment.update({
      where: { id },
      data: {
        ...(data.amount !== undefined && { amount: new Prisma.Decimal(Number(data.amount)) }),
        ...(data.paymentDate !== undefined && { paymentDate: new Date(data.paymentDate) }),
        ...(data.paymentMethod !== undefined && { paymentMethod: data.paymentMethod as PaymentMethod }),
        ...(data.referenceNumber !== undefined && { referenceNumber: data.referenceNumber ?? null }),
        ...(data.status !== undefined && { status: data.status as PaymentStatus }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
      include: {
        project: {
          include: {
            client: true,
          },
        },
      },
    });
  }

  static async delete(id: string) {
    return prisma.payment.delete({
      where: { id },
    });
  }
}

