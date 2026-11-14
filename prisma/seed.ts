import {
  PrismaClient,
  ClientStatus,
  ProjectStatus,
  Priority,
  TaskStatus,
  MilestoneStatus,
  DeliverableStatus,
  AttachmentType,
  PaymentMethod,
  PaymentStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for FreelanceHub...');

  // Safe re-runnable strategy: clear existing records in reverse dependency order
  await prisma.activity.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.deliverable.deleteMany({});
  await prisma.milestone.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.client.deleteMany({});

  console.log('🧹 Cleaned existing tables.');

  // 1. Create 6 Realistic Clients
  const clientAcme = await prisma.client.create({
    data: {
      name: 'Acme Corporation',
      email: 'vikram@acmecorp.in',
      companyName: 'Acme Global Ventures Pvt Ltd',
      phone: '+91 98201 12345',
      address: 'Tower 4, Bandra Kurla Complex, Mumbai, Maharashtra 400051',
      notes: 'Key enterprise account. Prefers monthly milestone billing.',
      status: ClientStatus.ACTIVE,
    },
  });

  const clientStarlight = await prisma.client.create({
    data: {
      name: 'Starlight Studios',
      email: 'ananya@starlightstudios.com',
      companyName: 'Starlight Media & Arts LLP',
      phone: '+91 98450 67890',
      address: '100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038',
      notes: 'Fast-moving creative agency. Communicates primarily on Slack.',
      status: ClientStatus.ACTIVE,
    },
  });

  const clientFinVantage = await prisma.client.create({
    data: {
      name: 'FinVantage Tech',
      email: 'rajesh@finvantage.io',
      companyName: 'FinVantage Technologies India Pvt Ltd',
      phone: '+91 98110 54321',
      address: 'DLF Cyber City, Phase 2, Gurugram, Haryana 122002',
      notes: 'Fintech client. Requires strict NDA and secure code reviews.',
      status: ClientStatus.ACTIVE,
    },
  });

  const clientGreenLeaf = await prisma.client.create({
    data: {
      name: 'GreenLeaf Organics',
      email: 'pooja@greenleaforganics.in',
      companyName: 'GreenLeaf Naturals Ltd',
      phone: '+91 97654 32109',
      address: 'North Main Road, Koregaon Park, Pune, Maharashtra 411001',
      notes: 'Direct-to-consumer organic brand expanding online.',
      status: ClientStatus.ACTIVE,
    },
  });

  const clientNexus = await prisma.client.create({
    data: {
      name: 'Nexus Mobility',
      email: 'kabir@nexusmobility.co',
      companyName: 'Nexus Fleet Technologies Inc',
      phone: '+91 99887 76655',
      address: 'Mindspace IT Park, HITEC City, Hyderabad, Telangana 500081',
      notes: 'EV charging and fleet management SaaS.',
      status: ClientStatus.ACTIVE,
    },
  });

  await prisma.client.create({
    data: {
      name: 'Apex Retailers',
      email: 'siddharth@apexretail.in',
      companyName: 'Apex Multi-Brand Retail',
      phone: '+91 91234 56789',
      address: 'Sector 5, Salt Lake City, Kolkata, West Bengal 700091',
      notes: 'Account on pause pending internal organizational review.',
      status: ClientStatus.INACTIVE,
    },
  });

  console.log('✅ Created 6 clients.');

  // 2. Create Projects (Multiple projects for Acme)
  const proj1 = await prisma.project.create({
    data: {
      title: 'Website Redesign & Rebrand',
      description: 'End-to-end design system overhaul, Next.js marketing website, and CMS migration.',
      clientId: clientAcme.id,
      budget: 150000.00,
      startDate: new Date('2026-10-01T09:00:00Z'),
      deadline: new Date('2026-11-30T18:00:00Z'),
      status: ProjectStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      progress: 65,
      notes: 'Phase 1 approved; working on CMS integration.',
    },
  });

  const proj2 = await prisma.project.create({
    data: {
      title: 'Mobile App UI/UX Design',
      description: 'Design comprehensive iOS & Android app design systems in Figma with 50+ screens.',
      clientId: clientStarlight.id,
      budget: 220000.00,
      startDate: new Date('2026-09-15T09:00:00Z'),
      deadline: new Date('2026-12-15T18:00:00Z'),
      status: ProjectStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      progress: 45,
      notes: 'Awaiting client feedback on onboarding prototype.',
    },
  });

  const proj3 = await prisma.project.create({
    data: {
      title: 'Fintech Dashboard Engineering',
      description: 'Build responsive wealth-management analytics dashboard with real-time portfolio charts.',
      clientId: clientFinVantage.id,
      budget: 350000.00,
      startDate: new Date('2026-11-01T09:00:00Z'),
      deadline: new Date('2027-01-31T18:00:00Z'),
      status: ProjectStatus.PLANNING,
      priority: Priority.MEDIUM,
      progress: 15,
      notes: 'Architecture documentation and API specifications in review.',
    },
  });

  const proj4 = await prisma.project.create({
    data: {
      title: 'E-Commerce Storefront Revamp',
      description: 'High-conversion Shopify & headless Next.js storefront for organic products.',
      clientId: clientGreenLeaf.id,
      budget: 120000.00,
      startDate: new Date('2026-08-01T09:00:00Z'),
      deadline: new Date('2026-10-15T18:00:00Z'),
      status: ProjectStatus.COMPLETED,
      priority: Priority.MEDIUM,
      progress: 100,
      notes: 'Successfully launched and handed over.',
    },
  });

  await prisma.project.create({
    data: {
      title: 'Fleet Telematics Portal',
      description: 'Live tracking portal for EV charging stations and commercial vehicles.',
      clientId: clientNexus.id,
      budget: 280000.00,
      startDate: new Date('2026-07-01T09:00:00Z'),
      deadline: new Date('2026-11-20T18:00:00Z'),
      status: ProjectStatus.ON_HOLD,
      priority: Priority.HIGH,
      progress: 30,
      notes: 'Paused by client pending hardware vendor API release.',
    },
  });

  await prisma.project.create({
    data: {
      title: 'Annual Brand Assets & Collateral',
      description: 'Brand identity guidelines, slide decks, social kits, and corporate pitch templates.',
      clientId: clientAcme.id,
      budget: 80000.00,
      startDate: new Date('2026-11-10T09:00:00Z'),
      deadline: new Date('2026-12-20T18:00:00Z'),
      status: ProjectStatus.PLANNING,
      priority: Priority.LOW,
      progress: 10,
      notes: 'Second project commissioned by Acme Corp.',
    },
  });

  console.log('✅ Created 6 projects.');

  // 3. Create Tasks
  await prisma.task.createMany({
    data: [
      {
        title: 'Design high-fidelity homepage layout in Figma',
        description: 'Complete desktop and mobile responsive artboards.',
        projectId: proj1.id,
        dueDate: new Date('2026-10-15T18:00:00Z'),
        priority: Priority.HIGH,
        status: TaskStatus.COMPLETED,
        completedAt: new Date('2026-10-14T15:30:00Z'),
      },
      {
        title: 'Build Tailwind v4 theme tokens and shared UI kit',
        description: 'Typography, emerald color scale, and button primitives.',
        projectId: proj1.id,
        dueDate: new Date('2026-10-25T18:00:00Z'),
        priority: Priority.MEDIUM,
        status: TaskStatus.COMPLETED,
        completedAt: new Date('2026-10-24T17:00:00Z'),
      },
      {
        title: 'Implement CMS blog and case study dynamic pages',
        description: 'Connect Next.js Server Components with headless CMS API.',
        projectId: proj1.id,
        dueDate: new Date('2026-11-18T18:00:00Z'),
        priority: Priority.HIGH,
        status: TaskStatus.IN_PROGRESS,
      },
      {
        title: 'Conduct Lighthouse core web vitals and SEO audit',
        description: 'Target score: 95+ across Performance, Accessibility, SEO.',
        projectId: proj1.id,
        dueDate: new Date('2026-11-28T18:00:00Z'),
        priority: Priority.LOW,
        status: TaskStatus.TODO,
      },
      {
        title: 'Design onboarding flow wireframes',
        description: 'Map out 4-step onboarding screens with role selection.',
        projectId: proj2.id,
        dueDate: new Date('2026-10-05T18:00:00Z'),
        priority: Priority.HIGH,
        status: TaskStatus.COMPLETED,
        completedAt: new Date('2026-10-04T12:00:00Z'),
      },
      {
        title: 'Interactive prototype for user testing',
        description: 'Hook up Figma smart animations for mobile tab transitions.',
        projectId: proj2.id,
        dueDate: new Date('2026-11-20T18:00:00Z'),
        priority: Priority.HIGH,
        status: TaskStatus.IN_PROGRESS,
      },
      {
        title: 'Define REST API contract and Zod schemas',
        description: 'Draft API endpoints for portfolio metrics and trade execution.',
        projectId: proj3.id,
        dueDate: new Date('2026-11-16T18:00:00Z'),
        priority: Priority.HIGH,
        status: TaskStatus.IN_PROGRESS,
      },
      {
        title: 'Deploy production release on Vercel',
        description: 'Configure custom domains, SSL, and analytics.',
        projectId: proj4.id,
        dueDate: new Date('2026-10-10T18:00:00Z'),
        priority: Priority.HIGH,
        status: TaskStatus.COMPLETED,
        completedAt: new Date('2026-10-09T18:00:00Z'),
      },
    ],
  });

  console.log('✅ Created tasks.');

  // 4. Create Milestones
  await prisma.milestone.createMany({
    data: [
      {
        title: 'Phase 1: Design System & Wireframes',
        description: 'Complete brand moodboards and initial layouts.',
        projectId: proj1.id,
        dueDate: new Date('2026-10-20T18:00:00Z'),
        status: MilestoneStatus.COMPLETED,
        completedAt: new Date('2026-10-18T16:00:00Z'),
      },
      {
        title: 'Phase 2: Frontend Engineering',
        description: 'Responsive Next.js App Router layout and interactive views.',
        projectId: proj1.id,
        dueDate: new Date('2026-11-15T18:00:00Z'),
        status: MilestoneStatus.IN_PROGRESS,
      },
      {
        title: 'Phase 3: CMS & Production Launch',
        description: 'Deploy to custom domain with CDN caching.',
        projectId: proj1.id,
        dueDate: new Date('2026-11-30T18:00:00Z'),
        status: MilestoneStatus.PENDING,
      },
      {
        title: 'UI Kit & Figma Deliverable',
        description: 'Export all tokenized design components.',
        projectId: proj2.id,
        dueDate: new Date('2026-11-25T18:00:00Z'),
        status: MilestoneStatus.IN_PROGRESS,
      },
    ],
  });

  console.log('✅ Created milestones.');

  // 5. Create Deliverables
  await prisma.deliverable.createMany({
    data: [
      {
        title: 'Website Brand & Design System in Figma',
        description: 'Comprehensive typography, iconography, and responsive layouts.',
        projectId: proj1.id,
        submissionDate: new Date('2026-10-20T14:00:00Z'),
        attachmentUrl: 'https://www.figma.com/file/acme-design-system-2026',
        attachmentType: AttachmentType.FIGMA,
        status: DeliverableStatus.APPROVED,
        notes: 'Approved by Vikram Malhotra on 21 Oct.',
      },
      {
        title: 'Marketing Frontend GitHub Repository',
        description: 'Source code for Next.js App Router website.',
        projectId: proj1.id,
        submissionDate: new Date('2026-11-10T11:00:00Z'),
        attachmentUrl: 'https://github.com/freelancehub/acme-marketing-web',
        attachmentType: AttachmentType.GITHUB,
        status: DeliverableStatus.SUBMITTED,
        notes: 'Under client staging code review.',
      },
      {
        title: 'Mobile App Wireframes & User Journey Spec',
        description: 'Figma interactive prototype covering 32 core user paths.',
        projectId: proj2.id,
        submissionDate: new Date('2026-10-28T16:30:00Z'),
        attachmentUrl: 'https://www.figma.com/proto/starlight-mobile-app',
        attachmentType: AttachmentType.FIGMA,
        status: DeliverableStatus.REVISION_REQUIRED,
        notes: 'Requested simpler checkout stepper flow.',
      },
      {
        title: 'Production Handover Documentation',
        description: 'Architecture diagram, credentials runbook, and support guide.',
        projectId: proj4.id,
        submissionDate: new Date('2026-10-12T10:00:00Z'),
        attachmentUrl: 'https://docs.google.com/document/d/greenleaf-handover-runbook',
        attachmentType: AttachmentType.DOCUMENT,
        status: DeliverableStatus.APPROVED,
        notes: 'Final sign-off completed.',
      },
    ],
  });

  console.log('✅ Created deliverables.');

  // 6. Create Payments (Completed, Pending, Failed)
  // Budget breakdown:
  // proj1 (Acme, Budget: ₹1,50,000):
  //   - ₹50,000 Completed (Deposit)
  //   - ₹45,000 Completed (Milestone 1) -> Total Paid = ₹95,000, Outstanding = ₹55,000
  //   - ₹30,000 Pending (Milestone 2 Invoice)
  // proj2 (Starlight, Budget: ₹2,20,000):
  //   - ₹65,000 Completed (Kickoff) -> Total Paid = ₹65,000, Outstanding = ₹1,55,000
  //   - ₹25,000 Failed (UPI timeout) -> Does not count
  // proj4 (GreenLeaf, Budget: ₹1,20,000):
  //   - ₹1,20,000 Completed (Full Payment) -> Total Paid = ₹1,20,000, Outstanding = ₹0

  await prisma.payment.createMany({
    data: [
      {
        projectId: proj1.id,
        amount: 50000.00,
        paymentDate: new Date('2026-10-02T11:00:00Z'),
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        referenceNumber: 'NEFT-HDFC-9928172',
        status: PaymentStatus.COMPLETED,
        notes: 'Initial 33% contract advance deposit.',
      },
      {
        projectId: proj1.id,
        amount: 45000.00,
        paymentDate: new Date('2026-11-05T14:30:00Z'),
        paymentMethod: PaymentMethod.UPI,
        referenceNumber: 'UPI-ICICI-8821903',
        status: PaymentStatus.COMPLETED,
        notes: 'Milestone 1 Design Approval payout.',
      },
      {
        projectId: proj1.id,
        amount: 30000.00,
        paymentDate: new Date('2026-11-12T10:00:00Z'),
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        referenceNumber: 'INV-ACME-002',
        status: PaymentStatus.PENDING,
        notes: 'Awaiting finance department verification.',
      },
      {
        projectId: proj2.id,
        amount: 65000.00,
        paymentDate: new Date('2026-09-20T16:00:00Z'),
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        referenceNumber: 'RTGS-KOTAK-1029384',
        status: PaymentStatus.COMPLETED,
        notes: 'Phase 1 mobile UI deposit.',
      },
      {
        projectId: proj2.id,
        amount: 25000.00,
        paymentDate: new Date('2026-11-04T12:15:00Z'),
        paymentMethod: PaymentMethod.UPI,
        referenceNumber: 'UPI-FAIL-091823',
        status: PaymentStatus.FAILED,
        notes: 'UPI transaction timed out on client side; invoice re-issued.',
      },
      {
        projectId: proj4.id,
        amount: 120000.00,
        paymentDate: new Date('2026-10-15T17:00:00Z'),
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        referenceNumber: 'IMPS-AXIS-7744112',
        status: PaymentStatus.COMPLETED,
        notes: 'Full payment upon successful production launch.',
      },
    ],
  });

  console.log('✅ Created payments.');

  // 7. Create Activities
  await prisma.activity.createMany({
    data: [
      {
        projectId: proj1.id,
        clientId: clientAcme.id,
        type: 'PAYMENT_RECORDED',
        description: 'Received ₹45,000 via UPI from Acme Corporation for Milestone 1.',
        createdAt: new Date('2026-11-05T14:35:00Z'),
      },
      {
        projectId: proj1.id,
        clientId: clientAcme.id,
        type: 'DELIVERABLE_SUBMITTED',
        description: 'Submitted Marketing Frontend GitHub Repository for staging review.',
        createdAt: new Date('2026-11-10T11:05:00Z'),
      },
      {
        projectId: proj2.id,
        clientId: clientStarlight.id,
        type: 'STATUS_CHANGED',
        description: 'Mobile App Wireframes status changed to Revision Required.',
        createdAt: new Date('2026-10-29T10:00:00Z'),
      },
      {
        projectId: proj4.id,
        clientId: clientGreenLeaf.id,
        type: 'PROJECT_COMPLETED',
        description: 'E-Commerce Storefront Revamp marked completed with full payment received.',
        createdAt: new Date('2026-10-15T17:30:00Z'),
      },
      {
        projectId: proj3.id,
        clientId: clientFinVantage.id,
        type: 'PROJECT_CREATED',
        description: 'New project "Fintech Dashboard Engineering" created for FinVantage Tech.',
        createdAt: new Date('2026-11-01T09:30:00Z'),
      },
    ],
  });

  console.log('✅ Created business activities.');
  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

