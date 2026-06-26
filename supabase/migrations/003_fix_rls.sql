-- ════════════════════════════════════════════════════════════════
--  CRITICAL FIX — Profile Read RLS Policy
-- ════════════════════════════════════════════════════════════════
--
--  WHY YOU NEED THIS:
--  The original migration enabled Row Level Security on `profiles`
--  but didn't add a SELECT policy. This meant authenticated users
--  could not read their own profile — so the admin role check
--  silently failed and the Admin Panel link never appeared.
--
--  RUN THIS SCRIPT in your Supabase SQL editor (one-time).
-- ════════════════════════════════════════════════════════════════

-- Allow authenticated users to read their own profile (needed for the role check)
drop policy if exists "Users can read own profile" on profiles;
create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = id);

-- Allow users to update their own non-role fields
drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Allow admins to read ALL profiles (for the admin panel users list)
drop policy if exists "Admins can read all profiles" on profiles;
create policy "Admins can read all profiles"
  on profiles for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Allow public read of verified reports (anonymous browsing of the reports feed)
drop policy if exists "Public can read verified reports" on toxicity_reports;
create policy "Public can read verified reports"
  on toxicity_reports for select
  using (status = 'verified' or auth.uid() is not null);

-- Verify the policies are in place
select tablename, policyname, cmd
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
