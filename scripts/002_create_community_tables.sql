-- Create community posts table for open platform
create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  username text not null, -- anonymized or chosen username, not email
  title text not null,
  content text not null,
  category text not null, -- 'Hausbau', 'Umbau', 'Sanierung', 'Wohnungskauf'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create comments table
create table if not exists public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  username text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create consultation requests table
create table if not exists public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  project_type text not null, -- 'Hausbau', 'Umbau', 'Sanierung', 'Wohnungskauf'
  description text not null,
  status text not null default 'pending', -- 'pending', 'contacted', 'scheduled', 'completed'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.community_posts enable row level security;
alter table public.community_comments enable row level security;
alter table public.consultation_requests enable row level security;

-- RLS Policies for community posts (all registered users can read)
create policy "All authenticated users can view posts"
  on public.community_posts for select
  using (auth.role() = 'authenticated');

create policy "Users can create their own posts"
  on public.community_posts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own posts"
  on public.community_posts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own posts"
  on public.community_posts for delete
  using (auth.uid() = user_id);

-- RLS Policies for comments
create policy "All authenticated users can view comments"
  on public.community_comments for select
  using (auth.role() = 'authenticated');

create policy "Users can create comments"
  on public.community_comments for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own comments"
  on public.community_comments for update
  using (auth.uid() = user_id);

create policy "Users can delete their own comments"
  on public.community_comments for delete
  using (auth.uid() = user_id);

-- RLS Policies for consultation requests
create policy "Users can view their own consultation requests"
  on public.consultation_requests for select
  using (auth.uid() = user_id);

create policy "Users can create consultation requests"
  on public.consultation_requests for insert
  with check (auth.uid() = user_id);
