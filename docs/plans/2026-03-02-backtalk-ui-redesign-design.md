# Backtalk UI Redesign — Design Document

## Overview

Rebrand "Email Survey Tool" to "Backtalk" with a dark-first UI inspired by Linear/Vercel. Friendly & approachable voice. Refined top navigation (not sidebar). Electric blue accent color.

## Design System

### Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-page` | `#0A0A0A` | Page background |
| `--bg-surface` | `#141414` | Cards, nav, elevated areas |
| `--bg-elevated` | `#1A1A1A` | Inputs, hover states, nested surfaces |
| `--border-subtle` | `#262626` | Default borders |
| `--border-emphasis` | `#333333` | Emphasized borders, focus rings |
| `--text-primary` | `#EDEDED` | Headings, primary text |
| `--text-secondary` | `#A1A1A1` | Descriptions, labels |
| `--text-muted` | `#666666` | Placeholders, disabled text |
| `--accent` | `#3B82F6` | Buttons, links, active indicators |
| `--accent-hover` | `#2563EB` | Button hover states |
| `--accent-tint` | `rgba(59,130,246,0.1)` | Subtle accent backgrounds |
| `--success` | `#22C55E` | Active badges, success messages |
| `--error` | `#EF4444` | Error messages, destructive actions |
| `--warning` | `#EAB308` | Pending states |

### Typography

- Font: Inter (Google Fonts) — `font-family: 'Inter', system-ui, sans-serif`
- Headings: `font-semibold`
- Body: `font-normal`
- Scale: Tailwind defaults (text-xs through text-5xl)

### Component Patterns

- **Cards**: `bg-[#141414] border border-[#262626] rounded-lg` — no shadows
- **Inputs**: `bg-[#1A1A1A] border border-[#262626] text-[#EDEDED] placeholder-[#666666] rounded-md focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]`
- **Primary button**: `bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-md transition-colors duration-150`
- **Secondary button**: `bg-transparent border border-[#333333] text-[#A1A1A1] hover:text-[#EDEDED] hover:border-[#444] rounded-md`
- **Destructive button**: `text-[#EF4444] hover:bg-[#EF4444]/10`
- **Badge (active)**: `bg-[#22C55E]/10 text-[#22C55E]`
- **Badge (inactive)**: `bg-[#666666]/10 text-[#666666]`
- **Transitions**: `transition-colors duration-150` on all interactive elements

## Page Designs

### Homepage (app/page.tsx) — NEW

Dark marketing page. Sections top to bottom:

1. **Nav**: Dark transparent, "Backtalk" wordmark left, "Log In" (ghost) + "Get Started" (blue) right
2. **Hero**: Large heading "Your emails deserve a conversation." Subtext: "Backtalk lets your audience respond to emails with one click. Create a survey, drop links in your email, and hear what people actually think." Primary CTA: "Get Started Free"
3. **How It Works**: 3-column grid. Step 1: "Create a survey" — Step 2: "Add links to your email" — Step 3: "See what people think". Each with a number indicator and short description.
4. **Features**: 2x2 or 3-column grid of feature cards. Bot filtering, real-time analytics, team collaboration, CSV export. Each card: icon area + title + one-line description.
5. **Bottom CTA**: "Ready to hear back?" + "Get Started Free" button
6. **Footer**: Minimal — "Backtalk" left, copyright right

### Navigation (app/components/nav.tsx)

- Background: `bg-[#141414]` with `border-b border-[#262626]`
- Height: `h-14` (slightly more compact)
- Left: "Backtalk" wordmark in `text-[#EDEDED] font-semibold text-lg`
- Center-left: Dashboard, Team, Account links — `text-[#A1A1A1] hover:text-[#EDEDED]`, active: `text-white`
- Right: Org dropdown (if multiple) + Log Out (`text-[#666666] hover:text-[#A1A1A1]`)
- Container: `max-w-7xl mx-auto`

### Auth Pages (login, signup, forgot-password, resend-verification)

- Page: `bg-[#0A0A0A]` full height, centered vertically
- "Backtalk" wordmark centered above form
- Form card: `bg-[#141414] border border-[#262626] rounded-lg p-8 max-w-sm w-full`
- Dark-styled inputs
- Blue primary submit button, full width
- Links in `text-[#3B82F6]`
- Error: `bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-md`
- Success: `bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] rounded-md`

### Dashboard (app/dashboard/page.tsx)

- Page background: `bg-[#0A0A0A]`
- Header: "Surveys" title + "New Survey" button (blue, with + icon)
- Survey list as cards in a grid or stacked list
- Each card: `bg-[#141414] border border-[#262626] rounded-lg p-5`
  - Title (white, semibold)
  - Response count + created date (secondary text)
  - Status badge (green active / gray inactive)
  - Actions row: Copy Link, View Responses, Delete
- Empty state: centered message with muted text and CTA

### Create Survey (app/surveys/new/page.tsx)

- Same dark card pattern as auth pages but wider (`max-w-lg`)
- Title input, require_name checkbox
- Create + Cancel buttons

### Responses Dashboard (app/surveys/[id]/responses/page.tsx)

- Stats grid: Cards with `bg-[#141414]`, large accent-colored numbers
- Charts: Dark background, blue bars/fills, `#262626` grid lines, `#A1A1A1` labels
- Response map: Darker ocean, blue-shaded countries
- Filter bar: Dark inputs, dark checkboxes
- Response table: `bg-[#141414]` header, transparent rows, `hover:bg-[#1A1A1A]`, `border-b border-[#262626]`

### Public Survey Form (app/s/[surveyId]/page.tsx)

- **Light themed** — stays white/clean since email recipients land here directly
- White background, clean card with subtle shadow
- "Backtalk" wordmark at bottom in muted gray (subtle branding)
- Blue accent for submit button matches the brand
- Success state: green checkmark and friendly thank-you message

### Settings Pages (account, team)

- Same dark surface pattern
- Form cards in `bg-[#141414]`
- Team member list: dark rows with role badges
- Invite form: inline dark input + button

## Metadata Updates

- App title: "Backtalk" (in layout.tsx metadata)
- Description: "One-click email surveys. Hear what your audience thinks."

## Files Changed

Every page.tsx and component in the app needs reskinning. Key files:
- `app/globals.css` — CSS variables, Inter font import, dark body defaults
- `app/layout.tsx` — metadata title/description, font setup
- `app/components/nav.tsx` — full restyle
- `app/page.tsx` — complete rewrite (new homepage)
- `app/login/page.tsx`, `app/signup/page.tsx`, `app/forgot-password/page.tsx`, `app/resend-verification/page.tsx` — dark auth card style
- `app/dashboard/page.tsx` — dark card grid
- `app/surveys/new/page.tsx` — dark form
- `app/surveys/[id]/responses/page.tsx` — dark analytics
- `app/s/[surveyId]/page.tsx` — light form with Backtalk branding
- `app/settings/account/page.tsx`, `app/settings/team/page.tsx` — dark settings
- `app/components/answer-distribution-chart.tsx` — dark chart theme
- `app/components/response-map.tsx` — dark map theme
