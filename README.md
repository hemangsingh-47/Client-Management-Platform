# FreelanceHub

> Professional freelancer project and client management platform inspired by [Bonsai](https://www.hellobonsai.com/).

[![Next.js](https://img.shields.io/badge/Next.js-16.4.5-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178c6)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## Roadmap Scope: Phases 1, 2, 3 & 4

This repository implements the first 4 phases of the 15-phase FreelanceHub roadmap:

- **Phase 1: Project Setup & Foundation**: Verified Next.js App Router, React 19, TypeScript 5, Tailwind CSS v4, Lucide React icons, scalable folder architecture, zero build/lint errors.
- **Phase 2: Professional Design System & Theme**: Minimal, structured, business-focused visual identity using a signature **Forest Green** palette, full light and dark mode support with zero FOUC, typography scale, 4px spacing unit, 8px/12px border radii, and 16 reusable UI primitives.
- **Phase 3: Main Application Layout**: Complete production-grade application shell consisting of desktop collapsible sidebar, mobile drawer navigation, top header with global search (⌘K shortcut), sample notifications flyout, theme toggle, user profile menu, and responsive content area.
- **Phase 4: Dashboard UI Development**: Comprehensive freelancer business overview at `/dashboard`, featuring 4 KPI metric blocks, an active projects table with progress indicators and INR currency formatting, an interactive upcoming tasks list, a responsive SVG earnings chart with date-range filters, and a recent activity stream.

---

## Phase 4 Dashboard Architecture (`src/components/dashboard`)

```text
----------------------------------------------------
Header: Overview               Date | New Project
----------------------------------------------------

Paid This Month | Outstanding | Active | Due Soon

----------------------------------------------------
Active Projects Table (65%)          Upcoming Tasks (35%)

----------------------------------------------------
Earnings Overview (65%)              Recent Activity (35%)

----------------------------------------------------
```

1. **Dashboard Header (`dashboard-header.tsx`)**:
   - Page title ("Overview"), subtitle ("Here's what's happening with your freelance business.").
   - Current date badge with calendar icon.
   - Date range selector ("This Month", "Last 30 Days", "This Quarter", "Year to Date").
   - Primary action `+ New Project` button opening a modal dialog (clearly marked as a UI shell demonstration).
2. **Business Overview KPIs (`kpi-section.tsx`)**:
   - **Paid This Month**: Total payments received during current month formatted in INR (`₹85,000`), with comparison badge (`+12.5% vs last month`).
   - **Outstanding Payments**: Total unpaid balance (`₹1,20,000`) with invoice count note (`Across 2 milestone invoices`).
   - **Active Projects**: Total count (`4 Active`), with secondary breakdown (`1 on hold • 1 planning`).
   - **Tasks Due Soon**: Incomplete tasks due in next 7 days (`4 This week`), with overdue alert badge (`1 Overdue`).
3. **Active Projects Table (`active-projects-table.tsx`)**:
   - Table columns: Project, Client, Status (semantic badges), Deadline, Progress bar (reflecting percentage), and Budget (`₹45,000`, `₹80,000`, `₹30,000`, `₹1,20,000`).
   - Row hover effects, empty state handling, and "View all" link to `/projects`.
4. **Upcoming Tasks List (`upcoming-tasks-list.tsx`)**:
   - Interactive visual completion checkboxes with local state toggle and strikethrough styling.
   - Task title, related project name, due date indicator (`Today`, `Tomorrow`, `20 Nov`), and priority badges (`High`, `Medium`, `Low`).
5. **Earnings Overview Chart (`earnings-chart.tsx`)**:
   - Responsive SVG bar chart with date-range filtering (`Last 6M`, `2026`, `Last 12M`).
   - Dynamic bar height scaling, reference gridlines, and hover tooltips showing month and amount.
   - Total received calculation (`formatINR`), average monthly revenue indicator.
6. **Recent Activity Feed (`recent-activity-feed.tsx`)**:
   - Compact audit log with Lucide icons (`CreditCard`, `CheckCircle2`, `FolderPlus`, `FileCheck`, `Calendar`), relative timestamps, and project/client context.
7. **Centralized Typed Mock Data (`src/lib/mock-data/dashboard.ts`)**:
   - Centralizes all KPI records, active projects, tasks, earnings ranges, and activity events with full TypeScript interfaces.

---

## Design System: Forest Green Foundation

| Token | Hex Value | Usage |
|---|---|---|
| **Forest Green** | `#173F35` | Brand identity & primary badge |
| **Primary Green** | `#287A58` | Primary call-to-actions & focus rings |
| **Muted Sage** | `#A8C8B2` | Soft highlights & secondary accents |
| **Warm Background** | `#F4F6F1` | Canvas background in light mode |
| **White** | `#FFFFFF` | Surfaces & cards in light mode |
| **Charcoal** | `#252B28` | Primary text |
| **Secondary Text** | `#68736C` | Supporting text & captions |
| **Border** | `#E2E8E2` | Thin dividers, inputs & panel borders |

---

## Verification Commands

1. **Check TypeScript**:
   ```bash
   npx tsc --noEmit
   ```

2. **Run ESLint**:
   ```bash
   npm run lint
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Start local server**:
   ```bash
   npm run dev
   ```
