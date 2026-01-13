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

export default function EmployerPage() {
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

  return (
    <div className="container py-8">
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
          <div className="p-6 rounded-lg border border-border bg-card">
            <Briefcase className="w-8 h-8 text-primary mb-3" />
            <h3 className="text-xl font-semibold mb-2">Posting Lowongan</h3>
            <p className="text-sm text-muted-foreground">
              Buat lowongan pekerjaan yang aksesibel
            </p>
          </div>
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
