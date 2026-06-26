-- ════════════════════════════════════════════════════════════════════════
--  BURNOUT — ONE-SHOT SETUP SCRIPT
--  Run this ONCE in your Supabase SQL Editor. It is safe to re-run.
--
--  It does everything:
--    1. Creates all tables
--    2. Sets up Row Level Security with the CORRECT read policies
--    3. Auto-creates a profile whenever someone signs up
--    4. Seeds demo companies + resources
--
--  THEN, to make an account an admin, scroll to the bottom (STEP 2).
-- ════════════════════════════════════════════════════════════════════════

-- ─── TABLES ───
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  avatar_url text,
  role text default 'user' check (role in ('user','admin')),
  burnout_streak int default 0,
  created_at timestamptz default now()
);

create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null, industry text, city text, country text default 'South Africa',
  toxicity_score numeric default 0, report_count int default 0,
  verified boolean default false, created_at timestamptz default now()
);

create table if not exists toxicity_reports (
  id uuid primary key default gen_random_uuid(),
  company_name text not null, industry text, company_size text,
  city text, country text default 'South Africa',
  report_type text not null,
  severity int not null check (severity between 1 and 10),
  description text not null,
  is_anonymous boolean default true,
  user_id uuid references profiles(id) on delete set null,
  status text default 'pending' check (status in ('pending','reviewed','verified')),
  upvotes int default 0, created_at timestamptz default now()
);

create table if not exists burnout_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  score int not null,
  level text not null check (level in ('healthy','caution','warning','critical')),
  exhaustion_score int, cynicism_score int, efficacy_score int,
  answers jsonb, created_at timestamptz default now()
);

create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  title text not null, description text,
  type text not null check (type in ('hotline','app','article','therapy','community')),
  url text, phone text, free boolean default true,
  country text, created_at timestamptz default now()
);

-- ─── RLS ───
alter table profiles enable row level security;
alter table toxicity_reports enable row level security;
alter table burnout_assessments enable row level security;
alter table companies enable row level security;
alter table resources enable row level security;

drop policy if exists "read own profile" on profiles;
create policy "read own profile" on profiles for select using (auth.uid() = id);

drop policy if exists "update own profile" on profiles;
create policy "update own profile" on profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "insert reports" on toxicity_reports;
create policy "insert reports" on toxicity_reports for insert with check (true);

drop policy if exists "read reports" on toxicity_reports;
create policy "read reports" on toxicity_reports for select using (status = 'verified' or auth.uid() is not null);

drop policy if exists "own assessments" on burnout_assessments;
create policy "own assessments" on burnout_assessments for all using (auth.uid() = user_id);

drop policy if exists "read companies" on companies;
create policy "read companies" on companies for select using (true);

drop policy if exists "read resources" on resources;
create policy "read resources" on resources for select using (true);

-- ─── AUTO-CREATE PROFILE ON SIGNUP ───
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, new.raw_user_meta_data->>'display_name')
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute procedure handle_new_user();

-- ─── SEED DEMO DATA ───
insert into companies (name, industry, city, country, toxicity_score, report_count, verified) values
  ('TechNova ZA','Technology','Johannesburg','South Africa',88,142,true),
  ('FirstBank Corp','Finance','Cape Town','South Africa',72,89,true),
  ('MediaPlex','Media','Johannesburg','South Africa',65,54,false),
  ('HealthCare SA','Healthcare','Pretoria','South Africa',51,38,true),
  ('RetailHub','Retail','Durban','South Africa',44,27,false),
  ('GovDept IT','Government','Pretoria','South Africa',79,116,true)
on conflict do nothing;

insert into resources (title, description, type, url, phone, free, country) values
  ('SADAG Mental Health Helpline','24/7 crisis support line.','hotline',null,'0800 456 789',true,'South Africa'),
  ('Lifeline South Africa','Crisis counselling and emotional support.','hotline',null,'0861 322 322',true,'South Africa'),
  ('Headspace','Meditation app proven to reduce workplace stress.','app','https://headspace.com',null,false,null),
  ('BetterHelp','Online therapy with licensed therapists.','therapy','https://betterhelp.com',null,false,null)
on conflict do nothing;


-- ════════════════════════════════════════════════════════════════════════
--  STEP 2 — MAKE YOURSELF AN ADMIN
--
--  a) First sign up normally on the site (/auth/signup) with your email.
--  b) Then change the email below to YOUR email and run JUST this block.
--     It sets the admin role in BOTH places so detection always works.
-- ════════════════════════════════════════════════════════════════════════

-- Set role in the profiles table
update profiles
set role = 'admin', display_name = coalesce(display_name, 'Administrator')
where id = (select id from auth.users where email = 'admin@burnout.app' limit 1);

-- Also embed the role in auth metadata (works even without RLS)
update auth.users
set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'admin@burnout.app';   -- ← CHANGE THIS to your email

-- Verify
select u.email, p.role as profile_role, u.raw_user_meta_data->>'role' as meta_role
from auth.users u join profiles p on p.id = u.id
where p.role = 'admin';
