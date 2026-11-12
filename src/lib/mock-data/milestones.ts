/**
 * FreelanceHub — Phase 7 Project Milestones Centralized Mock Data
 */

import { Milestone } from '@/types/milestone';

export const INITIAL_MILESTONES: Milestone[] = [
  // Website Redesign (proj-1)
  {
    id: 'mls-101',
    title: 'Milestone 1 — Discovery & Wireframe Sign-off',
    description: 'Information architecture approved by Acme Studio stakeholders.',
    projectId: 'proj-1',
    dueDate: '2026-10-30',
    status: 'COMPLETED',
    completedAt: '2026-10-28',
    createdAt: '2026-10-18',
  },
  {
    id: 'mls-102',
    title: 'Milestone 2 — Design System & Staging Prototype',
    description: 'Component library built and responsive layouts deployed to staging.',
    projectId: 'proj-1',
    dueDate: '2026-11-10',
    status: 'COMPLETED',
    completedAt: '2026-11-09',
    createdAt: '2026-10-18',
  },
  {
    id: 'mls-103',
    title: 'Milestone 3 — Production Launch & Domain Handover',
    description: 'Vercel production deployment, SSL verification, and client training.',
    projectId: 'proj-1',
    dueDate: '2026-11-18',
    status: 'IN_PROGRESS',
    createdAt: '2026-10-18',
  },

  // Mobile App UI (proj-2)
  {
    id: 'mls-201',
    title: 'Milestone 1 — UX Foundations & User Flows',
    description: 'Complete patient and doctor journey maps with edge case handling.',
    projectId: 'proj-2',
    dueDate: '2026-11-05',
    status: 'COMPLETED',
    completedAt: '2026-11-04',
    createdAt: '2026-10-25',
  },
  {
    id: 'mls-202',
    title: 'Milestone 2 — High-Fidelity UI Screens',
    description: 'All 42 healthcare application screens designed in Figma with dark theme.',
    projectId: 'proj-2',
    dueDate: '2026-11-18',
    status: 'IN_PROGRESS',
    createdAt: '2026-10-25',
  },
  {
    id: 'mls-203',
    title: 'Milestone 3 — Design Handoff & Developer Specs',
    description: 'Complete Figma Dev Mode inspection tokens and React Native export.',
    projectId: 'proj-2',
    dueDate: '2026-11-24',
    status: 'PENDING',
    createdAt: '2026-10-25',
  },

  // Brand Identity (proj-3)
  {
    id: 'mls-301',
    title: 'Milestone 1 — Identity Exploration & Concepts',
    description: 'Presentation of three visual territories and initial logomarks.',
    projectId: 'proj-3',
    dueDate: '2026-11-15',
    status: 'IN_PROGRESS',
    createdAt: '2026-11-01',
  },
  {
    id: 'mls-302',
    title: 'Milestone 2 — Brand Guidelines Book & Collateral',
    description: 'Export of 60-page PDF brand guidelines, stationery, and social kits.',
    projectId: 'proj-3',
    dueDate: '2026-11-29',
    status: 'PENDING',
    createdAt: '2026-11-01',
  },

  // E-commerce Platform (proj-4)
  {
    id: 'mls-401',
    title: 'Milestone 1 — Catalog Architecture & Cart',
    description: 'Product listing pages, category filtering, and drawer shopping cart.',
    projectId: 'proj-4',
    dueDate: '2026-11-01',
    status: 'COMPLETED',
    completedAt: '2026-10-31',
    createdAt: '2026-08-10',
  },
  {
    id: 'mls-402',
    title: 'Milestone 2 — Payment Gateway & Order Dashboard',
    description: 'Razorpay integration and merchant fulfillment backend.',
    projectId: 'proj-4',
    dueDate: '2026-12-12',
    status: 'PENDING',
    createdAt: '2026-08-10',
  },

  // Brand Strategy Alignment (proj-5)
  {
    id: 'mls-501',
    title: 'Milestone 1 — Strategy Deck & Handover',
    description: 'Full market positioning and tone-of-voice documentation.',
    projectId: 'proj-5',
    dueDate: '2026-10-15',
    status: 'COMPLETED',
    completedAt: '2026-10-15',
    createdAt: '2026-09-15',
  },

  // Q4 Investor Pitch Deck (proj-6)
  {
    id: 'mls-601',
    title: 'Milestone 1 — Final Investor Presentation',
    description: 'Sign-off on 30-slide pitch presentation and asset package.',
    projectId: 'proj-6',
    dueDate: '2026-11-02',
    status: 'COMPLETED',
    completedAt: '2026-11-02',
    createdAt: '2026-10-10',
  },

  // Portfolio Founder Report (proj-7)
  {
    id: 'mls-701',
    title: 'Milestone 1 — Report Compilation & Cloud Upload',
    description: '24 founder case studies formatted and delivered to partner portal.',
    projectId: 'proj-7',
    dueDate: '2026-09-28',
    status: 'COMPLETED',
    completedAt: '2026-09-28',
    createdAt: '2026-09-01',
  },
];

