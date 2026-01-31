-- Fix RLS Policies for Admin Access
-- Run this in Supabase SQL Editor AFTER running landing-page-schema.sql

-- Drop the restrictive policies and replace with better ones
DROP POLICY IF EXISTS "Only admins can manage landing employers" ON public.landing_employers;
DROP POLICY IF EXISTS "Only admins can manage landing articles" ON public.landing_articles;
DROP POLICY IF EXISTS "Only admins can manage landing values" ON public.landing_values;
DROP POLICY IF EXISTS "Only admins can manage landing statistics" ON public.landing_statistics;
DROP POLICY IF EXISTS "Only admins can manage landing creator profile" ON public.landing_creator_profile;
DROP POLICY IF EXISTS "Only admins can manage landing about" ON public.landing_about;
DROP POLICY IF EXISTS "Only admins can insert landing about" ON public.landing_about;
DROP POLICY IF EXISTS "Only admins can update landing about" ON public.landing_about;
DROP POLICY IF EXISTS "Only admins can delete landing about" ON public.landing_about;
DROP POLICY IF EXISTS "Only admins can manage landing contact" ON public.landing_contact;

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = user_id
    AND (
      (auth.users.raw_user_meta_data->>'user_type')::text = 'admin'
      OR auth.users.email LIKE '%@admin.inklusifkerja.id'
      OR auth.users.email LIKE 'admin@%'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Landing About Policies
CREATE POLICY "About: Public read"
  ON public.landing_about FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "About: Admin read all"
  ON public.landing_about FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "About: Admin insert"
  ON public.landing_about FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "About: Admin update"
  ON public.landing_about FOR UPDATE
  USING (is_admin(auth.uid()));

CREATE POLICY "About: Admin delete"
  ON public.landing_about FOR DELETE
  USING (is_admin(auth.uid()));

-- Landing Statistics Policies
CREATE POLICY "Statistics: Public read"
  ON public.landing_statistics FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Statistics: Admin manage"
  ON public.landing_statistics FOR ALL
  USING (is_admin(auth.uid()));

-- Landing Creator Profile Policies
CREATE POLICY "Creator: Public read"
  ON public.landing_creator_profile FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Creator: Admin manage"
  ON public.landing_creator_profile FOR ALL
  USING (is_admin(auth.uid()));

-- Landing Employers Policies
CREATE POLICY "Employers: Public read active"
  ON public.landing_employers FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Employers: Admin read all"
  ON public.landing_employers FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "Employers: Admin insert"
  ON public.landing_employers FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Employers: Admin update"
  ON public.landing_employers FOR UPDATE
  USING (is_admin(auth.uid()));

CREATE POLICY "Employers: Admin delete"
  ON public.landing_employers FOR DELETE
  USING (is_admin(auth.uid()));

-- Landing Articles Policies
CREATE POLICY "Articles: Public read active"
  ON public.landing_articles FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Articles: Admin read all"
  ON public.landing_articles FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "Articles: Admin insert"
  ON public.landing_articles FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Articles: Admin update"
  ON public.landing_articles FOR UPDATE
  USING (is_admin(auth.uid()));

CREATE POLICY "Articles: Admin delete"
  ON public.landing_articles FOR DELETE
  USING (is_admin(auth.uid()));

-- Landing Values Policies
CREATE POLICY "Values: Public read active"
  ON public.landing_values FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Values: Admin read all"
  ON public.landing_values FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "Values: Admin insert"
  ON public.landing_values FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Values: Admin update"
  ON public.landing_values FOR UPDATE
  USING (is_admin(auth.uid()));

CREATE POLICY "Values: Admin delete"
  ON public.landing_values FOR DELETE
  USING (is_admin(auth.uid()));

-- Landing Contact Policies
CREATE POLICY "Contact: Public read active"
  ON public.landing_contact FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Contact: Admin read all"
  ON public.landing_contact FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "Contact: Admin insert"
  ON public.landing_contact FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Contact: Admin update"
  ON public.landing_contact FOR UPDATE
  USING (is_admin(auth.uid()));

CREATE POLICY "Contact: Admin delete"
  ON public.landing_contact FOR DELETE
  USING (is_admin(auth.uid()));
