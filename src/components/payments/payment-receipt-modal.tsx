'use client';

import React from 'react';
import Link from 'next/link';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Payment } from '@/types/payment';
import { Project } from '@/types/project';
import { Client } from '@/lib/mock-data/clients';
import { formatINR } from '@/lib/utils';
import {
  Calendar,
  CreditCard,
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Receipt,
} from 'lucide-react';

export interface PaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
  project?: Project;
  client?: Client;
  onEdit: (p: Payment) => void;
}

export function PaymentReceiptModal({
  isOpen,
  onClose,
  payment,
  project,
  client,
  onEdit,
}: PaymentReceiptModalProps) {
  if (!isOpen || !payment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Receipt size={18} className="text-brand-forest dark:text-brand-sage" />
          <span>Payment Receipt</span>
        </div>
      }
      description={`Reference: ${payment.reference}`}
      size="md"
    >
      <div className="space-y-5">
        {/* Large Amount & Status Display */}
        <div className="flex flex-col items-center justify-center p-5 rounded-xl bg-surface-subtle border border-border-subtle text-center">
          <span className="text-xs text-text-secondary font-medium">Transaction Amount</span>
          <div className="text-3xl font-bold font-mono text-text-primary mt-1 tracking-tight">
            {formatINR(payment.amount)}
          </div>
          <div className="mt-2.5">
            <Badge
              variant={
                payment.status === 'Completed'
                  ? 'success'
                  : payment.status === 'Pending'
                  ? 'warning'
                  : 'error'
              }
              size="md"
              className="gap-1 inline-flex"
            >
              {payment.status === 'Completed' && <CheckCircle2 size={12} />}
              {payment.status === 'Pending' && <Clock size={12} />}
              {payment.status === 'Failed' && <AlertCircle size={12} />}
              <span>{payment.status}</span>
            </Badge>
          </div>
        </div>

        {/* Detailed Metadata Grid */}
        <div className="space-y-3 text-xs sm:text-sm divide-y divide-border-subtle">
          <div className="flex items-center justify-between py-2">
            <span className="text-text-secondary">Payment Date</span>
            <span className="font-medium text-text-primary flex items-center gap-1.5">
              <Calendar size={13} className="text-text-muted" />
              <span>{payment.paymentDate}</span>
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-text-secondary">Project</span>
            {project ? (
              <Link
                href={`/projects/${project.id}`}
                className="font-semibold text-brand-forest dark:text-brand-sage hover:underline flex items-center gap-1"
              >
                <span>{project.title}</span>
                <ExternalLink size={11} />
              </Link>
            ) : (
              <span className="text-text-muted">Unassigned</span>
            )}
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-text-secondary">Client Organization</span>
            {client ? (
              <Link
                href={`/clients/${client.id}`}
                className="font-medium text-text-primary hover:text-brand-forest dark:hover:text-brand-sage transition-colors flex items-center gap-1"
              >
                <Building2 size={13} className="text-text-muted" />
                <span>{client.companyName || client.name}</span>
              </Link>
            ) : (
              <span className="text-text-muted">Direct Client</span>
            )}
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-text-secondary">Payment Method</span>
            <span className="font-medium text-text-primary flex items-center gap-1.5">
              <CreditCard size={13} className="text-text-muted" />
              <span>{payment.paymentMethod}</span>
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-text-secondary">Transaction UTR / Ref</span>
            <span className="font-mono text-xs font-semibold text-text-primary">
              {payment.reference}
            </span>
          </div>
        </div>

        {/* Notes */}
        {payment.notes && (
          <div className="space-y-1 pt-1">
            <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
              Payment Remarks & Scope
            </span>
            <p className="text-xs text-text-primary leading-relaxed bg-surface p-3 rounded-lg border border-border-subtle italic">
              &ldquo;{payment.notes}&rdquo;
            </p>
          </div>
        )}

        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              onClose();
              onEdit(payment);
            }}
          >
            Edit Record
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
}

export default PaymentReceiptModal;

