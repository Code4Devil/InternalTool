-- Trigger to automatically create user profile on auth signup
-- This eliminates the need for manual profile creation in the app

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  user_full_name text;
begin
  -- Extract full_name from metadata or use email prefix as fallback
  user_full_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    split_part(new.email, '@', 1),
    'User'
  );

  -- Insert into public.users table
  insert into public.users (id, full_name, avatar_url, created_at, updated_at)
  values (
    new.id,
    user_full_name,
    new.raw_user_meta_data->>'avatar_url',
    now(),
    now()
  )
  on conflict (id) do nothing; -- Gracefully handle if profile already exists

  return new;
end;
$$;

-- Create trigger on auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Grant necessary permissions
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on all tables in schema public to postgres, anon, authenticated, service_role;
grant all on all sequences in schema public to postgres, anon, authenticated, service_role;
grant all on all functions in schema public to postgres, anon, authenticated, service_role;

-- Comment for documentation
comment on function public.handle_new_user() is 
  'Automatically creates a user profile in public.users when a new user signs up via auth.users. Extracts full_name from metadata or uses email prefix as fallback.';
