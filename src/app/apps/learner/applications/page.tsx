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
import { announce } from '@/lib/audio';
import { CheckCircle2, Clock, XCircle, Calendar, Building2 } from 'lucide-react';
import type { Application, ApplicationStatus } from '@/types/application';

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

        setApplications(mockApplications);
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
          <h1 className="text-3xl font-bold mb-2">Riwayat Lamaran</h1>
          <p className="text-muted-foreground">
            Lacak status semua lamaran pekerjaan Anda
          </p>
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
            {applications.map((application) => {
              const statusInfo = getStatusInfo(application.status);
              return (
                <div
                  key={application.id}
                  className="p-6 border border-border rounded-lg bg-card hover:shadow-card-hover transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Building2 className="w-5 h-5 text-muted-foreground" />
                        <h3 className="text-xl font-semibold">
                          Software Developer
                        </h3>
                        {application.rpaUsed && (
                          <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                            Otomatis
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-4">
                        PT Teknologi Indonesia
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          Dikirim: {formatDate(application.appliedAt)}
                        </span>
                        {application.interviewDate && (
                          <span>
                            Wawancara:{' '}
                            {formatDate(application.interviewDate)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-2 ${statusInfo.color}`}
                    >
                      {statusInfo.icon}
                      <span className="font-medium">{statusInfo.label}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Statistics */}
        {applications.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border border-border rounded-lg bg-card text-center">
              <div className="text-2xl font-bold text-primary">
                {applications.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Lamaran</div>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card text-center">
              <div className="text-2xl font-bold text-yellow-500">
                {
                  applications.filter((a) => a.status === 'under-review')
                    .length
                }
              </div>
              <div className="text-sm text-muted-foreground">Sedang Ditinjau</div>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card text-center">
              <div className="text-2xl font-bold text-green-500">
                {
                  applications.filter((a) => a.status === 'offer-received')
                    .length
                }
              </div>
              <div className="text-sm text-muted-foreground">Tawaran</div>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card text-center">
              <div className="text-2xl font-bold text-purple-500">
                {
                  applications.filter(
                    (a) => a.status === 'interview-scheduled'
                  ).length
                }
              </div>
              <div className="text-sm text-muted-foreground">Wawancara</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
