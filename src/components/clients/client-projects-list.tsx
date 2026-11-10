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
import { Badge, BadgeVariant } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { formatINR } from '@/lib/utils';
import { ClientProject, ClientProjectStatus } from '@/lib/mock-data/clients';
import { Briefcase, ArrowUpRight } from 'lucide-react';

export interface ClientProjectsListProps {
  projects?: ClientProject[];
}

export function ClientProjectsList({ projects = [] }: ClientProjectsListProps) {
  if (projects.length === 0) {
    return (
      <EmptyState
        icon={<Briefcase size={20} className="text-text-secondary" />}
        title="No associated projects"
        description="There are currently no projects assigned to this client."
      />
    );
  }

  const getStatusVariant = (status: ClientProjectStatus): BadgeVariant => {
    switch (status) {
      case 'In Progress':
        return 'brand';
      case 'Completed':
        return 'success';
      case 'Planning':
        return 'info';
      case 'On Hold':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-xs">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead className="text-right">Budget</TableHead>
            <TableHead className="w-36">Progress</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id} className="hover:bg-surface-hover/80 transition-colors">
              <TableCell className="font-medium">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-1 font-semibold text-text-primary hover:text-brand-forest dark:hover:text-brand-sage transition-colors"
                >
                  <span>{project.name}</span>
                  <ArrowUpRight size={13} className="text-text-muted" />
                </Link>
              </TableCell>

              <TableCell>
                <Badge variant={getStatusVariant(project.status)} size="sm" dot>
                  {project.status}
                </Badge>
              </TableCell>

              <TableCell className="text-xs text-text-secondary">
                {project.deadline}
              </TableCell>

              <TableCell className="text-right font-medium text-xs sm:text-sm font-mono text-text-primary">
                {formatINR(project.budget)}
              </TableCell>

              <TableCell>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-text-muted">
                    <span>Completion</span>
                    <span className="font-medium text-text-primary">{project.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden border border-border-subtle">
                    <div
                      className="h-full rounded-full bg-brand-primary transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ClientProjectsList;
