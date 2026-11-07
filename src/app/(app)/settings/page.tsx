import React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure your freelancer profile, billing details, notification preferences, and integrations."
        badge={
          <Badge variant="default" size="sm">
            Future Module
          </Badge>
        }
      />

      <EmptyState
        icon={<Settings size={22} className="text-brand-primary" />}
        title="Settings Module Planned"
        description="Freelancer profile settings, currency preferences, and team configurations will be implemented in future phases."
      />
    </div>
  );
}

