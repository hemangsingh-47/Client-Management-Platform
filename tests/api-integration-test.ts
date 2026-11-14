/**
 * FreelanceHub — Phase 11 & 12 Automated API Integration Test Suite
 * Executes live tests against local PostgreSQL database.
 */

import { ClientService } from '../src/lib/services/client.service';
import { ProjectService } from '../src/lib/services/project.service';
import { TaskService } from '../src/lib/services/task.service';
import { MilestoneService } from '../src/lib/services/milestone.service';
import { DeliverableService } from '../src/lib/services/deliverable.service';
import { PaymentService } from '../src/lib/services/payment.service';
import { DashboardService } from '../src/lib/services/dashboard.service';
import { ReportService } from '../src/lib/services/report.service';
import { createProjectSchema } from '../src/lib/validations/project.schema';
import { createPaymentSchema } from '../src/lib/validations/payment.schema';
import { createClientSchema } from '../src/lib/validations/client.schema';
import { ApiError } from '../src/lib/utils/api-error';
import { prisma } from '../src/lib/prisma';

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    console.error(`  ❌ [FAIL] ${testName} ${detail ? `- ${detail}` : ''}`);
    process.exitCode = 1;
  }
}

async function runTestSuite() {
  console.log('\n======================================================');
  console.log('🚀 FREELANCEHUB — LIVE API & DATABASE INTEGRATION TEST');
  console.log('======================================================\n');

  let testClientId = '';
  let testProjectId = '';
  let testTaskId = '';
  let testMilestoneId = '';
  let testDeliverableId = '';

  // ----------------------------------------------------
  // TEST 1: Successful creation
  // ----------------------------------------------------
  console.log('--- Test 1: Successful Entity Creation ---');
  const client = await ClientService.createClient({
    name: 'Integration Test Client',
    email: 'test-client@integration.dev',
    companyName: 'Test Corp Ltd',
    phone: '+91 99999 88888',
    status: 'ACTIVE',
  });
  testClientId = client.id;
  assert(!!client.id && client.name === 'Integration Test Client', '1.1 Client created successfully');

  const project = await ProjectService.createProject({
    title: 'Test Web App',
    description: 'Automated test project',
    clientId: testClientId,
    budget: 100000,
    startDate: new Date('2026-11-01').toISOString(),
    deadline: new Date('2026-12-01').toISOString(),
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    progress: 20,
  });
  testProjectId = project.id;
  assert(!!project.id && project.title === 'Test Web App', '1.2 Project created successfully');

  const task = await TaskService.createTask({
    title: 'Initial Database Setup',
    description: 'Verify schema and indexes',
    projectId: testProjectId,
    dueDate: new Date('2026-11-20').toISOString(),
    priority: 'HIGH',
    status: 'TODO',
  });
  testTaskId = task.id;
  assert(!!task.id && task.status === 'TODO', '1.3 Task created successfully');

  const milestone = await MilestoneService.createMilestone({
    title: 'Milestone 1: Backend Architecture',
    projectId: testProjectId,
    dueDate: new Date('2026-11-25').toISOString(),
    status: 'PENDING',
  });
  testMilestoneId = milestone.id;
  assert(!!milestone.id && milestone.status === 'PENDING', '1.4 Milestone created successfully');

  const deliverable = await DeliverableService.createDeliverable({
    title: 'API OpenAPI Documentation',
    projectId: testProjectId,
    submissionDate: new Date('2026-11-15').toISOString(),
    attachmentUrl: 'https://github.com/freelancehub/api-docs',
    attachmentType: 'GITHUB',
    status: 'SUBMITTED',
  });
  testDeliverableId = deliverable.id;
  assert(!!deliverable.id && deliverable.attachmentType === 'GITHUB', '1.5 Deliverable created successfully');

  const payment = await PaymentService.recordPayment({
    projectId: testProjectId,
    amount: 30000,
    paymentDate: new Date('2026-11-14').toISOString(),
    paymentMethod: 'UPI',
    referenceNumber: 'UPI-TEST-001',
    status: 'COMPLETED',
  });
  assert(!!payment.id && payment.amount === 30000, '1.6 Payment created successfully');

  // ----------------------------------------------------
  // TEST 2: Successful retrieval
  // ----------------------------------------------------
  console.log('\n--- Test 2: Successful Retrieval ---');
  const clientDetails = await ClientService.getClientById(testClientId);
  assert(clientDetails.id === testClientId && clientDetails.projects.length === 1, '2.1 Client details retrieved with project summary');

  const projectDetails = await ProjectService.getProjectById(testProjectId);
  assert(
    projectDetails.id === testProjectId &&
    projectDetails.financials.totalPaid === 30000 &&
    projectDetails.financials.outstanding === 70000,
    '2.2 Project details retrieved with accurate financials (Budget: 100k, Paid: 30k, Outstanding: 70k)'
  );

  // ----------------------------------------------------
  // TEST 3: Successful updates
  // ----------------------------------------------------
  console.log('\n--- Test 3: Successful Updates ---');
  const updatedClient = await ClientService.updateClient(testClientId, {
    companyName: 'Updated Test Corp Pvt Ltd',
  });
  assert(updatedClient.companyName === 'Updated Test Corp Pvt Ltd', '3.1 Client companyName updated');

  const updatedProject = await ProjectService.updateProject(testProjectId, {
    progress: 50,
  });
  assert(updatedProject.progress === 50, '3.2 Project progress updated');

  // ----------------------------------------------------
  // TEST 4: Safe Deletion & Conflict Protection
  // ----------------------------------------------------
  console.log('\n--- Test 4: Safe Deletion & Conflict Prevention ---');
  let clientDeleteBlocked = false;
  try {
    await ClientService.deleteClient(testClientId);
  } catch (err: unknown) {
    if (err instanceof ApiError && err.statusCode === 409) clientDeleteBlocked = true;
  }
  assert(clientDeleteBlocked, '4.1 Client deletion safely blocked (409 Conflict) when active projects exist');

  let projectDeleteBlocked = false;
  try {
    await ProjectService.deleteProject(testProjectId);
  } catch (err: unknown) {
    if (err instanceof ApiError && err.statusCode === 409) projectDeleteBlocked = true;
  }
  assert(projectDeleteBlocked, '4.2 Project deletion safely blocked (409 Conflict) when payment records exist');

  // ----------------------------------------------------
  // TEST 5 & 6: Missing required fields and Invalid bodies
  // ----------------------------------------------------
  console.log('\n--- Test 5 & 6: Validation Error Handling ---');
  let validationCaught = false;
  try {
    createClientSchema.parse({});
  } catch {
    validationCaught = true;
  }
  assert(validationCaught, '5.1 Empty client input correctly rejected by Zod validation');

  // ----------------------------------------------------
  // TEST 7: Invalid IDs (404)
  // ----------------------------------------------------
  console.log('\n--- Test 7: Non-existent IDs ---');
  let notFoundCaught = false;
  try {
    await ClientService.getClientById('non-existent-id-999');
  } catch (err: unknown) {
    if (err instanceof ApiError && err.statusCode === 404) notFoundCaught = true;
  }
  assert(notFoundCaught, '7.1 Querying non-existent client ID returns 404 Not Found');

  // ----------------------------------------------------
  // TEST 8: Missing related client / project
  // ----------------------------------------------------
  console.log('\n--- Test 8: Foreign Key Relationship Validation ---');
  let invalidRelationCaught = false;
  try {
    await ProjectService.createProject({
      title: 'Orphan Project',
      clientId: 'non-existent-client-id',
      budget: 50000,
      startDate: new Date('2026-11-01').toISOString(),
      deadline: new Date('2026-12-01').toISOString(),
      status: 'PLANNING',
      priority: 'LOW',
      progress: 0,
    });
  } catch (err: unknown) {
    if (err instanceof ApiError && err.statusCode === 400) invalidRelationCaught = true;
  }
  assert(invalidRelationCaught, '8.1 Creating project with invalid clientId rejected (400 Bad Request)');

  // ----------------------------------------------------
  // TEST 9: Duplicate client email
  // ----------------------------------------------------
  console.log('\n--- Test 9: Unique Constraint Enforcement ---');
  let duplicateEmailCaught = false;
  try {
    await ClientService.createClient({
      name: 'Duplicate Email Tester',
      email: 'test-client@integration.dev', // duplicate
      status: 'ACTIVE',
    });
  } catch (err: unknown) {
    if (err instanceof ApiError && err.statusCode === 409) duplicateEmailCaught = true;
  }
  assert(duplicateEmailCaught, '9.1 Duplicate client email rejected (409 Conflict)');

  // ----------------------------------------------------
  // TEST 10: Invalid project deadline before startDate
  // ----------------------------------------------------
  console.log('\n--- Test 10: Date Consistency Validation ---');
  let invalidDeadlineCaught = false;
  try {
    createProjectSchema.parse({
      title: 'Invalid Date Project',
      clientId: testClientId,
      budget: 50000,
      startDate: '2026-12-01T00:00:00Z',
      deadline: '2026-11-01T00:00:00Z', // BEFORE start date!
    });
  } catch {
    invalidDeadlineCaught = true;
  }
  assert(invalidDeadlineCaught, '10.1 Project deadline earlier than start date rejected');

  // ----------------------------------------------------
  // TEST 11: Negative or zero payment amount
  // ----------------------------------------------------
  console.log('\n--- Test 11: Payment Amount Validation ---');
  let negativePaymentCaught = false;
  try {
    createPaymentSchema.parse({
      projectId: testProjectId,
      amount: -500,
      paymentDate: '2026-11-14T00:00:00Z',
      paymentMethod: 'UPI',
    });
  } catch {
    negativePaymentCaught = true;
  }
  assert(negativePaymentCaught, '11.1 Negative payment amount rejected');

  // ----------------------------------------------------
  // TEST 12: Payment exceeding outstanding balance
  // ----------------------------------------------------
  console.log('\n--- Test 12: Accidental Overpayment Prevention ---');
  let overpaymentCaught = false;
  try {
    // Current budget: 100k, paid: 30k, remaining: 70k. Try paying 85k!
    await PaymentService.recordPayment({
      projectId: testProjectId,
      amount: 85000,
      paymentDate: new Date().toISOString(),
      paymentMethod: 'BANK_TRANSFER',
      status: 'COMPLETED',
    });
  } catch (err: unknown) {
    if (err instanceof ApiError && err.statusCode === 400 && err.message.includes('exceeds remaining project balance')) {
      overpaymentCaught = true;
    }
  }
  assert(overpaymentCaught, '12.1 Payment exceeding outstanding balance safely rejected');

  // ----------------------------------------------------
  // TEST 13: Pending and failed payments do not reduce balance
  // ----------------------------------------------------
  console.log('\n--- Test 13: Financial Calculations with Pending/Failed Payments ---');
  await PaymentService.recordPayment({
    projectId: testProjectId,
    amount: 20000,
    paymentDate: new Date().toISOString(),
    paymentMethod: 'BANK_TRANSFER',
    status: 'PENDING',
  });
  await PaymentService.recordPayment({
    projectId: testProjectId,
    amount: 15000,
    paymentDate: new Date().toISOString(),
    paymentMethod: 'UPI',
    status: 'FAILED',
  });
  const projAfterPending = await ProjectService.getProjectById(testProjectId);
  assert(
    projAfterPending.financials.totalPaid === 30000 &&
    projAfterPending.financials.outstanding === 70000,
    '13.1 Pending and Failed payments do NOT reduce outstanding balance or increase totalPaid'
  );

  // ----------------------------------------------------
  // TEST 14: Task completion and reopening
  // ----------------------------------------------------
  console.log('\n--- Test 14: Task Completion & Reopening Lifecycle ---');
  const completedTask = await TaskService.updateTask(testTaskId, { status: 'COMPLETED' });
  assert(completedTask.status === 'COMPLETED' && !!completedTask.completedAt, '14.1 Task completedAt recorded when COMPLETED');

  const reopenedTask = await TaskService.updateTask(testTaskId, { status: 'IN_PROGRESS' });
  assert(reopenedTask.status === 'IN_PROGRESS' && reopenedTask.completedAt === null, '14.2 Task completedAt cleared when reopened');

  // ----------------------------------------------------
  // TEST 15: Milestone completion and reopening
  // ----------------------------------------------------
  console.log('\n--- Test 15: Milestone Completion & Reopening Lifecycle ---');
  const completedMilestone = await MilestoneService.updateMilestone(testMilestoneId, { status: 'COMPLETED' });
  assert(completedMilestone.status === 'COMPLETED' && !!completedMilestone.completedAt, '15.1 Milestone completedAt recorded');

  const reopenedMilestone = await MilestoneService.updateMilestone(testMilestoneId, { status: 'IN_PROGRESS' });
  assert(reopenedMilestone.status === 'IN_PROGRESS' && reopenedMilestone.completedAt === null, '15.2 Milestone completedAt cleared');

  // ----------------------------------------------------
  // TEST 16: Deliverable status updates
  // ----------------------------------------------------
  console.log('\n--- Test 16: Deliverable Workflow ---');
  const approvedDeliverable = await DeliverableService.updateDeliverable(testDeliverableId, {
    status: 'APPROVED',
  });
  assert(approvedDeliverable.status === 'APPROVED', '16.1 Deliverable status updated to APPROVED');

  // ----------------------------------------------------
  // TEST 17: Dashboard calculations
  // ----------------------------------------------------
  console.log('\n--- Test 17: Dashboard Aggregations ---');
  const dashboard = await DashboardService.getDashboardMetrics();
  assert(
    typeof dashboard.kpis.paidThisMonth === 'number' &&
    dashboard.kpis.paidThisMonth > 0 &&
    dashboard.kpis.activeProjects > 0 &&
    dashboard.monthlyRevenue.length === 6,
    '17.1 Dashboard computed live from PostgreSQL with 6-month revenue chart'
  );

  // ----------------------------------------------------
  // TEST 18: Report filters
  // ----------------------------------------------------
  console.log('\n--- Test 18: Reports Query Filtering ---');
  const report = await ReportService.generateReport({
    clientId: testClientId,
    projectStatus: 'ALL',
  });
  assert(
    report.revenueSummary.totalBudget === 100000 &&
    report.projectPerformance.length === 1 &&
    report.projectPerformance[0].id === testProjectId,
    '18.1 Reports accurately filtered by clientId'
  );

  // ----------------------------------------------------
  // TEST 19: Pagination and sorting
  // ----------------------------------------------------
  console.log('\n--- Test 19: Pagination and Sorting ---');
  const pagedClients = await ClientService.listClients({
    page: 1,
    limit: 2,
    status: 'ALL',
    sortBy: 'name',
    sortOrder: 'asc',
  });
  assert(
    pagedClients.items.length <= 2 &&
    pagedClients.pagination.totalPages >= 1 &&
    pagedClients.pagination.page === 1,
    '19.1 Pagination (page=1, limit=2) returns correct items and totalPages'
  );

  // ----------------------------------------------------
  // CLEANUP TEST DATA
  // ----------------------------------------------------
  console.log('\n--- Cleanup Test Records ---');
  await prisma.activity.deleteMany({ where: { projectId: testProjectId } });
  await prisma.activity.deleteMany({ where: { clientId: testClientId } });
  await prisma.payment.deleteMany({ where: { projectId: testProjectId } });
  await prisma.deliverable.delete({ where: { id: testDeliverableId } });
  await prisma.milestone.delete({ where: { id: testMilestoneId } });
  await prisma.task.delete({ where: { id: testTaskId } });
  await prisma.project.delete({ where: { id: testProjectId } });
  await prisma.client.delete({ where: { id: testClientId } });
  console.log('🧹 Cleaned up integration test data.');

  console.log('\n======================================================');
  console.log(`🎉 TEST SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED`);
  console.log('======================================================\n');
}

runTestSuite()
  .catch((e) => {
    console.error('Test Suite Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

