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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Total Earnings */}
      <Card className="p-4 sm:p-5 flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-text-secondary">Total Earnings</span>
          <div className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-text-primary font-mono">
            {formatINR(stats.totalEarnings)}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            All-time settled income
          </span>
        </div>
        <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-success-bg border border-success-border text-success-text">
          <CreditCard size={19} strokeWidth={1.8} />
        </div>
      </Card>

      {/* 2. Received This Month */}
      <Card className="p-4 sm:p-5 flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-text-secondary">Received This Month</span>
          <div className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-brand-forest dark:text-brand-sage font-mono">
            {formatINR(stats.receivedThisMonth)}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            November 2026 payouts
          </span>
        </div>
        <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-brand-sage-light border border-brand-sage/40 text-brand-forest dark:text-brand-sage">
          <TrendingUp size={19} strokeWidth={1.8} />
        </div>
      </Card>

      {/* 3. Outstanding Amount */}
      <Card className="p-4 sm:p-5 flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-text-secondary">Outstanding Amount</span>
          <div className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-warning-text font-mono">
            {formatINR(stats.outstandingAmount)}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Unbilled & pending balance
          </span>
        </div>
        <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-warning-bg border border-warning-border text-warning-text">
          <Clock size={19} strokeWidth={1.8} />
        </div>
      </Card>

      {/* 4. Number of Pending Payments */}
      <Card className="p-4 sm:p-5 flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-text-secondary">Pending Invoices</span>
          <div className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
            {stats.pendingPaymentsCount}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Awaiting client clearing
          </span>
        </div>
        <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-surface-subtle border border-border text-text-secondary">
          <AlertCircle size={19} strokeWidth={1.8} />
        </div>
      </Card>
    </div>
  );
}

export default PaymentSummaryCards;

