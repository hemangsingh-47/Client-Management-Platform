'use client';

import React, { useState } from 'react';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';

export interface DeliverableDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deliverableTitle: string;
}

export function DeliverableDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  deliverableTitle,
}: DeliverableDeleteModalProps) {
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
      title="Delete Deliverable"
      size="sm"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-bg text-error-text border border-error-border">
            <AlertTriangle size={20} strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">
              Are you sure you want to delete <span className="font-semibold text-text-primary">{deliverableTitle}</span>?
            </p>
            <p className="mt-1 text-xs text-text-secondary leading-relaxed">
              This action cannot be undone. Any recorded client sign-offs or review notes for this deliverable will be removed.
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
            Delete Deliverable
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
}

export default DeliverableDeleteModal;

