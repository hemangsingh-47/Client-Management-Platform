/**
 * FreelanceHub — Phase 14 Business Logic & Financial Unit Test Suite
 * Tests financial precision, overdue detection, status transitions, and budget constraints.
 */

import {
  toDecimal,
  toNumber,
  calculateCompletedTotal,
  calculateOutstanding,
  willExceedBudget,
} from '../src/lib/utils/financial-calculator';
import {
  isPaymentCompleted,
  isPaymentPending,
  isPaymentFailed,
  getProjectFinancialSummary,
} from '../src/lib/utils/payment-utils';
import { isTaskOverdue } from '../src/lib/utils/task-utils';
import { Prisma } from '@prisma/client';
import { Task } from '../src/types/task';
import { Project } from '../src/types/project';
import { Payment } from '../src/types/payment';

let passed = 0;
let total = 0;

function assert(condition: boolean, testName: string, details?: string) {
  total++;
  if (condition) {
    passed++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    console.error(`  ❌ [FAIL] ${testName} ${details ? `(${details})` : ''}`);
    process.exitCode = 1;
  }
}

export function runBusinessLogicTests() {
  console.log('\n======================================================');
  console.log('🧪 FREELANCEHUB — BUSINESS LOGIC & FINANCIAL UNIT TESTS');
  console.log('======================================================\n');

  // --- Group 1: Decimal Financial Precision ---
  console.log('--- Group 1: Decimal Precision & Conversions ---');
  const d1 = toDecimal(100.5);
  const d2 = toDecimal('200.75');
  assert(d1.plus(d2).equals(new Prisma.Decimal(301.25)), '1.1 Decimal addition avoids floating-point error');

  const floatPrecisionTest = toDecimal(0.1).plus(toDecimal(0.2));
  assert(floatPrecisionTest.equals(new Prisma.Decimal('0.3')), '1.2 0.1 + 0.2 strictly equals 0.3 with Prisma.Decimal');

  assert(toNumber(new Prisma.Decimal(50000)) === 50000, '1.3 toNumber converts Prisma.Decimal correctly');
  assert(toNumber(null) === 0 && toNumber(undefined) === 0, '1.4 toNumber handles null/undefined safely returning 0');

  // --- Group 2: Payment Status Normalization ---
  console.log('\n--- Group 2: Payment Status Case Normalization ---');
  assert(isPaymentCompleted('COMPLETED') && isPaymentCompleted('Completed') && isPaymentCompleted('completed'), '2.1 isPaymentCompleted matches case-insensitively');
  assert(isPaymentPending('PENDING') && isPaymentPending('Pending'), '2.2 isPaymentPending matches case-insensitively');
  assert(isPaymentFailed('FAILED') && isPaymentFailed('Failed'), '2.3 isPaymentFailed matches case-insensitively');
  assert(!isPaymentCompleted('PENDING') && !isPaymentCompleted('FAILED'), '2.4 Non-completed payments return false for isPaymentCompleted');

  // --- Group 3: Nine Core Financial Scenarios (Part 2.E) ---
  console.log('\n--- Group 3: Core Financial Scenarios (Part 2.E) ---');

  // Scenario 1: Project with no payments
  const budget1 = new Prisma.Decimal(100000);
  const s1Total = calculateCompletedTotal([]);
  const s1Outstanding = calculateOutstanding(budget1, s1Total);
  assert(s1Total.equals(new Prisma.Decimal(0)) && s1Outstanding.equals(budget1), 'Scenario 1: Project with NO payments has 0 paid and full budget outstanding');

  // Scenario 2: Project with one completed payment
  const s2Payments = [{ amount: new Prisma.Decimal(40000), status: 'COMPLETED' }];
  const s2Total = calculateCompletedTotal(s2Payments);
  const s2Outstanding = calculateOutstanding(budget1, s2Total);
  assert(s2Total.equals(new Prisma.Decimal(40000)) && s2Outstanding.equals(new Prisma.Decimal(60000)), 'Scenario 2: Project with one completed payment correctly sets outstanding');

  // Scenario 3: Project with multiple completed payments
  const s3Payments = [
    { amount: new Prisma.Decimal(25000), status: 'COMPLETED' },
    { amount: new Prisma.Decimal(35000), status: 'COMPLETED' },
  ];
  const s3Total = calculateCompletedTotal(s3Payments);
  const s3Outstanding = calculateOutstanding(budget1, s3Total);
  assert(s3Total.equals(new Prisma.Decimal(60000)) && s3Outstanding.equals(new Prisma.Decimal(40000)), 'Scenario 3: Project with multiple completed payments sums properly');

  // Scenario 4: Project with pending payment only
  const s4Payments = [{ amount: new Prisma.Decimal(30000), status: 'PENDING' }];
  const s4Total = calculateCompletedTotal(s4Payments);
  const s4Outstanding = calculateOutstanding(budget1, s4Total);
  assert(s4Total.equals(new Prisma.Decimal(0)) && s4Outstanding.equals(budget1), 'Scenario 4: Pending payments do NOT increase totalPaid or reduce outstanding');

  // Scenario 5: Project with failed payment only
  const s5Payments = [{ amount: new Prisma.Decimal(50000), status: 'FAILED' }];
  const s5Total = calculateCompletedTotal(s5Payments);
  const s5Outstanding = calculateOutstanding(budget1, s5Total);
  assert(s5Total.equals(new Prisma.Decimal(0)) && s5Outstanding.equals(budget1), 'Scenario 5: Failed payments do NOT increase totalPaid or reduce outstanding');

  // Scenario 6: Project with completed and pending payments
  const s6Payments = [
    { amount: new Prisma.Decimal(50000), status: 'COMPLETED' },
    { amount: new Prisma.Decimal(30000), status: 'PENDING' },
    { amount: new Prisma.Decimal(20000), status: 'FAILED' },
  ];
  const s6Total = calculateCompletedTotal(s6Payments);
  const s6Outstanding = calculateOutstanding(budget1, s6Total);
  assert(s6Total.equals(new Prisma.Decimal(50000)) && s6Outstanding.equals(new Prisma.Decimal(50000)), 'Scenario 6: Mixed payments strictly count ONLY COMPLETED payments');

  // Scenario 7: Attempted payment exceeding outstanding balance
  const exceeds = willExceedBudget(s6Total, 60000, budget1); // current paid: 50k, new: 60k, budget: 100k -> 110k > 100k
  const within = willExceedBudget(s6Total, 40000, budget1); // 50k + 40k = 90k <= 100k
  assert(exceeds === true, 'Scenario 7.1: willExceedBudget returns true when payment exceeds remaining balance');
  assert(within === false, 'Scenario 7.2: willExceedBudget returns false when payment is within remaining balance');

  // Scenario 8: Payment status changed from pending to completed
  const s8PaymentRecord = { amount: new Prisma.Decimal(30000), status: 'PENDING' };
  const s8Before = calculateCompletedTotal([s8PaymentRecord]);
  s8PaymentRecord.status = 'COMPLETED';
  const s8After = calculateCompletedTotal([s8PaymentRecord]);
  const s8Remaining = calculateOutstanding(budget1, s8After);
  assert(s8Before.equals(new Prisma.Decimal(0)) && s8After.equals(new Prisma.Decimal(30000)) && s8Remaining.equals(new Prisma.Decimal(70000)), 'Scenario 8: Changing status from PENDING to COMPLETED reduces outstanding balance');

  // Scenario 9: Payment status changed from completed to failed
  const s9PaymentRecord = { amount: new Prisma.Decimal(40000), status: 'COMPLETED' };
  const s9Before = calculateCompletedTotal([s9PaymentRecord]);
  s9PaymentRecord.status = 'FAILED';
  const s9After = calculateCompletedTotal([s9PaymentRecord]);
  const s9Remaining = calculateOutstanding(budget1, s9After);
  assert(s9Before.equals(new Prisma.Decimal(40000)) && s9After.equals(new Prisma.Decimal(0)) && s9Remaining.equals(budget1), 'Scenario 9: Changing status from COMPLETED to FAILED restores outstanding balance');

  // --- Group 4: Task Overdue Calculation ---
  console.log('\n--- Group 4: Task Overdue Detection ---');
  const pastDate = new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0]; // 2 days ago
  const futureDate = new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0]; // 5 days from now

  const overdueTask = {
    id: 't-1',
    projectId: 'p-1',
    title: 'Design Review',
    description: '',
    status: 'TODO' as const,
    priority: 'HIGH' as const,
    dueDate: pastDate,
    createdAt: new Date().toISOString(),
  } satisfies Task;

  const onTimeTask = {
    id: 't-2',
    projectId: 'p-1',
    title: 'Testing',
    description: '',
    status: 'IN_PROGRESS' as const,
    priority: 'MEDIUM' as const,
    dueDate: futureDate,
    createdAt: new Date().toISOString(),
  } satisfies Task;

  const completedPastTask = {
    id: 't-3',
    projectId: 'p-1',
    title: 'Wireframes',
    description: '',
    status: 'COMPLETED' as const,
    priority: 'LOW' as const,
    dueDate: pastDate,
    createdAt: new Date().toISOString(),
  } satisfies Task;

  assert(isTaskOverdue(overdueTask) === true, '4.1 Incomplete task past due date is marked overdue');
  assert(isTaskOverdue(onTimeTask) === false, '4.2 Incomplete task with future due date is NOT overdue');
  assert(isTaskOverdue(completedPastTask) === false, '4.3 COMPLETED task past due date is NOT overdue');

  // --- Group 5: Frontend Financial Summary Adapters ---
  console.log('\n--- Group 5: Frontend Financial Summary Adapters ---');
  const mockProject = {
    id: 'p-100',
    clientId: 'cli-1',
    title: 'Client Web Portal',
    description: '',
    budget: 80000,
    startDate: '2026-11-01',
    deadline: '2026-12-01',
    status: 'IN_PROGRESS' as const,
    priority: 'HIGH' as const,
    progress: 50,
    createdAt: new Date().toISOString(),
  } satisfies Project;

  const mockPayments: Payment[] = [
    {
      id: 'pay-1',
      projectId: 'p-100',
      amount: 30000,
      paymentDate: '2026-11-10',
      paymentMethod: 'Bank Transfer',
      status: 'Completed',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'pay-2',
      projectId: 'p-100',
      amount: 15000,
      paymentDate: '2026-11-15',
      paymentMethod: 'UPI',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    },
  ];
  const summary = getProjectFinancialSummary(mockProject, mockPayments);
  assert(summary.totalPaid === 30000, '5.1 getProjectFinancialSummary correctly computes totalPaid');
  assert(summary.outstandingBalance === 50000, '5.2 getProjectFinancialSummary correctly computes outstandingBalance (80k - 30k = 50k)');
  assert(summary.pendingAmount === 15000, '5.3 getProjectFinancialSummary correctly identifies pendingAmount');
  assert(summary.isFullySettled === false, '5.4 isFullySettled is false when balance remains');

  console.log(`\n======================================================`);
  console.log(`🎉 BUSINESS LOGIC TESTS PASSED: ${passed} / ${total}`);
  console.log(`======================================================\n`);
}

runBusinessLogicTests();
