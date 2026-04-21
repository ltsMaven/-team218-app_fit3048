create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  name text not null,
  email text not null,
  display_name text,
  service text,
  testimonial text not null,
  consent boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists testimonials_status_created_at_idx
  on public.testimonials (status, created_at desc);

alter table public.testimonials enable row level security;
