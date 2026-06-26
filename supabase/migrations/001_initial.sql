-- BURNOUT Platform — Initial Schema
-- Run in Supabase SQL Editor

-- User profiles
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),
  burnout_streak int default 0,
  created_at timestamptz default now()
);

-- Companies
create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  city text,
  country text default 'South Africa',
  toxicity_score numeric default 0,
  report_count int default 0,
  verified boolean default false,
  created_at timestamptz default now()
);

-- Toxicity reports
create table if not exists toxicity_reports (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  industry text,
  company_size text,
  city text,
  country text default 'South Africa',
  report_type text not null,
  severity int not null check (severity between 1 and 10),
  description text not null,
  is_anonymous boolean default true,
  user_id uuid references profiles(id) on delete set null,
  status text default 'pending' check (status in ('pending', 'reviewed', 'verified')),
  upvotes int default 0,
  created_at timestamptz default now()
);

-- Burnout assessments
create table if not exists burnout_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  score int not null,
  level text not null check (level in ('healthy', 'caution', 'warning', 'critical')),
  exhaustion_score int,
  cynicism_score int,
  efficacy_score int,
  answers jsonb,
  created_at timestamptz default now()
);

-- Resources
create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  type text not null check (type in ('hotline', 'app', 'article', 'therapy', 'community')),
  url text,
  phone text,
  free boolean default true,
  country text,
  created_at timestamptz default now()
);

-- Report upvotes
create table if not exists report_upvotes (
  user_id uuid references profiles(id) on delete cascade,
  report_id uuid references toxicity_reports(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, report_id)
);

-- RLS Policies
alter table profiles enable row level security;
alter table toxicity_reports enable row level security;
alter table burnout_assessments enable row level security;
alter table report_upvotes enable row level security;
alter table companies enable row level security;
alter table resources enable row level security;

-- Public read for reports (anonymous ok)
create policy "Public can read verified reports"
  on toxicity_reports for select
  using (status = 'verified');

-- Users can insert reports
create policy "Users can insert reports"
  on toxicity_reports for insert
  with check (true);

-- Users own their assessments
create policy "Users own assessments"
  on burnout_assessments for all
  using (auth.uid() = user_id);

-- Public read companies
create policy "Public read companies"
  on companies for select using (true);

-- Public read resources
create policy "Public read resources"
  on resources for select using (true);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
