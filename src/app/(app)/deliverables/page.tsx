'use client';

import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  DeliverableSummaryCards,
  DeliverableFilters,
  DeliverableTable,
  DeliverableFormModal,
  DeliverableDetailsModal,
  DeliverableDeleteModal,
  DeliverableStatusFilter,
  DeliverableSortOption,
  DeliverableFormData,
} from '@/components/deliverables';
import { Deliverable, DeliverableStatus } from '@/types/deliverable';
import { useAppContext } from '@/context/app-context';
import { Plus } from 'lucide-react';

export default function DeliverablesPage() {
  const {
    deliverables,
    projects,
    addDeliverable,
    updateDeliverable,
    deleteDeliverable,
    updateDeliverableStatus,
  } = useAppContext();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<DeliverableStatusFilter>('ALL');
  const [sortBy, setSortBy] = useState<DeliverableSortOption>('newest');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDeliverable, setEditingDeliverable] = useState<Deliverable | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedDeliverable, setSelectedDeliverable] = useState<Deliverable | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingDeliverable, setDeletingDeliverable] = useState<Deliverable | null>(null);

  // Filter computation
  const filteredDeliverables = useMemo(() => {
    let result = [...deliverables];

    // Project filter
    if (projectFilter !== 'ALL') {
      result = result.filter((d) => d.projectId === projectFilter);
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter((d) => d.status === statusFilter);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((d) => {
        const titleMatch = d.title.toLowerCase().includes(q);
        const descMatch = d.description.toLowerCase().includes(q);
        const project = projects.find((p) => p.id === d.projectId);
        const projectMatch = project?.title.toLowerCase().includes(q);
        return titleMatch || descMatch || Boolean(projectMatch);
      });
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime();
        case 'oldest':
          return new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return result;
  }, [deliverables, projects, projectFilter, statusFilter, searchQuery, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    projectFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    sortBy !== 'newest';

  const handleClearFilters = () => {
    setSearchQuery('');
    setProjectFilter('ALL');
    setStatusFilter('ALL');
    setSortBy('newest');
  };

  // Actions
  const handleOpenAdd = () => {
    setEditingDeliverable(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (del: Deliverable) => {
    setEditingDeliverable(del);
    setIsFormOpen(true);
  };

  const handleOpenDetails = (del: Deliverable) => {
    setSelectedDeliverable(del);
    setIsDetailsOpen(true);
  };

  const handleOpenDelete = (del: Deliverable) => {
    setDeletingDeliverable(del);
    setIsDeleteOpen(true);
  };

  const handleSaveDeliverable = (data: DeliverableFormData) => {
    if (editingDeliverable) {
      updateDeliverable(editingDeliverable.id, data);
    } else {
      addDeliverable(data);
    }
  };

  const handleStatusChangeFromDetails = (status: DeliverableStatus, note?: string) => {
    if (!selectedDeliverable) return;
    updateDeliverableStatus(selectedDeliverable.id, status, note);
    setSelectedDeliverable((prev) => (prev ? { ...prev, status } : null));
  };

  const handleConfirmDelete = () => {
    if (!deletingDeliverable) return;
    deleteDeliverable(deletingDeliverable.id);
    setDeletingDeliverable(null);
  };

  const selectedProject = selectedDeliverable
    ? projects.find((p) => p.id === selectedDeliverable.projectId)
    : undefined;

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <PageHeader
        title="Deliverables"
        description="Manage project submissions, approvals, version histories, and client revision cycles."
        action={
          <Button
            variant="primary"
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Add Deliverable</span>
          </Button>
        }
      />

      {/* 2. Summary Statistics (5 KPI cards) */}
      <DeliverableSummaryCards deliverables={deliverables} />

      {/* 3. Filter Controls */}
      <DeliverableFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        projectFilter={projectFilter}
        onProjectChange={setProjectFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        projects={projects}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* 4. Deliverables Table */}
      <DeliverableTable
        deliverables={filteredDeliverables}
        projects={projects}
        onViewDetails={handleOpenDetails}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onAddNew={handleOpenAdd}
        onClearFilters={handleClearFilters}
        isFiltered={hasActiveFilters}
      />

      {/* Modals */}
      <DeliverableFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingDeliverable(null);
        }}
        onSave={handleSaveDeliverable}
        initialData={editingDeliverable}
        projects={projects}
      />

      <DeliverableDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedDeliverable(null);
        }}
        deliverable={selectedDeliverable}
        project={selectedProject}
        onStatusChange={handleStatusChangeFromDetails}
        onEdit={handleOpenEdit}
      />

      <DeliverableDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingDeliverable(null);
        }}
        onConfirm={handleConfirmDelete}
        deliverableTitle={deletingDeliverable?.title || 'this deliverable'}
      />
    </div>
  );
}
