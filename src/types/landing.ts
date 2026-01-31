/**
 * Landing Page Content Types
 */

export interface LandingAbout {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  why_different_title?: string;
  why_different_items?: Array<{
    title: string;
    description: string;
  }>;
  image_url?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface LandingStatistic {
  id: string;
  stat_type: 'job_seekers' | 'job_positions' | 'employers';
  label_id: string;
  label_en: string;
  value: number;
  icon_name?: string;
  description?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface LandingCreatorProfile {
  id: string;
  name: string;
  title: string;
  bio: string;
  image_url?: string;
  social_links?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
    [key: string]: string | undefined;
  };
  achievements?: string[];
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface LandingEmployer {
  id: string;
  company_name: string;
  logo_url?: string;
  description?: string;
  website_url?: string;
  industry?: string;
  employee_count?: number;
  location?: string;
  is_featured: boolean;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface LandingArticle {
  id: string;
  type: 'info' | 'testimonial';
  title: string;
  content: string;
  author_name?: string;
  author_title?: string;
  author_image_url?: string;
  image_url?: string;
  category?: string;
  published_at?: string;
  is_featured: boolean;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface LandingValue {
  id: string;
  title: string;
  description: string;
  icon_name?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface LandingContact {
  id: string;
  contact_type: 'email' | 'phone' | 'address' | 'social';
  label: string;
  value: string;
  icon_name?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}
