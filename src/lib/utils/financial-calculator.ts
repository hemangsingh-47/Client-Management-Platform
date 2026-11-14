import { Prisma } from '@prisma/client';

/**
 * Decimal-safe financial utility functions for FreelanceHub.
 * Avoids JavaScript IEEE-754 floating point precision issues by using Prisma.Decimal.
 */

export function toDecimal(val: number | string | Prisma.Decimal): Prisma.Decimal {
  if (val instanceof Prisma.Decimal) return val;
  return new Prisma.Decimal(val);
}

export function toNumber(val: number | string | Prisma.Decimal | null | undefined): number {
  if (val === null || val === undefined) return 0;
  if (val instanceof Prisma.Decimal) return val.toNumber();
  return Number(val);
}

/**
 * Calculates total paid from a list of payment records.
 * Only COMPLETED payments contribute to total revenue.
 */
export function calculateCompletedTotal(
  payments: Array<{ amount: Prisma.Decimal | number | string; status: string }>
): Prisma.Decimal {
  return payments
    .filter((p) => p.status === 'COMPLETED')
    .reduce((sum, p) => sum.add(toDecimal(p.amount)), new Prisma.Decimal(0));
}

/**
 * Calculates outstanding project balance:
 * Outstanding = max(0, Budget - Total Completed Payments)
 */
export function calculateOutstanding(
  budget: Prisma.Decimal | number | string,
  completedTotal: Prisma.Decimal | number | string
): Prisma.Decimal {
  const b = toDecimal(budget);
  const paid = toDecimal(completedTotal);
  const diff = b.sub(paid);
  return diff.greaterThan(0) ? diff : new Prisma.Decimal(0);
}

/**
 * Validates whether a new payment would cause an accidental overpayment.
 */
export function willExceedBudget(
  currentCompletedTotal: Prisma.Decimal | number | string,
  newAmount: Prisma.Decimal | number | string,
  budget: Prisma.Decimal | number | string
): boolean {
  const total = toDecimal(currentCompletedTotal).add(toDecimal(newAmount));
  return total.greaterThan(toDecimal(budget));
}

