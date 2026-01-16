/**
 * Admin Dashboard
 * Main dashboard for administrators
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { usePageAnnouncement } from '@/hooks/usePageAnnouncement';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { getUserRole } from '@/lib/auth/roles';
import { supabase } from '@/lib/supabase/client';
import { announce } from '@/lib/audio';
import { triggerHaptic } from '@/lib/haptic';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { FocusAnnouncement } from '@/components/accessibility/FocusAnnouncement';
import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';
import { Shield, Database, Settings, LogOut, Link as LinkIcon, Play, Pause, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  usePageAnnouncement('Dashboard Admin', 'Halaman utama administrator');

  const isMounted = useIsMounted();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication and admin role
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

  const handleLogout = async () => {
    if (isMounted) {
      triggerHaptic('dismiss');
      announce('Keluar dari akun admin...');
      await supabase.auth.signOut();
      router.push('/apps/admin/auth/login');
    }
  };

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
    return null; // Will redirect
  }

  const dashboardCardProps = useFocusAnnouncement({
    description: 'Navigasi ke halaman pengaturan scraping pekerjaan',
    label: 'Pengaturan Scraping',
    context: 'Klik untuk mengatur scraping pekerjaan',
    announceOnFocus: true,
    announceOnLongPress: true,
  });

  const extractionCardProps = useFocusAnnouncement({
    description: 'Navigasi ke halaman ekstraksi pekerjaan manual',
    label: 'Ekstraksi Pekerjaan',
    context: 'Klik untuk mengekstrak pekerjaan secara manual',
    announceOnFocus: true,
    announceOnLongPress: true,
  });

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <FocusAnnouncement
              description="Dashboard Administrator. Di sini Anda dapat mengelola scraping pekerjaan, ekstraksi data, dan pengaturan sistem."
              label="Dashboard Admin"
            >
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Shield className="w-8 h-8 text-primary" aria-hidden="true" />
                Dashboard Admin
              </h1>
            </FocusAnnouncement>
            <p className="text-muted-foreground">
              Kelola scraping pekerjaan dan ekstraksi data
            </p>
          </div>
          <AccessibleButton
            onClick={handleLogout}
            variant="outline"
            announcementText="Keluar dari akun admin"
            className="min-h-[48px]"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </AccessibleButton>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/apps/admin/scraping"
            className="block"
            {...dashboardCardProps}
          >
            <div className="p-6 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors min-h-[200px] flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <LinkIcon className="w-8 h-8 text-primary" aria-hidden="true" />
                <h2 className="text-xl font-semibold">Pengaturan Scraping</h2>
              </div>
              <p className="text-sm text-muted-foreground flex-1">
                Kelola URL dan link untuk scraping pekerjaan. Tambah, edit, atau hapus sumber data pekerjaan.
              </p>
              <div className="mt-4 text-sm text-primary font-medium">
                Kelola Scraping →
              </div>
            </div>
          </Link>

          <Link
            href="/apps/admin/job-extraction"
            className="block"
            {...extractionCardProps}
          >
            <div className="p-6 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors min-h-[200px] flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-8 h-8 text-primary" aria-hidden="true" />
                <h2 className="text-xl font-semibold">Ekstraksi Pekerjaan</h2>
              </div>
              <p className="text-sm text-muted-foreground flex-1">
                Ekstrak detail pekerjaan dari URL eksternal atau masukkan secara manual.
              </p>
              <div className="mt-4 text-sm text-primary font-medium">
                Ekstrak Pekerjaan →
              </div>
            </div>
          </Link>

          <div className="p-6 border border-border rounded-lg bg-card min-h-[200px] flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-8 h-8 text-primary" aria-hidden="true" />
              <h2 className="text-xl font-semibold">Statistik</h2>
            </div>
            <p className="text-sm text-muted-foreground flex-1">
              Lihat statistik pekerjaan, pengguna, dan aplikasi.
            </p>
            <div className="mt-4 text-sm text-muted-foreground">
              Segera hadir
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
