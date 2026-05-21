insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do update set public = true;

-- storage.objects RLS is already enabled by Supabase internally;
-- attempting to ALTER TABLE on it causes a permissions error.

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Site images are publicly readable'
  ) then
    execute $p$
      create policy "Site images are publicly readable"
      on storage.objects
      for select
      using (bucket_id = 'site-images')
    $p$;
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Site images are insertable by admin'
  ) then
    execute $p$
      create policy "Site images are insertable by admin"
      on storage.objects
      for insert
      with check (bucket_id = 'site-images' and public.is_admin())
    $p$;
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Site images are updatable by admin'
  ) then
    execute $p$
      create policy "Site images are updatable by admin"
      on storage.objects
      for update
      using (bucket_id = 'site-images' and public.is_admin())
      with check (bucket_id = 'site-images' and public.is_admin())
    $p$;
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Site images are deletable by admin'
  ) then
    execute $p$
      create policy "Site images are deletable by admin"
      on storage.objects
      for delete
      using (bucket_id = 'site-images' and public.is_admin())
    $p$;
  end if;
end;
$$;
