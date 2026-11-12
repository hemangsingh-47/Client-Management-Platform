/**
 * FreelanceHub — Phase 7 Tasks & Milestones Centralized Mock Data
 */

import { Task } from '@/types/task';

export const INITIAL_TASKS: Task[] = [
  // Website Redesign (proj-1)
  {
    id: 'tsk-101',
    title: 'Finalize mobile responsive nav and hero section',
    description: 'Ensure hamburger menu transitions smoothly and hero banner typography scales properly on iPhone and Android screens.',
    projectId: 'proj-1',
    dueDate: '2026-11-12',
    priority: 'HIGH',
    status: 'COMPLETED',
    createdAt: '2026-10-20',
    completedAt: '2026-11-10',
  },
  {
    id: 'tsk-102',
    title: 'Integrate contact form email notification service',
    description: 'Set up Resend/SendGrid transactional webhook handler for lead capture submissions.',
    projectId: 'proj-1',
    dueDate: '2026-11-15',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    createdAt: '2026-10-22',
  },
  {
    id: 'tsk-103',
    title: 'Lighthouse accessibility and performance audit',
    description: 'Optimize WebP asset compressions, verify WCAG AA color contrasts and reach 95+ score.',
    projectId: 'proj-1',
    dueDate: '2026-11-17',
    priority: 'MEDIUM',
    status: 'TODO',
    createdAt: '2026-10-25',
  },
  {
    id: 'tsk-104',
    title: 'Handover documentation and client video walkthrough',
    description: 'Record Loom walkthrough covering CMS content blocks and publish Notion guide.',
    projectId: 'proj-1',
    dueDate: '2026-11-18',
    priority: 'LOW',
    status: 'TODO',
    createdAt: '2026-10-28',
  },

  // Mobile App UI (proj-2)
  {
    id: 'tsk-201',
    title: 'Biometric authorization screen states',
    description: 'Design Face ID / Touch ID permission prompts, failure fallback and passcode entry.',
    projectId: 'proj-2',
    dueDate: '2026-11-09', // Overdue (earlier than today 12 Nov)
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    createdAt: '2026-10-26',
  },
  {
    id: 'tsk-202',
    title: 'Vitals tracking dashboard chart components',
    description: 'Interactive SVG systolic/diastolic blood pressure graph with weekly/monthly toggles.',
    projectId: 'proj-2',
    dueDate: '2026-11-19',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    createdAt: '2026-10-28',
  },
  {
    id: 'tsk-203',
    title: 'Export SVG icon pack to React Native library',
    description: 'Format 48 custom medical icons with currentColor stroke bindings.',
    projectId: 'proj-2',
    dueDate: '2026-11-22',
    priority: 'MEDIUM',
    status: 'TODO',
    createdAt: '2026-11-01',
  },

  // Brand Identity (proj-3)
  {
    id: 'tsk-301',
    title: 'Moodboard compilation and visual themes',
    description: 'Curate three distinct visual territories: Minimalist Scandinavian, Editorial Brutalist, and Contemporary Warm.',
    projectId: 'proj-3',
    dueDate: '2026-11-08',
    priority: 'MEDIUM',
    status: 'COMPLETED',
    createdAt: '2026-11-01',
    completedAt: '2026-11-08',
  },
  {
    id: 'tsk-302',
    title: 'Logo mark concepts & geometry exploration',
    description: 'Sketch 12 monogram iterations exploring Studio Eleven architectural letterforms.',
    projectId: 'proj-3',
    dueDate: '2026-11-20',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    createdAt: '2026-11-02',
  },
  {
    id: 'tsk-303',
    title: 'Color palette accessibility testing',
    description: 'Validate contrast ratios for forest green and sage accents on light and dark surfaces.',
    projectId: 'proj-3',
    dueDate: '2026-11-25',
    priority: 'LOW',
    status: 'TODO',
    createdAt: '2026-11-04',
  },

  // E-commerce Platform (proj-4)
  {
    id: 'tsk-401',
    title: 'Checkout flow integration',
    description: 'Configure Razorpay webhook secrets and verify test mode transactions.',
    projectId: 'proj-4',
    dueDate: '2026-11-05', // Overdue
    priority: 'MEDIUM',
    status: 'TODO',
    createdAt: '2026-10-15',
  },
  {
    id: 'tsk-402',
    title: 'Cart drawer state synchronization',
    description: 'Implement optimistic quantity updates and empty cart recommendations.',
    projectId: 'proj-4',
    dueDate: '2026-12-05',
    priority: 'HIGH',
    status: 'TODO',
    createdAt: '2026-10-20',
  },

  // Brand Strategy Alignment (proj-5)
  {
    id: 'tsk-501',
    title: 'Competitive landscape benchmark deck',
    description: 'Analyze 5 direct competitors and document differentiation opportunities.',
    projectId: 'proj-5',
    dueDate: '2026-10-05',
    priority: 'MEDIUM',
    status: 'COMPLETED',
    createdAt: '2026-09-16',
    completedAt: '2026-10-04',
  },
  {
    id: 'tsk-502',
    title: 'Executive pitch tone-of-voice guide',
    description: 'Finalize vocabulary guidelines for series A press release.',
    projectId: 'proj-5',
    dueDate: '2026-10-14',
    priority: 'HIGH',
    status: 'COMPLETED',
    createdAt: '2026-09-20',
    completedAt: '2026-10-14',
  },

  // Q4 Investor Pitch Deck (proj-6)
  {
    id: 'tsk-601',
    title: 'Fund performance charts & financial model',
    description: 'Format IRR, MOIC and portfolio valuation multiples into presentation tables.',
    projectId: 'proj-6',
    dueDate: '2026-10-25',
    priority: 'HIGH',
    status: 'COMPLETED',
    createdAt: '2026-10-11',
    completedAt: '2026-10-25',
  },
  {
    id: 'tsk-602',
    title: 'Partner review and slide deck delivery',
    description: 'Export PDF vector deck and present key narrative to managing directors.',
    projectId: 'proj-6',
    dueDate: '2026-11-01',
    priority: 'HIGH',
    status: 'COMPLETED',
    createdAt: '2026-10-18',
    completedAt: '2026-11-01',
  },
];

