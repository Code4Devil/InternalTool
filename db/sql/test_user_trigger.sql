-- Test script for user profile auto-creation trigger
-- Run this in Supabase SQL Editor after applying 05_triggers.sql

-- Test 1: Verify the trigger function exists
SELECT 
  n.nspname as schema,
  p.proname as function_name,
  pg_get_function_arguments(p.oid) as arguments,
  pg_get_functiondef(p.oid) as definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'handle_new_user';

-- Test 2: Verify the trigger is created
SELECT 
  trigger_name,
  event_manipulation,
  event_object_schema,
  event_object_table,
  action_statement,
  action_timing
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Test 3: Check existing users table
SELECT id, full_name, avatar_url, created_at
FROM public.users
ORDER BY created_at DESC
LIMIT 5;

-- Test 4: Simulate trigger behavior (manual test)
-- Note: This is just to verify the logic works
-- The actual trigger runs automatically on auth.users INSERT
DO $$
DECLARE
  test_email text := 'test@example.com';
  test_name text;
BEGIN
  -- Test full_name extraction logic
  test_name := coalesce(
    NULL::text, -- Simulating no full_name in metadata
    split_part(test_email, '@', 1),
    'User'
  );
  
  RAISE NOTICE 'Extracted name from email "%": "%"', test_email, test_name;
END $$;

-- Test 5: Count profiles vs auth users (should match after trigger is applied)
SELECT 
  (SELECT count(*) FROM auth.users) as auth_users_count,
  (SELECT count(*) FROM public.users) as profile_count,
  (SELECT count(*) FROM auth.users) - (SELECT count(*) FROM public.users) as missing_profiles;

-- Test 6: Identify auth users without profiles (if any exist)
SELECT 
  au.id,
  au.email,
  au.created_at as auth_created_at,
  pu.id as profile_id
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ORDER BY au.created_at DESC;

-- Test 7: Check permissions on the function
SELECT 
  routine_schema,
  routine_name,
  grantee,
  privilege_type
FROM information_schema.routine_privileges
WHERE routine_name = 'handle_new_user'
ORDER BY grantee, privilege_type;
