/**
 * Application Card Component with Focus/Long Press Announcements
 * Wrapper for application cards with built-in accessibility
 */

'use client';

import { useState } from 'react';
import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';
import { AnnounceableText } from './AnnounceableText';
import { FocusAnnouncement } from './FocusAnnouncement';
import { ApplicationStatusHistory } from '@/components/job-seeker/ApplicationStatusHistory';
import { CheckCircle2, Clock, XCircle, Calendar, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Application, ApplicationStatus, ApplicationStatusUpdate } from '@/types/application';

interface ApplicationCardProps {
  application: Application;
  jobTitle?: string;
  companyName?: string;
  statusConfig: Record<
    ApplicationStatus,
    { label: string; icon: React.ReactNode; color: string }
  >;
  formatDate: (date: Date) => string;
  statusHistory?: ApplicationStatusUpdate[];
}

export function ApplicationCard({
  application,
  jobTitle = 'Software Developer',
  companyName = 'PT Teknologi Indonesia',
  statusConfig,
  formatDate,
  statusHistory = [],
}: ApplicationCardProps) {
  const [showHistory, setShowHistory] = useState(false);
  const statusInfo = statusConfig[application.status] || statusConfig.applied;

  const cardProps = useFocusAnnouncement({
    description: `Lamaran untuk posisi ${jobTitle} di ${companyName}. Status: ${statusInfo.label}. Dikirim pada ${formatDate(application.appliedAt)}. ${application.rpaUsed ? 'Lamaran dikirim secara otomatis menggunakan RPA.' : 'Lamaran dikirim secara manual.'} ${application.interviewDate ? `Wawancara dijadwalkan pada ${formatDate(application.interviewDate)}.` : ''}`,
    label: 'Kartu Lamaran',
    context: 'Tekan Enter untuk melihat detail lengkap',
    announceOnFocus: true,
    announceOnLongPress: true,
  });

  const statusProps = useFocusAnnouncement({
    description: `Status lamaran: ${statusInfo.label}. ${statusInfo.label === 'Sedang Ditinjau' ? 'Lamaran Anda sedang ditinjau oleh perusahaan. Tunggu update lebih lanjut.' : statusInfo.label === 'Tawaran Diterima' ? 'Selamat! Anda menerima tawaran kerja. Periksa detail tawaran untuk langkah selanjutnya.' : statusInfo.label === 'Ditolak' ? 'Maaf, lamaran Anda tidak diterima. Terus coba lamaran lainnya.' : statusInfo.label === 'Wawancara Dijadwalkan' ? 'Wawancara telah dijadwalkan. Siapkan diri Anda untuk wawancara.' : 'Lamaran telah dikirim dan menunggu konfirmasi.'}`,
    label: `Status: ${statusInfo.label}`,
    announceOnFocus: true,
    announceOnLongPress: true,
  });

  return (
    <div
      className="p-6 border border-border rounded-lg bg-card hover:shadow-card-hover transition-all"
      tabIndex={0}
      {...cardProps}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
            <AnnounceableText
              description={`Posisi yang dilamar: ${jobTitle}. Ini adalah posisi yang Anda lamar di perusahaan ${companyName}.`}
              label="Posisi"
              as="h3"
              className="text-xl font-semibold"
            >
              {jobTitle}
            </AnnounceableText>
            {application.rpaUsed && (
              <FocusAnnouncement
                description="Lamaran ini dikirim secara otomatis menggunakan sistem RPA (Robotic Process Automation). Sistem otomatis mengisi formulir lamaran untuk Anda."
                label="Badge Otomatis"
              >
                <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full" tabIndex={0}>
                  Otomatis
                </span>
              </FocusAnnouncement>
            )}
          </div>
          <AnnounceableText
            description={`Nama perusahaan: ${companyName}. Ini adalah perusahaan tempat Anda melamar untuk posisi ${jobTitle}.`}
            label="Perusahaan"
            as="p"
            className="text-muted-foreground mb-4"
          >
            {companyName}
          </AnnounceableText>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <AnnounceableText
              description={`Tanggal lamaran dikirim: ${formatDate(application.appliedAt)}. Ini adalah tanggal ketika Anda mengirim lamaran untuk posisi ini.`}
              label="Tanggal Dikirim"
            >
              Dikirim: {formatDate(application.appliedAt)}
            </AnnounceableText>
            {application.interviewDate && (
              <AnnounceableText
                description={`Tanggal wawancara dijadwalkan: ${formatDate(application.interviewDate)}. Pastikan Anda siap untuk wawancara pada tanggal ini.`}
                label="Tanggal Wawancara"
              >
                Wawancara: {formatDate(application.interviewDate)}
              </AnnounceableText>
            )}
          </div>
        </div>
        <div
          className={`flex items-center gap-2 ${statusInfo.color}`}
          tabIndex={0}
          {...statusProps}
        >
          <span aria-hidden="true">{statusInfo.icon}</span>
          <span className="font-medium">{statusInfo.label}</span>
        </div>
      </div>

      {/* Status History Toggle */}
      {statusHistory.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between p-2 text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
            aria-expanded={showHistory}
            aria-label={showHistory ? 'Sembunyikan riwayat status' : 'Tampilkan riwayat status'}
          >
            <span>Riwayat Status ({statusHistory.length})</span>
            {showHistory ? (
              <ChevronUp className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          {showHistory && (
            <div className="mt-4">
              <ApplicationStatusHistory
                applicationId={application.id}
                currentStatus={application.status}
                statusHistory={statusHistory}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
