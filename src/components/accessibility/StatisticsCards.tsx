/**
 * Statistics Cards Component with Focus/Long Press Announcements
 */

'use client';

import { FocusAnnouncement } from './FocusAnnouncement';
import { AnnounceableText } from './AnnounceableText';
import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';
import type { Application } from '@/types/application';

interface StatisticsCardsProps {
  applications: Application[];
}

export function StatisticsCards({ applications }: StatisticsCardsProps) {
  const totalCount = applications.length;
  const underReviewCount = applications.filter((a) => a.status === 'under-review').length;
  const offerCount = applications.filter((a) => a.status === 'offer-received').length;
  const interviewCount = applications.filter((a) => a.status === 'interview-scheduled').length;

  const totalCardProps = useFocusAnnouncement({
    description: `Total lamaran yang telah Anda kirim: ${totalCount} lamaran. Ini adalah jumlah keseluruhan lamaran pekerjaan yang telah Anda kirim.`,
    label: 'Statistik Total Lamaran',
    announceOnFocus: true,
    announceOnLongPress: true,
  });

  const reviewCardProps = useFocusAnnouncement({
    description: `Lamaran yang sedang ditinjau: ${underReviewCount} lamaran. Status ini berarti lamaran Anda sedang dalam proses review oleh perusahaan.`,
    label: 'Statistik Sedang Ditinjau',
    announceOnFocus: true,
    announceOnLongPress: true,
  });

  const offerCardProps = useFocusAnnouncement({
    description: `Tawaran yang diterima: ${offerCount} tawaran. Selamat! Anda telah menerima ${offerCount} tawaran kerja.`,
    label: 'Statistik Tawaran',
    announceOnFocus: true,
    announceOnLongPress: true,
  });

  const interviewCardProps = useFocusAnnouncement({
    description: `Wawancara yang dijadwalkan: ${interviewCount} wawancara. Anda memiliki ${interviewCount} wawancara yang telah dijadwalkan.`,
    label: 'Statistik Wawancara',
    announceOnFocus: true,
    announceOnLongPress: true,
  });

  return (
    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 border border-border rounded-lg bg-card text-center" tabIndex={0} {...totalCardProps}>
        <AnnounceableText
          description={`Jumlah total: ${totalCount} lamaran`}
          label="Total"
          as="div"
          className="text-2xl font-bold text-primary"
        >
          {totalCount}
        </AnnounceableText>
        <div className="text-sm text-muted-foreground">Total Lamaran</div>
      </div>
      <div className="p-4 border border-border rounded-lg bg-card text-center" tabIndex={0} {...reviewCardProps}>
        <AnnounceableText
          description={`Jumlah sedang ditinjau: ${underReviewCount} lamaran`}
          label="Sedang Ditinjau"
          as="div"
          className="text-2xl font-bold text-yellow-500"
        >
          {underReviewCount}
        </AnnounceableText>
        <div className="text-sm text-muted-foreground">Sedang Ditinjau</div>
      </div>
      <div className="p-4 border border-border rounded-lg bg-card text-center" tabIndex={0} {...offerCardProps}>
        <AnnounceableText
          description={`Jumlah tawaran: ${offerCount} tawaran`}
          label="Tawaran"
          as="div"
          className="text-2xl font-bold text-green-500"
        >
          {offerCount}
        </AnnounceableText>
        <div className="text-sm text-muted-foreground">Tawaran</div>
      </div>
      <div className="p-4 border border-border rounded-lg bg-card text-center" tabIndex={0} {...interviewCardProps}>
        <AnnounceableText
          description={`Jumlah wawancara: ${interviewCount} wawancara`}
          label="Wawancara"
          as="div"
          className="text-2xl font-bold text-purple-500"
        >
          {interviewCount}
        </AnnounceableText>
        <div className="text-sm text-muted-foreground">Wawancara</div>
      </div>
    </div>
  );
}
