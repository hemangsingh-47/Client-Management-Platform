import React from 'react';
import { Card } from '@/components/ui/card';
import { MOCK_RECENT_ACTIVITIES } from '@/lib/mock-data/dashboard';
import {
  CreditCard,
  CheckCircle2,
  FolderPlus,
  FileCheck,
  Calendar,
  Activity,
} from 'lucide-react';

export interface RecentActivityFeedProps {
  activities?: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    title?: string;
    project?: string;
    client?: string;
    projectName?: string;
    clientName?: string;
  }>;
}

export function RecentActivityFeed({ activities = MOCK_RECENT_ACTIVITIES }: RecentActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('pay')) return <CreditCard size={13} className="text-brand-primary" />;
    if (t.includes('task')) return <CheckCircle2 size={13} className="text-success-text" />;
    if (t.includes('proj')) return <FolderPlus size={13} className="text-brand-forest dark:text-brand-sage" />;
    if (t.includes('deliv')) return <FileCheck size={13} className="text-brand-primary" />;
    if (t.includes('dead')) return <Calendar size={13} className="text-warning-text" />;
    return <Activity size={13} className="text-text-muted" />;
  };

  const formatTimestamp = (ts: string) => {
    if (!ts) return '';
    if (ts.includes('T')) {
      const d = new Date(ts);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      }
    }
    return ts;
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
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-success-text animate-pulse" />
          Live
        </span>
      </div>

      {/* Activity Timeline List */}
      <div className="divide-y divide-border-subtle bg-surface flex-1">
        {activities.map((item) => (
          <div key={item.id} className="p-3.5 sm:px-5 flex items-start gap-3 hover:bg-surface-hover/60 transition-colors">
            {/* Type Icon Badge */}
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-subtle shadow-xs">
              {getActivityIcon(item.type)}
            </div>

            {/* Event Description */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-text-primary truncate">
                  {item.title || item.type.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] font-mono text-text-muted shrink-0">
                  {formatTimestamp(item.timestamp)}
                </span>
              </div>

              <p className="text-[11px] text-text-secondary mt-0.5 leading-normal">
                {item.description}
              </p>

              {(item.project || item.client || item.projectName || item.clientName) && (
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-text-muted">
                  {(item.project || item.projectName) && (
                    <span className="font-medium text-text-secondary">{item.project || item.projectName}</span>
                  )}
                  {(item.project || item.projectName) && (item.client || item.clientName) && <span>•</span>}
                  {(item.client || item.clientName) && <span>{item.client || item.clientName}</span>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default RecentActivityFeed;

