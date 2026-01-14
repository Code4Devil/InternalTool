-- Backfill script: Create profiles for existing auth users who don't have one yet
-- Run this AFTER applying 05_triggers.sql to handle existing users

-- Backfill profiles for all existing auth users
INSERT INTO public.users (id, full_name, avatar_url, created_at, updated_at)
SELECT 
  au.id,
  coalesce(
    au.raw_user_meta_data->>'full_name',
    split_part(au.email, '@', 1),
    'User'
  ) as full_name,
  au.raw_user_meta_data->>'avatar_url' as avatar_url,
  au.created_at,
  now() as updated_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL; -- Only insert for users without profiles

-- Display results
SELECT 
  (SELECT count(*) FROM auth.users) as total_auth_users,
  (SELECT count(*) FROM public.users) as total_profiles,
  (SELECT count(*) FROM auth.users au LEFT JOIN public.users pu ON au.id = pu.id WHERE pu.id IS NULL) as remaining_without_profile;
