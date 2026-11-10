'use client';

import React, { useState } from 'react';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/ui/form-field';
import { Select } from '@/components/ui/select';
import {
  Project,
  ProjectStatus,
  ProjectPriority,
} from '@/lib/mock-data/projects';
import { INITIAL_CLIENTS, Client } from '@/lib/mock-data/clients';
import { Loader2 } from 'lucide-react';

export interface ProjectFormData {
  title: string;
  clientId: string;
  description: string;
  budget: number;
  startDate: string;
  deadline: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  notes: string;
}

export interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProjectFormData) => void;
  initialData?: Project | null;
  clients?: Client[];
}

interface FormContentProps {
  initialData?: Project | null;
  clients: Client[];
  onClose: () => void;
  onSave: (data: ProjectFormData) => void;
}

function ProjectFormContent({
  initialData,
  clients,
  onClose,
  onSave,
}: FormContentProps) {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState<ProjectFormData>(() => ({
    title: initialData?.title || '',
    clientId: initialData?.clientId || (clients[0]?.id || ''),
    description: initialData?.description || '',
    budget: initialData?.budget ?? 25000,
    startDate: initialData?.startDate || '2026-11-10',
    deadline: initialData?.deadline || '2026-12-10',
    status: initialData?.status || 'IN_PROGRESS',
    priority: initialData?.priority || 'MEDIUM',
    progress: initialData?.progress ?? 0,
    notes: initialData?.notes || '',
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = <K extends keyof ProjectFormData>(
    field: K,
    value: ProjectFormData[K]
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
      newErrors.title = 'Project title is required.';
    }

    if (!formData.clientId) {
      newErrors.clientId = 'Please select a client.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required.';
    }

    if (isNaN(formData.budget) || formData.budget < 0) {
      newErrors.budget = 'Budget must be a non-negative number.';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required.';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required.';
    } else if (
      formData.startDate &&
      new Date(formData.deadline) < new Date(formData.startDate)
    ) {
      newErrors.deadline = 'Deadline cannot be earlier than start date.';
    }

    if (
      isNaN(formData.progress) ||
      formData.progress < 0 ||
      formData.progress > 100
    ) {
      newErrors.progress = 'Progress must be between 0 and 100%.';
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
        notes: formData.notes.trim(),
        budget: Number(formData.budget),
        progress: Number(formData.progress),
      });
      setIsSubmitting(false);
      onClose();
    }, 250);
  };

  const clientOptions = clients.map((c) => ({
    value: c.id,
    label: c.companyName ? `${c.name} (${c.companyName})` : c.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 1. Project Title & Client */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          id="project-title"
          label="Project Title"
          required
          error={errors.title}
        >
          <Input
            id="project-title"
            placeholder="e.g. Website Redesign"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            hasError={Boolean(errors.title)}
            autoFocus
          />
        </FormField>

        <FormField
          id="project-client"
          label="Assigned Client"
          required
          error={errors.clientId}
        >
          <Select
            id="project-client"
            value={formData.clientId}
            onChange={(e) => handleChange('clientId', e.target.value)}
            options={clientOptions}
            hasError={Boolean(errors.clientId)}
          />
        </FormField>
      </div>

      {/* 2. Project Description */}
      <FormField
        id="project-description"
        label="Project Scope & Description"
        required
        error={errors.description}
      >
        <Textarea
          id="project-description"
          placeholder="Brief overview of the project scope, deliverables, and targets..."
          rows={2}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          hasError={Boolean(errors.description)}
        />
      </FormField>

      {/* 3. Budget & Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          id="project-budget"
          label="Total Budget (₹)"
          required
          error={errors.budget}
        >
          <Input
            id="project-budget"
            type="number"
            min={0}
            step={1000}
            placeholder="50000"
            value={formData.budget === 0 ? '' : formData.budget}
            onChange={(e) =>
              handleChange('budget', parseFloat(e.target.value) || 0)
            }
            hasError={Boolean(errors.budget)}
          />
        </FormField>

        <FormField
          id="project-progress"
          label={`Progress (${formData.progress}%)`}
          optional
          error={errors.progress}
        >
          <div className="flex items-center gap-3 pt-1">
            <input
              id="project-progress"
              type="range"
              min={0}
              max={100}
              step={5}
              value={formData.progress}
              onChange={(e) =>
                handleChange('progress', parseInt(e.target.value, 10))
              }
              className="w-full accent-brand-primary cursor-pointer"
            />
            <span className="text-xs font-mono font-medium text-text-primary w-10 text-right">
              {formData.progress}%
            </span>
          </div>
        </FormField>
      </div>

      {/* 4. Start Date & Deadline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          id="project-start-date"
          label="Start Date"
          required
          error={errors.startDate}
        >
          <Input
            id="project-start-date"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            hasError={Boolean(errors.startDate)}
          />
        </FormField>

        <FormField
          id="project-deadline"
          label="Deadline"
          required
          error={errors.deadline}
        >
          <Input
            id="project-deadline"
            type="date"
            value={formData.deadline}
            onChange={(e) => handleChange('deadline', e.target.value)}
            hasError={Boolean(errors.deadline)}
          />
        </FormField>
      </div>

      {/* 5. Status & Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField id="project-status" label="Initial Status" optional>
          <Select
            id="project-status"
            value={formData.status}
            onChange={(e) =>
              handleChange('status', e.target.value as ProjectStatus)
            }
            options={[
              { value: 'PLANNING', label: 'Planning' },
              { value: 'IN_PROGRESS', label: 'In Progress' },
              { value: 'ON_HOLD', label: 'On Hold' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'CANCELLED', label: 'Cancelled' },
            ]}
          />
        </FormField>

        <FormField id="project-priority" label="Priority" optional>
          <Select
            id="project-priority"
            value={formData.priority}
            onChange={(e) =>
              handleChange('priority', e.target.value as ProjectPriority)
            }
            options={[
              { value: 'LOW', label: 'Low Priority' },
              { value: 'MEDIUM', label: 'Medium Priority' },
              { value: 'HIGH', label: 'High Priority' },
            ]}
          />
        </FormField>
      </div>

      {/* 6. Notes */}
      <FormField
        id="project-notes"
        label="Internal Notes & Terms"
        optional
        hint="Key milestones, client communication notes, or sprint guidelines."
      >
        <Textarea
          id="project-notes"
          placeholder="Add internal notes, milestone breakdowns, or special client instructions..."
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
          {isEditing ? 'Save Changes' : 'Create Project'}
        </Button>
      </ModalFooter>
    </form>
  );
}

export function ProjectFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  clients = INITIAL_CLIENTS,
}: ProjectFormModalProps) {
  if (!isOpen) return null;

  const isEditing = Boolean(initialData);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Project Details' : 'Create New Project'}
      description={
        isEditing
          ? 'Update project scope, timelines, budget, and sprint completion.'
          : 'Define project scope, assign client, set budget and delivery milestones.'
      }
      size="lg"
    >
      <ProjectFormContent
        key={initialData?.id || 'new-project'}
        initialData={initialData}
        clients={clients}
        onClose={onClose}
        onSave={onSave}
      />
    </Modal>
  );
}

export default ProjectFormModal;
