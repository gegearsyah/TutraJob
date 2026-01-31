-- Debug users table and verify trigger
-- Run this to check what's in the users table

-- 1. Check if admin user exists in public.users
SELECT 'ADMIN IN PUBLIC.USERS' as test, id, email, user_type 
FROM public.users 
WHERE email = 'admin@inklusifkerja.id';

-- 2. Check auth.users to get the actual admin ID
SELECT 'ADMIN IN AUTH.USERS' as test, id, email 
FROM auth.users 
WHERE email = 'admin@inklusifkerja.id';

-- 3. Show all users in public.users table
SELECT 'ALL PUBLIC USERS' as test, id, email, user_type, is_active 
FROM public.users 
ORDER BY created_at DESC;

-- 4. Check if trigger exists
SELECT 'TRIGGER INFO' as test, trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- If the records don't exist, manually insert the admin:
-- First get the admin ID from auth.users
WITH admin_user AS (
  SELECT id, email FROM auth.users WHERE email = 'admin@inklusifkerja.id'
)
INSERT INTO public.users (id, email, user_type, is_active)
SELECT id, email, 'admin', TRUE FROM admin_user
ON CONFLICT (email) DO UPDATE SET user_type = 'admin', is_active = TRUE;

-- Verify it was inserted
SELECT 'VERIFY ADMIN' as test, id, email, user_type 
FROM public.users 
WHERE email = 'admin@inklusifkerja.id';
