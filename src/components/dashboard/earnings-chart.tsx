'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { formatINR } from '@/lib/utils';
import { MOCK_EARNINGS_RANGES, MonthlyEarningPoint } from '@/lib/mock-data/dashboard';
import { TrendingUp, BarChart2 } from 'lucide-react';

export function EarningsChart() {
  const [selectedRange, setSelectedRange] = useState<'6m' | 'year' | '12m'>('6m');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const rangeConfig = MOCK_EARNINGS_RANGES[selectedRange];
  const data: MonthlyEarningPoint[] = rangeConfig?.data || [];

  const totalReceived = data.reduce((sum, item) => sum + item.amount, 0);

  // SVG dimensions & scaling
  const chartHeight = 180;
  const chartWidth = 560;
  const paddingBottom = 28;
  const paddingTop = 20;
  const usableHeight = chartHeight - paddingTop - paddingBottom;

  const maxVal = Math.max(...data.map((d) => d.amount), 100000);
  const roundedMax = Math.ceil(maxVal / 20000) * 20000;

  const slotWidth = chartWidth / (data.length || 1);
  const barWidth = Math.min(slotWidth * 0.55, 36);

  return (
    <Card className="p-0 overflow-hidden">
      {/* Header with Title & Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5 border-b border-border-subtle bg-surface">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-text-primary tracking-tight">
              Earnings Overview
            </h2>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded border border-border bg-surface-subtle text-text-muted">
              Illustrative Sample
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              {formatINR(totalReceived)}
            </span>
            <span className="text-xs text-text-secondary">
              received in selected period
            </span>
          </div>
        </div>

        {/* Range Selector */}
        <div className="inline-flex rounded-lg border border-border bg-surface-subtle p-0.5 text-xs font-medium self-start sm:self-auto">
          {(
            [
              { key: '6m', label: 'Last 6M' },
              { key: 'year', label: '2026' },
              { key: '12m', label: 'Last 12M' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setSelectedRange(tab.key);
                setHoveredIndex(null);
              }}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                selectedRange === tab.key
                  ? 'bg-surface text-text-primary shadow-2xs font-semibold'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive SVG Chart */}
      <div className="p-4 sm:p-6 bg-surface">
        {data.length > 0 ? (
          <div className="relative w-full">
            {/* Hover Tooltip Popup */}
            {hoveredIndex !== null && data[hoveredIndex] && (
              <div
                className="absolute z-10 pointer-events-none -top-2 transform -translate-x-1/2 rounded-md bg-text-primary px-2.5 py-1 text-[11px] font-medium text-surface shadow-md transition-all duration-150"
                style={{
                  left: `${((hoveredIndex + 0.5) / data.length) * 100}%`,
                }}
              >
                <div className="font-semibold">{data[hoveredIndex].month}</div>
                <div className="text-brand-sage-light dark:text-brand-sage">
                  {formatINR(data[hoveredIndex].amount)}
                </div>
              </div>
            )}

            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-48 sm:h-56 overflow-visible"
              aria-label="Monthly earnings bar chart"
            >
              {/* Horizontal Reference Gridlines */}
              {[0, 0.5, 1].map((ratio) => {
                const y = paddingTop + usableHeight * (1 - ratio);
                const valueLabel = Math.round(roundedMax * ratio);
                return (
                  <g key={ratio}>
                    <line
                      x1="0"
                      y1={y}
                      x2={chartWidth}
                      y2={y}
                      stroke="currentColor"
                      strokeDasharray="3 3"
                      className="text-border-subtle"
                    />
                    <text
                      x="0"
                      y={y - 4}
                      fill="currentColor"
                      className="text-[9px] font-mono text-text-muted fill-current"
                    >
                      {valueLabel > 0 ? `₹${(valueLabel / 1000).toFixed(0)}k` : '₹0'}
                    </text>
                  </g>
                );
              })}

              {/* Data Bars */}
              {data.map((item, idx) => {
                const barHeight = Math.max((item.amount / roundedMax) * usableHeight, 4);
                const x = idx * slotWidth + (slotWidth - barWidth) / 2;
                const y = paddingTop + (usableHeight - barHeight);
                const isHovered = hoveredIndex === idx;
                const isLast = idx === data.length - 1;

                return (
                  <g
                    key={item.month}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="cursor-pointer transition-opacity"
                  >
                    {/* Hover Hitbox for easier touch/mouse detection */}
                    <rect
                      x={idx * slotWidth}
                      y={0}
                      width={slotWidth}
                      height={chartHeight}
                      fill="transparent"
                    />

                    {/* Bar */}
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx="3"
                      className={`transition-all duration-200 ${
                        isHovered || isLast
                          ? 'fill-[#287A58] dark:fill-[#348B66]'
                          : 'fill-[#A8C8B2] dark:fill-[#2A4B3A] opacity-80 hover:opacity-100'
                      }`}
                    />

                    {/* X-axis Month Label */}
                    <text
                      x={x + barWidth / 2}
                      y={chartHeight - 6}
                      textAnchor="middle"
                      fill="currentColor"
                      className={`text-[10px] font-medium fill-current ${
                        isHovered || isLast ? 'text-text-primary font-bold' : 'text-text-muted'
                      }`}
                    >
                      {item.month}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-text-muted">
            <BarChart2 size={24} className="mx-auto mb-2 text-text-muted" />
            <span>No earnings recorded in this range.</span>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-border-subtle bg-surface-subtle/50 flex items-center justify-between text-xs text-text-muted">
        <span className="flex items-center gap-1.5">
          <TrendingUp size={13} className="text-brand-primary" />
          <span>Average monthly revenue: {formatINR(totalReceived / (data.length || 1))}</span>
        </span>
        <span className="text-[11px] font-mono">Currency: INR (₹)</span>
      </div>
    </Card>
  );
}

export default EarningsChart;

