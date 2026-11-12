'use client';

import React, { useState } from 'react';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/ui/form-field';
import { Select } from '@/components/ui/select';
import { Deliverable, DeliverableStatus, AttachmentType } from '@/types/deliverable';
import { Project } from '@/types/project';
import { Loader2 } from 'lucide-react';

export interface DeliverableFormData {
  title: string;
  projectId: string;
  description: string;
  submissionDate: string;
  status: DeliverableStatus;
  attachmentType: AttachmentType;
  attachmentUrl: string;
  version: string;
  notes: string;
}

export interface DeliverableFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DeliverableFormData) => void;
  initialData?: Deliverable | null;
  projects: Project[];
}

interface FormContentProps {
  initialData?: Deliverable | null;
  projects: Project[];
  onClose: () => void;
  onSave: (data: DeliverableFormData) => void;
}

const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;

function DeliverableFormContent({
  initialData,
  projects,
  onClose,
  onSave,
}: FormContentProps) {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState<DeliverableFormData>(() => ({
    title: initialData?.title || '',
    projectId: initialData?.projectId || (projects[0]?.id || ''),
    description: initialData?.description || '',
    submissionDate: initialData?.submissionDate || '2026-11-20',
    status: initialData?.status || 'SUBMITTED',
    attachmentType: initialData?.attachmentType || 'Figma',
    attachmentUrl: initialData?.attachmentUrl || '',
    version: initialData?.version || 'v1.0',
    notes: initialData?.notes || '',
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = <K extends keyof DeliverableFormData>(
    field: K,
    value: DeliverableFormData[K]
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

    if (!formData.title.trim()) {
      newErrors.title = 'Deliverable title is required.';
    }

    if (!formData.projectId) {
      newErrors.projectId = 'Please select an associated project.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Deliverable description is required.';
    }

    if (!formData.submissionDate) {
      newErrors.submissionDate = 'Submission date is required.';
    }

    if (formData.attachmentUrl.trim() && !URL_REGEX.test(formData.attachmentUrl.trim())) {
      newErrors.attachmentUrl = 'Please enter a valid URL (e.g. https://figma.com/...)';
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
        title: formData.title.trim(),
        description: formData.description.trim(),
        attachmentUrl: formData.attachmentUrl.trim(),
        version: formData.version.trim(),
        notes: formData.notes.trim(),
      });
      setIsSubmitting(false);
      onClose();
    }, 200);
  };

  const projectOptions = projects.map((p) => ({
    value: p.id,
    label: p.title,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 1. Title & Version */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="sm:col-span-3">
          <FormField
            id="del-title"
            label="Deliverable Title"
            required
            error={errors.title}
          >
            <Input
              id="del-title"
              placeholder="e.g. Design System & Component Library"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              hasError={Boolean(errors.title)}
              autoFocus
            />
          </FormField>
        </div>

        <div>
          <FormField id="del-version" label="Version Tag">
            <Input
              id="del-version"
              placeholder="v1.0"
              value={formData.version}
              onChange={(e) => handleChange('version', e.target.value)}
            />
          </FormField>
        </div>
      </div>

      {/* 2. Project Selection & Submission Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          id="del-project"
          label="Associated Project"
          required
          error={errors.projectId}
        >
          <Select
            id="del-project"
            value={formData.projectId}
            onChange={(e) => handleChange('projectId', e.target.value)}
            options={projectOptions}
            hasError={Boolean(errors.projectId)}
          />
        </FormField>

        <FormField
          id="del-date"
          label="Submission Date"
          required
          error={errors.submissionDate}
        >
          <Input
            id="del-date"
            type="date"
            value={formData.submissionDate}
            onChange={(e) => handleChange('submissionDate', e.target.value)}
            hasError={Boolean(errors.submissionDate)}
          />
        </FormField>
      </div>

      {/* 3. Status & Attachment Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField id="del-status" label="Current Status">
          <Select
            id="del-status"
            value={formData.status}
            onChange={(e) =>
              handleChange('status', e.target.value as DeliverableStatus)
            }
            options={[
              { value: 'PENDING', label: 'Pending Development' },
              { value: 'SUBMITTED', label: 'Submitted for Review' },
              { value: 'APPROVED', label: 'Approved by Client' },
              { value: 'REVISION_REQUIRED', label: 'Revision Required' },
            ]}
          />
        </FormField>

        <FormField id="del-attach-type" label="Attachment Type">
          <Select
            id="del-attach-type"
            value={formData.attachmentType}
            onChange={(e) =>
              handleChange('attachmentType', e.target.value as AttachmentType)
            }
            options={[
              { value: 'Figma', label: 'Figma Prototype' },
              { value: 'GitHub', label: 'GitHub Repository' },
              { value: 'Document', label: 'Document / PDF' },
              { value: 'Archive', label: 'Archive / ZIP' },
              { value: 'External Link', label: 'External Web Link' },
            ]}
          />
        </FormField>
      </div>

      {/* 4. Attachment URL */}
      <FormField
        id="del-url"
        label="Mock Attachment URL"
        optional
        error={errors.attachmentUrl}
        hint="External URL link simulating file or prototype handover (e.g. https://figma.com/...)"
      >
        <Input
          id="del-url"
          type="url"
          placeholder="https://..."
          value={formData.attachmentUrl}
          onChange={(e) => handleChange('attachmentUrl', e.target.value)}
          hasError={Boolean(errors.attachmentUrl)}
        />
      </FormField>

      {/* 5. Scope Description */}
      <FormField
        id="del-desc"
        label="Scope & Deliverable Description"
        required
        error={errors.description}
      >
        <Textarea
          id="del-desc"
          placeholder="Summarize the delivered components, screens, or assets..."
          rows={2}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          hasError={Boolean(errors.description)}
        />
      </FormField>

      {/* 6. Notes */}
      <FormField id="del-notes" label="Client Review Notes" optional>
        <Textarea
          id="del-notes"
          placeholder="Client comments, approval instructions, or revision requests..."
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
          {isEditing ? 'Save Changes' : 'Create Deliverable'}
        </Button>
      </ModalFooter>
    </form>
  );
}

export function DeliverableFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  projects,
}: DeliverableFormModalProps) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Deliverable' : 'Add Deliverable'}
      description={
        initialData
          ? 'Update submission details, status, and external links.'
          : 'Record a work package for client review and milestone tracking.'
      }
      size="lg"
    >
      <DeliverableFormContent
        key={initialData?.id || 'new-del'}
        initialData={initialData}
        projects={projects}
        onClose={onClose}
        onSave={onSave}
      />
    </Modal>
  );
}

export default DeliverableFormModal;

