-- Helper functions for RBAC
create or replace function public.current_user_id()
returns uuid language sql stable as $$
  select auth.uid()
$$;

create or replace function public.is_authenticated()
returns boolean language sql stable as $$
  select auth.role() = 'authenticated'
$$;

create or replace function public.has_project_role(p_project_id uuid, allowed_roles text[])
returns boolean language sql stable as $$
  select exists (
    select 1 from public.project_members pm
    where pm.project_id = p_project_id
      and pm.user_id = auth.uid()
      and pm.role::text = any (allowed_roles)
  );
$$;

create or replace function public.is_project_member(p_project_id uuid)
returns boolean language sql stable as $$
  select public.has_project_role(p_project_id, array['owner','admin','manager','contributor','viewer'])
$$;

-- Users
alter table public.users enable row level security;

create policy users_select_self_or_all_profiles
  on public.users for select
  using ( is_authenticated() ); -- allow all authenticated to read minimal profiles

create policy users_insert_self
  on public.users for insert
  with check ( id = auth.uid() ); -- allow users to create their own profile

create policy users_update_self
  on public.users for update
  using ( id = auth.uid() );

-- Organizations
alter table public.organizations enable row level security;

create policy orgs_select_if_related
  on public.organizations for select
  using (
    created_by = auth.uid()
    or exists (
      select 1 from public.projects p
      join public.project_members pm on pm.project_id = p.id
      where p.organization_id = organizations.id and pm.user_id = auth.uid()
    )
  );

create policy orgs_insert_authenticated
  on public.organizations for insert
  with check ( is_authenticated() and created_by = auth.uid() );

create policy orgs_update_owner_only
  on public.organizations for update
  using ( created_by = auth.uid() );

create policy orgs_delete_owner_only
  on public.organizations for delete
  using ( created_by = auth.uid() );

-- Projects
alter table public.projects enable row level security;

create policy projects_select_members
  on public.projects for select
  using ( public.is_project_member(id) );

create policy projects_insert_authenticated
  on public.projects for insert
  with check ( is_authenticated() and created_by = auth.uid() );

create policy projects_update_admins
  on public.projects for update
  using ( public.has_project_role(id, array['owner','admin','manager']) );

create policy projects_delete_owners
  on public.projects for delete
  using ( public.has_project_role(id, array['owner']) );

-- Project members
alter table public.project_members enable row level security;

create policy project_members_select_members
  on public.project_members for select
  using ( public.is_project_member(project_id) );

create policy project_members_insert_admins
  on public.project_members for insert
  with check ( public.has_project_role(project_id, array['owner','admin']) );

create policy project_members_update_admins
  on public.project_members for update
  using ( public.has_project_role(project_id, array['owner','admin']) );

create policy project_members_delete_admins_or_self
  on public.project_members for delete
  using ( public.has_project_role(project_id, array['owner','admin']) or user_id = auth.uid() );

-- Tasks
alter table public.tasks enable row level security;

create policy tasks_select_members
  on public.tasks for select
  using ( public.is_project_member(project_id) );

create policy tasks_insert_contributors
  on public.tasks for insert
  with check ( public.has_project_role(project_id, array['owner','admin','manager','contributor']) and created_by = auth.uid() );

create policy tasks_update_contributors
  on public.tasks for update
  using ( public.has_project_role(project_id, array['owner','admin','manager','contributor']) );

create policy tasks_delete_admins_or_creator
  on public.tasks for delete
  using ( public.has_project_role(project_id, array['owner','admin']) or created_by = auth.uid() );

-- Task comments
alter table public.task_comments enable row level security;

create policy task_comments_select_members
  on public.task_comments for select
  using ( exists (select 1 from public.tasks t where t.id = task_id and public.is_project_member(t.project_id)) );

create policy task_comments_insert_contributors
  on public.task_comments for insert
  with check (
    exists (select 1 from public.tasks t where t.id = task_id and public.has_project_role(t.project_id, array['owner','admin','manager','contributor']))
    and user_id = auth.uid()
  );

create policy task_comments_delete_author_or_admin
  on public.task_comments for delete
  using (
    user_id = auth.uid()
    or exists (select 1 from public.tasks t where t.id = task_id and public.has_project_role(t.project_id, array['owner','admin']))
  );

-- Task attachments
alter table public.task_attachments enable row level security;

create policy task_attachments_select_members
  on public.task_attachments for select
  using ( public.is_project_member(project_id) );

create policy task_attachments_insert_contributors
  on public.task_attachments for insert
  with check (
    public.has_project_role(project_id, array['owner','admin','manager','contributor']) and user_id = auth.uid()
  );

create policy task_attachments_delete_admins_or_uploader
  on public.task_attachments for delete
  using ( public.has_project_role(project_id, array['owner','admin']) or user_id = auth.uid() );

-- Task activity
alter table public.task_activity enable row level security;

create policy task_activity_select_members
  on public.task_activity for select
  using ( public.is_project_member(project_id) );

create policy task_activity_insert_contributors
  on public.task_activity for insert
  with check ( public.has_project_role(project_id, array['owner','admin','manager','contributor']) and actor_id = auth.uid() );

-- Notifications
alter table public.notifications enable row level security;

create policy notifications_select_self
  on public.notifications for select
  using ( user_id = auth.uid() );

create policy notifications_insert_self
  on public.notifications for insert
  with check ( user_id = auth.uid() );

create policy notifications_update_self
  on public.notifications for update
  using ( user_id = auth.uid() );

-- User invitations
alter table public.user_invitations enable row level security;

create policy invitations_select_admins
  on public.user_invitations for select
  using (
    -- project-level invitation
    (project_id is not null and public.has_project_role(project_id, array['owner','admin','manager']))
    or
    -- org-level invitation: admin/owner on any project in the org
    (organization_id is not null and exists (
      select 1 from public.projects p
      where p.organization_id = user_invitations.organization_id
        and public.has_project_role(p.id, array['owner','admin','manager'])
    ))
  );

create policy invitations_insert_admins
  on public.user_invitations for insert
  with check (
    (project_id is not null and public.has_project_role(project_id, array['owner','admin','manager']))
    or
    (organization_id is not null and exists (
      select 1 from public.projects p
      where p.organization_id = user_invitations.organization_id
        and public.has_project_role(p.id, array['owner','admin','manager'])
    ))
  );

create policy invitations_delete_admins
  on public.user_invitations for delete
  using (
    (project_id is not null and public.has_project_role(project_id, array['owner','admin']))
    or
    (organization_id is not null and exists (
      select 1 from public.projects p
      where p.organization_id = user_invitations.organization_id
        and public.has_project_role(p.id, array['owner','admin'])
    ))
  );

-- Time entries
alter table public.time_entries enable row level security;

create policy time_entries_select_members
  on public.time_entries for select
  using ( public.is_project_member(project_id) );

create policy time_entries_insert_self
  on public.time_entries for insert
  with check ( public.is_project_member(project_id) and user_id = auth.uid() );

create policy time_entries_update_self_or_admin
  on public.time_entries for update
  using (
    user_id = auth.uid()
    or public.has_project_role(project_id, array['owner','admin'])
  );

create policy time_entries_delete_self_or_admin
  on public.time_entries for delete
  using (
    user_id = auth.uid()
    or public.has_project_role(project_id, array['owner','admin'])
  );
