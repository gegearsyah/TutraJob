-- Script untuk membuat user admin di Supabase
-- Jalankan di Supabase SQL Editor

-- GANTI EMAIL DAN PASSWORD DI BAWAH INI
-- Email admin
\set admin_email 'admin@inklusifkerja.id'

-- Password (akan di-hash otomatis)
-- Catatan: Untuk production, gunakan password yang kuat!
\set admin_password 'Admin123!@#'

-- Method 1: Menggunakan Supabase Auth Functions (Recommended)
-- Catatan: Ini hanya contoh. Untuk production, gunakan Supabase Dashboard atau Admin API

-- Method 2: Update existing user menjadi admin
-- Jika Anda sudah punya user, jalankan query ini untuk mengubahnya menjadi admin:

-- UPDATE auth.users
-- SET raw_user_meta_data = jsonb_set(
--   COALESCE(raw_user_meta_data, '{}'::jsonb),
--   '{user_type}',
--   '"admin"'
-- )
-- WHERE email = 'admin@inklusifkerja.id';

-- Method 3: Check existing admin users
-- Query untuk melihat semua user admin:

SELECT 
  id,
  email,
  raw_user_meta_data->>'user_type' as user_type,
  created_at,
  email_confirmed_at
FROM auth.users
WHERE raw_user_meta_data->>'user_type' = 'admin'
   OR email LIKE '%admin%'
ORDER BY created_at DESC;

-- Method 4: Create admin user via Supabase Dashboard (Easiest)
-- 1. Buka Supabase Dashboard → Authentication → Users
-- 2. Klik "Add User" → "Create new user"
-- 3. Isi email dan password
-- 4. Set "Auto Confirm User" = true
-- 5. Set User Metadata: {"user_type": "admin"}
-- 6. Save

-- Method 5: Update user metadata untuk user yang sudah ada
-- Ganti 'user@example.com' dengan email user yang ingin dijadikan admin:

-- UPDATE auth.users
-- SET raw_user_meta_data = jsonb_set(
--   COALESCE(raw_user_meta_data, '{}'::jsonb),
--   '{user_type}',
--   '"admin"'
-- )
-- WHERE email = 'user@example.com';

-- Verifikasi: Check if user is admin
-- SELECT 
--   email,
--   raw_user_meta_data->>'user_type' as role
-- FROM auth.users
-- WHERE email = 'admin@inklusifkerja.id';
