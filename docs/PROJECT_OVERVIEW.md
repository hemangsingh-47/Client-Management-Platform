# FreelanceHub — Project Overview

## 1. Project Purpose
FreelanceHub is a dedicated, production-minded web application engineered for independent freelance professionals, agency owners, and digital consultants. It provides an all-in-one business management platform to manage client relationships, track project progress, organize deliverable assets, monitor tasks and milestones, record payments, and analyze financial performance.

---

## 2. Problem Statement
Freelancers and solo practitioners routinely manage their business operations across disparate tools:
- Spreadsheets for tracking payments and budgets.
- Messaging apps and email threads for client communications.
- Ad-hoc to-do apps for deadline reminders.
- Cloud storage links scattered across text files.

This fragmented workflow leads to:
1. **Financial Discrepancies:** Rounding errors, forgotten invoices, and uncollected outstanding balances.
2. **Missed Deadlines:** Incomplete visibility into upcoming milestones and overdue tasks.
3. **Client Friction:** Lack of structured deliverable handovers and approval records.
4. **Data Loss:** Accidental deletion of client history or projects with linked payment logs.

FreelanceHub solves these issues by establishing a centralized, relational system with strict business constraints and ACID transaction guarantees.

---

## 3. Target Audience
- **Freelance Software Engineers:** Managing multiple client retainers, sprint milestones, and code deliveries.
- **UI/UX & Product Designers:** Delivering Figma prototypes, design systems, and visual assets for client review.
- **Digital Marketers & Content Creators:** Tracking campaign milestones, deliverables, and retainers.
- **Small Creative Studios:** Managing shared clients, project budgets, and revenue reporting.

---

## 4. Core Features & Business Modules

### A. Client Management
- Structured client profiles with corporate details, direct contact lines, notes, and active status indicators.
- Real-time client rollups: Total projects count, total payments received, and outstanding balance.
- Relational conflict prevention: Clients with active projects cannot be accidentally deleted (`409 Conflict`).

### B. Project Management Workspace
- Support for List View and Grid View layouts.
- Budget allocation, sprint progress slider (0–100%), priority levels (`LOW`, `MEDIUM`, `HIGH`), and status lifecycle (`PLANNING`, `IN_PROGRESS`, `ON_HOLD`, `COMPLETED`, `CANCELLED`).
- Financial integrity protection: Projects with existing payment logs cannot be deleted without clearing audit records.

### C. Tasks & Milestones
- High-level milestones representing major contractual checkpoints and payment release dates.
- Granular actionable to-dos with real-time overdue detection based on local calendar dates.
- Check-to-complete interactive toggling recording exact completion timestamps (`completedAt`).

### D. Deliverable Review & Handover
- Standardized deliverable submissions with version tags and asset type categorization (`FIGMA`, `GITHUB`, `DOCUMENT`, `ARCHIVE`, `EXTERNAL_LINK`).
- Built-in status review actions (`SUBMITTED` $\rightarrow$ `APPROVED` / `REVISION_REQUIRED`).
- Protocol-validated external URLs ensuring safe client link handovers.

### E. Decimal-Safe Payments Ledger
- Strict accounting formula:
  $$\text{Total Paid} = \sum \text{Completed Payments}$$
  $$\text{Outstanding Balance} = \max(0, \text{Project Budget} - \text{Total Paid})$$
- Elimination of IEEE-754 binary floating-point rounding errors through PostgreSQL `Decimal(12, 2)` and `Prisma.Decimal`.
- Accidental overpayment prevention: Payments exceeding remaining project balances are automatically rejected.

### F. Executive Dashboard & Financial Reports
- Real-time KPI summaries: Paid this month, outstanding receivables, active projects, and overdue tasks.
- 6-month monthly revenue SVG bar chart.
- Dynamic filtering by date range, client, and project status.
- Standardized CSV data export for accounting and tax reconciliation.
