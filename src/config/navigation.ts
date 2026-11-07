import {
  LayoutDashboard,
  Users,
  Briefcase,
  CheckSquare,
  PackageCheck,
  CreditCard,
  BarChart3,
  Settings,
  HelpCircle,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  exact?: boolean;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: 'Clients',
    href: '/clients',
    icon: Users,
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: Briefcase,
  },
  {
    title: 'Tasks & Milestones',
    href: '/tasks',
    icon: CheckSquare,
  },
  {
    title: 'Deliverables',
    href: '/deliverables',
    icon: PackageCheck,
  },
  {
    title: 'Payments',
    href: '/payments',
    icon: CreditCard,
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: BarChart3,
  },
];

export const SECONDARY_NAV_ITEMS: NavItem[] = [
  {
    title: 'Design System',
    href: '/showcase',
    icon: Sparkles,
    badge: 'Phase 2',
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
  {
    title: 'Help & Support',
    href: '#help',
    icon: HelpCircle,
  },
];

export interface Workspace {
  id: string;
  name: string;
  role: string;
  plan: string;
  initials: string;
}

export const SAMPLE_WORKSPACES: Workspace[] = [
  {
    id: 'ws-1',
    name: 'Studio Workspace',
    role: 'Owner',
    plan: 'Pro Freelancer',
    initials: 'SW',
  },
  {
    id: 'ws-2',
    name: 'Personal Consulting',
    role: 'Individual',
    plan: 'Solo',
    initials: 'PC',
  },
];

