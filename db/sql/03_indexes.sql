-- Common foreign key and filter indexes
create index if not exists idx_projects_org on public.projects(organization_id);
create index if not exists idx_projects_created_by on public.projects(created_by);

create index if not exists idx_project_members_user on public.project_members(user_id);
create index if not exists idx_project_members_project on public.project_members(project_id);

create index if not exists idx_tasks_project on public.tasks(project_id);
create index if not exists idx_tasks_status on public.tasks(status);
create index if not exists idx_tasks_assignee on public.tasks(assignee_id);
create index if not exists idx_tasks_due on public.tasks(due_date);
create index if not exists idx_tasks_updated on public.tasks(updated_at desc);

create index if not exists idx_task_comments_task on public.task_comments(task_id);
create index if not exists idx_task_comments_user on public.task_comments(user_id);
create index if not exists idx_task_comments_created on public.task_comments(created_at desc);

create index if not exists idx_task_attachments_task on public.task_attachments(task_id);
create index if not exists idx_task_attachments_project on public.task_attachments(project_id);
create index if not exists idx_task_attachments_user on public.task_attachments(user_id);
create index if not exists idx_task_attachments_path on public.task_attachments(storage_path);

create index if not exists idx_task_activity_project on public.task_activity(project_id);
create index if not exists idx_task_activity_task on public.task_activity(task_id);
create index if not exists idx_task_activity_actor on public.task_activity(actor_id);
create index if not exists idx_task_activity_created on public.task_activity(created_at desc);

create index if not exists idx_notifications_user on public.notifications(user_id);
create index if not exists idx_notifications_read on public.notifications(read_at);

create index if not exists idx_user_invitations_email on public.user_invitations(email);
create index if not exists idx_user_invitations_project on public.user_invitations(project_id);
create index if not exists idx_user_invitations_org on public.user_invitations(organization_id);
create index if not exists idx_user_invitations_expires on public.user_invitations(expires_at);

create index if not exists idx_time_entries_project on public.time_entries(project_id);
create index if not exists idx_time_entries_task on public.time_entries(task_id);
create index if not exists idx_time_entries_user on public.time_entries(user_id);
create index if not exists idx_time_entries_started on public.time_entries(started_at);
