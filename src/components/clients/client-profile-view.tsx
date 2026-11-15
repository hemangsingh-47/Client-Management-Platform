'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Client,
  ClientProject,
  ClientProjectStatus,
  ClientPayment,
  PaymentMethod,
  PaymentStatus,
  ClientActivity,
} from '@/lib/mock-data/clients';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';
import {
  ClientProjectsList,
  ClientPaymentsList,
  ClientActivityTimeline,
  ClientFormModal,
  ClientFormData,
} from '@/components/clients';
import { formatINR } from '@/lib/utils';
import { useAppContext } from '@/context/app-context';
import {
  ChevronRight,
  ArrowLeft,
  Pencil,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  FileText,
  Briefcase,
  CreditCard,
  Clock,
  TrendingUp,
  Check,
  Copy,
} from 'lucide-react';

import { clientsApi, ClientDetails } from '@/lib/api';

export interface ClientProfileViewProps {
  clientId: string;
}

function normalizePaymentMethod(method?: string | null): PaymentMethod {
  if (!method) return 'Bank Transfer';
  const m = method.toUpperCase().replace(/\s+/g, '_');
  if (m === 'UPI') return 'UPI';
  if (m === 'CREDIT_CARD') return 'Credit Card';
  if (m === 'STRIPE') return 'Stripe';
  return 'Bank Transfer';
}

function normalizePaymentStatus(status?: string | null): PaymentStatus {
  if (!status) return 'Pending';
  const s = status.toUpperCase();
  if (s === 'COMPLETED') return 'Completed';
  if (s === 'PENDING') return 'Pending';
  return 'Failed';
}

export function ClientProfileView({ clientId }: ClientProfileViewProps) {
  const router = useRouter();
  const { clients, updateClient, payments: allPayments } = useAppContext();

  const [clientDetails, setClientDetails] = useState<ClientDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Fetch client details from database API
  const fetchClient = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const data = await clientsApi.getClientById(clientId);
      setClientDetails(data);
    } catch (err) {
      console.error('Failed to load client profile from API:', err);
      // Fallback to client in context if available
      const fallback = clients.find((c) => c.id === clientId);
      if (fallback) {
        setClientDetails({
          ...fallback,
          projects: [],
          recentActivities: [],
        });
      } else {
        setLoadError(err instanceof Error ? err.message : 'Client not found');
      }
    } finally {
      setIsLoading(false);
    }
  }, [clientId, clients]);

  React.useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  // Derived datasets from database
  const client = clientDetails || clients.find((c) => c.id === clientId);

  const projects: ClientProject[] = (clientDetails?.projects || []).map((p) => ({
    id: p.id,
    clientId,
    name: p.title,
    status: (p.status === 'IN_PROGRESS'
      ? 'In Progress'
      : p.status === 'COMPLETED'
      ? 'Completed'
      : p.status === 'PLANNING'
      ? 'Planning'
      : 'On Hold') as ClientProjectStatus,
    deadline: p.deadline,
    budget: p.budget,
    progress: p.progress,
  }));

  const payments: ClientPayment[] = allPayments
    .filter((pay) => pay.clientId === clientId || clientDetails?.projects?.some((p) => p.id === pay.projectId))
    .map((pay) => ({
      id: pay.id,
      clientId,
      date: pay.paymentDate,
      projectName: pay.projectName || 'Project Assignment',
      method: normalizePaymentMethod(pay.paymentMethod),
      amount: pay.amount,
      status: normalizePaymentStatus(pay.status),
    }));

  const activities: ClientActivity[] = (clientDetails?.recentActivities || []).map((act) => ({
    id: act.id,
    clientId,
    type: 'project_started',
    title: act.type.replace(/_/g, ' '),
    description: act.description,
    timestamp: new Date(act.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
  }));

  // Computed metrics
  const totalProjectsCount = client?.totalProjects || projects.length;
  const activeProjectsCount = projects.filter(
    (p) => p.status === 'In Progress' || p.status === 'Planning'
  ).length;

  const handleCopy = (text: string, fieldName: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleSaveProfile = async (data: ClientFormData) => {
    if (!client) return;
    const updated: Partial<Client> = {
      name: data.name,
      companyName: data.companyName || undefined,
      email: data.email,
      phone: data.phone || undefined,
      address: data.address || undefined,
      status: data.status,
      notes: data.notes || undefined,
    };
    await updateClient(client.id, updated);
    await fetchClient();
  };

  if (isLoading && !client) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-4 w-32 bg-surface-subtle rounded" />
        <div className="h-28 bg-surface-subtle rounded-xl border border-border" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-surface-subtle rounded-xl border border-border" />
          ))}
        </div>
      </div>
    );
  }

  if (loadError || !client) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Link href="/clients" className="hover:text-text-primary">
            Clients
          </Link>
          <ChevronRight size={14} />
          <span>Not Found</span>
        </div>
        <EmptyState
          title="Client Not Found"
          description={loadError || "The requested client record does not exist or has been removed."}
          action={
            <Button variant="primary" onClick={() => router.push('/clients')}>
              Return to Clients
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
          href="/clients"
          className="hover:text-brand-forest dark:hover:text-brand-sage transition-colors font-medium"
        >
          Clients
        </Link>
        <ChevronRight size={13} className="text-text-muted" />
        <span className="font-semibold text-text-primary truncate">
          {client.name}
        </span>
      </nav>

      {/* 2. Profile Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pb-6 border-b border-border-subtle">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              {client.name}
            </h1>
            <Badge
              variant={client.status === 'ACTIVE' ? 'success' : 'default'}
              size="md"
              dot
            >
              {client.status === 'ACTIVE' ? 'Active Client' : 'Inactive'}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-text-secondary">
            {client.companyName && (
              <span className="flex items-center gap-1.5 font-medium text-text-primary">
                <Building2 size={14} className="text-text-muted" />
                <span>{client.companyName}</span>
              </span>
            )}

            <a
              href={`mailto:${client.email}`}
              className="flex items-center gap-1.5 hover:text-brand-forest dark:hover:text-brand-sage transition-colors"
            >
              <Mail size={14} className="text-text-muted" />
              <span>{client.email}</span>
            </a>

            {client.phone && (
              <a
                href={`tel:${client.phone}`}
                className="flex items-center gap-1.5 hover:text-brand-forest dark:hover:text-brand-sage transition-colors"
              >
                <Phone size={14} className="text-text-muted" />
                <span>{client.phone}</span>
              </a>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/clients')}
            className="flex items-center gap-1.5"
          >
            <ArrowLeft size={14} />
            <span>Back to Clients</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsEditOpen(true)}
            className="flex items-center gap-1.5 shadow-xs"
          >
            <Pencil size={14} />
            <span>Edit Profile</span>
          </Button>
        </div>
      </div>

      {/* 3. Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Projects */}
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-text-secondary mb-2">
            <span className="text-xs font-medium">Total Projects</span>
            <div className="p-1 rounded-md bg-surface-subtle border border-border-subtle">
              <Briefcase size={14} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
            {totalProjectsCount}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            All-time assignments
          </span>
        </Card>

        {/* Active Projects */}
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-text-secondary mb-2">
            <span className="text-xs font-medium">Active Projects</span>
            <div className="p-1 rounded-md bg-brand-sage-light text-brand-forest dark:text-brand-sage border border-brand-sage/40">
              <TrendingUp size={14} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-brand-forest dark:text-brand-sage">
            {activeProjectsCount}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            In progress & planning
          </span>
        </Card>

        {/* Total Paid */}
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-text-secondary mb-2">
            <span className="text-xs font-medium">Total Paid</span>
            <div className="p-1 rounded-md bg-success-bg text-success-text border border-success-border">
              <CreditCard size={14} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary font-mono">
            {formatINR(client.totalPaid)}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            Settled invoices
          </span>
        </Card>

        {/* Outstanding Balance */}
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-text-secondary mb-2">
            <span className="text-xs font-medium">Outstanding Balance</span>
            <div className="p-1 rounded-md bg-warning-bg text-warning-text border border-warning-border">
              <Clock size={14} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary font-mono">
            {formatINR(client.outstanding)}
          </div>
          <span className="text-[11px] text-text-muted mt-0.5 inline-block">
            {client.outstanding > 0 ? 'Pending milestones' : 'Zero balance due'}
          </span>
        </Card>
      </div>

      {/* 4. Main Profile Layout (2 Columns: Main Details + Sidebar Info Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: Tabs for Projects, Invoices, Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <Tabs defaultValue="projects" className="w-full">
            <TabsList>
              <TabsTrigger value="projects" className="flex items-center gap-1.5">
                <span>Projects</span>
                <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-surface-subtle border border-border font-mono">
                  {projects.length}
                </span>
              </TabsTrigger>

              <TabsTrigger value="payments" className="flex items-center gap-1.5">
                <span>Invoices & Payments</span>
                <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-surface-subtle border border-border font-mono">
                  {payments.length}
                </span>
              </TabsTrigger>

              <TabsTrigger value="timeline" className="flex items-center gap-1.5">
                <span>Activity Timeline</span>
                <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-surface-subtle border border-border font-mono">
                  {activities.length}
                </span>
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Projects List */}
            <TabsContent value="projects">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-text-primary">
                    Associated Client Projects
                  </h3>
                  <Link
                    href="/projects"
                    className="text-xs font-medium text-brand-forest dark:text-brand-sage hover:underline"
                  >
                    View All Projects →
                  </Link>
                </div>
                <ClientProjectsList projects={projects} />
              </div>
            </TabsContent>

            {/* Tab 2: Payments List */}
            <TabsContent value="payments">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-text-primary">
                    Invoices & Payment History
                  </h3>
                  <Link
                    href="/payments"
                    className="text-xs font-medium text-brand-forest dark:text-brand-sage hover:underline"
                  >
                    Go to Payments Ledger →
                  </Link>
                </div>
                <ClientPaymentsList payments={payments} />
              </div>
            </TabsContent>

            {/* Tab 3: Activity Timeline */}
            <TabsContent value="timeline">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-text-primary">
                  Client Relationship Activity
                </h3>
                <ClientActivityTimeline activities={activities} />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right 1 Column: Client Profile Info Card */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span>Profile Information</span>
                <button
                  type="button"
                  onClick={() => setIsEditOpen(true)}
                  aria-label="Edit Profile"
                  className="text-xs font-medium text-brand-forest dark:text-brand-sage hover:underline flex items-center gap-1"
                >
                  <Pencil size={12} />
                  <span>Edit</span>
                </button>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 pt-4 text-xs sm:text-sm">
              {/* Email */}
              <div className="space-y-1">
                <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
                  Email Address
                </span>
                <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-surface-subtle border border-border-subtle">
                  <span className="text-text-primary font-medium truncate">
                    {client.email}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(client.email, 'email')}
                    title="Copy email address"
                    className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface transition-colors shrink-0"
                  >
                    {copiedField === 'email' ? (
                      <Check size={14} className="text-success-text" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
                  Phone Number
                </span>
                <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-surface-subtle border border-border-subtle">
                  <span className="text-text-primary font-medium truncate">
                    {client.phone || 'Not provided'}
                  </span>
                  {client.phone && (
                    <button
                      type="button"
                      onClick={() => handleCopy(client.phone || '', 'phone')}
                      title="Copy phone number"
                      className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface transition-colors shrink-0"
                    >
                      {copiedField === 'phone' ? (
                        <Check size={14} className="text-success-text" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Company */}
              <div className="space-y-1">
                <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
                  Company / Organization
                </span>
                <p className="text-text-primary font-medium">
                  {client.companyName || 'Independent Freelance Contract'}
                </p>
              </div>

              {/* Address */}
              <div className="space-y-1">
                <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
                  Billing Address
                </span>
                <div className="flex items-start gap-1.5 text-text-primary leading-relaxed">
                  <MapPin size={14} className="shrink-0 text-text-muted mt-0.5" />
                  <span className="text-xs">
                    {client.address || 'No billing address specified'}
                  </span>
                </div>
              </div>

              {/* Client Since */}
              <div className="space-y-1">
                <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
                  Client Relationship Started
                </span>
                <div className="flex items-center gap-1.5 text-text-primary">
                  <Calendar size={14} className="shrink-0 text-text-muted" />
                  <span className="text-xs">{client.createdAt}</span>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5 pt-2 border-t border-border-subtle">
                <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider flex items-center gap-1">
                  <FileText size={12} />
                  <span>Notes & Terms</span>
                </span>
                <div className="p-3 rounded-lg bg-brand-sage-light/40 border border-brand-sage/20 text-xs text-text-primary leading-relaxed italic">
                  &ldquo;{client.notes || 'No internal notes recorded for this client.'}&rdquo;
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Client Modal */}
      <ClientFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSaveProfile}
        initialData={client}
      />
    </div>
  );
}

export default ClientProfileView;

