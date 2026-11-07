import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatINR } from '@/lib/utils';
import { DashboardKpiData, MOCK_DASHBOARD_KPIS } from '@/lib/mock-data/dashboard';
import { TrendingUp, Clock, Briefcase, AlertCircle } from 'lucide-react';

export interface KpiSectionProps {
  data?: DashboardKpiData;
}

export function KpiSection({ data = MOCK_DASHBOARD_KPIS }: KpiSectionProps) {
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
          <div className="text-2xl font-bold tracking-tight text-text-primary">
            {formatINR(data.paidThisMonth.amount)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px]">
            <Badge variant="success" size="sm" className="font-semibold px-1.5">
              +{data.paidThisMonth.changePercentage}%
            </Badge>
            <span className="text-text-muted truncate">
              {data.paidThisMonth.comparisonText}
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
          <div className="text-2xl font-bold tracking-tight text-text-primary">
            {formatINR(data.outstandingPayments.amount)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-text-muted">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-warning-text" />
            <span className="truncate">{data.outstandingPayments.note}</span>
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
            {data.activeProjects.totalActive}{' '}
            <span className="text-sm font-normal text-text-secondary">Active</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-text-muted">
            <span>{data.activeProjects.onHoldCount} on hold</span>
            <span>•</span>
            <span>{data.activeProjects.planningCount} planning</span>
          </div>
        </div>
      </Card>

      {/* KPI 4: Tasks Due Soon */}
      <Card className="flex flex-col justify-between p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-text-secondary">Tasks Due Soon</span>
          <div className="p-1.5 rounded-md bg-surface-subtle text-text-secondary border border-border">
            <AlertCircle size={14} />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-text-primary">
            {data.tasksDueSoon.dueSoonCount}{' '}
            <span className="text-sm font-normal text-text-secondary">This week</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px]">
            {data.tasksDueSoon.overdueCount > 0 ? (
              <>
                <Badge variant="error" size="sm" dot>
                  {data.tasksDueSoon.overdueCount} Overdue
                </Badge>
                <span className="text-text-muted truncate">action needed</span>
              </>
            ) : (
              <span className="text-text-muted">All deadlines on schedule</span>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default KpiSection;

