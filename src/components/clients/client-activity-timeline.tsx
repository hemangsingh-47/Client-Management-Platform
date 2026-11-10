'use client';

import React from 'react';
import { ClientActivity, ActivityType } from '@/lib/mock-data/clients';
import { EmptyState } from '@/components/ui/empty-state';
import {
  CreditCard,
  FileCheck2,
  FolderGit2,
  CheckCircle2,
  UserPlus,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ClientActivityTimelineProps {
  activities?: ClientActivity[];
}

export function ClientActivityTimeline({
  activities = [],
}: ClientActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <EmptyState
        icon={<Activity size={20} className="text-text-secondary" />}
        title="No activity recorded"
        description="Deliverables, payment events, and project milestones will appear here in chronological order."
      />
    );
  }

  const getActivityConfig = (type: ActivityType) => {
    switch (type) {
      case 'payment':
        return {
          icon: <CreditCard size={13} />,
          badgeBg: 'bg-success-bg text-success-text border-success-border',
        };
      case 'deliverable':
        return {
          icon: <FileCheck2 size={13} />,
          badgeBg: 'bg-brand-sage-light text-brand-forest dark:text-brand-sage border-brand-sage/40',
        };
      case 'project_started':
        return {
          icon: <FolderGit2 size={13} />,
          badgeBg: 'bg-info-bg text-info-text border-info-border',
        };
      case 'completed':
        return {
          icon: <CheckCircle2 size={13} />,
          badgeBg: 'bg-brand-forest text-white border-brand-forest dark:bg-brand-sage dark:text-text-inverse',
        };
      case 'created':
      default:
        return {
          icon: <UserPlus size={13} />,
          badgeBg: 'bg-surface-subtle text-text-secondary border-border',
        };
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-5 sm:p-6 shadow-xs">
      <div className="relative pl-6 sm:pl-7 border-l border-border-subtle space-y-6">
        {activities.map((item) => {
          const config = getActivityConfig(item.type);

          return (
            <div key={item.id} className="relative group">
              {/* Timeline Bullet Node */}
              <div
                className={cn(
                  'absolute -left-[31px] sm:-left-[35px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full border shadow-2xs',
                  config.badgeBg
                )}
              >
                {config.icon}
              </div>

              {/* Event Content */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <h4 className="text-sm font-semibold text-text-primary">
                    {item.title}
                  </h4>
                  <span className="text-[11px] text-text-muted whitespace-nowrap">
                    {item.timestamp}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ClientActivityTimeline;
