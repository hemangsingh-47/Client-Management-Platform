'use client';

import React, { useState } from 'react';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';

export interface TaskDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskTitle: string;
}

export function TaskDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  taskTitle,
}: TaskDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onConfirm();
      setIsDeleting(false);
      onClose();
    }, 200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Task"
      size="sm"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-bg text-error-text border border-error-border">
            <AlertTriangle size={20} strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">
              Are you sure you want to delete <span className="font-semibold text-text-primary">{taskTitle}</span>?
            </p>
            <p className="mt-1 text-xs text-text-secondary leading-relaxed">
              This action cannot be undone. Removing this task will update the associated project completion progress.
            </p>
          </div>
        </div>

        <ModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Task
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
}

export default TaskDeleteModal;

