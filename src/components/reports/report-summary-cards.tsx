'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { formatINR } from '@/lib/utils';
import { TrendingUp, Clock, CheckCircle2, Percent } from 'lucide-react';

export interface ReportSummaryCardsProps {
  totalRevenue: number;
  outstandingRevenue: number;
  completedProjectsCount: number;
  completionRate: number;
}

export function ReportSummaryCards({
  totalRevenue,
  outstandingRevenue,
  completedProjectsCount,
  completionRate,
}: ReportSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Revenue */}
      <Card className="p-4 sm:p-5 flex items-center justify-between hover:border-success-border transition-all">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Settled Revenue
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-text-primary font-mono">
            {formatINR(totalRevenue)}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Verified payouts
          </span>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success-bg border border-success-border text-success-text">
          <TrendingUp size={18} strokeWidth={1.8} />
        </div>
      </Card>

      {/* 2. Outstanding Revenue */}
      <Card className="p-4 sm:p-5 flex items-center justify-between hover:border-warning-border transition-all">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Receivables
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-warning-text font-mono">
            {formatINR(outstandingRevenue)}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Milestone balance
          </span>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning-bg border border-warning-border text-warning-text">
          <Clock size={18} strokeWidth={1.8} />
        </div>
      </Card>

      {/* 3. Completed Projects */}
      <Card className="p-4 sm:p-5 flex items-center justify-between hover:border-brand-primary/40 transition-all">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Completed Sprints
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-brand-forest dark:text-brand-sage">
            {completedProjectsCount}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Delivered on scope
          </span>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-sage-light border border-brand-sage/40 text-brand-forest dark:text-brand-sage">
          <CheckCircle2 size={18} strokeWidth={1.8} />
        </div>
      </Card>

      {/* 4. Completion Rate */}
      <Card className="p-4 sm:p-5 flex items-center justify-between hover:border-border transition-all">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Completion Rate
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-text-primary font-mono">
            {completionRate}%
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Overall delivery velocity
          </span>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-subtle border border-border text-text-secondary">
          <Percent size={18} strokeWidth={1.8} />
        </div>
      </Card>
    </div>
  );
}

export default ReportSummaryCards;
