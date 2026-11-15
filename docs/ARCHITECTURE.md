# FreelanceHub — Architecture & System Design

## 1. Architectural Overview

FreelanceHub is structured as a **Full-Stack Monorepo** using the **Next.js 16 App Router**. It implements a clean **3-Tier Enterprise Pattern** ensuring strict separation of concerns, testability, and type safety from the UI down to the database.

```text
┌────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                   │
│  React 19 Server/Client Components + Tailwind CSS v4   │
│  AppContext (Global State & Live API Re-sync)          │
└───────────────────────────┬────────────────────────────┘
                            │ Type-Safe HTTP / JSON
                            ▼
┌────────────────────────────────────────────────────────┐
│                   API ROUTE HANDLERS                   │
│  src/app/api/* (NextRequest / NextResponse)            │
│  Zod Schema Validation & Input Sanitization            │
└───────────────────────────┬────────────────────────────┘
                            │ Domain Transfer Objects
                            ▼
┌────────────────────────────────────────────────────────┐
│                  DOMAIN SERVICE LAYER                  │
│  src/lib/services/* (Business Logic & Constraints)     │
│  Decimal Financial Calculator & Safe Conflict Checks   │
└───────────────────────────┬────────────────────────────┘
                            │ Entity Queries
                            ▼
┌────────────────────────────────────────────────────────┐
│                 DATA REPOSITORY LAYER                  │
│  src/lib/repositories/* (Prisma ORM Queries)           │
│  Index Optimizations & Aggregations                    │
└───────────────────────────┬────────────────────────────┘
                            │ Parameterized SQL
                            ▼
┌────────────────────────────────────────────────────────┐
│                   PERSISTENCE LAYER                    │
│  PostgreSQL 18 Database (ACID Relational Engine)       │
└────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Layer (`src/components/`, `src/app/(app)/`)

- **Server vs. Client Boundaries:** Heavy analytical calculations and static shells are rendered on the server, while dynamic forms, modals, filter bars, and interactive toggles use client components (`'use client'`).
- **AppContext (`src/context/app-context.tsx`):**
  - Serves as the central state coordinator.
  - Maintains live in-memory state of clients, projects, tasks, deliverables, and payments.
  - Exposes an idempotent `refreshData()` function that pulls fresh data from backend APIs after any write mutation.
- **Centralized API Client (`src/lib/api/*`):**
  - Wraps native `fetch` with standard headers, query string serialization, and structured `ApiClientError` throwing.
  - Completely decouples UI components from HTTP details.

---

## 3. API Layer (`src/app/api/`)

- Built using Next.js Route Handlers (`route.ts`).
- **Zod Validation:** Every incoming `POST` or `PATCH` request body is parsed against a strict Zod schema before hitting the business layer.
- **Preprocessed Enums:** Incoming strings are normalized using `z.preprocess()` (e.g. converting `In Progress` or `in_progress` to uppercase enum `IN_PROGRESS`).
- **Standardized Response Envelopes:**
  - Success: `{ success: true, message: string, data: T }`
  - Failure: `{ success: false, message: string, errors?: Record<string, string[]> }`

---

## 4. Domain Service Layer (`src/lib/services/`)

- Houses all core business rules and constraint validations:
  - **`ClientService`:** Enforces duplicate email prevention and blocks deletion if projects exist (`409 Conflict`).
  - **`ProjectService`:** Validates client existence, enforces start-date $\le$ deadline, and blocks deletion if payments exist (`409 Conflict`).
  - **`PaymentService`:** Enforces overpayment limits and records audit activity logs.
  - **`TaskService`:** Sets or clears `completedAt` timestamps on status toggle.
  - **`DashboardService` & `ReportService`:** Runs parallel aggregations using `Promise.all()` for high throughput.

---

## 5. Repository Layer (`src/lib/repositories/`)

- Directly interacts with Prisma ORM (`prisma.<model>`).
- Implements:
  - Selective column projection (`select: { id: true, title: true }`) to minimize memory footprint.
  - Filter and pagination translations (`skip`, `take`, `orderBy`).
  - Aggregations (`_sum.amount`, `_count.projects`).

---

## 6. Persistence Layer (PostgreSQL & Prisma)

- **ACID Compliance:** Ensures zero phantom reads or orphan records.
- **Referential Integrity:**
  - `Client` $\rightarrow$ `Project`: `onDelete: Restrict`
  - `Project` $\rightarrow$ `Payment`: `onDelete: Restrict`
  - `Project` $\rightarrow$ `Task` / `Milestone` / `Deliverable`: `onDelete: Cascade`
- **Decimal Precision:** Financial values stored as `DECIMAL(12, 2)` to eliminate floating-point inaccuracies.
