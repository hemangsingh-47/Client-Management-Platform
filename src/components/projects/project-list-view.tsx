'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Dropdown } from '@/components/ui/dropdown';
import { EmptyState } from '@/components/ui/empty-state';
import { Project, getProjectClient } from '@/lib/mock-data/projects';
import { INITIAL_CLIENTS, Client } from '@/lib/mock-data/clients';
import { ProjectStatusBadge, ProjectPriorityBadge } from './project-badges';
import { formatINR } from '@/lib/utils';
import {
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  FolderKanban,
  SearchX,
  ExternalLink,
} from 'lucide-react';

export interface ProjectListViewProps {
  projects: Project[];
  clients?: Client[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onAddNew: () => void;
  onClearFilters: () => void;
  isFiltered: boolean;
}

export function ProjectListView({
  projects,
  clients = INITIAL_CLIENTS,
  onEdit,
  onDelete,
  onAddNew,
  onClearFilters,
  isFiltered,
}: ProjectListViewProps) {
  const router = useRouter();

  if (projects.length === 0) {
    if (isFiltered) {
      return (
        <EmptyState
          icon={<SearchX size={22} className="text-text-secondary" />}
          title="No matching projects found"
          description="Try adjusting your search criteria, status, or priority filters."
          action={
            <button
              type="button"
              onClick={onClearFilters}
              className="text-xs font-medium text-brand-forest dark:text-brand-sage hover:underline"
            >
              Clear all filters
            </button>
          }
        />
      );
    }

    return (
      <EmptyState
        icon={<FolderKanban size={22} className="text-brand-primary" />}
        title="No projects yet"
        description="Plan, organize deliverables, and track deadlines by adding your first project."
        action={
          <button
            type="button"
            onClick={onAddNew}
            className="inline-flex items-center justify-center rounded-lg bg-brand-primary px-3.5 py-2 text-xs font-medium text-white shadow-xs hover:bg-brand-primary-hover"
          >
            + Create First Project
          </button>
        }
      />
    );
  }

  return (
    <div className="relative rounded-xl border border-border bg-surface overflow-hidden shadow-xs">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[260px]">Project Name</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead className="w-32">Progress</TableHead>
            <TableHead className="text-right">Budget</TableHead>
            <TableHead className="w-12 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => {
            const client = getProjectClient(project.clientId, clients);

            return (
              <TableRow
                key={project.id}
                className="group cursor-pointer hover:bg-surface-hover/80 transition-colors"
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('button, a')) return;
                  router.push(`/projects/${project.id}`);
                }}
              >
                {/* Project Name */}
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <Link
                      href={`/projects/${project.id}`}
                      className="font-semibold text-text-primary group-hover:text-brand-forest dark:group-hover:text-brand-sage hover:underline transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {project.title}
                    </Link>
                    <span className="text-xs text-text-muted truncate max-w-[240px]">
                      {project.description}
                    </span>
                  </div>
                </TableCell>

                {/* Client */}
                <TableCell>
                  {client ? (
                    <Link
                      href={`/clients/${client.id}`}
                      className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-brand-forest dark:hover:text-brand-sage transition-colors font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="truncate max-w-[150px]">
                        {client.companyName || client.name}
                      </span>
                      <ExternalLink size={10} className="shrink-0 text-text-muted" />
                    </Link>
                  ) : (
                    <span className="text-xs text-text-muted">Direct Client</span>
                  )}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <ProjectStatusBadge status={project.status} size="sm" />
                </TableCell>

                {/* Priority */}
                <TableCell>
                  <ProjectPriorityBadge priority={project.priority} size="sm" />
                </TableCell>

                {/* Start Date */}
                <TableCell className="text-xs text-text-secondary whitespace-nowrap">
                  {project.startDate}
                </TableCell>

                {/* Deadline */}
                <TableCell className="text-xs text-text-secondary whitespace-nowrap">
                  {project.deadline}
                </TableCell>

                {/* Progress Bar */}
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-text-muted">
                      <span>{project.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden border border-border-subtle">
                      <div
                        className="h-full rounded-full bg-brand-primary transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </TableCell>

                {/* Budget */}
                <TableCell className="text-right font-medium text-xs sm:text-sm font-mono text-text-primary whitespace-nowrap">
                  {formatINR(project.budget)}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <Dropdown
                    align="right"
                    trigger={
                      <button
                        type="button"
                        aria-label={`Actions for ${project.title}`}
                        className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors focus:outline-none"
                      >
                        <MoreVertical size={16} />
                      </button>
                    }
                    items={[
                      {
                        id: 'view',
                        label: 'View Details',
                        icon: <Eye size={14} />,
                        onClick: () => router.push(`/projects/${project.id}`),
                      },
                      {
                        id: 'edit',
                        label: 'Edit Project',
                        icon: <Pencil size={14} />,
                        onClick: () => onEdit(project),
                      },
                      {
                        id: 'delete',
                        label: 'Delete Project',
                        icon: <Trash2 size={14} />,
                        destructive: true,
                        onClick: () => onDelete(project),
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
          Showing <strong className="text-text-primary">{projects.length}</strong> project{projects.length === 1 ? '' : 's'}
        </span>
        <span className="text-[11px] text-text-muted">
          Click any row to open project workspace
        </span>
      </div>
    </div>
  );
}

export default ProjectListView;
