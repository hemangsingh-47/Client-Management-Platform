'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dropdown } from '@/components/ui/dropdown';
import { EmptyState } from '@/components/ui/empty-state';
import { Milestone } from '@/types/milestone';
import { Project } from '@/types/project';
import {
  CheckCircle2,
  Circle,
  MoreVertical,
  Pencil,
  Trash2,
  Flag,
  Calendar,
  ExternalLink,
} from 'lucide-react';

export interface MilestoneListProps {
  milestones: Milestone[];
  projects: Project[];
  onToggleComplete: (id: string) => void;
  onEdit: (milestone: Milestone) => void;
  onDelete: (milestone: Milestone) => void;
  onAddNew: () => void;
}

export function MilestoneList({
  milestones,
  projects,
  onToggleComplete,
  onEdit,
  onDelete,
  onAddNew,
}: MilestoneListProps) {
  if (milestones.length === 0) {
    return (
      <EmptyState
        icon={<Flag size={22} className="text-brand-primary" />}
        title="No project milestones defined"
        description="Milestones represent major deliverables and phase completions across your client engagements."
        action={
          <button
            type="button"
            onClick={onAddNew}
            className="inline-flex items-center justify-center rounded-lg bg-brand-primary px-3.5 py-2 text-xs font-medium text-white shadow-xs hover:bg-brand-primary-hover cursor-pointer"
          >
            + Add First Milestone
          </button>
        }
      />
    );
  }

  // Group milestones by project
  const projectGroups = projects
    .map((project) => ({
      project,
      milestones: milestones.filter((m) => m.projectId === project.id),
    }))
    .filter((group) => group.milestones.length > 0);

  const getMilestoneBadge = (status: Milestone['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="success" size="sm" dot>Completed</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="brand" size="sm" dot>In Progress</Badge>;
      case 'PENDING':
      default:
        return <Badge variant="default" size="sm" dot>Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {projectGroups.map(({ project, milestones: projectMilestones }) => {
        const completedCount = projectMilestones.filter(
          (m) => m.status === 'COMPLETED'
        ).length;
        const percent = Math.round(
          (completedCount / projectMilestones.length) * 100
        );

        return (
          <Card key={project.id} className="p-5 overflow-hidden">
            {/* Project Header in Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-border-subtle">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-semibold text-text-primary">
                    {project.title}
                  </h3>
                  <Link
                    href={`/projects/${project.id}`}
                    className="text-xs text-brand-forest dark:text-brand-sage hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>View Project</span>
                    <ExternalLink size={11} />
                  </Link>
                </div>
                <p className="text-xs text-text-muted">
                  {completedCount} of {projectMilestones.length} milestones completed ({percent}%)
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full sm:w-48 space-y-1">
                <div className="h-2 w-full rounded-full bg-surface-subtle border border-border-subtle overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-primary transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Milestones List */}
            <div className="divide-y divide-border-subtle">
              {projectMilestones.map((m) => {
                const isDone = m.status === 'COMPLETED';

                return (
                  <div
                    key={m.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 first:pt-4 last:pb-0 hover:bg-surface-hover/40 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => onToggleComplete(m.id)}
                        className="mt-0.5 text-text-muted hover:text-brand-primary focus:outline-none cursor-pointer transition-colors shrink-0"
                        title={isDone ? 'Mark Incomplete' : 'Mark Completed'}
                      >
                        {isDone ? (
                          <CheckCircle2 size={18} className="text-success-text" />
                        ) : (
                          <Circle size={18} />
                        )}
                      </button>

                      <div className="space-y-0.5">
                        <span
                          className={
                            isDone
                              ? 'text-xs sm:text-sm font-semibold text-text-muted line-through'
                              : 'text-xs sm:text-sm font-semibold text-text-primary'
                          }
                        >
                          {m.title}
                        </span>
                        {m.description && (
                          <p className="text-xs text-text-muted leading-relaxed">
                            {m.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-7 sm:ml-0">
                      <span className="flex items-center gap-1 text-xs text-text-secondary whitespace-nowrap">
                        <Calendar size={12} className="text-text-muted" />
                        <span>Due {m.dueDate}</span>
                      </span>

                      {getMilestoneBadge(m.status)}

                      <Dropdown
                        align="right"
                        trigger={
                          <button
                            type="button"
                            aria-label={`Actions for ${m.title}`}
                            className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors focus:outline-none cursor-pointer"
                          >
                            <MoreVertical size={15} />
                          </button>
                        }
                        items={[
                          {
                            id: 'toggle',
                            label: isDone ? 'Mark Pending' : 'Mark Completed',
                            icon: isDone ? <Circle size={14} /> : <CheckCircle2 size={14} />,
                            onClick: () => onToggleComplete(m.id),
                          },
                          {
                            id: 'edit',
                            label: 'Edit Milestone',
                            icon: <Pencil size={14} />,
                            onClick: () => onEdit(m),
                          },
                          {
                            id: 'delete',
                            label: 'Delete Milestone',
                            icon: <Trash2 size={14} />,
                            destructive: true,
                            onClick: () => onDelete(m),
                          },
                        ]}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default MilestoneList;

