# FreelanceHub — Production Deployment Guide

This guide details the steps required to deploy FreelanceHub to **Vercel** with a managed serverless **PostgreSQL** database (such as **Neon** or **Supabase**).

---

## 1. Production Architecture

```text
┌─────────────────────────────────┐
│          Vercel Edge            │
│  Next.js 16 App Router (SSR)    │
│  Serverless Functions (/api/*)  │
└────────────────┬────────────────┘
                 │ Pooled Connection (SSL)
                 ▼
┌─────────────────────────────────┐
│      Serverless PostgreSQL      │
│  Neon / Supabase Database       │
│  ACID Relational Engine         │
└─────────────────────────────────┘
```

---

## 2. Step 1: Provision Managed PostgreSQL

A serverless PostgreSQL database with connection pooling is recommended:

### Option A: Neon (Recommended)
1. Sign up or log in at [https://neon.tech](https://neon.tech).
2. Create a new project: `freelancehub-prod`.
3. Select your closest AWS region (e.g. `ap-south-1` for Mumbai / India).
4. Copy the **Pooled Connection String** from the Neon dashboard:
   ```text
   postgresql://[user]:[password]@[endpoint]-pooler.[region].aws.neon.tech/neondb?sslmode=require
   ```

### Option B: Supabase
1. Create a project at [https://supabase.com](https://supabase.com).
2. Navigate to **Project Settings** $\rightarrow$ **Database** $\rightarrow$ **Connection Pooling**.
3. Copy the transaction pooled URI (port 6543 or 5432 with pgbouncer enabled).

---

## 3. Step 2: Apply Production Migrations

From your local machine or CI terminal, deploy the committed Prisma schema migrations directly to the production database:

```bash
# Set your production database URL temporarily
DATABASE_URL="your-production-pooled-connection-string" npx prisma migrate deploy
```

> [!WARNING]
> Always use `prisma migrate deploy` for production. Never run `prisma migrate dev` or `prisma db push` on a live production database with existing customer records.

---

## 4. Step 3: Deploy to Vercel

### Connecting via Vercel Dashboard

1. Log into your [Vercel](https://vercel.com) account.
2. Click **Add New...** $\rightarrow$ **Project**.
3. Select your GitHub repository: `hemangsingh-47/Client-Management-Platform`.
4. Configure Project Settings:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./client-management-platform`
   - **Build Command:** `npm run build` *(runs `prisma generate && next build`)*
   - **Output Directory:** `.next`
5. Configure Environment Variables:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `DATABASE_URL` | `postgresql://...` | Production pooled PostgreSQL connection string |
6. Click **Deploy**.

---

## 5. Step 4: Verify Deployment

Once Vercel finishes the build:

1. **Verify Root & Overview:** Navigate to `https://<your-project>.vercel.app/dashboard`.
2. **Verify Database Read:** Ensure Active Projects and Paid This Month load without errors.
3. **Verify API Endpoints:** Test `GET /api/dashboard` and `GET /api/clients`.
4. **Verify Write Mutation:** Create a test client and verify it appears in the client directory.
