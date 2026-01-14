# Authentication Debug Guide

## Changes Made

1. **Enhanced error handling in LoginForm**
   - Added console logging for each step
   - Better error messages
   - Proper async/await handling

2. **Enhanced redirectBasedOnRole function**
   - Added console logging
   - Using `replace: true` for navigation to prevent back button issues

3. **Enhanced handleAuthSuccess function**
   - Ensures user profile is created/updated
   - Better error handling
   - Comprehensive logging

## How to Test

1. **Open Browser Console** (F12)
2. **Try to login** with your credentials
3. **Watch for these console messages:**
   - "Attempting login with email: ..."
   - "Login successful: ..." (with user data)
   - "Session established, calling onSuccess"
   - "User authenticated: ..." (with user data and role)
   - "Redirecting based on role: ..."
   - "Redirecting to ..."

## Common Issues & Solutions

### Issue 1: Login succeeds but no redirect
**Symptoms:** Console shows "Login successful" but doesn't redirect
**Cause:** `onSuccess` callback not being called or failing
**Solution:** Check console for errors in `handleAuthSuccess`

### Issue 2: Redirects back to login
**Symptoms:** Briefly redirects but comes back to login page
**Cause:** ProtectedRoute can't find session
**Solution:** Check if session is persisted in localStorage

### Issue 3: User has no role
**Symptoms:** Console shows "role: member" for all users
**Cause:** User not assigned to any project
**Solution:** Need to create a project and assign user

## Manual Session Check

Run this in browser console:
```javascript
// Check if session exists
const checkSession = async () => {
  const { data: { session } } = await window.supabase.auth.getSession()
  console.log('Current session:', session)
}
checkSession()
```

## Creating a Test User with Role

You need to:
1. Create a project in your database
2. Assign the user to that project with a role

SQL to run in Supabase SQL Editor:
```sql
-- Create a test project
INSERT INTO projects (name, description, owner_id, status)
VALUES ('Test Project', 'Test project for user', (SELECT id FROM users LIMIT 1), 'active');

-- Assign user to project as admin
INSERT INTO project_members (project_id, user_id, role)
VALUES (
  (SELECT id FROM projects WHERE name = 'Test Project'),
  (SELECT id FROM users LIMIT 1),
  'admin'
);
```

## Check Database

1. Go to Supabase Dashboard → Table Editor
2. Check `users` table - verify your user exists
3. Check `projects` table - verify at least one project exists
4. Check `project_members` table - verify your user is assigned to a project with a role

## Next Steps

If login still doesn't redirect:
1. Check the console logs and share them
2. Verify .env file has correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
3. Restart dev server: `npm run dev`
4. Clear browser cache and localStorage
5. Try in incognito/private browsing mode
