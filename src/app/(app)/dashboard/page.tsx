'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import {
  DashboardHeader,
  KpiSection,
  ActiveProjectsTable,
  UpcomingTasksList,
  EarningsChart,
  RecentActivityFeed,
} from '@/components/dashboard';
import { dashboardApi, DashboardMetrics } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await dashboardApi.getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load dashboard metrics from PostgreSQL:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard metrics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Page Header with Date Range Filter & New Project Action */}
      <Suspense fallback={<div className="h-16 w-full animate-pulse bg-surface-subtle rounded-xl" />}>
        <DashboardHeader />
      </Suspense>

      {/* Error State Banner */}
      {error && (
        <div className="p-4 rounded-xl border border-error-border bg-error-bg text-error-text flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboardData}
            className="flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw size={14} />
            <span>Retry</span>
          </Button>
        </div>
      )}

      {/* 2. Business Overview: 4 KPI Cards */}
      {isLoading && !metrics ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-xl border border-border bg-surface-subtle animate-pulse p-5" />
          ))}
        </div>
      ) : (
        <KpiSection kpiData={metrics?.kpis} />
      )}

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
          <EarningsChart monthlyData={metrics?.monthlyRevenue} />
        </div>
        <div className="xl:col-span-4">
          <RecentActivityFeed activities={metrics?.recentActivity} />
        </div>
      </div>
    </div>
  );
}
