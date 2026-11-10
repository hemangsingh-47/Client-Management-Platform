import React, { Suspense } from 'react';
import { INITIAL_PROJECTS } from '@/lib/mock-data/projects';
import { ProjectDetailsView } from '@/components/projects/project-details-view';

export function generateStaticParams() {
  return INITIAL_PROJECTS.map((project) => ({
    id: project.id,
  }));
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm text-text-muted">
          Loading project workspace...
        </div>
      }
    >
      <ProjectDetailsView projectId={id} />
    </Suspense>
  );
}
