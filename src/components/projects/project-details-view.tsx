'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Project } from '@/types/project';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { ProjectStatusBadge, ProjectPriorityBadge } from './project-badges';
import { ProjectFormModal, ProjectFormData } from './project-form-modal';
import { ProjectDeleteModal } from './project-delete-modal';
import { formatINR } from '@/lib/utils';
import { getProjectFinancialSummary } from '@/lib/utils/payment-utils';
import { useAppContext } from '@/context/app-context';
import {
  ChevronRight,
  ArrowLeft,
  Pencil,
  Trash2,
  Calendar,
  CreditCard,
  Building2,
  ExternalLink,
  CheckCircle2,
  Circle,
  FileCheck2,
  Layers,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

export interface ProjectDetailsViewProps {
  projectId: string;
}

export function ProjectDetailsView({ projectId }: ProjectDetailsViewProps) {
  const router = useRouter();
  const {
    projects,
    clients,
    tasks: allTasks,
    deliverables: allDeliverables,
    payments: allPayments,
    updateProject,
    deleteProject,
    toggleTaskCompleted,
  } = useAppContext();

  // Find project
  const project: Project | undefined =
    projects.find((p) => p.id === projectId) || projects[0];

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Client info
  const client = project ? clients.find((c) => c.id === project.clientId) : undefined;

  // Live related collections
  const tasks = project ? allTasks.filter((t) => t.projectId === project.id) : [];
  const deliverables = project ? allDeliverables.filter((d) => d.projectId === project.id) : [];
  const payments = project ? allPayments.filter((p) => p.projectId === project.id) : [];

  // Financial summary
  const finance = project ? getProjectFinancialSummary(project, payments) : null;

  const handleSaveProject = (data: ProjectFormData) => {
    if (!project) return;
    updateProject(project.id, {
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
  };

  const handleDeleteConfirm = () => {
    if (!project) return;
    deleteProject(project.id);
    router.push('/projects');
  };

  if (!project) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Link href="/projects" className="hover:text-text-primary">
            Projects
          </Link>
          <ChevronRight size={14} />
          <span>Not Found</span>
        </div>
        <EmptyState
          title="Project Not Found"
          description="The requested project could not be found or has been removed."
          action={
            <Button variant="primary" onClick={() => router.push('/projects')}>
              Return to Projects
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Breadcrumbs Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-text-secondary"
      >
        <Link
          href="/projects"
          className="hover:text-brand-forest dark:hover:text-brand-sage transition-colors font-medium"
        >
          Projects
        </Link>
        <ChevronRight size={13} className="text-text-muted" />
        <span className="font-semibold text-text-primary truncate">
          {project.title}
        </span>
      </nav>

      {/* 2. Project Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pb-6 border-b border-border-subtle">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              {project.title}
            </h1>
            <ProjectStatusBadge status={project.status} size="md" />
            <ProjectPriorityBadge priority={project.priority} size="md" />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-text-secondary">
            {client ? (
              <Link
                href={`/clients/${client.id}`}
                className="inline-flex items-center gap-1.5 text-text-secondary hover:text-brand-forest dark:hover:text-brand-sage font-medium transition-colors"
              >
                <Building2 size={14} className="text-text-muted" />
                <span>{client.companyName ? `${client.name} (${client.companyName})` : client.name}</span>
                <ExternalLink size={11} className="text-text-muted" />
              </Link>
            ) : (
              <span className="text-text-muted">Unassigned Client</span>
            )}

            <span className="text-text-muted">•</span>

            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-text-muted" />
              <span>Created {project.createdAt}</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/projects')}
            className="flex items-center gap-1.5"
          >
            <ArrowLeft size={14} />
            <span>All Projects</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsEditOpen(true)}
            className="flex items-center gap-1.5 shadow-xs"
          >
            <Pencil size={14} />
            <span>Edit Project</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsDeleteOpen(true)}
            className="text-error-text hover:bg-error-bg h-9 px-2.5 cursor-pointer"
            title="Delete project"
          >
            <Trash2 size={15} />
          </Button>
        </div>
      </div>

      {/* 3. Summary & Progress KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Budget */}
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-text-secondary mb-2">
            <span className="text-xs font-medium">Total Budget</span>
            <div className="p-1 rounded-md bg-surface-subtle border border-border-subtle">
              <CreditCard size={14} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary font-mono">
            {formatINR(project.budget)}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Agreed milestone total
          </span>
        </Card>

        {/* Paid & Outstanding */}
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-text-secondary mb-2">
            <span className="text-xs font-medium">Total Paid (Completed)</span>
            <div className="p-1 rounded-md bg-success-bg text-success-text border border-success-border">
              <CheckCircle2 size={14} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-success-text font-mono">
            {formatINR(finance?.totalPaid || 0)}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Outstanding: {formatINR(finance?.outstandingBalance || 0)}
          </span>
        </Card>

        {/* Completion Progress */}
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-text-secondary mb-2">
            <span className="text-xs font-medium">Sprint Completion</span>
            <div className="p-1 rounded-md bg-brand-sage-light text-brand-forest dark:text-brand-sage border border-brand-sage/40">
              <Clock size={14} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-brand-forest dark:text-brand-sage font-mono">
            {project.progress}%
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden border border-border-subtle">
            <div
              className="h-full rounded-full bg-brand-primary transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </Card>

        {/* Target Deadline */}
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-text-secondary mb-2">
            <span className="text-xs font-medium">Target Deadline</span>
            <div className="p-1 rounded-md bg-warning-bg text-warning-text border border-warning-border">
              <Calendar size={14} />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold tracking-tight text-text-primary whitespace-nowrap">
            {project.deadline}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Started on {project.startDate}
          </span>
        </Card>
      </div>

      {/* 4. Main Details Layout (2 Columns: Overview/Tabs + Sidebar Info) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: Live Related Sections */}
        <div className="lg:col-span-2 space-y-4">
          <Tabs defaultValue="tasks" className="w-full">
            <TabsList>
              <TabsTrigger value="tasks" className="flex items-center gap-1.5">
                <span>Tasks ({tasks.length})</span>
              </TabsTrigger>

              <TabsTrigger value="deliverables" className="flex items-center gap-1.5">
                <span>Deliverables ({deliverables.length})</span>
              </TabsTrigger>

              <TabsTrigger value="payments" className="flex items-center gap-1.5">
                <span>Payments ({payments.length})</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Tasks */}
            <TabsContent value="tasks">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">
                      Project Tasks & Milestones
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Tasks directly update this project&apos;s overall completion percentage.
                    </p>
                  </div>
                  <Link
                    href="/tasks"
                    className="text-xs font-medium text-brand-forest dark:text-brand-sage hover:underline flex items-center gap-1"
                  >
                    <span>Manage All Tasks</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>

                {tasks.length === 0 ? (
                  <EmptyState
                    icon={<Layers size={20} className="text-text-secondary" />}
                    title="No tasks added yet"
                    description="Sprint items and deliverable tasks for this project will be listed here."
                    action={
                      <Link
                        href="/tasks"
                        className="inline-flex items-center justify-center rounded-lg bg-brand-primary px-3 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-brand-primary-hover"
                      >
                        + Add Task in Tasks Module
                      </Link>
                    }
                  />
                ) : (
                  <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-xs divide-y divide-border-subtle">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3.5 hover:bg-surface-hover/60 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => toggleTaskCompleted(task.id)}
                            className="cursor-pointer focus:outline-none"
                            title={task.status === 'COMPLETED' ? 'Mark Incomplete' : 'Mark Complete'}
                          >
                            {task.status === 'COMPLETED' ? (
                              <CheckCircle2 size={17} className="text-success-text shrink-0" />
                            ) : (
                              <Circle size={17} className="text-text-muted hover:text-brand-primary shrink-0 transition-colors" />
                            )}
                          </button>
                          <span
                            className={
                              task.status === 'COMPLETED'
                                ? 'text-xs sm:text-sm text-text-muted line-through'
                                : 'text-xs sm:text-sm text-text-primary font-medium'
                            }
                          >
                            {task.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0 text-xs">
                          <span className="text-text-muted text-[11px] whitespace-nowrap">
                            Due {task.dueDate}
                          </span>
                          <Badge
                            variant={task.priority === 'HIGH' ? 'error' : task.priority === 'MEDIUM' ? 'warning' : 'default'}
                            size="sm"
                            className="text-[10px]"
                          >
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Tab 2: Deliverables */}
            <TabsContent value="deliverables">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">
                      Project Deliverables
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Review artifacts, client approval statuses, and mock attachments.
                    </p>
                  </div>
                  <Link
                    href="/deliverables"
                    className="text-xs font-medium text-brand-forest dark:text-brand-sage hover:underline flex items-center gap-1"
                  >
                    <span>Deliverables Hub</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>

                {deliverables.length === 0 ? (
                  <EmptyState
                    icon={<FileCheck2 size={20} className="text-text-secondary" />}
                    title="No deliverables recorded"
                    description="Exported artifacts and client submission versions will be listed here."
                    action={
                      <Link
                        href="/deliverables"
                        className="inline-flex items-center justify-center rounded-lg bg-brand-primary px-3 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-brand-primary-hover"
                      >
                        + Add Deliverable
                      </Link>
                    }
                  />
                ) : (
                  <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-xs">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Deliverable</TableHead>
                          <TableHead>Version</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Attachment</TableHead>
                          <TableHead className="text-right">Submission Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deliverables.map((del) => (
                          <TableRow key={del.id}>
                            <TableCell className="font-medium text-xs sm:text-sm text-text-primary">
                              {del.title}
                            </TableCell>
                            <TableCell className="text-xs text-text-secondary font-mono">
                              {del.version || 'v1.0'}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  del.status === 'APPROVED'
                                    ? 'success'
                                    : del.status === 'SUBMITTED'
                                    ? 'brand'
                                    : del.status === 'REVISION_REQUIRED'
                                    ? 'warning'
                                    : 'default'
                                }
                                size="sm"
                              >
                                {del.status.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs">
                              {del.attachmentUrl ? (
                                <a
                                  href={del.attachmentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-brand-forest dark:text-brand-sage hover:underline"
                                >
                                  <span>{del.attachmentType}</span>
                                  <ExternalLink size={10} />
                                </a>
                              ) : (
                                <span className="text-text-muted">{del.attachmentType}</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right text-xs text-text-secondary whitespace-nowrap">
                              {del.submissionDate}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Tab 3: Payments */}
            <TabsContent value="payments">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">
                      Milestone Invoicing & Payments
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Outstanding balance is strictly calculated as Budget minus Completed payments.
                    </p>
                  </div>
                  <Link
                    href="/payments"
                    className="text-xs font-medium text-brand-forest dark:text-brand-sage hover:underline flex items-center gap-1"
                  >
                    <span>Payments Ledger</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>

                {payments.length === 0 ? (
                  <EmptyState
                    icon={<CreditCard size={20} className="text-text-secondary" />}
                    title="No payment records"
                    description="Recorded payments and milestone invoices will appear here."
                    action={
                      <Link
                        href="/payments"
                        className="inline-flex items-center justify-center rounded-lg bg-brand-primary px-3 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-brand-primary-hover"
                      >
                        + Record Payment
                      </Link>
                    }
                  />
                ) : (
                  <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-xs">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Payment Date</TableHead>
                          <TableHead>Method & Ref</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell className="text-xs text-text-secondary whitespace-nowrap">
                              {p.paymentDate}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-xs font-medium text-text-primary">
                                  {p.paymentMethod}
                                </span>
                                <span className="text-[11px] text-text-muted font-mono">
                                  {p.reference}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium text-xs sm:text-sm font-mono text-text-primary">
                              {formatINR(p.amount)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge
                                variant={
                                  p.status === 'Completed'
                                    ? 'success'
                                    : p.status === 'Pending'
                                    ? 'warning'
                                    : 'error'
                                }
                                size="sm"
                              >
                                {p.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right 1 Column: Project Information Card */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span>Project Scope & Info</span>
                <button
                  type="button"
                  onClick={() => setIsEditOpen(true)}
                  className="text-xs font-medium text-brand-forest dark:text-brand-sage hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Pencil size={12} />
                  <span>Edit</span>
                </button>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 pt-4 text-xs sm:text-sm">
              {/* Description */}
              <div className="space-y-1">
                <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
                  Scope Description
                </span>
                <p className="text-xs sm:text-[13px] text-text-primary leading-relaxed bg-surface-subtle p-3 rounded-lg border border-border-subtle">
                  {project.description}
                </p>
              </div>

              {/* Client Info */}
              <div className="space-y-1">
                <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
                  Client Organization
                </span>
                {client ? (
                  <Link
                    href={`/clients/${client.id}`}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-surface-subtle border border-border-subtle hover:bg-surface-hover/80 transition-colors group"
                  >
                    <div>
                      <p className="font-semibold text-text-primary group-hover:text-brand-forest dark:group-hover:text-brand-sage transition-colors">
                        {client.name}
                      </p>
                      <p className="text-xs text-text-muted">
                        {client.companyName || client.email}
                      </p>
                    </div>
                    <ExternalLink size={13} className="text-text-muted" />
                  </Link>
                ) : (
                  <p className="text-xs text-text-muted">No client linked</p>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
                    Start Date
                  </span>
                  <p className="text-xs font-medium text-text-primary">
                    {project.startDate}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
                    Deadline
                  </span>
                  <p className="text-xs font-medium text-text-primary">
                    {project.deadline}
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5 pt-2 border-t border-border-subtle">
                <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
                  Sprint Notes & Terms
                </span>
                <div className="p-3 rounded-lg bg-brand-sage-light/40 border border-brand-sage/20 text-xs text-text-primary leading-relaxed italic">
                  &ldquo;{project.notes || 'No internal sprint notes recorded for this project.'}&rdquo;
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Project Modal */}
      <ProjectFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSaveProject}
        initialData={project}
        clients={clients}
      />

      {/* Delete Confirmation Modal */}
      <ProjectDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        projectTitle={project.title}
      />
    </div>
  );
}

export default ProjectDetailsView;
