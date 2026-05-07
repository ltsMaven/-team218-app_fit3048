alter table public.cms_homepage
  add column if not exists show_about_section boolean not null default true,
  add column if not exists show_services_section boolean not null default true,
  add column if not exists show_values_section boolean not null default true,
  add column if not exists show_cta_section boolean not null default true;

alter table public.cms_about_page
  add column if not exists show_hero_section boolean not null default true,
  add column if not exists show_story_section boolean not null default true,
  add column if not exists show_philosophy_section boolean not null default true,
  add column if not exists show_background_section boolean not null default true,
  add column if not exists show_focus_section boolean not null default true,
  add column if not exists show_stats_section boolean not null default true;

alter table public.cms_services_page
  add column if not exists show_intro_section boolean not null default true,
  add column if not exists show_cards_section boolean not null default true;

alter table public.cms_enquiry_page
  add column if not exists show_faq_section boolean not null default true;

alter table public.cms_blogs_page
  add column if not exists show_header_section boolean not null default true;
