'use client';

import React from 'react';
import { SidebarProvider } from '@/components/layout/sidebar-context';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileSidebar } from '@/components/layout/mobile-sidebar';
import { TopHeader } from '@/components/layout/top-header';

export interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background text-text-primary antialiased">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Drawer */}
        <MobileSidebar />

        {/* Main Application Area */}
        <div className="flex flex-1 flex-col min-w-0 min-h-screen overflow-x-hidden">
          <TopHeader />

          {/* Main Content Viewport */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="mx-auto max-w-7xl w-full">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default AppShell;

