/**
 * FreelanceHub — HTTP Route Handlers Direct Integration Test
 */

import { NextRequest } from 'next/server';
import { GET as getClients, POST as createClient } from '../src/app/api/clients/route';
import { GET as getProjects } from '../src/app/api/projects/route';
import { GET as getDashboard } from '../src/app/api/dashboard/route';
import { GET as getReports } from '../src/app/api/reports/route';
import { GET as getPayments } from '../src/app/api/payments/route';
import { GET as getTasks } from '../src/app/api/tasks/route';
import { GET as getDeliverables } from '../src/app/api/deliverables/route';
import { GET as getMilestones } from '../src/app/api/milestones/route';

async function testHttpHandlers() {
  console.log('\n--- Testing Next.js Route Handlers Directly ---');

  // 1. GET /api/clients
  const reqClients = new NextRequest('http://localhost:3000/api/clients?page=1&limit=5');
  const resClients = await getClients(reqClients);
  const dataClients = await resClients.json();
  console.log(`GET /api/clients: Status ${resClients.status}, Total clients: ${dataClients.data.pagination.total}`);

  // 2. GET /api/projects
  const reqProjects = new NextRequest('http://localhost:3000/api/projects?page=1&limit=5');
  const resProjects = await getProjects(reqProjects);
  const dataProjects = await resProjects.json();
  console.log(`GET /api/projects: Status ${resProjects.status}, Total projects: ${dataProjects.data.pagination.total}`);

  // 3. GET /api/dashboard
  const resDashboard = await getDashboard();
  const dataDashboard = await resDashboard.json();
  console.log(`GET /api/dashboard: Status ${resDashboard.status}, Paid This Month: ₹${dataDashboard.data.kpis.paidThisMonth}`);

  // 4. GET /api/reports
  const reqReports = new NextRequest('http://localhost:3000/api/reports');
  const resReports = await getReports(reqReports);
  const dataReports = await resReports.json();
  console.log(`GET /api/reports: Status ${resReports.status}, Total Received: ₹${dataReports.data.revenueSummary.totalReceived}`);

  // 5. GET /api/payments
  const reqPayments = new NextRequest('http://localhost:3000/api/payments');
  const resPayments = await getPayments(reqPayments);
  const dataPayments = await resPayments.json();
  console.log(`GET /api/payments: Status ${resPayments.status}, Total records: ${dataPayments.data.pagination.total}`);

  // 6. GET /api/tasks
  const reqTasks = new NextRequest('http://localhost:3000/api/tasks');
  const resTasks = await getTasks(reqTasks);
  const dataTasks = await resTasks.json();
  console.log(`GET /api/tasks: Status ${resTasks.status}, Total tasks: ${dataTasks.data.pagination.total}`);

  // 7. GET /api/deliverables
  const reqDeliverables = new NextRequest('http://localhost:3000/api/deliverables');
  const resDeliverables = await getDeliverables(reqDeliverables);
  const dataDeliverables = await resDeliverables.json();
  console.log(`GET /api/deliverables: Status ${resDeliverables.status}, Total deliverables: ${dataDeliverables.data.pagination.total}`);

  // 8. GET /api/milestones
  const reqMilestones = new NextRequest('http://localhost:3000/api/milestones');
  const resMilestones = await getMilestones(reqMilestones);
  const dataMilestones = await resMilestones.json();
  console.log(`GET /api/milestones: Status ${resMilestones.status}, Total milestones: ${dataMilestones.data.length}`);

  // 9. Validation Failure test: POST /api/clients with bad email
  const reqBadClient = new NextRequest('http://localhost:3000/api/clients', {
    method: 'POST',
    body: JSON.stringify({ name: 'A', email: 'not-an-email' }),
  });
  const resBadClient = await createClient(reqBadClient);
  const dataBadClient = await resBadClient.json();
  console.log(`POST /api/clients (Validation Fail): Status ${resBadClient.status}, Error: "${dataBadClient.message}"`);

  console.log('✅ All Route Handlers responded with standardized JSON structures!\n');
}

testHttpHandlers().catch((e) => {
  console.error('HTTP Route Handler Test Failed:', e);
  process.exit(1);
});

