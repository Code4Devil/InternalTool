-- Enable required extensions
create extension if not exists "pgcrypto";

-- Types
create type public.membership_role as enum ('owner','admin','manager','contributor','viewer');
create type public.task_status as enum ('todo','in_progress','blocked','done','archived');
create type public.task_priority as enum ('low','medium','high','urgent');

-- Users profile table mapped to auth.users
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Organizations
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references public.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'active',
  created_by uuid not null references public.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Project members
create table if not exists public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role public.membership_role not null default 'viewer',
  created_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

-- Tasks
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  status public.task_status not null default 'todo',
  priority public.task_priority not null default 'medium',
  assignee_id uuid references public.users(id) on delete set null,
  due_date date,
  estimate_minutes integer check (estimate_minutes is null or estimate_minutes >= 0),
  created_by uuid not null references public.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Task comments
create table if not exists public.task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

-- Task attachments metadata
create table if not exists public.task_attachments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete set null,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

-- Task activity audit
create table if not exists public.task_activity (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  actor_id uuid not null references public.users(id) on delete set null,
  type text not null,
  details jsonb,
  created_at timestamptz not null default now()
);

-- Notifications
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  type text not null,
  payload jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- User invitations (to orgs or projects)
create table if not exists public.user_invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  token text not null unique,
  invited_by uuid not null references public.users(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  role public.membership_role not null default 'viewer',
  status text not null default 'pending', -- pending, accepted, expired, revoked
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  check (
    -- allow either org or project invitation (at least one)
    (organization_id is not null) or (project_id is not null)
  )
);

-- Time tracking
create table if not exists public.time_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  user_id uuid not null references public.users(id) on delete cascade,
  started_at timestamptz not null,
  ended_at timestamptz,
  duration_minutes integer generated always as (
    case when ended_at is not null then greatest(0, floor(extract(epoch from (ended_at - started_at)) / 60)::int) else null end
  ) stored,
  note text,
  created_at timestamptz not null default now()
);

-- Updated_at triggers
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger organizations_set_updated_at
before update on public.organizations
for each row execute procedure public.set_updated_at();

create trigger projects_set_updated_at
before update on public.projects
for each row execute procedure public.set_updated_at();

create trigger tasks_set_updated_at
before update on public.tasks
for each row execute procedure public.set_updated_at();
