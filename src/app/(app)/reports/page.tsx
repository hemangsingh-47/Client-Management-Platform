import React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Analyze business performance, client billings, project velocity, and income summaries."
        badge={
          <Badge variant="default" size="sm">
            Future Module
          </Badge>
        }
      />

      <EmptyState
        icon={<BarChart3 size={22} className="text-brand-primary" />}
        title="Reports & Analytics Planned"
        description="Financial charts, productivity metrics, and tax reporting will be implemented in future phases."
      />
    </div>
  );
}

