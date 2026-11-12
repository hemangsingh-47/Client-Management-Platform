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
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Project } from '@/types/project';
import { Payment } from '@/types/payment';
import { Client } from '@/lib/mock-data/clients';
import { getProjectFinancialSummary } from '@/lib/utils/payment-utils';
import { formatINR } from '@/lib/utils';
import { ExternalLink, FolderGit2 } from 'lucide-react';

export interface ProjectPerformanceTableProps {
  projects: Project[];
  payments: Payment[];
  clients: Client[];
}

export function ProjectPerformanceTable({
  projects,
  payments,
  clients,
}: ProjectPerformanceTableProps) {
  const getClientName = (clientId: string) => {
    const c = clients.find((client) => client.id === clientId);
    return c?.companyName || c?.name || 'Unknown Client';
  };

  const getStatusBadgeVariant = (status: Project['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'IN_PROGRESS':
        return 'info';
      case 'ON_HOLD':
        return 'warning';
      case 'PLANNING':
        return 'default';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card className="p-0 overflow-hidden shadow-xs">
      <div className="p-4 sm:p-5 border-b border-border-subtle bg-surface">
        <h3 className="text-base font-semibold text-text-primary tracking-tight">
          Project Financial &amp; Progress Summary
        </h3>
        <p className="text-xs text-text-secondary mt-0.5">
          Detailed breakdown of allocated budget, collected milestones, and delivery completion.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project &amp; Client</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Budget</TableHead>
            <TableHead className="text-right">Paid</TableHead>
            <TableHead className="text-right">Outstanding</TableHead>
            <TableHead className="w-36">Progress</TableHead>
            <TableHead className="w-12 text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-text-secondary">
                No projects found matching the selected report criteria.
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project) => {
              const fin = getProjectFinancialSummary(project, payments);
              const clientName = getClientName(project.clientId);

              return (
                <TableRow key={project.id} className="hover:bg-surface-subtle transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-surface-subtle border border-border flex items-center justify-center shrink-0 text-text-secondary">
                        <FolderGit2 size={16} />
                      </div>
                      <div>
                        <Link
                          href={`/projects/${project.id}`}
                          className="font-medium text-text-primary hover:text-brand-forest dark:hover:text-brand-sage transition-colors text-sm"
                        >
                          {project.title}
                        </Link>
                        <div className="text-xs text-text-muted">{clientName}</div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(project.status)} size="sm">
                      {project.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right font-mono font-medium text-text-primary text-sm">
                    {formatINR(fin.budget)}
                  </TableCell>

                  <TableCell className="text-right font-mono text-success-text text-sm font-medium">
                    {formatINR(fin.totalPaid)}
                  </TableCell>

                  <TableCell className="text-right font-mono text-warning-text text-sm font-medium">
                    {fin.outstandingBalance > 0 ? formatINR(fin.outstandingBalance) : '₹0'}
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-text-secondary">
                        <span>{project.progress}%</span>
                      </div>
                      <ProgressBar value={project.progress} size="sm" variant="brand" />
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <Link
                      href={`/projects/${project.id}`}
                      className="p-1 rounded-md text-text-muted hover:text-text-primary transition-colors inline-flex"
                      title="View Project Details"
                    >
                      <ExternalLink size={14} />
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </Card>
  );
}

export default ProjectPerformanceTable;
