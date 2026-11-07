import React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { PackageCheck } from 'lucide-react';

export default function DeliverablesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Deliverables"
        description="Share work packages, gather client approval signatures, and track asset handovers."
        badge={
          <Badge variant="default" size="sm">
            Future Module
          </Badge>
        }
      />

      <EmptyState
        icon={<PackageCheck size={22} className="text-brand-primary" />}
        title="Deliverables Module Planned"
        description="Deliverable asset reviews, client sign-offs, and versioning will be implemented in future phases."
      />
    </div>
  );
}

