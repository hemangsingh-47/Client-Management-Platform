/**
 * FreelanceHub — Phase 6 Project Management Centralized Mock Data
 * Realistic, strongly-typed project management models and initial dataset.
 */

import { INITIAL_CLIENTS, Client } from './clients';

import { Project, ProjectStatus, ProjectPriority } from '@/types/project';
export type { Project, ProjectStatus, ProjectPriority } from '@/types/project';

export interface ProjectTaskPreview {
  id: string;
  projectId: string;
  title: string;
  dueDate: string;
  completed: boolean;
  priority: ProjectPriority;
}

export interface ProjectDeliverablePreview {
  id: string;
  projectId: string;
  title: string;
  version: string;
  status: 'Draft' | 'In Review' | 'Approved' | 'Sent';
  updatedAt: string;
}

export interface ProjectPaymentPreview {
  id: string;
  projectId: string;
  milestoneTitle: string;
  amount: number;
  status: 'Completed' | 'Pending';
  dueDate: string;
}

export interface ProjectActivityPreview {
  id: string;
  projectId: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'milestone' | 'task' | 'deliverable' | 'payment' | 'created';
}

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Website Redesign',
    clientId: 'cli-1', // John Carter / Acme Studio
    description:
      'Complete overhaul of corporate marketing website with interactive component library, performance optimizations, and responsive typography system.',
    budget: 45000,
    startDate: '2026-10-18',
    deadline: '2026-11-18',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    progress: 72,
    notes:
      'Milestone 1 approved. Client requested additional mobile micro-animations for hero section.',
    createdAt: '18 Oct 2026',
  },
  {
    id: 'proj-2',
    title: 'Mobile App UI',
    clientId: 'cli-2', // Sarah Chen / Northstar Labs
    description:
      'User experience strategy, design tokens, and high-fidelity Figma screens for iOS and Android healthcare monitoring application.',
    budget: 80000,
    startDate: '2026-10-25',
    deadline: '2026-11-24',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    progress: 45,
    notes:
      'Bi-weekly sprint check-in every Tuesday at 4 PM IST. Requires biometric login flows.',
    createdAt: '25 Oct 2026',
  },
  {
    id: 'proj-3',
    title: 'Brand Identity',
    clientId: 'cli-3', // Marcus Vance / Studio Eleven
    description:
      'Comprehensive brand identity system including logo marks, color hierarchy, custom typography guidance, and presentation pitch templates.',
    budget: 30000,
    startDate: '2026-11-01',
    deadline: '2026-11-29',
    status: 'PLANNING',
    priority: 'MEDIUM',
    progress: 15,
    notes:
      'Initial moodboards shared. Waiting for client executive team to consolidate font preference feedback.',
    createdAt: '01 Nov 2026',
  },
  {
    id: 'proj-4',
    title: 'E-commerce Platform',
    clientId: 'cli-4', // Priya Sharma / UrbanCart Retail
    description:
      'Full-stack Next.js storefront with dynamic inventory catalog, cart drawer, Razorpay checkout, and order management dashboard.',
    budget: 120000,
    startDate: '2026-08-10',
    deadline: '2026-12-12',
    status: 'ON_HOLD',
    priority: 'MEDIUM',
    progress: 60,
    notes:
      'Currently on hold pending client merchant GSTIN verification and payment gateway approval.',
    createdAt: '10 Aug 2026',
  },
  {
    id: 'proj-5',
    title: 'Brand Strategy Alignment',
    clientId: 'cli-1', // John Carter / Acme Studio
    description:
      'Strategic market positioning analysis, competitor benchmarking deck, and visual tone-of-voice documentation for Series A announcement.',
    budget: 30000,
    startDate: '2026-09-15',
    deadline: '2026-10-15',
    status: 'COMPLETED',
    priority: 'LOW',
    progress: 100,
    notes:
      'Project completed ahead of schedule. Client paid in full via UPI on 15 Oct.',
    createdAt: '15 Sep 2026',
  },
  {
    id: 'proj-6',
    title: 'Q4 Investor Pitch Deck',
    clientId: 'cli-5', // David Miller / Apex Ventures
    description:
      '30-slide pitch presentation for limited partners highlighting annual fund performance, portfolio returns, and growth metrics.',
    budget: 50000,
    startDate: '2026-10-10',
    deadline: '2026-11-02',
    status: 'COMPLETED',
    priority: 'HIGH',
    progress: 100,
    notes:
      'Final PDF and Figma slides delivered. Clean sign-off and testimonial received.',
    createdAt: '10 Oct 2026',
  },
  {
    id: 'proj-7',
    title: 'Portfolio Founder Report',
    clientId: 'cli-5', // David Miller / Apex Ventures
    description:
      'Annual PDF and web interactive overview summarizing progress across 24 early-stage tech portfolio founders.',
    budget: 35000,
    startDate: '2026-09-01',
    deadline: '2026-09-28',
    status: 'COMPLETED',
    priority: 'LOW',
    progress: 100,
    notes:
      'All assets uploaded to shared cloud folder. Invoice settled on 28 Sep.',
    createdAt: '01 Sep 2026',
  },
];

export const MOCK_PROJECT_TASKS: Record<string, ProjectTaskPreview[]> = {
  'proj-1': [
    {
      id: 'tsk-101',
      projectId: 'proj-1',
      title: 'Finalize mobile responsive nav and hero section',
      dueDate: '12 Nov 2026',
      completed: true,
      priority: 'HIGH',
    },
    {
      id: 'tsk-102',
      projectId: 'proj-1',
      title: 'Integrate contact form email notification service',
      dueDate: '15 Nov 2026',
      completed: false,
      priority: 'HIGH',
    },
    {
      id: 'tsk-103',
      projectId: 'proj-1',
      title: 'Lighthouse accessibility and performance audit',
      dueDate: '17 Nov 2026',
      completed: false,
      priority: 'MEDIUM',
    },
    {
      id: 'tsk-104',
      projectId: 'proj-1',
      title: 'Handover documentation and client video walkthrough',
      dueDate: '18 Nov 2026',
      completed: false,
      priority: 'LOW',
    },
  ],
  'proj-2': [
    {
      id: 'tsk-201',
      projectId: 'proj-2',
      title: 'Biometric authorization screen states',
      dueDate: '14 Nov 2026',
      completed: true,
      priority: 'HIGH',
    },
    {
      id: 'tsk-202',
      projectId: 'proj-2',
      title: 'Vitals tracking dashboard chart components',
      dueDate: '19 Nov 2026',
      completed: false,
      priority: 'HIGH',
    },
    {
      id: 'tsk-203',
      projectId: 'proj-2',
      title: 'Export SVG icon pack to React Native library',
      dueDate: '22 Nov 2026',
      completed: false,
      priority: 'MEDIUM',
    },
  ],
  'proj-3': [
    {
      id: 'tsk-301',
      projectId: 'proj-3',
      title: 'Moodboard compilation and visual themes',
      dueDate: '08 Nov 2026',
      completed: true,
      priority: 'MEDIUM',
    },
    {
      id: 'tsk-302',
      projectId: 'proj-3',
      title: 'Logo mark concepts & geometry exploration',
      dueDate: '20 Nov 2026',
      completed: false,
      priority: 'HIGH',
    },
  ],
  'proj-4': [
    {
      id: 'tsk-401',
      projectId: 'proj-4',
      title: 'Checkout flow integration',
      dueDate: '12 Dec 2026',
      completed: false,
      priority: 'MEDIUM',
    },
  ],
};

export const MOCK_PROJECT_DELIVERABLES: Record<string, ProjectDeliverablePreview[]> = {
  'proj-1': [
    {
      id: 'del-101',
      projectId: 'proj-1',
      title: 'Design System & Figma Tokens',
      version: 'v1.4',
      status: 'Approved',
      updatedAt: '02 Nov 2026',
    },
    {
      id: 'del-102',
      projectId: 'proj-1',
      title: 'Marketing Landing Page Staging URL',
      version: 'v2.0-rc',
      status: 'In Review',
      updatedAt: '09 Nov 2026',
    },
  ],
  'proj-2': [
    {
      id: 'del-201',
      projectId: 'proj-2',
      title: 'Figma UI Wireframe Kit',
      version: 'v1.0',
      status: 'Approved',
      updatedAt: '28 Oct 2026',
    },
    {
      id: 'del-202',
      projectId: 'proj-2',
      title: 'Interactive Prototype',
      version: 'v0.8',
      status: 'Draft',
      updatedAt: '08 Nov 2026',
    },
  ],
  'proj-3': [
    {
      id: 'del-301',
      projectId: 'proj-3',
      title: 'Brand Moodboard Deck',
      version: 'v1.0',
      status: 'Sent',
      updatedAt: '06 Nov 2026',
    },
  ],
};

export const MOCK_PROJECT_PAYMENTS: Record<string, ProjectPaymentPreview[]> = {
  'proj-1': [
    {
      id: 'pay-101',
      projectId: 'proj-1',
      milestoneTitle: 'Initial Deposit (33%)',
      amount: 15000,
      status: 'Completed',
      dueDate: '18 Oct 2026',
    },
    {
      id: 'pay-102',
      projectId: 'proj-1',
      milestoneTitle: 'Design Approval Milestone (33%)',
      amount: 15000,
      status: 'Completed',
      dueDate: '01 Nov 2026',
    },
    {
      id: 'pay-103',
      projectId: 'proj-1',
      milestoneTitle: 'Final Handover & Launch (34%)',
      amount: 15000,
      status: 'Pending',
      dueDate: '18 Nov 2026',
    },
  ],
  'proj-2': [
    {
      id: 'pay-201',
      projectId: 'proj-2',
      milestoneTitle: 'Milestone 1 — UX Foundations',
      amount: 45000,
      status: 'Completed',
      dueDate: '25 Oct 2026',
    },
    {
      id: 'pay-202',
      projectId: 'proj-2',
      milestoneTitle: 'Milestone 2 — Final Screen Handoff',
      amount: 35000,
      status: 'Pending',
      dueDate: '24 Nov 2026',
    },
  ],
  'proj-3': [
    {
      id: 'pay-301',
      projectId: 'proj-3',
      milestoneTitle: 'Deposit — Identity Exploration',
      amount: 15000,
      status: 'Completed',
      dueDate: '01 Nov 2026',
    },
    {
      id: 'pay-302',
      projectId: 'proj-3',
      milestoneTitle: 'Final Delivery & Guidelines Handover',
      amount: 15000,
      status: 'Pending',
      dueDate: '29 Nov 2026',
    },
  ],
};

export const MOCK_PROJECT_ACTIVITIES: Record<string, ProjectActivityPreview[]> = {
  'proj-1': [
    {
      id: 'act-101',
      projectId: 'proj-1',
      title: 'Landing page staging build shared',
      description: 'Submitted preview deployment URL to Acme Studio for feedback.',
      timestamp: 'Yesterday at 3:45 PM',
      type: 'deliverable',
    },
    {
      id: 'act-102',
      projectId: 'proj-1',
      title: 'Milestone 2 payment verified',
      description: 'Received ₹15,000 for Design Approval milestone.',
      timestamp: '01 Nov 2026',
      type: 'payment',
    },
    {
      id: 'act-103',
      projectId: 'proj-1',
      title: 'Wireframes signed off',
      description: 'John Carter approved core information architecture.',
      timestamp: '24 Oct 2026',
      type: 'milestone',
    },
    {
      id: 'act-104',
      projectId: 'proj-1',
      title: 'Project initiated',
      description: 'Sprint kicked off with ₹45,000 budget.',
      timestamp: '18 Oct 2026',
      type: 'created',
    },
  ],
  'proj-2': [
    {
      id: 'act-201',
      projectId: 'proj-2',
      title: 'Component library v1 submitted',
      description: 'Shared design system tokens with engineering team.',
      timestamp: '3 hours ago',
      type: 'deliverable',
    },
    {
      id: 'act-202',
      projectId: 'proj-2',
      title: 'Milestone 1 deposit recorded',
      description: 'Received ₹45,000 via Bank Transfer.',
      timestamp: '25 Oct 2026',
      type: 'payment',
    },
  ],
};

/**
 * Helper to retrieve client details for a given project.
 */
export function getProjectClient(
  clientId: string,
  clients: Client[] = INITIAL_CLIENTS
): Client | undefined {
  return clients.find((c) => c.id === clientId);
}

/**
 * Format helpers for Project status and priority
 */
export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  PLANNING: 'Planning',
  IN_PROGRESS: 'In Progress',
  ON_HOLD: 'On Hold',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const PROJECT_PRIORITY_LABELS: Record<ProjectPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};
