alter table public.cms_blogs_page
  add column if not exists highlight_items jsonb not null default '[]'::jsonb;

do $$
declare
  has_highlight_item_1 boolean;
  has_highlight_item_2 boolean;
  has_highlight_item_3 boolean;
begin
  select exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'cms_blogs_page'
      and column_name = 'highlight_item_1'
  ) into has_highlight_item_1;

  select exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'cms_blogs_page'
      and column_name = 'highlight_item_2'
  ) into has_highlight_item_2;

  select exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'cms_blogs_page'
      and column_name = 'highlight_item_3'
  ) into has_highlight_item_3;

  if has_highlight_item_1 and has_highlight_item_2 and has_highlight_item_3 then
    execute $sql$
      update public.cms_blogs_page
      set highlight_items = (
        select coalesce(jsonb_agg(item), '[]'::jsonb)
        from (
          select trim(value) as item
          from unnest(array[highlight_item_1, highlight_item_2, highlight_item_3]) as value
          where trim(coalesce(value, '')) <> ''
        ) items
      )
      where coalesce(jsonb_array_length(highlight_items), 0) = 0
    $sql$;
  end if;
end $$;

update public.cms_blogs_page
set highlight_items = '["Practical guidance for recovery, resilience, and everyday wellbeing.","Compassionate reflections on disability, addiction, and personal growth.","Grounded support you can read at your own pace and return to when needed."]'::jsonb
where slug = 'main'
  and coalesce(jsonb_array_length(highlight_items), 0) = 0;
