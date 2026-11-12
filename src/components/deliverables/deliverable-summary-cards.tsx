'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Deliverable } from '@/types/deliverable';
import { PackageCheck, Clock, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

export interface DeliverableSummaryCardsProps {
  deliverables: Deliverable[];
}

export function DeliverableSummaryCards({ deliverables }: DeliverableSummaryCardsProps) {
  const total = deliverables.length;
  const pending = deliverables.filter((d) => d.status === 'PENDING').length;
  const submitted = deliverables.filter((d) => d.status === 'SUBMITTED').length;
  const approved = deliverables.filter((d) => d.status === 'APPROVED').length;
  const revision = deliverables.filter((d) => d.status === 'REVISION_REQUIRED').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {/* 1. Total Deliverables */}
      <Card className="p-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-text-secondary">Total Deliverables</span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-text-primary">
            {total}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Across active sprints
          </span>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-subtle border border-border text-text-secondary">
          <PackageCheck size={18} strokeWidth={1.8} />
        </div>
      </Card>

      {/* 2. Pending */}
      <Card className="p-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-text-secondary">Pending</span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-text-primary">
            {pending}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            In development
          </span>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-subtle border border-border text-text-secondary">
          <FileText size={18} strokeWidth={1.8} />
        </div>
      </Card>

      {/* 3. Submitted */}
      <Card className="p-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-text-secondary">Submitted</span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-brand-forest dark:text-brand-sage">
            {submitted}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Awaiting client review
          </span>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-sage-light border border-brand-sage/40 text-brand-forest dark:text-brand-sage">
          <Clock size={18} strokeWidth={1.8} />
        </div>
      </Card>

      {/* 4. Approved */}
      <Card className="p-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-text-secondary">Approved</span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-success-text">
            {approved}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Sign-off complete
          </span>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success-bg border border-success-border text-success-text">
          <CheckCircle2 size={18} strokeWidth={1.8} />
        </div>
      </Card>

      {/* 5. Revision Required */}
      <Card className="p-4 flex items-center justify-between col-span-2 sm:col-span-1">
        <div>
          <span className="text-xs font-medium text-text-secondary">Revisions</span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-warning-text">
            {revision}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Changes requested
          </span>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning-bg border border-warning-border text-warning-text">
          <AlertCircle size={18} strokeWidth={1.8} />
        </div>
      </Card>
    </div>
  );
}

export default DeliverableSummaryCards;

