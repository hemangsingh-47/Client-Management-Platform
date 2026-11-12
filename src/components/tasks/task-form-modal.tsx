'use client';

import React, { useState } from 'react';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/ui/form-field';
import { Select } from '@/components/ui/select';
import { Task, TaskStatus } from '@/types/task';
import { Project, ProjectPriority } from '@/types/project';
import { Loader2 } from 'lucide-react';

export interface TaskFormData {
  title: string;
  description: string;
  projectId: string;
  dueDate: string;
  priority: ProjectPriority;
  status: TaskStatus;
}

export interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TaskFormData) => void;
  initialData?: Task | null;
  projects: Project[];
}

interface FormContentProps {
  initialData?: Task | null;
  projects: Project[];
  onClose: () => void;
  onSave: (data: TaskFormData) => void;
}

function TaskFormContent({
  initialData,
  projects,
  onClose,
  onSave,
}: FormContentProps) {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState<TaskFormData>(() => ({
    title: initialData?.title || '',
    description: initialData?.description || '',
    projectId: initialData?.projectId || (projects[0]?.id || ''),
    dueDate: initialData?.dueDate || '2026-11-20',
    priority: initialData?.priority || 'MEDIUM',
    status: initialData?.status || 'TODO',
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = <K extends keyof TaskFormData>(
    field: K,
    value: TaskFormData[K]
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
      newErrors.title = 'Task title is required.';
    }

    if (!formData.projectId) {
      newErrors.projectId = 'Please select a project.';
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
      {/* 1. Task Title */}
      <FormField
        id="task-title"
        label="Task Title"
        required
        error={errors.title}
      >
        <Input
          id="task-title"
          placeholder="e.g. Design responsive mobile hero section"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          hasError={Boolean(errors.title)}
          autoFocus
        />
      </FormField>

      {/* 2. Project Selection & Due Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          id="task-project"
          label="Related Project"
          required
          error={errors.projectId}
        >
          <Select
            id="task-project"
            value={formData.projectId}
            onChange={(e) => handleChange('projectId', e.target.value)}
            options={projectOptions}
            hasError={Boolean(errors.projectId)}
          />
        </FormField>

        <FormField
          id="task-due-date"
          label="Due Date"
          required
          error={errors.dueDate}
        >
          <Input
            id="task-due-date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            hasError={Boolean(errors.dueDate)}
          />
        </FormField>
      </div>

      {/* 3. Priority & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField id="task-priority" label="Priority">
          <Select
            id="task-priority"
            value={formData.priority}
            onChange={(e) =>
              handleChange('priority', e.target.value as ProjectPriority)
            }
            options={[
              { value: 'LOW', label: 'Low' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'HIGH', label: 'High' },
            ]}
          />
        </FormField>

        <FormField id="task-status" label="Status">
          <Select
            id="task-status"
            value={formData.status}
            onChange={(e) =>
              handleChange('status', e.target.value as TaskStatus)
            }
            options={[
              { value: 'TODO', label: 'To Do' },
              { value: 'IN_PROGRESS', label: 'In Progress' },
              { value: 'COMPLETED', label: 'Completed' },
            ]}
          />
        </FormField>
      </div>

      {/* 4. Description */}
      <FormField id="task-desc" label="Task Notes & Scope" optional>
        <Textarea
          id="task-desc"
          placeholder="Add details, acceptance criteria, or asset links..."
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
          {isEditing ? 'Save Changes' : 'Create Task'}
        </Button>
      </ModalFooter>
    </form>
  );
}

export function TaskFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  projects,
}: TaskFormModalProps) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Task' : 'Add New Task'}
      description={
        initialData
          ? 'Update task timeline, status, and project assignment.'
          : 'Create a deliverable task to track sprint progress.'
      }
      size="md"
    >
      <TaskFormContent
        key={initialData?.id || 'new-task'}
        initialData={initialData}
        projects={projects}
        onClose={onClose}
        onSave={onSave}
      />
    </Modal>
  );
}

export default TaskFormModal;

