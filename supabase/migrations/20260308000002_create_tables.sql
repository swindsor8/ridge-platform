create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null unique,
  username text not null unique,
  display_name text not null,
  state text not null,
  created_at timestamptz default now() not null
);

create table public.hunts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  start_time timestamptz,
  end_time timestamptz,
  weapon_type text,
  notes text,
  created_at timestamptz default now() not null
);

create table public.stand_locations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  geom geometry(Point, 4326),
  notes text,
  created_at timestamptz default now() not null
);

create table public.trail_cameras (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  geom geometry(Point, 4326),
  created_at timestamptz default now() not null
);

create table public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  caption text,
  created_at timestamptz default now() not null
);

create table public.comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  body text not null,
  created_at timestamptz default now() not null
);

create table public.harvests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  species text not null,
  score_estimate numeric,
  harvest_date date,
  created_at timestamptz default now() not null
);

create table public.trophy_entries (
  id uuid default gen_random_uuid() primary key,
  harvest_id uuid references public.harvests(id) on delete cascade not null,
  category text,
  season_year integer,
  ranking_score numeric,
  created_at timestamptz default now() not null
);
