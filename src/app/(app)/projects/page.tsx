'use client';

import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  ProjectSummaryCards,
  ProjectFilters,
  ProjectListView,
  ProjectGridView,
  ProjectFormModal,
  ProjectDeleteModal,
  ProjectFormData,
  StatusFilterValue,
  PriorityFilterValue,
  SortOptionValue,
  ViewMode,
} from '@/components/projects';
import { Project, getProjectClient } from '@/lib/mock-data/projects';
import { useAppContext } from '@/context/app-context';
import { Plus } from 'lucide-react';

export default function ProjectsPage() {
  const {
    projects,
    clients,
    addProject,
    updateProject,
    deleteProject,
  } = useAppContext();

  // Filters & View state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('ALL');
  const [priorityFilter, setPriorityFilter] =
    useState<PriorityFilterValue>('ALL');
  const [sortBy, setSortBy] = useState<SortOptionValue>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  // Filter & Sort computation
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter((p) => p.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'ALL') {
      result = result.filter((p) => p.priority === priorityFilter);
    }

    // Search query (project title or client name)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(q);
        const descMatch = p.description.toLowerCase().includes(q);
        const client = getProjectClient(p.clientId, clients);
        const clientNameMatch =
          client?.name.toLowerCase().includes(q) ||
          (client?.companyName && client.companyName.toLowerCase().includes(q));
        return titleMatch || descMatch || Boolean(clientNameMatch);
      });
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case 'oldest':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'budget':
          return b.budget - a.budget;
        default:
          return 0;
      }
    });

    return result;
  }, [projects, clients, searchQuery, statusFilter, priorityFilter, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'ALL' ||
    priorityFilter !== 'ALL' ||
    sortBy !== 'newest';

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setSortBy('newest');
  };

  // Open modals
  const handleOpenCreate = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (project: Project) => {
    setDeletingProject(project);
    setIsDeleteOpen(true);
  };

  // Save (Create or Update)
  const handleSaveProject = (data: ProjectFormData) => {
    if (editingProject) {
      updateProject(editingProject.id, {
        title: data.title,
        clientId: data.clientId,
        description: data.description,
        budget: data.budget,
        startDate: data.startDate,
        deadline: data.deadline,
        status: data.status,
        priority: data.priority,
        progress: data.progress,
        notes: data.notes || undefined,
      });
    } else {
      addProject({
        title: data.title,
        clientId: data.clientId,
        description: data.description,
        budget: data.budget,
        startDate: data.startDate,
        deadline: data.deadline,
        status: data.status,
        priority: data.priority,
        progress: data.progress,
        notes: data.notes || undefined,
      });
    }
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (!deletingProject) return;
    deleteProject(deletingProject.id);
    setDeletingProject(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Projects"
        description="Plan, track, and manage all your freelance projects in one place."
        action={
          <Button
            variant="primary"
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 shadow-xs"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>New Project</span>
          </Button>
        }
      />

      {/* Summary Statistics */}
      <ProjectSummaryCards projects={projects} />

      {/* Search & Filters with View Switcher */}
      <ProjectFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* List or Grid View */}
      {viewMode === 'list' ? (
        <ProjectListView
          projects={filteredProjects}
          clients={clients}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onAddNew={handleOpenCreate}
          onClearFilters={handleClearFilters}
          isFiltered={hasActiveFilters}
        />
      ) : (
        <ProjectGridView
          projects={filteredProjects}
          clients={clients}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onAddNew={handleOpenCreate}
          onClearFilters={handleClearFilters}
          isFiltered={hasActiveFilters}
        />
      )}

      {/* Create / Edit Project Modal */}
      <ProjectFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
        initialData={editingProject}
        clients={clients}
      />

      {/* Delete Confirmation Modal */}
      <ProjectDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingProject(null);
        }}
        onConfirm={handleConfirmDelete}
        projectTitle={deletingProject?.title || 'this project'}
      />
    </div>
  );
}
