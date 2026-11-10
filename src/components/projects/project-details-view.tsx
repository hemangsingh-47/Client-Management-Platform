'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Project,
  INITIAL_PROJECTS,
  MOCK_PROJECT_TASKS,
  MOCK_PROJECT_DELIVERABLES,
  MOCK_PROJECT_PAYMENTS,
  MOCK_PROJECT_ACTIVITIES,
  getProjectClient,
  ProjectTaskPreview,
  ProjectDeliverablePreview,
  ProjectPaymentPreview,
  ProjectActivityPreview,
} from '@/lib/mock-data/projects';
import { INITIAL_CLIENTS, Client } from '@/lib/mock-data/clients';
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
  Activity,
  Layers,
  Clock,
  Sparkles,
} from 'lucide-react';

export interface ProjectDetailsViewProps {
  projectId: string;
}

export function ProjectDetailsView({ projectId }: ProjectDetailsViewProps) {
  const router = useRouter();

  // Find project in initial mock dataset
  const initialProject =
    INITIAL_PROJECTS.find((p) => p.id === projectId) || INITIAL_PROJECTS[0];

  const [project, setProject] = useState<Project>(initialProject);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Client info
  const client: Client | undefined = getProjectClient(
    project.clientId,
    INITIAL_CLIENTS
  );

  // Associated preview data
  const tasks: ProjectTaskPreview[] = MOCK_PROJECT_TASKS[project.id] || [];
  const deliverables: ProjectDeliverablePreview[] =
    MOCK_PROJECT_DELIVERABLES[project.id] || [];
  const payments: ProjectPaymentPreview[] =
    MOCK_PROJECT_PAYMENTS[project.id] || [];
  const activities: ProjectActivityPreview[] =
    MOCK_PROJECT_ACTIVITIES[project.id] || [];

  const handleSaveProject = (data: ProjectFormData) => {
    setProject((prev) => ({
      ...prev,
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
    }));
  };

  const handleDeleteConfirm = () => {
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
            variant="ghost"
            size="sm"
            onClick={() => setIsDeleteOpen(true)}
            className="text-error-text hover:bg-error-bg h-9 px-2.5"
            title="Delete project"
          >
            <Trash2 size={15} />
          </Button>
        </div>
      </div>

      {/* 3. Summary & Progress KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Budget */}
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

        {/* Start Date */}
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-text-secondary mb-2">
            <span className="text-xs font-medium">Start Date</span>
            <div className="p-1 rounded-md bg-surface-subtle border border-border-subtle">
              <Calendar size={14} />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold tracking-tight text-text-primary whitespace-nowrap">
            {project.startDate}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Project kick-off
          </span>
        </Card>

        {/* Deadline */}
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
            Final deliverable due
          </span>
        </Card>
      </div>

      {/* 4. Main Details Layout (2 Columns: Overview/Tabs + Sidebar Info) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: Structured Previews for Future Modules */}
        <div className="lg:col-span-2 space-y-4">
          <Tabs defaultValue="tasks" className="w-full">
            <TabsList>
              <TabsTrigger value="tasks" className="flex items-center gap-1.5">
                <span>Tasks & Milestones</span>
                <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-surface-subtle border border-border font-mono">
                  {tasks.length}
                </span>
              </TabsTrigger>

              <TabsTrigger value="deliverables" className="flex items-center gap-1.5">
                <span>Deliverables</span>
                <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-surface-subtle border border-border font-mono">
                  {deliverables.length}
                </span>
              </TabsTrigger>

              <TabsTrigger value="payments" className="flex items-center gap-1.5">
                <span>Payment Summary</span>
                <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-surface-subtle border border-border font-mono">
                  {payments.length}
                </span>
              </TabsTrigger>

              <TabsTrigger value="activity" className="flex items-center gap-1.5">
                <span>Recent Activity</span>
                <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-surface-subtle border border-border font-mono">
                  {activities.length}
                </span>
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Tasks & Milestones Preview */}
            <TabsContent value="tasks">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">
                      Tasks & Milestones
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Preview of task breakdowns scheduled for upcoming phases.
                    </p>
                  </div>
                  <Badge variant="outline" size="sm" className="text-[11px]">
                    Phase 7 Preview
                  </Badge>
                </div>

                {tasks.length === 0 ? (
                  <EmptyState
                    icon={<Layers size={20} className="text-text-secondary" />}
                    title="No tasks added yet"
                    description="Sprint items and deliverable milestones will be tracked here."
                  />
                ) : (
                  <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-xs divide-y divide-border-subtle">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3.5 hover:bg-surface-hover/60 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {task.completed ? (
                            <CheckCircle2
                              size={16}
                              className="text-success-text shrink-0"
                            />
                          ) : (
                            <Circle
                              size={16}
                              className="text-text-muted shrink-0"
                            />
                          )}
                          <span
                            className={
                              task.completed
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
                            variant={task.priority === 'HIGH' ? 'error' : 'default'}
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

            {/* Tab 2: Deliverables Preview */}
            <TabsContent value="deliverables">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">
                      Project Deliverables
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Design assets, repositories, and documentation handoffs.
                    </p>
                  </div>
                  <Badge variant="outline" size="sm" className="text-[11px]">
                    Phase 8 Preview
                  </Badge>
                </div>

                {deliverables.length === 0 ? (
                  <EmptyState
                    icon={<FileCheck2 size={20} className="text-text-secondary" />}
                    title="No deliverables recorded"
                    description="Exported artifacts and client submission versions will be listed here."
                  />
                ) : (
                  <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-xs">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Deliverable</TableHead>
                          <TableHead>Version</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Updated</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deliverables.map((del) => (
                          <TableRow key={del.id}>
                            <TableCell className="font-medium text-xs sm:text-sm text-text-primary">
                              {del.title}
                            </TableCell>
                            <TableCell className="text-xs text-text-secondary font-mono">
                              {del.version}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={del.status === 'Approved' ? 'success' : 'default'}
                                size="sm"
                              >
                                {del.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right text-xs text-text-secondary">
                              {del.updatedAt}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Tab 3: Payment Summary Preview */}
            <TabsContent value="payments">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">
                      Milestone Invoicing
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Track deposit releases and outstanding milestone settlements.
                    </p>
                  </div>
                  <Badge variant="outline" size="sm" className="text-[11px]">
                    Phase 9 Preview
                  </Badge>
                </div>

                {payments.length === 0 ? (
                  <EmptyState
                    icon={<CreditCard size={20} className="text-text-secondary" />}
                    title="No payment milestones"
                    description="Invoices linked to this project will appear here."
                  />
                ) : (
                  <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-xs">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Milestone</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell className="font-medium text-xs sm:text-sm text-text-primary">
                              {p.milestoneTitle}
                            </TableCell>
                            <TableCell className="text-xs text-text-secondary">
                              {p.dueDate}
                            </TableCell>
                            <TableCell className="text-right font-medium text-xs sm:text-sm font-mono text-text-primary">
                              {formatINR(p.amount)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge
                                variant={p.status === 'Completed' ? 'success' : 'warning'}
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

            {/* Tab 4: Recent Activity */}
            <TabsContent value="activity">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-text-primary">
                    Project Sprint History
                  </h3>
                  <Badge variant="outline" size="sm" className="text-[11px]">
                    Timeline
                  </Badge>
                </div>

                {activities.length === 0 ? (
                  <EmptyState
                    icon={<Activity size={20} className="text-text-secondary" />}
                    title="No activity recorded"
                    description="Sprint updates, milestone sign-offs, and file handovers will appear here."
                  />
                ) : (
                  <div className="rounded-xl border border-border bg-surface p-5 shadow-xs">
                    <div className="relative pl-6 border-l border-border-subtle space-y-5">
                      {activities.map((act) => (
                        <div key={act.id} className="relative">
                          <div className="absolute -left-[31px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-sage-light text-brand-forest dark:text-brand-sage border border-brand-sage/40">
                            <Sparkles size={11} />
                          </div>
                          <div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                              <h4 className="text-xs sm:text-sm font-semibold text-text-primary">
                                {act.title}
                              </h4>
                              <span className="text-[11px] text-text-muted">
                                {act.timestamp}
                              </span>
                            </div>
                            <p className="mt-0.5 text-xs text-text-secondary leading-relaxed">
                              {act.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
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
                  className="text-xs font-medium text-brand-forest dark:text-brand-sage hover:underline flex items-center gap-1"
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
        clients={INITIAL_CLIENTS}
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
