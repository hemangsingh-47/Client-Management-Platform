'use client';

import React, { useState, useMemo } from 'react';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/ui/form-field';
import { Select } from '@/components/ui/select';
import { Payment, PaymentMethod, PaymentStatus } from '@/types/payment';
import { Project } from '@/types/project';
import { Client } from '@/lib/mock-data/clients';
import { formatINR } from '@/lib/utils';
import { getProjectFinancialSummary } from '@/lib/utils/payment-utils';
import { Loader2, Building2 } from 'lucide-react';

export interface PaymentFormData {
  projectId: string;
  clientId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  reference: string;
  status: PaymentStatus;
  notes: string;
}

export interface PaymentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PaymentFormData) => void;
  initialData?: Payment | null;
  projects: Project[];
  clients: Client[];
  existingPayments?: Payment[];
}

interface FormContentProps {
  initialData?: Payment | null;
  projects: Project[];
  clients: Client[];
  existingPayments: Payment[];
  onClose: () => void;
  onSave: (data: PaymentFormData) => void;
}

function PaymentFormContent({
  initialData,
  projects,
  clients,
  existingPayments,
  onClose,
  onSave,
}: FormContentProps) {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState<PaymentFormData>(() => {
    const defaultProj = projects[0];
    return {
      projectId: initialData?.projectId || (defaultProj?.id || ''),
      clientId: initialData?.clientId || (defaultProj?.clientId || ''),
      amount: initialData?.amount ?? 15000,
      paymentDate: initialData?.paymentDate || '2026-11-12',
      paymentMethod: initialData?.paymentMethod || 'Bank Transfer',
      reference: initialData?.reference || `REF-${Date.now().toString().slice(-6)}`,
      status: initialData?.status || 'Completed',
      notes: initialData?.notes || '',
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derived selected project and client
  const selectedProject = useMemo(
    () => projects.find((p) => p.id === formData.projectId),
    [projects, formData.projectId]
  );

  const selectedClient = useMemo(
    () => clients.find((c) => c.id === selectedProject?.clientId),
    [clients, selectedProject]
  );

  // Remaining project balance
  const remainingBalance = useMemo(() => {
    if (!selectedProject) return 0;
    // Exclude the current payment if editing
    const otherPayments = isEditing
      ? existingPayments.filter((p) => p.id !== initialData?.id)
      : existingPayments;
    const summary = getProjectFinancialSummary(selectedProject, otherPayments);
    return summary.outstandingBalance;
  }, [selectedProject, existingPayments, isEditing, initialData]);

  const handleProjectChange = (newProjectId: string) => {
    const proj = projects.find((p) => p.id === newProjectId);
    setFormData((prev) => ({
      ...prev,
      projectId: newProjectId,
      clientId: proj?.clientId || prev.clientId,
    }));
    if (errors.projectId) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.projectId;
        return next;
      });
    }
  };

  const handleChange = <K extends keyof PaymentFormData>(
    field: K,
    value: PaymentFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.projectId) {
      newErrors.projectId = 'Please select a project.';
    }

    if (isNaN(formData.amount) || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than zero.';
    } else if (selectedProject && formData.amount > remainingBalance) {
      // Guardrail validation: amount cannot exceed project's remaining balance
      newErrors.amount = `Amount exceeds project remaining balance of ${formatINR(remainingBalance)}.`;
    }

    if (!formData.paymentDate) {
      newErrors.paymentDate = 'Payment date is required.';
    }

    if (!formData.reference.trim()) {
      newErrors.reference = 'Reference number / transaction ID is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSave({
        ...formData,
        clientId: selectedProject?.clientId || formData.clientId,
        amount: Number(formData.amount),
        reference: formData.reference.trim(),
        notes: formData.notes.trim(),
      });
      setIsSubmitting(false);
      onClose();
    }, 200);
  };

  const projectOptions = projects.map((p) => ({
    value: p.id,
    label: `${p.title} (${formatINR(p.budget)})`,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 1. Project Selection */}
      <FormField
        id="pay-project"
        label="Project"
        required
        error={errors.projectId}
      >
        <Select
          id="pay-project"
          value={formData.projectId}
          onChange={(e) => handleProjectChange(e.target.value)}
          options={projectOptions}
          hasError={Boolean(errors.projectId)}
          autoFocus
        />
      </FormField>

      {/* 2. Client Display (Auto-derived) & Remaining Balance Banner */}
      {selectedProject && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-surface-subtle border border-border-subtle text-xs">
          <div className="flex items-center gap-1.5 text-text-secondary">
            <Building2 size={13} className="text-text-muted shrink-0" />
            <span>Client:</span>
            <span className="font-semibold text-text-primary">
              {selectedClient?.companyName || selectedClient?.name || 'Direct Client'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-text-secondary">
            <span>Remaining Unbilled:</span>
            <span className="font-mono font-bold text-brand-forest dark:text-brand-sage">
              {formatINR(remainingBalance)}
            </span>
          </div>
        </div>
      )}

      {/* 3. Amount & Payment Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          id="pay-amount"
          label="Payment Amount (₹)"
          required
          error={errors.amount}
        >
          <Input
            id="pay-amount"
            type="number"
            min={1}
            step={100}
            placeholder="15000"
            value={formData.amount === 0 ? '' : formData.amount}
            onChange={(e) =>
              handleChange('amount', parseFloat(e.target.value) || 0)
            }
            hasError={Boolean(errors.amount)}
          />
        </FormField>

        <FormField
          id="pay-date"
          label="Payment Date"
          required
          error={errors.paymentDate}
        >
          <Input
            id="pay-date"
            type="date"
            value={formData.paymentDate}
            onChange={(e) => handleChange('paymentDate', e.target.value)}
            hasError={Boolean(errors.paymentDate)}
          />
        </FormField>
      </div>

      {/* 4. Payment Method & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField id="pay-method" label="Payment Method">
          <Select
            id="pay-method"
            value={formData.paymentMethod}
            onChange={(e) =>
              handleChange('paymentMethod', e.target.value as PaymentMethod)
            }
            options={[
              { value: 'Bank Transfer', label: 'Bank Transfer / NEFT / IMPS' },
              { value: 'UPI', label: 'UPI (GPay / PhonePe / Paytm)' },
              { value: 'Cash', label: 'Cash Payment' },
              { value: 'Other', label: 'Other Payout' },
            ]}
          />
        </FormField>

        <FormField id="pay-status" label="Status">
          <Select
            id="pay-status"
            value={formData.status}
            onChange={(e) =>
              handleChange('status', e.target.value as PaymentStatus)
            }
            options={[
              { value: 'Completed', label: 'Completed (Settled)' },
              { value: 'Pending', label: 'Pending (Invoiced)' },
              { value: 'Failed', label: 'Failed' },
            ]}
          />
        </FormField>
      </div>

      {/* 5. Reference Number */}
      <FormField
        id="pay-ref"
        label="Transaction Reference / Invoice Number"
        required
        error={errors.reference}
        hint="Unique bank transaction UTR, UPI reference ID, or invoice number."
      >
        <Input
          id="pay-ref"
          placeholder="e.g. UPI/20261112/990214 or NEFT-40291"
          value={formData.reference}
          onChange={(e) => handleChange('reference', e.target.value)}
          hasError={Boolean(errors.reference)}
        />
      </FormField>

      {/* 6. Notes */}
      <FormField id="pay-notes" label="Payment Notes & Milestone Scope" optional>
        <Textarea
          id="pay-notes"
          placeholder="Notes on milestone deliverables, TDS deductions, or payment confirmations..."
          rows={2}
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
        />
      </FormField>

      <ModalFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Save Changes' : 'Record Payment'}
        </Button>
      </ModalFooter>
    </form>
  );
}

export function PaymentFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  projects,
  clients,
  existingPayments = [],
}: PaymentFormModalProps) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Payment Record' : 'Record Client Payment'}
      description={
        initialData
          ? 'Update transaction amount, settlement status, and reference.'
          : 'Log a settled milestone payment or pending client invoice.'
      }
      size="lg"
    >
      <PaymentFormContent
        key={initialData?.id || 'new-pay'}
        initialData={initialData}
        projects={projects}
        clients={clients}
        existingPayments={existingPayments}
        onClose={onClose}
        onSave={onSave}
      />
    </Modal>
  );
}

export default PaymentFormModal;

