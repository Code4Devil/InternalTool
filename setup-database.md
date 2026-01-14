# Database Setup Instructions

Follow these steps to create all tables and configurations in your Supabase database:

## Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://kjgqzenzyikfiaqxkfpc.supabase.co
2. Click on the **SQL Editor** in the left sidebar
3. Execute each SQL file in order by copying and pasting the contents:

### Step 1: Create Schema and Tables
Copy the contents of `db/sql/01_schema.sql` and run it in the SQL Editor.

This creates:
- Custom types (membership_role, task_status, task_priority)
- All tables (users, organizations, projects, tasks, etc.)
- Triggers for auto-updating timestamps

### Step 2: Enable Row Level Security Policies
Copy the contents of `db/sql/02_policies.sql` and run it in the SQL Editor.

This creates:
- Helper functions for role-based access control
- RLS policies for all tables
- Security rules based on project membership

### Step 3: Create Performance Indexes
Copy the contents of `db/sql/03_indexes.sql` and run it in the SQL Editor.

This creates:
- Indexes on foreign keys
- Indexes for common query patterns
- Performance optimizations

### Step 4: Configure Storage Buckets
Copy the contents of `db/sql/04_storage.sql` and run it in the SQL Editor.

This creates:
- task-attachments storage bucket
- Storage policies for file uploads
- Helper functions for path validation

### Step 5: Setup Auto-Create User Profile Trigger
Copy the contents of `db/sql/05_triggers.sql` and run it in the SQL Editor.

This creates:
- Trigger function to automatically create user profiles
- Trigger that fires on auth.users INSERT
- Automatic profile creation on user signup

**Important:** After applying the trigger, run the backfill script to create profiles for existing users:
```sql
-- Copy and run: db/sql/backfill_user_profiles.sql
```

## Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref kjgqzenzyikfiaqxkfpc

# Run migrations
supabase db push --schema public
```

## Verification

After running all scripts, verify the setup:

1. Go to **Table Editor** in Supabase Dashboard
2. You should see these tables:
   - users
   - organizations
   - projects
   - project_members
   - tasks
   - task_comments
   - task_attachments
   - task_activity
   - notifications
   - user_invitations
   - time_entries

3. Go to **Storage** and verify `task-attachments` bucket exists

4. Verify the trigger is working:
   - Go to **SQL Editor**
   - Run: `SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';`
   - Should return 1 row showing the trigger is active

5. Test profile auto-creation:
   - Sign up a new user in your app
   - Check `public.users` table - profile should be created automatically
   - No manual `upsertUserProfile()` call needed!

## Next Steps

After setting up the database:
1. Restart your development server: `npm run dev`
2. Test authentication by signing up/logging in
3. The app will automatically connect to your configured Supabase instance
