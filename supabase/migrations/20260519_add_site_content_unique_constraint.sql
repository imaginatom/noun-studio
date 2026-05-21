-- Remove any duplicate (page, section) rows keeping only the most recently updated one
-- before adding the unique constraint.
delete from public.site_content sc1
using public.site_content sc2
where sc1.page = sc2.page
  and sc1.section = sc2.section
  and sc1.updated_at < sc2.updated_at;

alter table public.site_content
  add constraint site_content_page_section_key unique (page, section);
