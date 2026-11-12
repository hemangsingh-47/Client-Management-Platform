'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { MonthlyRevenuePoint } from '@/lib/utils/report-utils';
import { formatINR } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';

export interface RevenueChartProps {
  data: MonthlyRevenuePoint[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<MonthlyRevenuePoint | null>(null);

  // Compute max value for scaling
  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.received, d.outstanding)),
    60000
  );

  const totalReceivedInView = data.reduce((sum, d) => sum + d.received, 0);
  const totalOutstandingInView = data.reduce((sum, d) => sum + d.outstanding, 0);

  return (
    <Card className="p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-text-primary tracking-tight">
            Revenue Overview &amp; Cashflow
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Monthly comparison between settled client income and pending milestone receivables.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#287A58]" />
            <span className="text-text-secondary">Received ({formatINR(totalReceivedInView)})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#D97706]" />
            <span className="text-text-secondary">Outstanding ({formatINR(totalOutstandingInView)})</span>
          </div>
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div className="h-64 w-full flex items-end gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-border-subtle">
        {data.map((point) => {
          const receivedHeight = Math.max(4, Math.round((point.received / maxVal) * 190));
          const outstandingHeight = Math.max(4, Math.round((point.outstanding / maxVal) * 190));

          return (
            <div
              key={point.month}
              className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
              onMouseEnter={() => setHoveredPoint(point)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              {/* Bars container */}
              <div className="w-full max-w-[48px] flex items-end justify-center gap-1.5 h-[190px]">
                {/* Received Bar */}
                <div
                  className="w-1/2 bg-[#287A58] hover:bg-[#173F35] rounded-t-sm transition-all relative group/bar"
                  style={{ height: `${receivedHeight}px` }}
                >
                  <span className="sr-only">Received: {formatINR(point.received)}</span>
                </div>

                {/* Outstanding Bar */}
                <div
                  className="w-1/2 bg-[#D97706]/80 hover:bg-[#D97706] rounded-t-sm transition-all relative group/bar"
                  style={{ height: `${outstandingHeight}px` }}
                >
                  <span className="sr-only">Outstanding: {formatINR(point.outstanding)}</span>
                </div>
              </div>

              {/* Month Label */}
              <span className="text-xs font-medium text-text-muted group-hover:text-text-primary transition-colors">
                {point.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Tooltip / Details Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs text-text-secondary">
        {hoveredPoint ? (
          <div className="flex items-center gap-3">
            <span className="font-semibold text-text-primary">
              {hoveredPoint.label} 2026:
            </span>
            <span className="text-success-text font-mono font-medium">
              Received: {formatINR(hoveredPoint.received)}
            </span>
            <span>•</span>
            <span className="text-warning-text font-mono font-medium">
              Outstanding: {formatINR(hoveredPoint.outstanding)}
            </span>
          </div>
        ) : (
          <span className="text-text-muted">
            Hover over any monthly bar to inspect milestone breakdowns.
          </span>
        )}

        <div className="flex items-center gap-1 text-[11px] text-text-muted">
          <TrendingUp size={12} className="text-brand-forest dark:text-brand-sage" />
          <span>Average Monthly Run Rate: {formatINR(Math.round(totalReceivedInView / (data.length || 1)))}</span>
        </div>
      </div>
    </Card>
  );
}

export default RevenueChart;

