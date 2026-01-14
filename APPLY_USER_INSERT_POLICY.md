# Apply User Profile INSERT Policy

## What Changed

Added RLS policy `users_insert_self` to allow authenticated users to create their own profile in the `public.users` table.

## How to Apply

### Option 1: Run the entire policies file (Recommended for fresh setup)

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the entire content of `/db/sql/02_policies.sql`
4. Click **Run**

### Option 2: Add only the new policy (For existing database)

Run this SQL in your Supabase SQL Editor:

```sql
-- Add INSERT policy for users to create their own profile
create policy users_insert_self
  on public.users for insert
  with check ( id = auth.uid() );
```

## Verify the Policy

After applying, run the test script to verify:

```bash
# Copy the test script
cat /home/kali/Desktop/InternalTool/db/sql/test_users_insert_policy.sql
```

Then paste and run it in Supabase SQL Editor.

## Expected Behavior

✅ **Before**: Users got 403 Forbidden when trying to upsert their profile  
✅ **After**: Users can create their own profile on first login  

The policy ensures:
- Users can only INSERT records where `id = auth.uid()` (their own user ID)
- Users cannot create profiles for other users
- Works seamlessly with the `upsertUserProfile()` function in the app

## Test in Your App

1. Sign out from your application
2. Clear browser storage (localStorage)
3. Sign up with a new account or sign in with existing account
4. Check browser console - should see "User profile not found, creating..."
5. Profile should be created successfully without errors
6. User data should appear in navbar

## Troubleshooting

If you still get errors:

1. **Check if policy exists:**
```sql
SELECT * FROM pg_policies WHERE tablename = 'users' AND policyname = 'users_insert_self';
```

2. **Check RLS is enabled:**
```sql
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'users';
```

3. **Verify user is authenticated:**
```sql
SELECT auth.uid(), auth.role();
```

## Related Files

- **Policy Definition**: `/db/sql/02_policies.sql`
- **Schema**: `/db/sql/01_schema.sql`
- **Test Script**: `/db/sql/test_users_insert_policy.sql`
- **App Function**: `/src/lib/supabase.js` → `upsertUserProfile()`
