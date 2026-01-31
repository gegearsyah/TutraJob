-- Clean up duplicate seed data
-- Run this if you ran landing-page-seed.sql multiple times

-- Keep only one "About Us" entry
DELETE FROM public.landing_about 
WHERE id NOT IN (
  SELECT id FROM public.landing_about 
  ORDER BY created_at DESC 
  LIMIT 1
);

-- Keep only one of each statistic
DELETE FROM public.landing_statistics 
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY stat_type ORDER BY created_at DESC) as rn
    FROM public.landing_statistics
  ) ranked
  WHERE rn > 1
);

-- Keep only one creator profile
DELETE FROM public.landing_creator_profile 
WHERE id NOT IN (
  SELECT id FROM public.landing_creator_profile 
  ORDER BY created_at DESC 
  LIMIT 1
);

-- Keep only one of each value (by title)
DELETE FROM public.landing_values 
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY title ORDER BY created_at DESC) as rn
    FROM public.landing_values
  ) ranked
  WHERE rn > 1
);

-- Keep only one of each contact (by contact_type)
DELETE FROM public.landing_contact 
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY contact_type ORDER BY created_at DESC) as rn
    FROM public.landing_contact
  ) ranked
  WHERE rn > 1
);

-- Verify results
SELECT 'About Us' as table_name, COUNT(*) as count FROM public.landing_about
UNION ALL
SELECT 'Statistics', COUNT(*) FROM public.landing_statistics
UNION ALL
SELECT 'Creator Profile', COUNT(*) FROM public.landing_creator_profile
UNION ALL
SELECT 'Values', COUNT(*) FROM public.landing_values
UNION ALL
SELECT 'Contact', COUNT(*) FROM public.landing_contact;
