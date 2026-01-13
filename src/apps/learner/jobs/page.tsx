/**
 * Job Seeker - Jobs Browse Page
 * Main page for browsing and applying to jobs
 */

'use client';

import { useState } from 'react';
import { JobCardStack } from '@/components/job-seeker/JobCardStack';
import type { JobListing } from '@/types/job';
import { triggerHaptic } from '@/lib/haptic';
import { announce } from '@/lib/audio';

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
      'Position: Software Developer at PT Teknologi Indonesia. Salary: 8 to 12 million Rupiah per month. Location: Sudirman, 200 meters from TransJakarta station. Accessibility: High - JAWS compatible, flexible hours, remote option.',
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
      'Position: Data Analyst at PT Data Insights. Salary: 10 to 15 million Rupiah per month. Location: Thamrin, 150 meters from TransJakarta station. Accessibility: Medium - Screen reader support available.',
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
  const [jobs] = useState<JobListing[]>(mockJobs);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());

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
    // TODO: Navigate to detail page or show modal
    console.log('View details for job:', jobId);
  };

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Cari Pekerjaan</h1>
          <p className="text-muted-foreground">
            Geser kanan untuk melamar, geser kiri untuk melewatkan
          </p>
        </header>

        <JobCardStack
          jobs={jobs}
          onApply={handleApply}
          onDismiss={handleDismiss}
          onViewDetails={handleViewDetails}
        />

        {/* Applied jobs count */}
        {appliedJobs.size > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Anda telah melamar {appliedJobs.size} pekerjaan
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
