<div align="center">

# 🌿 FreelanceHub

### Professional Freelancer Client & Project Management Platform

*A modern, full-stack business suite inspired by [Bonsai](https://www.hellobonsai.com/), built for independent consultants, digital agencies, and software freelancers.*

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16.4.5-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-20232a?style=for-the-badge&logo=react&logoColor=61dafb)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-007acc?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19.3-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tests](https://img.shields.io/badge/Automated_Tests-73_Passing-287A58?style=for-the-badge&logo=github-actions&logoColor=white)](tests/)
[![License](https://img.shields.io/badge/License-MIT-173F35?style=for-the-badge)](LICENSE)

<br/>

[Key Features](#-key-features) •
[Architecture](#-system-architecture) •
[Financial Accuracy](#-financial-integrity--precision) •
[Local Quickstart](#-local-quickstart-guide) •
[Testing Matrix](#-testing--quality-assurance) •
[Deployment](#-production-deployment) •
[Academic Viva Info](#-academic-project-information)

</div>

---

## 📌 Problem & Solution

| The Traditional Freelance Problem | The FreelanceHub Solution |
| :--- | :--- |
| **Scattered Business Data:** Client contacts in emails, tasks in to-do apps, and payments in manual spreadsheets. | **Centralized Workspace:** Unified management of clients, projects, sprint tasks, deliverables, and ledger transactions. |
| **Penny-Rounding Financial Bugs:** Floating-point arithmetic (`0.1 + 0.2 = 0.30000000000000004`) causes billing discrepancies. | **Decimal-Safe Precision:** PostgreSQL `DECIMAL(12, 2)` & `Prisma.Decimal` ensure exact transaction calculations. |
| **Accidental Data Loss:** Deleting a client accidentally wipes out project history or revenue records. | **Relational 409 Conflict Protection:** Deletion blocks protect clients with active projects and projects with payment logs. |
| **Disorganized Deliverables:** Handover links lost in chat threads with zero version tracking or status approvals. | **Structured Handover Hub:** Version-tagged submissions with secure URL validation and review workflows. |

---

## ✨ Key Features

### 1. 👥 Client Relationship Management (`/clients`, `/clients/[id]`)
- **Complete Profiles:** Store corporate name, email, phone, billing address, and private notes.
- **Dynamic Metrics:** Live calculation of total projects count, revenue collected, and pending balance.
- **Relational Integrity:** Conflict prevention prevents deleting clients with existing projects (`409 Conflict`).

### 2. 📁 Project Management Workspace (`/projects`, `/projects/[id]`)
- **View Switcher:** Seamless toggle between structured List View and visual Grid Card layout.
- **Sprint Management:** Priority levels (`LOW`, `MEDIUM`, `HIGH`), progress slider (0–100%), and milestone timelines.
- **Audit Protection:** Projects with attached payment records cannot be deleted without settling accounts.

### 3. ✅ Tasks & Milestones Tracking (`/tasks`)
- **Interactive Check-to-Complete:** Marking tasks completed records exact completion timestamps (`completedAt`).
- **Real-Time Overdue Detection:** Dynamically detects past due tasks against current calendar dates.
- **Milestone Checkpoints:** Contractual payment delivery milestones linked directly to projects.

### 4. 📦 Deliverable Submissions (`/deliverables`)
- **Asset Handover:** Categorization by `FIGMA`, `GITHUB`, `DOCUMENT`, `ARCHIVE`, or `EXTERNAL_LINK`.
- **Review Lifecycle:** Client-friendly action controls (`SUBMITTED` $\rightarrow$ `APPROVED` / `REVISION_REQUIRED`).
- **Secure Link Validation:** Server-side protocol enforcement ensuring safe `http://` and `https://` URLs.

### 5. 💳 Payments Ledger & Receipts (`/payments`)
- **Strict Accounting Formula:** 
  $$\text{Total Paid} = \sum_{\text{status} = \text{'COMPLETED'}} \text{Payment.amount}$$
  $$\text{Outstanding Balance} = \max(0, \text{Project Budget} - \text{Total Paid})$$
- **Overpayment Prevention:** Automatically rejects payments exceeding remaining project balance.
- **Printable Receipts:** Modal receipts with transaction IDs, INR currency formatting (`formatINR`), and date stamps.

### 6. 📊 Executive Dashboard & Analytics (`/dashboard`, `/reports`)
- **Real-Time KPIs:** Paid this month, outstanding receivables, active projects, and overdue tasks.
- **Interactive Monthly Revenue Chart:** 6-month historical monthly revenue bar chart rendered in responsive SVG.
- **Audit Activity Feed:** Chronological business event stream tracking client additions and payment settlements.
- **Reports & CSV Export:** Date-range and client-filtered financial reports with one-click CSV download.

---

## 🏛️ System Architecture

FreelanceHub implements an enterprise-grade **3-Tier Monorepo Pattern** using Next.js 16 App Router:

```mermaid
flowchart TD
    subgraph Browser ["Frontend Presentation Layer (React 19)"]
        UI["Bonsai-Inspired UI / Pages"]
        Context["AppContext (Live State & Re-sync)"]
        APIClient["Centralized API Client (src/lib/api/*)"]
    end

    subgraph Server ["Next.js Server Layer (app/api/*)"]
        Routes["REST Route Handlers"]
        Zod["Zod Validation & Enum Preprocessing"]
        Services["Domain Services (Business Logic)"]
        Repos["Data Repositories (Prisma Queries)"]
    end

    subgraph Database ["Persistence Layer (ACID Relational)"]
        Prisma["Prisma ORM (v6.19.3)"]
        Postgres[("PostgreSQL 18 Database")]
    end

    UI --> Context
    Context --> APIClient
    APIClient -->|JSON Request| Routes
    Routes --> Zod
    Zod --> Services
    Services --> Repos
    Repos --> Prisma
    Prisma -->|Parameterized SQL| Postgres
    Postgres -->|ACID Response| Prisma
    Prisma --> Repos
    Repos --> Services
    Services --> Routes
    Routes -->|Standardized JSON| APIClient
    APIClient --> Context
    Context --> UI
```

---

## 💰 Financial Integrity & Precision

FreelanceHub treats business calculations with bank-grade rigor:

1. **Zero Binary Rounding Errors:** IEEE-754 floating-point arithmetic (where `0.1 + 0.2 === 0.30000000000000004`) is strictly forbidden for financial calculations. All monetary fields utilize PostgreSQL `DECIMAL(12, 2)` and `Prisma.Decimal`.
2. **Revenue Recognition Rule:** Only transactions with status `COMPLETED` contribute to `Total Paid` and reduce `Outstanding Balance`. Transactions marked `PENDING` or `FAILED` are recorded for audit purposes but never inflate recognized revenue.
3. **Accidental Overpayment Prevention:** When recording a payment or editing an existing transaction, the domain service verifies:
   $$\text{Payment Amount} \le \text{Remaining Project Balance}$$
   Any payment exceeding the budget triggers a friendly `400 Bad Request` validation response.

---

## 🚀 Local Quickstart Guide

### Prerequisites
- **Node.js:** v18.18+ (Node 20 LTS recommended)
- **npm:** v9+
- **PostgreSQL:** Local PostgreSQL 15+ running on port 5432

### 1. Clone & Install
```bash
git clone https://github.com/hemangsingh-47/Client-Management-Platform.git
cd Client-Management-Platform/client-management-platform
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env` with your PostgreSQL credentials:
```env
DATABASE_URL="postgresql://postgres:admin123@localhost:5432/freelancehub_db?schema=public"
```

### 3. Initialize Database & Seed Sample Data
```bash
# Push schema to local PostgreSQL
npx prisma db push

# Seed realistic development records
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧪 Testing & Quality Assurance

FreelanceHub includes a 73-test automated quality assurance suite covering unit, integration, route handler, and multi-step lifecycle scenarios:

```bash
# Run All 73 Automated Tests
npm test
```

### Test Coverage Breakdown

| Suite | File | Tests | Focus Area | Status |
| :--- | :--- | :---: | :--- | :---: |
| **Business Logic & Financial Units** | `tests/business-logic.test.ts` | **25** | Decimal precision, overdue logic, 9 financial scenarios | ✅ PASS |
| **API & Database Integration** | `tests/api-integration-test.ts` | **28** | Live PostgreSQL CRUD, foreign keys, 409 conflict checks | ✅ PASS |
| **HTTP Route Handlers** | `tests/http-route-test.ts` | **9** | Status codes, query pagination, Zod error payloads | ✅ PASS |
| **End-to-End Workflow** | `tests/e2e-workflow.test.ts` | **11** | Full freelancer lifecycle: Client $\rightarrow$ Project $\rightarrow$ Payment | ✅ PASS |
| **Total Automated Tests** | | **73** | **100% Passing Rate** | **100%** |

### Additional Quality Checks
```bash
npx tsc --noEmit        # TypeScript strict compilation (0 errors)
npm run lint            # ESLint static code analysis (0 errors, 0 warnings)
npx prisma validate     # Prisma relational schema verification
npm run build           # Production Turbopack build
```

---

## 🌐 Production Deployment

FreelanceHub is configured for one-click deployment on **Vercel** with a managed serverless database (**Neon** or **Supabase**):

1. **Database:** Create a free project at [Neon.tech](https://neon.tech) and copy the pooled connection string.
2. **Apply Migrations:**
   ```bash
   DATABASE_URL="your-neon-pooled-url" npx prisma migrate deploy
   ```
3. **Deploy on Vercel:**
   - Import `hemangsingh-47/Client-Management-Platform` into [Vercel](https://vercel.com).
   - Keep all **Build and Output Settings** at default (`package.json` includes `postinstall: prisma generate`).
   - Add Environment Variable:
     - `DATABASE_URL` = `your-neon-pooled-url`
   - Click **Deploy**.

---

## 📁 Repository Structure

```text
client-management-platform/
├── docs/                             # In-Depth Technical Documentation
│   ├── ARCHITECTURE.md               # 3-Tier Enterprise Pattern & Data Flow
│   ├── DATABASE.md                   # Relational Schema, Models & Constraints
│   ├── API.md                        # Complete 14 Route Handlers Reference
│   ├── DEPLOYMENT.md                 # Production Vercel & Neon Guide
│   ├── TESTING.md                    # 73-Test QA Matrix & Manual Checklists
│   ├── KNOWN-ISSUES.md               # Scope & Architectural Notes
│   └── PROJECT_OVERVIEW.md           # Business Problem & Feature Scope
├── prisma/
│   ├── schema.prisma                 # Relational PostgreSQL Models & Indexes
│   └── seed.ts                       # Realistic Development Seed Script
├── src/
│   ├── app/                          # Next.js App Router Structure
│   │   ├── (app)/                    # Authenticated Layout Shell
│   │   │   ├── dashboard/page.tsx    # Live Executive KPIs & Charts
│   │   │   ├── clients/              # Client Directory & Profile Routes
│   │   │   ├── projects/             # Projects Directory & Details Routes
│   │   │   ├── tasks/page.tsx        # Tasks & Milestones Board
│   │   │   ├── deliverables/page.tsx # Deliverable Handover Management
│   │   │   ├── payments/page.tsx     # Payment Records & Printable Receipts
│   │   │   ├── reports/page.tsx      # Financial Analytics & CSV Export
│   │   │   └── settings/page.tsx     # Workspace Settings
│   │   └── api/                      # Next.js REST Route Handlers
│   ├── components/                   # Reusable UI & Domain Components
│   ├── context/                      # AppContext (Live API State Sync)
│   ├── lib/                          # API Clients, Domain Services, Repositories
│   └── types/                        # TypeScript Interfaces & Enums
├── tests/                            # Complete Automated Test Suites
├── .env.example                      # Documented Environment Variables Template
├── package.json                      # Dependencies & NPM Scripts
└── README.md                         # Master Documentation
```

---

## 🔮 Roadmap & Future Enhancements

- [ ] **Multi-User Authentication:** NextAuth.js / Clerk authentication with workspace isolation.
- [ ] **Automated PDF Invoicing:** Client invoice PDF generation with direct email dispatch.
- [ ] **Direct Cloud Storage:** AWS S3 / Cloudflare R2 direct multipart file uploads for asset handovers.
- [ ] **Payment Gateway Integration:** Razorpay / Stripe webhook integration for automatic reconciliation.

---

## 🎓 Academic Project Information

- **Project Title:** FreelanceHub — Freelance Client & Project Management Platform
- **Course / Degree:** Bachelor of Technology in Computer Science & Engineering
- **Architecture:** Full-Stack Monorepo (Next.js 16 + TypeScript + PostgreSQL + Prisma ORM)
- **GitHub Repository:** [https://github.com/hemangsingh-47/Client-Management-Platform](https://github.com/hemangsingh-47/Client-Management-Platform)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
