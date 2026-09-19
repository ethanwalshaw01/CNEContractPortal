-- CNE Contract Portal — full schema
-- Applied to the project's Supabase instance via migrations. Kept here so the schema
-- can be reproduced in a new Supabase project. Run top to bottom in the SQL editor.

-- ── Enums ──────────────────────────────────────────────────────────────
create type public.user_role as enum ('admin', 'engineer', 'contractor');
create type public.permit_status as enum ('draft', 'issued', 'live', 'completed', 'cancelled');
create type public.permit_type as enum ('general', 'hot_work', 'excavation', 'overhead_line', 'confined_space', 'working_at_height');
create type public.allocation_status as enum ('draft', 'pending_acceptance', 'accepted', 'live', 'completed', 'archived');

-- ── Tables ─────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role public.user_role not null default 'engineer',
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contractors (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text,
  email text,
  phone text,
  trade text,
  status text not null default 'active' check (status in ('active','inactive')),
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role_title text,
  site_name text,
  phone text,
  email text,
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create sequence public.permit_number_seq start 1001;
create table public.permits (
  id uuid primary key default gen_random_uuid(),
  permit_number text not null default ('PTW-' || nextval('public.permit_number_seq')::text) unique,
  title text not null,
  permit_type public.permit_type not null default 'general',
  status public.permit_status not null default 'draft',
  site_name text,
  location text,
  description text,
  risk_level text default 'medium' check (risk_level in ('low','medium','high')),
  contractor_id uuid references public.contractors(id) on delete set null,
  issued_by uuid references public.profiles(id),
  start_date timestamptz,
  end_date timestamptz,
  issued_at timestamptz,
  completed_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create sequence public.allocation_number_seq start 2001;
create table public.allocations (
  id uuid primary key default gen_random_uuid(),
  allocation_number text not null default ('ALO-' || nextval('public.allocation_number_seq')::text) unique,
  title text not null,
  status public.allocation_status not null default 'draft',
  contractor_id uuid references public.contractors(id) on delete set null,
  permit_id uuid references public.permits(id) on delete set null,
  site_name text,
  scope_of_work text,
  start_date timestamptz,
  end_date timestamptz,
  accepted_at timestamptz,
  accepted_by_name text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'general',
  file_path text not null,
  file_size bigint,
  mime_type text,
  permit_id uuid references public.permits(id) on delete set null,
  allocation_id uuid references public.allocations(id) on delete set null,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ── updated_at triggers ────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
create trigger trg_contractors_updated before update on public.contractors for each row execute function public.set_updated_at();
create trigger trg_site_contacts_updated before update on public.site_contacts for each row execute function public.set_updated_at();
create trigger trg_permits_updated before update on public.permits for each row execute function public.set_updated_at();
create trigger trg_allocations_updated before update on public.allocations for each row execute function public.set_updated_at();

-- ── Auto-create profile on signup ─────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 'engineer');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

revoke execute on function public.handle_new_user() from anon, authenticated;

-- ── Row Level Security ─────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.contractors enable row level security;
alter table public.site_contacts enable row level security;
alter table public.permits enable row level security;
alter table public.allocations enable row level security;
alter table public.documents enable row level security;

create policy "profiles_select_all" on public.profiles for select to authenticated using (true);
create policy "profiles_update_own" on public.profiles for update to authenticated using (id = auth.uid());

create policy "contractors_select" on public.contractors for select to authenticated using (true);
create policy "contractors_insert" on public.contractors for insert to authenticated with check (true);
create policy "contractors_update" on public.contractors for update to authenticated using (true);
create policy "contractors_delete" on public.contractors for delete to authenticated using (true);

create policy "site_contacts_select" on public.site_contacts for select to authenticated using (true);
create policy "site_contacts_insert" on public.site_contacts for insert to authenticated with check (true);
create policy "site_contacts_update" on public.site_contacts for update to authenticated using (true);
create policy "site_contacts_delete" on public.site_contacts for delete to authenticated using (true);

create policy "permits_select" on public.permits for select to authenticated using (true);
create policy "permits_insert" on public.permits for insert to authenticated with check (true);
create policy "permits_update" on public.permits for update to authenticated using (true);
create policy "permits_delete" on public.permits for delete to authenticated using (true);

create policy "allocations_select" on public.allocations for select to authenticated using (true);
create policy "allocations_insert" on public.allocations for insert to authenticated with check (true);
create policy "allocations_update" on public.allocations for update to authenticated using (true);
create policy "allocations_delete" on public.allocations for delete to authenticated using (true);

create policy "documents_select" on public.documents for select to authenticated using (true);
create policy "documents_insert" on public.documents for insert to authenticated with check (true);
create policy "documents_delete" on public.documents for delete to authenticated using (true);

-- ── Storage: documents bucket ──────────────────────────────────────────
insert into storage.buckets (id, name, public) values ('documents', 'documents', false)
on conflict (id) do nothing;

create policy "documents_bucket_select" on storage.objects for select to authenticated
  using (bucket_id = 'documents');
create policy "documents_bucket_insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'documents');
create policy "documents_bucket_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'documents');

-- ── Public allocation-acceptance RPCs ───────────────────────────────────
-- Narrow, capability-URL-style surface for the unauthenticated accept link
-- (/allocations/:id/accept). Exposes only the fields needed to review + accept an
-- allocation, rather than a broad anon RLS policy on the whole table.

create or replace function public.get_public_allocation(p_id uuid)
returns table (
  id uuid,
  allocation_number text,
  title text,
  status public.allocation_status,
  site_name text,
  scope_of_work text,
  start_date timestamptz,
  end_date timestamptz,
  accepted_at timestamptz,
  accepted_by_name text,
  contractor_name text,
  permit_number text
)
language sql
security definer
set search_path = public
stable
as $$
  select
    a.id, a.allocation_number, a.title, a.status, a.site_name, a.scope_of_work,
    a.start_date, a.end_date, a.accepted_at, a.accepted_by_name,
    c.company_name, p.permit_number
  from public.allocations a
  left join public.contractors c on c.id = a.contractor_id
  left join public.permits p on p.id = a.permit_id
  where a.id = p_id;
$$;

revoke all on function public.get_public_allocation(uuid) from public;
grant execute on function public.get_public_allocation(uuid) to anon, authenticated;

create or replace function public.accept_allocation(p_id uuid, p_name text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_count int;
begin
  if p_name is null or length(trim(p_name)) = 0 then
    raise exception 'Name is required to accept an allocation';
  end if;

  update public.allocations
  set status = 'accepted', accepted_at = now(), accepted_by_name = trim(p_name)
  where id = p_id and status = 'pending_acceptance';

  get diagnostics updated_count = row_count;
  return updated_count > 0;
end;
$$;

revoke all on function public.accept_allocation(uuid, text) from public;
grant execute on function public.accept_allocation(uuid, text) to anon, authenticated;
