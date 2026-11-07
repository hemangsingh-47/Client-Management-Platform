import React from 'react';
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
    <div className="space-y-6 max-w-[1440px] mx-auto pb-8">
      {/* 1. Page Header with Date Range Filter & New Project Action */}
      <DashboardHeader />

      {/* 2. Business Overview: 4 KPI Cards */}
      <KpiSection />

      {/* 3. Section 1: Active Projects Table (65%) + Upcoming Tasks (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8">
          <ActiveProjectsTable />
        </div>
        <div className="lg:col-span-4">
          <UpcomingTasksList />
        </div>
      </div>

      {/* 4. Section 2: Earnings Overview (65%) + Recent Activity (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8">
          <EarningsChart />
        </div>
        <div className="lg:col-span-4">
          <RecentActivityFeed />
        </div>
      </div>
    </div>
  );
}
