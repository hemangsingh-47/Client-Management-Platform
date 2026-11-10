'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Dropdown } from '@/components/ui/dropdown';
import { Button } from '@/components/ui/button';
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
  Calendar,
  CreditCard,
  Building2,
  ArrowRight,
  FolderKanban,
  SearchX,
} from 'lucide-react';

export interface ProjectGridViewProps {
  projects: Project[];
  clients?: Client[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onAddNew: () => void;
  onClearFilters: () => void;
  isFiltered: boolean;
}

export function ProjectGridView({
  projects,
  clients = INITIAL_CLIENTS,
  onEdit,
  onDelete,
  onAddNew,
  onClearFilters,
  isFiltered,
}: ProjectGridViewProps) {
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
          <Button variant="primary" size="sm" onClick={onAddNew}>
            + Create First Project
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => {
        const client = getProjectClient(project.clientId, clients);

        return (
          <Card
            key={project.id}
            className="flex flex-col justify-between p-5 hover:border-brand-primary/40 hover:shadow-xs transition-all group"
          >
            {/* Top Row: Title, Client & Actions */}
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <Link
                    href={`/projects/${project.id}`}
                    className="text-base font-semibold text-text-primary group-hover:text-brand-forest dark:group-hover:text-brand-sage transition-colors line-clamp-1"
                  >
                    {project.title}
                  </Link>

                  {client && (
                    <Link
                      href={`/clients/${client.id}`}
                      className="flex items-center gap-1 text-xs text-text-secondary hover:text-brand-forest dark:hover:text-brand-sage transition-colors line-clamp-1"
                    >
                      <Building2 size={12} className="shrink-0 text-text-muted" />
                      <span>{client.companyName || client.name}</span>
                    </Link>
                  )}
                </div>

                <div className="shrink-0">
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
                </div>
              </div>

              {/* Badges: Status and Priority */}
              <div className="flex items-center gap-2 mt-3">
                <ProjectStatusBadge status={project.status} size="sm" />
                <ProjectPriorityBadge priority={project.priority} size="sm" />
              </div>

              {/* Description */}
              <p className="mt-3 text-xs text-text-secondary line-clamp-2 leading-relaxed">
                {project.description}
              </p>

              {/* Progress Bar & Percentage */}
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted text-[11px]">Sprint Progress</span>
                  <span className="font-semibold text-text-primary font-mono text-xs">
                    {project.progress}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-surface-subtle overflow-hidden border border-border-subtle">
                  <div
                    className="h-full rounded-full bg-brand-primary transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Row: Deadline, Budget & View Action */}
            <div className="mt-5 pt-3.5 border-t border-border-subtle flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-text-muted text-[11px]">
                  <Calendar size={11} className="shrink-0" />
                  <span>Due {project.deadline}</span>
                </div>
                <div className="flex items-center gap-1.5 text-text-primary font-mono font-semibold">
                  <CreditCard size={11} className="shrink-0 text-text-muted" />
                  <span>{formatINR(project.budget)}</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/projects/${project.id}`)}
                className="text-xs text-brand-forest dark:text-brand-sage hover:bg-brand-sage-light/30 h-8 px-2.5 gap-1 font-medium"
              >
                <span>Details</span>
                <ArrowRight size={12} />
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default ProjectGridView;
