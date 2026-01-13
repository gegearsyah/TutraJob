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
import type { JobListing } from '@/types/job';
import { triggerHaptic } from '@/lib/haptic';
import { announce } from '@/lib/audio';
import { enhanceJobWithAISummary, isAISummarizationAvailable } from '@/lib/ai/job-summarizer';

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
  },
];

export default function JobsPage() {
  // Announce page on load and stop previous announcements
  usePageAnnouncement('Cari Pekerjaan', 'Jelajahi dan lamar pekerjaan yang tersedia');

  const [allJobs] = useState<JobListing[]>(mockJobs);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    location: [],
    salaryMin: null,
    salaryMax: null,
    accessibilityLevel: [],
    workArrangement: [],
  });

  // Filter jobs based on current filters
  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
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
  }, [allJobs, filters]);

  const handleApply = (jobId: string) => {
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

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <FocusAnnouncement
            description="Halaman Cari Pekerjaan. Di halaman ini, Anda dapat menjelajahi lowongan kerja, menggunakan filter untuk mencari pekerjaan yang sesuai, dan melamar pekerjaan menggunakan gesture geser atau tombol."
            label="Halaman Cari Pekerjaan"
          >
            <h1 className="text-3xl font-bold mb-2" tabIndex={0}>Cari Pekerjaan</h1>
          </FocusAnnouncement>
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
    </div>
  );
}
