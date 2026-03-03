# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build (also catches type errors)
npm run lint         # ESLint
npm start            # Start production server
```

No test framework is configured. Testing is manual (see TESTING.md).

## Architecture

Email survey tool for embedding click-tracked surveys in email campaigns (primarily AWeber). Recipients click a pre-answered link in an email, optionally add a comment, and the response is recorded.

### Tech Stack

Next.js 15 (App Router) + TypeScript + Tailwind CSS + Supabase (PostgreSQL, Auth, RLS).

### Route Layout

- **`/s/[surveyId]`** — Public survey response form (no auth). Two-step flow: initial click POSTs answer immediately, then user can optionally PATCH with comment/name.
- **`/dashboard`** — Protected survey list with response counts (excludes bots).
- **`/surveys/new`** — Create survey form.
- **`/surveys/[id]/responses`** — Analytics dashboard with charts, geo map, filtering, CSV/PNG export.
- **`/settings/account`, `/settings/team`** — User and team management.
- **`/login`, `/signup`, `/forgot-password`, `/resend-verification`, `/auth/confirm`** — Auth flows.

### Middleware

[middleware.ts](middleware.ts) protects `/dashboard`, `/surveys/*`, `/settings/*` routes and redirects authenticated users away from auth pages.

### Multi-Tenant Organization Model

Surveys belong to organizations, not individual users. `ensureOrg()` in [lib/org.ts](lib/org.ts) is called in all protected API routes to resolve the current org context. It:
- Reads org ID from an `org-id` cookie
- Falls back to the user's first org membership
- Auto-creates a default org if none exists
- Auto-accepts pending invites on each request

### Supabase Client Variants

Four clients in `lib/supabase/`, each for a different context:
- **`server.ts`** — SSR client using request cookies (respects RLS). Use in Server Components and API routes for authenticated queries.
- **`admin.ts`** — Service role client (bypasses RLS). Only for server-side operations that need to skip RLS: response insertion from public form, org membership checks that would cause RLS recursion, bot detection updates.
- **`client.ts`** — Browser client. Used in Client Components.
- **`anon.ts`** — Stateless anon client for unauthenticated server operations.

### Bot Detection

[lib/bot-detection.ts](lib/bot-detection.ts) flags suspected bot responses using user-agent pattern matching (30+ patterns), missing/short user agents, and cross-survey IP scanning detection. Adding a comment clears the bot flag (proves real engagement).

### Response Deduplication

POST `/api/responses` deduplicates by `hash_md5` (AWeber subscriber hash) if present, otherwise by IP address within a 24-hour window. A real user submission can replace an existing bot-flagged response.

### Database Schema

Defined in [supabase-schema.sql](supabase-schema.sql). Key tables: `organizations`, `organization_members`, `organization_invites`, `surveys`, `responses`. All tables use RLS. Migrations in `migrations/` directory.

### Environment Variables

Defined in `.env.local` (see `.env.example`):
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` — Service role key (server-only, never expose)
- `NEXT_PUBLIC_APP_URL` — App base URL for links

### Path Alias

`@/*` maps to the project root (configured in tsconfig.json).
