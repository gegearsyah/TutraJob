-- Fix RLS policies on users table
-- The previous policies had circular dependencies

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own record" ON public.users;
DROP POLICY IF EXISTS "Admins can read all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update users" ON public.users;

-- Allow all authenticated users to read the users table
-- (This is needed for role lookups)
CREATE POLICY "Authenticated users can read users" ON public.users
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Allow admins (determined by user_type) to update users
CREATE POLICY "Admins can update users" ON public.users
  FOR UPDATE
  USING (
    (SELECT user_type FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Allow service role (used in server functions) to do everything
-- This is handled by Supabase automatically for service role
