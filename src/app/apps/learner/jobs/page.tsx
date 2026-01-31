/**
 * Job Seeker - Jobs Browse Page
 * Main page for browsing and applying to jobs
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import { JobCardStack } from '@/components/job-seeker/JobCardStack';
import { JobFilters, type FilterState } from '@/components/job-seeker/JobFilters';
import { JobDetailModal } from '@/components/job-seeker/JobDetailModal';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { FocusAnnouncement } from '@/components/accessibility/FocusAnnouncement';
import { AnnounceableText } from '@/components/accessibility/AnnounceableText';
import { usePageAnnouncement } from '@/hooks/usePageAnnouncement';
import { TutorialButton } from '@/components/tutorial/TutorialButton';
import { TutorialOverlay } from '@/components/tutorial/TutorialOverlay';
import { useTutorial } from '@/hooks/useTutorial';
import { learnerJobsTutorialSteps } from '@/lib/tutorials/learner-jobs-tutorial';
import { Building2 } from 'lucide-react';
import type { JobListing } from '@/types/job';
import { triggerHaptic } from '@/lib/haptic';
import { announce } from '@/lib/audio';
import { enhanceJobWithAISummary, isAISummarizationAvailable } from '@/lib/ai/job-summarizer';
import { matchJobsToUser, getMatchLevel } from '@/lib/matching/job-matcher';
import { supabase } from '@/lib/supabase/client';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { useDeadlineReminders } from '@/hooks/useDeadlineReminders';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { UserNavigation } from '@/components/layout/UserNavigation';

// Mock data - will be replaced with API calls
// Using fixed dates to prevent hydration mismatches
const MOCK_DATE = new Date('2024-01-01T00:00:00.000Z');

const mockJobs: JobListing[] = [
  {
    id: '1',
    title: 'Software Developer',
    company: 'PT Teknologi Indonesia',
    location: {
      address: 'Jl. Sudirman No. 123',
      city: 'Jakarta Pusat',
      district: 'Sudirman',
      transjakartaDistance: 200,
      accessibility: 'Wheelchair accessible entrance',
    },
    salary: {
      min: 8000000,
      max: 12000000,
      currency: 'IDR',
      period: 'monthly',
    },
    description:
      'Kami mencari Software Developer berpengalaman untuk mengembangkan aplikasi web dan mobile. Kandidat akan bekerja dengan tim yang dinamis dan menggunakan teknologi terbaru.',
    summary:
      'Posisi: Software Developer di PT Teknologi Indonesia. Gaji: 8 hingga 12 juta Rupiah per bulan. Lokasi: Sudirman, 200 meter dari stasiun TransJakarta. Aksesibilitas: Tinggi - Kompatibel dengan JAWS, jam kerja fleksibel, opsi kerja remote.',
    requirements: [
      'Minimal 3 tahun pengalaman',
      'Menguasai JavaScript, React, Node.js',
      'Memahami Git dan Agile methodology',
    ],
    benefits: ['BPJS Kesehatan', 'Tunjangan transport', 'Remote work option'],
    workArrangement: 'hybrid',
    accessibility: {
      level: 'high',
      details: [
        'JAWS screen reader compatible',
        'Flexible work hours',
        'Remote work option available',
      ],
    },
    applicationUrl: 'https://example.com/apply/1',
    source: 'karirhub',
    sourceId: 'kh-001',
    createdAt: MOCK_DATE,
    updatedAt: MOCK_DATE,
  },
  {
    id: '2',
    title: 'Data Analyst',
    company: 'PT Data Insights',
    location: {
      address: 'Jl. Thamrin No. 45',
      city: 'Jakarta Pusat',
      district: 'Thamrin',
      transjakartaDistance: 150,
    },
    salary: {
      min: 10000000,
      max: 15000000,
      currency: 'IDR',
      period: 'monthly',
    },
    description:
      'Mencari Data Analyst untuk menganalisis data bisnis dan memberikan insights yang actionable. Kandidat akan bekerja dengan berbagai tools analitik.',
    summary:
      'Posisi: Data Analyst di PT Data Insights. Gaji: 10 hingga 15 juta Rupiah per bulan. Lokasi: Thamrin, 150 meter dari stasiun TransJakarta. Aksesibilitas: Sedang - Dukungan screen reader tersedia.',
    requirements: [
      'Minimal 2 tahun pengalaman',
      'Menguasai SQL, Python, Excel',
      'Memahami data visualization tools',
    ],
    benefits: ['BPJS', 'Bonus tahunan', 'Training budget'],
    workArrangement: 'on-site',
    accessibility: {
      level: 'medium',
      details: ['Screen reader support available', 'Flexible hours'],
    },
    applicationUrl: 'https://example.com/apply/2',
    source: 'dnetwork',
    sourceId: 'dn-002',
    createdAt: MOCK_DATE,
    updatedAt: MOCK_DATE,
    deadline: new Date('2024-02-20T23:59:59.000Z'),
  },
];

export default function JobsPage() {
  // Authentication guard - redirect to login if not authenticated
  const { isAuthenticated, loading: authLoading } = useAuthGuard({
    requireAuth: true,
    redirectTo: '/apps/learner/auth/login',
  });

  // Announce page on load and stop previous announcements
  usePageAnnouncement('Cari Pekerjaan', 'Jelajahi dan lamar pekerjaan yang tersedia');

  const { isOpen, startTutorial, closeTutorial, completeTutorial } = useTutorial('learner-jobs');
  const [allJobs] = useState<JobListing[]>(mockJobs);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showMatchScores, setShowMatchScores] = useState(true);
  const isMounted = useIsMounted();
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    location: [],
    salaryMin: null,
    salaryMax: null,
    accessibilityLevel: [],
    workArrangement: [],
  });

  // Load user profile for job matching
  useEffect(() => {
    if (!isMounted) return;

    const loadUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserProfile({
            professionalInfo: {
              skills: profile.skills || [],
            },
            preferences: {
              preferredLocation: profile.preferred_locations || [],
              preferredSalary: {
                min: profile.preferred_salary_min || 0,
                max: profile.preferred_salary_max || 0,
              },
              workArrangement: profile.work_arrangement || 'hybrid',
            },
            accessibility: {
              requiredLevel: 'high' as const,
              requiredAccommodations: profile.accommodations || [],
            },
          });
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    loadUserProfile();
  }, [isMounted]);

  // Calculate match scores if user profile is available
  const jobMatches = useMemo(() => {
    if (!userProfile) return null;
    return matchJobsToUser(allJobs, userProfile);
  }, [allJobs, userProfile]);

  // Deadline reminders
  useDeadlineReminders(allJobs);

  // Filter jobs based on current filters
  const filteredJobs = useMemo(() => {
    let jobs = allJobs.filter((job) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          job.title.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower) ||
          job.requirements.some((req) => req.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Location filter
      if (filters.location.length > 0) {
        if (!filters.location.includes(job.location.city)) return false;
      }

      // Salary filter
      if (filters.salaryMin !== null && job.salary) {
        if (job.salary.max && job.salary.max < filters.salaryMin) return false;
      }
      if (filters.salaryMax !== null && job.salary) {
        if (job.salary.min && job.salary.min > filters.salaryMax) return false;
      }

      // Accessibility level filter
      if (filters.accessibilityLevel.length > 0) {
        if (!filters.accessibilityLevel.includes(job.accessibility.level))
          return false;
      }

      // Work arrangement filter
      if (filters.workArrangement.length > 0) {
        if (!filters.workArrangement.includes(job.workArrangement)) return false;
      }

      return true;
    });

    // Sort by match score if available and enabled
    if (showMatchScores && jobMatches) {
      jobs.sort((a, b) => {
        const matchA = jobMatches.find(m => m.jobId === a.id);
        const matchB = jobMatches.find(m => m.jobId === b.id);
        const scoreA = matchA?.score || 0;
        const scoreB = matchB?.score || 0;
        return scoreB - scoreA; // Highest score first
      });
    }

    return jobs;
  }, [allJobs, filters, jobMatches, showMatchScores]);

  const handleApply = async (jobId: string) => {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Redirect to login with return URL
      const returnUrl = encodeURIComponent('/apps/learner/jobs');
      window.location.href = `/apps/learner/auth/login?returnUrl=${returnUrl}`;
      if (isMounted) {
        announce('Anda harus login terlebih dahulu untuk melamar pekerjaan');
      }
      return;
    }

    setAppliedJobs((prev) => new Set(prev).add(jobId));
    // Browser APIs are safe in event handlers (client-side only)
    if (typeof window !== 'undefined') {
      triggerHaptic('apply-success');
      announce('Lamaran berhasil dikirim');
    }
    // TODO: Integrate with RPA engine or API
  };

  const handleDismiss = (jobId: string) => {
    // Browser APIs are safe in event handlers (client-side only)
    if (typeof window !== 'undefined') {
      triggerHaptic('dismiss');
      announce('Pekerjaan dilewati');
    }
    // TODO: Track dismissed jobs
  };

  const handleViewDetails = (jobId: string) => {
    const job = allJobs.find((j) => j.id === jobId);
    if (job) {
      setSelectedJob(job);
      setIsDetailModalOpen(true);
    }
  };

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
      {/* Header with User Navigation */}
      <div className="flex items-start justify-between mb-4">
        <div></div>
        <UserNavigation userType="learner" profileUrl="/apps/learner/profile" />
      </div>

      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <div className="flex items-start justify-between mb-2">
            <FocusAnnouncement
              description="Halaman Cari Pekerjaan. Di halaman ini, Anda dapat menjelajahi lowongan kerja, menggunakan filter untuk mencari pekerjaan yang sesuai, dan melamar pekerjaan menggunakan gesture geser atau tombol."
              label="Halaman Cari Pekerjaan"
            >
              <h1 className="text-3xl font-bold" tabIndex={0}>Cari Pekerjaan</h1>
            </FocusAnnouncement>
            <TutorialButton
              onStart={startTutorial}
              tutorialId="learner-jobs"
              label="Mulai Tutorial Cari Pekerjaan"
            />
          </div>
          <AnnounceableText
            description="Gunakan gesture geser kanan untuk melamar pekerjaan, geser kiri untuk melewatkan, atau ketuk dua kali untuk melihat detail lengkap. Anda juga dapat menggunakan tombol keyboard: A untuk melamar, D untuk melewatkan."
            label="Instruksi Navigasi"
            as="p"
            className="text-muted-foreground"
          >
            Geser kanan untuk melamar, geser kiri untuk melewatkan
          </AnnounceableText>
        </header>

        {/* Filters */}
        <div className="mb-8" data-tutorial="filters">
          <JobFilters onFilterChange={setFilters} />
        </div>

        {/* Results Count */}
        {filteredJobs.length !== allJobs.length && (
          <FocusAnnouncement
            description={`Menampilkan ${filteredJobs.length} dari ${allJobs.length} pekerjaan berdasarkan filter yang Anda pilih. ${allJobs.length - filteredJobs.length} pekerjaan tersembunyi karena tidak sesuai dengan filter.`}
            label="Jumlah Hasil Filter"
          >
            <div className="mb-4 text-sm text-muted-foreground" tabIndex={0}>
              Menampilkan {filteredJobs.length} dari {allJobs.length} pekerjaan
            </div>
          </FocusAnnouncement>
        )}

        {/* Job Cards */}
        {filteredJobs.length > 0 ? (
          <JobCardStack
            jobs={filteredJobs}
            onApply={handleApply}
            onDismiss={handleDismiss}
            onViewDetails={handleViewDetails}
            matchScores={jobMatches ? new Map(jobMatches.map(m => [m.jobId, m.score])) : undefined}
          />
        ) : (
          <div className="text-center py-12 border border-border rounded-lg bg-card">
            <p className="text-muted-foreground mb-4">
              Tidak ada pekerjaan yang sesuai dengan filter Anda
            </p>
            <AccessibleButton
              onClick={() => {
                setFilters({
                  search: '',
                  location: [],
                  salaryMin: null,
                  salaryMax: null,
                  accessibilityLevel: [],
                  workArrangement: [],
                });
                if (typeof window !== 'undefined') {
                  announce('Semua filter telah dihapus');
                }
              }}
              variant="outline"
              announcementText="Menghapus semua filter"
              className="w-full sm:w-auto"
            >
              Hapus semua filter
            </AccessibleButton>
          </div>
        )}

        {/* Applied jobs count */}
        {appliedJobs.size > 0 && (
          <FocusAnnouncement
            description={`Anda telah melamar ${appliedJobs.size} pekerjaan. Semua lamaran dapat dilihat di halaman Lamaran di menu navigasi.`}
            label="Jumlah Lamaran"
          >
            <div className="mt-8 text-center" tabIndex={0}>
              <p className="text-sm text-muted-foreground">
                Anda telah melamar {appliedJobs.size} pekerjaan
              </p>
            </div>
          </FocusAnnouncement>
        )}
      </div>

      {/* Job Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onApply={handleApply}
      />

      {/* Tutorial Overlay */}
      <TutorialOverlay
        steps={learnerJobsTutorialSteps}
        isOpen={isOpen}
        onClose={closeTutorial}
        onComplete={completeTutorial}
        tutorialId="learner-jobs"
        title="Tutorial Cari Pekerjaan"
      />
    </div>
  );
}
