-- Sample User Profiles Seed Data
-- IMPORTANT: Create users in Supabase Auth first, then use their UUIDs here

-- ============================================
-- Seed public.users table with test accounts
-- Only insert for users that already exist in auth.users
-- ============================================

-- Insert admin user (from auth.users where email matches)
INSERT INTO public.users (id, email, user_type, is_active)
SELECT id, email, 'admin', TRUE
FROM auth.users
WHERE email = 'admin@inklusifkerja.id'
ON CONFLICT (email) DO UPDATE SET user_type = 'admin', is_active = TRUE;

-- Insert any existing learner users
INSERT INTO public.users (id, email, user_type, is_active)
SELECT id, email, 'learner', TRUE
FROM auth.users
WHERE email = 'learner@example.com'
ON CONFLICT (email) DO UPDATE SET user_type = 'learner', is_active = TRUE;

-- Insert any existing employer users
INSERT INTO public.users (id, email, user_type, is_active)
SELECT id, email, 'employer', TRUE
FROM auth.users
WHERE email = 'employer@example.com'
ON CONFLICT (email) DO UPDATE SET user_type = 'employer', is_active = TRUE;

-- Insert any existing gov users
INSERT INTO public.users (id, email, user_type, is_active)
SELECT id, email, 'gov', TRUE
FROM auth.users
WHERE email = 'gov@example.com'
ON CONFLICT (email) DO UPDATE SET user_type = 'gov', is_active = TRUE;

-- Verify inserted users
SELECT id, email, user_type, is_active, created_at FROM public.users ORDER BY created_at DESC;

-- ============================================
-- Instructions
-- ============================================
-- 1. Create users via Supabase Auth dashboard or API
-- 2. Get their UUIDs from auth.users table
-- 3. Replace 'USER_UUID_HERE' with actual UUIDs
-- 4. Run this script

-- ============================================
-- Sample User Profile 1: Job Seeker
-- ============================================

-- Replace 'USER_UUID_HERE' with actual UUID from auth.users
/*
INSERT INTO public.user_profiles (
  id, full_name, email, phone, address_street, address_city, address_postal_code,
  date_of_birth, national_id, cover_letter, skills, disability_type,
  accommodations, assistive_tech, preferred_salary_min, preferred_salary_max,
  preferred_locations, work_arrangement, created_at, updated_at
) VALUES
(
  'USER_UUID_HERE', -- Replace with actual UUID
  'Budi Santoso',
  'budi.santoso@example.com',
  '081234567890',
  'Jl. Sudirman No. 45',
  'Jakarta Pusat',
  '10220',
  '1990-05-15',
  '3201011505900001',
  'Saya adalah software developer berpengalaman dengan minat pada pengembangan aplikasi web yang aksesibel. Saya telah bekerja selama 5 tahun di berbagai perusahaan teknologi dan memiliki pengalaman luas dalam JavaScript, React, dan Node.js.',
  ARRAY['JavaScript', 'React', 'TypeScript', 'Node.js', 'Git', 'Agile', 'Communication', 'Problem Solving'],
  'Visual Impairment (Tunanetra)',
  ARRAY['Screen reader support', 'Flexible work hours', 'Remote work option'],
  ARRAY['JAWS Screen Reader', 'NVDA'],
  8000000,
  15000000,
  ARRAY['Jakarta Pusat', 'Jakarta Selatan'],
  'hybrid',
  NOW(),
  NOW()
);

-- Work Experience for User 1
INSERT INTO public.work_experience (
  id, user_id, company, position, start_date, end_date, current, description
) VALUES
(
  gen_random_uuid(),
  'USER_UUID_HERE', -- Same UUID as above
  'PT Teknologi Maju',
  'Frontend Developer',
  '2019-01-01',
  '2022-12-31',
  false,
  'Mengembangkan aplikasi web menggunakan React dan TypeScript. Bekerja dalam tim agile untuk mengembangkan fitur-fitur baru dan memperbaiki bug.'
),
(
  gen_random_uuid(),
  'USER_UUID_HERE',
  'PT Digital Innovation',
  'Senior Frontend Developer',
  '2023-01-01',
  NULL,
  true,
  'Memimpin tim frontend dalam pengembangan aplikasi enterprise. Mengimplementasikan best practices untuk aksesibilitas dan performa.'
);

-- Education for User 1
INSERT INTO public.education (
  id, user_id, institution, degree, field, start_date, end_date, current
) VALUES
(
  gen_random_uuid(),
  'USER_UUID_HERE',
  'Universitas Indonesia',
  'Sarjana',
  'Teknik Informatika',
  '2008-09-01',
  '2012-07-31',
  false
);
*/

-- ============================================
-- Sample User Profile 2: Job Seeker
-- ============================================

/*
INSERT INTO public.user_profiles (
  id, full_name, email, phone, address_street, address_city, address_postal_code,
  date_of_birth, national_id, cover_letter, skills, disability_type,
  accommodations, assistive_tech, preferred_salary_min, preferred_salary_max,
  preferred_locations, work_arrangement, created_at, updated_at
) VALUES
(
  'USER_UUID_HERE_2', -- Replace with actual UUID
  'Siti Nurhaliza',
  'siti.nurhaliza@example.com',
  '081987654321',
  'Jl. Thamrin No. 12',
  'Jakarta Pusat',
  '10230',
  '1992-08-20',
  '3201012008920002',
  'Saya adalah data analyst dengan pengalaman dalam analisis data bisnis dan visualisasi. Saya memiliki kemampuan dalam SQL, Python, dan berbagai tools analitik.',
  ARRAY['SQL', 'Python', 'Excel', 'Data Visualization', 'Communication', 'Analytical Thinking'],
  'Visual Impairment (Tunanetra)',
  ARRAY['Screen reader support', 'Flexible hours'],
  ARRAY['NVDA', 'VoiceOver'],
  10000000,
  18000000,
  ARRAY['Jakarta Pusat'],
  'hybrid',
  NOW(),
  NOW()
);

-- Work Experience for User 2
INSERT INTO public.work_experience (
  id, user_id, company, position, start_date, end_date, current, description
) VALUES
(
  gen_random_uuid(),
  'USER_UUID_HERE_2',
  'PT Data Analytics',
  'Data Analyst',
  '2020-03-01',
  '2023-06-30',
  false,
  'Menganalisis data penjualan dan memberikan insights untuk pengambilan keputusan bisnis. Membuat dashboard dan laporan untuk manajemen.'
),
(
  gen_random_uuid(),
  'USER_UUID_HERE_2',
  'PT Business Intelligence',
  'Senior Data Analyst',
  '2023-07-01',
  NULL,
  true,
  'Memimpin proyek analisis data dan mengembangkan model prediktif. Bekerja dengan tim cross-functional untuk memberikan insights strategis.'
);

-- Education for User 2
INSERT INTO public.education (
  id, user_id, institution, degree, field, start_date, end_date, current
) VALUES
(
  gen_random_uuid(),
  'USER_UUID_HERE_2',
  'Institut Teknologi Bandung',
  'Sarjana',
  'Statistika',
  '2010-09-01',
  '2014-07-31',
  false
);
*/

-- ============================================
-- Sample Applications
-- ============================================

-- Create applications after users and jobs exist
/*
INSERT INTO public.applications (
  id, user_id, job_id, status, applied_at, updated_at, rpa_used
) VALUES
(
  gen_random_uuid(),
  'USER_UUID_HERE', -- User UUID
  (SELECT id FROM public.job_listings WHERE source_id = 'kh-001' LIMIT 1), -- Job UUID
  'under-review',
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '2 days',
  true
),
(
  gen_random_uuid(),
  'USER_UUID_HERE',
  (SELECT id FROM public.job_listings WHERE source_id = 'dn-002' LIMIT 1),
  'applied',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days',
  false
);
*/

-- ============================================
-- Sample Employer
-- ============================================

/*
INSERT INTO public.employers (
  id, user_id, company_name, company_type, total_employees,
  employees_with_disabilities, created_at, updated_at
) VALUES
(
  gen_random_uuid(),
  'EMPLOYER_USER_UUID', -- Replace with actual employer user UUID
  'PT Teknologi Indonesia',
  'private',
  1000,
  5,
  NOW(),
  NOW()
);
*/
