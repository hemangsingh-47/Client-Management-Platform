'use client';

import React, { useState } from 'react';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/ui/form-field';
import { Select } from '@/components/ui/select';
import { Milestone, MilestoneStatus } from '@/types/milestone';
import { Project } from '@/types/project';
import { Loader2 } from 'lucide-react';

export interface MilestoneFormData {
  title: string;
  description: string;
  projectId: string;
  dueDate: string;
  status: MilestoneStatus;
}

export interface MilestoneFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MilestoneFormData) => void;
  initialData?: Milestone | null;
  projects: Project[];
}

interface FormContentProps {
  initialData?: Milestone | null;
  projects: Project[];
  onClose: () => void;
  onSave: (data: MilestoneFormData) => void;
}

function MilestoneFormContent({
  initialData,
  projects,
  onClose,
  onSave,
}: FormContentProps) {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState<MilestoneFormData>(() => ({
    title: initialData?.title || '',
    description: initialData?.description || '',
    projectId: initialData?.projectId || (projects[0]?.id || ''),
    dueDate: initialData?.dueDate || '2026-11-30',
    status: initialData?.status || 'PENDING',
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = <K extends keyof MilestoneFormData>(
    field: K,
    value: MilestoneFormData[K]
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
      newErrors.title = 'Milestone title is required.';
    }

    if (!formData.projectId) {
      newErrors.projectId = 'Please select an associated project.';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required.';
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
      {/* 1. Milestone Title */}
      <FormField
        id="mls-title"
        label="Milestone Title"
        required
        error={errors.title}
      >
        <Input
          id="mls-title"
          placeholder="e.g. Milestone 2 — Final Screen Handoff"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          hasError={Boolean(errors.title)}
          autoFocus
        />
      </FormField>

      {/* 2. Project Selection & Due Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          id="mls-project"
          label="Associated Project"
          required
          error={errors.projectId}
        >
          <Select
            id="mls-project"
            value={formData.projectId}
            onChange={(e) => handleChange('projectId', e.target.value)}
            options={projectOptions}
            hasError={Boolean(errors.projectId)}
          />
        </FormField>

        <FormField
          id="mls-due-date"
          label="Target Due Date"
          required
          error={errors.dueDate}
        >
          <Input
            id="mls-due-date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            hasError={Boolean(errors.dueDate)}
          />
        </FormField>
      </div>

      {/* 3. Status */}
      <FormField id="mls-status" label="Milestone Status">
        <Select
          id="mls-status"
          value={formData.status}
          onChange={(e) =>
            handleChange('status', e.target.value as MilestoneStatus)
          }
          options={[
            { value: 'PENDING', label: 'Pending' },
            { value: 'IN_PROGRESS', label: 'In Progress' },
            { value: 'COMPLETED', label: 'Completed' },
          ]}
        />
      </FormField>

      {/* 4. Description */}
      <FormField id="mls-desc" label="Description & Scope" optional>
        <Textarea
          id="mls-desc"
          placeholder="Specify deliverables or client approval criteria for this milestone..."
          rows={3}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
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
          {isEditing ? 'Save Changes' : 'Create Milestone'}
        </Button>
      </ModalFooter>
    </form>
  );
}

export function MilestoneFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  projects,
}: MilestoneFormModalProps) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Milestone' : 'Add Project Milestone'}
      description={
        initialData
          ? 'Update milestone timeline, status, and project association.'
          : 'Define a major deliverable checkpoint for client sign-off.'
      }
      size="md"
    >
      <MilestoneFormContent
        key={initialData?.id || 'new-milestone'}
        initialData={initialData}
        projects={projects}
        onClose={onClose}
        onSave={onSave}
      />
    </Modal>
  );
}

export default MilestoneFormModal;

