# CNE Contract Portal

A permit-to-work and contractor allocation portal, rebuilt from the ground up with a
modern React UI and a Supabase backend.

This app is a from-scratch redesign of an uploaded Base44 export ("cne-contract-portal"),
covering the full original entity set — permits, allocations, ground disturbance/hot
work/piling permits, item packs, POWRA/GS6/HAVS/pre-use-check safety logs, training
certificates, PASS forms, document groups, and admin/home-page configuration — on a
Supabase backend the original Base44-hosted one no longer runs on. Three categories of
original feature were intentionally left out because they depend on real external
services this project doesn't have credentials for: **Stripe billing**, **WebAuthn
passkeys**, and **What3Words location lookup** (needs a W3W API key). **AI Photo Amend**
was also left out — the photo archive/gallery exists, but not the AI-editing step. See
"What changed" and "Scope" below for details.

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
## Scope

Everything from the original 39-entity Base44 schema is present except:

- **Stripe billing**, **WebAuthn passkeys** (`PasskeyCredential`/`WebauthnChallenge`),
  and **What3Words lookup** (`WhatThreeWordsLocation`) — need real external credentials
  this project doesn't have.
- **AI Photo Amend** — the `photo_archive` table and gallery page exist; the AI editing
  step does not.

A few entities with genuinely large, deeply-nested original schemas (flagged as such
during the port) are represented with their full field set in the database, but with a
simpler UI than the original's custom form-builder tools:

- **`item_packs`** and **`ground_disturbance_permits`** — every field from the original
  is a real column (jsonb for the nested form-builder/section config), but the register
  UI exposes the core identifying fields rather than reimplementing the original's
  drag-and-drop PDF field overlay builder.
- **`pdf_forms`**, **`permit_templates`**, **`allocation_templates`/`allocation_print_templates`**
  — same pattern: the reusable-template *data* is there, the visual field-overlay
  builder isn't.
- **`pass_form_logs`** — the 7-day verification cycle and visitor log are jsonb columns
  on the record; there's no dedicated day-by-day/visitor-log editing UI yet.
- **`home_section_order`** — table exists for a future dynamic home page; the current
  dashboard is still the fixed layout built earlier, so this isn't wired up yet.

Everything else (safety logs, training/competency, contractors, site contacts,
documents, admin settings) has full list/create/edit/delete UI matching the rest of the
app's design.

## Known limitations

- No automated test suite yet — verified via manual + scripted browser walkthroughs
  (build, lint, and a full click-through of every page — including every new route added
  in the full-entity-set pass — in both themes and mobile).
- Bundle isn't code-split yet (single ~260KB gzip JS chunk) — fine for this app's size
  today, but worth splitting with `React.lazy` per route as it keeps growing.
- No role-based route/data guarding yet — any authenticated user can reach any page and
  any table's rows (RLS only checks "is authenticated", not role). Fine for a small
  internal team; worth adding before opening this up more broadly.
