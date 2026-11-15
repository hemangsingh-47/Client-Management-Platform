import React, { Suspense } from 'react';
import { ClientProfileView } from '@/components/clients/client-profile-view';

export default async function ClientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm text-text-muted">
          Loading client profile...
        </div>
      }
    >
      <ClientProfileView clientId={id} />
    </Suspense>
  );
}
