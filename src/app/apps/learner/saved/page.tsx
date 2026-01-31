/**
 * Saved Jobs Page
 * View and manage saved jobs
 */

'use client';

import { useState, useEffect } from 'react';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { usePageAnnouncement } from '@/hooks/usePageAnnouncement';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { TutorialButton } from '@/components/tutorial/TutorialButton';
import { TutorialOverlay } from '@/components/tutorial/TutorialOverlay';
import { useTutorial } from '@/hooks/useTutorial';
import { learnerSavedTutorialSteps } from '@/lib/tutorials/learner-saved-tutorial';
import { JobCard } from '@/components/job-seeker/JobCard';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { SavedJobCard } from '@/components/accessibility/SavedJobCard';
import { JobDetailModal } from '@/components/job-seeker/JobDetailModal';
import { FocusAnnouncement } from '@/components/accessibility/FocusAnnouncement';
import { AnnounceableText } from '@/components/accessibility/AnnounceableText';
import { announce } from '@/lib/audio';
import { triggerHaptic } from '@/lib/haptic';
import { playAudioCue } from '@/lib/audio';
import { supabase } from '@/lib/supabase/client';
import type { JobListing } from '@/types/job';
import { Bookmark, Trash2 } from 'lucide-react';

// Mock saved jobs
const MOCK_DATE = new Date('2024-01-01T00:00:00.000Z');
const mockSavedJobs: JobListing[] = [
  {
    id: 'saved-1',
    title: 'Frontend Developer',
    company: 'PT Digital Solutions',
    location: {
      address: 'Jl. Gatot Subroto No. 88',
      city: 'Jakarta Selatan',
      district: 'Kuningan',
      transjakartaDistance: 300,
    },
    salary: {
      min: 12000000,
      max: 18000000,
      currency: 'IDR',
      period: 'monthly',
    },
    description: 'Mencari Frontend Developer berpengalaman dengan React dan TypeScript.',
    summary:
      'Posisi: Frontend Developer di PT Digital Solutions. Gaji: 12 hingga 18 juta Rupiah per bulan. Lokasi: Kuningan, 300 meter dari stasiun TransJakarta. Aksesibilitas: Tinggi - Dukungan screen reader lengkap.',
    requirements: ['React', 'TypeScript', '3+ tahun pengalaman'],
    benefits: ['BPJS', 'Remote work'],
    workArrangement: 'hybrid',
    accessibility: {
      level: 'high',
      details: ['Screen reader support', 'Remote option'],
    },
    applicationUrl: 'https://example.com/apply/saved-1',
    source: 'karirhub',
    sourceId: 'kh-saved-001',
    createdAt: MOCK_DATE,
    updatedAt: MOCK_DATE,
  },
];

export default function SavedJobsPage() {
  // Always call hooks at the top level - never conditionally
  const isMounted = useIsMounted();
  
  // Announce page on load and stop previous announcements
  usePageAnnouncement('Pekerjaan Tersimpan', 'Lihat pekerjaan yang telah Anda simpan');

  const { isOpen, startTutorial, closeTutorial, completeTutorial } = useTutorial('learner-saved');

  // Require authentication for this page
  const { isAuthenticated, loading: authLoading } = useAuthGuard({
    requireAuth: true,
    redirectTo: '/apps/learner/auth/login',
  });

  const [savedJobs, setSavedJobs] = useState<JobListing[]>(mockSavedJobs);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    if (isMounted && savedJobs.length > 0 && isAuthenticated && !authLoading) {
      // Only announce when authenticated and not loading
      announce(`Anda memiliki ${savedJobs.length} pekerjaan yang disimpan`);
    }
  }, [isMounted, savedJobs.length, isAuthenticated, authLoading]);

  const handleRemove = (jobId: string) => {
    setSavedJobs((prev) => prev.filter((job) => job.id !== jobId));
    if (isMounted) {
      triggerHaptic('dismiss');
      playAudioCue('dismiss');
      announce('Pekerjaan dihapus dari daftar tersimpan');
    }
  };

  const handleApply = async (jobId: string) => {
    // Check if user is authenticated (should be, but double-check)
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      const returnUrl = encodeURIComponent('/apps/learner/saved');
      window.location.href = `/apps/learner/auth/login?returnUrl=${returnUrl}`;
      if (isMounted) {
        announce('Anda harus login terlebih dahulu untuk melamar pekerjaan');
      }
      return;
    }

    if (isMounted) {
      triggerHaptic('apply-success');
      playAudioCue('apply-success');
      announce('Lamaran berhasil dikirim');
    }
    // TODO: Implement application submission
  };

  const handleDismiss = (jobId: string) => {
    handleRemove(jobId);
  };

  const handleViewDetails = (jobId: string) => {
    const job = savedJobs.find((j) => j.id === jobId);
    if (job) {
      setSelectedJob(job);
      setIsDetailModalOpen(true);
      if (isMounted) {
        triggerHaptic('confirmation');
        announce(`Membuka detail lengkap pekerjaan: ${job.title} di ${job.company}`);
      }
    }
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedJob(null);
    if (isMounted) {
      announce('Modal detail ditutup');
    }
  };

  const handleApplyFromModal = (jobId: string) => {
    handleApply(jobId);
    handleCloseDetailModal();
  };

  // Show loading or redirect if not authenticated
  if (authLoading) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Memverifikasi autentikasi...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useAuthGuard
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex items-start justify-between">
          <div className="flex items-center gap-3 mb-2">
            <Bookmark className="w-8 h-8 text-primary" aria-hidden="true" />
            <FocusAnnouncement
              description="Halaman Pekerjaan Tersimpan. Di halaman ini, Anda dapat melihat semua pekerjaan yang telah disimpan, melamar pekerjaan, atau menghapus dari daftar tersimpan."
              label="Halaman Pekerjaan Tersimpan"
            >
              <h1 className="text-3xl font-bold">Pekerjaan Tersimpan</h1>
            </FocusAnnouncement>
          </div>
          <TutorialButton
            onStart={startTutorial}
            tutorialId="learner-saved"
            label="Tutorial"
          />
        </header>
        <AnnounceableText
          description="Halaman ini menampilkan pekerjaan yang telah Anda simpan untuk dilamar nanti. Anda dapat melamar langsung dari halaman ini atau menghapus pekerjaan yang tidak lagi diminati."
          label="Deskripsi Halaman"
          as="p"
          className="text-muted-foreground mb-4"
        >
          Kelola pekerjaan yang telah Anda simpan untuk dilamar nanti
        </AnnounceableText>

        {savedJobs.length === 0 ? (
          <div className="text-center py-12 border border-border rounded-lg bg-card">
            <Bookmark className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">
              Belum ada pekerjaan yang disimpan
            </p>
            <AccessibleButton
              asLink
              href="/apps/learner/jobs"
              variant="primary"
              announcementText="Membuka halaman jelajahi pekerjaan"
              className="w-full sm:w-auto"
            >
              Jelajahi pekerjaan sekarang
            </AccessibleButton>
          </div>
        ) : (
          <div className="space-y-6">
            {savedJobs.map((job) => (
              <SavedJobCard
                key={job.id}
                job={job}
                onApply={handleApply}
                onDismiss={handleDismiss}
                onViewDetails={handleViewDetails}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}

        {/* Quick actions */}
        {savedJobs.length > 0 && (
          <div className="mt-8 p-4 border border-border rounded-lg bg-card">
            <p className="text-sm text-muted-foreground mb-2">
              Tips: Gunakan gesture geser kanan untuk melamar, atau klik tombol
              "Lamar" di setiap kartu pekerjaan.
            </p>
          </div>
        )}
      </div>

      {/* Job Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onApply={handleApplyFromModal}
      />

      {/* Tutorial Overlay */}
      <TutorialOverlay
        steps={learnerSavedTutorialSteps}
        isOpen={isOpen}
        onClose={closeTutorial}
        onComplete={completeTutorial}
        tutorialId="learner-saved"
        title="Tutorial Pekerjaan Tersimpan"
      />
    </div>
  );
}
