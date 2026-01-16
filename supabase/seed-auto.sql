-- ============================================
-- AUTO-SEED DATA - Automatically finds user UUIDs by email
-- ============================================
-- This script automatically looks up user UUIDs from auth.users
-- Just create the users in Supabase Auth first, then run this!
--
-- REQUIRED: Create these users in Supabase Auth first:
--   - budi.santoso@example.com (password: Test123!)
--   - sari.wijaya@example.com (password: Test123!)
--   - andi.pratama@example.com (password: Test123!)
--   - pt.tech@example.com (password: Test123!)
-- ============================================

DO $$
DECLARE
  -- Auto-lookup user UUIDs from auth.users
  user_uuid_1 UUID;
  user_uuid_2 UUID;
  user_uuid_3 UUID;
  employer_uuid UUID;
  
  -- Job UUIDs (auto-generated)
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
  
  -- Application UUIDs (auto-generated)
  app_uuid_1 UUID;
  app_uuid_2 UUID;
  app_uuid_3 UUID;
  
  -- Error tracking
  missing_users TEXT[] := ARRAY[]::TEXT[];
BEGIN
  -- ============================================
  -- LOOKUP USER UUIDs FROM auth.users
  -- ============================================
  
  -- Get user UUIDs by email
  SELECT id INTO user_uuid_1
  FROM auth.users
  WHERE email = 'budi.santoso@example.com'
  LIMIT 1;
  
  SELECT id INTO user_uuid_2
  FROM auth.users
  WHERE email = 'sari.wijaya@example.com'
  LIMIT 1;
  
  SELECT id INTO user_uuid_3
  FROM auth.users
  WHERE email = 'andi.pratama@example.com'
  LIMIT 1;
  
  SELECT id INTO employer_uuid
  FROM auth.users
  WHERE email = 'pt.tech@example.com'
  LIMIT 1;
  
  -- Check if all users exist
  IF user_uuid_1 IS NULL THEN
    missing_users := array_append(missing_users, 'budi.santoso@example.com');
  END IF;
  
  IF user_uuid_2 IS NULL THEN
    missing_users := array_append(missing_users, 'sari.wijaya@example.com');
  END IF;
  
  IF user_uuid_3 IS NULL THEN
    missing_users := array_append(missing_users, 'andi.pratama@example.com');
  END IF;
  
  IF employer_uuid IS NULL THEN
    missing_users := array_append(missing_users, 'pt.tech@example.com');
  END IF;
  
  -- Raise error if users are missing with helpful instructions
  IF array_length(missing_users, 1) > 0 THEN
    RAISE EXCEPTION E'Missing users in auth.users. Please create these users first:\n\n'
      E'1. Go to: Supabase Dashboard > Authentication > Users\n'
      E'2. Click "Add User" for each email below\n'
      E'3. Use password: Test123!\n\n'
      E'Missing users: %\n\n'
      E'After creating users, run this script again.\n'
      E'Or run seed-without-users.sql first to create job listings only.',
      array_to_string(missing_users, ', ');
  END IF;
  
  RAISE NOTICE 'Found all users. Starting seed data insertion...';
  RAISE NOTICE 'User 1 (Budi): %', user_uuid_1;
  RAISE NOTICE 'User 2 (Sari): %', user_uuid_2;
  RAISE NOTICE 'User 3 (Andi): %', user_uuid_3;
  RAISE NOTICE 'Employer: %', employer_uuid;
  
  -- ============================================
  -- USER PROFILES
  -- ============================================
  
  -- User 1: Budi Santoso
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

  -- User 2: Sari Wijaya
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

  -- User 3: Andi Pratama
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

  -- Add more jobs (Frontend, Backend, Product Manager, QA, DevOps, Full Stack, Mobile)
  INSERT INTO public.job_listings (
    id, title, company, location_address, location_city, location_district,
    salary_min, salary_max, salary_currency, salary_period,
    description, summary, requirements, benefits, work_arrangement,
    accessibility_level, accessibility_details, application_url,
    deadline, source, source_id, is_active, created_at, updated_at
  ) VALUES
  (gen_random_uuid(), 'Frontend Developer', 'PT Digital Solutions', 'Jl. Gatot Subroto No. 88', 'Jakarta Selatan', 'Kuningan', 12000000, 18000000, 'IDR', 'monthly', 'Frontend Developer untuk aplikasi web modern', 'Frontend Developer - 12-18 juta/bulan', ARRAY['React', 'TypeScript'], ARRAY['BPJS'], 'hybrid', 'high', ARRAY['Screen reader'], 'https://example.com/frontend', NOW() + INTERVAL '30 days', 'karirhub', 'kh-frontend-001', true, NOW(), NOW()),
  (gen_random_uuid(), 'Backend Developer', 'PT Tech Innovation', 'Jl. Thamrin No. 100', 'Jakarta Pusat', 'Thamrin', 10000000, 15000000, 'IDR', 'monthly', 'Backend Developer untuk API scalable', 'Backend Developer - 10-15 juta/bulan', ARRAY['Node.js', 'Python'], ARRAY['BPJS'], 'on-site', 'medium', ARRAY['Screen reader'], 'https://example.com/backend', NOW() + INTERVAL '25 days', 'dnetwork', 'dn-backend-001', true, NOW(), NOW()),
  (gen_random_uuid(), 'Product Manager', 'PT Startup Indonesia', 'Jl. Senopati No. 8', 'Jakarta Selatan', 'Senayan', 15000000, 25000000, 'IDR', 'monthly', 'Product Manager untuk produk digital', 'Product Manager - 15-25 juta/bulan', ARRAY['5+ tahun', 'Agile'], ARRAY['BPJS', 'Equity'], 'remote', 'high', ARRAY['Remote', 'Flexible'], 'https://example.com/pm', NOW() + INTERVAL '20 days', 'kerjabilitas', 'kj-pm-001', true, NOW(), NOW()),
  (gen_random_uuid(), 'QA Engineer', 'PT Quality Assurance', 'Jl. Rasuna Said No. 5', 'Jakarta Selatan', 'Kuningan', 8000000, 12000000, 'IDR', 'monthly', 'QA Engineer untuk testing', 'QA Engineer - 8-12 juta/bulan', ARRAY['Testing', 'Automation'], ARRAY['BPJS'], 'hybrid', 'medium', ARRAY['Screen reader'], 'https://example.com/qa', NOW() + INTERVAL '15 days', 'karirhub', 'kh-qa-001', true, NOW(), NOW()),
  (gen_random_uuid(), 'DevOps Engineer', 'PT Cloud Services', 'Jl. Sudirman No. 52', 'Jakarta Pusat', 'Sudirman', 13000000, 20000000, 'IDR', 'monthly', 'DevOps untuk cloud infrastructure', 'DevOps Engineer - 13-20 juta/bulan', ARRAY['AWS', 'Docker', 'Kubernetes'], ARRAY['BPJS', 'Remote'], 'remote', 'high', ARRAY['Remote', 'CLI tools'], 'https://example.com/devops', NOW() + INTERVAL '28 days', 'dnetwork', 'dn-devops-001', true, NOW(), NOW()),
  (gen_random_uuid(), 'Full Stack Developer', 'PT Web Solutions', 'Jl. Kuningan No. 12', 'Jakarta Selatan', 'Kuningan', 15000000, 22000000, 'IDR', 'monthly', 'Full Stack untuk aplikasi web', 'Full Stack Developer - 15-22 juta/bulan', ARRAY['React', 'Node.js'], ARRAY['BPJS', 'Remote'], 'hybrid', 'high', ARRAY['Remote'], 'https://example.com/fullstack', NOW() + INTERVAL '22 days', 'karirhub', 'kh-fullstack-001', true, NOW(), NOW()),
  (gen_random_uuid(), 'Mobile Developer', 'PT Mobile Apps', 'Jl. Senayan No. 15', 'Jakarta Selatan', 'Senayan', 11000000, 17000000, 'IDR', 'monthly', 'Mobile Developer untuk iOS/Android', 'Mobile Developer - 11-17 juta/bulan', ARRAY['React Native', 'Flutter'], ARRAY['BPJS'], 'hybrid', 'medium', ARRAY['Screen reader'], 'https://example.com/mobile', NOW() + INTERVAL '18 days', 'dnetwork', 'dn-mobile-001', true, NOW(), NOW())
  ON CONFLICT (source, source_id) DO UPDATE SET updated_at = NOW(), is_active = true;

  -- Get job UUIDs for applications (these are not used in this seed, but available if needed)
  SELECT id INTO job_uuid_4 FROM public.job_listings WHERE source_id = 'kh-frontend-001' LIMIT 1;
  SELECT id INTO job_uuid_5 FROM public.job_listings WHERE source_id = 'dn-backend-001' LIMIT 1;
  SELECT id INTO job_uuid_6 FROM public.job_listings WHERE source_id = 'kj-pm-001' LIMIT 1;
  SELECT id INTO job_uuid_7 FROM public.job_listings WHERE source_id = 'kh-qa-001' LIMIT 1;
  SELECT id INTO job_uuid_8 FROM public.job_listings WHERE source_id = 'dn-devops-001' LIMIT 1;
  SELECT id INTO job_uuid_9 FROM public.job_listings WHERE source_id = 'kh-fullstack-001' LIMIT 1;
  SELECT id INTO job_uuid_10 FROM public.job_listings WHERE source_id = 'dn-mobile-001' LIMIT 1;

  -- ============================================
  -- APPLICATIONS
  -- ============================================
  
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

  INSERT INTO public.application_status_history (
    application_id, status, updated_at, message
  ) VALUES
  (app_uuid_1, 'applied', NOW() - INTERVAL '5 days', 'Lamaran berhasil dikirim melalui sistem otomatis'),
  (app_uuid_1, 'under-review', NOW() - INTERVAL '2 days', 'Lamaran sedang ditinjau oleh tim HR. CV dan portofolio telah diterima.')
  ON CONFLICT DO NOTHING;

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

  INSERT INTO public.application_status_history (
    application_id, status, updated_at, message
  ) VALUES
  (app_uuid_2, 'applied', NOW() - INTERVAL '7 days', 'Lamaran berhasil dikirim'),
  (app_uuid_2, 'under-review', NOW() - INTERVAL '4 days', 'Lamaran sedang ditinjau. Kualifikasi Anda sesuai dengan kebutuhan posisi.'),
  (app_uuid_2, 'interview-scheduled', NOW() - INTERVAL '1 day', 'Wawancara dijadwalkan pada tanggal yang telah ditentukan. Silakan siapkan diri Anda.')
  ON CONFLICT DO NOTHING;

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

  INSERT INTO public.application_status_history (
    application_id, status, updated_at, message
  ) VALUES
  (app_uuid_3, 'applied', NOW() - INTERVAL '10 days', 'Lamaran berhasil dikirim'),
  (app_uuid_3, 'under-review', NOW() - INTERVAL '7 days', 'Lamaran sedang ditinjau'),
  (app_uuid_3, 'rejected', NOW() - INTERVAL '3 days', 'Terima kasih atas minat Anda. Setelah meninjau lamaran Anda, kami memutuskan untuk tidak melanjutkan proses rekrutmen untuk posisi ini.')
  ON CONFLICT DO NOTHING;

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

  RAISE NOTICE 'Seed data inserted successfully!';
  RAISE NOTICE 'Created: 3 user profiles, 10 job listings, 3 applications, 1 employer profile';

END $$;
