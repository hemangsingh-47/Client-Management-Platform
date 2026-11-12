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
import { Client } from '@/lib/mock-data/clients';
import { Project } from '@/types/project';
import { Payment } from '@/types/payment';
import { getClientFinancialSummary } from '@/lib/utils/payment-utils';
import { formatINR } from '@/lib/utils';
import { Building2, ExternalLink } from 'lucide-react';

export interface ClientPerformanceTableProps {
  clients: Client[];
  projects: Project[];
  payments: Payment[];
}

export function ClientPerformanceTable({
  clients,
  projects,
  payments,
}: ClientPerformanceTableProps) {
  return (
    <Card className="p-0 overflow-hidden shadow-xs">
      <div className="p-4 sm:p-5 border-b border-border-subtle bg-surface">
        <h3 className="text-base font-semibold text-text-primary tracking-tight">
          Client Account Performance
        </h3>
        <p className="text-xs text-text-secondary mt-0.5">
          Cumulative client billing, completed deliverables, and receivables summary.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client / Organization</TableHead>
            <TableHead className="text-center">Total Projects</TableHead>
            <TableHead className="text-center">Completed Sprints</TableHead>
            <TableHead className="text-right">Total Paid</TableHead>
            <TableHead className="text-right">Outstanding</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => {
            const clientProjects = projects.filter((p) => p.clientId === client.id);
            const completedCount = clientProjects.filter((p) => p.status === 'COMPLETED').length;
            const finance = getClientFinancialSummary(client.id, projects, payments);

            return (
              <TableRow key={client.id} className="hover:bg-surface-hover/80 transition-colors">
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="font-semibold text-text-primary text-xs sm:text-sm">
                      {client.name}
                    </span>
                    <span className="text-xs text-text-muted flex items-center gap-1">
                      <Building2 size={11} />
                      <span>{client.companyName || 'Independent Freelance Contract'}</span>
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-center font-mono text-xs">
                  {clientProjects.length}
                </TableCell>

                <TableCell className="text-center font-mono text-xs text-brand-forest dark:text-brand-sage font-semibold">
                  {completedCount}
                </TableCell>

                <TableCell className="text-right font-mono font-medium text-xs sm:text-sm text-text-primary">
                  {formatINR(finance.totalPaid)}
                </TableCell>

                <TableCell className="text-right font-mono text-xs sm:text-sm">
                  {finance.outstandingBalance > 0 ? (
                    <span className="text-warning-text font-semibold">
                      {formatINR(finance.outstandingBalance)}
                    </span>
                  ) : (
                    <span className="text-text-muted">₹0</span>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <Link
                    href={`/clients/${client.id}`}
                    className="inline-flex items-center gap-1 text-xs text-brand-forest dark:text-brand-sage hover:underline font-medium"
                  >
                    <span>Profile</span>
                    <ExternalLink size={11} />
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}

export default ClientPerformanceTable;

