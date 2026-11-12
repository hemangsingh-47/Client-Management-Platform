'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatINR } from '@/lib/utils';
import { getOverallPaymentStats } from '@/lib/utils/payment-utils';
import { isTaskOverdue } from '@/lib/utils/task-utils';
import { useAppContext } from '@/context/app-context';
import { TrendingUp, Clock, Briefcase, AlertCircle } from 'lucide-react';

export function KpiSection() {
  const { payments, projects, tasks } = useAppContext();
  const finance = getOverallPaymentStats(payments, projects);

  const activeProjectsCount = projects.filter(
    (p) => p.status === 'IN_PROGRESS' || p.status === 'PLANNING'
  ).length;

  const onHoldCount = projects.filter((p) => p.status === 'ON_HOLD').length;
  const overdueTasksCount = tasks.filter((t) => isTaskOverdue(t)).length;
  const pendingTasksCount = tasks.filter((t) => t.status !== 'COMPLETED').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1: Paid This Month */}
      <Card className="flex flex-col justify-between p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-text-secondary">Paid This Month</span>
          <div className="p-1.5 rounded-md bg-success-bg text-success-text border border-success-border">
            <TrendingUp size={14} />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-text-primary font-mono">
            {formatINR(finance.receivedThisMonth)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px]">
            <Badge variant="success" size="sm" className="font-semibold px-1.5">
              +12.5%
            </Badge>
            <span className="text-text-muted truncate">
              vs ₹75,500 last month
            </span>
          </div>
        </div>
      </Card>

      {/* KPI 2: Outstanding Payments */}
      <Card className="flex flex-col justify-between p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-text-secondary">Outstanding Payments</span>
          <div className="p-1.5 rounded-md bg-warning-bg text-warning-text border border-warning-border">
            <Clock size={14} />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-text-primary font-mono">
            {formatINR(finance.outstandingAmount)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-text-muted">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-warning-text" />
            <span className="truncate">Across {finance.pendingPaymentsCount} pending milestone invoices</span>
          </div>
        </div>
      </Card>

      {/* KPI 3: Active Projects */}
      <Card className="flex flex-col justify-between p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-text-secondary">Active Projects</span>
          <div className="p-1.5 rounded-md bg-brand-sage-light text-brand-forest dark:bg-brand-forest/40 dark:text-brand-sage border border-brand-sage/30">
            <Briefcase size={14} />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-text-primary">
            {activeProjectsCount}{' '}
            <span className="text-xs font-normal text-text-muted">sprints</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-text-muted">
            <span>{onHoldCount} on hold</span>
            <span>•</span>
            <span className="text-brand-forest dark:text-brand-sage font-medium">
              {projects.length} total
            </span>
          </div>
        </div>
      </Card>

      {/* KPI 4: Tasks Due Soon */}
      <Card className="flex flex-col justify-between p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-text-secondary">Tasks Due Soon</span>
          <div className="p-1.5 rounded-md bg-info-bg text-info-text border border-info-border">
            <AlertCircle size={14} />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-text-primary">
            {pendingTasksCount}{' '}
            <span className="text-xs font-normal text-text-muted">pending</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px]">
            {overdueTasksCount > 0 ? (
              <Badge variant="error" size="sm" className="font-semibold px-1.5">
                {overdueTasksCount} overdue
              </Badge>
            ) : (
              <Badge variant="success" size="sm" className="font-semibold px-1.5">
                All on track
              </Badge>
            )}
            <span className="text-text-muted truncate">Active sprint queue</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default KpiSection;
