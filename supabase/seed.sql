-- Inklusif Kerja - Seed Data
-- Run this after creating the schema to populate initial data

-- ============================================
-- Sample Job Listings
-- ============================================

INSERT INTO public.job_listings (
  id, title, company, location_address, location_city, location_district,
  location_lat, location_lng, transjakarta_distance,
  salary_min, salary_max, salary_currency, salary_period,
  description, summary, requirements, benefits, work_arrangement,
  accessibility_level, accessibility_details, application_url,
  source, source_id, is_active, created_at, updated_at
) VALUES
(
  gen_random_uuid(),
  'Software Developer',
  'PT Teknologi Indonesia',
  'Jl. Sudirman No. 123',
  'Jakarta Pusat',
  'Sudirman',
  -6.2088,
  106.8456,
  200,
  8000000,
  12000000,
  'IDR',
  'monthly',
  'Kami mencari Software Developer berpengalaman untuk mengembangkan aplikasi web dan mobile. Kandidat akan bekerja dengan tim yang dinamis dan menggunakan teknologi terbaru.',
  'Posisi: Software Developer di PT Teknologi Indonesia. Gaji: 8 hingga 12 juta Rupiah per bulan. Lokasi: Sudirman, 200 meter dari stasiun TransJakarta. Aksesibilitas: Tinggi - Kompatibel dengan JAWS, jam kerja fleksibel, opsi kerja remote.',
  ARRAY['Minimal 3 tahun pengalaman', 'Menguasai JavaScript, React, Node.js', 'Memahami Git dan Agile methodology'],
  ARRAY['BPJS Kesehatan', 'Tunjangan transport', 'Remote work option'],
  'hybrid',
  'high',
  ARRAY['JAWS screen reader compatible', 'Flexible work hours', 'Remote work option available'],
  'https://example.com/apply/1',
  'karirhub',
  'kh-001',
  true,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Data Analyst',
  'PT Data Insights',
  'Jl. Thamrin No. 45',
  'Jakarta Pusat',
  'Thamrin',
  -6.1944,
  106.8229,
  150,
  10000000,
  15000000,
  'IDR',
  'monthly',
  'Mencari Data Analyst untuk menganalisis data bisnis dan memberikan insights yang actionable. Kandidat akan bekerja dengan berbagai tools analitik.',
  'Posisi: Data Analyst di PT Data Insights. Gaji: 10 hingga 15 juta Rupiah per bulan. Lokasi: Thamrin, 150 meter dari stasiun TransJakarta. Aksesibilitas: Sedang - Dukungan screen reader tersedia.',
  ARRAY['Minimal 2 tahun pengalaman', 'Menguasai SQL, Python, Excel', 'Memahami data visualization tools'],
  ARRAY['BPJS', 'Bonus tahunan', 'Training budget'],
  'on-site',
  'medium',
  ARRAY['Screen reader support available', 'Flexible hours'],
  'https://example.com/apply/2',
  'dnetwork',
  'dn-002',
  true,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Frontend Developer',
  'PT Digital Solutions',
  'Jl. Gatot Subroto No. 88',
  'Jakarta Selatan',
  'Kuningan',
  -6.2297,
  106.8253,
  300,
  12000000,
  18000000,
  'IDR',
  'monthly',
  'Mencari Frontend Developer berpengalaman dengan React dan TypeScript untuk mengembangkan aplikasi web modern dan aksesibel.',
  'Posisi: Frontend Developer di PT Digital Solutions. Gaji: 12 hingga 18 juta Rupiah per bulan. Lokasi: Kuningan, 300 meter dari stasiun TransJakarta. Aksesibilitas: Tinggi - Dukungan screen reader lengkap.',
  ARRAY['React', 'TypeScript', '3+ tahun pengalaman'],
  ARRAY['BPJS', 'Remote work', 'Flexible hours'],
  'hybrid',
  'high',
  ARRAY['Screen reader support', 'Remote option', 'Accessible development tools'],
  'https://example.com/apply/3',
  'karirhub',
  'kh-003',
  true,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Content Writer',
  'PT Media Kreatif',
  'Jl. Kebon Jeruk No. 27',
  'Jakarta Barat',
  'Kebon Jeruk',
  -6.2000,
  106.7833,
  500,
  6000000,
  9000000,
  'IDR',
  'monthly',
  'Mencari Content Writer untuk membuat konten yang menarik dan informatif. Pekerjaan dapat dilakukan secara remote.',
  'Posisi: Content Writer di PT Media Kreatif. Gaji: 6 hingga 9 juta Rupiah per bulan. Lokasi: Kebon Jeruk, 500 meter dari stasiun TransJakarta. Aksesibilitas: Tinggi - Pekerjaan remote, dukungan screen reader.',
  ARRAY['Minimal 2 tahun pengalaman', 'Menguasai bahasa Indonesia dan Inggris', 'Memahami SEO'],
  ARRAY['Remote work', 'Flexible schedule'],
  'remote',
  'high',
  ARRAY['Fully remote', 'Screen reader compatible tools', 'Flexible schedule'],
  'https://example.com/apply/4',
  'kerjabilitas',
  'kj-004',
  true,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Customer Service',
  'PT Layanan Pelanggan',
  'Jl. HR Rasuna Said No. 5',
  'Jakarta Selatan',
  'Kuningan',
  -6.2297,
  106.8253,
  250,
  5000000,
  7000000,
  'IDR',
  'monthly',
  'Mencari Customer Service untuk menangani pertanyaan dan keluhan pelanggan. Training akan diberikan.',
  'Posisi: Customer Service di PT Layanan Pelanggan. Gaji: 5 hingga 7 juta Rupiah per bulan. Lokasi: Kuningan, 250 meter dari stasiun TransJakarta. Aksesibilitas: Sedang - Dukungan screen reader tersedia.',
  ARRAY['Komunikasi baik', 'Sabar dan ramah', 'Menguasai komputer dasar'],
  ARRAY['BPJS', 'Training', 'Bonus'],
  'on-site',
  'medium',
  ARRAY['Screen reader support', 'Training provided'],
  'https://example.com/apply/5',
  'dnetwork',
  'dn-005',
  true,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Backend Developer',
  'PT Cloud Services',
  'Jl. Rasuna Said No. 99',
  'Jakarta Selatan',
  'Kuningan',
  -6.2297,
  106.8253,
  400,
  15000000,
  25000000,
  'IDR',
  'monthly',
  'Mencari Backend Developer untuk mengembangkan API dan sistem backend yang scalable. Kandidat akan bekerja dengan teknologi cloud modern.',
  'Posisi: Backend Developer di PT Cloud Services. Gaji: 15 hingga 25 juta Rupiah per bulan. Lokasi: Kuningan, 400 meter dari stasiun TransJakarta. Aksesibilitas: Tinggi - Remote work, screen reader support.',
  ARRAY['Minimal 4 tahun pengalaman', 'Menguasai Node.js, Python, atau Go', 'Memahami microservices architecture'],
  ARRAY['BPJS', 'Remote work', 'Stock options'],
  'remote',
  'high',
  ARRAY['Fully remote', 'Screen reader compatible tools', 'Flexible schedule'],
  'https://example.com/apply/6',
  'karirhub',
  'kh-006',
  true,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'UI/UX Designer',
  'PT Design Studio',
  'Jl. Kemang Raya No. 12',
  'Jakarta Selatan',
  'Kemang',
  -6.2607,
  106.8106,
  600,
  9000000,
  14000000,
  'IDR',
  'monthly',
  'Mencari UI/UX Designer untuk merancang antarmuka yang aksesibel dan user-friendly. Fokus pada desain inklusif.',
  'Posisi: UI/UX Designer di PT Design Studio. Gaji: 9 hingga 14 juta Rupiah per bulan. Lokasi: Kemang, 600 meter dari stasiun TransJakarta. Aksesibilitas: Tinggi - Fokus pada desain aksesibel, remote option.',
  ARRAY['Minimal 3 tahun pengalaman', 'Menguasai Figma, Adobe XD', 'Memahami prinsip aksesibilitas'],
  ARRAY['BPJS', 'Remote work', 'Design tools provided'],
  'hybrid',
  'high',
  ARRAY['Accessibility-focused design', 'Remote option', 'Screen reader testing tools'],
  'https://example.com/apply/7',
  'kerjabilitas',
  'kj-007',
  true,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Project Manager',
  'PT Manajemen Proyek',
  'Jl. HR Rasuna Said No. 3',
  'Jakarta Selatan',
  'Kuningan',
  -6.2297,
  106.8253,
  200,
  12000000,
  20000000,
  'IDR',
  'monthly',
  'Mencari Project Manager untuk mengelola proyek teknologi dengan fokus pada inklusi dan aksesibilitas.',
  'Posisi: Project Manager di PT Manajemen Proyek. Gaji: 12 hingga 20 juta Rupiah per bulan. Lokasi: Kuningan, 200 meter dari stasiun TransJakarta. Aksesibilitas: Sedang - Flexible hours, screen reader support.',
  ARRAY['Minimal 5 tahun pengalaman', 'PMP atau Scrum Master certified', 'Memahami agile methodology'],
  ARRAY['BPJS', 'Flexible hours', 'Professional development'],
  'hybrid',
  'medium',
  ARRAY['Flexible hours', 'Screen reader support'],
  'https://example.com/apply/8',
  'dnetwork',
  'dn-008',
  true,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Quality Assurance Engineer',
  'PT Quality Assurance',
  'Jl. Sudirman No. 88',
  'Jakarta Pusat',
  'Sudirman',
  -6.2088,
  106.8456,
  150,
  7000000,
  11000000,
  'IDR',
  'monthly',
  'Mencari QA Engineer untuk melakukan testing aplikasi dengan fokus pada aksesibilitas dan usability.',
  'Posisi: Quality Assurance Engineer di PT Quality Assurance. Gaji: 7 hingga 11 juta Rupiah per bulan. Lokasi: Sudirman, 150 meter dari stasiun TransJakarta. Aksesibilitas: Tinggi - Testing tools aksesibel, remote option.',
  ARRAY['Minimal 2 tahun pengalaman', 'Menguasai testing tools', 'Memahami accessibility testing'],
  ARRAY['BPJS', 'Remote work', 'Testing tools'],
  'hybrid',
  'high',
  ARRAY['Accessible testing tools', 'Remote option', 'Screen reader testing'],
  'https://example.com/apply/9',
  'karirhub',
  'kh-009',
  true,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Marketing Specialist',
  'PT Marketing Digital',
  'Jl. Thamrin No. 1',
  'Jakarta Pusat',
  'Thamrin',
  -6.1944,
  106.8229,
  100,
  8000000,
  13000000,
  'IDR',
  'monthly',
  'Mencari Marketing Specialist untuk mengembangkan strategi pemasaran digital yang inklusif.',
  'Posisi: Marketing Specialist di PT Marketing Digital. Gaji: 8 hingga 13 juta Rupiah per bulan. Lokasi: Thamrin, 100 meter dari stasiun TransJakarta. Aksesibilitas: Sedang - Flexible hours, screen reader support.',
  ARRAY['Minimal 3 tahun pengalaman', 'Menguasai digital marketing', 'Memahami SEO dan SEM'],
  ARRAY['BPJS', 'Flexible hours', 'Marketing tools'],
  'hybrid',
  'medium',
  ARRAY['Flexible hours', 'Screen reader support'],
  'https://example.com/apply/10',
  'dnetwork',
  'dn-010',
  true,
  NOW(),
  NOW()
);

-- ============================================
-- Sample Employers
-- ============================================

-- Note: These require actual user IDs from auth.users
-- Replace 'user-employer-1' with actual UUIDs from your auth.users table

-- Example employer (uncomment and replace UUID after creating users):
/*
INSERT INTO public.employers (
  id, user_id, company_name, company_type, total_employees,
  employees_with_disabilities, created_at, updated_at
) VALUES
(
  gen_random_uuid(),
  'user-employer-1', -- Replace with actual user UUID
  'PT Teknologi Indonesia',
  'private',
  1000,
  5,
  NOW(),
  NOW()
);
*/

-- ============================================
-- Sample Accommodation Data (Reference)
-- ============================================

-- This is for reference - accommodations are stored in user_profiles
-- Common accommodation types:
-- Technology: JAWS Screen Reader, NVDA, VoiceOver, Braille Display
-- Physical: Wheelchair accessible, Adjustable desk, Ergonomic keyboard
-- Work Arrangement: Flexible hours, Remote work, Reduced hours

-- ============================================
-- Notes for Seeding
-- ============================================

-- 1. User profiles require authentication first
--    Create users via Supabase Auth, then insert into user_profiles

-- 2. Applications require both user_id and job_id
--    Create users and jobs first, then link them

-- 3. Work experience and education are linked to user_profiles
--    Insert user_profile first, then add related records

-- 4. To seed with real data:
--    a. Create users via Supabase Auth dashboard or API
--    b. Get their UUIDs
--    c. Insert into user_profiles with matching id
--    d. Insert related work_experience and education records

-- Example user profile seed (after creating auth user):
/*
INSERT INTO public.user_profiles (
  id, full_name, email, phone, address_street, address_city, address_postal_code,
  date_of_birth, national_id, cover_letter, skills, disability_type,
  accommodations, assistive_tech, preferred_salary_min, preferred_salary_max,
  preferred_locations, work_arrangement, created_at, updated_at
) VALUES
(
  'user-uuid-here', -- Must match auth.users(id)
  'Budi Santoso',
  'budi@example.com',
  '081234567890',
  'Jl. Contoh No. 123',
  'Jakarta Pusat',
  '10110',
  '1990-01-15',
  '3201011501900001',
  'Saya adalah software developer berpengalaman dengan minat pada pengembangan aplikasi aksesibel.',
  ARRAY['JavaScript', 'React', 'TypeScript', 'Node.js'],
  'Visual Impairment (Tunanetra)',
  ARRAY['Screen reader support', 'Flexible hours'],
  ARRAY['JAWS Screen Reader', 'NVDA'],
  8000000,
  15000000,
  ARRAY['Jakarta Pusat', 'Jakarta Selatan'],
  'hybrid',
  NOW(),
  NOW()
);
*/
