alter table public.cms_homepage
  add column if not exists about_image_url text;

alter table public.cms_about_page
  add column if not exists hero_image_url text,
  add column if not exists philosophy_image_url text,
  add column if not exists background_image_url text;

alter table public.cms_service_items
  add column if not exists image_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cms-images',
  'cms-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
