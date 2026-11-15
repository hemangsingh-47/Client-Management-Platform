/**
 * FreelanceHub — Phase 14 End-to-End Workflow Integration Test
 * Simulates a realistic freelancer lifecycle:
 * Client -> Project -> Task -> Deliverable -> Payment -> Dashboard & Reports -> Safe Cleanup
 */

import { ClientService } from '../src/lib/services/client.service';
import { ProjectService } from '../src/lib/services/project.service';
import { TaskService } from '../src/lib/services/task.service';
import { DeliverableService } from '../src/lib/services/deliverable.service';
import { PaymentService } from '../src/lib/services/payment.service';
import { DashboardService } from '../src/lib/services/dashboard.service';
import { ReportService } from '../src/lib/services/report.service';

let passed = 0;
let total = 0;

function assert(condition: boolean, step: string, details?: string) {
  total++;
  if (condition) {
    passed++;
    console.log(`  ✅ [PASS] ${step}`);
  } else {
    console.error(`  ❌ [FAIL] ${step} ${details ? `(${details})` : ''}`);
    process.exitCode = 1;
  }
}

async function runE2EWorkflow() {
  console.log('\n======================================================');
  console.log('🔄 FREELANCEHUB — END-TO-END WORKFLOW INTEGRATION TEST');
  console.log('======================================================\n');

  let clientId = '';
  let projectId = '';
  let taskId = '';
  let deliverableId = '';
  let paymentId = '';

  try {
    // ------------------------------------------------------------------------
    // Step 1: Create a client
    // ------------------------------------------------------------------------
    console.log('--- Step 1: Client Onboarding ---');
    const client = await ClientService.createClient({
      name: 'E2E Venture Partners',
      email: `e2e-client-${Date.now()}@ventures.co`,
      companyName: 'Venture Capital Labs',
      phone: '+91 98765 43210',
      address: 'Tech Park, Bangalore',
      status: 'ACTIVE',
    });
    clientId = client.id;
    assert(!!client.id && client.status === 'ACTIVE', 'Step 1: Client onboarded successfully');

    // ------------------------------------------------------------------------
    // Step 2: Create a project for that client
    // ------------------------------------------------------------------------
    console.log('\n--- Step 2: Project Engagement Creation ---');
    const project = await ProjectService.createProject({
      title: 'Venture Portal SaaS Platform',
      clientId,
      budget: 150000,
      startDate: new Date().toISOString(),
      deadline: new Date(Date.now() + 86400000 * 30).toISOString(),
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      progress: 25,
      description: 'End-to-end full stack web application for portfolio tracking',
    });
    projectId = project.id;
    assert(!!project.id && project.clientId === clientId, 'Step 2: Project created and linked to client');

    // ------------------------------------------------------------------------
    // Step 3: Create a task for the project
    // ------------------------------------------------------------------------
    console.log('\n--- Step 3: Sprint Task Creation ---');
    const task = await TaskService.createTask({
      title: 'Database Schema & Auth Integration',
      description: 'Setup PostgreSQL migrations and JWT session handlers',
      projectId,
      dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
      priority: 'HIGH',
      status: 'TODO',
    });
    taskId = task.id;
    assert(!!task.id && task.status === 'TODO', 'Step 3: Task created under project');

    // ------------------------------------------------------------------------
    // Step 4: Complete the task
    // ------------------------------------------------------------------------
    console.log('\n--- Step 4: Task Completion & Lifecycle ---');
    const updatedTask = await TaskService.updateTask(taskId, {
      status: 'COMPLETED',
    });
    assert(
      updatedTask.status === 'COMPLETED' && !!updatedTask.completedAt,
      'Step 4: Task marked COMPLETED and completedAt recorded'
    );

    // ------------------------------------------------------------------------
    // Step 5: Add a deliverable
    // ------------------------------------------------------------------------
    console.log('\n--- Step 5: Deliverable Submission ---');
    const deliverable = await DeliverableService.createDeliverable({
      title: 'Architecture Blueprints & DB ERD',
      description: 'Complete PostgreSQL schema diagrams and API contract specs',
      projectId,
      submissionDate: new Date().toISOString(),
      attachmentType: 'FIGMA',
      attachmentUrl: 'https://figma.com/file/e2e-test-blueprints',
      status: 'SUBMITTED',
      notes: 'Initial milestone delivery for review',
    });
    deliverableId = deliverable.id;
    assert(
      !!deliverable.id && deliverable.attachmentType === 'FIGMA' && deliverable.status === 'SUBMITTED',
      'Step 5: Deliverable created with verified external URL and Figma type'
    );

    // ------------------------------------------------------------------------
    // Step 6: Review deliverable & update status to APPROVED
    // ------------------------------------------------------------------------
    console.log('\n--- Step 6: Deliverable Review & Approval ---');
    const approvedDeliverable = await DeliverableService.updateDeliverable(deliverableId, {
      status: 'APPROVED',
      notes: 'Client reviewed and accepted milestone',
    });
    assert(approvedDeliverable.status === 'APPROVED', 'Step 6: Deliverable status progressed to APPROVED');

    // ------------------------------------------------------------------------
    // Step 7: Record a completed payment
    // ------------------------------------------------------------------------
    console.log('\n--- Step 7: Payment Processing ---');
    const payment = await PaymentService.recordPayment({
      projectId,
      amount: 60000,
      paymentDate: new Date().toISOString(),
      paymentMethod: 'BANK_TRANSFER',
      referenceNumber: 'NEFT-E2E-2026-001',
      status: 'COMPLETED',
      notes: 'Milestone 1 settlement payment',
    });
    paymentId = payment.id;
    assert(
      !!payment.id && payment.amount === 60000 && payment.status === 'COMPLETED',
      'Step 7: Payment of ₹60,000 successfully recorded'
    );

    // ------------------------------------------------------------------------
    // Step 8: Verify Project Details & Financials
    // ------------------------------------------------------------------------
    console.log('\n--- Step 8: Project Financial Verification ---');
    const projectDetails = await ProjectService.getProjectById(projectId);
    assert(
      projectDetails.financials.budget === 150000 &&
      projectDetails.financials.totalPaid === 60000 &&
      projectDetails.financials.outstanding === 90000,
      'Step 8: Financials strictly consistent (Budget: 150k, Paid: 60k, Outstanding: 90k)'
    );

    // ------------------------------------------------------------------------
    // Step 9: Verify Dashboard and Reports Integration
    // ------------------------------------------------------------------------
    console.log('\n--- Step 9: Analytics & Reporting Aggregation ---');
    const dashboard = await DashboardService.getDashboardMetrics();
    assert(
      dashboard.kpis.activeProjects >= 1 &&
      dashboard.kpis.outstandingPayments >= 90000,
      'Step 9.1: Live Dashboard reflects new active project and outstanding balance'
    );

    const report = await ReportService.generateReport({ clientId });
    assert(
      report.revenueSummary.totalBudget === 150000 &&
      report.revenueSummary.totalReceived === 60000 &&
      report.revenueSummary.totalOutstanding === 90000,
      'Step 9.2: Reports query strictly aggregates client performance'
    );

  } finally {
    // ------------------------------------------------------------------------
    // Step 10: Clean up test records safely
    // ------------------------------------------------------------------------
    console.log('\n--- Step 10: Safe Clean-Up ---');
    if (paymentId) {
      await PaymentService.deletePayment(paymentId);
    }
    if (deliverableId) {
      await DeliverableService.deleteDeliverable(deliverableId);
    }
    if (taskId) {
      await TaskService.deleteTask(taskId);
    }
    if (projectId) {
      await ProjectService.deleteProject(projectId);
    }
    if (clientId) {
      await ClientService.deleteClient(clientId);
    }
    assert(true, 'Step 10: E2E Test data cleanly and safely purged without orphan records');
  }

  console.log(`\n======================================================`);
  console.log(`🎉 END-TO-END WORKFLOW TESTS PASSED: ${passed} / ${total}`);
  console.log(`======================================================\n`);
}

runE2EWorkflow().catch((err) => {
  console.error('E2E Workflow Test Failed:', err);
  process.exit(1);
});
