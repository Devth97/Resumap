-- Supabase PostgreSQL Migration for HireLens / ResuMap

-- 1. sessions
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  event_code text,
  device_hash text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  status text not null default 'active'
);

-- 2. resume_extractions
create table if not exists resume_extractions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id),
  extraction_method text not null,
  page_count integer not null,
  character_count integer not null,
  extraction_confidence numeric,
  redacted_text text,
  raw_file_deleted_at timestamptz,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

-- 3. role_profiles
create table if not exists role_profiles (
  id text not null,
  version text not null,
  title text not null,
  profile_json jsonb not null,
  is_active boolean not null default true,
  reviewed_at timestamptz not null,
  created_at timestamptz not null default now(),
  primary key (id, version)
);

-- 4. analyses
create table if not exists analyses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id),
  resume_extraction_id uuid references resume_extractions(id),
  role_id text not null,
  role_version text not null,
  questionnaire_json jsonb not null,
  analysis_signals_json jsonb,
  result_json jsonb,
  resume_quality_score integer,
  job_readiness_score integer,
  confidence text,
  status text not null default 'queued',
  error_code text,
  provider_model text,
  provider_latency_ms integer,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

-- 5. feedback
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id),
  analysis_id uuid references analyses(id),
  accuracy_rating integer,
  roadmap_useful text,
  most_useful_section text,
  comments text,
  would_use_again text,
  contact_email text,
  contact_consent boolean not null default false,
  created_at timestamptz not null default now()
);

-- 6. analytics_events
create table if not exists analytics_events (
  id bigint generated always as identity primary key,
  session_id uuid,
  event_name text not null,
  properties jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- Row Level Security (RLS) policies
alter table sessions enable row level security;
alter table resume_extractions enable row level security;
alter table analyses enable row level security;
alter table feedback enable row level security;
