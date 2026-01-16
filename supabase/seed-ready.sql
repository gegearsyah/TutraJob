-- ============================================
-- READY-TO-USE SEED DATA WITH PRE-GENERATED UUIDs
-- ============================================
-- This file contains all seed data with UUIDs already generated.
-- No manual replacement needed - just run this script!
--
-- IMPORTANT: You still need to create users in Supabase Auth first:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Create users with these emails and passwords:
--    - budi.santoso@example.com (password: Test123!)
--    - sari.wijaya@example.com (password: Test123!)
--    - andi.pratama@example.com (password: Test123!)
--    - pt.tech@example.com (password: Test123!) - employer
-- 3. After creating users, update the UUIDs below with the actual UUIDs
--    from auth.users table (or use the provided UUIDs if you create users
--    with these exact emails in the same order)
-- ============================================

-- Pre-generated UUIDs for consistency
-- These are example UUIDs - replace with actual UUIDs from auth.users after creating users
DO $$
DECLARE
  -- User UUIDs (replace these with actual UUIDs from auth.users after creating users)
  user_uuid_1 UUID := '11111111-1111-1111-1111-111111111111'; -- budi.santoso@example.com
  user_uuid_2 UUID := '22222222-2222-2222-2222-222222222222'; -- sari.wijaya@example.com
  user_uuid_3 UUID := '33333333-3333-3333-3333-333333333333'; -- andi.pratama@example.com
  employer_uuid UUID := '44444444-4444-4444-4444-444444444444'; -- pt.tech@example.com
  
  -- Job UUIDs (will be generated)
  job_uuid_1 UUID;
  job_uuid_2 UUID;
  job_uuid_3 UUID;
  job_uuid_4 UUID;
  job_uuid_5 UUID;
  job_uuid_6 UUID;
  job_uuid_7 UUID;
  job_uuid_8 UUID;
  job_uuid_9 UUID;
  job_uuid_10 UUID;
  
  -- Application UUIDs (will be generated)
  app_uuid_1 UUID;
  app_uuid_2 UUID;
  app_uuid_3 UUID;
BEGIN
  -- ============================================
  -- USER PROFILES
  -- ============================================
  
  -- User 1: Budi Santoso (Software Developer)
  INSERT INTO public.user_profiles (
    id, full_name, email, phone, address_street, address_city, address_postal_code,
    date_of_birth, national_id, cover_letter, cv_file_path, skills, disability_type,
    accommodations, assistive_tech, preferred_salary_min, preferred_salary_max,
    preferred_locations, work_arrangement, created_at, updated_at
  ) VALUES (
    user_uuid_1,
    'Budi Santoso',
    'budi.santoso@example.com',
    '081234567890',
    'Jl. Sudirman No. 45',
    'Jakarta Pusat',
    '10220',
    '1990-05-15',
    '3201011505900001',
    'Saya adalah software developer berpengalaman dengan minat pada pengembangan aplikasi web yang aksesibel. Saya telah bekerja selama 5 tahun di berbagai perusahaan teknologi dan memiliki pengalaman luas dalam JavaScript, React, dan Node.js.',
    'cv/' || user_uuid_1::text || '/budi-santoso-cv.pdf',
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

  -- Work Experience for User 1
  INSERT INTO public.work_experience (
    user_id, company, position, start_date, end_date, current, description
  ) VALUES
  (
    user_uuid_1,
    'PT Digital Solutions',
    'Senior Frontend Developer',
    '2020-01-01',
    '2023-12-31',
    false,
    'Mengembangkan aplikasi web menggunakan React dan TypeScript. Memimpin tim kecil untuk mengembangkan fitur-fitur baru dengan fokus pada aksesibilitas.'
  ),
  (
    user_uuid_1,
    'PT Tech Startup',
    'Frontend Developer',
    '2018-06-01',
    '2019-12-31',
    false,
    'Mengembangkan aplikasi web responsif menggunakan React dan Redux. Bekerja sama dengan tim backend untuk integrasi API.'
  ) ON CONFLICT DO NOTHING;

  -- Education for User 1
  INSERT INTO public.education (
    user_id, institution, degree, field, start_date, end_date, current
  ) VALUES (
    user_uuid_1,
    'Universitas Indonesia',
    'Sarjana',
    'Teknik Informatika',
    '2014-08-01',
    '2018-06-30',
    false
  ) ON CONFLICT DO NOTHING;

  -- ============================================
  -- User 2: Sari Wijaya (Data Analyst)
  -- ============================================
  
  INSERT INTO public.user_profiles (
    id, full_name, email, phone, address_street, address_city, address_postal_code,
    date_of_birth, national_id, cover_letter, cv_file_path, skills, disability_type,
    accommodations, assistive_tech, preferred_salary_min, preferred_salary_max,
    preferred_locations, work_arrangement, created_at, updated_at
  ) VALUES (
    user_uuid_2,
    'Sari Wijaya',
    'sari.wijaya@example.com',
    '081987654321',
    'Jl. Gatot Subroto No. 88',
    'Jakarta Selatan',
    '12930',
    '1992-08-20',
    '3201012008920002',
    'Saya adalah data analyst dengan pengalaman 3 tahun dalam menganalisis data bisnis dan membuat laporan insights. Saya memiliki keahlian dalam SQL, Python, dan data visualization tools.',
    'cv/' || user_uuid_2::text || '/sari-wijaya-cv.pdf',
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

  -- Work Experience for User 2
  INSERT INTO public.work_experience (
    user_id, company, position, start_date, end_date, current, description
  ) VALUES (
    user_uuid_2,
    'PT Analytics Pro',
    'Data Analyst',
    '2021-03-01',
    NULL,
    true,
    'Menganalisis data bisnis untuk memberikan insights kepada tim manajemen. Membuat dashboard dan laporan menggunakan Tableau dan Python.'
  ) ON CONFLICT DO NOTHING;

  -- Education for User 2
  INSERT INTO public.education (
    user_id, institution, degree, field, start_date, end_date, current
  ) VALUES (
    user_uuid_2,
    'Institut Teknologi Bandung',
    'Sarjana',
    'Statistika',
    '2015-08-01',
    '2019-06-30',
    false
  ) ON CONFLICT DO NOTHING;

  -- ============================================
  -- User 3: Andi Pratama (UI/UX Designer)
  -- ============================================
  
  INSERT INTO public.user_profiles (
    id, full_name, email, phone, address_street, address_city, address_postal_code,
    date_of_birth, national_id, cover_letter, cv_file_path, skills, disability_type,
    accommodations, assistive_tech, preferred_salary_min, preferred_salary_max,
    preferred_locations, work_arrangement, created_at, updated_at
  ) VALUES (
    user_uuid_3,
    'Andi Pratama',
    'andi.pratama@example.com',
    '082112345678',
    'Jl. Kuningan No. 12',
    'Jakarta Selatan',
    '12940',
    '1991-11-10',
    '3201011011910003',
    'Saya adalah UI/UX designer dengan fokus pada desain yang aksesibel. Saya memiliki pengalaman 4 tahun dalam merancang antarmuka yang mudah digunakan oleh semua orang, termasuk penyandang disabilitas.',
    'cv/' || user_uuid_3::text || '/andi-pratama-cv.pdf',
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

  -- ============================================
  -- JOB LISTINGS
  -- ============================================
  
  -- Job 1: Software Developer
  INSERT INTO public.job_listings (
    id, title, company, location_address, location_city, location_district,
    salary_min, salary_max, salary_currency, salary_period,
    description, summary, requirements, benefits, work_arrangement,
    accessibility_level, accessibility_details, application_url,
    deadline, source, source_id, is_active, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    'Software Developer',
    'PT Teknologi Indonesia',
    'Jl. Sudirman No. 52',
    'Jakarta Pusat',
    'Sudirman',
    10000000,
    15000000,
    'IDR',
    'monthly',
    'Kami mencari Software Developer berpengalaman untuk mengembangkan aplikasi web dan mobile. Kandidat akan bekerja dengan teknologi modern seperti React, Node.js, dan cloud services.',
    'Posisi: Software Developer di PT Teknologi Indonesia. Gaji: 10 hingga 15 juta Rupiah per bulan. Lokasi: Sudirman, Jakarta Pusat. Aksesibilitas: Tinggi - Dukungan screen reader lengkap, remote work option.',
    ARRAY['Minimal 3 tahun pengalaman', 'Menguasai JavaScript/TypeScript', 'Memahami React dan Node.js', 'Pengalaman dengan database'],
    ARRAY['BPJS Kesehatan & Ketenagakerjaan', 'Tunjangan transport', 'Remote work option', 'Training budget'],
    'hybrid',
    'high',
    ARRAY['JAWS screen reader compatible', 'Flexible work hours', 'Remote work option available', 'Accessible development tools'],
    'https://example.com/apply/software-dev',
    NOW() + INTERVAL '30 days',
    'karirhub',
    'kh-software-dev-001',
    true,
    NOW(),
    NOW()
  ) RETURNING id INTO job_uuid_1;

  -- Job 2: Data Analyst
  INSERT INTO public.job_listings (
    id, title, company, location_address, location_city, location_district,
    salary_min, salary_max, salary_currency, salary_period,
    description, summary, requirements, benefits, work_arrangement,
    accessibility_level, accessibility_details, application_url,
    deadline, source, source_id, is_active, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    'Data Analyst',
    'PT Analytics Solutions',
    'Jl. Thamrin No. 100',
    'Jakarta Pusat',
    'Thamrin',
    12000000,
    18000000,
    'IDR',
    'monthly',
    'Mencari Data Analyst untuk menganalisis data bisnis dan memberikan insights strategis. Kandidat akan bekerja dengan tim data science dan business intelligence.',
    'Posisi: Data Analyst di PT Analytics Solutions. Gaji: 12 hingga 18 juta Rupiah per bulan. Lokasi: Thamrin, Jakarta Pusat. Aksesibilitas: Tinggi - Dukungan screen reader, accessible tools.',
    ARRAY['Minimal 2 tahun pengalaman', 'Menguasai SQL dan Python', 'Memahami data visualization', 'Kemampuan analitis yang kuat'],
    ARRAY['BPJS', 'Bonus performa', 'Remote work option', 'Data science training'],
    'hybrid',
    'high',
    ARRAY['Screen reader support', 'Accessible data tools', 'Flexible hours'],
    'https://example.com/apply/data-analyst',
    NOW() + INTERVAL '25 days',
    'dnetwork',
    'dn-data-analyst-001',
    true,
    NOW(),
    NOW()
  ) RETURNING id INTO job_uuid_2;

  -- Job 3: UI/UX Designer
  INSERT INTO public.job_listings (
    id, title, company, location_address, location_city, location_district,
    salary_min, salary_max, salary_currency, salary_period,
    description, summary, requirements, benefits, work_arrangement,
    accessibility_level, accessibility_details, application_url,
    deadline, source, source_id, is_active, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    'UI/UX Designer',
    'PT Design Studio',
    'Jl. Senopati No. 8',
    'Jakarta Selatan',
    'Senayan',
    9000000,
    16000000,
    'IDR',
    'monthly',
    'Kami mencari UI/UX Designer yang berpengalaman dalam merancang antarmuka yang aksesibel dan user-friendly. Kandidat akan bekerja dengan tim product dan development.',
    'Posisi: UI/UX Designer di PT Design Studio. Gaji: 9 hingga 16 juta Rupiah per bulan. Lokasi: Senayan, Jakarta Selatan. Aksesibilitas: Tinggi - Remote work, accessible design tools.',
    ARRAY['Minimal 3 tahun pengalaman', 'Menguasai Figma atau Adobe XD', 'Memahami prinsip aksesibilitas', 'Portfolio yang kuat'],
    ARRAY['BPJS', 'Remote work', 'Design tools subscription', 'Conference budget'],
    'remote',
    'high',
    ARRAY['Fully remote', 'Accessible design tools', 'Screen reader compatible workflow'],
    'https://example.com/apply/uiux-designer',
    NOW() + INTERVAL '20 days',
    'kerjabilitas',
    'kj-uiux-001',
    true,
    NOW(),
    NOW()
  ) RETURNING id INTO job_uuid_3;

  -- Job 4: Frontend Developer
  INSERT INTO public.job_listings (
    id, title, company, location_address, location_city, location_district,
    salary_min, salary_max, salary_currency, salary_period,
    description, summary, requirements, benefits, work_arrangement,
    accessibility_level, accessibility_details, application_url,
    deadline, source, source_id, is_active, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
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
  ) RETURNING id INTO job_uuid_4;

  -- Job 5: Backend Developer
  INSERT INTO public.job_listings (
    id, title, company, location_address, location_city, location_district,
    salary_min, salary_max, salary_currency, salary_period,
    description, summary, requirements, benefits, work_arrangement,
    accessibility_level, accessibility_details, application_url,
    deadline, source, source_id, is_active, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
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
  ) RETURNING id INTO job_uuid_5;

  -- Job 6: Product Manager
  INSERT INTO public.job_listings (
    id, title, company, location_address, location_city, location_district,
    salary_min, salary_max, salary_currency, salary_period,
    description, summary, requirements, benefits, work_arrangement,
    accessibility_level, accessibility_details, application_url,
    deadline, source, source_id, is_active, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
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
  ) RETURNING id INTO job_uuid_6;

  -- Job 7: QA Engineer
  INSERT INTO public.job_listings (
    id, title, company, location_address, location_city, location_district,
    salary_min, salary_max, salary_currency, salary_period,
    description, summary, requirements, benefits, work_arrangement,
    accessibility_level, accessibility_details, application_url,
    deadline, source, source_id, is_active, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
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
  ) RETURNING id INTO job_uuid_7;

  -- Job 8: DevOps Engineer
  INSERT INTO public.job_listings (
    id, title, company, location_address, location_city, location_district,
    salary_min, salary_max, salary_currency, salary_period,
    description, summary, requirements, benefits, work_arrangement,
    accessibility_level, accessibility_details, application_url,
    deadline, source, source_id, is_active, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
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
  ) RETURNING id INTO job_uuid_8;

  -- Job 9: Full Stack Developer
  INSERT INTO public.job_listings (
    id, title, company, location_address, location_city, location_district,
    salary_min, salary_max, salary_currency, salary_period,
    description, summary, requirements, benefits, work_arrangement,
    accessibility_level, accessibility_details, application_url,
    deadline, source, source_id, is_active, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    'Full Stack Developer',
    'PT Web Solutions',
    'Jl. Kuningan No. 12',
    'Jakarta Selatan',
    'Kuningan',
    15000000,
    22000000,
    'IDR',
    'monthly',
    'Mencari Full Stack Developer untuk mengembangkan aplikasi web end-to-end. Kandidat akan bekerja dengan React, Node.js, dan database modern.',
    'Posisi: Full Stack Developer di PT Web Solutions. Gaji: 15 hingga 22 juta Rupiah per bulan. Lokasi: Kuningan, Jakarta Selatan. Aksesibilitas: Tinggi - Remote work, accessible tools.',
    ARRAY['Minimal 4 tahun pengalaman', 'Menguasai React dan Node.js', 'Memahami database design', 'Pengalaman dengan cloud services'],
    ARRAY['BPJS', 'Remote work', 'Tech conference budget', 'Stock options'],
    'hybrid',
    'high',
    ARRAY['Remote work option', 'Screen reader support', 'Flexible hours'],
    'https://example.com/apply/fullstack',
    NOW() + INTERVAL '22 days',
    'karirhub',
    'kh-fullstack-001',
    true,
    NOW(),
    NOW()
  ) RETURNING id INTO job_uuid_9;

  -- Job 10: Mobile Developer
  INSERT INTO public.job_listings (
    id, title, company, location_address, location_city, location_district,
    salary_min, salary_max, salary_currency, salary_period,
    description, summary, requirements, benefits, work_arrangement,
    accessibility_level, accessibility_details, application_url,
    deadline, source, source_id, is_active, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    'Mobile Developer',
    'PT Mobile Apps',
    'Jl. Senayan No. 15',
    'Jakarta Selatan',
    'Senayan',
    11000000,
    17000000,
    'IDR',
    'monthly',
    'Kami mencari Mobile Developer untuk mengembangkan aplikasi iOS dan Android. Kandidat akan bekerja dengan React Native atau Flutter.',
    'Posisi: Mobile Developer di PT Mobile Apps. Gaji: 11 hingga 17 juta Rupiah per bulan. Lokasi: Senayan, Jakarta Selatan. Aksesibilitas: Sedang - Dukungan screen reader tersedia.',
    ARRAY['Minimal 3 tahun pengalaman', 'Menguasai React Native atau Flutter', 'Memahami mobile app architecture', 'Pengalaman dengan app store deployment'],
    ARRAY['BPJS', 'Device allowance', 'App store fees covered'],
    'hybrid',
    'medium',
    ARRAY['Screen reader support', 'Flexible hours'],
    'https://example.com/apply/mobile-dev',
    NOW() + INTERVAL '18 days',
    'dnetwork',
    'dn-mobile-001',
    true,
    NOW(),
    NOW()
  ) RETURNING id INTO job_uuid_10;

  -- ============================================
  -- APPLICATIONS
  -- ============================================
  
  -- Application 1: Budi applies for Software Developer (Job 1)
  INSERT INTO public.applications (
    id, user_id, job_id, status, applied_at, updated_at, rpa_used
  ) VALUES (
    gen_random_uuid(),
    user_uuid_1,
    job_uuid_1,
    'under-review',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '2 days',
    true
  ) RETURNING id INTO app_uuid_1;

  -- Status History for Application 1
  INSERT INTO public.application_status_history (
    application_id, status, updated_at, message
  ) VALUES
  (
    app_uuid_1,
    'applied',
    NOW() - INTERVAL '5 days',
    'Lamaran berhasil dikirim melalui sistem otomatis'
  ),
  (
    app_uuid_1,
    'under-review',
    NOW() - INTERVAL '2 days',
    'Lamaran sedang ditinjau oleh tim HR. CV dan portofolio telah diterima.'
  ) ON CONFLICT DO NOTHING;

  -- Application 2: Sari applies for Data Analyst (Job 2)
  INSERT INTO public.applications (
    id, user_id, job_id, status, applied_at, updated_at, rpa_used, interview_date
  ) VALUES (
    gen_random_uuid(),
    user_uuid_2,
    job_uuid_2,
    'interview-scheduled',
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '1 day',
    false,
    NOW() + INTERVAL '3 days'
  ) RETURNING id INTO app_uuid_2;

  -- Status History for Application 2
  INSERT INTO public.application_status_history (
    application_id, status, updated_at, message
  ) VALUES
  (
    app_uuid_2,
    'applied',
    NOW() - INTERVAL '7 days',
    'Lamaran berhasil dikirim'
  ),
  (
    app_uuid_2,
    'under-review',
    NOW() - INTERVAL '4 days',
    'Lamaran sedang ditinjau. Kualifikasi Anda sesuai dengan kebutuhan posisi.'
  ),
  (
    app_uuid_2,
    'interview-scheduled',
    NOW() - INTERVAL '1 day',
    'Wawancara dijadwalkan pada tanggal yang telah ditentukan. Silakan siapkan diri Anda.'
  ) ON CONFLICT DO NOTHING;

  -- Application 3: Andi applies for UI/UX Designer (Job 3) - Rejected
  INSERT INTO public.applications (
    id, user_id, job_id, status, applied_at, updated_at, rpa_used
  ) VALUES (
    gen_random_uuid(),
    user_uuid_3,
    job_uuid_3,
    'rejected',
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '3 days',
    false
  ) RETURNING id INTO app_uuid_3;

  -- Status History for Application 3
  INSERT INTO public.application_status_history (
    application_id, status, updated_at, message
  ) VALUES
  (
    app_uuid_3,
    'applied',
    NOW() - INTERVAL '10 days',
    'Lamaran berhasil dikirim'
  ),
  (
    app_uuid_3,
    'under-review',
    NOW() - INTERVAL '7 days',
    'Lamaran sedang ditinjau'
  ),
  (
    app_uuid_3,
    'rejected',
    NOW() - INTERVAL '3 days',
    'Terima kasih atas minat Anda. Setelah meninjau lamaran Anda, kami memutuskan untuk tidak melanjutkan proses rekrutmen untuk posisi ini. Kami menghargai waktu Anda dan berharap dapat bekerja sama di masa depan.'
  ) ON CONFLICT DO NOTHING;

  -- ============================================
  -- EMPLOYER PROFILE
  -- ============================================
  
  INSERT INTO public.employers (
    user_id, company_name, company_type, total_employees, employees_with_disabilities,
    created_at, updated_at
  ) VALUES (
    employer_uuid,
    'PT Teknologi Indonesia',
    'private',
    150,
    12,
    NOW(),
    NOW()
  ) ON CONFLICT DO NOTHING;

END $$;

-- ============================================
-- INSTRUCTIONS FOR USE
-- ============================================
-- 1. Create users in Supabase Auth Dashboard:
--    - budi.santoso@example.com
--    - sari.wijaya@example.com
--    - andi.pratama@example.com
--    - pt.tech@example.com
--
-- 2. Get their UUIDs from auth.users table:
--    SELECT id, email FROM auth.users WHERE email IN (
--      'budi.santoso@example.com',
--      'sari.wijaya@example.com',
--      'andi.pratama@example.com',
--      'pt.tech@example.com'
--    );
--
-- 3. Update the UUID variables at the top of this script:
--    - user_uuid_1 = [UUID for budi.santoso@example.com]
--    - user_uuid_2 = [UUID for sari.wijaya@example.com]
--    - user_uuid_3 = [UUID for andi.pratama@example.com]
--    - employer_uuid = [UUID for pt.tech@example.com]
--
-- 4. Run this script in Supabase SQL Editor
-- ============================================
