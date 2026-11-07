import React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        description="Manage your client roster, communication history, contacts, and contract terms."
        badge={
          <Badge variant="default" size="sm">
            Future Module
          </Badge>
        }
      />

      <EmptyState
        icon={<Users size={22} className="text-brand-primary" />}
        title="Clients Module Planned"
        description="Client directory, contact management, and relationship records will be implemented in future phases."
      />
    </div>
  );
}

