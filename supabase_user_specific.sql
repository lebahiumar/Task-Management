-- 1. Add user_id columns to tables
alter table public.teams add column if not exists user_id uuid;
alter table public.team_members add column if not exists user_id uuid;
alter table public.tasks add column if not exists user_id uuid;

-- 2. Remove open policies
drop policy if exists "Allow all" on public.teams;
drop policy if exists "Allow all" on public.team_members;
drop policy if exists "Allow all" on public.tasks;

-- 3. Create RLS policies for user-specific access
create policy "Users can access their own teams" on public.teams for all using (auth.uid() = user_id);
create policy "Users can access their own team_members" on public.team_members for all using (auth.uid() = user_id);
create policy "Users can access their own tasks" on public.tasks for all using (auth.uid() = user_id);
