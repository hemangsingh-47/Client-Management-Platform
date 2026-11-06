/**
 * FreelanceHub Design System & Theme Constants
 * Inspired by Bonsai (hellobonsai.com)
 */

export const APP_CONFIG = {
  name: 'FreelanceHub',
  tagline: 'Professional project & client management for independent freelancers',
  description:
    'A minimal, structured, production-grade management platform for freelancers to organize projects, track deliverables, and manage payments.',
  version: '1.0.0',
} as const;

/**
 * Forest Green Color Palette & Semantic Tokens
 */
export const COLOR_TOKENS = {
  brand: {
    forest: '#173F35',
    primary: '#287A58',
    primaryHover: '#1E6246',
    primaryActive: '#174E37',
    sage: '#A8C8B2',
    sageLight: '#EBF3EE',
  },
  light: {
    background: '#F4F6F1',
    surface: '#FFFFFF',
    surfaceSubtle: '#FAFCF8',
    surfaceHover: '#EDF1EA',
    textPrimary: '#252B28',
    textSecondary: '#68736C',
    textMuted: '#8E9992',
    border: '#E2E8E2',
    borderSubtle: '#EBF0EB',
  },
  dark: {
    background: '#111614',
    surface: '#171E1A',
    surfaceSubtle: '#1D2621',
    surfaceHover: '#232E28',
    textPrimary: '#EDF1EE',
    textSecondary: '#93A198',
    textMuted: '#6B7870',
    border: '#28352E',
    borderSubtle: '#1F2A24',
  },
  semantic: {
    success: {
      light: { bg: '#EBF5F0', border: '#C3E4D3', text: '#1B6344' },
      dark: { bg: '#12271D', border: '#1D4632', text: '#66D29A' },
    },
    warning: {
      light: { bg: '#FEF7EC', border: '#F7DCB0', text: '#8A5B11' },
      dark: { bg: '#2B2011', border: '#4D3A1B', text: '#F4BE6C' },
    },
    error: {
      light: { bg: '#FDF2F2', border: '#F8C8C8', text: '#9E2A2B' },
      dark: { bg: '#2D1517', border: '#522326', text: '#F27B80' },
    },
    info: {
      light: { bg: '#F0F4F8', border: '#C8D7E6', text: '#23496D' },
      dark: { bg: '#132230', border: '#203C54', text: '#7DB8E8' },
    },
  },
} as const;

/**
 * Typography Tokens
 */
export const TYPOGRAPHY_TOKENS = {
  pageTitle: {
    size: 'text-2xl sm:text-[28px]',
    leading: 'leading-tight',
    weight: 'font-semibold',
    tracking: 'tracking-tight',
  },
  sectionTitle: {
    size: 'text-base sm:text-lg',
    leading: 'leading-snug',
    weight: 'font-semibold',
    tracking: 'tracking-tight',
  },
  subheading: {
    size: 'text-sm sm:text-base',
    leading: 'leading-normal',
    weight: 'font-medium',
    tracking: 'tracking-normal',
  },
  body: {
    size: 'text-sm',
    leading: 'leading-relaxed',
    weight: 'font-normal',
    tracking: 'tracking-normal',
  },
  secondary: {
    size: 'text-[13px] sm:text-sm',
    leading: 'leading-normal',
    weight: 'font-normal',
    tracking: 'tracking-normal',
  },
  label: {
    size: 'text-xs sm:text-[13px]',
    leading: 'leading-tight',
    weight: 'font-medium',
    tracking: 'tracking-wide',
  },
  metadata: {
    size: 'text-xs',
    leading: 'leading-tight',
    weight: 'font-normal',
    tracking: 'tracking-normal',
  },
} as const;

/**
 * Spacing & Layout Tokens (4px base)
 */
export const SPACING_TOKENS = {
  baseUnit: 4,
  radius: {
    sm: 'rounded-md', // 6px
    base: 'rounded-lg', // 8px standard
    panel: 'rounded-xl', // 12px panel
    full: 'rounded-full',
  },
} as const;

