create table if not exists public.cms_blogs_page (
  slug text primary key,
  eyebrow text not null default '',
  heading text not null default '',
  intro_body_1 text not null default '',
  intro_body_2 text not null default '',
  highlights_label text not null default '',
  highlights_body text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.cms_blogs_page (
  slug,
  eyebrow,
  heading,
  intro_body_1,
  intro_body_2,
  highlights_label,
  highlights_body
)
values (
  'main',
  'Blogs',
  'Articles, reflections, and practical support',
  'This space is dedicated to sharing insights, strategies, and stories that inspire growth and resilience. Here, you''ll find practical guidance on overcoming addictions, navigating life with disabilities, and fostering personal development.',
  'The goal is to offer a supportive, judgment-free place where you can learn, reflect, and take steady steps toward a healthier and more empowered life, whether you''re seeking tools for change, understanding for a loved one, or encouragement for your own journey.',
  'What You''ll Find',
  'A thoughtful mix of reflections and practical reading designed to feel supportive, clear, and easy to return to.'
)
on conflict (slug) do nothing;
