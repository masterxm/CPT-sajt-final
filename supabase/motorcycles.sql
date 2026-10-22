-- Run once in the Supabase SQL editor (safe to run again).
create table if not exists motorcycles (
  id         text primary key,          -- PolovniAutomobili listing id, so a bike is never stored twice
  url        text not null,
  title      text not null,
  price      text,
  details    text,
  image      text,
  brand      text,
  starred    boolean not null default false,
  posted_at  date,                      -- "Datum objave" from the listing page
  first_seen timestamptz not null default now(),
  last_seen  timestamptz not null default now()
);

-- Saved searches (one row per pasted link) and which bikes each one found.
create table if not exists motor_searches (
  id         uuid primary key default gen_random_uuid(),
  url        text not null unique,
  brand      text,
  created_at timestamptz not null default now()
);

create table if not exists motor_search_items (
  search_id     uuid not null references motor_searches(id) on delete cascade,
  motorcycle_id text not null references motorcycles(id) on delete cascade,
  primary key (search_id, motorcycle_id)
);

-- Only the Netlify function (service role key) touches these tables.
alter table motorcycles enable row level security;
alter table motor_searches enable row level security;
alter table motor_search_items enable row level security;

-- For databases created before posted_at existed
alter table motorcycles add column if not exists posted_at date;
