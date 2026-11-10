/**
 * FreelanceHub — Phase 5 Client Management Centralized Mock Data
 * Realistic, typed development sample data for UI demonstration.
 */

export type ClientStatus = 'ACTIVE' | 'INACTIVE';

export interface Client {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  phone?: string;
  address?: string;
  notes?: string;
  status: ClientStatus;
  createdAt: string;
  totalProjects: number;
  totalPaid: number;
  outstanding: number;
  lastActivity: string;
}

export type ClientProjectStatus = 'In Progress' | 'Planning' | 'On Hold' | 'Completed';

export interface ClientProject {
  id: string;
  clientId: string;
  name: string;
  status: ClientProjectStatus;
  deadline: string;
  budget: number;
  progress: number;
}

export type PaymentMethod = 'Bank Transfer' | 'UPI' | 'Credit Card' | 'Stripe';
export type PaymentStatus = 'Completed' | 'Pending' | 'Failed';

export interface ClientPayment {
  id: string;
  clientId: string;
  date: string;
  projectName: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
}

export type ActivityType = 'created' | 'project_started' | 'payment' | 'deliverable' | 'completed';

export interface ClientActivity {
  id: string;
  clientId: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
}

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-1',
    name: 'John Carter',
    companyName: 'Acme Studio',
    email: 'john.carter@acmestudio.design',
    phone: '+91 98765 43210',
    address: '402, Lotus Business Park, Andheri East, Mumbai, Maharashtra 400069',
    notes: 'Enterprise design partner. Key project is full website redesign. Milestone payments on bi-weekly sprint schedule.',
    status: 'ACTIVE',
    createdAt: '12 Aug 2026',
    totalProjects: 2,
    totalPaid: 60000,
    outstanding: 15000,
    lastActivity: '15m ago',
  },
  {
    id: 'cli-2',
    name: 'Sarah Chen',
    companyName: 'Northstar Labs',
    email: 'sarah.chen@northstarlabs.io',
    phone: '+91 98111 22334',
    address: 'Tower B, Cyber City, DLF Phase 2, Gurugram, Haryana 122002',
    notes: 'SaaS mobile application development. Fast approvals, monthly billing via bank transfer.',
    status: 'ACTIVE',
    createdAt: '01 Sep 2026',
    totalProjects: 1,
    totalPaid: 45000,
    outstanding: 35000,
    lastActivity: '3h ago',
  },
  {
    id: 'cli-3',
    name: 'Marcus Vance',
    companyName: 'Studio Eleven',
    email: 'marcus@studioeleven.co',
    phone: '+91 98222 33445',
    address: '12, Koramangala 4th Block, 80 Feet Road, Bengaluru, Karnataka 560034',
    notes: 'Brand identity refresh and typography guidelines. Deliverables shared via Figma.',
    status: 'ACTIVE',
    createdAt: '18 Sep 2026',
    totalProjects: 1,
    totalPaid: 15000,
    outstanding: 15000,
    lastActivity: 'Yesterday',
  },
  {
    id: 'cli-4',
    name: 'Priya Sharma',
    companyName: 'UrbanCart Retail',
    email: 'priya.sharma@urbancart.in',
    phone: '+91 98333 44556',
    address: 'Plot 88, Okhla Industrial Area Phase 3, New Delhi 110020',
    notes: 'E-commerce platform currently paused pending merchant payment gateway approval.',
    status: 'INACTIVE',
    createdAt: '05 Jul 2026',
    totalProjects: 1,
    totalPaid: 60000,
    outstanding: 60000,
    lastActivity: '2 days ago',
  },
  {
    id: 'cli-5',
    name: 'David Miller',
    companyName: 'Apex Ventures',
    email: 'david@apexventures.fund',
    phone: '+91 98444 55667',
    address: 'Level 14, Brigade Gateway, Malleshwaram, Bengaluru, Karnataka 560055',
    notes: 'Quarterly pitch deck designs and portfolio founder branding collateral.',
    status: 'ACTIVE',
    createdAt: '10 Jun 2026',
    totalProjects: 2,
    totalPaid: 85000,
    outstanding: 0,
    lastActivity: '5 days ago',
  },
];

export const MOCK_CLIENT_PROJECTS: Record<string, ClientProject[]> = {
  'cli-1': [
    {
      id: 'proj-1',
      clientId: 'cli-1',
      name: 'Website Redesign',
      status: 'In Progress',
      deadline: '18 Nov 2026',
      budget: 45000,
      progress: 72,
    },
    {
      id: 'proj-5',
      clientId: 'cli-1',
      name: 'Brand Strategy Alignment',
      status: 'Completed',
      deadline: '15 Oct 2026',
      budget: 30000,
      progress: 100,
    },
  ],
  'cli-2': [
    {
      id: 'proj-2',
      clientId: 'cli-2',
      name: 'Mobile App UI',
      status: 'In Progress',
      deadline: '24 Nov 2026',
      budget: 80000,
      progress: 45,
    },
  ],
  'cli-3': [
    {
      id: 'proj-3',
      clientId: 'cli-3',
      name: 'Brand Identity',
      status: 'Planning',
      deadline: '29 Nov 2026',
      budget: 30000,
      progress: 15,
    },
  ],
  'cli-4': [
    {
      id: 'proj-4',
      clientId: 'cli-4',
      name: 'E-commerce Platform',
      status: 'On Hold',
      deadline: '12 Dec 2026',
      budget: 120000,
      progress: 60,
    },
  ],
  'cli-5': [
    {
      id: 'proj-6',
      clientId: 'cli-5',
      name: 'Q4 Investor Pitch Deck',
      status: 'Completed',
      deadline: '02 Nov 2026',
      budget: 50000,
      progress: 100,
    },
    {
      id: 'proj-7',
      clientId: 'cli-5',
      name: 'Portfolio Founder Report',
      status: 'Completed',
      deadline: '28 Sep 2026',
      budget: 35000,
      progress: 100,
    },
  ],
};

export const MOCK_CLIENT_PAYMENTS: Record<string, ClientPayment[]> = {
  'cli-1': [
    {
      id: 'pay-1',
      clientId: 'cli-1',
      date: '01 Nov 2026',
      projectName: 'Website Redesign',
      method: 'Bank Transfer',
      amount: 15000,
      status: 'Completed',
    },
    {
      id: 'pay-2',
      clientId: 'cli-1',
      date: '15 Oct 2026',
      projectName: 'Brand Strategy Alignment',
      method: 'UPI',
      amount: 30000,
      status: 'Completed',
    },
    {
      id: 'pay-3',
      clientId: 'cli-1',
      date: '28 Sep 2026',
      projectName: 'Website Redesign',
      method: 'Bank Transfer',
      amount: 15000,
      status: 'Completed',
    },
    {
      id: 'pay-4',
      clientId: 'cli-1',
      date: 'Due 18 Nov',
      projectName: 'Website Redesign (Final Milestone)',
      method: 'Bank Transfer',
      amount: 15000,
      status: 'Pending',
    },
  ],
  'cli-2': [
    {
      id: 'pay-5',
      clientId: 'cli-2',
      date: '25 Oct 2026',
      projectName: 'Mobile App UI (Milestone 1)',
      method: 'Bank Transfer',
      amount: 45000,
      status: 'Completed',
    },
    {
      id: 'pay-6',
      clientId: 'cli-2',
      date: 'Due 24 Nov',
      projectName: 'Mobile App UI (Final Deliverable)',
      method: 'Bank Transfer',
      amount: 35000,
      status: 'Pending',
    },
  ],
  'cli-3': [
    {
      id: 'pay-7',
      clientId: 'cli-3',
      date: '18 Oct 2026',
      projectName: 'Brand Identity (Deposit)',
      method: 'Credit Card',
      amount: 15000,
      status: 'Completed',
    },
    {
      id: 'pay-8',
      clientId: 'cli-3',
      date: 'Due 29 Nov',
      projectName: 'Brand Identity (Handover)',
      method: 'Credit Card',
      amount: 15000,
      status: 'Pending',
    },
  ],
  'cli-4': [
    {
      id: 'pay-9',
      clientId: 'cli-4',
      date: '10 Aug 2026',
      projectName: 'E-commerce Platform (Phase 1)',
      method: 'Bank Transfer',
      amount: 60000,
      status: 'Completed',
    },
    {
      id: 'pay-10',
      clientId: 'cli-4',
      date: 'On Hold',
      projectName: 'E-commerce Platform (Phase 2)',
      method: 'Bank Transfer',
      amount: 60000,
      status: 'Pending',
    },
  ],
  'cli-5': [
    {
      id: 'pay-11',
      clientId: 'cli-5',
      date: '02 Nov 2026',
      projectName: 'Q4 Investor Pitch Deck',
      method: 'Bank Transfer',
      amount: 50000,
      status: 'Completed',
    },
    {
      id: 'pay-12',
      clientId: 'cli-5',
      date: '28 Sep 2026',
      projectName: 'Portfolio Founder Report',
      method: 'UPI',
      amount: 35000,
      status: 'Completed',
    },
  ],
};

export const MOCK_CLIENT_ACTIVITIES: Record<string, ClientActivity[]> = {
  'cli-1': [
    {
      id: 'act-1',
      clientId: 'cli-1',
      type: 'payment',
      title: 'Payment of ₹15,000 received',
      description: 'Milestone 1 invoice marked paid via Bank Transfer',
      timestamp: '15m ago',
    },
    {
      id: 'act-2',
      clientId: 'cli-1',
      type: 'deliverable',
      title: 'Homepage wireframe shared',
      description: 'Submitted design artifacts for client feedback',
      timestamp: 'Yesterday',
    },
    {
      id: 'act-3',
      clientId: 'cli-1',
      type: 'project_started',
      title: 'Website Redesign initiated',
      description: 'Project scope specification and timeline approved',
      timestamp: '18 Oct 2026',
    },
    {
      id: 'act-4',
      clientId: 'cli-1',
      type: 'completed',
      title: 'Brand Strategy Alignment completed',
      description: 'Final deck approved and signed off by client',
      timestamp: '15 Oct 2026',
    },
    {
      id: 'act-5',
      clientId: 'cli-1',
      type: 'created',
      title: 'Client record created',
      description: 'John Carter added to client workspace',
      timestamp: '12 Aug 2026',
    },
  ],
  'cli-2': [
    {
      id: 'act-6',
      clientId: 'cli-2',
      type: 'deliverable',
      title: 'Component library v1 submitted',
      description: 'Shared design system tokens with frontend engineering team',
      timestamp: '3h ago',
    },
    {
      id: 'act-7',
      clientId: 'cli-2',
      type: 'payment',
      title: 'Milestone deposit received',
      description: '₹45,000 recorded via Bank Transfer',
      timestamp: '25 Oct 2026',
    },
    {
      id: 'act-8',
      clientId: 'cli-2',
      type: 'created',
      title: 'Client record created',
      description: 'Sarah Chen added to workspace',
      timestamp: '01 Sep 2026',
    },
  ],
  'cli-3': [
    {
      id: 'act-9',
      clientId: 'cli-3',
      type: 'project_started',
      title: 'Brand Identity kicked off',
      description: 'Moodboards and initial typography options shared',
      timestamp: 'Yesterday',
    },
    {
      id: 'act-10',
      clientId: 'cli-3',
      type: 'payment',
      title: 'Initial 50% deposit paid',
      description: '₹15,000 paid via Credit Card',
      timestamp: '18 Oct 2026',
    },
    {
      id: 'act-11',
      clientId: 'cli-3',
      type: 'created',
      title: 'Client record created',
      description: 'Marcus Vance added to workspace',
      timestamp: '18 Sep 2026',
    },
  ],
  'cli-4': [
    {
      id: 'act-12',
      clientId: 'cli-4',
      type: 'deliverable',
      title: 'E-commerce platform review',
      description: 'Staging environment shared with Priya Sharma',
      timestamp: '2 days ago',
    },
    {
      id: 'act-13',
      clientId: 'cli-4',
      type: 'payment',
      title: 'Phase 1 development payment',
      description: '₹60,000 recorded via Bank Transfer',
      timestamp: '10 Aug 2026',
    },
    {
      id: 'act-14',
      clientId: 'cli-4',
      type: 'created',
      title: 'Client record created',
      description: 'Priya Sharma added to workspace',
      timestamp: '05 Jul 2026',
    },
  ],
  'cli-5': [
    {
      id: 'act-15',
      clientId: 'cli-5',
      type: 'completed',
      title: 'Q4 Investor Pitch Deck completed',
      description: 'Full deck exported in PDF and Figma presentation format',
      timestamp: '02 Nov 2026',
    },
    {
      id: 'act-16',
      clientId: 'cli-5',
      type: 'payment',
      title: 'Final invoice settled',
      description: '₹50,000 received via Bank Transfer',
      timestamp: '02 Nov 2026',
    },
    {
      id: 'act-17',
      clientId: 'cli-5',
      type: 'created',
      title: 'Client record created',
      description: 'David Miller added to workspace',
      timestamp: '10 Jun 2026',
    },
  ],
};
