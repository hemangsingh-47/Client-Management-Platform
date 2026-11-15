'use client';

import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  TaskSummaryCards,
  TaskFilters,
  TaskTable,
  TaskFormModal,
  TaskDeleteModal,
  MilestoneList,
  MilestoneFormModal,
  MilestoneDeleteModal,
  TaskStatusFilter,
  TaskPriorityFilter,
  TaskSortOption,
  TaskFormData,
  MilestoneFormData,
} from '@/components/tasks';
import { Task } from '@/types/task';
import { Milestone } from '@/types/milestone';
import { isTaskOverdue } from '@/lib/utils/task-utils';
import { useAppContext } from '@/context/app-context';
import { Plus, ListTodo, Flag, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TasksPage() {
  const {
    tasks,
    projects,
    milestones,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompleted,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    toggleMilestoneCompleted,
    isLoading,
    error,
    refreshData,
  } = useAppContext();

  // Active Tab: 'tasks' | 'milestones'
  const [activeTab, setActiveTab] = useState<'tasks' | 'milestones'>('tasks');

  // Task Filter & Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriorityFilter>('ALL');
  const [isOverdueOnly, setIsOverdueOnly] = useState(false);
  const [sortBy, setSortBy] = useState<TaskSortOption>('due_asc');

  // Task Modal state
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isTaskDeleteOpen, setIsTaskDeleteOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Milestone Modal state
  const [isMilestoneFormOpen, setIsMilestoneFormOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [isMilestoneDeleteOpen, setIsMilestoneDeleteOpen] = useState(false);
  const [deletingMilestone, setDeletingMilestone] = useState<Milestone | null>(null);

  const [actionError, setActionError] = useState<string | null>(null);

  // Filter & Sort tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Project filter
    if (projectFilter !== 'ALL') {
      result = result.filter((t) => t.projectId === projectFilter);
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter((t) => t.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'ALL') {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    // Overdue filter
    if (isOverdueOnly) {
      result = result.filter((t) => isTaskOverdue(t));
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'due_asc':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'due_desc':
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        case 'priority': {
          const priorityOrder: Record<string, number> = {
            URGENT: 4,
            HIGH: 3,
            MEDIUM: 2,
            LOW: 1,
          };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        }
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return result;
  }, [tasks, projectFilter, statusFilter, priorityFilter, isOverdueOnly, searchQuery, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    projectFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    priorityFilter !== 'ALL' ||
    isOverdueOnly ||
    sortBy !== 'due_asc';

  const handleClearFilters = () => {
    setSearchQuery('');
    setProjectFilter('ALL');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setIsOverdueOnly(false);
    setSortBy('due_asc');
  };

  // Task Handlers
  const handleOpenAddTask = () => {
    setActionError(null);
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setActionError(null);
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleOpenDeleteTask = (task: Task) => {
    setActionError(null);
    setDeletingTask(task);
    setIsTaskDeleteOpen(true);
  };

  const handleSaveTask = async (data: TaskFormData) => {
    try {
      setActionError(null);
      if (editingTask) {
        await updateTask(editingTask.id, data);
      } else {
        await addTask(data);
      }
      setIsTaskFormOpen(false);
      setEditingTask(null);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Failed to save task');
    }
  };

  const handleConfirmDeleteTask = async () => {
    if (!deletingTask) return;
    try {
      setActionError(null);
      await deleteTask(deletingTask.id);
      setIsTaskDeleteOpen(false);
      setDeletingTask(null);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Failed to delete task');
      setIsTaskDeleteOpen(false);
      setDeletingTask(null);
    }
  };

  // Milestone Handlers
  const handleOpenAddMilestone = () => {
    setActionError(null);
    setEditingMilestone(null);
    setIsMilestoneFormOpen(true);
  };

  const handleOpenEditMilestone = (m: Milestone) => {
    setActionError(null);
    setEditingMilestone(m);
    setIsMilestoneFormOpen(true);
  };

  const handleOpenDeleteMilestone = (m: Milestone) => {
    setActionError(null);
    setDeletingMilestone(m);
    setIsMilestoneDeleteOpen(true);
  };

  const handleSaveMilestone = async (data: MilestoneFormData) => {
    try {
      setActionError(null);
      if (editingMilestone) {
        await updateMilestone(editingMilestone.id, data);
      } else {
        await addMilestone(data);
      }
      setIsMilestoneFormOpen(false);
      setEditingMilestone(null);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Failed to save milestone');
    }
  };

  const handleConfirmDeleteMilestone = async () => {
    if (!deletingMilestone) return;
    try {
      setActionError(null);
      await deleteMilestone(deletingMilestone.id);
      setIsMilestoneDeleteOpen(false);
      setDeletingMilestone(null);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Failed to delete milestone');
      setIsMilestoneDeleteOpen(false);
      setDeletingMilestone(null);
    }
  };

  const displayError = actionError || error;

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <PageHeader
        title="Tasks & Milestones"
        description="Stay organized, coordinate deliverable sprints, and keep your projects moving forward."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshData()}
              disabled={isLoading}
              className="flex items-center gap-1.5 shadow-xs"
              title="Refresh Tasks from Database"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={handleOpenAddMilestone}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <Flag size={15} />
              <span>Add Milestone</span>
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={handleOpenAddTask}
              className="flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Add Task</span>
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
      {isLoading && tasks.length === 0 ? (
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
          {/* 2. Summary Statistics (5 Cards) */}
          <TaskSummaryCards tasks={tasks} />

          {/* 3. Section Switcher Tabs: Tasks vs Milestones */}
          <div className="flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('tasks')}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 -mb-px transition-colors cursor-pointer',
                  activeTab === 'tasks'
                    ? 'border-brand-primary text-text-primary font-bold'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                )}
              >
                <ListTodo size={16} />
                <span>All Tasks</span>
                <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-surface-subtle border border-border font-mono font-normal">
                  {tasks.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('milestones')}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 -mb-px transition-colors cursor-pointer',
                  activeTab === 'milestones'
                    ? 'border-brand-primary text-text-primary font-bold'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                )}
              >
                <Flag size={15} />
                <span>Project Milestones</span>
                <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-surface-subtle border border-border font-mono font-normal">
                  {milestones.length}
                </span>
              </button>
            </div>
          </div>

          {/* 4. Tab Content */}
          {activeTab === 'tasks' ? (
            <div className="space-y-4">
              {/* Filters & Sorters */}
              <TaskFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                projectFilter={projectFilter}
                onProjectChange={setProjectFilter}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                priorityFilter={priorityFilter}
                onPriorityChange={setPriorityFilter}
                isOverdueOnly={isOverdueOnly}
                onOverdueToggle={() => setIsOverdueOnly((prev) => !prev)}
                sortBy={sortBy}
                onSortChange={setSortBy}
                projects={projects}
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
              />

              {/* Interactive Task Table */}
              <TaskTable
                tasks={filteredTasks}
                projects={projects}
                onToggleComplete={toggleTaskCompleted}
                onEdit={handleOpenEditTask}
                onDelete={handleOpenDeleteTask}
                onAddNew={handleOpenAddTask}
                onClearFilters={handleClearFilters}
                isFiltered={hasActiveFilters}
              />
            </div>
          ) : (
            <MilestoneList
              milestones={milestones}
              projects={projects}
              onToggleComplete={toggleMilestoneCompleted}
              onEdit={handleOpenEditMilestone}
              onDelete={handleOpenDeleteMilestone}
              onAddNew={handleOpenAddMilestone}
            />
          )}
        </>
      )}

      {/* Modals */}
      <TaskFormModal
        isOpen={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        initialData={editingTask}
        projects={projects}
      />

      <TaskDeleteModal
        isOpen={isTaskDeleteOpen}
        onClose={() => {
          setIsTaskDeleteOpen(false);
          setDeletingTask(null);
        }}
        onConfirm={handleConfirmDeleteTask}
        taskTitle={deletingTask?.title || 'this task'}
      />

      <MilestoneFormModal
        isOpen={isMilestoneFormOpen}
        onClose={() => {
          setIsMilestoneFormOpen(false);
          setEditingMilestone(null);
        }}
        onSave={handleSaveMilestone}
        initialData={editingMilestone}
        projects={projects}
      />

      <MilestoneDeleteModal
        isOpen={isMilestoneDeleteOpen}
        onClose={() => {
          setIsMilestoneDeleteOpen(false);
          setDeletingMilestone(null);
        }}
        onConfirm={handleConfirmDeleteMilestone}
        milestoneTitle={deletingMilestone?.title || 'this milestone'}
      />
    </div>
  );
}
