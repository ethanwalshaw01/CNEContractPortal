# CNE Contract Portal

A permit-to-work and contractor allocation portal, rebuilt from the ground up with a
modern React UI and a Supabase backend.

This app is a from-scratch redesign of an uploaded Base44 export ("cne-contract-portal"),
focused on the core workflow that portal was built around: issuing permits to work,
allocating jobs to contractors, and keeping a shared register of contractors, site
contacts and documents. The original export covered 70+ specialist engineering tools
(POWRA/GS6 forms, HAVS logs, scaffold certificates, offline sync, WebAuthn, Stripe
billing, PDF form-filling, etc.) tied to a Base44-hosted backend this project no longer
depends on — those were intentionally out of scope for this rebuild so the core
experience could get real design attention. See "What changed" below for details.

## Stack

- **React 18 + Vite** — SPA, JavaScript (no build-time backend coupling)
- **Tailwind CSS + Radix UI primitives** — design system, restyled with a new theme
- **Supabase** — Postgres database, Auth, Row Level Security, Storage (documents)
- **TanStack Query** — data fetching/caching
- **framer-motion** — page transitions and micro-interactions
- **react-router-dom v6**, **sonner** (toasts), **lucide-react** (icons)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project URL + anon key
npm run dev
```

The app expects two env vars (see `.env.example`):

```
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon/publishable key>
```

A Supabase project has already been provisioned for this app (schema + RLS policies +
storage bucket applied via migration). Ask the project owner for the URL/anon key, or
provision your own project and re-run the schema — see `supabase/schema.sql` for the
full DDL used.

### First-time login

New accounts go through Supabase Auth's standard email/password flow. **Supabase
projects require email confirmation by default** — after registering, confirm the
account via the email Supabase sends (or, during setup, confirm the user manually from
Supabase Dashboard → Authentication → Users) before signing in.

## Project structure

```
src/
  components/
    ui/         restyled Radix/shadcn-style primitives (button, card, dialog, ...)
    layout/     app shell, sidebar, topbar
    common/     shared page building blocks (StatCard, StatusBadge, EmptyState, ...)
  context/      AuthContext (Supabase session/profile), ThemeContext (light/dark)
  hooks/        one hook module per entity, built on a shared TanStack Query factory
  pages/        one file per route, grouped by module (permits/, allocations/, ...)
  lib/          supabase client, constants, formatting helpers
```

Database schema, RLS policies and the two security-definer RPC functions used by the
public allocation-acceptance link live directly in the Supabase project (applied via
migrations) — see the Supabase dashboard's SQL editor / migration history for the
exact DDL if you need to reproduce it elsewhere.

## What changed from the original export

- **Backend**: replaced the Base44 SDK/hosted backend with Supabase (Postgres + Auth +
  Storage), so the app is self-contained and runs against a real, provisioned database
  rather than a mocked or hardcoded one.
- **UI**: every screen was redesigned — new color system and typography, a persistent
  sidebar + topbar shell, page-transition and micro-interaction animation, consistent
  empty/loading states, a light/dark theme, and a fully responsive mobile layout with a
  slide-in nav drawer.
- **Allocation acceptance**: contractors accept an allocation via a shareable public
  link with no login required, backed by two narrowly-scoped Postgres RPC functions
  (rather than a broad public RLS policy) so only the fields needed for that flow are
  ever exposed.
- **Contractor hub**: each contractor has its own page (`/contractors/:id`) rolling up
  their contact details, status, and every permit and allocation linked to them —
  the "contractor management hub" is a real aggregation view, not just a label.
- **Visual identity**: a custom hub-and-spoke mark (not a stock icon), a warm
  ink/graphite + amber palette in place of default-template blue, `Manrope` headings
  paired with `Inter` body text, and flatter, border-led surfaces (shadows reserved for
  true overlays like dialogs and dropdowns) — aimed at reading as considered, premium
  software rather than a generic AI-generated dashboard.
- **Scope**: the core permit/allocation/contractor/document workflow was rebuilt in
  full (registers, multi-step allocation builder, status workflows, document library
  with real file storage); the ~50 specialist engineering tools from the original
  export (GS6, POWRA, HAVS, scaffold workflows, PDF form auto-fill, line walks, photo
  archive, WebAuthn passkeys, Stripe billing, offline sync) were not ported in this
  pass.

## Known limitations

- No automated test suite yet — verified via manual + scripted browser walkthroughs
  (build, lint, and a full click-through of every page in both themes and mobile).
- Bundle isn't code-split yet (single ~250KB gzip JS chunk) — fine for this app's size
  today, but worth splitting with `React.lazy` per route if it grows.
