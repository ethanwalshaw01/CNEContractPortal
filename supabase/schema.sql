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

-- ═══════════════════════════════════════════════════════════════════════
-- Full original entity set (added in a later pass, mirroring every
-- remaining Base44 entity except the ones intentionally left out of this
-- rebuild: PasskeyCredential/WebauthnChallenge (WebAuthn), WhatThreeWordsLocation
-- (needs a W3W API key), and anything tied to Stripe billing or AI photo
-- processing). Deeply nested/form-builder fields (ItemPack, PdfForm,
-- GroundDisturbancePermit, etc.) are stored as jsonb rather than fully
-- normalized child tables — see the app's README for the reasoning.
-- ═══════════════════════════════════════════════════════════════════════

-- ── Legacy per-profile feature visibility (was AppAccount) ─────────────
create table public.app_accounts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  can_view_allocation_trakway boolean not null default true,
  can_view_allocation_access_veg boolean not null default true,
  can_view_allocation_scaffold boolean not null default true,
  can_view_allocation_site_fitter boolean not null default true,
  can_view_permits boolean not null default true,
  can_view_documents boolean not null default true,
  can_view_engineer_tools boolean not null default false,
  can_view_contacts boolean not null default true,
  contractor_visibility jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Reusable fillable PDF overlay-form definitions ──────────────────────
create table public.pdf_forms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  pdf_url text not null,
  source text not null default 'builder' check (source in ('auto_field','builder')),
  template_id uuid references public.pdf_forms(id) on delete set null,
  auto_field_evaluation_json text,
  highlight_fields boolean not null default false,
  stages jsonb not null default '[]',
  stage_completion jsonb not null default '{}',
  fields jsonb not null default '[]',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Scaffold-crossing item pack (guard/handover/method-statement/OHL hub) ──
create table public.item_packs (
  id uuid primary key default gen_random_uuid(),
  scaffold_item_number text not null,
  user_visible boolean not null default true,
  section_visibility jsonb not null default '{}',
  handover_form_id uuid references public.pdf_forms(id) on delete set null,
  guard_pdf_url text,
  guard_side_of_crossing text,
  guard_stages jsonb not null default '[]',
  guard_stage_completion jsonb not null default '{}',
  guard_form_fields jsonb not null default '[]',
  additional_guard_pdfs jsonb not null default '[]',
  installation_header jsonb not null default '{}',
  dismantle_header jsonb not null default '{}',
  method_statement_url text,
  method_statement_name text,
  method_statement_subheader text,
  method_statement_form_id uuid references public.pdf_forms(id) on delete set null,
  method_statement_live boolean not null default false,
  additional_method_statements jsonb not null default '[]',
  item_rams_url text,
  item_rams_name text,
  item_rams_subheader text,
  additional_item_rams jsonb not null default '[]',
  ohl_authorization_doc_url text,
  ohl_authorization_doc_name text,
  ohl_form_id uuid references public.pdf_forms(id) on delete set null,
  ohl_build_type text not null default '' check (ohl_build_type in ('','part','full')),
  ohl_form_fields jsonb not null default '[]',
  ohl_stages jsonb not null default '[]',
  ohl_stage_completion jsonb not null default '{}',
  additional_ohl_authorizations jsonb not null default '[]',
  custom_tiles jsonb not null default '[]',
  phase_requirement_exemptions jsonb not null default '{}',
  phase_requirement_roles jsonb not null default '{}',
  phase_manual_completion jsonb not null default '{}',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Ground disturbance / hot work / piling / pump / scaffold PTW permits ──
create table public.ground_disturbance_permits (
  id uuid primary key default gen_random_uuid(),
  permit_number text,
  contractor_id uuid references public.contractors(id) on delete set null,
  permit_type text not null default 'GD' check (permit_type in ('GD','HW','PILE','Pump','PTW')),
  pile_form_id uuid references public.pdf_forms(id) on delete set null,
  pile_workflow_version integer,
  pile_field_values jsonb not null default '{}',
  pile_digital boolean not null default false,
  item_pack_id uuid references public.item_packs(id) on delete set null,
  project_no text,
  design_brief_no text,
  ptw_rev text,
  twc_name text,
  tws_name text,
  tw_tel text,
  tw_location_reference text,
  reference_documents text,
  test_verification_documents text,
  pre_erection jsonb not null default '{}',
  proceed_signature text,
  proceed_date date,
  installation_form_ref text,
  installation_comments text,
  installation_signature text,
  installation_date date,
  installation_time text,
  load_signature text,
  load_date date,
  load_time text,
  dismantle_form_issued boolean not null default false,
  dismantle_signature text,
  dismantle_date date,
  dismantle_time text,
  completion_form_received boolean not null default false,
  completion_signature text,
  completion_date date,
  completion_time text,
  project_name text not null,
  site_location text not null,
  w3w_address text,
  permit_start_date date,
  permit_completion_date date,
  date_cancelled date,
  permit_issuer_name text,
  company_contractor text,
  works_description text,
  cat_serial_no text,
  cat_calibration_expiry text,
  genny_serial_no text,
  genny_calibration_expiry text,
  preliminary_checks jsonb not null default '[]',
  work_location_description text,
  section_c jsonb not null default '{}',
  section_c_photos text[] not null default '{}',
  section_d jsonb not null default '{}',
  receiver_cat_serial_no text,
  receiver_cat_calibration_expiry text,
  receiver_genny_serial_no text,
  receiver_genny_calibration_expiry text,
  working_party jsonb not null default '[]',
  completion_checks jsonb not null default '{}',
  section_f jsonb not null default '{}',
  cancellation_satisfied boolean,
  section_g jsonb not null default '{}',
  pdf_url text,
  status text not null default 'draft' check (status in ('draft','issued','certified','in_progress','completed','cancelled')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Printable permit templates ───────────────────────────────────────────
create table public.permit_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  permit_type text not null default 'GD' check (permit_type in ('GD','HW','PILE','Pump','PTW')),
  pdf_url text not null,
  source_file_url text,
  editable_text text,
  fields jsonb not null default '[]',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Allocation templates (structure + autofill rules) ───────────────────
create table public.allocation_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  allocation_type text not null default 'trakway' check (allocation_type in ('trakway','standard','access_veg','scaffold','site_fitter','security','custom')),
  description text,
  elements jsonb not null default '[]',
  data jsonb not null default '{}',
  autofill_rules jsonb not null default '[]',
  source_allocation_id uuid references public.allocations(id) on delete set null,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Allocation print/PDF layout templates ───────────────────────────────
create table public.allocation_print_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  allocation_type text not null default 'trakway' check (allocation_type in ('trakway','standard','access_veg','scaffold','site_fitter','security','custom')),
  mode text not null default 'blank' check (mode in ('blank','pdf')),
  pdf_url text,
  num_pages integer not null default 1,
  fields jsonb not null default '[]',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Document groups/folders ──────────────────────────────────────────────
create table public.document_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Extend documents with SiteDocument's folder/signing concepts ───────
alter table public.documents
  add column is_rams boolean not null default false,
  add column group_id uuid references public.document_groups(id) on delete set null,
  add column person_name text,
  add column what3words text,
  add column sign_mode text check (sign_mode in ('view_only','fill_in','sign')),
  add column sign_fields jsonb not null default '[]';

-- ── Captured signatures against a document's sign fields ────────────────
create table public.document_signatures (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  name text not null,
  job_role text,
  signed_date date not null,
  signed_time text,
  signature_url text not null,
  understood boolean not null default false,
  slot integer,
  page integer,
  signature_rect jsonb not null default '{}',
  name_rect jsonb not null default '{}',
  job_role_rect jsonb not null default '{}',
  date_rect jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- ── Point of Work Risk Assessments against an item pack ─────────────────
create table public.powra_assessments (
  id uuid primary key default gen_random_uuid(),
  item_pack_id uuid not null references public.item_packs(id) on delete cascade,
  assessment_date date not null,
  field_values jsonb not null default '{}',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Plant/equipment catalog ───────────────────────────────────────────────
create table public.plant_equipment (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  duty_chart_image text,
  description text,
  specs text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Pre-use equipment inspection checklists ─────────────────────────────
create table public.pre_use_checks (
  id uuid primary key default gen_random_uuid(),
  equipment_id uuid references public.plant_equipment(id) on delete set null,
  equipment_name text,
  equipment_number text,
  person_name text not null,
  check_date date not null,
  checks jsonb not null default '[]',
  all_passed boolean,
  notes text,
  images text[] not null default '{}',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ── Plant clearance distance logs ────────────────────────────────────────
create table public.plant_clearance_logs (
  id uuid primary key default gen_random_uuid(),
  location text not null,
  item_number text,
  entries jsonb not null default '[]',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Conductor height logs ────────────────────────────────────────────────
create table public.conductor_height_logs (
  id uuid primary key default gen_random_uuid(),
  item_number text not null,
  cct_being_worked_on jsonb not null default '{}',
  adjacent_cct jsonb not null default '{}',
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ── GS6 marker/spacer install-removal-inspection log ────────────────────
create table public.gs6_entries (
  id uuid primary key default gen_random_uuid(),
  route text,
  tower_number text not null,
  location text,
  qty_installed integer,
  installed_by text,
  installed_date text,
  height_set_at text,
  date_removed text,
  removed_by text,
  last_inspection_date text,
  inspection_by text,
  comments text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── HAVS (hand-arm vibration) exposure log ──────────────────────────────
create table public.havs_log_entries (
  id uuid primary key default gen_random_uuid(),
  equipment_name text not null,
  person_name text not null,
  entry_date date not null,
  minutes_used integer,
  break_minutes integer,
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ── Line walk survey log ─────────────────────────────────────────────────
create table public.line_walks (
  id uuid primary key default gen_random_uuid(),
  line_name text not null,
  tower_number text not null,
  access_works_description text,
  access_works_image text,
  vegetation_description text,
  vegetation_image text,
  watercourses_nearby text check (watercourses_nearby in ('yes','no','')),
  watercourses_description text,
  watercourses_image text,
  live_stock_in_field text check (live_stock_in_field in ('yes','no','')),
  live_stock_description text,
  live_stock_image text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ── Trainees + their training certificates ──────────────────────────────
create table public.trainees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'training_certs',
  photo_url text,
  card_provider text not null default '' check (card_provider in ('','cscs','npors','ecs')),
  card_number text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.training_certs (
  id uuid primary key default gen_random_uuid(),
  trainee_id uuid not null references public.trainees(id) on delete cascade,
  person_name text,
  title text,
  expiry_date date,
  file_url text,
  file_name text,
  file_type text,
  card_provider text not null default '' check (card_provider in ('','cscs','npors','ecs')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ── Saved reusable signatures ─────────────────────────────────────────────
create table public.saved_signatures (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  file_url text not null,
  created_at timestamptz not null default now()
);

-- ── Todos ─────────────────────────────────────────────────────────────────
create table public.todos (
  id uuid primary key default gen_random_uuid(),
  assigned_to uuid references public.profiles(id) on delete set null,
  description text not null,
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  completed boolean not null default false,
  completed_date timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ── PASS form templates + logged instances ──────────────────────────────
create table public.pass_form_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  profile_id uuid references public.profiles(id) on delete set null,
  field_values jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pass_form_logs (
  id uuid primary key default gen_random_uuid(),
  project_name text not null,
  site_location text not null,
  description_of_works text,
  person_in_charge text,
  assessor_name text,
  assessor_date date,
  field_values jsonb not null default '{}',
  verifications jsonb not null default '[]',
  visitors jsonb not null default '[]',
  archived boolean not null default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Photo archive / library images / saved map routes ───────────────────
create table public.photo_archive (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  original_photo_url text,
  amended_photo_url text,
  prompt text,
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.library_images (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  created_at timestamptz not null default now()
);

create table public.map_routes (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  coordinates jsonb not null default '[]',
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ── Home dashboard admin customization ──────────────────────────────────
create table public.custom_tiles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.hidden_tiles (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text,
  created_at timestamptz not null default now()
);

create table public.icon_overrides (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  image_url text not null,
  created_at timestamptz not null default now()
);

create table public.home_section_order (
  id uuid primary key default gen_random_uuid(),
  section_order text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table public.app_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text not null,
  updated_at timestamptz not null default now()
);

-- ── Triggers + RLS for the full entity set ──────────────────────────────
do $$
declare
  t text;
  tables_with_updated_at text[] := array[
    'app_accounts','pdf_forms','item_packs','ground_disturbance_permits','permit_templates',
    'allocation_templates','allocation_print_templates','document_groups','powra_assessments',
    'plant_equipment','plant_clearance_logs','gs6_entries','trainees','pass_form_templates','pass_form_logs'
  ];
  all_tables text[] := array[
    'app_accounts','pdf_forms','item_packs','ground_disturbance_permits','permit_templates',
    'allocation_templates','allocation_print_templates','document_groups','document_signatures',
    'powra_assessments','plant_equipment','pre_use_checks','plant_clearance_logs',
    'conductor_height_logs','gs6_entries','havs_log_entries','line_walks','trainees','training_certs',
    'saved_signatures','todos','pass_form_templates','pass_form_logs','photo_archive','library_images',
    'map_routes','custom_tiles','hidden_tiles','icon_overrides','home_section_order','app_settings'
  ];
begin
  foreach t in array tables_with_updated_at loop
    execute format('create trigger trg_%1$s_updated before update on public.%1$s for each row execute function public.set_updated_at();', t);
  end loop;

  foreach t in array all_tables loop
    execute format('alter table public.%1$s enable row level security;', t);
    execute format('create policy %1$s_all on public.%1$s for all to authenticated using (true) with check (true);', t);
  end loop;
end $$;
