'use client';

import React, { useState } from 'react';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/ui/form-field';
import { Select } from '@/components/ui/select';
import { Client, ClientStatus } from '@/lib/mock-data/clients';
import { Loader2 } from 'lucide-react';

export interface ClientFormData {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  status: ClientStatus;
  notes: string;
}

export interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ClientFormData) => void;
  initialData?: Client | null;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormContentProps {
  initialData?: Client | null;
  onClose: () => void;
  onSave: (data: ClientFormData) => void;
}

function ClientFormContent({ initialData, onClose, onSave }: FormContentProps) {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState<ClientFormData>(() => ({
    name: initialData?.name || '',
    companyName: initialData?.companyName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    status: initialData?.status || 'ACTIVE',
    notes: initialData?.notes || '',
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof ClientFormData, value: string) => {
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

    if (!formData.name.trim()) {
      newErrors.name = 'Client name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate brief asynchronous UI feedback
    setTimeout(() => {
      onSave({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        companyName: formData.companyName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        notes: formData.notes.trim(),
      });
      setIsSubmitting(false);
      onClose();
    }, 250);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name and Company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          id="client-name"
          label="Client Name"
          required
          error={errors.name}
        >
          <Input
            id="client-name"
            placeholder="e.g. John Carter"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            hasError={Boolean(errors.name)}
            autoFocus
          />
        </FormField>

        <FormField id="company-name" label="Company Name" optional>
          <Input
            id="company-name"
            placeholder="e.g. Acme Studio"
            value={formData.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
          />
        </FormField>
      </div>

      {/* Email and Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          id="client-email"
          label="Email Address"
          required
          error={errors.email}
        >
          <Input
            id="client-email"
            type="email"
            placeholder="e.g. client@example.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            hasError={Boolean(errors.email)}
          />
        </FormField>

        <FormField id="client-phone" label="Phone Number" optional>
          <Input
            id="client-phone"
            type="tel"
            placeholder="e.g. +91 98765 43210"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </FormField>
      </div>

      {/* Status and Address */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <FormField id="client-status" label="Client Status">
            <Select
              id="client-status"
              value={formData.status}
              onChange={(e) =>
                handleChange('status', e.target.value as ClientStatus)
              }
              options={[
                { value: 'ACTIVE', label: 'Active' },
                { value: 'INACTIVE', label: 'Inactive' },
              ]}
            />
          </FormField>
        </div>

        <div className="sm:col-span-2">
          <FormField id="client-address" label="Address" optional>
            <Input
              id="client-address"
              placeholder="e.g. Suite 402, Business Bay, Mumbai"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </FormField>
        </div>
      </div>

      {/* Notes */}
      <FormField
        id="client-notes"
        label="Notes & Terms"
        optional
        hint="Internal notes about engagement scope, billing cadence, or special requirements."
      >
        <Textarea
          id="client-notes"
          placeholder="Add relevant notes, project focus, or billing preferences..."
          rows={3}
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
        />
      </FormField>

      {/* Modal Actions */}
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
          {isEditing ? 'Save Changes' : 'Save Client'}
        </Button>
      </ModalFooter>
    </form>
  );
}

export function ClientFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ClientFormModalProps) {
  if (!isOpen) return null;

  const isEditing = Boolean(initialData);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Client Profile' : 'Add New Client'}
      description={
        isEditing
          ? 'Update contact details, company information, and relationship notes.'
          : 'Create a new client profile to track projects, invoices, and communication.'
      }
      size="lg"
    >
      <ClientFormContent
        key={initialData?.id || 'new-client'}
        initialData={initialData}
        onClose={onClose}
        onSave={onSave}
      />
    </Modal>
  );
}

export default ClientFormModal;
