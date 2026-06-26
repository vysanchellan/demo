-- ════════════════════════════════════════════════════════════════
--  BURNOUT — Admin Seed Script
-- ════════════════════════════════════════════════════════════════
--
--  HOW TO USE:
--
--  1. First, create a user account through the normal signup flow:
--     - Go to your deployed BURNOUT site → /auth/signup
--     - Sign up with the email you want to be admin (e.g. admin@burnout.app)
--     - Choose a strong password
--     - Confirm the email if email confirmation is enabled
--
--  2. Then run THIS script in your Supabase SQL editor:
--     - Replace 'admin@burnout.app' on line 26 with the email you just signed up with
--     - Click Run
--
--  3. Sign in and navigate to /admin — you now have admin access.
--
--  WHY THIS APPROACH:
--  Supabase manages auth.users via secure encryption that cannot be safely
--  written to from a SQL script. You always create the user first via the
--  signup flow, then promote them with a profile UPDATE.
-- ════════════════════════════════════════════════════════════════

-- Promote an existing signed-up user to admin role
update profiles
set role = 'admin',
    display_name = coalesce(display_name, 'Administrator')
where id = (
  select id from auth.users
  where email = 'admin@burnout.app'   -- ← CHANGE THIS to your email
  limit 1
);

-- Verify it worked
select
  u.email,
  p.display_name,
  p.role,
  p.created_at
from auth.users u
join profiles p on p.id = u.id
where p.role = 'admin';

-- ════════════════════════════════════════════════════════════════
--  OPTIONAL: Seed sample data for the demo
-- ════════════════════════════════════════════════════════════════

-- Sample companies
insert into companies (name, industry, city, country, toxicity_score, report_count, verified)
values
  ('TechNova ZA', 'Technology', 'Johannesburg', 'South Africa', 88, 142, true),
  ('FirstBank Corp', 'Finance', 'Cape Town', 'South Africa', 72, 89, true),
  ('MediaPlex', 'Media', 'Johannesburg', 'South Africa', 65, 54, false),
  ('HealthCare SA', 'Healthcare', 'Pretoria', 'South Africa', 51, 38, true),
  ('RetailHub', 'Retail', 'Durban', 'South Africa', 44, 27, false),
  ('GovDept IT', 'Government', 'Pretoria', 'South Africa', 79, 116, true),
  ('LawFirm Associates', 'Legal', 'Cape Town', 'South Africa', 61, 45, false),
  ('BuildCo Construction', 'Construction', 'Johannesburg', 'South Africa', 83, 97, true)
on conflict do nothing;

-- Sample resources
insert into resources (title, description, type, url, phone, free, country)
values
  ('SADAG Mental Health Helpline', 'South Africa Depression and Anxiety Group — 24/7 crisis support line.', 'hotline', null, '0800 456 789', true, 'South Africa'),
  ('Lifeline South Africa', 'Crisis counselling and emotional support.', 'hotline', null, '0861 322 322', true, 'South Africa'),
  ('Headspace', 'Science-backed meditation app. Proven to reduce workplace stress.', 'app', 'https://headspace.com', null, false, null),
  ('Calm', 'Sleep stories, breathing exercises, and guided meditations.', 'app', 'https://calm.com', null, false, null),
  ('BetterHelp', 'Online therapy with licensed therapists.', 'therapy', 'https://betterhelp.com', null, false, null),
  ('r/Burnout', '300k+ workers sharing experiences and support.', 'community', 'https://reddit.com/r/burnout', null, true, null)
on conflict do nothing;
