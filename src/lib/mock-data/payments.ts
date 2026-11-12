/**
 * FreelanceHub — Phase 9 Payment Tracking Centralized Mock Data
 */

import { Payment } from '@/types/payment';

export const INITIAL_PAYMENTS: Payment[] = [
  // Website Redesign (proj-1, cli-1)
  {
    id: 'pay-101',
    projectId: 'proj-1',
    clientId: 'cli-1',
    amount: 15000,
    paymentDate: '2026-10-18',
    paymentMethod: 'Bank Transfer',
    reference: 'NEFT-20261018-0941',
    status: 'Completed',
    notes: 'Initial 33% commencement advance.',
    createdAt: '2026-10-18',
  },
  {
    id: 'pay-102',
    projectId: 'proj-1',
    clientId: 'cli-1',
    amount: 15000,
    paymentDate: '2026-11-01',
    paymentMethod: 'Bank Transfer',
    reference: 'NEFT-20261101-4412',
    status: 'Completed',
    notes: 'Milestone 2 design approval settlement.',
    createdAt: '2026-11-01',
  },
  {
    id: 'pay-103',
    projectId: 'proj-1',
    clientId: 'cli-1',
    amount: 15000,
    paymentDate: '2026-11-18',
    paymentMethod: 'Bank Transfer',
    reference: 'INV-2026-003',
    status: 'Pending',
    notes: 'Final milestone invoice due upon production launch.',
    createdAt: '2026-11-01',
  },

  // Mobile App UI (proj-2, cli-2)
  {
    id: 'pay-201',
    projectId: 'proj-2',
    clientId: 'cli-2',
    amount: 45000,
    paymentDate: '2026-10-25',
    paymentMethod: 'Bank Transfer',
    reference: 'HDFC-IMPS-887192',
    status: 'Completed',
    notes: 'Milestone 1 — UX foundations deposit.',
    createdAt: '2026-10-25',
  },
  {
    id: 'pay-202',
    projectId: 'proj-2',
    clientId: 'cli-2',
    amount: 35000,
    paymentDate: '2026-11-24',
    paymentMethod: 'Bank Transfer',
    reference: 'INV-2026-005',
    status: 'Pending',
    notes: 'Milestone 2 handoff payment.',
    createdAt: '2026-10-25',
  },

  // Brand Identity (proj-3, cli-3)
  {
    id: 'pay-301',
    projectId: 'proj-3',
    clientId: 'cli-3',
    amount: 15000,
    paymentDate: '2026-10-18',
    paymentMethod: 'UPI',
    reference: 'UPI/20261018/901238',
    status: 'Completed',
    notes: '50% initial exploration retainer.',
    createdAt: '2026-10-18',
  },
  {
    id: 'pay-302',
    projectId: 'proj-3',
    clientId: 'cli-3',
    amount: 15000,
    paymentDate: '2026-11-29',
    paymentMethod: 'UPI',
    reference: 'INV-2026-008',
    status: 'Pending',
    notes: 'Brand guidelines & font licensing handover invoice.',
    createdAt: '2026-11-01',
  },

  // E-commerce Platform (proj-4, cli-4)
  {
    id: 'pay-401',
    projectId: 'proj-4',
    clientId: 'cli-4',
    amount: 60000,
    paymentDate: '2026-08-10',
    paymentMethod: 'Bank Transfer',
    reference: 'ICICI-NEFT-90918',
    status: 'Completed',
    notes: 'Phase 1 product catalog and storefront architecture.',
    createdAt: '2026-08-10',
  },
  {
    id: 'pay-402',
    projectId: 'proj-4',
    clientId: 'cli-4',
    amount: 60000,
    paymentDate: '2026-12-12',
    paymentMethod: 'Bank Transfer',
    reference: 'INV-2026-002',
    status: 'Pending',
    notes: 'Payment gateway integration & production deployment (paused on client side).',
    createdAt: '2026-08-10',
  },

  // Brand Strategy Alignment (proj-5, cli-1)
  {
    id: 'pay-501',
    projectId: 'proj-5',
    clientId: 'cli-1',
    amount: 30000,
    paymentDate: '2026-10-15',
    paymentMethod: 'UPI',
    reference: 'UPI/20261015/441908',
    status: 'Completed',
    notes: 'Full payment upon Series A positioning deck delivery.',
    createdAt: '2026-09-15',
  },

  // Q4 Investor Pitch Deck (proj-6, cli-5)
  {
    id: 'pay-601',
    projectId: 'proj-6',
    clientId: 'cli-5',
    amount: 50000,
    paymentDate: '2026-11-02',
    paymentMethod: 'Bank Transfer',
    reference: 'KOTAK-RTGS-55120',
    status: 'Completed',
    notes: 'Full settlement upon partner sign-off.',
    createdAt: '2026-10-10',
  },

  // Portfolio Founder Report (proj-7, cli-5)
  {
    id: 'pay-701',
    projectId: 'proj-7',
    clientId: 'cli-5',
    amount: 35000,
    paymentDate: '2026-09-28',
    paymentMethod: 'Bank Transfer',
    reference: 'HDFC-NEFT-309182',
    status: 'Completed',
    notes: 'Settled in full via corporate net banking.',
    createdAt: '2026-09-01',
  },
];

