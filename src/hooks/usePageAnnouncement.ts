/**
 * Hook to announce page title and stop previous announcements on navigation
 */

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { stopAnnouncement, announce } from '@/lib/audio';

interface PageInfo {
  title: string;
  description?: string;
}

const pageTitles: Record<string, PageInfo> = {
  '/apps/learner': {
    title: 'Portal Pencari Kerja',
    description: 'Halaman utama untuk pencari kerja',
  },
  '/apps/learner/jobs': {
    title: 'Cari Pekerjaan',
    description: 'Jelajahi dan lamar pekerjaan yang tersedia',
  },
  '/apps/learner/profile': {
    title: 'Profil Saya',
    description: 'Kelola profil dan informasi pribadi Anda',
  },
  '/apps/learner/applications': {
    title: 'Lamaran Saya',
    description: 'Lacak status lamaran pekerjaan Anda',
  },
  '/apps/learner/saved': {
    title: 'Pekerjaan Tersimpan',
    description: 'Lihat pekerjaan yang telah Anda simpan',
  },
  '/apps/learner/auth/login': {
    title: 'Masuk',
    description: 'Masuk ke akun pencari kerja',
  },
  '/apps/learner/auth/signup': {
    title: 'Daftar',
    description: 'Buat akun pencari kerja baru',
  },
  '/apps/employer': {
    title: 'Portal Pemberi Kerja',
    description: 'Halaman utama untuk pemberi kerja',
  },
  '/apps/employer/auth/login': {
    title: 'Masuk - Pemberi Kerja',
    description: 'Masuk ke akun perusahaan',
  },
  '/apps/employer/auth/signup': {
    title: 'Daftar - Pemberi Kerja',
    description: 'Buat akun perusahaan baru',
  },
  '/apps/employer/compliance': {
    title: 'Kepatuhan',
    description: 'Lacak kuota dan kepatuhan rekrutmen',
  },
  '/': {
    title: 'Inklusif Kerja',
    description: 'Platform rekrutmen yang mudah diakses untuk Indonesia',
  },
};

export function usePageAnnouncement(customTitle?: string, customDescription?: string) {
  const pathname = usePathname();
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!isMounted) return;

    // Stop any ongoing announcements immediately
    stopAnnouncement();

    // Get page info
    const pageInfo = pageTitles[pathname] || {
      title: customTitle || 'Halaman',
      description: customDescription,
    };

    // Announce new page after a short delay to ensure previous announcement is stopped
    const timer = setTimeout(() => {
      const announcement = customDescription
        ? `${pageInfo.title}. ${customDescription}`
        : pageInfo.description
        ? `${pageInfo.title}. ${pageInfo.description}`
        : pageInfo.title;

      announce(announcement);
    }, 300);

    return () => {
      clearTimeout(timer);
      // Stop announcement when component unmounts (navigation away)
      stopAnnouncement();
    };
  }, [pathname, isMounted, customTitle, customDescription]);
}
