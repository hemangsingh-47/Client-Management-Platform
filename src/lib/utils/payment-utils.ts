/**
 * FreelanceHub — Financial & Payment Business Logic Utilities
 * Single source of truth for all monetary calculations.
 */

import { Payment } from '@/types/payment';
import { Project } from '@/types/project';

export function isPaymentCompleted(status?: string | null): boolean {
  if (!status) return false;
  const s = status.toUpperCase();
  return s === 'COMPLETED';
}

export function isPaymentPending(status?: string | null): boolean {
  if (!status) return false;
  const s = status.toUpperCase();
  return s === 'PENDING';
}

export function isPaymentFailed(status?: string | null): boolean {
  if (!status) return false;
  const s = status.toUpperCase();
  return s === 'FAILED';
}

export interface ProjectFinancialSummary {
  budget: number;
  totalPaid: number;
  outstandingBalance: number;
  pendingAmount: number;
  completedPaymentsCount: number;
  pendingPaymentsCount: number;
  isFullySettled: boolean;
}

/**
 * Calculates a project's financial summary.
 * Strict Rule: Only 'Completed' payments count toward totalPaid.
 * Formula: Outstanding Balance = Project Budget - Total Completed Payments.
 */
export function getProjectFinancialSummary(
  project: Project,
  payments: Payment[] = []
): ProjectFinancialSummary {
  const projectPayments = payments.filter((p) => p.projectId === project.id);

  const totalPaid = projectPayments
    .filter((p) => isPaymentCompleted(p.status))
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = projectPayments
    .filter((p) => isPaymentPending(p.status))
    .reduce((sum, p) => sum + p.amount, 0);

  const completedPaymentsCount = projectPayments.filter(
    (p) => isPaymentCompleted(p.status)
  ).length;

  const pendingPaymentsCount = projectPayments.filter(
    (p) => isPaymentPending(p.status)
  ).length;

  const outstandingBalance = Math.max(0, project.budget - totalPaid);
  const isFullySettled = outstandingBalance === 0;

  return {
    budget: project.budget,
    totalPaid,
    outstandingBalance,
    pendingAmount,
    completedPaymentsCount,
    pendingPaymentsCount,
    isFullySettled,
  };
}

export interface ClientFinancialSummary {
  totalBudget: number;
  totalPaid: number;
  outstandingBalance: number;
  pendingAmount: number;
}

export function getClientFinancialSummary(
  clientId: string,
  projects: Project[] = [],
  payments: Payment[] = []
): ClientFinancialSummary {
  const clientProjects = projects.filter((p) => p.clientId === clientId);
  const clientPayments = payments.filter((p) => p.clientId === clientId);

  const totalBudget = clientProjects.reduce((sum, p) => sum + p.budget, 0);

  const totalPaid = clientPayments
    .filter((p) => isPaymentCompleted(p.status))
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = clientPayments
    .filter((p) => isPaymentPending(p.status))
    .reduce((sum, p) => sum + p.amount, 0);

  const outstandingBalance = Math.max(0, totalBudget - totalPaid);

  return {
    totalBudget,
    totalPaid,
    outstandingBalance,
    pendingAmount,
  };
}

export interface OverallPaymentStats {
  totalEarnings: number;
  receivedThisMonth: number;
  outstandingAmount: number;
  pendingPaymentsCount: number;
  pendingAmount: number;
}

/**
 * Calculates dashboard and payments overview KPIs.
 * Month reference defaults to Nov 2026 ('2026-11').
 */
export function getOverallPaymentStats(
  payments: Payment[] = [],
  projects: Project[] = [],
  currentMonthPrefix = '2026-11'
): OverallPaymentStats {
  const completedPayments = payments.filter((p) => isPaymentCompleted(p.status));

  const totalEarnings = completedPayments.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  const receivedThisMonth = completedPayments
    .filter((p) => p.paymentDate.startsWith(currentMonthPrefix))
    .reduce((sum, p) => sum + p.amount, 0);

  // Sum of outstanding balances across all projects
  const outstandingAmount = projects.reduce((sum, proj) => {
    const summary = getProjectFinancialSummary(proj, payments);
    return sum + summary.outstandingBalance;
  }, 0);

  const pendingPayments = payments.filter((p) => isPaymentPending(p.status));
  const pendingPaymentsCount = pendingPayments.length;
  const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

  return {
    totalEarnings,
    receivedThisMonth,
    outstandingAmount,
    pendingPaymentsCount,
    pendingAmount,
  };
}

