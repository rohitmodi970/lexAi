-- LexAI Phase 2: chat sessions and messages

create table public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade not null,
  title text not null default 'New conversation',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.chat_sessions (id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  sections_tagged jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index idx_chat_sessions_user_id on public.chat_sessions (user_id);
create index idx_chat_sessions_updated_at on public.chat_sessions (updated_at desc);
create index idx_messages_session_id on public.messages (session_id);
create index idx_messages_created_at on public.messages (created_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger chat_sessions_set_updated_at
  before update on public.chat_sessions
  for each row
  execute function public.set_updated_at();

create or replace function public.bump_session_updated_at()
returns trigger
language plpgsql
as $$
begin
  update public.chat_sessions
  set updated_at = now()
  where id = new.session_id;
  return new;
end;
$$;

create trigger messages_bump_session_updated_at
  after insert on public.messages
  for each row
  execute function public.bump_session_updated_at();

alter table public.chat_sessions enable row level security;
alter table public.messages enable row level security;

create policy "Users read own sessions"
  on public.chat_sessions for select
  using (auth.uid() = user_id);

create policy "Users insert own sessions"
  on public.chat_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users update own sessions"
  on public.chat_sessions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users delete own sessions"
  on public.chat_sessions for delete
  using (auth.uid() = user_id);

create policy "Users read messages in own sessions"
  on public.messages for select
  using (
    exists (
      select 1 from public.chat_sessions
      where chat_sessions.id = messages.session_id
        and chat_sessions.user_id = auth.uid()
    )
  );

create policy "Users insert messages in own sessions"
  on public.messages for insert
  with check (
    exists (
      select 1 from public.chat_sessions
      where chat_sessions.id = messages.session_id
        and chat_sessions.user_id = auth.uid()
    )
  );

create policy "Users delete messages in own sessions"
  on public.messages for delete
  using (
    exists (
      select 1 from public.chat_sessions
      where chat_sessions.id = messages.session_id
        and chat_sessions.user_id = auth.uid()
    )
  );
