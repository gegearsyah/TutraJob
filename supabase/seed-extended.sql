-- Extended Seed Data for Inklusif Kerja
-- Includes more users, applications, and status history

-- ============================================
-- IMPORTANT: Create users in Supabase Auth first
-- ============================================
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Create users with these emails:
--    - budi.santoso@example.com (password: Test123!)
--    - sari.wijaya@example.com (password: Test123!)
--    - andi.pratama@example.com (password: Test123!)
--    - pt.tech@example.com (password: Test123!) - employer
-- 3. Get their UUIDs from auth.users table
-- 4. Replace USER_UUID_* placeholders below with actual UUIDs
-- 5. Run this script

-- ============================================
-- Extended User Profiles
-- ============================================

-- User 1: Budi Santoso (Software Developer)
-- Replace USER_UUID_1 with actual UUID
/*
INSERT INTO public.user_profiles (
  id, full_name, email, phone, address_street, address_city, address_postal_code,
  date_of_birth, national_id, cover_letter, cv_file_path, skills, disability_type,
  accommodations, assistive_tech, preferred_salary_min, preferred_salary_max,
  preferred_locations, work_arrangement, created_at, updated_at
) VALUES
(
  'USER_UUID_1', -- Replace with actual UUID
  'Budi Santoso',
  'budi.santoso@example.com',
  '081234567890',
  'Jl. Sudirman No. 45',
  'Jakarta Pusat',
  '10220',
  '1990-05-15',
  '3201011505900001',
  'Saya adalah software developer berpengalaman dengan minat pada pengembangan aplikasi web yang aksesibel. Saya telah bekerja selama 5 tahun di berbagai perusahaan teknologi dan memiliki pengalaman luas dalam JavaScript, React, dan Node.js.',
  'cv/USER_UUID_1/budi-santoso-cv.pdf', -- Example CV path
  ARRAY['JavaScript', 'React', 'TypeScript', 'Node.js', 'Git', 'Agile', 'Communication', 'Problem Solving', 'Teamwork'],
  'Visual Impairment (Tunanetra)',
  ARRAY['Screen reader support', 'Flexible work hours', 'Remote work option'],
  ARRAY['JAWS Screen Reader', 'NVDA'],
  8000000,
  15000000,
  ARRAY['Jakarta Pusat', 'Jakarta Selatan'],
  'hybrid',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  skills = EXCLUDED.skills,
  updated_at = NOW();
*/

-- Work Experience for User 1
/*
INSERT INTO public.work_experience (
  user_id, company, position, start_date, end_date, current, description
) VALUES
(
  'USER_UUID_1',
  'PT Digital Solutions',
  'Senior Frontend Developer',
  '2020-01-01',
  '2023-12-31',
  false,
  'Mengembangkan aplikasi web menggunakan React dan TypeScript. Memimpin tim kecil untuk mengembangkan fitur-fitur baru dengan fokus pada aksesibilitas.'
),
(
  'USER_UUID_1',
  'PT Tech Startup',
  'Frontend Developer',
  '2018-06-01',
  '2019-12-31',
  false,
  'Mengembangkan aplikasi web responsif menggunakan React dan Redux. Bekerja sama dengan tim backend untuk integrasi API.'
) ON CONFLICT DO NOTHING;
*/

-- Education for User 1
/*
INSERT INTO public.education (
  user_id, institution, degree, field, start_date, end_date, current
) VALUES
(
  'USER_UUID_1',
  'Universitas Indonesia',
  'Sarjana',
  'Teknik Informatika',
  '2014-08-01',
  '2018-06-30',
  false
) ON CONFLICT DO NOTHING;
*/

-- ============================================
-- User 2: Sari Wijaya (Data Analyst)
-- ============================================
/*
INSERT INTO public.user_profiles (
  id, full_name, email, phone, address_street, address_city, address_postal_code,
  date_of_birth, national_id, cover_letter, cv_file_path, skills, disability_type,
  accommodations, assistive_tech, preferred_salary_min, preferred_salary_max,
  preferred_locations, work_arrangement, created_at, updated_at
) VALUES
(
  'USER_UUID_2', -- Replace with actual UUID
  'Sari Wijaya',
  'sari.wijaya@example.com',
  '081987654321',
  'Jl. Gatot Subroto No. 88',
  'Jakarta Selatan',
  '12930',
  '1992-08-20',
  '3201012008920002',
  'Saya adalah data analyst dengan pengalaman 3 tahun dalam menganalisis data bisnis dan membuat laporan insights. Saya memiliki keahlian dalam SQL, Python, dan data visualization tools.',
  'cv/USER_UUID_2/sari-wijaya-cv.pdf',
  ARRAY['SQL', 'Python', 'Excel', 'Tableau', 'Data Analysis', 'Statistics', 'Communication'],
  'Visual Impairment (Tunanetra)',
  ARRAY['Screen reader support', 'Accessible data visualization tools'],
  ARRAY['JAWS Screen Reader'],
  10000000,
  18000000,
  ARRAY['Jakarta Selatan', 'Jakarta Pusat'],
  'hybrid',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  skills = EXCLUDED.skills,
  updated_at = NOW();
*/

-- Work Experience for User 2
/*
INSERT INTO public.work_experience (
  user_id, company, position, start_date, end_date, current, description
) VALUES
(
  'USER_UUID_2',
  'PT Analytics Pro',
  'Data Analyst',
  '2021-03-01',
  NULL,
  true,
  'Menganalisis data bisnis untuk memberikan insights kepada tim manajemen. Membuat dashboard dan laporan menggunakan Tableau dan Python.'
) ON CONFLICT DO NOTHING;
*/

-- Education for User 2
/*
INSERT INTO public.education (
  user_id, institution, degree, field, start_date, end_date, current
) VALUES
(
  'USER_UUID_2',
  'Institut Teknologi Bandung',
  'Sarjana',
  'Statistika',
  '2015-08-01',
  '2019-06-30',
  false
) ON CONFLICT DO NOTHING;
*/

-- ============================================
-- User 3: Andi Pratama (UI/UX Designer)
-- ============================================
/*
INSERT INTO public.user_profiles (
  id, full_name, email, phone, address_street, address_city, address_postal_code,
  date_of_birth, national_id, cover_letter, cv_file_path, skills, disability_type,
  accommodations, assistive_tech, preferred_salary_min, preferred_salary_max,
  preferred_locations, work_arrangement, created_at, updated_at
) VALUES
(
  'USER_UUID_3', -- Replace with actual UUID
  'Andi Pratama',
  'andi.pratama@example.com',
  '082112345678',
  'Jl. Kuningan No. 12',
  'Jakarta Selatan',
  '12940',
  '1991-11-10',
  '3201011011910003',
  'Saya adalah UI/UX designer dengan fokus pada desain yang aksesibel. Saya memiliki pengalaman 4 tahun dalam merancang antarmuka yang mudah digunakan oleh semua orang, termasuk penyandang disabilitas.',
  'cv/USER_UUID_3/andi-pratama-cv.pdf',
  ARRAY['Figma', 'Adobe XD', 'Sketch', 'UI/UX Design', 'Accessibility Design', 'User Research', 'Prototyping'],
  'Visual Impairment (Tunanetra)',
  ARRAY['Screen reader support', 'High contrast design tools', 'Remote work option'],
  ARRAY['JAWS Screen Reader', 'VoiceOver'],
  9000000,
  16000000,
  ARRAY['Jakarta Selatan'],
  'remote',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  skills = EXCLUDED.skills,
  updated_at = NOW();
*/

-- ============================================
-- Extended Applications with Status History
-- ============================================

-- Application 1: Budi applies for Software Developer position
-- Replace JOB_UUID_1 and USER_UUID_1 with actual UUIDs
/*
INSERT INTO public.applications (
  id, user_id, job_id, status, applied_at, updated_at, rpa_used
) VALUES
(
  gen_random_uuid(),
  'USER_UUID_1',
  'JOB_UUID_1', -- Replace with actual job UUID
  'under-review',
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '2 days',
  true
) ON CONFLICT DO NOTHING
RETURNING id;
*/

-- Status History for Application 1
/*
INSERT INTO public.application_status_history (
  application_id, status, updated_at, message
) VALUES
(
  (SELECT id FROM public.applications WHERE user_id = 'USER_UUID_1' AND job_id = 'JOB_UUID_1' LIMIT 1),
  'applied',
  NOW() - INTERVAL '5 days',
  'Lamaran berhasil dikirim melalui sistem otomatis'
),
(
  (SELECT id FROM public.applications WHERE user_id = 'USER_UUID_1' AND job_id = 'JOB_UUID_1' LIMIT 1),
  'under-review',
  NOW() - INTERVAL '2 days',
  'Lamaran sedang ditinjau oleh tim HR. CV dan portofolio telah diterima.'
) ON CONFLICT DO NOTHING;
*/

-- Application 2: Sari applies for Data Analyst position
/*
INSERT INTO public.applications (
  id, user_id, job_id, status, applied_at, updated_at, rpa_used, interview_date
) VALUES
(
  gen_random_uuid(),
  'USER_UUID_2',
  'JOB_UUID_2', -- Replace with actual job UUID
  'interview-scheduled',
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '1 day',
  false,
  NOW() + INTERVAL '3 days'
) ON CONFLICT DO NOTHING
RETURNING id;
*/

-- Status History for Application 2
/*
INSERT INTO public.application_status_history (
  application_id, status, updated_at, message
) VALUES
(
  (SELECT id FROM public.applications WHERE user_id = 'USER_UUID_2' AND job_id = 'JOB_UUID_2' LIMIT 1),
  'applied',
  NOW() - INTERVAL '7 days',
  'Lamaran berhasil dikirim'
),
(
  (SELECT id FROM public.applications WHERE user_id = 'USER_UUID_2' AND job_id = 'JOB_UUID_2' LIMIT 1),
  'under-review',
  NOW() - INTERVAL '4 days',
  'Lamaran sedang ditinjau. Kualifikasi Anda sesuai dengan kebutuhan posisi.'
),
(
  (SELECT id FROM public.applications WHERE user_id = 'USER_UUID_2' AND job_id = 'JOB_UUID_2' LIMIT 1),
  'interview-scheduled',
  NOW() - INTERVAL '1 day',
  'Wawancara dijadwalkan pada tanggal yang telah ditentukan. Silakan siapkan diri Anda.'
) ON CONFLICT DO NOTHING;
*/

-- Application 3: Andi applies for UI/UX Designer (Rejected)
/*
INSERT INTO public.applications (
  id, user_id, job_id, status, applied_at, updated_at, rpa_used
) VALUES
(
  gen_random_uuid(),
  'USER_UUID_3',
  'JOB_UUID_3', -- Replace with actual job UUID
  'rejected',
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '3 days',
  false
) ON CONFLICT DO NOTHING
RETURNING id;
*/

-- Status History for Application 3
/*
INSERT INTO public.application_status_history (
  application_id, status, updated_at, message
) VALUES
(
  (SELECT id FROM public.applications WHERE user_id = 'USER_UUID_3' AND job_id = 'JOB_UUID_3' LIMIT 1),
  'applied',
  NOW() - INTERVAL '10 days',
  'Lamaran berhasil dikirim'
),
(
  (SELECT id FROM public.applications WHERE user_id = 'USER_UUID_3' AND job_id = 'JOB_UUID_3' LIMIT 1),
  'under-review',
  NOW() - INTERVAL '7 days',
  'Lamaran sedang ditinjau'
),
(
  (SELECT id FROM public.applications WHERE user_id = 'USER_UUID_3' AND job_id = 'JOB_UUID_3' LIMIT 1),
  'rejected',
  NOW() - INTERVAL '3 days',
  'Terima kasih atas minat Anda. Setelah meninjau lamaran Anda, kami memutuskan untuk tidak melanjutkan proses rekrutmen untuk posisi ini. Kami menghargai waktu Anda dan berharap dapat bekerja sama di masa depan.'
) ON CONFLICT DO NOTHING;
*/

-- ============================================
-- More Job Listings
-- ============================================

INSERT INTO public.job_listings (
  title, company, location_address, location_city, location_district,
  salary_min, salary_max, salary_currency, salary_period,
  description, summary, requirements, benefits, work_arrangement,
  accessibility_level, accessibility_details, application_url,
  deadline, source, source_id, is_active, created_at, updated_at
) VALUES
(
  'Frontend Developer',
  'PT Digital Solutions',
  'Jl. Gatot Subroto No. 88',
  'Jakarta Selatan',
  'Kuningan',
  12000000,
  18000000,
  'IDR',
  'monthly',
  'Kami mencari Frontend Developer berpengalaman untuk mengembangkan aplikasi web modern menggunakan React dan TypeScript. Kandidat akan bekerja dalam tim yang dinamis dan inovatif.',
  'Posisi: Frontend Developer di PT Digital Solutions. Gaji: 12 hingga 18 juta Rupiah per bulan. Lokasi: Kuningan, Jakarta Selatan. Aksesibilitas: Tinggi - Dukungan screen reader lengkap, remote work option.',
  ARRAY['Minimal 3 tahun pengalaman', 'Menguasai React, TypeScript, CSS', 'Memahami state management (Redux, Zustand)', 'Pengalaman dengan testing frameworks'],
  ARRAY['BPJS Kesehatan & Ketenagakerjaan', 'Tunjangan transport', 'Remote work option', 'Training budget'],
  'hybrid',
  'high',
  ARRAY['JAWS screen reader compatible', 'Flexible work hours', 'Remote work option available', 'Accessible development tools'],
  'https://example.com/apply/frontend-dev',
  NOW() + INTERVAL '30 days',
  'karirhub',
  'kh-frontend-001',
  true,
  NOW(),
  NOW()
),
(
  'Backend Developer',
  'PT Tech Innovation',
  'Jl. Thamrin No. 100',
  'Jakarta Pusat',
  'Thamrin',
  10000000,
  15000000,
  'IDR',
  'monthly',
  'Mencari Backend Developer untuk mengembangkan API dan sistem backend yang scalable. Kandidat akan bekerja dengan teknologi modern seperti Node.js, Python, atau Go.',
  'Posisi: Backend Developer di PT Tech Innovation. Gaji: 10 hingga 15 juta Rupiah per bulan. Lokasi: Thamrin, Jakarta Pusat. Aksesibilitas: Sedang - Dukungan screen reader tersedia.',
  ARRAY['Minimal 2 tahun pengalaman', 'Menguasai Node.js atau Python', 'Memahami database (PostgreSQL, MongoDB)', 'Pengalaman dengan RESTful API'],
  ARRAY['BPJS', 'Bonus performa', 'Flexible hours'],
  'on-site',
  'medium',
  ARRAY['Screen reader support available', 'Flexible hours'],
  'https://example.com/apply/backend-dev',
  NOW() + INTERVAL '25 days',
  'dnetwork',
  'dn-backend-001',
  true,
  NOW(),
  NOW()
),
(
  'Product Manager',
  'PT Startup Indonesia',
  'Jl. Senopati No. 8',
  'Jakarta Selatan',
  'Senayan',
  15000000,
  25000000,
  'IDR',
  'monthly',
  'Kami mencari Product Manager yang berpengalaman untuk memimpin pengembangan produk digital. Kandidat akan bekerja dengan tim cross-functional dan stakeholders.',
  'Posisi: Product Manager di PT Startup Indonesia. Gaji: 15 hingga 25 juta Rupiah per bulan. Lokasi: Senayan, Jakarta Selatan. Aksesibilitas: Tinggi - Remote work, flexible hours.',
  ARRAY['Minimal 5 tahun pengalaman', 'Memahami product development lifecycle', 'Kemampuan komunikasi dan leadership', 'Pengalaman dengan agile methodology'],
  ARRAY['BPJS', 'Equity options', 'Remote work', 'Unlimited leave'],
  'remote',
  'high',
  ARRAY['Fully remote', 'Flexible work hours', 'Screen reader compatible tools', 'Async communication'],
  'https://example.com/apply/pm',
  NOW() + INTERVAL '20 days',
  'kerjabilitas',
  'kj-pm-001',
  true,
  NOW(),
  NOW()
),
(
  'QA Engineer',
  'PT Quality Assurance',
  'Jl. Rasuna Said No. 5',
  'Jakarta Selatan',
  'Kuningan',
  8000000,
  12000000,
  'IDR',
  'monthly',
  'Mencari QA Engineer untuk melakukan testing dan memastikan kualitas produk. Kandidat akan bekerja dengan tim development untuk mengidentifikasi dan memperbaiki bugs.',
  'Posisi: QA Engineer di PT Quality Assurance. Gaji: 8 hingga 12 juta Rupiah per bulan. Lokasi: Kuningan, Jakarta Selatan. Aksesibilitas: Sedang - Dukungan screen reader tersedia.',
  ARRAY['Minimal 2 tahun pengalaman', 'Memahami testing methodologies', 'Pengalaman dengan automation testing', 'Kemampuan analitis yang baik'],
  ARRAY['BPJS', 'Training opportunities'],
  'hybrid',
  'medium',
  ARRAY['Screen reader support', 'Flexible hours'],
  'https://example.com/apply/qa',
  NOW() + INTERVAL '15 days',
  'karirhub',
  'kh-qa-001',
  true,
  NOW(),
  NOW()
),
(
  'DevOps Engineer',
  'PT Cloud Services',
  'Jl. Sudirman No. 52',
  'Jakarta Pusat',
  'Sudirman',
  13000000,
  20000000,
  'IDR',
  'monthly',
  'Kami mencari DevOps Engineer untuk mengelola infrastruktur cloud dan CI/CD pipelines. Kandidat akan bekerja dengan teknologi seperti AWS, Docker, Kubernetes.',
  'Posisi: DevOps Engineer di PT Cloud Services. Gaji: 13 hingga 20 juta Rupiah per bulan. Lokasi: Sudirman, Jakarta Pusat. Aksesibilitas: Tinggi - Remote work option, accessible tools.',
  ARRAY['Minimal 3 tahun pengalaman', 'Menguasai AWS atau GCP', 'Memahami Docker dan Kubernetes', 'Pengalaman dengan CI/CD tools'],
  ARRAY['BPJS', 'Remote work', 'Cloud certification support'],
  'remote',
  'high',
  ARRAY['Fully remote option', 'Screen reader compatible CLI tools', 'Flexible work hours'],
  'https://example.com/apply/devops',
  NOW() + INTERVAL '28 days',
  'dnetwork',
  'dn-devops-001',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (source, source_id) DO UPDATE SET
  updated_at = NOW(),
  is_active = true;

-- ============================================
-- Employer Profile
-- ============================================

-- Replace EMPLOYER_USER_UUID with actual UUID from auth.users
/*
INSERT INTO public.employers (
  user_id, company_name, company_type, total_employees, employees_with_disabilities,
  created_at, updated_at
) VALUES
(
  'EMPLOYER_USER_UUID', -- Replace with actual UUID
  'PT Teknologi Indonesia',
  'private',
  150,
  12,
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;
*/
