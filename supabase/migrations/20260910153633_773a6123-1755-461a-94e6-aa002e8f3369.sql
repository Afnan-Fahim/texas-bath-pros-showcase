-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create policy "Users can view their own roles"
  on public.user_roles for select to authenticated
  using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- Leads
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  email text not null default '',
  phone text not null default '',
  address text not null default '',
  homeowner text not null default '',
  timeframe text not null default '',
  desired_upgrade text not null default '',
  main_problem text not null default '',
  notes text not null default '',
  source text not null default '',
  page_url text not null default '',
  attribution jsonb not null default '{}'::jsonb,
  booked boolean not null default false,
  appointment_date text not null default '',
  event_uri text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.leads to authenticated;
grant all on public.leads to service_role;
alter table public.leads enable row level security;

create policy "Admins can view leads"
  on public.leads for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update leads"
  on public.leads for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete leads"
  on public.leads for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Quiz step 1 images
create table public.quiz_images (
  slot text primary key,
  label text not null default '',
  image_url text not null default '',
  updated_at timestamptz not null default now()
);

grant select on public.quiz_images to anon, authenticated;
grant all on public.quiz_images to service_role;
alter table public.quiz_images enable row level security;

create policy "Anyone can view quiz images"
  on public.quiz_images for select to anon, authenticated
  using (true);

create policy "Admins can update quiz images"
  on public.quiz_images for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

insert into public.quiz_images (slot, label, image_url) values
  ('walk-in-shower', 'Walk-in shower', ''),
  ('new-tub', 'New tub remodel', '');

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = public
as $$ begin new.updated_at = now(); return new; end; $$;

create trigger update_leads_updated_at before update on public.leads
  for each row execute function public.update_updated_at_column();
create trigger update_quiz_images_updated_at before update on public.quiz_images
  for each row execute function public.update_updated_at_column();