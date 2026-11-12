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
import { Badge } from '@/components/ui/badge';
import { Dropdown } from '@/components/ui/dropdown';
import { EmptyState } from '@/components/ui/empty-state';
import { Task } from '@/types/task';
import { Project } from '@/types/project';
import { isTaskOverdue } from '@/lib/utils/task-utils';
import {
  CheckCircle2,
  Circle,
  MoreVertical,
  Pencil,
  Trash2,
  AlertTriangle,
  CheckSquare,
  SearchX,
  ExternalLink,
} from 'lucide-react';

export interface TaskTableProps {
  tasks: Task[];
  projects: Project[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAddNew: () => void;
  onClearFilters: () => void;
  isFiltered: boolean;
}

export function TaskTable({
  tasks,
  projects,
  onToggleComplete,
  onEdit,
  onDelete,
  onAddNew,
  onClearFilters,
  isFiltered,
}: TaskTableProps) {
  if (tasks.length === 0) {
    if (isFiltered) {
      return (
        <EmptyState
          icon={<SearchX size={22} className="text-text-secondary" />}
          title="No matching tasks found"
          description="Try adjusting your search criteria, project, priority, or status filters."
          action={
            <button
              type="button"
              onClick={onClearFilters}
              className="text-xs font-medium text-brand-forest dark:text-brand-sage hover:underline cursor-pointer"
            >
              Clear all filters
            </button>
          }
        />
      );
    }

    return (
      <EmptyState
        icon={<CheckSquare size={22} className="text-brand-primary" />}
        title="No tasks yet"
        description="Organize your deliverable items and keep projects moving forward."
        action={
          <button
            type="button"
            onClick={onAddNew}
            className="inline-flex items-center justify-center rounded-lg bg-brand-primary px-3.5 py-2 text-xs font-medium text-white shadow-xs hover:bg-brand-primary-hover cursor-pointer"
          >
            + Add First Task
          </button>
        }
      />
    );
  }

  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'HIGH':
        return <Badge variant="error" size="sm">High</Badge>;
      case 'MEDIUM':
        return <Badge variant="warning" size="sm">Medium</Badge>;
      case 'LOW':
      default:
        return <Badge variant="default" size="sm">Low</Badge>;
    }
  };

  const getStatusBadge = (status: Task['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="success" size="sm" dot>Completed</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="brand" size="sm" dot>In Progress</Badge>;
      case 'TODO':
      default:
        return <Badge variant="default" size="sm" dot>To Do</Badge>;
    }
  };

  return (
    <div className="relative rounded-xl border border-border bg-surface overflow-hidden shadow-xs">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 text-center">Done</TableHead>
            <TableHead className="w-[320px]">Task Title</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => {
            const project = projects.find((p) => p.id === task.projectId);
            const overdue = isTaskOverdue(task);
            const isDone = task.status === 'COMPLETED';

            return (
              <TableRow
                key={task.id}
                className="hover:bg-surface-hover/80 transition-colors group"
              >
                {/* 1. Toggle Done */}
                <TableCell className="text-center">
                  <button
                    type="button"
                    onClick={() => onToggleComplete(task.id)}
                    className="p-1 text-text-muted hover:text-brand-primary focus:outline-none cursor-pointer transition-colors"
                    title={isDone ? 'Mark Incomplete' : 'Mark Completed'}
                  >
                    {isDone ? (
                      <CheckCircle2 size={18} className="text-success-text" />
                    ) : (
                      <Circle size={18} />
                    )}
                  </button>
                </TableCell>

                {/* 2. Task Title */}
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span
                      className={
                        isDone
                          ? 'text-xs sm:text-sm text-text-muted line-through'
                          : 'text-xs sm:text-sm font-semibold text-text-primary'
                      }
                    >
                      {task.title}
                    </span>
                    {task.description && (
                      <span className="text-xs text-text-muted line-clamp-1 max-w-sm mt-0.5">
                        {task.description}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* 3. Project */}
                <TableCell>
                  {project ? (
                    <Link
                      href={`/projects/${project.id}`}
                      className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-brand-forest dark:hover:text-brand-sage transition-colors font-medium"
                    >
                      <span className="truncate max-w-[160px]">{project.title}</span>
                      <ExternalLink size={10} className="shrink-0 text-text-muted" />
                    </Link>
                  ) : (
                    <span className="text-xs text-text-muted">Unassigned</span>
                  )}
                </TableCell>

                {/* 4. Due Date */}
                <TableCell className="text-xs whitespace-nowrap">
                  {overdue ? (
                    <span className="inline-flex items-center gap-1 text-error-text font-medium bg-error-bg/60 px-2 py-0.5 rounded-md border border-error-border/60">
                      <AlertTriangle size={11} className="shrink-0" />
                      <span>{task.dueDate}</span>
                    </span>
                  ) : (
                    <span className={isDone ? 'text-text-muted' : 'text-text-secondary'}>
                      {task.dueDate}
                    </span>
                  )}
                </TableCell>

                {/* 5. Priority */}
                <TableCell>
                  {getPriorityBadge(task.priority)}
                </TableCell>

                {/* 6. Status */}
                <TableCell>
                  {getStatusBadge(task.status)}
                </TableCell>

                {/* 7. Actions */}
                <TableCell className="text-right">
                  <Dropdown
                    align="right"
                    trigger={
                      <button
                        type="button"
                        aria-label={`Actions for ${task.title}`}
                        className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors focus:outline-none cursor-pointer"
                      >
                        <MoreVertical size={16} />
                      </button>
                    }
                    items={[
                      {
                        id: 'toggle',
                        label: isDone ? 'Mark Incomplete' : 'Mark Completed',
                        icon: isDone ? <Circle size={14} /> : <CheckCircle2 size={14} />,
                        onClick: () => onToggleComplete(task.id),
                      },
                      {
                        id: 'edit',
                        label: 'Edit Task',
                        icon: <Pencil size={14} />,
                        onClick: () => onEdit(task),
                      },
                      {
                        id: 'delete',
                        label: 'Delete Task',
                        icon: <Trash2 size={14} />,
                        destructive: true,
                        onClick: () => onDelete(task),
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Footer Info */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface-subtle border-t border-border-subtle text-xs text-text-secondary">
        <span>
          Showing <strong className="text-text-primary">{tasks.length}</strong> task{tasks.length === 1 ? '' : 's'}
        </span>
        <span className="text-[11px] text-text-muted">
          Click checkbox to toggle completion
        </span>
      </div>
    </div>
  );
}

export default TaskTable;

