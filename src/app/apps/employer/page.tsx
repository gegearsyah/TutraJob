'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, TrendingUp, Users, Briefcase } from 'lucide-react';
import { TutorialOverlay } from '@/components/tutorial/TutorialOverlay';
import { TutorialButton } from '@/components/tutorial/TutorialButton';
import { useTutorial } from '@/hooks/useTutorial';
import { employerTutorialSteps } from '@/lib/tutorials/employer-tutorial';
import { usePageAnnouncement } from '@/hooks/usePageAnnouncement';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { UserNavigation } from '@/components/layout/UserNavigation';

export default function EmployerPage() {
  // Authentication guard - redirect to login if not authenticated
  const { isAuthenticated, loading: authLoading } = useAuthGuard({
    requireAuth: true,
    redirectTo: '/apps/employer/auth/login',
  });

  // Announce page on load and stop previous announcements
  usePageAnnouncement('Portal Pemberi Kerja', 'Halaman utama untuk pemberi kerja');

  const { isOpen, hasCompleted, startTutorial, closeTutorial, completeTutorial } = useTutorial('employer-main');
  const isMounted = useIsMounted();

  useEffect(() => {
    // Show tutorial automatically for first-time users
    if (isMounted && !hasCompleted && typeof window !== 'undefined') {
      const hasSeenWelcome = sessionStorage.getItem('employer_welcome_shown');
      if (!hasSeenWelcome) {
        setTimeout(() => {
          sessionStorage.setItem('employer_welcome_shown', 'true');
          startTutorial();
        }, 1000);
      }
    }
  }, [isMounted, hasCompleted, startTutorial]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated (useAuthGuard will handle this, but adding as safety)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container py-8">
      <div className="flex items-start justify-between mb-8">
        <div></div>
        <UserNavigation userType="employer" />
      </div>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Selamat Datang di Portal Pemberi Kerja</h2>
            <p className="text-muted-foreground">
              Kelola rekrutmen inklusif dan pelacakan kepatuhan
            </p>
          </div>
          <TutorialButton
            onStart={startTutorial}
            tutorialId="employer-main"
            label="Mulai Tutorial"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/apps/employer/compliance"
            className="p-6 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
          >
            <TrendingUp className="w-8 h-8 text-primary mb-3" />
            <h3 className="text-xl font-semibold mb-2">Pelacakan Kepatuhan</h3>
            <p className="text-sm text-muted-foreground">
              Monitor kuota wajib UU No. 8/2016
            </p>
          </Link>
          <Link
            href="/apps/employer/profile"
            className="p-6 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
          >
            <Users className="w-8 h-8 text-primary mb-3" />
            <h3 className="text-xl font-semibold mb-2">Profil Perusahaan</h3>
            <p className="text-sm text-muted-foreground">
              Kelola informasi dan kepatuhan perusahaan
            </p>
          </Link>
          <Link
            href="/apps/employer/compliance/info"
            className="p-6 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
          >
            <FileText className="w-8 h-8 text-primary mb-3" />
            <h3 className="text-xl font-semibold mb-2">Informasi Kepatuhan</h3>
            <p className="text-sm text-muted-foreground">
              Pelajari tentang peraturan dan sistem
            </p>
          </Link>
          <Link
            href="/apps/employer/jobs/post"
            className="p-6 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
          >
            <Briefcase className="w-8 h-8 text-primary mb-3" />
            <h3 className="text-xl font-semibold mb-2">Posting Lowongan</h3>
            <p className="text-sm text-muted-foreground">
              Buat lowongan pekerjaan yang aksesibel
            </p>
          </Link>
          <div className="p-6 rounded-lg border border-border bg-card">
            <Users className="w-8 h-8 text-primary mb-3" />
            <h3 className="text-xl font-semibold mb-2">Tinjau Kandidat</h3>
            <p className="text-sm text-muted-foreground">
              Alat screening tanpa bias
            </p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <FileText className="w-8 h-8 text-primary mb-3" />
            <h3 className="text-xl font-semibold mb-2">Laporan</h3>
            <p className="text-sm text-muted-foreground">
              Laporan dan analitik
            </p>
          </div>
        </div>
      </div>

      {/* Tutorial Overlay */}
      <TutorialOverlay
        steps={employerTutorialSteps}
        isOpen={isOpen}
        onClose={closeTutorial}
        onComplete={completeTutorial}
        tutorialId="employer-main"
        title="Tutorial Portal Pemberi Kerja"
      />
    </div>
  );
}
