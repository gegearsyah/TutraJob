-- Complete User Setup: Create all roles in auth.users and public.users
-- Run this step-by-step in Supabase SQL Editor

-- ============================================
-- STEP 1: Seed public.users table from existing auth.users
-- ============================================

-- Admin user
INSERT INTO public.users (id, email, user_type, is_active)
SELECT id, email, 'admin', TRUE
FROM auth.users
WHERE email = 'admin@inklusifkerja.id'
ON CONFLICT (email) DO UPDATE SET user_type = 'admin', is_active = TRUE;

-- Learner user(s)
INSERT INTO public.users (id, email, user_type, is_active)
SELECT id, email, 'learner', TRUE
FROM auth.users
WHERE email LIKE '%learner%' AND email NOT IN (SELECT email FROM public.users)
ON CONFLICT (email) DO UPDATE SET user_type = 'learner', is_active = TRUE;

-- Employer user(s)
INSERT INTO public.users (id, email, user_type, is_active)
SELECT id, email, 'employer', TRUE
FROM auth.users
WHERE email LIKE '%employer%' AND email NOT IN (SELECT email FROM public.users)
ON CONFLICT (email) DO UPDATE SET user_type = 'employer', is_active = TRUE;

-- Gov user(s)
INSERT INTO public.users (id, email, user_type, is_active)
SELECT id, email, 'gov', TRUE
FROM auth.users
WHERE email LIKE '%gov%' AND email NOT IN (SELECT email FROM public.users)
ON CONFLICT (email) DO UPDATE SET user_type = 'gov', is_active = TRUE;

-- ============================================
-- STEP 2: Verify all users are created
-- ============================================
SELECT 'PUBLIC.USERS TABLE' as section, id, email, user_type, is_active, created_at
FROM public.users
ORDER BY user_type, created_at DESC;

-- Show auth users that don't have public.users records yet
SELECT 'MISSING FROM PUBLIC.USERS' as section, id, email
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ORDER BY email;
