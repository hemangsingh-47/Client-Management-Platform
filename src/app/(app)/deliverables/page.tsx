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
import { Plus, AlertCircle, RefreshCw } from 'lucide-react';

export default function DeliverablesPage() {
  const {
    deliverables,
    projects,
    addDeliverable,
    updateDeliverable,
    deleteDeliverable,
    updateDeliverableStatus,
    isLoading,
    error,
    refreshData,
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
  const [actionError, setActionError] = useState<string | null>(null);

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

  // Open modals
  const handleOpenAdd = () => {
    setActionError(null);
    setEditingDeliverable(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (del: Deliverable) => {
    setActionError(null);
    setEditingDeliverable(del);
    setIsFormOpen(true);
  };

  const handleOpenDetails = (del: Deliverable) => {
    setSelectedDeliverable(del);
    setIsDetailsOpen(true);
  };

  const handleOpenDelete = (del: Deliverable) => {
    setActionError(null);
    setDeletingDeliverable(del);
    setIsDeleteOpen(true);
  };

  const handleSaveDeliverable = async (data: DeliverableFormData) => {
    try {
      setActionError(null);
      if (editingDeliverable) {
        await updateDeliverable(editingDeliverable.id, data);
      } else {
        await addDeliverable(data);
      }
      setIsFormOpen(false);
      setEditingDeliverable(null);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Failed to save deliverable');
    }
  };

  const handleStatusChangeFromDetails = async (status: DeliverableStatus, note?: string) => {
    if (!selectedDeliverable) return;
    try {
      setActionError(null);
      await updateDeliverableStatus(selectedDeliverable.id, status, note);
      setSelectedDeliverable((prev) => (prev ? { ...prev, status } : null));
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Failed to update deliverable status');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingDeliverable) return;
    try {
      setActionError(null);
      await deleteDeliverable(deletingDeliverable.id);
      setIsDeleteOpen(false);
      setDeletingDeliverable(null);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Failed to delete deliverable');
      setIsDeleteOpen(false);
      setDeletingDeliverable(null);
    }
  };

  const selectedProject = selectedDeliverable
    ? projects.find((p) => p.id === selectedDeliverable.projectId)
    : undefined;

  const displayError = actionError || error;

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <PageHeader
        title="Deliverables"
        description="Manage project submissions, approvals, version histories, and client revision cycles."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshData()}
              disabled={isLoading}
              className="flex items-center gap-1.5 shadow-xs"
              title="Refresh Deliverables from Database"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              variant="primary"
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Add Deliverable</span>
            </Button>
          </div>
        }
      />

      {/* Database Error Banner */}
      {displayError && (
        <div className="p-4 rounded-xl bg-error-bg/70 border border-error-border text-error-text flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={18} className="shrink-0" />
            <span>{displayError}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setActionError(null);
              refreshData();
            }}
            className="shrink-0 h-8 text-xs border-error-border hover:bg-error-bg"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && deliverables.length === 0 ? (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-28 rounded-xl bg-surface-subtle border border-border-subtle" />
            ))}
          </div>
          <div className="h-96 rounded-xl bg-surface-subtle border border-border-subtle" />
        </div>
      ) : (
        <>
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
        </>
      )}

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
