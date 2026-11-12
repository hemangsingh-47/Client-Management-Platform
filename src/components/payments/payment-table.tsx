'use client';

import React from 'react';
import Link from 'next/link';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dropdown } from '@/components/ui/dropdown';
import { EmptyState } from '@/components/ui/empty-state';
import { Payment, PaymentStatus } from '@/types/payment';
import { Project } from '@/types/project';
import { Client } from '@/lib/mock-data/clients';
import { formatINR } from '@/lib/utils';
import {
  MoreVertical,
  Pencil,
  Trash2,
  CreditCard,
  Building2,
  ExternalLink,
  SearchX,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';

export interface PaymentTableProps {
  payments: Payment[];
  projects: Project[];
  clients: Client[];
  onViewReceipt: (p: Payment) => void;
  onEdit: (p: Payment) => void;
  onDelete: (p: Payment) => void;
  onAddNew: () => void;
  onClearFilters: () => void;
  isFiltered: boolean;
}

export function PaymentTable({
  payments,
  projects,
  clients,
  onViewReceipt,
  onEdit,
  onDelete,
  onAddNew,
  onClearFilters,
  isFiltered,
}: PaymentTableProps) {
  if (payments.length === 0) {
    if (isFiltered) {
      return (
        <EmptyState
          icon={<SearchX size={22} className="text-text-secondary" />}
          title="No matching payments found"
          description="Try adjusting your search criteria, method, or payment status filters."
          action={
            <button
              type="button"
              onClick={onClearFilters}
              className="text-xs font-medium text-brand-forest dark:text-brand-sage hover:underline cursor-pointer"
            >
              Clear all filters
            </button>
          }
        />
      );
    }

    return (
      <EmptyState
        icon={<CreditCard size={22} className="text-brand-primary" />}
        title="No payments recorded"
        description="Monitor invoice settlements, outstanding client balances, and payout milestones."
        action={
          <button
            type="button"
            onClick={onAddNew}
            className="inline-flex items-center justify-center rounded-lg bg-brand-primary px-3.5 py-2 text-xs font-medium text-white shadow-xs hover:bg-brand-primary-hover cursor-pointer"
          >
            + Record First Payment
          </button>
        }
      />
    );
  }

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'Completed':
        return (
          <Badge variant="success" size="sm" className="gap-1 inline-flex">
            <CheckCircle2 size={11} />
            <span>Completed</span>
          </Badge>
        );
      case 'Pending':
        return (
          <Badge variant="warning" size="sm" className="gap-1 inline-flex">
            <Clock size={11} />
            <span>Pending</span>
          </Badge>
        );
      case 'Failed':
      default:
        return (
          <Badge variant="error" size="sm" className="gap-1 inline-flex">
            <AlertCircle size={11} />
            <span>Failed</span>
          </Badge>
        );
    }
  };

  return (
    <div className="relative rounded-xl border border-border bg-surface overflow-hidden shadow-xs">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Payment Date</TableHead>
            <TableHead className="w-[240px]">Project</TableHead>
            <TableHead>Client</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((p) => {
            const project = projects.find((proj) => proj.id === p.projectId);
            const client = clients.find((c) => c.id === p.clientId);

            return (
              <TableRow
                key={p.id}
                className="hover:bg-surface-hover/80 transition-colors group cursor-pointer"
                onClick={() => onViewReceipt(p)}
              >
                {/* Payment Date */}
                <TableCell className="text-xs text-text-secondary whitespace-nowrap">
                  {p.paymentDate}
                </TableCell>

                {/* Project */}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {project ? (
                    <Link
                      href={`/projects/${project.id}`}
                      className="inline-flex items-center gap-1 font-semibold text-text-primary text-xs sm:text-sm hover:text-brand-forest dark:hover:text-brand-sage transition-colors"
                    >
                      <span className="truncate max-w-[200px]">{project.title}</span>
                      <ExternalLink size={11} className="shrink-0 text-text-muted" />
                    </Link>
                  ) : (
                    <span className="text-xs text-text-muted">Unassigned</span>
                  )}
                </TableCell>

                {/* Client */}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {client ? (
                    <Link
                      href={`/clients/${client.id}`}
                      className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-brand-forest dark:hover:text-brand-sage transition-colors"
                    >
                      <Building2 size={12} className="shrink-0 text-text-muted" />
                      <span className="truncate max-w-[140px]">
                        {client.companyName || client.name}
                      </span>
                    </Link>
                  ) : (
                    <span className="text-xs text-text-muted">Direct Client</span>
                  )}
                </TableCell>

                {/* Amount */}
                <TableCell className="text-right font-medium text-xs sm:text-sm font-mono text-text-primary whitespace-nowrap">
                  {formatINR(p.amount)}
                </TableCell>

                {/* Payment Method */}
                <TableCell>
                  <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary bg-surface-subtle px-2 py-0.5 rounded-md border border-border-subtle">
                    <CreditCard size={11} className="text-text-muted" />
                    <span>{p.paymentMethod}</span>
                  </span>
                </TableCell>

                {/* Reference */}
                <TableCell className="text-xs font-mono text-text-muted whitespace-nowrap">
                  {p.reference}
                </TableCell>

                {/* Status */}
                <TableCell>
                  {getStatusBadge(p.status)}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <Dropdown
                    align="right"
                    trigger={
                      <button
                        type="button"
                        aria-label={`Actions for payment ${p.reference}`}
                        className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors focus:outline-none cursor-pointer"
                      >
                        <MoreVertical size={16} />
                      </button>
                    }
                    items={[
                      {
                        id: 'receipt',
                        label: 'View Receipt',
                        icon: <FileText size={14} />,
                        onClick: () => onViewReceipt(p),
                      },
                      {
                        id: 'edit',
                        label: 'Edit Payment',
                        icon: <Pencil size={14} />,
                        onClick: () => onEdit(p),
                      },
                      {
                        id: 'delete',
                        label: 'Delete Record',
                        icon: <Trash2 size={14} />,
                        destructive: true,
                        onClick: () => onDelete(p),
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Footer Info */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface-subtle border-t border-border-subtle text-xs text-text-secondary">
        <span>
          Showing <strong className="text-text-primary">{payments.length}</strong> payment record{payments.length === 1 ? '' : 's'}
        </span>
        <span className="text-[11px] text-text-muted">
          Click any row to view transaction receipt
        </span>
      </div>
    </div>
  );
}

export default PaymentTable;

