-- Test script to verify users_insert_self policy
-- Run this in Supabase SQL Editor after applying the policy

-- This test assumes you have an authenticated user session
-- You can run this as a specific user to test

-- Test 1: Try to insert your own profile (should succeed)
-- Replace the UUID with your actual auth.uid()
DO $$
DECLARE
  test_user_id uuid;
BEGIN
  -- Get current authenticated user ID
  test_user_id := auth.uid();
  
  IF test_user_id IS NULL THEN
    RAISE NOTICE 'No authenticated user. Please run this in an authenticated context.';
  ELSE
    -- Try to insert profile for current user (should succeed)
    INSERT INTO public.users (id, full_name, avatar_url)
    VALUES (test_user_id, 'Test User', NULL)
    ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;
    
    RAISE NOTICE 'Successfully inserted/updated profile for user: %', test_user_id;
  END IF;
END $$;

-- Test 2: Verify the user can read their own profile
SELECT id, full_name, avatar_url, created_at
FROM public.users
WHERE id = auth.uid();

-- Test 3: Check all policies on users table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;
