'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Payment } from '@/types/payment';
import { Project } from '@/types/project';
import { getOverallPaymentStats } from '@/lib/utils/payment-utils';
import { formatINR } from '@/lib/utils';
import { CreditCard, TrendingUp, Clock, AlertCircle } from 'lucide-react';

export interface PaymentSummaryCardsProps {
  payments: Payment[];
  projects: Project[];
}

export function PaymentSummaryCards({ payments, projects }: PaymentSummaryCardsProps) {
  const stats = getOverallPaymentStats(payments, projects);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Earnings */}
      <Card className="p-4 sm:p-5 flex items-center justify-between hover:border-success-border transition-all">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Total Settled
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-text-primary font-mono">
            {formatINR(stats.totalEarnings)}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            All-time verified income
          </span>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success-bg border border-success-border text-success-text">
          <CreditCard size={18} strokeWidth={1.8} />
        </div>
      </Card>

      {/* 2. Received This Month */}
      <Card className="p-4 sm:p-5 flex items-center justify-between hover:border-brand-primary/40 transition-all">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Paid This Month
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-brand-forest dark:text-brand-sage font-mono">
            {formatINR(stats.receivedThisMonth)}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Current billing cycle
          </span>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-sage-light border border-brand-sage/40 text-brand-forest dark:text-brand-sage">
          <TrendingUp size={18} strokeWidth={1.8} />
        </div>
      </Card>

      {/* 3. Outstanding Amount */}
      <Card className="p-4 sm:p-5 flex items-center justify-between hover:border-warning-border transition-all">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Outstanding
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-warning-text font-mono">
            {formatINR(stats.outstandingAmount)}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            To be collected
          </span>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning-bg border border-warning-border text-warning-text">
          <Clock size={18} strokeWidth={1.8} />
        </div>
      </Card>

      {/* 4. Pending Transactions */}
      <Card className="p-4 sm:p-5 flex items-center justify-between hover:border-info-border transition-all">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Pending Gates
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-text-primary font-mono">
            {stats.pendingPaymentsCount}{' '}
            <span className="text-xs font-normal text-text-muted">invoices</span>
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            {formatINR(stats.pendingAmount)} in review
          </span>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-info-bg border border-info-border text-info-text">
          <AlertCircle size={18} strokeWidth={1.8} />
        </div>
      </Card>
    </div>
  );
}

export default PaymentSummaryCards;
