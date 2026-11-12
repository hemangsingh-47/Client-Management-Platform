'use client';

import React, { useState, useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  ReportSummaryCards,
  ReportFilters,
  RevenueChart,
  ProjectStatusDistribution,
  ClientPerformanceTable,
  ProjectPerformanceTable,
  TaskPerformanceSection,
  ReportDateRange,
  ReportStatusFilter,
} from '@/components/reports';
import { getMonthlyRevenueData, downloadCsv } from '@/lib/utils/report-utils';
import { getProjectFinancialSummary } from '@/lib/utils/payment-utils';
import { Download } from 'lucide-react';

export default function ReportsPage() {
  const { clients, projects, tasks, milestones, payments } = useAppContext();

  // Filters State
  const [dateRange, setDateRange] = useState<ReportDateRange>('ALL');
  const [clientFilter, setClientFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<ReportStatusFilter>('ALL');

  // Clear filters
  const handleClearFilters = () => {
    setDateRange('ALL');
    setClientFilter('ALL');
    setStatusFilter('ALL');
  };

  const hasActiveFilters =
    dateRange !== 'ALL' || clientFilter !== 'ALL' || statusFilter !== 'ALL';

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (clientFilter !== 'ALL' && project.clientId !== clientFilter) {
        return false;
      }
      if (statusFilter !== 'ALL' && project.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [projects, clientFilter, statusFilter]);

  // Filtered Payments
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      // Client filter
      if (clientFilter !== 'ALL') {
        const project = projects.find((p) => p.id === payment.projectId);
        if (project?.clientId !== clientFilter) return false;
      }

      // Date Range filter
      if (dateRange === 'THIS_MONTH') {
        if (!payment.paymentDate.startsWith('2026-11')) return false;
      } else if (dateRange === 'LAST_3_MONTHS') {
        const validMonths = ['2026-09', '2026-10', '2026-11'];
        const isMatch = validMonths.some((m) => payment.paymentDate.startsWith(m));
        if (!isMatch) return false;
      } else if (dateRange === 'THIS_YEAR') {
        if (!payment.paymentDate.startsWith('2026')) return false;
      }

      return true;
    });
  }, [payments, clientFilter, dateRange, projects]);

  // Filtered Tasks & Milestones (matching filtered projects)
  const filteredProjectIds = useMemo(
    () => new Set(filteredProjects.map((p) => p.id)),
    [filteredProjects]
  );

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => filteredProjectIds.has(t.projectId));
  }, [tasks, filteredProjectIds]);

  const filteredMilestones = useMemo(() => {
    return milestones.filter((m) => filteredProjectIds.has(m.projectId));
  }, [milestones, filteredProjectIds]);

  // Overall Financial Calculations for Summary Cards
  const totalSettledRevenue = useMemo(() => {
    return filteredPayments
      .filter((p) => p.status === 'Completed')
      .reduce((sum, p) => sum + p.amount, 0);
  }, [filteredPayments]);

  const totalOutstanding = useMemo(() => {
    return filteredProjects.reduce((sum, proj) => {
      const fin = getProjectFinancialSummary(proj, payments);
      return sum + fin.outstandingBalance;
    }, 0);
  }, [filteredProjects, payments]);

  const completedProjectsCount = useMemo(() => {
    return filteredProjects.filter((p) => p.status === 'COMPLETED').length;
  }, [filteredProjects]);

  const completionRate = useMemo(() => {
    if (filteredProjects.length === 0) return 0;
    return Math.round((completedProjectsCount / filteredProjects.length) * 100);
  }, [filteredProjects, completedProjectsCount]);

  // Monthly Revenue Chart Data
  const monthlyRevenueData = useMemo(() => {
    return getMonthlyRevenueData(filteredPayments);
  }, [filteredPayments]);

  // Filtered Clients (matching clientFilter if selected)
  const displayClients = useMemo(() => {
    if (clientFilter === 'ALL') return clients;
    return clients.filter((c) => c.id === clientFilter);
  }, [clients, clientFilter]);

  // CSV Export Handler
  const handleExportCsv = () => {
    const headers = [
      'Project Title',
      'Client',
      'Status',
      'Budget (INR)',
      'Paid to Date (INR)',
      'Outstanding (INR)',
      'Progress (%)',
      'Start Date',
      'End Date',
    ];

    const rows = filteredProjects.map((project) => {
      const client = clients.find((c) => c.id === project.clientId);
      const fin = getProjectFinancialSummary(project, payments);
      return [
        project.title,
        client?.companyName || client?.name || 'N/A',
        project.status,
        fin.budget,
        fin.totalPaid,
        fin.outstandingBalance,
        `${project.progress}%`,
        project.startDate,
        project.deadline,
      ];
    });

    const dateStr = new Date().toISOString().split('T')[0];
    downloadCsv(`freelancehub-analytics-report-${dateStr}.csv`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Reports & Analytics"
        description="Comprehensive revenue tracking, client account performance, and delivery velocity."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 cursor-pointer shadow-xs font-medium"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </Button>
        }
      />

      {/* Filter Bar */}
      <ReportFilters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        clientFilter={clientFilter}
        onClientChange={setClientFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        clients={clients}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* 4 Summary KPI Cards */}
      <ReportSummaryCards
        totalRevenue={totalSettledRevenue}
        outstandingRevenue={totalOutstanding}
        completedProjectsCount={completedProjectsCount}
        completionRate={completionRate}
      />

      {/* Visual Analytics Grid: Revenue Trend & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={monthlyRevenueData} />
        </div>
        <div>
          <ProjectStatusDistribution projects={filteredProjects} />
        </div>
      </div>

      {/* Task & Milestone Velocity */}
      <TaskPerformanceSection tasks={filteredTasks} milestones={filteredMilestones} />

      {/* Client Performance Table */}
      <ClientPerformanceTable
        clients={displayClients}
        projects={filteredProjects}
        payments={payments}
      />

      {/* Project Financial & Progress Table */}
      <ProjectPerformanceTable
        projects={filteredProjects}
        payments={payments}
        clients={clients}
      />
    </div>
  );
}
