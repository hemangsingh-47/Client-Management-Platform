# FreelanceHub — REST API Specifications

This document defines the complete Next.js Route Handler REST API implemented in FreelanceHub.

All API routes are served under `/api/*` and return standard JSON response envelopes.

---

## 1. Response Envelope Format

### Success Response (`200 OK`, `201 Created`)
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error Response (`400 Bad Request`, `404 Not Found`, `409 Conflict`, `500 Internal Error`)
```json
{
  "success": false,
  "message": "Descriptive error message",
  "errors": {
    "field_name": ["Specific validation error"]
  }
}
```

---

## 2. API Endpoints Directory

### A. Clients API

#### `GET /api/clients`
Retrieves a paginated list of clients with enriched project and financial metrics.
- **Query Params:**
  - `page` (default: `1`): Page number
  - `limit` (default: `30`): Items per page
  - `search`: Filter by name, email, or company
  - `status`: `ACTIVE` | `INACTIVE` | `ALL`
  - `sortBy`: `name` | `createdAt` | `companyName`
  - `sortOrder`: `asc` | `desc`

#### `POST /api/clients`
Creates a new client record.
- **Request Body:**
  ```json
  {
    "name": "Acme Innovations",
    "email": "contact@acme.dev",
    "companyName": "Acme Corp",
    "phone": "+91 98765 43210",
    "address": "Bangalore, India",
    "notes": "Key enterprise client",
    "status": "ACTIVE"
  }
  ```

#### `GET /api/clients/[id]`
Retrieves full client profile with linked projects, payments, and recent activities.

#### `PATCH /api/clients/[id]`
Updates client details.

#### `DELETE /api/clients/[id]`
Deletes a client if zero projects exist. Returns `409 Conflict` if projects are attached.

---

### B. Projects API

#### `GET /api/projects`
Retrieves projects with live budget, paid totals, and task counts.
- **Query Params:** `clientId`, `status`, `priority`, `page`, `limit`, `sortBy`, `sortOrder`.

#### `POST /api/projects`
Creates a new project linked to an existing client.
- **Request Body:**
  ```json
  {
    "title": "Mobile App UI Design",
    "clientId": "cli-123",
    "budget": 120000,
    "startDate": "2026-11-01",
    "deadline": "2026-12-15",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "progress": 40
  }
  ```

#### `GET /api/projects/[id]`
Retrieves project workspace with nested tasks, milestones, deliverables, and payments.

#### `PATCH /api/projects/[id]`
Updates project details or progress percentage.

#### `DELETE /api/projects/[id]`
Deletes a project if zero payment records exist. Returns `409 Conflict` if payments exist.

---

### C. Tasks API

#### `GET /api/tasks`
Lists tasks with filters for `projectId`, `status`, `priority`, and `overdue` flag.

#### `POST /api/tasks`
Creates a new task linked to a project.

#### `PATCH /api/tasks/[id]`
Updates task details. Setting `status: "COMPLETED"` automatically stamps `completedAt`.

#### `DELETE /api/tasks/[id]`
Deletes a task.

---

### D. Milestones API

#### `GET /api/milestones`
Lists milestones ordered by due date ascending.

#### `POST /api/milestones`
Creates a new project milestone.

#### `PATCH /api/milestones/[id]`
Updates milestone status and title.

#### `DELETE /api/milestones/[id]`
Deletes a milestone.

---

### E. Deliverables API

#### `GET /api/deliverables`
Lists deliverables with project and client names.

#### `POST /api/deliverables`
Records a deliverable submission with validated asset URL.
- **Request Body:**
  ```json
  {
    "title": "Design System v1.0",
    "projectId": "proj-123",
    "submissionDate": "2026-11-20",
    "attachmentType": "FIGMA",
    "attachmentUrl": "https://figma.com/file/sample",
    "status": "SUBMITTED"
  }
  ```

#### `PATCH /api/deliverables/[id]`
Updates review status (`APPROVED` or `REVISION_REQUIRED`).

#### `DELETE /api/deliverables/[id]`
Deletes a deliverable record.

---

### F. Payments API

#### `GET /api/payments`
Lists payment transactions with pagination, method filtering, and date range filtering.

#### `POST /api/payments`
Records a new payment with overpayment prevention checks.
- **Request Body:**
  ```json
  {
    "projectId": "proj-123",
    "amount": 50000,
    "paymentDate": "2026-11-15",
    "paymentMethod": "BANK_TRANSFER",
    "referenceNumber": "NEFT-789012",
    "status": "COMPLETED"
  }
  ```

#### `GET /api/payments/[id]`
Retrieves receipt and project metadata for a transaction.

#### `PATCH /api/payments/[id]`
Updates payment details with balance re-validation.

#### `DELETE /api/payments/[id]`
Deletes a payment record.

---

### G. Dashboard & Reports API

#### `GET /api/dashboard`
Returns aggregated business KPIs:
- `paidThisMonth`: Total completed payments in current calendar month.
- `outstandingPayments`: Global unpaid balance across all projects.
- `activeProjects`: Total active project count.
- `tasksDueSoon`: Tasks due within next 7 days.
- `overdueTasks`: Incomplete tasks with past due dates.
- `monthlyRevenue`: 6-month historical monthly revenue array.
- `recentActivity`: Latest audit event logs.

#### `GET /api/reports`
Generates comprehensive report rollup filtered by `clientId`, `projectStatus`, and date ranges. Returns revenue summaries, client performance rankings, and task metrics.
