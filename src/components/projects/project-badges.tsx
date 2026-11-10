'use client';

import React from 'react';
import { Badge, BadgeVariant } from '@/components/ui/badge';
import {
  ProjectStatus,
  ProjectPriority,
  PROJECT_STATUS_LABELS,
  PROJECT_PRIORITY_LABELS,
} from '@/lib/mock-data/projects';
import { AlertCircle, AlertTriangle, ArrowDown } from 'lucide-react';

export function ProjectStatusBadge({
  status,
  size = 'sm',
}: {
  status: ProjectStatus;
  size?: 'sm' | 'md';
}) {
  const getVariant = (s: ProjectStatus): BadgeVariant => {
    switch (s) {
      case 'IN_PROGRESS':
        return 'brand';
      case 'COMPLETED':
        return 'success';
      case 'PLANNING':
        return 'info';
      case 'ON_HOLD':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Badge variant={getVariant(status)} size={size} dot>
      {PROJECT_STATUS_LABELS[status] || status}
    </Badge>
  );
}

export function ProjectPriorityBadge({
  priority,
  size = 'sm',
}: {
  priority: ProjectPriority;
  size?: 'sm' | 'md';
}) {
  const getConfig = (p: ProjectPriority) => {
    switch (p) {
      case 'HIGH':
        return {
          variant: 'error' as BadgeVariant,
          icon: <AlertCircle size={11} className="shrink-0" />,
        };
      case 'MEDIUM':
        return {
          variant: 'warning' as BadgeVariant,
          icon: <AlertTriangle size={11} className="shrink-0" />,
        };
      case 'LOW':
      default:
        return {
          variant: 'default' as BadgeVariant,
          icon: <ArrowDown size={11} className="shrink-0" />,
        };
    }
  };

  const config = getConfig(priority);

  return (
    <Badge
      variant={config.variant}
      size={size}
      className="inline-flex items-center gap-1 font-medium"
    >
      {config.icon}
      <span>{PROJECT_PRIORITY_LABELS[priority] || priority}</span>
    </Badge>
  );
}
