'use client';

import React, { useState, useMemo } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dropdown } from '@/components/ui/dropdown';
import { EmptyState } from '@/components/ui/empty-state';
import { formatINR } from '@/lib/utils';
import { Client } from '@/lib/mock-data/clients';
import {
  Search,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  Users,
  SearchX,
  Mail,
  Phone,
} from 'lucide-react';

export type StatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';
export type SortOption = 'name' | 'activity' | 'projects' | 'paid';

export interface ClientTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  onAddNew: () => void;
}

export function ClientTable({
  clients,
  onEdit,
  onDelete,
  onAddNew,
}: ClientTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('name');

  // Filter & Sort clients
  const filteredClients = useMemo(() => {
    let result = [...clients];

    // Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter((client) => client.status === statusFilter);
    }

    // Search query (name, company, email)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (client) =>
          client.name.toLowerCase().includes(q) ||
          (client.companyName && client.companyName.toLowerCase().includes(q)) ||
          client.email.toLowerCase().includes(q) ||
          (client.phone && client.phone.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'projects':
          return b.totalProjects - a.totalProjects;
        case 'paid':
          return b.totalPaid - a.totalPaid;
        case 'activity':
        default:
          return 0; // maintain relative activity order
      }
    });

    return result;
  }, [clients, searchQuery, statusFilter, sortBy]);

  const hasActiveFilters = searchQuery.trim() !== '' || statusFilter !== 'ALL';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setSortBy('name');
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar: Search, Filter, Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Input
            size="sm"
            leftIcon={<Search size={14} />}
            placeholder="Search by name, company, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters and Sorters */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Status Filter */}
          <div className="w-36">
            <Select
              size="sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              options={[
                { value: 'ALL', label: 'All Statuses' },
                { value: 'ACTIVE', label: 'Active Only' },
                { value: 'INACTIVE', label: 'Inactive' },
              ]}
            />
          </div>

          {/* Sort Selector */}
          <div className="w-40">
            <Select
              size="sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              options={[
                { value: 'name', label: 'Sort: Name (A-Z)' },
                { value: 'projects', label: 'Sort: Most Projects' },
                { value: 'paid', label: 'Sort: Highest Paid' },
                { value: 'activity', label: 'Sort: Recent Activity' },
              ]}
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs text-text-secondary hover:text-text-primary h-8 px-2.5"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Table or Empty States */}
      {clients.length === 0 ? (
        <EmptyState
          icon={<Users size={22} className="text-brand-primary" />}
          title="No clients yet"
          description="Start building your client roster to manage projects, invoices, and communication in one place."
          action={
            <Button variant="primary" size="sm" onClick={onAddNew}>
              + Add First Client
            </Button>
          }
        />
      ) : filteredClients.length === 0 ? (
        <EmptyState
          icon={<SearchX size={22} className="text-text-secondary" />}
          title="No matching clients found"
          description={`No clients matched your criteria "${searchQuery}". Try adjusting your filters.`}
          action={
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          }
        />
      ) : (
        <div className="relative rounded-xl border border-border bg-surface overflow-hidden shadow-xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[260px]">Client / Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-center">Projects</TableHead>
                <TableHead className="text-right">Total Paid</TableHead>
                <TableHead className="text-right">Outstanding</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead className="w-12 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => {
                const hasOutstanding = client.outstanding > 0;

                return (
                  <TableRow
                    key={client.id}
                    className="group cursor-pointer hover:bg-surface-hover/80 transition-colors"
                    onClick={(e) => {
                      // Don't navigate if clicking on action buttons or mail links
                      if ((e.target as HTMLElement).closest('button, a')) return;
                      router.push(`/clients/${client.id}`);
                    }}
                  >
                    {/* Client / Company */}
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <Link
                          href={`/clients/${client.id}`}
                          className="font-semibold text-text-primary group-hover:text-brand-forest dark:group-hover:text-brand-sage hover:underline transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {client.name}
                        </Link>
                        <span className="text-xs text-text-secondary">
                          {client.companyName || 'Individual Freelance Client'}
                        </span>
                      </div>
                    </TableCell>

                    {/* Contact (Email + Phone) */}
                    <TableCell>
                      <div className="flex flex-col space-y-0.5 text-xs">
                        <a
                          href={`mailto:${client.email}`}
                          className="inline-flex items-center gap-1.5 text-text-secondary hover:text-brand-forest dark:hover:text-brand-sage transition-colors truncate max-w-[200px]"
                          title={client.email}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Mail size={12} className="shrink-0 text-text-muted" />
                          <span className="truncate">{client.email}</span>
                        </a>
                        {client.phone && (
                          <span className="inline-flex items-center gap-1.5 text-text-muted text-[11px]">
                            <Phone size={11} className="shrink-0 text-text-muted" />
                            <span>{client.phone}</span>
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Total Projects */}
                    <TableCell className="text-center">
                      <Badge
                        variant="default"
                        size="sm"
                        className="font-medium font-mono"
                      >
                        {client.totalProjects}
                      </Badge>
                    </TableCell>

                    {/* Total Paid */}
                    <TableCell className="text-right font-medium text-text-primary text-xs sm:text-sm font-mono">
                      {formatINR(client.totalPaid)}
                    </TableCell>

                    {/* Outstanding */}
                    <TableCell className="text-right text-xs sm:text-sm font-mono">
                      {hasOutstanding ? (
                        <span className="font-semibold text-warning-text bg-warning-bg/60 border border-warning-border/50 px-2 py-0.5 rounded-md text-xs">
                          {formatINR(client.outstanding)}
                        </span>
                      ) : (
                        <span className="text-text-muted">₹0</span>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        variant={client.status === 'ACTIVE' ? 'success' : 'default'}
                        size="sm"
                        dot
                      >
                        {client.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>

                    {/* Last Activity */}
                    <TableCell className="text-xs text-text-secondary whitespace-nowrap">
                      {client.lastActivity}
                    </TableCell>

                    {/* Actions Menu */}
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Dropdown
                        align="right"
                        trigger={
                          <button
                            type="button"
                            aria-label={`Actions for ${client.name}`}
                            className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors focus:outline-none"
                          >
                            <MoreVertical size={16} />
                          </button>
                        }
                        items={[
                          {
                            id: 'view',
                            label: 'View Profile',
                            icon: <Eye size={14} />,
                            onClick: () => router.push(`/clients/${client.id}`),
                          },
                          {
                            id: 'edit',
                            label: 'Edit Details',
                            icon: <Pencil size={14} />,
                            onClick: () => onEdit(client),
                          },
                          {
                            id: 'delete',
                            label: 'Delete Client',
                            icon: <Trash2 size={14} />,
                            destructive: true,
                            onClick: () => onDelete(client),
                          },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Table Footer info */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-surface-subtle border-t border-border-subtle text-xs text-text-secondary">
            <span>
              Showing <strong className="text-text-primary">{filteredClients.length}</strong> of{' '}
              <strong className="text-text-primary">{clients.length}</strong> clients
            </span>
            <span className="text-[11px] text-text-muted">
              Click any row to open client profile
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientTable;
