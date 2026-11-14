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
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4">
      {/* 1. Total Deliverables */}
      <Card className="p-4 sm:p-5 flex items-center justify-between hover:border-brand-primary/40 transition-all">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Total Deliverables
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-text-primary">
            {total}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Across active sprints
          </span>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-subtle border border-border text-text-secondary">
          <PackageCheck size={18} strokeWidth={1.8} />
        </div>
      </Card>

      {/* 2. Pending */}
      <Card className="p-4 sm:p-5 flex items-center justify-between hover:border-border transition-all">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Drafting
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-text-primary">
            {pending}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Internal progress
          </span>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-subtle border border-border text-text-secondary">
          <FileText size={18} strokeWidth={1.8} />
        </div>
      </Card>

      {/* 3. Submitted */}
      <Card className="p-4 sm:p-5 flex items-center justify-between hover:border-brand-primary/40 transition-all">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            In Review
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-brand-forest dark:text-brand-sage">
            {submitted}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Awaiting client review
          </span>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-sage-light border border-brand-sage/40 text-brand-forest dark:text-brand-sage">
          <Clock size={18} strokeWidth={1.8} />
        </div>
      </Card>

      {/* 4. Approved */}
      <Card className="p-4 sm:p-5 flex items-center justify-between hover:border-success-border transition-all">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Approved
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-success-text">
            {approved}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Accepted by client
          </span>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success-bg border border-success-border text-success-text">
          <CheckCircle2 size={18} strokeWidth={1.8} />
        </div>
      </Card>

      {/* 5. Revision */}
      <Card className="p-4 sm:p-5 flex items-center justify-between col-span-2 md:col-span-1 hover:border-warning-border transition-all">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Changes Needed
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-warning-text">
            {revision}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            {revision > 0 ? 'Feedback provided' : 'No revisions open'}
          </span>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning-bg border border-warning-border text-warning-text">
          <AlertCircle size={18} strokeWidth={1.8} />
        </div>
      </Card>
    </div>
  );
}

export default DeliverableSummaryCards;
