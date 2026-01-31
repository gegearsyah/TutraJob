-- Landing Page Seed Data
-- Initial data for landing page content

-- About Us
INSERT INTO public.landing_about (
  title,
  subtitle,
  description,
  why_different_title,
  why_different_items,
  order_index,
  is_active
) VALUES (
  'Tentang Inklusif Kerja',
  'Platform Rekrutmen yang Mudah Diakses untuk Indonesia',
  'Inklusif Kerja adalah platform rekrutmen yang dirancang khusus untuk menghubungkan pencari kerja dengan disabilitas dan perusahaan yang berkomitmen pada inklusi. Kami percaya bahwa setiap orang berhak mendapatkan kesempatan kerja yang sama, terlepas dari kemampuan mereka.

Platform kami menyediakan berbagai fitur aksesibilitas seperti navigasi berbasis gestur, umpan balik audio, dan dukungan screen reader untuk memastikan pengalaman yang inklusif bagi semua pengguna.',
  'Mengapa Kami Berbeda',
  ARRAY[
    '{"title": "Aksesibilitas Penuh", "description": "Platform kami dirancang dengan standar WCAG 2.1 Level AA untuk memastikan aksesibilitas penuh bagi semua pengguna."}',
    '{"title": "Fitur Inovatif", "description": "Navigasi berbasis gestur, umpan balik audio, dan dukungan screen reader yang komprehensif."}',
    '{"title": "Komitmen Inklusi", "description": "Kami berkomitmen untuk menciptakan ekosistem kerja yang benar-benar inklusif untuk semua."}'
  ]::jsonb[],
  0,
  true
) ON CONFLICT DO NOTHING;

-- Statistics
INSERT INTO public.landing_statistics (
  stat_type,
  label_id,
  label_en,
  value,
  icon_name,
  description,
  order_index,
  is_active
) VALUES
  (
    'job_seekers',
    'Pencari Kerja',
    'Job Seekers',
    0,
    'users',
    'Jumlah pencari kerja yang terdaftar di platform',
    0,
    true
  ),
  (
    'job_positions',
    'Lowongan Pekerjaan',
    'Job Positions',
    0,
    'briefcase',
    'Jumlah lowongan pekerjaan yang tersedia',
    1,
    true
  ),
  (
    'employers',
    'Perusahaan',
    'Employers',
    0,
    'building',
    'Jumlah perusahaan mitra',
    2,
    true
  )
ON CONFLICT (stat_type) DO NOTHING;

-- Creator Profile
INSERT INTO public.landing_creator_profile (
  name,
  title,
  bio,
  social_links,
  achievements,
  order_index,
  is_active
) VALUES (
  'Tim Inklusif Kerja',
  'Pengembang Platform Inklusif',
  'Tim kami terdiri dari para profesional yang berkomitmen untuk menciptakan platform rekrutmen yang benar-benar inklusif. Kami percaya bahwa teknologi harus dapat diakses oleh semua orang, dan kami bekerja keras untuk memastikan bahwa platform kami memenuhi standar aksesibilitas tertinggi.',
  '{"linkedin": "https://linkedin.com/company/inklusifkerja", "website": "https://inklusifkerja.id"}'::jsonb,
  ARRAY[
    'WCAG 2.1 Level AA Compliant',
    'Fitur Aksesibilitas Lengkap',
    'Komitmen pada Inklusi'
  ],
  0,
  true
) ON CONFLICT DO NOTHING;

-- Values
INSERT INTO public.landing_values (
  title,
  description,
  icon_name,
  order_index,
  is_active
) VALUES
  (
    'Inklusi',
    'Kami percaya bahwa setiap orang berhak mendapatkan kesempatan kerja yang sama',
    'heart',
    0,
    true
  ),
  (
    'Aksesibilitas',
    'Platform kami dirancang untuk dapat diakses oleh semua orang',
    'shield',
    1,
    true
  ),
  (
    'Inovasi',
    'Kami terus berinovasi untuk memberikan pengalaman terbaik',
    'lightbulb',
    2,
    true
  ),
  (
    'Komitmen',
    'Kami berkomitmen untuk menciptakan ekosistem kerja yang inklusif',
    'target',
    3,
    true
  )
ON CONFLICT DO NOTHING;

-- Contact
INSERT INTO public.landing_contact (
  contact_type,
  label,
  value,
  icon_name,
  order_index,
  is_active
) VALUES
  (
    'email',
    'Email',
    'info@inklusifkerja.id',
    'mail',
    0,
    true
  ),
  (
    'phone',
    'Telepon',
    '+62 21 1234 5678',
    'phone',
    1,
    true
  ),
  (
    'address',
    'Alamat',
    'Jakarta, Indonesia',
    'map-pin',
    2,
    true
  )
ON CONFLICT DO NOTHING;
