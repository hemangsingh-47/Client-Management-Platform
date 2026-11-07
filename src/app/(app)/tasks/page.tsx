import React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { CheckSquare } from 'lucide-react';

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks & Milestones"
        description="Organize actionable project tasks, deliverables checklists, and deadline tracking."
        badge={
          <Badge variant="default" size="sm">
            Future Module
          </Badge>
        }
      />

      <EmptyState
        icon={<CheckSquare size={22} className="text-brand-primary" />}
        title="Tasks & Milestones Planned"
        description="Task board, milestone progress tracking, and prioritization will be implemented in future phases."
      />
    </div>
  );
}

