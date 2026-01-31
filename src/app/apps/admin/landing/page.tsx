'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { getUserRole } from '@/lib/auth/roles';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { usePageAnnouncement } from '@/hooks/usePageAnnouncement';
import { announce } from '@/lib/audio';
import { triggerHaptic } from '@/lib/haptic';
import { supabase } from '@/lib/supabase/client';
import {
  FileText,
  BarChart3,
  User,
  Building2,
  BookOpen,
  Heart,
  Phone,
  Settings,
  ArrowLeft,
} from 'lucide-react';
import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';

export default function AdminLandingPage() {
  usePageAnnouncement('Manajemen Landing Page', 'Halaman untuk mengelola konten landing page');
  
  const backButtonProps = useFocusAnnouncement({
    description: 'Kembali ke dashboard admin',
    label: 'Tombol Kembali',
    announceOnFocus: true,
  });

  const isMounted = useIsMounted();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated, loading: authLoading } = useAuthGuard({
    requireAuth: true,
    redirectTo: '/apps/admin/auth/login',
  });

  useEffect(() => {
    if (!isMounted || authLoading) return;

    const checkAdmin = async () => {
      try {
        const role = await getUserRole();
        if (role !== 'admin') {
          announce('Akses ditolak. Hanya administrator yang dapat mengakses halaman ini.');
          router.push('/apps/admin/auth/login');
          return;
        }
        setUserRole(role);
      } catch (error) {
        console.error('Error checking admin role:', error);
        router.push('/apps/admin/auth/login');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      checkAdmin();
    }
  }, [isMounted, isAuthenticated, authLoading, router]);

  if (loading || authLoading) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || userRole !== 'admin') {
    return null;
  }

  const menuItems = [
    {
      id: 'about',
      title: 'Tentang Kami',
      description: 'Kelola konten tentang kami dan mengapa kami berbeda',
      icon: FileText,
      href: '/apps/admin/landing/about',
    },
    {
      id: 'statistics',
      title: 'Statistik',
      description: 'Kelola statistik platform (Pencari Kerja, Lowongan, Perusahaan)',
      icon: BarChart3,
      href: '/apps/admin/landing/statistics',
    },
    {
      id: 'creator',
      title: 'Profil Pembuat',
      description: 'Kelola profil pembuat platform',
      icon: User,
      href: '/apps/admin/landing/creator',
    },
    {
      id: 'employers',
      title: 'Mitra Perusahaan',
      description: 'Kelola daftar perusahaan mitra',
      icon: Building2,
      href: '/apps/admin/landing/employers',
    },
    {
      id: 'articles',
      title: 'Artikel & Testimoni',
      description: 'Kelola artikel informatif dan testimoni',
      icon: BookOpen,
      href: '/apps/admin/landing/articles',
    },
    {
      id: 'values',
      title: 'Nilai Organisasi',
      description: 'Kelola nilai-nilai organisasi',
      icon: Heart,
      href: '/apps/admin/landing/values',
    },
    {
      id: 'contact',
      title: 'Kontak',
      description: 'Kelola informasi kontak',
      icon: Phone,
      href: '/apps/admin/landing/contact',
    },
  ];

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <Link
          href="/apps/admin/dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 min-h-[48px]"
          {...backButtonProps}
        >
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          Kembali ke Dashboard
        </Link>
        <h1 className="text-3xl font-bold mb-2">Manajemen Landing Page</h1>
        <p className="text-muted-foreground">
          Kelola semua konten yang ditampilkan di halaman utama
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow min-h-[48px] flex flex-col"
              role="link"
              tabIndex={0}
              aria-label={`${item.title}. ${item.description}. Klik untuk mengelola.`}
            >
              <Icon className="w-8 h-8 text-primary mb-4" aria-hidden="true" />
              <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
