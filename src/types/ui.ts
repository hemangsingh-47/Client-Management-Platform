import React from 'react';

export type ComponentSize = 'sm' | 'md' | 'lg';

export type StatusVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'brand';

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

