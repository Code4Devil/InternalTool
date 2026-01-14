# Auto-Create User Profile Trigger

## Overview

This trigger automatically creates a user profile in `public.users` when a new user signs up via Supabase Auth. This eliminates the need for manual profile creation in the application code.

## How It Works

1. **User signs up** → Supabase Auth creates record in `auth.users`
2. **Trigger fires** → `on_auth_user_created` trigger detects the INSERT
3. **Function executes** → `handle_new_user()` function runs
4. **Profile created** → Record inserted into `public.users` with:
   - `id`: Same as auth user ID
   - `full_name`: Extracted from metadata or email prefix
   - `avatar_url`: From OAuth metadata (if available)
   - `created_at`: Current timestamp
   - `updated_at`: Current timestamp

## Files

- **`05_triggers.sql`** - Main trigger and function definition
- **`test_user_trigger.sql`** - Test script to verify trigger
- **`backfill_user_profiles.sql`** - Backfill script for existing users

## Installation

### Step 1: Apply the Trigger

Run in Supabase SQL Editor:

```bash
# Copy and paste content from:
/home/kali/Desktop/InternalTool/db/sql/05_triggers.sql
```

### Step 2: Backfill Existing Users

If you have existing auth users without profiles:

```bash
# Copy and paste content from:
/home/kali/Desktop/InternalTool/db/sql/backfill_user_profiles.sql
```

### Step 3: Verify Installation

```bash
# Copy and paste content from:
/home/kali/Desktop/InternalTool/db/sql/test_user_trigger.sql
```

## Benefits

### Before (Manual Profile Creation)
```javascript
// App code had to manually create profile
const { data, error } = await supabase.auth.signUp({ email, password });
if (data.user) {
  await upsertUserProfile(data.user.id, { ... }); // Manual step
}
```

### After (Automatic)
```javascript
// Profile is created automatically by trigger
const { data, error } = await supabase.auth.signUp({ email, password });
// That's it! Profile already exists in public.users
```

## Advantages

✅ **Automatic** - No manual profile creation needed  
✅ **Reliable** - Runs at database level, can't be skipped  
✅ **Consistent** - Same logic for all signup methods (email, OAuth, etc.)  
✅ **Efficient** - Single database operation  
✅ **Safe** - Uses `ON CONFLICT DO NOTHING` to handle edge cases  

## Data Extraction Logic

```sql
-- Full name priority:
1. raw_user_meta_data->>'full_name'  -- From OAuth or signup metadata
2. split_part(email, '@', 1)         -- Email prefix as fallback
3. 'User'                             -- Last resort default

-- Avatar URL:
- raw_user_meta_data->>'avatar_url'  -- From OAuth providers
- NULL if not available
```

## Edge Cases Handled

1. **Profile already exists** → `ON CONFLICT DO NOTHING` prevents errors
2. **No full_name in metadata** → Uses email prefix
3. **No email** → Falls back to 'User'
4. **Concurrent inserts** → Conflict handling ensures only one profile
5. **OAuth signup** → Automatically captures avatar and name

## Testing

### Test 1: Sign up a new user
```javascript
// In your app
const { data } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'password123',
  options: {
    data: { full_name: 'Test User' }
  }
});
```

### Test 2: Check profile was created
```sql
-- In Supabase SQL Editor
SELECT * FROM public.users 
WHERE id = 'your-user-id';
```

### Test 3: OAuth signup
```javascript
// In your app
await supabase.auth.signInWithOAuth({
  provider: 'google'
});
// Profile automatically includes name and avatar from Google
```

## Troubleshooting

### Issue: Trigger not firing

**Check if trigger exists:**
```sql
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

**Solution:** Run `05_triggers.sql` again

### Issue: Profile not created

**Check function exists:**
```sql
SELECT * FROM pg_proc WHERE proname = 'handle_new_user';
```

**Check permissions:**
```sql
SELECT * FROM information_schema.routine_privileges 
WHERE routine_name = 'handle_new_user';
```

### Issue: Existing users without profiles

**Run backfill:**
```sql
-- Copy content from backfill_user_profiles.sql
```

## Maintenance

### View trigger logs
```sql
-- Check recent users created
SELECT id, full_name, created_at 
FROM public.users 
ORDER BY created_at DESC 
LIMIT 10;
```

### Disable trigger (if needed)
```sql
ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;
```

### Enable trigger
```sql
ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;
```

### Drop trigger (complete removal)
```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
```

## Security

- Function uses `SECURITY DEFINER` - runs with creator's privileges
- `search_path` explicitly set to `public` for security
- Only creates profiles, cannot modify existing ones
- RLS policies still apply to `public.users` table

## Performance

- **Minimal overhead** - Single INSERT operation
- **Indexed** - Primary key lookup is instant
- **Asynchronous** - Doesn't block auth signup
- **Conflict-safe** - No retry logic needed

## Related Documentation

- [Schema Definition](01_schema.sql)
- [RLS Policies](02_policies.sql)
- [Database Setup Guide](../../setup-database.md)
- [Supabase Triggers Documentation](https://supabase.com/docs/guides/database/postgres/triggers)

## Support

For issues or questions:
1. Check the test script results
2. Review Supabase logs in Dashboard → Logs
3. Verify RLS policies are correct
4. Ensure trigger permissions are granted
