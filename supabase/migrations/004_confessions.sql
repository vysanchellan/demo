-- ════════════════════════════════════════════════════════════════
--  BURNOUT — The Wall (anonymous confessions) + assessment reads
--  Run this once in your Supabase SQL editor.
-- ════════════════════════════════════════════════════════════════

create table if not exists confessions (
  id uuid primary key default gen_random_uuid(),
  text text not null check (char_length(text) between 10 and 280),
  mood text not null default 'drained' check (mood in ('drained','angry','numb','hopeful')),
  hearts int default 0,
  created_at timestamptz default now()
);

alter table confessions enable row level security;

-- Anyone can read the wall
drop policy if exists "read confessions" on confessions;
create policy "read confessions" on confessions for select using (true);

-- Anyone can post (anonymous)
drop policy if exists "insert confessions" on confessions;
create policy "insert confessions" on confessions for insert with check (true);

-- Anyone can increment hearts
drop policy if exists "update confessions" on confessions;
create policy "update confessions" on confessions for update using (true) with check (true);

-- Atomic heart increment
create or replace function increment_hearts(cid uuid)
returns void language sql as $$
  update confessions set hearts = hearts + 1 where id = cid;
$$;

-- Seed a few so the wall is never empty
insert into confessions (text, mood, hearts) values
  ('My manager scheduled a "quick sync" at 6pm on a Friday to tell me I "lack urgency". I have worked every weekend this month.', 'angry', 248),
  ('I cried in the bathroom today and then smiled in the next stand-up. Nobody noticed. That is the part that scares me.', 'numb', 519),
  ('Handed in my notice this morning after reading three reports about my company here. Best decision in two years.', 'hopeful', 871),
  ('They call it "passion" when they want free overtime and "unprofessional" when I ask about my contract.', 'drained', 333)
on conflict do nothing;

-- Allow public read of ALL reports for the public feed (demo-friendly)
drop policy if exists "read reports" on toxicity_reports;
create policy "read reports" on toxicity_reports for select using (true);
