/**
 * FreelanceHub — Reporting & Analytics Business Logic Utilities
 */

import { ProjectStatus } from '@/types/project';
import { Payment } from '@/types/payment';

export interface MonthlyRevenuePoint {
  month: string;
  label: string;
  received: number;
  outstanding: number;
}

export interface ClientPerformanceRow {
  clientId: string;
  clientName: string;
  companyName: string;
  totalProjects: number;
  completedProjects: number;
  totalPaid: number;
  outstanding: number;
}

export interface ProjectPerformanceRow {
  projectId: string;
  projectTitle: string;
  clientName: string;
  budget: number;
  totalPaid: number;
  outstanding: number;
  status: ProjectStatus;
  progress: number;
}

export interface TaskPerformanceSummary {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number;
}

/**
 * Monthly revenue grouping from completed payments.
 */
export function getMonthlyRevenueData(
  payments: Payment[] = []
): MonthlyRevenuePoint[] {
  const months = [
    { key: '2026-06', label: 'Jun' },
    { key: '2026-07', label: 'Jul' },
    { key: '2026-08', label: 'Aug' },
    { key: '2026-09', label: 'Sep' },
    { key: '2026-10', label: 'Oct' },
    { key: '2026-11', label: 'Nov' },
  ];

  return months.map(({ key, label }) => {
    const monthPayments = payments.filter((p) => p.paymentDate.startsWith(key));
    const received = monthPayments
      .filter((p) => p.status === 'Completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const pending = monthPayments
      .filter((p) => p.status === 'Pending')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      month: key,
      label,
      received,
      outstanding: pending,
    };
  });
}

/**
 * Downloads a CSV file client-side.
 */
export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  if (typeof window === 'undefined') return;

  const escapeCell = (cell: string | number) => {
    const str = String(cell ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = headers.map(escapeCell).join(',');
  const rowLines = rows.map((row) => row.map(escapeCell).join(','));
  const csvContent = [headerLine, ...rowLines].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

