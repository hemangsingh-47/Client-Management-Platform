import React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { Briefcase } from 'lucide-react';

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Track active client sprints, milestones, scope specifications, and delivery timelines."
        badge={
          <Badge variant="default" size="sm">
            Future Module
          </Badge>
        }
      />

      <EmptyState
        icon={<Briefcase size={22} className="text-brand-primary" />}
        title="Projects Module Planned"
        description="Project management, budget tracking, and milestones will be implemented in future phases."
      />
    </div>
  );
}

