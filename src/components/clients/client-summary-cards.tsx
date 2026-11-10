'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Users, UserCheck, Briefcase } from 'lucide-react';
import { Client } from '@/lib/mock-data/clients';

export interface ClientSummaryCardsProps {
  clients: Client[];
  activeProjectsCount?: number;
}

export function ClientSummaryCards({ clients }: ClientSummaryCardsProps) {
  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.status === 'ACTIVE').length;
  const clientsWithActiveProjects = clients.filter(
    (c) => c.totalProjects > 0 && c.status === 'ACTIVE'
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Total Clients */}
      <Card className="p-4 sm:p-5 flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-text-secondary">Total Clients</span>
          <div className="mt-1.5 text-2xl font-bold tracking-tight text-text-primary">
            {totalClients}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Across all workspaces
          </span>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-subtle border border-border text-text-secondary">
          <Users size={20} strokeWidth={1.8} />
        </div>
      </Card>

      {/* Active Clients */}
      <Card className="p-4 sm:p-5 flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-text-secondary">Active Clients</span>
          <div className="mt-1.5 text-2xl font-bold tracking-tight text-brand-forest dark:text-brand-sage">
            {activeClients}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            {totalClients > 0 ? `${Math.round((activeClients / totalClients) * 100)}% of client roster` : 'No clients'}
          </span>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-sage-light border border-brand-sage/30 text-brand-forest dark:text-brand-sage">
          <UserCheck size={20} strokeWidth={1.8} />
        </div>
      </Card>

      {/* Clients with Active Projects */}
      <Card className="p-4 sm:p-5 flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-text-secondary">
            With Active Projects
          </span>
          <div className="mt-1.5 text-2xl font-bold tracking-tight text-text-primary">
            {clientsWithActiveProjects}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Currently engaging deliverables
          </span>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-subtle border border-border text-text-secondary">
          <Briefcase size={20} strokeWidth={1.8} />
        </div>
      </Card>
    </div>
  );
}

export default ClientSummaryCards;

