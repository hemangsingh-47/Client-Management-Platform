# FreelanceHub — Known Issues & Architectural Limitations (Phase 14)

This document tracks genuine remaining limitations and non-blocking architectural items identified during the Phase 14 quality audit.

---

### 1. Unauthenticated API Endpoints (By Design for Current Milestone)
* **Status:** Expected / Within Scope
* **Description:** As defined by the project specification through Phase 14, user authentication (e.g. NextAuth, Supabase Auth, or Clerk) is intentionally deferred. All Next.js Route Handlers (`/api/*`) operate without session or JWT token verification.
* **Impact:** Anyone with network access to the server can query or mutate records if exposed publicly.
* **Mitigation:** Production deployment (Phase 15) must restrict network ingress or implement middleware authentication before exposing the platform on public internet.

---

### 2. Single-Tenant Data Isolation
* **Status:** Architectural Limitation
* **Description:** The database schema represents a dedicated single freelancer workspace. Tables (`clients`, `projects`, `tasks`, etc.) do not have a `userId` or `organizationId` foreign key.
* **Impact:** Multi-tenant separation is not natively enforced at the database level.
* **Future Solution:** Add a `User` or `Workspace` entity with a foreign key column across all root models.

---

### 3. File Attachments Restricted to External URLs
* **Status:** Functional Boundary
* **Description:** Deliverables support external asset links (Figma URLs, GitHub repos, Cloud documents) validated against `http://` and `https://` schemas. Direct multi-part binary file uploads (e.g. AWS S3, Cloudflare R2, or UploadThing) are not implemented.
* **Impact:** Users must host heavy binary files externally and provide the handover URL.

---

### 4. Background Job Scheduling for Email Alerts
* **Status:** Feature Scope
* **Description:** Due date notifications and overdue alerts are calculated dynamically on-demand during dashboard and task list queries. There is currently no persistent background cron worker (e.g. BullMQ, Redis, or Inngest) sending automated email alerts to clients.
