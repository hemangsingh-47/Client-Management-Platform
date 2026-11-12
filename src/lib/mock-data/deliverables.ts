/**
 * FreelanceHub — Phase 8 Deliverables Management Centralized Mock Data
 */

import { Deliverable } from '@/types/deliverable';

export const INITIAL_DELIVERABLES: Deliverable[] = [
  // Website Redesign (proj-1)
  {
    id: 'del-101',
    title: 'Design System & Figma Component Library',
    projectId: 'proj-1',
    description: 'Auto-layout design tokens, typography styles, button variants, and navigation bars.',
    submissionDate: '2026-11-02',
    status: 'APPROVED',
    attachmentType: 'Figma',
    attachmentUrl: 'https://figma.com/@freelancehub/acme-design-system',
    version: 'v1.4',
    notes: 'Approved without changes by John Carter.',
    createdAt: '2026-10-25',
    activity: [
      {
        id: 'act-1',
        timestamp: '02 Nov 2026, 4:30 PM',
        action: 'Status updated to Approved',
        note: 'Client verified design tokens in Figma Dev Mode.',
      },
      {
        id: 'act-2',
        timestamp: '31 Oct 2026, 11:15 AM',
        action: 'Submitted for Review',
        note: 'v1.4 prototype link sent via email.',
      },
      {
        id: 'act-3',
        timestamp: '25 Oct 2026, 10:00 AM',
        action: 'Deliverable created',
      },
    ],
  },
  {
    id: 'del-102',
    title: 'Marketing Landing Page Staging Deployment',
    projectId: 'proj-1',
    description: 'Fully responsive Next.js frontend deployed to Vercel preview branch with lead capture form.',
    submissionDate: '2026-11-09',
    status: 'SUBMITTED',
    attachmentType: 'External Link',
    attachmentUrl: 'https://staging.acmestudio-redesign.preview',
    version: 'v2.0-rc',
    notes: 'Awaiting feedback from marketing director regarding hero copy.',
    createdAt: '2026-11-01',
    activity: [
      {
        id: 'act-4',
        timestamp: '09 Nov 2026, 6:00 PM',
        action: 'Submitted for Review',
        note: 'Staging preview build deployed successfully.',
      },
      {
        id: 'act-5',
        timestamp: '01 Nov 2026, 2:00 PM',
        action: 'Deliverable created',
      },
    ],
  },

  // Mobile App UI (proj-2)
  {
    id: 'del-201',
    title: 'Healthcare App User Flow & Wireframes',
    projectId: 'proj-2',
    description: 'Low-fidelity wireframe flows for tele-consultation booking and vitals reporting.',
    submissionDate: '2026-10-28',
    status: 'APPROVED',
    attachmentType: 'Figma',
    attachmentUrl: 'https://figma.com/@freelancehub/northstar-wireframes',
    version: 'v1.0',
    notes: 'Approved on sprint review call.',
    createdAt: '2026-10-25',
    activity: [
      {
        id: 'act-6',
        timestamp: '28 Oct 2026, 5:00 PM',
        action: 'Status updated to Approved',
      },
      {
        id: 'act-7',
        timestamp: '25 Oct 2026, 11:30 AM',
        action: 'Deliverable created',
      },
    ],
  },
  {
    id: 'del-202',
    title: 'Interactive Patient Dashboard Prototype',
    projectId: 'proj-2',
    description: 'High-fidelity Figma clickable prototype showcasing biometric authentication and daily health logs.',
    submissionDate: '2026-11-08',
    status: 'REVISION_REQUIRED',
    attachmentType: 'Figma',
    attachmentUrl: 'https://figma.com/@freelancehub/northstar-prototype-v08',
    version: 'v0.8',
    notes: 'Client requested larger tap targets for elderly users in vitals entry screen.',
    createdAt: '2026-11-02',
    activity: [
      {
        id: 'act-8',
        timestamp: '10 Nov 2026, 11:45 AM',
        action: 'Revision Requested by Client',
        note: 'Increase CTA button height to 48px minimum on vitals submission modal.',
      },
      {
        id: 'act-9',
        timestamp: '08 Nov 2026, 3:30 PM',
        action: 'Submitted for Review',
      },
      {
        id: 'act-10',
        timestamp: '02 Nov 2026, 9:00 AM',
        action: 'Deliverable created',
      },
    ],
  },

  // Brand Identity (proj-3)
  {
    id: 'del-301',
    title: 'Brand Territory & Moodboard Deck',
    projectId: 'proj-3',
    description: 'Curated PDF deck presenting typography samples, photography guidelines, and aesthetic directions.',
    submissionDate: '2026-11-06',
    status: 'SUBMITTED',
    attachmentType: 'Document',
    attachmentUrl: 'https://drive.google.com/file/d/studio-eleven-moodboard.pdf',
    version: 'v1.0',
    notes: 'Presented during initial discovery workshop.',
    createdAt: '2026-11-01',
    activity: [
      {
        id: 'act-11',
        timestamp: '06 Nov 2026, 10:00 AM',
        action: 'Submitted for Review',
      },
      {
        id: 'act-12',
        timestamp: '01 Nov 2026, 12:00 PM',
        action: 'Deliverable created',
      },
    ],
  },

  // E-commerce Platform (proj-4)
  {
    id: 'del-401',
    title: 'Product Catalog & Razorpay Checkout Specs',
    projectId: 'proj-4',
    description: 'Technical API documentation for merchant payment gateway webhooks and cart payload schema.',
    submissionDate: '2026-11-10',
    status: 'PENDING',
    attachmentType: 'GitHub',
    attachmentUrl: 'https://github.com/freelancehub/urbancart-storefront',
    version: 'v0.5',
    notes: 'Work on hold pending client merchant GSTIN verification.',
    createdAt: '2026-10-15',
    activity: [
      {
        id: 'act-13',
        timestamp: '15 Oct 2026, 4:00 PM',
        action: 'Deliverable created',
      },
    ],
  },

  // Brand Strategy Alignment (proj-5)
  {
    id: 'del-501',
    title: 'Executive Brand Positioning Guidelines',
    projectId: 'proj-5',
    description: 'Comprehensive 40-page strategy document delivered in vector PDF and Notion wiki formats.',
    submissionDate: '2026-10-15',
    status: 'APPROVED',
    attachmentType: 'Document',
    attachmentUrl: 'https://notion.so/acmestudio/brand-strategy-handover',
    version: 'v1.0-final',
    notes: 'Final handover delivered and signed off.',
    createdAt: '2026-09-15',
    activity: [
      {
        id: 'act-14',
        timestamp: '15 Oct 2026, 5:30 PM',
        action: 'Status updated to Approved',
      },
    ],
  },

  // Q4 Investor Pitch Deck (proj-6)
  {
    id: 'del-601',
    title: 'Q4 Investor Pitch Deck Presentation',
    projectId: 'proj-6',
    description: 'Keynote and Figma slides with vector SVG charts highlighting portfolio fund metrics.',
    submissionDate: '2026-11-02',
    status: 'APPROVED',
    attachmentType: 'Archive',
    attachmentUrl: 'https://apexventures.fund/deliverables/q4-deck-export.zip',
    version: 'v3.2',
    notes: 'Final presentation delivered and presented to LPs.',
    createdAt: '2026-10-10',
    activity: [
      {
        id: 'act-15',
        timestamp: '02 Nov 2026, 2:15 PM',
        action: 'Status updated to Approved',
      },
    ],
  },
];

