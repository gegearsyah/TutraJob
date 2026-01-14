/**
 * Application Status History Component
 * Displays a timeline of status changes for an application
 */

'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, XCircle, Calendar, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { FocusAnnouncement } from '@/components/accessibility/FocusAnnouncement';
import { AnnounceableText } from '@/components/accessibility/AnnounceableText';
import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';
import type { ApplicationStatus, ApplicationStatusUpdate } from '@/types/application';

interface ApplicationStatusHistoryProps {
  applicationId: string;
  currentStatus: ApplicationStatus;
  statusHistory: ApplicationStatusUpdate[];
  className?: string;
}

const statusIcons: Record<ApplicationStatus, React.ReactNode> = {
  applied: <FileText className="w-5 h-5" />,
  'under-review': <Clock className="w-5 h-5" />,
  'interview-scheduled': <Calendar className="w-5 h-5" />,
  'offer-received': <CheckCircle2 className="w-5 h-5" />,
  rejected: <XCircle className="w-5 h-5" />,
};

const statusLabels: Record<ApplicationStatus, string> = {
  applied: 'Telah Dikirim',
  'under-review': 'Sedang Ditinjau',
  'interview-scheduled': 'Wawancara Dijadwalkan',
  'offer-received': 'Tawaran Diterima',
  rejected: 'Ditolak',
};

const statusColors: Record<ApplicationStatus, string> = {
  applied: 'bg-blue-500',
  'under-review': 'bg-yellow-500',
  'interview-scheduled': 'bg-purple-500',
  'offer-received': 'bg-green-500',
  rejected: 'bg-red-500',
};

export function ApplicationStatusHistory({
  applicationId,
  currentStatus,
  statusHistory,
  className,
}: ApplicationStatusHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMounted = useIsMounted();

  // Sort history by date (newest first)
  const sortedHistory = [...statusHistory].sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  );

  // Format date for display
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Format relative time
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) {
      return `${days} hari yang lalu`;
    } else if (hours > 0) {
      return `${hours} jam yang lalu`;
    } else if (minutes > 0) {
      return `${minutes} menit yang lalu`;
    } else {
      return 'Baru saja';
    }
  };

  const toggleButtonProps = useFocusAnnouncement({
    description: isExpanded
      ? 'Sembunyikan riwayat lengkap perubahan status lamaran'
      : 'Tampilkan riwayat lengkap perubahan status lamaran',
    label: isExpanded ? 'Tombol Sembunyikan Riwayat' : 'Tombol Tampilkan Riwayat',
    context: 'Tekan Enter untuk mengubah tampilan riwayat',
    announceOnFocus: true,
    announceOnLongPress: true,
  });

  if (!isMounted) return null;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Current Status */}
      <div className="p-4 border border-border rounded-lg bg-card">
        <FocusAnnouncement
          description={`Status saat ini: ${statusLabels[currentStatus]}. ${sortedHistory.length > 0 ? `Terakhir diperbarui ${formatRelativeTime(sortedHistory[0].updatedAt)}.` : ''}`}
          label="Status Saat Ini"
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-white',
                statusColors[currentStatus]
              )}
              aria-hidden="true"
            >
              {statusIcons[currentStatus]}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{statusLabels[currentStatus]}</h3>
              {sortedHistory.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Diperbarui {formatRelativeTime(sortedHistory[0].updatedAt)}
                </p>
              )}
            </div>
          </div>
        </FocusAnnouncement>
      </div>

      {/* Toggle History Button */}
      {sortedHistory.length > 0 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-3 border border-border rounded-lg hover:bg-muted transition-colors flex items-center justify-between min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-expanded={isExpanded}
          {...toggleButtonProps}
        >
          <span className="font-medium">
            {isExpanded ? 'Sembunyikan' : 'Tampilkan'} Riwayat Status ({sortedHistory.length} perubahan)
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-5 h-5" aria-hidden="true" />
          )}
        </button>
      )}

      {/* Status History Timeline */}
      {isExpanded && sortedHistory.length > 0 && (
        <div className="space-y-4" role="region" aria-label="Riwayat perubahan status">
          <AnnounceableText
            description={`Riwayat lengkap perubahan status lamaran. Total ${sortedHistory.length} perubahan status.`}
            label="Judul Riwayat"
            as="h3"
            className="font-semibold text-lg mb-4"
          >
            Riwayat Perubahan Status
          </AnnounceableText>

          <div className="relative">
            {/* Timeline line */}
            <div
              className="absolute left-5 top-0 bottom-0 w-0.5 bg-border"
              aria-hidden="true"
            />

            {/* Timeline items */}
            <div className="space-y-6">
              {sortedHistory.map((update, index) => {
                const isLatest = index === 0;
                const status = update.status as ApplicationStatus;

                return (
                  <div key={`${update.updatedAt.getTime()}-${index}`} className="relative flex gap-4">
                    {/* Timeline dot */}
                    <div
                      className={cn(
                        'relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-white',
                        statusColors[status],
                        isLatest && 'ring-2 ring-offset-2 ring-primary'
                      )}
                      aria-hidden="true"
                    >
                      {statusIcons[status]}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-6">
                      <FocusAnnouncement
                        description={`Status: ${statusLabels[status]}. ${formatDate(update.updatedAt)}. ${update.message ? `Pesan: ${update.message}` : 'Tidak ada pesan tambahan.'}`}
                        label={`Status ${statusLabels[status]}`}
                      >
                        <div className="p-4 border border-border rounded-lg bg-card">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">{statusLabels[status]}</h4>
                            <time
                              dateTime={update.updatedAt.toISOString()}
                              className="text-sm text-muted-foreground"
                            >
                              {formatDate(update.updatedAt)}
                            </time>
                          </div>
                          {update.message && (
                            <AnnounceableText
                              description={`Pesan tambahan: ${update.message}`}
                              label="Pesan Status"
                              as="p"
                              className="text-sm text-muted-foreground mt-2"
                            >
                              {update.message}
                            </AnnounceableText>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatRelativeTime(update.updatedAt)}
                          </p>
                        </div>
                      </FocusAnnouncement>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {sortedHistory.length === 0 && (
        <div className="p-4 border border-border rounded-lg bg-card text-center">
          <AnnounceableText
            description="Belum ada riwayat perubahan status. Status akan diperbarui secara otomatis saat ada perubahan."
            label="Tidak Ada Riwayat"
            as="p"
            className="text-sm text-muted-foreground"
          >
            Belum ada riwayat perubahan status
          </AnnounceableText>
        </div>
      )}
    </div>
  );
}
