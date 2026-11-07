# FreelanceHub

> Professional freelancer project and client management platform inspired by [Bonsai](https://www.hellobonsai.com/).

[![Next.js](https://img.shields.io/badge/Next.js-16.4.5-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178c6)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## Roadmap Scope: Phases 1, 2 & 3

This repository implements the first 3 phases of the 15-phase FreelanceHub roadmap:

- **Phase 1: Project Setup & Foundation**: Verified Next.js App Router, React 19, TypeScript 5, Tailwind CSS v4, Lucide React icons, scalable folder architecture, zero build/lint errors.
- **Phase 2: Professional Design System & Theme**: Minimal, structured, business-focused visual identity using a signature **Forest Green** palette, full light and dark mode support with zero FOUC, typography scale, 4px spacing unit, 8px/12px border radii, and 16 reusable UI primitives.
- **Phase 3: Main Application Layout**: Complete production-grade application shell consisting of desktop collapsible sidebar, mobile drawer navigation, top header with global search (⌘K shortcut), sample notifications flyout, theme toggle, user profile menu, and responsive content area with neutral welcome placeholder.

---

## Application Shell Architecture (`src/components/layout`)

1. **Sidebar (`sidebar.tsx`)**:
   - Fixed desktop navigation inspired by Bonsai.
   - Smoothly collapsible from `w-64` (expanded) to `w-16` (compact).
   - In collapsed state, navigation items display accessible tooltips.
   - Includes Brand wordmark, `WorkspaceSwitcher`, workspace navigation items, and bottom utilities.
2. **Mobile Sidebar (`mobile-sidebar.tsx`)**:
   - Off-canvas drawer triggered by hamburger button on mobile & tablet.
   - Smooth slide-in animation, backdrop blur overlay, accessible `Escape` key and close button handling.
   - Automatically closes upon navigation.
3. **Top Header (`top-header.tsx`)**:
   - Breadcrumb navigation showing current workspace section.
   - Global search trigger button (⌘K shortcut opens `GlobalSearch` dialog).
   - `NotificationButton` with sample unread alerts and empty state.
   - `ThemeToggle` for instant light/dark mode switching.
   - `UserMenu` profile dropdown.
4. **Workspace Switcher (`workspace-switcher.tsx`)**:
   - Switch active workspace context ("Studio Workspace", "Personal Consulting") with plan indicator.
5. **Main Content Container (`page-header.tsx` & `app-shell.tsx`)**:
   - Standardized page header with title, description, and action button slots.
   - Neutral overview placeholder displaying:
     > **Welcome to FreelanceHub**  
     > *Your workspace is ready. Your projects, clients and business activity will appear here.*

---

## Design System: Forest Green Foundation

| Token | Hex Value | Usage |
|---|---|---|
| **Forest Green** | `#173F35` | Brand identity & primary badge |
| **Primary Green** | `#287A58` | Primary call-to-actions & focus rings |
| **Muted Sage** | `#A8C8B2` | Soft highlights & secondary accents |
| **Warm Background** | `#F4F6F1` | Canvas background in light mode |
| **White** | `#FFFFFF` | Surfaces & cards in light mode |
| **Charcoal** | `#252B28` | Primary text |
| **Secondary Text** | `#68736C` | Supporting text & captions |
| **Border** | `#E2E8E2` | Thin dividers, inputs & panel borders |

### Dark Theme Tokens
- Background: `#111614`
- Surface: `#171E1A`
- Surface Elevated: `#1D2621`
- Border: `#28352E`
- Primary Text: `#EDF1EE`
- Secondary Text: `#93A198`

### Semantic Tokens
- **Success**: Light `#EBF5F0` / Dark `#12271D` (paid invoices, completed milestones)
- **Warning**: Light `#FEF7EC` / Dark `#2B2011` (pending approvals, due soon)
- **Error**: Light `#FDF2F2` / Dark `#2D1517` (overdue items, critical alerts)
- **Info**: Light `#F0F4F8` / Dark `#132230` (in-review, scheduled deliverables)

---

## Reusable UI Component Library (`src/components/ui`)

1. **Button**: Primary, secondary, outline, ghost, danger variants; sizes `sm`, `md`, `lg`; left/right icons, loading spinner.
2. **Input**: Text, search, email, number; size options; left/right icon addons; error & disabled states.
3. **Textarea**: Multi-line text input with custom rows, error states, and accessible focus.
4. **Select**: Custom-styled accessible select with dropdown chevron, placeholder, and option items.
5. **Checkbox**: Accessible checkbox with checkmark/minus icons, label, description, and indeterminate support.
6. **Badge**: Status indicators with optional live status dots across semantic and brand variants.
7. **Card**: Surface panels with CardHeader, CardTitle, CardDescription, CardContent, CardFooter.
8. **Modal**: Accessible dialog with backdrop blur, keyboard ESC close, focus management, and action footer.
9. **Dropdown**: Accessible popup menu with click-outside detection, keyboard navigation, and destructive items.
10. **Tooltip**: Positionable (`top`, `bottom`, `left`, `right`) hover/focus tooltips.
11. **Tabs**: Accessible tabbed views with TabsList, TabsTrigger, and TabsContent.
12. **Divider**: Horizontal/vertical line with optional centered text label.
13. **Table**: Primitives (`Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`).
14. **Skeleton**: Animated shimmer placeholders for text, circular avatars, and cards.
15. **EmptyState**: Minimalist empty slate with icon, title, description, and action button.
16. **FormField**: Form input wrapper managing label, required indicator, optional tag, hint, and error message.

---

## Route Overview

```text
src/app/(app)/
├── layout.tsx         # AppShell wrapper (Sidebar, Header, Content)
├── page.tsx           # Application landing overview (Neutral welcome placeholder)
├── dashboard/page.tsx # Overview alias
├── clients/page.tsx   # Clients placeholder
├── projects/page.tsx  # Projects placeholder
├── tasks/page.tsx     # Tasks & Milestones placeholder
├── deliverables/page.tsx # Deliverables placeholder
├── payments/page.tsx  # Payments placeholder
├── reports/page.tsx   # Reports placeholder
├── settings/page.tsx  # Settings placeholder
└── showcase/page.tsx  # Full Phase 2 Design System & Component Library showcase
```

---

## Verification Commands

1. **Check TypeScript**:
   ```bash
   npx tsc --noEmit
   ```

2. **Run ESLint**:
   ```bash
   npm run lint
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Start local server**:
   ```bash
   npm run dev
   ```
