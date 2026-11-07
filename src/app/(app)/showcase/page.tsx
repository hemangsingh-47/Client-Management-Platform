'use client';

import React, { useState } from 'react';
import {
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Modal,
  ModalFooter,
  Dropdown,
  Tooltip,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Divider,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Skeleton,
  EmptyState,
  FormField,
} from '@/components/ui';
import { Container } from '@/components/layout/container';
import {
  CheckCircle2,
  FolderOpen,
  Plus,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
  Palette,
  Type,
  Check,
  MoreVertical,
  Edit2,
  Trash2,
  ShieldAlert,
} from 'lucide-react';
import { APP_CONFIG } from '@/lib/constants';

export default function DesignSystemShowcase() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [hasError, setHasError] = useState(false);
  const [cbChecked, setCbChecked] = useState(true);

  return (
    <div className="py-10 sm:py-16">
      <Container size="lg" className="space-y-12">
        {/* Header / Intro */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-border pb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <Badge variant="brand" size="md" dot>
                Bonsai-Inspired Design System
              </Badge>
              <Badge variant="default" size="md">
                Phase 1 & Phase 2 Foundation
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
              {APP_CONFIG.name} Visual Foundation
            </h1>
            <p className="mt-2 max-w-2xl text-sm sm:text-base text-text-secondary leading-relaxed">
              A minimal, structured design system built for independent freelancers.
              Featuring our signature Forest Green palette, clean borders, high-contrast typography, and accessible UI primitives.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Sparkles size={14} />}
              onClick={() => {
                setBtnLoading(true);
                setTimeout(() => setBtnLoading(false), 1500);
              }}
              isLoading={btnLoading}
            >
              Test Loading
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => setIsModalOpen(true)}
            >
              Open Modal Preview
            </Button>
          </div>
        </div>

        {/* Main Tabs Navigation */}
        <Tabs defaultValue="components" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="components" className="gap-2">
              <Layers size={14} />
              <span>UI Components</span>
            </TabsTrigger>
            <TabsTrigger value="colors" className="gap-2">
              <Palette size={14} />
              <span>Color Palette & Tokens</span>
            </TabsTrigger>
            <TabsTrigger value="typography" className="gap-2">
              <Type size={14} />
              <span>Typography & Spacing</span>
            </TabsTrigger>
          </TabsList>

          {/* ===================== TAB 1: UI COMPONENTS ===================== */}
          <TabsContent value="components" className="space-y-10">
            {/* 1. BUTTONS */}
            <Card>
              <CardHeader>
                <CardTitle>1. Buttons</CardTitle>
                <CardDescription>
                  Production-grade button component supporting 5 visual variants, 3 sizes, left/right icons, and accessible focus states.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">Variants</h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="primary">Primary Action</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost Button</Button>
                    <Button variant="danger">Destructive</Button>
                    <Button variant="primary" disabled>Disabled State</Button>
                  </div>
                </div>

                <Divider />

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">Sizes & Icon Addons</h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm" leftIcon={<Plus size={14} />}>Small Button</Button>
                    <Button size="md" leftIcon={<FolderOpen size={16} />}>Medium (Default)</Button>
                    <Button size="lg" rightIcon={<ExternalLink size={16} />}>Large Button</Button>
                    <Button size="md" isLoading>Saving Deliverable...</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <span className="text-xs text-text-muted">Interactive test of primary & secondary button tokens</span>
                <Button variant="ghost" size="sm">Learn More →</Button>
              </CardFooter>
            </Card>

            {/* 2. FORM CONTROLS & FORM FIELD */}
            <Card>
              <CardHeader>
                <CardTitle>2. Form Inputs & FormField Wrapper</CardTitle>
                <CardDescription>
                  Clean, structured form primitives with built-in accessibility, label association, helper hints, and error messaging.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Text Input */}
                  <FormField
                    id="client-name"
                    label="Client Name"
                    required
                    hint="Full legal name or business entity"
                  >
                    <Input
                      id="client-name"
                      placeholder="e.g. Acme Corporation"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                    />
                  </FormField>

                  {/* Search Input with Icon */}
                  <FormField
                    id="search-input"
                    label="Search Deliverables"
                    optional
                  >
                    <Input
                      id="search-input"
                      placeholder="Search deliverables, contracts..."
                      leftIcon={<Search size={16} />}
                    />
                  </FormField>

                  {/* Select */}
                  <FormField
                    id="project-type"
                    label="Deliverable Category"
                    required
                    hint="Select the billing model"
                  >
                    <Select
                      id="project-type"
                      options={[
                        { value: 'fixed', label: 'Fixed Price Milestone' },
                        { value: 'hourly', label: 'Hourly Rate Retainer' },
                        { value: 'weekly', label: 'Weekly Sprint' },
                      ]}
                    />
                  </FormField>

                  {/* Input with Error State */}
                  <FormField
                    id="validation-demo"
                    label="Contract Value ($ USD)"
                    required
                    error={hasError ? 'Please enter a valid numeric amount greater than $0' : undefined}
                    hint="Toggle validation error below"
                  >
                    <Input
                      id="validation-demo"
                      placeholder="5000"
                      hasError={hasError}
                    />
                  </FormField>

                  {/* Textarea */}
                  <div className="md:col-span-2">
                    <FormField
                      id="scope-desc"
                      label="Scope Summary"
                      optional
                      hint="Brief overview of project specifications"
                    >
                      <Textarea
                        id="scope-desc"
                        placeholder="Outline the key deliverable milestones and handover requirements..."
                        rows={3}
                      />
                    </FormField>
                  </div>

                  {/* Checkbox */}
                  <div className="md:col-span-2 space-y-3 pt-2">
                    <Checkbox
                      checked={cbChecked}
                      onChange={(e) => setCbChecked(e.target.checked)}
                      label="Send automatic payment reminder to client"
                      description="FreelanceHub will email an invoice notification 3 days prior to milestone due date."
                    />
                    <Checkbox
                      checked={hasError}
                      onChange={(e) => setHasError(e.target.checked)}
                      label="Toggle simulated validation error state above"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3. BADGES & STATUS INDICATORS */}
            <Card>
              <CardHeader>
                <CardTitle>3. Badges & Status Indicators</CardTitle>
                <CardDescription>
                  Subtle, semantic pill indicators with optional status dots for clear lifecycle tracking.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">Semantic Variants</h4>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Badge variant="brand" dot>Forest Brand</Badge>
                    <Badge variant="success" dot>Active Contract</Badge>
                    <Badge variant="warning" dot>Pending Approval</Badge>
                    <Badge variant="error" dot>Payment Overdue</Badge>
                    <Badge variant="info" dot>Under Review</Badge>
                    <Badge variant="default">Draft Deliverable</Badge>
                    <Badge variant="outline">Archived</Badge>
                  </div>
                </div>

                <Divider />

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">Sizes</h4>
                  <div className="flex items-center gap-3">
                    <Badge variant="success" size="sm" dot>Small (11px)</Badge>
                    <Badge variant="success" size="md" dot>Medium (12px Default)</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 4. DATA TABLE PRIMITIVE */}
            <Card className="p-0 overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-border-subtle flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-text-primary tracking-tight">
                    4. Data Table Primitive
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Semantic table structure with clean borders, aligned cells, and hover highlights.
                  </p>
                </div>
                <Badge variant="brand" size="sm">
                  Responsive Container
                </Badge>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Deliverable Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Design System Spec v1.0</TableCell>
                    <TableCell className="text-text-secondary text-xs">UX Foundation</TableCell>
                    <TableCell>
                      <Badge variant="success" size="sm" dot>Completed</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">$3,200.00</TableCell>
                    <TableCell className="text-right">
                      <Dropdown
                        trigger={
                          <button
                            type="button"
                            aria-label="Actions"
                            className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                          >
                            <MoreVertical size={16} />
                          </button>
                        }
                        items={[
                          { id: '1', label: 'View Spec', icon: <ExternalLink size={14} /> },
                          { id: '2', label: 'Edit Deliverable', icon: <Edit2 size={14} /> },
                          { id: '3', label: 'Delete Item', icon: <Trash2 size={14} />, destructive: true },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Responsive Layout Templates</TableCell>
                    <TableCell className="text-text-secondary text-xs">Frontend Scaffolding</TableCell>
                    <TableCell>
                      <Badge variant="warning" size="sm" dot>In Progress</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">$2,450.00</TableCell>
                    <TableCell className="text-right">
                      <Dropdown
                        trigger={
                          <button
                            type="button"
                            aria-label="Actions"
                            className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                          >
                            <MoreVertical size={16} />
                          </button>
                        }
                        items={[
                          { id: '1', label: 'View Spec', icon: <ExternalLink size={14} /> },
                          { id: '2', label: 'Edit Deliverable', icon: <Edit2 size={14} /> },
                          { id: '3', label: 'Delete Item', icon: <Trash2 size={14} />, destructive: true },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Client Review Workshop</TableCell>
                    <TableCell className="text-text-secondary text-xs">Consulting</TableCell>
                    <TableCell>
                      <Badge variant="info" size="sm" dot>Scheduled</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">$950.00</TableCell>
                    <TableCell className="text-right">
                      <Dropdown
                        trigger={
                          <button
                            type="button"
                            aria-label="Actions"
                            className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                          >
                            <MoreVertical size={16} />
                          </button>
                        }
                        items={[
                          { id: '1', label: 'View Spec', icon: <ExternalLink size={14} /> },
                          { id: '2', label: 'Edit Deliverable', icon: <Edit2 size={14} /> },
                          { id: '3', label: 'Delete Item', icon: <Trash2 size={14} />, destructive: true },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>

            {/* 5. TOOLTIPS, DROPDOWNS & OVERLAYS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tooltip Card */}
              <Card>
                <CardHeader>
                  <CardTitle>5. Tooltips</CardTitle>
                  <CardDescription>
                    Accessible hover and focus tooltips with 4 directional positions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-4 py-4">
                    <Tooltip content="Tooltip placed on top" position="top">
                      <Button variant="outline" size="sm">Hover Top</Button>
                    </Tooltip>
                    <Tooltip content="Tooltip placed on bottom" position="bottom">
                      <Button variant="outline" size="sm">Hover Bottom</Button>
                    </Tooltip>
                    <Tooltip content="Forest Green Theme Active" position="right">
                      <Badge variant="brand" dot className="cursor-help">Hover Badge</Badge>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>

              {/* Skeleton Loading Card */}
              <Card>
                <CardHeader>
                  <CardTitle>6. Loading Skeletons</CardTitle>
                  <CardDescription>
                    Fluid placeholder animations to prevent cumulative layout shift.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton variant="circular" className="h-10 w-10 shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-12 w-full mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* 7. EMPTY STATE */}
            <Card>
              <CardHeader>
                <CardTitle>7. Empty State Primitive</CardTitle>
                <CardDescription>
                  Quiet, professional empty slate following Bonsai design principles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmptyState
                  title="No deliverables created yet"
                  description="When you create contracts or deliverable milestones, they will be organized cleanly in this view."
                  action={
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Plus size={14} />}
                      onClick={() => setIsModalOpen(true)}
                    >
                      Create First Deliverable
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===================== TAB 2: COLOR TOKENS ===================== */}
          <TabsContent value="colors" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Forest Green Palette Architecture</CardTitle>
                <CardDescription>
                  The signature Bonsai-inspired color palette designed for high legibility, clean visual hierarchy, and production SaaS aesthetics.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Brand Colors */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
                    Brand Core Tokens
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="rounded-xl border border-border p-3 bg-surface">
                      <div className="h-14 rounded-lg bg-[#173F35] mb-2.5 border border-border/20 shadow-xs" />
                      <p className="text-xs font-semibold text-text-primary">Forest Green</p>
                      <p className="text-[11px] font-mono text-text-muted">#173F35</p>
                      <p className="text-[10px] text-text-secondary mt-1">Brand Identity</p>
                    </div>

                    <div className="rounded-xl border border-border p-3 bg-surface">
                      <div className="h-14 rounded-lg bg-[#287A58] mb-2.5 border border-border/20 shadow-xs" />
                      <p className="text-xs font-semibold text-text-primary">Primary Green</p>
                      <p className="text-[11px] font-mono text-text-muted">#287A58</p>
                      <p className="text-[10px] text-text-secondary mt-1">Primary Actions</p>
                    </div>

                    <div className="rounded-xl border border-border p-3 bg-surface">
                      <div className="h-14 rounded-lg bg-[#A8C8B2] mb-2.5 border border-border/20 shadow-xs" />
                      <p className="text-xs font-semibold text-text-primary">Muted Sage</p>
                      <p className="text-[11px] font-mono text-text-muted">#A8C8B2</p>
                      <p className="text-[10px] text-text-secondary mt-1">Soft Highlights</p>
                    </div>

                    <div className="rounded-xl border border-border p-3 bg-surface">
                      <div className="h-14 rounded-lg bg-[#F4F6F1] mb-2.5 border border-border shadow-xs" />
                      <p className="text-xs font-semibold text-text-primary">Warm Background</p>
                      <p className="text-[11px] font-mono text-text-muted">#F4F6F1</p>
                      <p className="text-[10px] text-text-secondary mt-1">App Canvas</p>
                    </div>

                    <div className="rounded-xl border border-border p-3 bg-surface">
                      <div className="h-14 rounded-lg bg-[#252B28] mb-2.5 border border-border/20 shadow-xs" />
                      <p className="text-xs font-semibold text-text-primary">Charcoal</p>
                      <p className="text-[11px] font-mono text-text-muted">#252B28</p>
                      <p className="text-[10px] text-text-secondary mt-1">Primary Text</p>
                    </div>

                    <div className="rounded-xl border border-border p-3 bg-surface">
                      <div className="h-14 rounded-lg bg-[#E2E8E2] mb-2.5 border border-border shadow-xs" />
                      <p className="text-xs font-semibold text-text-primary">Border</p>
                      <p className="text-[11px] font-mono text-text-muted">#E2E8E2</p>
                      <p className="text-[10px] text-text-secondary mt-1">Dividers & Cards</p>
                    </div>
                  </div>
                </div>

                <Divider />

                {/* Semantic Tokens */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
                    Semantic Status Systems
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="rounded-xl border border-success-border bg-success-bg p-4 text-success-text">
                      <div className="flex items-center gap-2 font-semibold text-sm">
                        <CheckCircle2 size={16} />
                        <span>Success Status</span>
                      </div>
                      <p className="text-xs mt-1 opacity-90">
                        Paid invoices, active contracts, and completed milestones.
                      </p>
                    </div>

                    <div className="rounded-xl border border-warning-border bg-warning-bg p-4 text-warning-text">
                      <div className="flex items-center gap-2 font-semibold text-sm">
                        <ShieldAlert size={16} />
                        <span>Warning Status</span>
                      </div>
                      <p className="text-xs mt-1 opacity-90">
                        Pending approvals, upcoming renewals, and unverified records.
                      </p>
                    </div>

                    <div className="rounded-xl border border-error-border bg-error-bg p-4 text-error-text">
                      <div className="flex items-center gap-2 font-semibold text-sm">
                        <ShieldAlert size={16} />
                        <span>Error / Overdue</span>
                      </div>
                      <p className="text-xs mt-1 opacity-90">
                        Overdue invoices, failed transactions, and critical alerts.
                      </p>
                    </div>

                    <div className="rounded-xl border border-info-border bg-info-bg p-4 text-info-text">
                      <div className="flex items-center gap-2 font-semibold text-sm">
                        <CheckCircle2 size={16} />
                        <span>Information</span>
                      </div>
                      <p className="text-xs mt-1 opacity-90">
                        In-review deliverables, scheduled calls, and metadata notes.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===================== TAB 3: TYPOGRAPHY ===================== */}
          <TabsContent value="typography" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Typography Scale & Spacing System</CardTitle>
                <CardDescription>
                  Geist Sans typographic scale adhering to the 4px vertical rhythm and Bonsai visual principles.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-border-subtle pb-3">
                    <span className="text-xs font-mono text-text-muted w-36">Page Title (28px)</span>
                    <h1 className="text-2xl sm:text-[28px] font-semibold text-text-primary tracking-tight">
                      Client & Deliverable Overview
                    </h1>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-border-subtle pb-3">
                    <span className="text-xs font-mono text-text-muted w-36">Section Title (18px)</span>
                    <h2 className="text-lg font-semibold text-text-primary tracking-tight">
                      Active Milestones & Deliverables
                    </h2>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-border-subtle pb-3">
                    <span className="text-xs font-mono text-text-muted w-36">Subheading (15px)</span>
                    <h3 className="text-[15px] font-medium text-text-primary">
                      Contract Details & Sprints
                    </h3>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-border-subtle pb-3">
                    <span className="text-xs font-mono text-text-muted w-36">Body (14px)</span>
                    <p className="text-sm text-text-secondary leading-relaxed max-w-xl">
                      Deliverables are managed sequentially with client sign-off triggers before milestone payments are unlocked.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-border-subtle pb-3">
                    <span className="text-xs font-mono text-text-muted w-36">Metadata / Label (12px)</span>
                    <span className="text-xs text-text-muted uppercase tracking-wider font-medium">
                      INV-2026-0042 • DUE IN 5 DAYS
                    </span>
                  </div>
                </div>

                <Divider />

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                    Border Radius Scale
                  </h4>
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="p-3 bg-surface border border-border rounded-md text-xs text-center w-28">
                      rounded-md (6px)
                    </div>
                    <div className="p-3 bg-surface border border-border rounded-lg text-xs text-center w-28 font-medium">
                      rounded-lg (8px)
                    </div>
                    <div className="p-3 bg-surface border border-border rounded-xl text-xs text-center w-28 font-medium">
                      rounded-xl (12px)
                    </div>
                    <div className="p-3 bg-surface border border-border rounded-full text-xs text-center w-28">
                      rounded-full
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal Demonstration */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Milestone"
          description="Define a deliverable package with completion criteria."
          size="md"
        >
          <div className="space-y-4">
            <FormField id="m-title" label="Milestone Title" required>
              <Input id="m-title" placeholder="e.g. Frontend Architecture Delivery" />
            </FormField>
            <FormField id="m-notes" label="Requirements & Deliverables" optional>
              <Textarea id="m-notes" placeholder="Summarize acceptance criteria..." rows={3} />
            </FormField>
            <Checkbox label="Notify client upon creation" />
          </div>
          <ModalFooter>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Check size={14} />}
              onClick={() => setIsModalOpen(false)}
            >
              Save Milestone
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    </div>
  );
}
