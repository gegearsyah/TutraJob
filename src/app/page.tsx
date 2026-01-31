import { Metadata } from 'next';
import { LandingPage } from '@/components/landing/LandingPage';
import {
  LandingAbout,
  LandingStatistic,
  LandingCreatorProfile,
  LandingEmployer,
  LandingArticle,
  LandingValue,
  LandingContact,
} from '@/types/landing';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Inklusif Kerja - Platform Rekrutmen yang Mudah Diakses untuk Indonesia',
  description: 'Platform rekrutmen inklusif yang menghubungkan pencari kerja dengan disabilitas dan perusahaan yang berkomitmen pada inklusi. Temukan peluang karir yang sesuai dengan kebutuhan Anda.',
  keywords: ['rekrutmen', 'disabilitas', 'inklusi', 'pekerjaan', 'karir', 'Indonesia', 'aksesibilitas'],
  openGraph: {
    title: 'Inklusif Kerja - Platform Rekrutmen yang Mudah Diakses',
    description: 'Platform rekrutmen inklusif untuk Indonesia',
    type: 'website',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inklusif Kerja - Platform Rekrutmen yang Mudah Diakses',
    description: 'Platform rekrutmen inklusif untuk Indonesia',
  },
  alternates: {
    canonical: '/',
  },
};

async function fetchLandingData() {
  try {
    // Use direct Supabase calls for server-side rendering
    const { supabaseAdmin } = await import('@/lib/supabase/server');
    
    const [aboutRes, statisticsRes, creatorsRes, employersRes, articlesRes, valuesRes, contactRes] = await Promise.all([
      supabaseAdmin.from('landing_about').select('*').eq('is_active', true).order('order_index', { ascending: true }).limit(1).single(),
      supabaseAdmin.from('landing_statistics').select('*').eq('is_active', true).order('order_index', { ascending: true }),
      supabaseAdmin.from('landing_creator_profile').select('*').eq('is_active', true).order('order_index', { ascending: true }),
      supabaseAdmin.from('landing_employers').select('*').eq('is_active', true).order('order_index', { ascending: true }),
      supabaseAdmin.from('landing_articles').select('*').eq('is_active', true).order('order_index', { ascending: true }),
      supabaseAdmin.from('landing_values').select('*').eq('is_active', true).order('order_index', { ascending: true }),
      supabaseAdmin.from('landing_contact').select('*').eq('is_active', true).order('order_index', { ascending: true }),
    ]);

    return {
      about: (aboutRes.data && !aboutRes.error) ? aboutRes.data as LandingAbout : undefined,
      statistics: (statisticsRes.data && !statisticsRes.error) ? statisticsRes.data as LandingStatistic[] : [],
      creators: (creatorsRes.data && !creatorsRes.error) ? creatorsRes.data as LandingCreatorProfile[] : [],
      employers: (employersRes.data && !employersRes.error) ? employersRes.data as LandingEmployer[] : [],
      articles: (articlesRes.data && !articlesRes.error) ? articlesRes.data as LandingArticle[] : [],
      values: (valuesRes.data && !valuesRes.error) ? valuesRes.data as LandingValue[] : [],
      contact: (contactRes.data && !contactRes.error) ? contactRes.data as LandingContact[] : [],
    };
  } catch (error) {
    console.error('Error fetching landing page data:', error);
    return {
      about: undefined,
      statistics: [],
      creators: [],
      employers: [],
      articles: [],
      values: [],
      contact: [],
    };
  }
}

export default async function Home() {
  const landingData = await fetchLandingData();

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Inklusif Kerja',
    description: 'Platform rekrutmen yang mudah diakses untuk Indonesia',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: landingData.contact.find(c => c.contact_type === 'email')?.value,
      telephone: landingData.contact.find(c => c.contact_type === 'phone')?.value,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <LandingPage {...landingData} />
    </>
  );
}
