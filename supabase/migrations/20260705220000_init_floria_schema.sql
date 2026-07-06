create table if not exists profiles (
	user_id uuid primary key references auth.users on delete cascade,
	display_name text,
	prefs jsonb not null default '{}',
	updated_at timestamptz not null default now()
);

create table if not exists habits (
	id uuid primary key,
	user_id uuid not null references auth.users on delete cascade,
	data jsonb not null,
	updated_at timestamptz not null default now()
);

create table if not exists logs (
	id uuid primary key,
	user_id uuid not null references auth.users on delete cascade,
	habit_id uuid not null,
	ts timestamptz not null,
	amount real not null
);

create index if not exists habits_user_id_idx on habits (user_id);
create index if not exists logs_user_id_idx on logs (user_id);
create index if not exists logs_habit_id_idx on logs (habit_id);

alter table profiles enable row level security;
alter table habits enable row level security;
alter table logs enable row level security;

create policy "profiles are owned by their user" on profiles
	for all
	using (user_id = auth.uid())
	with check (user_id = auth.uid());

create policy "habits are owned by their user" on habits
	for all
	using (user_id = auth.uid())
	with check (user_id = auth.uid());

create policy "logs are owned by their user" on logs
	for all
	using (user_id = auth.uid())
	with check (user_id = auth.uid());
