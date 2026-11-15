'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatINR } from '@/lib/utils';
import { getOverallPaymentStats } from '@/lib/utils/payment-utils';
import { isTaskOverdue } from '@/lib/utils/task-utils';
import { useAppContext } from '@/context/app-context';
import { TrendingUp, Clock, Briefcase, CheckCircle2, AlertCircle } from 'lucide-react';

export interface KpiSectionProps {
  kpiData?: {
    paidThisMonth: number;
    outstandingPayments: number;
    activeProjects: number;
    tasksDueSoon: number;
    overdueTasks: number;
  };
}

export function KpiSection({ kpiData }: KpiSectionProps = {}) {
  const { payments, projects, tasks } = useAppContext();
  const finance = getOverallPaymentStats(payments, projects);

  const paidThisMonth = kpiData ? kpiData.paidThisMonth : finance.receivedThisMonth;
  const outstandingAmount = kpiData ? kpiData.outstandingPayments : finance.outstandingAmount;
  const activeProjectsCount = kpiData
    ? kpiData.activeProjects
    : projects.filter((p) => p.status === 'IN_PROGRESS' || p.status === 'PLANNING').length;

  const onHoldCount = projects.filter((p) => p.status === 'ON_HOLD').length;
  const overdueTasksCount = kpiData
    ? kpiData.overdueTasks
    : tasks.filter((t) => isTaskOverdue(t)).length;
  const pendingTasksCount = kpiData
    ? kpiData.tasksDueSoon
    : tasks.filter((t) => t.status !== 'COMPLETED').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* KPI 1: Paid This Month */}
      <Card className="flex flex-col justify-between p-5 hover:border-brand-primary/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Paid This Month
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-success-bg text-success-text border border-success-border/60">
            <TrendingUp size={16} strokeWidth={2} />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary font-mono">
            {formatINR(paidThisMonth)}
          </div>
          <div className="mt-2.5 flex items-center gap-2 text-xs">
            <Badge variant="success" size="sm" className="font-semibold px-2 py-0.5">
              +12.5%
            </Badge>
            <span className="text-text-muted truncate">
              vs ₹75,500 last month
            </span>
          </div>
        </div>
      </Card>

      {/* KPI 2: Outstanding Payments */}
      <Card className="flex flex-col justify-between p-5 hover:border-warning-border transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Outstanding
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning-bg text-warning-text border border-warning-border/60">
            <Clock size={16} strokeWidth={2} />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-warning-text font-mono">
            {formatINR(outstandingAmount)}
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-text-muted">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-warning-text shrink-0" />
            <span className="truncate">{finance.pendingPaymentsCount} pending milestone invoices</span>
          </div>
        </div>
      </Card>

      {/* KPI 3: Active Projects */}
      <Card className="flex flex-col justify-between p-5 hover:border-brand-primary/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Active Projects
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-sage-light text-brand-forest dark:bg-brand-sage-light/20 dark:text-brand-sage border border-brand-sage/40">
            <Briefcase size={16} strokeWidth={2} />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            {activeProjectsCount}{' '}
            <span className="text-sm font-normal text-text-muted">sprints</span>
          </div>
          <div className="mt-2.5 flex items-center gap-2 text-xs text-text-muted">
            <span>{onHoldCount} on hold</span>
            <span>•</span>
            <span className="text-brand-forest dark:text-brand-sage font-medium">
              {projects.length} total projects
            </span>
          </div>
        </div>
      </Card>

      {/* KPI 4: Tasks Due Soon */}
      <Card className="flex flex-col justify-between p-5 hover:border-info-border transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Tasks Due Soon
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-info-bg text-info-text border border-info-border/60">
            {overdueTasksCount > 0 ? (
              <AlertCircle size={16} strokeWidth={2} className="text-error-text" />
            ) : (
              <CheckCircle2 size={16} strokeWidth={2} />
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            {pendingTasksCount}{' '}
            <span className="text-sm font-normal text-text-muted">pending</span>
          </div>
          <div className="mt-2.5 flex items-center gap-2 text-xs">
            {overdueTasksCount > 0 ? (
              <Badge variant="error" size="sm" className="font-semibold px-2 py-0.5">
                {overdueTasksCount} overdue
              </Badge>
            ) : (
              <Badge variant="success" size="sm" className="font-semibold px-2 py-0.5">
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
