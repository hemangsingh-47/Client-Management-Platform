import React from 'react';
import { Card } from '@/components/ui/card';
import { DashboardActivity, MOCK_RECENT_ACTIVITIES } from '@/lib/mock-data/dashboard';
import {
  CreditCard,
  CheckCircle2,
  FolderPlus,
  FileCheck,
  Calendar,
  Activity,
} from 'lucide-react';

export interface RecentActivityFeedProps {
  activities?: DashboardActivity[];
}

export function RecentActivityFeed({ activities = MOCK_RECENT_ACTIVITIES }: RecentActivityFeedProps) {
  const getActivityIcon = (type: DashboardActivity['type']) => {
    switch (type) {
      case 'payment':
        return <CreditCard size={13} className="text-brand-primary" />;
      case 'task':
        return <CheckCircle2 size={13} className="text-success-text" />;
      case 'project':
        return <FolderPlus size={13} className="text-brand-forest dark:text-brand-sage" />;
      case 'deliverable':
        return <FileCheck size={13} className="text-brand-primary" />;
      case 'deadline':
        return <Calendar size={13} className="text-warning-text" />;
      default:
        return <Activity size={13} className="text-text-muted" />;
    }
  };

  return (
    <Card className="p-0 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border-subtle bg-surface">
        <div>
          <h2 className="text-base font-semibold text-text-primary tracking-tight">
            Recent Activity
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Audit log of workspace updates
          </p>
        </div>
        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded border border-border bg-surface-subtle text-text-muted">
          Sample Feed
        </span>
      </div>

      {/* Activity Timeline List */}
      <div className="divide-y divide-border-subtle bg-surface flex-1">
        {activities.map((item) => (
          <div key={item.id} className="p-3.5 sm:px-5 flex items-start gap-3 hover:bg-surface-hover/40 transition-colors">
            {/* Type Icon Badge */}
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border bg-surface-subtle shadow-2xs">
              {getActivityIcon(item.type)}
            </div>

            {/* Event Description */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-text-primary truncate">
                  {item.title}
                </span>
                <span className="text-[10px] font-mono text-text-muted shrink-0">
                  {item.timestamp}
                </span>
              </div>

              <p className="text-[11px] text-text-secondary mt-0.5 leading-normal">
                {item.description}
              </p>

              {(item.project || item.client) && (
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-text-muted">
                  {item.project && <span className="font-medium text-text-secondary">{item.project}</span>}
                  {item.project && item.client && <span>•</span>}
                  {item.client && <span>{item.client}</span>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-2.5 border-t border-border-subtle bg-surface-subtle/50 text-[11px] text-text-muted text-center">
        Development activity stream
      </div>
    </Card>
  );
}

export default RecentActivityFeed;

