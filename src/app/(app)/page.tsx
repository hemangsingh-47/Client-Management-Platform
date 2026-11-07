import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, LayoutDashboard, Users, Briefcase } from 'lucide-react';

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome to FreelanceHub"
        description="Your workspace is ready. Your projects, clients and business activity will appear here."
        badge={
          <Badge variant="brand" size="sm" dot>
            Phase 3 Layout Shell
          </Badge>
        }
        action={
          <Link href="/showcase">
            <Button variant="outline" size="sm" leftIcon={<Sparkles size={14} />}>
              Component Showcase
            </Button>
          </Link>
        }
      />

      {/* Neutral Workspace Ready Container */}
      <Card className="border-dashed">
        <CardContent className="py-12 px-6 text-center max-w-xl mx-auto space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-sage-light text-brand-forest dark:bg-brand-forest/40 dark:text-brand-sage shadow-2xs">
            <LayoutDashboard size={24} strokeWidth={1.75} />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-semibold text-text-primary tracking-tight">
              Application Shell Configured
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Use the sidebar navigation to test responsive layout transitions, collapsible navigation states, global search (⌘K), notifications, and theme switching.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link href="/clients">
              <Button variant="secondary" size="sm" leftIcon={<Users size={14} />}>
                Test Clients Route
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="secondary" size="sm" leftIcon={<Briefcase size={14} />}>
                Test Projects Route
              </Button>
            </Link>
            <Link href="/showcase">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight size={14} />}>
                Explore Design System
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

