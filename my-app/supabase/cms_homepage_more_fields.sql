alter table public.cms_homepage
  add column if not exists services_label text not null default '',
  add column if not exists services_support_body text not null default '',
  add column if not exists service_1_title text not null default '',
  add column if not exists service_1_description text not null default '',
  add column if not exists service_1_tags text not null default '',
  add column if not exists service_2_title text not null default '',
  add column if not exists service_2_description text not null default '',
  add column if not exists service_2_tags text not null default '',
  add column if not exists service_3_title text not null default '',
  add column if not exists service_3_description text not null default '',
  add column if not exists service_3_tags text not null default '',
  add column if not exists services_card_1_title text not null default '',
  add column if not exists services_card_1_body text not null default '',
  add column if not exists services_card_2_title text not null default '',
  add column if not exists services_card_2_body text not null default '',
  add column if not exists about_section_label text not null default '',
  add column if not exists about_section_heading_line_1 text not null default '',
  add column if not exists about_section_heading_line_2 text not null default '';

update public.cms_homepage
set
  services_label = coalesce(nullif(services_label, ''), 'Services'),
  services_support_body = coalesce(
    nullif(services_support_body, ''),
    'Support is tailored to your needs, goals, and circumstances, with options for personal counselling, recovery-focused support, and professional supervision.'
  ),
  service_1_title = coalesce(nullif(service_1_title, ''), 'Counselling & Personal Support'),
  service_1_description = coalesce(
    nullif(service_1_description, ''),
    'One-on-one and relationship counselling for stress, trauma, substance misuse, domestic and family violence, emotional challenges, and personal growth.'
  ),
  service_1_tags = coalesce(nullif(service_1_tags, ''), 'Individual, Couples, Trauma'),
  service_2_title = coalesce(nullif(service_2_title, ''), 'Recovery Coaching & NDIS Support'),
  service_2_description = coalesce(
    nullif(service_2_description, ''),
    'Person-centred support for NDIS participants, people with disabilities, families, and carers, with a focus on recovery, confidence, independence, and everyday wellbeing.'
  ),
  service_2_tags = coalesce(nullif(service_2_tags, ''), 'NDIS, Recovery, Disability Support'),
  service_3_title = coalesce(nullif(service_3_title, ''), 'Clinical Supervision'),
  service_3_description = coalesce(
    nullif(service_3_description, ''),
    'Reflective supervision for professionals, supporting confidence, ethical practice, professional development, boundaries, and work-related challenges.'
  ),
  service_3_tags = coalesce(nullif(service_3_tags, ''), 'Supervision, Practice, Development'),
  services_card_1_title = coalesce(nullif(services_card_1_title, ''), 'NDIS Registered Provider'),
  services_card_1_body = coalesce(
    nullif(services_card_1_body, ''),
    'Ability to Thrive provides person-centred support for NDIS participants, families, and carers in a safe, respectful, and non-judgemental environment.'
  ),
  services_card_2_title = coalesce(nullif(services_card_2_title, ''), 'Appointments & Access'),
  services_card_2_body = coalesce(
    nullif(services_card_2_body, ''),
    'Appointments are available via telehealth. Face-to-face support may be considered depending on location, needs, and availability.'
  ),
  about_section_label = coalesce(nullif(about_section_label, ''), 'Goals, Values, Vision'),
  about_section_heading_line_1 = coalesce(nullif(about_section_heading_line_1, ''), 'About'),
  about_section_heading_line_2 = coalesce(nullif(about_section_heading_line_2, ''), 'Ability to Thrive')
where slug = 'main';
