create table if not exists public.cms_enquiry_page (
  slug text primary key,
  faq_items jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.cms_enquiry_page (slug, faq_items)
values (
  'main',
  '[
    {
      "question": "What happens after I submit an enquiry?",
      "answer": "After you submit the form, we will review your message and respond with the most appropriate next step based on your situation."
    },
    {
      "question": "Do I need to know which service I need before contacting you?",
      "answer": "No. You can briefly explain what support you are looking for, and we can help guide you toward counselling, coaching, supervision, or NDIS-related support."
    },
    {
      "question": "Is my enquiry confidential?",
      "answer": "Your enquiry will be treated with care and respect. Please avoid including highly sensitive or urgent information in the form."
    },
    {
      "question": "Can I ask about NDIS support through this form?",
      "answer": "Yes. You can use the enquiry form to ask about NDIS-related counselling, recovery coaching, or support options."
    }
  ]'::jsonb
)
on conflict (slug) do nothing;
