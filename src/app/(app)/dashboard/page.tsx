import React, { Suspense } from 'react';
import {
  DashboardHeader,
  KpiSection,
  ActiveProjectsTable,
  UpcomingTasksList,
  EarningsChart,
  RecentActivityFeed,
} from '@/components/dashboard';

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-8">
      {/* 1. Page Header with Date Range Filter & New Project Action */}
      <Suspense fallback={<div className="h-16 w-full animate-pulse bg-surface-subtle rounded-xl" />}>
        <DashboardHeader />
      </Suspense>

      {/* 2. Business Overview: 4 KPI Cards */}
      <KpiSection />

      {/* 3. Section 1: Active Projects Table + Upcoming Tasks */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        <div className="xl:col-span-8">
          <ActiveProjectsTable />
        </div>
        <div className="xl:col-span-4">
          <UpcomingTasksList />
        </div>
      </div>

      {/* 4. Section 2: Earnings Overview + Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        <div className="xl:col-span-8">
          <EarningsChart />
        </div>
        <div className="xl:col-span-4">
          <RecentActivityFeed />
        </div>
      </div>
    </div>
  );
}
