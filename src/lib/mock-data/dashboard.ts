/**
 * FreelanceHub — Phase 4 Dashboard Centralized Mock Data
 * Realistic, typed development sample data for UI demonstration.
 */

export interface DashboardKpiData {
  paidThisMonth: {
    amount: number;
    changePercentage: number;
    comparisonText: string;
  };
  outstandingPayments: {
    amount: number;
    pendingCount: number;
    note: string;
  };
  activeProjects: {
    totalActive: number;
    onHoldCount: number;
    planningCount: number;
  };
  tasksDueSoon: {
    dueSoonCount: number;
    overdueCount: number;
    note: string;
  };
}

export type ProjectStatusType = 'In Progress' | 'Planning' | 'On Hold' | 'Completed';

export interface DashboardProject {
  id: string;
  name: string;
  client: string;
  status: ProjectStatusType;
  deadline: string;
  progress: number;
  budget: number;
}

export type TaskPriorityType = 'High' | 'Medium' | 'Low';

export interface DashboardTask {
  id: string;
  title: string;
  project: string;
  dueDate: string;
  priority: TaskPriorityType;
  isOverdue?: boolean;
  isCompleted?: boolean;
}

export interface MonthlyEarningPoint {
  month: string;
  amount: number;
}

export interface DashboardActivity {
  id: string;
  type: 'payment' | 'task' | 'project' | 'deliverable' | 'deadline';
  title: string;
  description: string;
  project?: string;
  client?: string;
  timestamp: string;
}

export const MOCK_DASHBOARD_KPIS: DashboardKpiData = {
  paidThisMonth: {
    amount: 85000,
    changePercentage: 12.5,
    comparisonText: 'vs ₹75,500 last month',
  },
  outstandingPayments: {
    amount: 120000,
    pendingCount: 2,
    note: 'Across 2 milestone invoices',
  },
  activeProjects: {
    totalActive: 4,
    onHoldCount: 1,
    planningCount: 1,
  },
  tasksDueSoon: {
    dueSoonCount: 4,
    overdueCount: 1,
    note: 'Due in next 7 days (1 overdue)',
  },
};

export const MOCK_ACTIVE_PROJECTS: DashboardProject[] = [
  {
    id: 'proj-1',
    name: 'Website Redesign',
    client: 'Acme Studio',
    status: 'In Progress',
    deadline: '18 Nov 2026',
    progress: 72,
    budget: 45000,
  },
  {
    id: 'proj-2',
    name: 'Mobile App UI',
    client: 'Northstar Labs',
    status: 'In Progress',
    deadline: '24 Nov 2026',
    progress: 45,
    budget: 80000,
  },
  {
    id: 'proj-3',
    name: 'Brand Identity',
    client: 'Studio Eleven',
    status: 'Planning',
    deadline: '29 Nov 2026',
    progress: 15,
    budget: 30000,
  },
  {
    id: 'proj-4',
    name: 'E-commerce Platform',
    client: 'UrbanCart',
    status: 'On Hold',
    deadline: '12 Dec 2026',
    progress: 60,
    budget: 120000,
  },
];

export const MOCK_UPCOMING_TASKS: DashboardTask[] = [
  {
    id: 'task-1',
    title: 'Finalize homepage wireframe',
    project: 'Website Redesign',
    dueDate: 'Today',
    priority: 'High',
    isOverdue: true,
    isCompleted: false,
  },
  {
    id: 'task-2',
    title: 'API integration',
    project: 'Mobile App UI',
    dueDate: 'Tomorrow',
    priority: 'Medium',
    isCompleted: false,
  },
  {
    id: 'task-3',
    title: 'Review brand guidelines',
    project: 'Brand Identity',
    dueDate: '20 Nov',
    priority: 'Low',
    isCompleted: false,
  },
  {
    id: 'task-4',
    title: 'Complete checkout testing',
    project: 'E-commerce Platform',
    dueDate: '21 Nov',
    priority: 'High',
    isCompleted: false,
  },
];

export const MOCK_EARNINGS_RANGES: Record<string, { label: string; data: MonthlyEarningPoint[] }> = {
  '6m': {
    label: 'Last 6 Months',
    data: [
      { month: 'Jun', amount: 52000 },
      { month: 'Jul', amount: 44000 },
      { month: 'Aug', amount: 68000 },
      { month: 'Sep', amount: 60000 },
      { month: 'Oct', amount: 75500 },
      { month: 'Nov', amount: 85000 },
    ],
  },
  'year': {
    label: 'This Year (2026)',
    data: [
      { month: 'Jan', amount: 32000 },
      { month: 'Feb', amount: 45000 },
      { month: 'Mar', amount: 48000 },
      { month: 'Apr', amount: 40000 },
      { month: 'May', amount: 38000 },
      { month: 'Jun', amount: 52000 },
      { month: 'Jul', amount: 44000 },
      { month: 'Aug', amount: 68000 },
      { month: 'Sep', amount: 60000 },
      { month: 'Oct', amount: 75500 },
      { month: 'Nov', amount: 85000 },
    ],
  },
  '12m': {
    label: 'Last 12 Months',
    data: [
      { month: 'Dec 25', amount: 42000 },
      { month: 'Jan 26', amount: 32000 },
      { month: 'Feb 26', amount: 45000 },
      { month: 'Mar 26', amount: 48000 },
      { month: 'Apr 26', amount: 40000 },
      { month: 'May 26', amount: 38000 },
      { month: 'Jun 26', amount: 52000 },
      { month: 'Jul 26', amount: 44000 },
      { month: 'Aug 26', amount: 68000 },
      { month: 'Sep 26', amount: 60000 },
      { month: 'Oct 26', amount: 75500 },
      { month: 'Nov 26', amount: 85000 },
    ],
  },
};

export const MOCK_RECENT_ACTIVITIES: DashboardActivity[] = [
  {
    id: 'act-1',
    type: 'payment',
    title: 'Payment recorded',
    description: 'Received ₹15,000 for milestone 1 handover',
    project: 'Website Redesign',
    client: 'Acme Studio',
    timestamp: '15m ago',
  },
  {
    id: 'act-2',
    type: 'task',
    title: 'Task completed',
    description: 'Homepage wireframe marked ready for sign-off',
    project: 'Website Redesign',
    timestamp: '1h ago',
  },
  {
    id: 'act-3',
    type: 'project',
    title: 'Project initiated',
    description: 'Scope and timeline confirmed with client',
    project: 'Mobile App UI',
    client: 'Northstar Labs',
    timestamp: '3h ago',
  },
  {
    id: 'act-4',
    type: 'deliverable',
    title: 'Deliverable submitted',
    description: 'Brand color tokens and logo exports shared for review',
    project: 'Brand Identity',
    client: 'Studio Eleven',
    timestamp: 'Yesterday',
  },
  {
    id: 'act-5',
    type: 'deadline',
    title: 'Milestone updated',
    description: 'Delivery target adjusted to 12 Dec 2026',
    project: 'E-commerce Platform',
    timestamp: '2 days ago',
  },
];

