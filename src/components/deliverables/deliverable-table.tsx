'use client';

import React from 'react';
import Link from 'next/link';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dropdown } from '@/components/ui/dropdown';
import { EmptyState } from '@/components/ui/empty-state';
import { Deliverable, DeliverableStatus } from '@/types/deliverable';
import { Project } from '@/types/project';
import {
  MoreVertical,
  Pencil,
  Trash2,
  ExternalLink,
  PackageCheck,
  SearchX,
  Eye,
  FileCode,
  FileText,
  Archive,
  Link2,
} from 'lucide-react';

export interface DeliverableTableProps {
  deliverables: Deliverable[];
  projects: Project[];
  onViewDetails: (d: Deliverable) => void;
  onEdit: (d: Deliverable) => void;
  onDelete: (d: Deliverable) => void;
  onAddNew: () => void;
  onClearFilters: () => void;
  isFiltered: boolean;
}

export function DeliverableTable({
  deliverables,
  projects,
  onViewDetails,
  onEdit,
  onDelete,
  onAddNew,
  onClearFilters,
  isFiltered,
}: DeliverableTableProps) {
  if (deliverables.length === 0) {
    if (isFiltered) {
      return (
        <EmptyState
          icon={<SearchX size={22} className="text-text-secondary" />}
          title="No matching deliverables found"
          description="Try adjusting your search criteria, project, or status filters."
          action={
            <button
              type="button"
              onClick={onClearFilters}
              className="text-xs font-medium text-brand-forest dark:text-brand-sage hover:underline cursor-pointer"
            >
              Clear all filters
            </button>
          }
        />
      );
    }

    return (
      <EmptyState
        icon={<PackageCheck size={22} className="text-brand-primary" />}
        title="No deliverables created"
        description="Share work packages, gather client approval signatures, and track asset handovers."
        action={
          <button
            type="button"
            onClick={onAddNew}
            className="inline-flex items-center justify-center rounded-lg bg-brand-primary px-3.5 py-2 text-xs font-medium text-white shadow-xs hover:bg-brand-primary-hover cursor-pointer"
          >
            + Create First Deliverable
          </button>
        }
      />
    );
  }

  const getStatusBadge = (status: DeliverableStatus) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="success" size="sm" dot>Approved</Badge>;
      case 'SUBMITTED':
        return <Badge variant="brand" size="sm" dot>Submitted</Badge>;
      case 'REVISION_REQUIRED':
        return <Badge variant="warning" size="sm" dot>Revision Required</Badge>;
      case 'PENDING':
      default:
        return <Badge variant="default" size="sm" dot>Pending</Badge>;
    }
  };

  const getAttachmentIcon = (type: Deliverable['attachmentType']) => {
    switch (type) {
      case 'Figma':
        return <FileCode size={13} className="text-text-muted shrink-0" />;
      case 'GitHub':
        return <FileCode size={13} className="text-text-muted shrink-0" />;
      case 'Archive':
        return <Archive size={13} className="text-text-muted shrink-0" />;
      case 'Document':
        return <FileText size={13} className="text-text-muted shrink-0" />;
      case 'External Link':
      default:
        return <Link2 size={13} className="text-text-muted shrink-0" />;
    }
  };

  return (
    <div className="relative rounded-xl border border-border bg-surface overflow-hidden shadow-xs">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Deliverable Name</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Submission Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Attachment</TableHead>
            <TableHead className="w-12 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliverables.map((del) => {
            const project = projects.find((p) => p.id === del.projectId);

            return (
              <TableRow
                key={del.id}
                className="hover:bg-surface-hover/80 transition-colors group cursor-pointer"
                onClick={() => onViewDetails(del)}
              >
                {/* Deliverable Name */}
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-text-primary text-xs sm:text-sm group-hover:text-brand-forest dark:group-hover:text-brand-sage transition-colors">
                        {del.title}
                      </span>
                      {del.version && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-subtle border border-border text-text-muted font-mono">
                          {del.version}
                        </span>
                      )}
                    </div>
                    {del.description && (
                      <span className="text-xs text-text-muted truncate max-w-sm mt-0.5">
                        {del.description}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Project */}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {project ? (
                    <Link
                      href={`/projects/${project.id}`}
                      className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-brand-forest dark:hover:text-brand-sage transition-colors font-medium"
                    >
                      <span className="truncate max-w-[150px]">{project.title}</span>
                      <ExternalLink size={10} className="shrink-0 text-text-muted" />
                    </Link>
                  ) : (
                    <span className="text-xs text-text-muted">Unassigned</span>
                  )}
                </TableCell>

                {/* Submission Date */}
                <TableCell className="text-xs text-text-secondary whitespace-nowrap">
                  {del.submissionDate}
                </TableCell>

                {/* Status */}
                <TableCell>
                  {getStatusBadge(del.status)}
                </TableCell>

                {/* Attachment */}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {del.attachmentUrl ? (
                    <a
                      href={del.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-brand-forest dark:text-brand-sage hover:underline bg-surface-subtle px-2 py-1 rounded-md border border-border-subtle"
                      title={del.attachmentUrl}
                    >
                      {getAttachmentIcon(del.attachmentType)}
                      <span className="truncate max-w-[120px]">{del.attachmentType}</span>
                      <ExternalLink size={10} className="shrink-0 text-text-muted" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                      {getAttachmentIcon(del.attachmentType)}
                      <span>{del.attachmentType}</span>
                    </span>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <Dropdown
                    align="right"
                    trigger={
                      <button
                        type="button"
                        aria-label={`Actions for ${del.title}`}
                        className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors focus:outline-none cursor-pointer"
                      >
                        <MoreVertical size={16} />
                      </button>
                    }
                    items={[
                      {
                        id: 'view',
                        label: 'View Details',
                        icon: <Eye size={14} />,
                        onClick: () => onViewDetails(del),
                      },
                      {
                        id: 'edit',
                        label: 'Edit Deliverable',
                        icon: <Pencil size={14} />,
                        onClick: () => onEdit(del),
                      },
                      {
                        id: 'delete',
                        label: 'Delete Deliverable',
                        icon: <Trash2 size={14} />,
                        destructive: true,
                        onClick: () => onDelete(del),
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Footer Info */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface-subtle border-t border-border-subtle text-xs text-text-secondary">
        <span>
          Showing <strong className="text-text-primary">{deliverables.length}</strong> deliverable{deliverables.length === 1 ? '' : 's'}
        </span>
        <span className="text-[11px] text-text-muted">
          Click any row to open deliverable review details
        </span>
      </div>
    </div>
  );
}

export default DeliverableTable;

