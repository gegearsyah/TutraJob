/**
 * Application Tracking Page
 * View and track all job applications
 */

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { usePageAnnouncement } from '@/hooks/usePageAnnouncement';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { FocusAnnouncement } from '@/components/accessibility/FocusAnnouncement';
import { AnnounceableText } from '@/components/accessibility/AnnounceableText';
import { ApplicationCard } from '@/components/accessibility/ApplicationCard';
import { StatisticsCards } from '@/components/accessibility/StatisticsCards';
import { announce } from '@/lib/audio';
import { CheckCircle2, Clock, XCircle, Calendar, Building2 } from 'lucide-react';
import type { Application, ApplicationStatus, ApplicationStatusUpdate } from '@/types/application';

const statusConfig: Record<
  ApplicationStatus,
  { label: string; icon: React.ReactNode; color: string }
> = {
  applied: {
    label: 'Telah Dikirim',
    icon: <CheckCircle2 className="w-5 h-5" />,
    color: 'text-blue-500',
  },
  'under-review': {
    label: 'Sedang Ditinjau',
    icon: <Clock className="w-5 h-5" />,
    color: 'text-yellow-500',
  },
  'interview-scheduled': {
    label: 'Wawancara Dijadwalkan',
    icon: <Calendar className="w-5 h-5" />,
    color: 'text-purple-500',
  },
  'offer-received': {
    label: 'Tawaran Diterima',
    icon: <CheckCircle2 className="w-5 h-5" />,
    color: 'text-green-500',
  },
  rejected: {
    label: 'Ditolak',
    icon: <XCircle className="w-5 h-5" />,
    color: 'text-red-500',
  },
};

export default function ApplicationsPage() {
  // Announce page on load and stop previous announcements
  usePageAnnouncement('Lamaran Saya', 'Lacak status lamaran pekerjaan Anda');

  const [applications, setApplications] = useState<Application[]>([]);
  const [statusHistoryMap, setStatusHistoryMap] = useState<Record<string, ApplicationStatusUpdate[]>>({});
  const [loading, setLoading] = useState(true);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!isMounted) return;

    const loadApplications = async () => {
      try {
        // TODO: Replace with actual Supabase query
        // const { data, error } = await supabase
        //   .from('applications')
        //   .select('*, job_listings(*)')
        //   .eq('user_id', userId)
        //   .order('applied_at', { ascending: false });

        // Mock data for now
        const mockApplications: Application[] = [
          {
            id: '1',
            userId: 'user-1',
            jobId: 'job-1',
            status: 'under-review',
            appliedAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-16'),
            rpaUsed: true,
          },
          {
            id: '2',
            userId: 'user-1',
            jobId: 'job-2',
            status: 'applied',
            appliedAt: new Date('2024-01-20'),
            updatedAt: new Date('2024-01-20'),
            rpaUsed: false,
          },
        ];

        // Mock status history data
        const mockStatusHistory: Record<string, ApplicationStatusUpdate[]> = {
          '1': [
            {
              status: 'applied',
              updatedAt: new Date('2024-01-15T10:00:00'),
              message: 'Lamaran berhasil dikirim',
            },
            {
              status: 'under-review',
              updatedAt: new Date('2024-01-16T14:30:00'),
              message: 'Lamaran sedang ditinjau oleh tim HR',
            },
          ],
          '2': [
            {
              status: 'applied',
              updatedAt: new Date('2024-01-20T09:15:00'),
              message: 'Lamaran berhasil dikirim',
            },
          ],
        };

        setApplications(mockApplications);
        setStatusHistoryMap(mockStatusHistory);
      } catch (error) {
        console.error('Error loading applications:', error);
        if (isMounted) {
          announce('Terjadi kesalahan saat memuat data lamaran');
        }
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, [isMounted]);

  const getStatusInfo = (status: ApplicationStatus) => {
    return statusConfig[status] || statusConfig.applied;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Memuat data lamaran...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <FocusAnnouncement
            description="Halaman Riwayat Lamaran. Di halaman ini, Anda dapat melihat semua lamaran pekerjaan yang telah dikirim, status setiap lamaran, tanggal lamaran, dan statistik keseluruhan."
            label="Halaman Riwayat Lamaran"
          >
            <h1 className="text-3xl font-bold mb-2" tabIndex={0}>Riwayat Lamaran</h1>
          </FocusAnnouncement>
          <AnnounceableText
            description="Halaman ini menampilkan semua lamaran pekerjaan yang telah Anda kirim. Anda dapat melacak status setiap lamaran, melihat tanggal lamaran, dan memeriksa statistik keseluruhan."
            label="Deskripsi Halaman"
            as="p"
            className="text-muted-foreground"
          >
            Lacak status semua lamaran pekerjaan Anda
          </AnnounceableText>
        </header>

        {applications.length === 0 ? (
          <div className="text-center py-12 border border-border rounded-lg bg-card">
            <p className="text-muted-foreground mb-4">
              Belum ada lamaran yang dikirim
            </p>
            <AccessibleButton
              asLink
              href="/apps/learner/jobs"
              variant="primary"
              announcementText="Membuka halaman cari pekerjaan"
              className="w-full sm:w-auto"
            >
              Cari pekerjaan sekarang
            </AccessibleButton>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                jobTitle="Software Developer"
                companyName="PT Teknologi Indonesia"
                statusConfig={statusConfig}
                formatDate={formatDate}
                statusHistory={statusHistoryMap[application.id] || []}
              />
            ))}
          </div>
        )}

        {/* Statistics */}
        {applications.length > 0 && (
          <StatisticsCards applications={applications} />
        )}
      </div>
    </div>
  );
}
