-- Check landing_creator_profile table RLS and permissions

-- 1. Check if table exists
SELECT 'TABLE EXISTS' as test, table_name 
FROM information_schema.tables 
WHERE table_name = 'landing_creator_profile';

-- 2. Check RLS status
SELECT 'RLS STATUS' as test, schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'landing_creator_profile';

-- 3. Check RLS policies on landing_creator_profile
SELECT 'RLS POLICIES' as test, policyname, permissive, roles, qual
FROM pg_policies
WHERE tablename = 'landing_creator_profile';

-- 4. Try a simple query as public
SELECT 'SAMPLE DATA' as test, id, name, title FROM public.landing_creator_profile LIMIT 5;

-- If RLS is blocking, disable it temporarily for testing
-- ALTER TABLE public.landing_creator_profile DISABLE ROW LEVEL SECURITY;
