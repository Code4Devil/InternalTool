# Supabase Setup and Database Schema

This document describes how to configure Supabase for this project, including environment variables, database schema, RLS policies, indexes, and storage bucket configuration.

## Environment Variables

Create a `.env` file in the project root with:

```
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

Restart Vite after setting these.

## Client

The client is configured in `src/lib/supabase.js`. It exports `supabase`, `storagePathForTaskAttachment`, and `uploadTaskAttachment`.

## Apply SQL

Run the SQL files in order using the Supabase SQL editor or CLI:

- db/sql/01_schema.sql
- db/sql/02_policies.sql
- db/sql/03_indexes.sql
- db/sql/04_storage.sql

CLI example:

```
supabase db push --local
# or paste each file into the Supabase SQL editor
```

## Tables

- users: profile data referencing `auth.users`
- organizations: organization records
- projects: projects under organizations
- project_members: membership and role per project (owner, admin, manager, contributor, viewer)
- tasks: tasks associated to projects, with status and priority enums
- task_comments: comments on tasks
- task_attachments: metadata for attachments stored in `storage`
- task_activity: audit/activity entries for tasks
- notifications: user-specific notifications
- user_invitations: invitations to join at project or organization level
- time_entries: time tracking entries

## RLS

Policies are defined in `db/sql/02_policies.sql`. Access is based on `project_members` roles via helper functions `has_project_role` and `is_project_member`.

## Indexes

Indexes are in `db/sql/03_indexes.sql` and cover FK columns and common filters.

## Storage

A private bucket `task-attachments` is created. Store files at paths:

```
projects/<project_id>/tasks/<task_id>/<filename>
```

`db/sql/04_storage.sql` includes storage policies to allow project members to read; contributors and above to upload; and admin/owner or uploader to delete.
