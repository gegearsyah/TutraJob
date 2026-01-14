'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TutorialOverlay } from '@/components/tutorial/TutorialOverlay';
import { TutorialButton } from '@/components/tutorial/TutorialButton';
import { FocusAnnouncement } from '@/components/accessibility/FocusAnnouncement';
import { AnnounceableText } from '@/components/accessibility/AnnounceableText';
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
    if (isMounted) {
      // Announce that user is already on the app
      const timer = setTimeout(() => {
        announce('Anda sudah berada di aplikasi Portal Pencari Kerja. Di halaman ini, Anda dapat mengakses menu Cari Pekerjaan, Riwayat Lamaran, Pekerjaan Tersimpan, dan Lengkapi Profil.');
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isMounted]);

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
          <FocusAnnouncement
            description="Selamat datang di Portal Pencari Kerja. Platform pencarian kerja yang mudah diakses untuk semua, khususnya penyandang disabilitas. Platform ini dilengkapi dengan fitur aksesibilitas lengkap termasuk audio feedback, haptic feedback, dan navigasi keyboard."
            label="Judul Halaman"
          >
            <div tabIndex={0}>
              <h2 className="text-3xl font-bold mb-2">Selamat Datang di Portal Pencari Kerja</h2>
              <AnnounceableText
                description="Platform pencarian kerja yang dirancang khusus untuk mudah diakses oleh semua orang, termasuk penyandang disabilitas. Dilengkapi dengan fitur aksesibilitas lengkap."
                label="Deskripsi Platform"
                as="p"
                className="text-muted-foreground"
              >
                Platform pencarian kerja yang mudah diakses untuk semua
              </AnnounceableText>
            </div>
          </FocusAnnouncement>
          <TutorialButton
            onStart={startTutorial}
            tutorialId="learner-main"
            label="Mulai Tutorial"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FocusAnnouncement
            description="Jelajahi dan cari lowongan kerja yang sesuai dengan profil Anda. Di halaman ini, Anda dapat melihat kartu pekerjaan, menggunakan filter, dan melamar pekerjaan dengan mudah menggunakan gesture geser atau tombol."
            label="Cari Pekerjaan"
            context="Tekan Enter untuk membuka halaman pencarian pekerjaan"
            isNavigation={true}
          >
            <Link
              href="/apps/learner/jobs"
              className="p-6 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors min-h-[48px] flex flex-col"
            >
              <h3 className="text-xl font-semibold mb-2">Cari Pekerjaan</h3>
              <p className="text-sm text-muted-foreground">
                Jelajahi lowongan kerja yang mudah diakses
              </p>
            </Link>
          </FocusAnnouncement>
          <FocusAnnouncement
            description="Lihat dan lacak status semua lamaran pekerjaan yang telah Anda kirim. Anda dapat melihat status seperti Dikirim, Sedang Ditinjau, Wawancara Dijadwalkan, Tawaran Diterima, atau Ditolak. Halaman ini memerlukan login."
            label="Riwayat Lamaran"
            context="Tekan Enter untuk membuka halaman riwayat lamaran. Anda akan diarahkan ke login jika belum masuk."
            isNavigation={true}
          >
            <Link
              href="/apps/learner/applications"
              className="p-6 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors min-h-[48px] flex flex-col"
            >
              <h3 className="text-xl font-semibold mb-2">Riwayat Lamaran</h3>
              <p className="text-sm text-muted-foreground">
                Lacak status semua lamaran Anda
              </p>
            </Link>
          </FocusAnnouncement>
          <FocusAnnouncement
            description="Akses pekerjaan yang telah Anda simpan untuk dilamar nanti. Di halaman ini, Anda dapat melihat semua pekerjaan yang disimpan, melamar, atau menghapus dari daftar tersimpan. Halaman ini memerlukan login."
            label="Pekerjaan Tersimpan"
            context="Tekan Enter untuk membuka halaman pekerjaan tersimpan. Anda akan diarahkan ke login jika belum masuk."
            isNavigation={true}
          >
            <Link
              href="/apps/learner/saved"
              className="p-6 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors min-h-[48px] flex flex-col"
            >
              <h3 className="text-xl font-semibold mb-2">Pekerjaan Tersimpan</h3>
              <p className="text-sm text-muted-foreground">
                Lihat pekerjaan yang telah disimpan
              </p>
            </Link>
          </FocusAnnouncement>
          <FocusAnnouncement
            description="Lengkapi profil pribadi Anda dengan mengisi data pribadi, upload CV atau resume, menambahkan pengalaman kerja, pendidikan, dan mengatur preferensi pekerjaan. Profil yang lengkap meningkatkan peluang mendapatkan pekerjaan. Halaman ini memerlukan login."
            label="Lengkapi Profil"
            context="Tekan Enter untuk membuka halaman profil. Anda akan diarahkan ke login jika belum masuk."
            isNavigation={true}
          >
            <Link
              href="/apps/learner/profile"
              className="p-6 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors min-h-[48px] flex flex-col"
            >
              <h3 className="text-xl font-semibold mb-2">Lengkapi Profil</h3>
              <p className="text-sm text-muted-foreground">
                Upload CV dan lengkapi data diri
              </p>
            </Link>
          </FocusAnnouncement>
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
