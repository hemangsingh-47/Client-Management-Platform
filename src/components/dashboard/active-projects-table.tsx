'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge, BadgeVariant } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { formatINR } from '@/lib/utils';
import { useAppContext } from '@/context/app-context';
import { ProjectStatus } from '@/types/project';
import { ArrowUpRight, Briefcase } from 'lucide-react';

export function ActiveProjectsTable() {
  const { projects, clients } = useAppContext();

  const getStatusBadgeVariant = (status: ProjectStatus): BadgeVariant => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'brand';
      case 'PLANNING':
        return 'warning';
      case 'ON_HOLD':
        return 'default';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getClientName = (clientId: string) => {
    const c = clients.find((client) => client.id === clientId);
    return c?.companyName || c?.name || 'Client';
  };

  const displayProjects = projects.slice(0, 5);

  return (
    <Card className="p-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border-subtle bg-surface">
        <div>
          <h2 className="text-base font-semibold text-text-primary tracking-tight">
            Active Projects
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Deliverable sprints and client milestones in progress
          </p>
        </div>

        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-xs font-medium text-brand-primary hover:underline group"
        >
          <span>View all</span>
          <ArrowUpRight
            size={13}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </Link>
      </div>

      {/* Projects Table or Empty State */}
      {displayProjects.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-subtle border-b border-border-subtle text-[11px] uppercase tracking-wider text-text-secondary font-medium select-none">
              <tr>
                <th className="py-2.5 px-4 sm:px-5">Project</th>
                <th className="py-2.5 px-3">Client</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Deadline</th>
                <th className="py-2.5 px-3 w-32">Progress</th>
                <th className="py-2.5 px-4 sm:px-5 text-right">Budget</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle bg-surface">
              {displayProjects.map((proj) => (
                <tr
                  key={proj.id}
                  className="hover:bg-surface-hover/70 transition-colors group cursor-pointer"
                >
                  {/* Project Title */}
                  <td className="py-3 px-4 sm:px-5">
                    <Link href={`/projects/${proj.id}`} className="block">
                      <span className="font-medium text-text-primary group-hover:text-brand-primary transition-colors">
                        {proj.title}
                      </span>
                    </Link>
                  </td>

                  {/* Client */}
                  <td className="py-3 px-3 text-xs text-text-secondary">
                    {getClientName(proj.clientId)}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-3">
                    <Badge variant={getStatusBadgeVariant(proj.status)} size="sm" dot>
                      {proj.status.replace('_', ' ')}
                    </Badge>
                  </td>

                  {/* Deadline */}
                  <td className="py-3 px-3 text-xs text-text-muted whitespace-nowrap">
                    {proj.deadline}
                  </td>

                  {/* Progress Bar */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-full bg-surface-subtle border border-border-subtle rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-primary rounded-full transition-all duration-300"
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-text-muted shrink-0 w-8 text-right">
                        {proj.progress}%
                      </span>
                    </div>
                  </td>

                  {/* Budget */}
                  <td className="py-3 px-4 sm:px-5 text-right font-medium text-xs text-text-primary whitespace-nowrap">
                    {formatINR(proj.budget)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6">
          <EmptyState
            icon={<Briefcase size={20} className="text-text-muted" />}
            title="No active projects"
            description="Create your first client engagement to monitor milestones and deliverables."
          />
        </div>
      )}
    </Card>
  );
}

export default ActiveProjectsTable;
