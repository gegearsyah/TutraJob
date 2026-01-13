'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TutorialOverlay } from '@/components/tutorial/TutorialOverlay';
import { TutorialButton } from '@/components/tutorial/TutorialButton';
import { useTutorial } from '@/hooks/useTutorial';
import { learnerTutorialSteps } from '@/lib/tutorials/learner-tutorial';
import { usePageAnnouncement } from '@/hooks/usePageAnnouncement';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { announce } from '@/lib/audio';

export default function LearnerPage() {
  // Announce page on load and stop previous announcements
  usePageAnnouncement('Portal Pencari Kerja', 'Halaman utama untuk pencari kerja');

  const { isOpen, hasCompleted, startTutorial, closeTutorial, completeTutorial } = useTutorial('learner-main');
  const isMounted = useIsMounted();

  useEffect(() => {
    // Show tutorial automatically for first-time users
    if (isMounted && !hasCompleted && typeof window !== 'undefined') {
      const hasSeenWelcome = sessionStorage.getItem('learner_welcome_shown');
      if (!hasSeenWelcome) {
        setTimeout(() => {
          sessionStorage.setItem('learner_welcome_shown', 'true');
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
            <h2 className="text-3xl font-bold mb-2">Selamat Datang di Portal Pencari Kerja</h2>
            <p className="text-muted-foreground">
              Platform pencarian kerja yang mudah diakses untuk semua
            </p>
          </div>
          <TutorialButton
            onStart={startTutorial}
            tutorialId="learner-main"
            label="Mulai Tutorial"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/apps/learner/jobs"
            className="p-6 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">Find Jobs</h3>
            <p className="text-sm text-muted-foreground">
              Browse accessible job opportunities
            </p>
          </Link>
          <Link
            href="/apps/learner/applications"
            className="p-6 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">Riwayat Lamaran</h3>
            <p className="text-sm text-muted-foreground">
              Lacak status semua lamaran Anda
            </p>
          </Link>
          <Link
            href="/apps/learner/saved"
            className="p-6 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">Pekerjaan Tersimpan</h3>
            <p className="text-sm text-muted-foreground">
              Lihat pekerjaan yang telah disimpan
            </p>
          </Link>
          <Link
            href="/apps/learner/profile"
            className="p-6 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">Lengkapi Profil</h3>
            <p className="text-sm text-muted-foreground">
              Upload CV dan lengkapi data diri
            </p>
          </Link>
        </div>
      </div>

      {/* Tutorial Overlay */}
      <TutorialOverlay
        steps={learnerTutorialSteps}
        isOpen={isOpen}
        onClose={closeTutorial}
        onComplete={completeTutorial}
        tutorialId="learner-main"
        title="Tutorial Portal Pencari Kerja"
      />
    </div>
  );
}
