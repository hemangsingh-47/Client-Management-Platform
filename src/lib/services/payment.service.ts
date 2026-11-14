import { PaymentRepository } from '../repositories/payment.repository';
import { ProjectRepository } from '../repositories/project.repository';
import { ActivityRepository } from '../repositories/activity.repository';
import { PaymentQueryParams, CreatePaymentInput, UpdatePaymentInput } from '../validations/payment.schema';
import { ApiError } from '../utils/api-error';
import {
  calculateCompletedTotal,
  calculateOutstanding,
  willExceedBudget,
  toNumber,
  toDecimal,
} from '../utils/financial-calculator';

export class PaymentService {
  static async listPayments(params: PaymentQueryParams) {
    const { total, payments } = await PaymentRepository.findMany(params);

    const items = payments.map((p) => ({
      id: p.id,
      projectId: p.projectId,
      projectName: p.project.title,
      projectBudget: toNumber(p.project.budget),
      clientId: p.project.client.id,
      clientName: p.project.client.name,
      companyName: p.project.client.companyName,
      amount: toNumber(p.amount),
      paymentDate: p.paymentDate.toISOString(),
      paymentMethod: p.paymentMethod,
      referenceNumber: p.referenceNumber,
      status: p.status,
      notes: p.notes,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    return {
      items,
      pagination: {
        total,
        page: params.page,
        limit: params.limit,
        totalPages: Math.ceil(total / params.limit) || 1,
      },
    };
  }

  static async getPaymentById(id: string) {
    const payment = await PaymentRepository.findById(id);
    if (!payment) {
      throw ApiError.notFound(`Payment with ID '${id}' not found`);
    }

    return {
      id: payment.id,
      projectId: payment.projectId,
      project: {
        id: payment.project.id,
        title: payment.project.title,
        budget: toNumber(payment.project.budget),
        client: payment.project.client,
      },
      amount: toNumber(payment.amount),
      paymentDate: payment.paymentDate.toISOString(),
      paymentMethod: payment.paymentMethod,
      referenceNumber: payment.referenceNumber,
      status: payment.status,
      notes: payment.notes,
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
    };
  }

  static async recordPayment(data: CreatePaymentInput) {
    const project = await ProjectRepository.findById(data.projectId);
    if (!project) {
      throw ApiError.badRequest(`Project with ID '${data.projectId}' does not exist`);
    }

    // Overpayment check for completed payments
    if (data.status === 'COMPLETED') {
      const existingPayments = await PaymentRepository.findCompletedByProjectId(data.projectId);
      const currentCompleted = calculateCompletedTotal(existingPayments);

      if (willExceedBudget(currentCompleted, data.amount, project.budget)) {
        const remaining = calculateOutstanding(project.budget, currentCompleted);
        throw ApiError.badRequest(
          `Payment amount (₹${data.amount}) exceeds remaining project balance of ₹${toNumber(remaining)}.`
        );
      }
    }

    const payment = await PaymentRepository.create(data);

    // Record activity
    if (payment.status === 'COMPLETED') {
      await ActivityRepository.create({
        projectId: project.id,
        clientId: project.clientId,
        type: 'PAYMENT_RECORDED',
        description: `Payment of ₹${toNumber(payment.amount)} recorded via ${payment.paymentMethod} for "${project.title}".`,
      });
    }

    return {
      id: payment.id,
      projectId: payment.projectId,
      amount: toNumber(payment.amount),
      paymentDate: payment.paymentDate.toISOString(),
      paymentMethod: payment.paymentMethod,
      referenceNumber: payment.referenceNumber,
      status: payment.status,
      notes: payment.notes,
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
    };
  }

  static async updatePayment(id: string, data: UpdatePaymentInput) {
    const existing = await PaymentRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Payment with ID '${id}' not found`);
    }

    // Overpayment check if amount or status changes to COMPLETED
    const newStatus = data.status ?? existing.status;
    const newAmount = data.amount ?? toNumber(existing.amount);

    if (newStatus === 'COMPLETED') {
      const otherPayments = await PaymentRepository.findCompletedByProjectId(existing.projectId);
      // Exclude current payment from baseline if it was completed
      const filteredPayments = existing.status === 'COMPLETED'
        ? otherPayments.filter((p) => !toDecimal(p.amount).equals(existing.amount))
        : otherPayments;

      const currentCompleted = calculateCompletedTotal(filteredPayments);

      if (willExceedBudget(currentCompleted, newAmount, existing.project.budget)) {
        const remaining = calculateOutstanding(existing.project.budget, currentCompleted);
        throw ApiError.badRequest(
          `Updated payment amount (₹${newAmount}) exceeds remaining project balance of ₹${toNumber(remaining)}.`
        );
      }
    }

    const updated = await PaymentRepository.update(id, data);

    if (data.status && data.status !== existing.status) {
      await ActivityRepository.create({
        projectId: existing.projectId,
        clientId: existing.project.clientId,
        type: 'PAYMENT_STATUS_CHANGED',
        description: `Payment ${id} status updated to ${data.status}.`,
      });
    }

    return {
      id: updated.id,
      projectId: updated.projectId,
      amount: toNumber(updated.amount),
      paymentDate: updated.paymentDate.toISOString(),
      paymentMethod: updated.paymentMethod,
      referenceNumber: updated.referenceNumber,
      status: updated.status,
      notes: updated.notes,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  static async deletePayment(id: string) {
    const existing = await PaymentRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Payment with ID '${id}' not found`);
    }

    return PaymentRepository.delete(id);
  }
}

