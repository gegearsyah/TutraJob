-- Landing Page Seed Data - Updated with Multiple Creators
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

-- Creator Profiles (Multiple Creators in Carousel)
INSERT INTO public.landing_creator_profile (
  name,
  title,
  bio,
  image_url,
  social_links,
  achievements,
  order_index,
  is_active
) VALUES
  (
    'Dr. Budi Santoso',
    'Founder & CEO',
    'Visioner platform dengan pengalaman 15+ tahun di sektor teknologi dan inklusi sosial. Budi percaya bahwa teknologi harus dapat diakses oleh semua orang tanpa terkecuali.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    '{"linkedin": "https://linkedin.com/in/budisantoso", "twitter": "https://twitter.com/budisantoso", "website": "https://budisantoso.id"}'::jsonb,
    ARRAY[
      'Founder Inklusif Kerja',
      '15+ tahun di Tech Industry',
      'WCAG 2.1 Expert',
      'Social Entrepreneur'
    ],
    0,
    true
  ),
  (
    'Siti Nurhaliza',
    'Chief Product Officer',
    'Spesialis UX/UI dengan fokus pada aksesibilitas. Siti telah memimpin pengembangan fitur-fitur inovatif yang memudahkan pengguna dengan berbagai disabilitas.',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    '{"linkedin": "https://linkedin.com/in/sitinurhaliza", "github": "https://github.com/sitinurhaliza"}'::jsonb,
    ARRAY[
      'CPO Inklusif Kerja',
      'UX/UI Designer',
      'Accessibility Advocate',
      'WCAG 2.1 AA Certified'
    ],
    1,
    true
  ),
  (
    'Ahmad Wijaya',
    'Chief Technology Officer',
    'Engineer berpengalaman dengan track record mengembangkan platform scalable. Ahmad memastikan teknologi kami robust dan dapat diandalkan oleh jutaan pengguna.',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    '{"linkedin": "https://linkedin.com/in/ahmadwijaya", "github": "https://github.com/ahmadwijaya"}'::jsonb,
    ARRAY[
      'CTO Inklusif Kerja',
      'Full Stack Engineer',
      'Cloud Architecture Expert',
      '10+ tahun Experience'
    ],
    2,
    true
  ),
  (
    'Rini Kartika',
    'Head of Community',
    'Pendidik dan community builder yang berdedikasi untuk memberdayakan pencari kerja dengan disabilitas. Rini membangun hubungan kuat dengan pengguna platform.',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    '{"linkedin": "https://linkedin.com/in/rinikartika", "twitter": "https://twitter.com/rinikartika"}'::jsonb,
    ARRAY[
      'Head of Community',
      'Disability Rights Advocate',
      'Counselor & Trainer',
      'Community Builder'
    ],
    3,
    true
  )
ON CONFLICT DO NOTHING;

-- Employers (Placeholder Partners)
INSERT INTO public.landing_employers (
  company_name,
  logo_url,
  description,
  website_url,
  industry,
  employee_count,
  location,
  is_featured,
  order_index,
  is_active
) VALUES
  (
    'PT Sinar Akses Nusantara',
    'https://placehold.co/240x120?text=Sinar+Akses',
    'Perusahaan teknologi yang berfokus pada aksesibilitas digital.',
    'https://example.com/sinar-akses',
    'Technology',
    120,
    'Jakarta, Indonesia',
    true,
    0,
    true
  ),
  (
    'CV Karya Inklusif',
    'https://placehold.co/240x120?text=Karya+Inklusif',
    'Mitra pelatihan dan penempatan kerja inklusif.',
    'https://example.com/karya-inklusif',
    'Education',
    80,
    'Bandung, Indonesia',
    true,
    1,
    true
  ),
  (
    'Nusa Finance',
    'https://placehold.co/240x120?text=Nusa+Finance',
    'Layanan keuangan dengan program rekrutmen ramah disabilitas.',
    'https://example.com/nusa-finance',
    'Finance',
    300,
    'Surabaya, Indonesia',
    false,
    2,
    true
  ),
  (
    'Ruang Kreatif Studio',
    'https://placehold.co/240x120?text=Ruang+Kreatif',
    'Studio kreatif yang membuka kesempatan kerja inklusif.',
    'https://example.com/ruang-kreatif',
    'Creative',
    45,
    'Yogyakarta, Indonesia',
    false,
    3,
    true
  ),
  (
    'Sehat Sentra',
    'https://placehold.co/240x120?text=Sehat+Sentra',
    'Penyedia layanan kesehatan dengan program karir inklusif.',
    'https://example.com/sehat-sentra',
    'Healthcare',
    210,
    'Semarang, Indonesia',
    true,
    4,
    true
  ),
  (
    'LogiMove',
    'https://placehold.co/240x120?text=LogiMove',
    'Perusahaan logistik dengan budaya kerja setara.',
    'https://example.com/logimove',
    'Logistics',
    150,
    'Makassar, Indonesia',
    false,
    5,
    true
  ),
  (
    'EduSkill Academy',
    'https://placehold.co/240x120?text=EduSkill',
    'Akademi pelatihan yang menyiapkan talenta inklusif.',
    'https://example.com/eduskill',
    'Education',
    60,
    'Medan, Indonesia',
    false,
    6,
    true
  ),
  (
    'GreenWorks',
    'https://placehold.co/240x120?text=GreenWorks',
    'Perusahaan manufaktur berkelanjutan dengan rekrutmen inklusif.',
    'https://example.com/greenworks',
    'Manufacturing',
    420,
    'Bekasi, Indonesia',
    true,
    7,
    true
  )
ON CONFLICT DO NOTHING;

-- Articles & Testimonials (Examples)
INSERT INTO public.landing_articles (
  type,
  title,
  content,
  author_name,
  author_title,
  author_image_url,
  image_url,
  category,
  published_at,
  is_featured,
  order_index,
  is_active
) VALUES
  (
    'info',
    '5 Tips Mempersiapkan Wawancara Kerja yang Inklusif',
    'Pelajari cara menyiapkan portofolio, menjelaskan kebutuhan aksesibilitas, dan membangun kepercayaan diri saat wawancara kerja.',
    NULL,
    NULL,
    NULL,
    'https://placehold.co/800x450?text=Artikel+1',
    'career_tips',
    NOW() - INTERVAL '10 days',
    true,
    0,
    true
  ),
  (
    'info',
    'Cara Menulis CV yang Ramah Aksesibilitas',
    'Gunakan format yang bersih, struktur yang jelas, dan highlight keterampilan utama untuk meningkatkan peluang dipanggil interview.',
    NULL,
    NULL,
    NULL,
    'https://placehold.co/800x450?text=Artikel+2',
    'career_tips',
    NOW() - INTERVAL '7 days',
    false,
    1,
    true
  ),
  (
    'info',
    'Membangun Budaya Kerja Inklusif di Perusahaan',
    'Perusahaan dapat memulai dari kebijakan rekrutmen, pelatihan, dan penyediaan fasilitas kerja yang inklusif.',
    NULL,
    NULL,
    NULL,
    'https://placehold.co/800x450?text=Artikel+3',
    'accessibility',
    NOW() - INTERVAL '3 days',
    false,
    2,
    true
  ),
  (
    'testimonial',
    'Testimoni Pengguna',
    'Saya merasa diterima dan didukung penuh selama proses rekrutmen. Platform ini benar-benar memudahkan saya.',
    'Andi Pratama',
    'Graphic Designer',
    'https://placehold.co/120x120?text=AP',
    NULL,
    'success_story',
    NOW() - INTERVAL '15 days',
    true,
    3,
    true
  ),
  (
    'testimonial',
    'Testimoni Pengguna',
    'Fitur aksesibilitasnya membantu saya fokus pada kemampuan, bukan keterbatasan.',
    'Maya Sari',
    'Customer Support',
    'https://placehold.co/120x120?text=MS',
    NULL,
    'success_story',
    NOW() - INTERVAL '20 days',
    false,
    4,
    true
  )
ON CONFLICT DO NOTHING;

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
