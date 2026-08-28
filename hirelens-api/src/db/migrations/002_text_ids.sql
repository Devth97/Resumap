-- Align the schema with the ids the API actually generates, and add the one
-- column the analyses table is missing.
--
-- Two things are going on here.
--
-- 1. `analyses` has no `stage` column, but AnalysisRecord carries one and
--    GET /analyses/:id reads it back while an analysis is still processing.
--    Every write of that field was being dropped.
--
-- 2. 001 declared every id / foreign-key column as `uuid`, which does not match
--    the ids the API generates (`ana_1f3c…`, `res_…`, `sess_…`, `fb_…` — see
--    utilities/hashing.ts). The production database does not have that problem
--    (its ids are already text), so 001 evidently is not what created it — but
--    the file is still in the repo and would reproduce the mismatch on any
--    fresh environment, where inserts would fail with 22P02 and, because
--    supabase-js returns errors rather than throwing, fail silently.
--
-- Written to be idempotent: it creates what is missing, converts what is still
-- `uuid`, and is safe to re-run against a database that is already correct.
-- Only the four tables the API actually reads and writes are touched.

begin;

-- 1. Ensure the tables exist. Present ones are left alone here and corrected
--    by the steps below.

create table if not exists sessions (
  id text primary key,
  event_code text,
  device_hash text,
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  status text not null default 'active'
);

create table if not exists resume_extractions (
  id text primary key,
  session_id text,
  extraction_method text,
  page_count integer,
  character_count integer,
  extraction_confidence numeric,
  redacted_text text,
  raw_file_deleted_at timestamptz,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create table if not exists analyses (
  id text primary key,
  session_id text,
  resume_extraction_id text,
  role_id text,
  role_version text,
  questionnaire_json jsonb,
  analysis_signals_json jsonb,
  result_json jsonb,
  resume_quality_score integer,
  job_readiness_score integer,
  confidence text,
  status text not null default 'queued',
  stage text,
  error_code text,
  provider_model text,
  provider_latency_ms integer,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists feedback (
  id text primary key,
  session_id text,
  analysis_id text,
  accuracy_rating integer,
  roadmap_useful text,
  most_useful_section text,
  comments text,
  would_use_again text,
  contact_email text,
  contact_consent boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2. The column that is actually missing in production.

alter table analyses add column if not exists stage text;

-- 3. Drop any foreign key on these tables. Discovered from the catalog rather
--    than named literally, so a constraint created under a non-default name
--    still goes — otherwise a type change below would fail with "cannot alter
--    type of a column used in a foreign key constraint". A no-op on a database
--    that has no foreign keys.
--
--    They are dropped rather than converted because resume uploads fall back to
--    a synthetic `sess_default` session id with no parent row, and an analysis
--    can be built from client-supplied redacted text with no extraction row at
--    all. Enforcing the references would turn those into write failures.

do $$
declare
  r record;
begin
  for r in
    select t.relname as table_name, c.conname as constraint_name
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where c.contype = 'f'
      and n.nspname = 'public'
      and t.relname in ('resume_extractions', 'analyses', 'feedback')
  loop
    execute format('alter table public.%I drop constraint %I', r.table_name, r.constraint_name);
  end loop;
end $$;

-- 4. Convert any id column still typed `uuid` to `text`. Skips columns that are
--    already text, so this is a no-op on the production database and the fix on
--    a database built from 001.

do $$
declare
  r record;
begin
  for r in
    select table_name, column_name
    from information_schema.columns
    where table_schema = 'public'
      and data_type = 'uuid'
      and (table_name, column_name) in (
        ('sessions', 'id'),
        ('resume_extractions', 'id'), ('resume_extractions', 'session_id'),
        ('analyses', 'id'), ('analyses', 'session_id'), ('analyses', 'resume_extraction_id'),
        ('feedback', 'id'), ('feedback', 'session_id'), ('feedback', 'analysis_id')
      )
  loop
    -- A gen_random_uuid() default would outlive the type change and break
    -- inserts that omit the id, so clear it first.
    execute format('alter table public.%I alter column %I drop default', r.table_name, r.column_name);
    execute format(
      'alter table public.%I alter column %I type text using %I::text',
      r.table_name, r.column_name, r.column_name
    );
  end loop;
end $$;

commit;
