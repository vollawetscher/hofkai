-- Create user profiles table with token tracking
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  tokens integer not null default 10,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.user_profiles enable row level security;

-- RLS Policies
create policy "Users can view their own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

-- Create function to auto-create profile with 10 tokens on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, email, tokens)
  values (
    new.id,
    new.email,
    10
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Trigger to create profile automatically
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Create token usage tracking table
create table if not exists public.token_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  tokens_used integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.token_usage enable row level security;

create policy "Users can view their own token usage"
  on public.token_usage for select
  using (auth.uid() = user_id);

create policy "Users can insert their own token usage"
  on public.token_usage for insert
  with check (auth.uid() = user_id);
