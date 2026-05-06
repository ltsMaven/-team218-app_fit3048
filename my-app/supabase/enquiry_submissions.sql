create table if not exists public.enquiry_submissions (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists enquiry_submissions_created_at_idx
  on public.enquiry_submissions (created_at desc);

alter table public.enquiry_submissions enable row level security;
