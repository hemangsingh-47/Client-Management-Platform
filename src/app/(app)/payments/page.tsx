import React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { CreditCard } from 'lucide-react';

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description="Monitor invoice statuses, outstanding receivables, milestone payments, and payout logs."
        badge={
          <Badge variant="default" size="sm">
            Future Module
          </Badge>
        }
      />

      <EmptyState
        icon={<CreditCard size={22} className="text-brand-primary" />}
        title="Payments Module Planned"
        description="Invoicing, automated billing reminders, and transaction logs will be implemented in future phases."
      />
    </div>
  );
}

