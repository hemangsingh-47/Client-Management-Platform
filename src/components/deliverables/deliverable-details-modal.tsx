'use client';

import React from 'react';
import Link from 'next/link';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Deliverable, DeliverableStatus } from '@/types/deliverable';
import { Project } from '@/types/project';
import {
  Calendar,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  Activity,
  Sparkles,
} from 'lucide-react';

export interface DeliverableDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliverable: Deliverable | null;
  project?: Project;
  onStatusChange: (status: DeliverableStatus, note?: string) => void;
  onEdit: (d: Deliverable) => void;
}

export function DeliverableDetailsModal({
  isOpen,
  onClose,
  deliverable,
  project,
  onStatusChange,
  onEdit,
}: DeliverableDetailsModalProps) {
  if (!isOpen || !deliverable) return null;

  const getStatusBadge = (status: DeliverableStatus) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="success" size="md" dot>Approved</Badge>;
      case 'SUBMITTED':
        return <Badge variant="brand" size="md" dot>Submitted</Badge>;
      case 'REVISION_REQUIRED':
        return <Badge variant="warning" size="md" dot>Revision Required</Badge>;
      case 'PENDING':
      default:
        return <Badge variant="default" size="md" dot>Pending</Badge>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 flex-wrap">
          <span>{deliverable.title}</span>
          {deliverable.version && (
            <span className="text-xs px-2 py-0.5 rounded bg-surface-subtle border border-border text-text-muted font-mono font-normal">
              {deliverable.version}
            </span>
          )}
        </div>
      }
      description={
        project ? (
          <Link
            href={`/projects/${project.id}`}
            className="text-xs text-brand-forest dark:text-brand-sage hover:underline inline-flex items-center gap-1"
          >
            <span>Project: {project.title}</span>
            <ExternalLink size={11} />
          </Link>
        ) : (
          'Unassigned Project'
        )
      }
      size="lg"
    >
      <div className="space-y-5">
        {/* Top Status & Date Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-subtle border border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary font-medium">Status:</span>
            {getStatusBadge(deliverable.status)}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <Calendar size={13} className="text-text-muted" />
            <span>Submitted {deliverable.submissionDate}</span>
          </div>
        </div>

        {/* Quick Status Change Actions */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
            Review Actions
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              type="button"
              variant={deliverable.status === 'APPROVED' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onStatusChange('APPROVED', 'Approved by reviewer')}
              className="gap-1.5 text-xs cursor-pointer"
            >
              <CheckCircle2 size={13} />
              <span>Approve Deliverable</span>
            </Button>

            <Button
              type="button"
              variant={deliverable.status === 'REVISION_REQUIRED' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => onStatusChange('REVISION_REQUIRED', 'Revision requested')}
              className="gap-1.5 text-xs text-warning-text hover:bg-warning-bg cursor-pointer"
            >
              <AlertCircle size={13} />
              <span>Request Revision</span>
            </Button>

            <Button
              type="button"
              variant={deliverable.status === 'SUBMITTED' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => onStatusChange('SUBMITTED', 'Submitted for review')}
              className="gap-1.5 text-xs cursor-pointer"
            >
              <Clock size={13} />
              <span>Mark Submitted</span>
            </Button>
          </div>
        </div>

        {/* Scope Description */}
        <div className="space-y-1">
          <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
            Scope & Deliverable Description
          </span>
          <p className="text-xs sm:text-sm text-text-primary leading-relaxed bg-surface p-3 rounded-lg border border-border-subtle">
            {deliverable.description}
          </p>
        </div>

        {/* Attachment Card */}
        <div className="space-y-1">
          <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
            Mock Handover Attachment
          </span>
          <div className="p-3 rounded-lg bg-surface border border-border-subtle flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-text-primary">
                {deliverable.attachmentType}
              </span>
              <span className="text-text-muted">•</span>
              <span className="text-text-muted text-[11px]">External Mock Link</span>
            </div>

            {deliverable.attachmentUrl ? (
              <a
                href={deliverable.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-brand-forest dark:text-brand-sage hover:underline font-medium"
              >
                <span>Open Asset</span>
                <ExternalLink size={12} />
              </a>
            ) : (
              <span className="text-xs text-text-muted">No URL provided</span>
            )}
          </div>
        </div>

        {/* Notes */}
        {deliverable.notes && (
          <div className="space-y-1">
            <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
              Reviewer Notes
            </span>
            <div className="p-3 rounded-lg bg-brand-sage-light/30 border border-brand-sage/20 text-xs text-text-primary leading-relaxed italic">
              &ldquo;{deliverable.notes}&rdquo;
            </div>
          </div>
        )}

        {/* Activity History */}
        <div className="space-y-2 pt-2 border-t border-border-subtle">
          <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
            <Activity size={13} />
            <span>Submission & Review History</span>
          </span>

          <div className="relative pl-5 border-l border-border-subtle space-y-3 pt-1">
            {(deliverable.activity || [
              { id: '1', timestamp: deliverable.submissionDate, action: 'Deliverable submitted' },
            ]).map((act) => (
              <div key={act.id} className="relative text-xs">
                <div className="absolute -left-[25px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-surface border border-border text-text-muted">
                  <Sparkles size={9} />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-text-primary">{act.action}</span>
                  <span className="text-[10px] text-text-muted">{act.timestamp}</span>
                </div>
                {act.note && <p className="text-[11px] text-text-secondary mt-0.5">{act.note}</p>}
              </div>
            ))}
          </div>
        </div>

        <ModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              onClose();
              onEdit(deliverable);
            }}
          >
            Edit Deliverable
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
}

export default DeliverableDetailsModal;

