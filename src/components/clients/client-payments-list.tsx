'use client';

import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge, BadgeVariant } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { formatINR } from '@/lib/utils';
import { ClientPayment, PaymentStatus } from '@/lib/mock-data/clients';
import { CreditCard, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export interface ClientPaymentsListProps {
  payments?: ClientPayment[];
}

export function ClientPaymentsList({ payments = [] }: ClientPaymentsListProps) {
  if (payments.length === 0) {
    return (
      <EmptyState
        icon={<CreditCard size={20} className="text-text-secondary" />}
        title="No payment records"
        description="Invoices, deposits, and settlement transactions for this client will be listed here."
      />
    );
  }

  const getStatusVariant = (status: PaymentStatus): BadgeVariant => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 size={12} />;
      case 'Pending':
        return <Clock size={12} />;
      case 'Failed':
        return <AlertCircle size={12} />;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-xs">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date / Due</TableHead>
            <TableHead>Project / Description</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id} className="hover:bg-surface-hover/80 transition-colors">
              <TableCell className="text-xs font-medium text-text-secondary whitespace-nowrap">
                {payment.date}
              </TableCell>

              <TableCell className="font-medium text-text-primary text-xs sm:text-sm">
                {payment.projectName}
              </TableCell>

              <TableCell>
                <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary bg-surface-subtle px-2 py-0.5 rounded-md border border-border-subtle">
                  <CreditCard size={12} className="text-text-muted" />
                  <span>{payment.method}</span>
                </span>
              </TableCell>

              <TableCell className="text-right font-medium text-xs sm:text-sm font-mono text-text-primary">
                {formatINR(payment.amount)}
              </TableCell>

              <TableCell className="text-right">
                <Badge
                  variant={getStatusVariant(payment.status)}
                  size="sm"
                  className="gap-1 inline-flex"
                >
                  {getStatusIcon(payment.status)}
                  <span>{payment.status}</span>
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ClientPaymentsList;

