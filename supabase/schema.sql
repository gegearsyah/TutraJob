-- Inklusif Kerja Database Schema
-- Supabase PostgreSQL Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Personal Info
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_street TEXT NOT NULL,
  address_city TEXT NOT NULL,
  address_postal_code TEXT NOT NULL,
  date_of_birth DATE,
  national_id TEXT,
  
  -- Professional Info
  cover_letter TEXT,
  cv_file_path TEXT, -- Path to file in storage
  skills TEXT[], -- Array of skills
  certifications TEXT[],
  
  -- Accessibility
  disability_type TEXT,
  accommodations TEXT[],
  assistive_tech TEXT[],
  
  -- Preferences
  preferred_salary_min INTEGER DEFAULT 0,
  preferred_salary_max INTEGER DEFAULT 0,
  preferred_locations TEXT[],
  work_arrangement TEXT CHECK (work_arrangement IN ('remote', 'hybrid', 'on-site')),
  
  CONSTRAINT unique_email UNIQUE(email)
);

-- Work Experience table
CREATE TABLE IF NOT EXISTS public.work_experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education table
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job Listings table
CREATE TABLE IF NOT EXISTS public.job_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  
  -- Location
  location_address TEXT NOT NULL,
  location_city TEXT NOT NULL,
  location_district TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  transjakarta_distance INTEGER, -- in meters
  
  -- Salary
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'IDR',
  salary_period TEXT CHECK (salary_period IN ('monthly', 'yearly')),
  
  -- Job Details
  description TEXT NOT NULL,
  summary TEXT NOT NULL, -- AI-generated summary
  requirements TEXT[],
  benefits TEXT[],
  work_arrangement TEXT CHECK (work_arrangement IN ('remote', 'hybrid', 'on-site')),
  
  -- Accessibility
  accessibility_level TEXT CHECK (accessibility_level IN ('high', 'medium', 'low')),
  accessibility_details TEXT[],
  
  -- Application
  application_url TEXT NOT NULL,
  deadline DATE,
  
  -- Source
  source TEXT NOT NULL, -- 'karirhub', 'dnetwork', etc.
  source_id TEXT NOT NULL,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  
  CONSTRAINT unique_source_job UNIQUE(source, source_id)
);

-- Applications table
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.job_listings(id) ON DELETE CASCADE,
  
  status TEXT NOT NULL CHECK (status IN ('applied', 'under-review', 'interview-scheduled', 'offer-received', 'rejected')),
  
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  interview_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  
  confirmation_id TEXT, -- From RPA submission
  rpa_used BOOLEAN DEFAULT FALSE,
  
  CONSTRAINT unique_user_job_application UNIQUE(user_id, job_id)
);

-- Application Status History
CREATE TABLE IF NOT EXISTS public.application_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  message TEXT
);

-- Employers table
CREATE TABLE IF NOT EXISTS public.employers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_type TEXT CHECK (company_type IN ('private', 'public')),
  total_employees INTEGER DEFAULT 0,
  employees_with_disabilities INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_job_listings_source ON public.job_listings(source, source_id);
CREATE INDEX IF NOT EXISTS idx_job_listings_location ON public.job_listings(location_city);
CREATE INDEX IF NOT EXISTS idx_job_listings_active ON public.job_listings(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_applications_user ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_job ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_work_experience_user ON public.work_experience(user_id);
CREATE INDEX IF NOT EXISTS idx_education_user ON public.education(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own profile
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Work experience policies
CREATE POLICY "Users can manage own work experience"
  ON public.work_experience FOR ALL
  USING (auth.uid() = user_id);

-- Education policies
CREATE POLICY "Users can manage own education"
  ON public.education FOR ALL
  USING (auth.uid() = user_id);

-- Applications policies
CREATE POLICY "Users can view own applications"
  ON public.applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own applications"
  ON public.applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
  ON public.applications FOR UPDATE
  USING (auth.uid() = user_id);

-- Job listings are public (read-only for users)
CREATE POLICY "Job listings are viewable by everyone"
  ON public.job_listings FOR SELECT
  USING (is_active = TRUE);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_listings_updated_at
  BEFORE UPDATE ON public.job_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
