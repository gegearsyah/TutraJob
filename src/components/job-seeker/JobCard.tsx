/**
 * Job Card Component
 * Based on FEATURE_SPECIFICATION.md Section 1.1
 * Accessible, gesture-enabled job card for blind users
 */

'use client';

import { useState, useEffect } from 'react';
import type { JobListing } from '@/types/job';
import { useGestureDetection } from '@/lib/gestures';
import { triggerHaptic } from '@/lib/haptic';
import { announce, playAudioCue } from '@/lib/audio';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';
import { cn } from '@/lib/utils';

interface JobCardProps {
  job: JobListing;
  onApply: (jobId: string) => void;
  onDismiss: (jobId: string) => void;
  onViewDetails: (jobId: string) => void;
  className?: string;
  matchScore?: number; // Optional match score (0-100)
}

export function JobCard({
  job,
  onApply,
  onDismiss,
  onViewDetails,
  className,
  matchScore,
}: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSwiping, setIsSwiping] = useState<'left' | 'right' | null>(null);
  const isMounted = useIsMounted();

  // Build detailed job description for focus/long press announcement
  const buildJobDescription = (): string => {
    const parts: string[] = [];
    parts.push(`Pekerjaan: ${job.title} di ${job.company}`);
    
    if (job.salary) {
      if (job.salary.min && job.salary.max) {
        parts.push(`Gaji: ${formatCurrency(job.salary.min)} hingga ${formatCurrency(job.salary.max)} per ${job.salary.period === 'monthly' ? 'bulan' : 'tahun'}`);
      } else if (job.salary.min) {
        parts.push(`Gaji mulai dari ${formatCurrency(job.salary.min)} per ${job.salary.period === 'monthly' ? 'bulan' : 'tahun'}`);
      }
    }
    
    parts.push(`Lokasi: ${job.location.address}, ${job.location.city}`);
    if (job.location.transjakartaDistance) {
      parts.push(`Jarak: ${job.location.transjakartaDistance} meter dari stasiun TransJakarta`);
    }
    
    parts.push(`Aksesibilitas: ${getAccessibilityLabel(job.accessibility.level)}`);
    if (job.accessibility.details.length > 0) {
      parts.push(`Dukungan: ${job.accessibility.details.join(', ')}`);
    }
    
    parts.push(`Jenis kerja: ${job.workArrangement === 'remote' ? 'Remote' : job.workArrangement === 'hybrid' ? 'Hybrid' : 'On-site'}`);
    
    parts.push(`Ringkasan: ${job.summary}`);
    parts.push('Geser kanan untuk melamar, geser kiri untuk melewatkan, ketuk dua kali untuk detail lengkap');
    
    return parts.join('. ');
  };

  // Focus/long press announcement for the card
  const cardAnnouncementProps = useFocusAnnouncement({
    description: buildJobDescription(),
    label: `Kartu pekerjaan: ${job.title}`,
    context: 'Tekan Enter untuk melihat detail, atau gunakan gerakan geser',
    announceOnFocus: true,
    announceOnLongPress: true,
    delay: 200,
  });

  // Focus/long press announcements for action buttons
  const applyButtonProps = useFocusAnnouncement({
    description: `Melamar untuk posisi ${job.title} di ${job.company}. Setelah melamar, Anda akan menerima konfirmasi dan pekerjaan akan muncul di halaman Lamaran`,
    label: 'Tombol Lamar',
    context: 'Tekan Enter untuk melamar pekerjaan ini',
    announceOnFocus: true,
    announceOnLongPress: true,
  });
  
  const dismissButtonProps = useFocusAnnouncement({
    description: `Melewatkan pekerjaan ${job.title} di ${job.company}. Pekerjaan ini akan dihapus dari daftar dan tidak akan muncul lagi`,
    label: 'Tombol Lewati',
    context: 'Tekan Enter untuk melewatkan pekerjaan ini',
    announceOnFocus: true,
    announceOnLongPress: true,
  });

  // Gesture handlers
  const gestureHandlers = useGestureDetection({
    onFlickRight: () => {
      if (isMounted) {
        triggerHaptic('apply-success');
        playAudioCue('apply-success');
      }
      onApply(job.id);
    },
    onFlickLeft: () => {
      if (isMounted) {
        triggerHaptic('dismiss');
        playAudioCue('dismiss');
      }
      onDismiss(job.id);
    },
    onDoubleTap: () => {
      if (isMounted) {
        triggerHaptic('confirmation');
        playAudioCue('card-load');
      }
      setIsExpanded(!isExpanded);
      onViewDetails(job.id);
    },
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup is handled internally by gesture detector
    };
  }, []);

  // Auto-announce job summary when card loads (client-side only)
  useEffect(() => {
    if (!isMounted) return;

    const timer = setTimeout(() => {
      announce(job.summary);
    }, 500);

    return () => clearTimeout(timer);
  }, [job.summary, isMounted]);

  return (
        <article
          role="article"
          aria-label={`Kartu pekerjaan: ${job.title} di ${job.company}`}
          aria-describedby={`job-summary-${job.id}`}
          tabIndex={0}
          className={cn(
            'relative w-full max-w-md mx-auto bg-card border border-border rounded-lg p-6 overflow-hidden',
            'shadow-card hover:shadow-card-hover transition-all duration-300',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            // Only apply swipe styles on client to prevent hydration mismatch
            isMounted && isSwiping === 'right' && 'translate-x-20 rotate-3 opacity-50 bg-green-500/10 border-green-500/30',
            isMounted && isSwiping === 'left' && '-translate-x-20 -rotate-3 opacity-50 bg-red-500/10 border-red-500/30',
            className
          )}
          {...gestureHandlers}
          style={{ touchAction: 'pan-y pinch-zoom' }} // Allow vertical scrolling and pinch zoom, but enable horizontal gestures
          {...cardAnnouncementProps}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsExpanded(!isExpanded);
          onViewDetails(job.id);
        } else if (e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          onApply(job.id);
        } else if (e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          onDismiss(job.id);
        }
      }}
    >
      {/* Swipe Indicators - Visual hints for first-time users */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left swipe indicator (Dismiss) */}
        <div
          className={cn(
            'absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-red-500/20 to-transparent flex items-center justify-center',
            'transition-opacity duration-300',
            isSwiping === 'left' ? 'opacity-100' : 'opacity-0'
          )}
          aria-hidden="true"
        >
          <span className="text-4xl">✕</span>
        </div>
        
        {/* Right swipe indicator (Apply) */}
        <div
          className={cn(
            'absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-green-500/20 to-transparent flex items-center justify-center',
            'transition-opacity duration-300',
            isSwiping === 'right' ? 'opacity-100' : 'opacity-0'
          )}
          aria-hidden="true"
        >
          <span className="text-4xl">✓</span>
        </div>
      </div>

      {/* Header */}
      <header className="mb-4">
        <h2
          id={`job-title-${job.id}`}
          className="text-2xl font-bold text-foreground mb-2"
        >
          {job.title}
        </h2>
        <p className="text-lg text-muted-foreground">{job.company}</p>
      </header>

      {/* Divider */}
      <div className="border-t border-border my-4" aria-hidden="true" />

      {/* Key Information */}
      <div className="space-y-3 mb-4">
        {job.salary && (
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-label="Salary" role="img">
              💰
            </span>
            <span className="text-base">
              {job.salary.min && job.salary.max
                ? `${formatCurrency(job.salary.min)} - ${formatCurrency(job.salary.max)}`
                : job.salary.min
                  ? `Mulai dari ${formatCurrency(job.salary.min)}`
                  : 'Gaji tidak disebutkan'}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-label="Location" role="img">
            📍
          </span>
          <span className="text-base">
            {job.location.address}, {job.location.city}
            {job.location.transjakartaDistance && (
              <span className="text-muted-foreground">
                {' '}
                ({job.location.transjakartaDistance}m dari TransJakarta)
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-label="Accessibility" role="img">
            ♿
          </span>
          <span className="text-base">
            Aksesibilitas: {getAccessibilityLabel(job.accessibility.level)}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border my-4" aria-hidden="true" />

      {/* Summary */}
      <div id={`job-summary-${job.id}`} className="mb-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {job.summary}
        </p>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div
          className="mt-4 pt-4 border-t border-border"
          aria-label="Full job description"
        >
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Deskripsi Pekerjaan</h3>
              <p className="text-sm text-muted-foreground">{job.description}</p>
            </div>

            {job.requirements.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Persyaratan</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {job.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.accessibility.details.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Dukungan Aksesibilitas</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {job.accessibility.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons (Keyboard Accessible) - Mobile optimized */}
      <div
        role="group"
        aria-label="Job actions"
        className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 pt-4 border-t border-border"
      >
        <button
          onClick={() => {
            triggerHaptic('apply-success');
            playAudioCue('apply-success');
            onApply(job.id);
          }}
          className="flex-1 min-h-[48px] px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={`Lamar untuk ${job.title} di ${job.company}`}
          {...applyButtonProps}
        >
          Lamar
        </button>
        <button
          onClick={() => {
            triggerHaptic('dismiss');
            playAudioCue('dismiss');
            onDismiss(job.id);
          }}
          className="flex-1 min-h-[48px] px-4 py-3 bg-muted text-muted-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={`Lewati ${job.title}`}
          {...dismissButtonProps}
        >
          Lewati
        </button>
      </div>

      {/* Screen reader instructions */}
      <div className="sr-only" aria-live="polite">
        Geser kanan untuk melamar, geser kiri untuk melewatkan, ketuk dua kali
        untuk melihat detail lengkap. Atau gunakan tombol A untuk melamar, D
        untuk melewatkan.
      </div>
    </article>
  );
}

// Helper functions
function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)} juta`;
  }
  return new Intl.NumberFormat('id-ID').format(amount);
}

function getAccessibilityLabel(level: 'high' | 'medium' | 'low'): string {
  const labels = {
    high: 'Tinggi',
    medium: 'Sedang',
    low: 'Rendah',
  };
  return labels[level];
}
