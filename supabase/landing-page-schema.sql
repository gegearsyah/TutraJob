-- Landing Page Content Schema
-- Tables for managing landing page content (About Us, Statistics, Creator Profile, Employers, Articles, Values, Contact)

-- About Us & Why We're Different
CREATE TABLE IF NOT EXISTS public.landing_about (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  why_different_title TEXT,
  why_different_items JSONB[], -- Array of {title, description} objects
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Statistics
CREATE TABLE IF NOT EXISTS public.landing_statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stat_type TEXT NOT NULL CHECK (stat_type IN ('job_seekers', 'job_positions', 'employers')),
  label_id TEXT NOT NULL, -- 'job_seekers', 'job_positions', 'employers'
  label_en TEXT NOT NULL,
  value INTEGER NOT NULL DEFAULT 0,
  icon_name TEXT, -- Icon identifier
  description TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  CONSTRAINT unique_stat_type UNIQUE(stat_type)
);

-- Creator Profile
CREATE TABLE IF NOT EXISTS public.landing_creator_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT NOT NULL,
  image_url TEXT,
  social_links JSONB, -- {linkedin, twitter, github, website, etc.}
  achievements TEXT[],
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Partner Employers (List of Employers)
CREATE TABLE IF NOT EXISTS public.landing_employers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  website_url TEXT,
  industry TEXT,
  employee_count INTEGER,
  location TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Articles (Infos & Testimonials)
CREATE TABLE IF NOT EXISTS public.landing_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('info', 'testimonial')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT, -- For testimonials
  author_title TEXT, -- For testimonials
  author_image_url TEXT, -- For testimonials
  image_url TEXT, -- For info articles
  category TEXT, -- e.g., 'career_tips', 'accessibility', 'success_story'
  published_at TIMESTAMP WITH TIME ZONE,
  is_featured BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Organization Values
CREATE TABLE IF NOT EXISTS public.landing_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT, -- Icon identifier
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Contact Information
CREATE TABLE IF NOT EXISTS public.landing_contact (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_type TEXT NOT NULL CHECK (contact_type IN ('email', 'phone', 'address', 'social')),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  icon_name TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_landing_about_active ON public.landing_about(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_landing_statistics_active ON public.landing_statistics(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_landing_creator_active ON public.landing_creator_profile(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_landing_employers_active ON public.landing_employers(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_landing_articles_active ON public.landing_articles(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_landing_articles_type ON public.landing_articles(type);
CREATE INDEX IF NOT EXISTS idx_landing_values_active ON public.landing_values(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_landing_contact_active ON public.landing_contact(is_active) WHERE is_active = TRUE;

-- Row Level Security (RLS) Policies
-- All landing page content is publicly readable
ALTER TABLE public.landing_about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_creator_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_contact ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Landing about is viewable by everyone"
  ON public.landing_about FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Landing statistics is viewable by everyone"
  ON public.landing_statistics FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Landing creator profile is viewable by everyone"
  ON public.landing_creator_profile FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Landing employers is viewable by everyone"
  ON public.landing_employers FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Landing articles is viewable by everyone"
  ON public.landing_articles FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Landing values is viewable by everyone"
  ON public.landing_values FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Landing contact is viewable by everyone"
  ON public.landing_contact FOR SELECT
  USING (is_active = TRUE);

-- Admin-only write access (will be checked in application layer)
CREATE POLICY "Only admins can insert landing about"
  ON public.landing_about FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'user_type')::text = 'admin'
    )
  );

CREATE POLICY "Only admins can update landing about"
  ON public.landing_about FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'user_type')::text = 'admin'
    )
  );

CREATE POLICY "Only admins can delete landing about"
  ON public.landing_about FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'user_type')::text = 'admin'
    )
  );

-- Similar policies for other tables
CREATE POLICY "Only admins can manage landing statistics"
  ON public.landing_statistics FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'user_type')::text = 'admin'
    )
  );

CREATE POLICY "Only admins can manage landing creator profile"
  ON public.landing_creator_profile FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'user_type')::text = 'admin'
    )
  );

CREATE POLICY "Only admins can manage landing employers"
  ON public.landing_employers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'user_type')::text = 'admin'
    )
  );

CREATE POLICY "Only admins can manage landing articles"
  ON public.landing_articles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'user_type')::text = 'admin'
    )
  );

CREATE POLICY "Only admins can manage landing values"
  ON public.landing_values FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'user_type')::text = 'admin'
    )
  );

CREATE POLICY "Only admins can manage landing contact"
  ON public.landing_contact FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'user_type')::text = 'admin'
    )
  );

-- Triggers for updated_at
CREATE TRIGGER update_landing_about_updated_at
  BEFORE UPDATE ON public.landing_about
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_landing_statistics_updated_at
  BEFORE UPDATE ON public.landing_statistics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_landing_creator_profile_updated_at
  BEFORE UPDATE ON public.landing_creator_profile
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_landing_employers_updated_at
  BEFORE UPDATE ON public.landing_employers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_landing_articles_updated_at
  BEFORE UPDATE ON public.landing_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_landing_values_updated_at
  BEFORE UPDATE ON public.landing_values
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_landing_contact_updated_at
  BEFORE UPDATE ON public.landing_contact
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
