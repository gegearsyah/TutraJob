/**
 * Saved Job Card Component with Remove Button and Focus/Long Press Announcements
 */

'use client';

import { JobCard } from '@/components/job-seeker/JobCard';
import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';
import type { JobListing } from '@/types/job';
import { Trash2 } from 'lucide-react';

interface SavedJobCardProps {
  job: JobListing;
  onApply: (jobId: string) => void;
  onDismiss: (jobId: string) => void;
  onViewDetails: (jobId: string) => void;
  onRemove: (jobId: string) => void;
}

export function SavedJobCard({
  job,
  onApply,
  onDismiss,
  onViewDetails,
  onRemove,
}: SavedJobCardProps) {
  const removeButtonProps = useFocusAnnouncement({
    description: `Hapus pekerjaan ${job.title} di ${job.company} dari daftar tersimpan. Setelah dihapus, pekerjaan ini tidak akan muncul lagi di halaman tersimpan.`,
    label: 'Tombol Hapus',
    context: 'Tekan Enter untuk menghapus pekerjaan ini',
    announceOnFocus: true,
    announceOnLongPress: true,
  });

  return (
    <div className="relative">
      <JobCard
        job={job}
        onApply={onApply}
        onDismiss={onDismiss}
        onViewDetails={onViewDetails}
      />
      <button
        onClick={() => onRemove(job.id)}
        className="absolute top-4 right-4 p-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={`Hapus ${job.title} dari daftar tersimpan`}
        {...removeButtonProps}
      >
        <Trash2 className="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  );
}
