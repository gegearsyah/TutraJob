-- ============================================
-- CREATE USERS IN SUPABASE AUTH
-- ============================================
-- This script creates users in Supabase Auth
-- Run this BEFORE running seed-auto.sql
--
-- NOTE: Supabase doesn't allow direct SQL inserts into auth.users
-- You have two options:
--
-- OPTION 1: Use Supabase Dashboard (Easiest)
-- 1. Go to: Supabase Dashboard > Authentication > Users
-- 2. Click "Add User" for each user below
-- 3. Use the credentials listed below
--
-- OPTION 2: Use Supabase Management API (Advanced)
-- Use the Supabase client or API to create users programmatically
-- ============================================

-- ============================================
-- USERS TO CREATE
-- ============================================
-- User 1: budi.santoso@example.com
-- Password: Test123!
-- Role: learner (job seeker)
--
-- User 2: sari.wijaya@example.com
-- Password: Test123!
-- Role: learner (job seeker)
--
-- User 3: andi.pratama@example.com
-- Password: Test123!
-- Role: learner (job seeker)
--
-- User 4: pt.tech@example.com
-- Password: Test123!
-- Role: employer
-- ============================================

-- ============================================
-- ALTERNATIVE: Create users via SQL (if you have admin access)
-- ============================================
-- WARNING: This requires direct database access and is not recommended
-- Use Supabase Dashboard instead for security
-- ============================================

-- Check if users already exist
DO $$
DECLARE
  user_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO user_count
  FROM auth.users
  WHERE email IN (
    'budi.santoso@example.com',
    'sari.wijaya@example.com',
    'andi.pratama@example.com',
    'pt.tech@example.com'
  );
  
  IF user_count = 4 THEN
    RAISE NOTICE 'All users already exist! You can now run seed-auto.sql';
  ELSIF user_count > 0 THEN
    RAISE NOTICE 'Some users exist (% out of 4). Please create the missing users.', user_count;
    RAISE NOTICE 'Missing users:';
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'budi.santoso@example.com') THEN
      RAISE NOTICE '  - budi.santoso@example.com';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'sari.wijaya@example.com') THEN
      RAISE NOTICE '  - sari.wijaya@example.com';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'andi.pratama@example.com') THEN
      RAISE NOTICE '  - andi.pratama@example.com';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'pt.tech@example.com') THEN
      RAISE NOTICE '  - pt.tech@example.com';
    END IF;
  ELSE
    RAISE NOTICE 'No users found. Please create users via Supabase Dashboard:';
    RAISE NOTICE '1. Go to: Supabase Dashboard > Authentication > Users';
    RAISE NOTICE '2. Click "Add User" for each user';
    RAISE NOTICE '3. Use the emails and passwords listed in the comments above';
  END IF;
END $$;

-- ============================================
-- QUICK REFERENCE: User Credentials
-- ============================================
-- Email: budi.santoso@example.com | Password: Test123!
-- Email: sari.wijaya@example.com | Password: Test123!
-- Email: andi.pratama@example.com | Password: Test123!
-- Email: pt.tech@example.com | Password: Test123!
-- ============================================
