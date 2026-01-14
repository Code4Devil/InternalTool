-- Create private bucket for task attachments
insert into storage.buckets (id, name, public)
values ('task-attachments', 'task-attachments', false)
on conflict (id) do nothing;

-- Helper to extract project_id from object path: projects/<project_id>/tasks/<task_id>/...
create or replace function public.storage_project_id(obj_name text)
returns uuid
language plpgsql
immutable
strict
as $$
declare
  seg text;
begin
  -- Expect first segment = 'projects', second segment = uuid
  if position('/' in obj_name) = 0 then
    return null;
  end if;
  if split_part(obj_name, '/', 1) <> 'projects' then
    return null;
  end if;
  seg := split_part(obj_name, '/', 2);
  if seg ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
    return seg::uuid;
  end if;
  return null;
end;
$$;

-- Policies for storage.objects specific to task-attachments bucket
-- Note: storage schema RLS is enabled by default in Supabase

create policy storage_select_task_attachments
on storage.objects for select
using (
  bucket_id = 'task-attachments'
  and public.has_project_role(public.storage_project_id(name), array['owner','admin','manager','contributor','viewer'])
);

create policy storage_insert_task_attachments
on storage.objects for insert
with check (
  bucket_id = 'task-attachments'
  and public.has_project_role(public.storage_project_id(name), array['owner','admin','manager','contributor'])
);

create policy storage_delete_task_attachments
on storage.objects for delete
using (
  bucket_id = 'task-attachments'
  and (
    public.has_project_role(public.storage_project_id(name), array['owner','admin'])
    or owner = auth.uid()
  )
);
