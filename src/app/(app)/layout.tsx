import React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { AppProvider } from '@/context/app-context';

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <AppShell>{children}</AppShell>
    </AppProvider>
  );
}
