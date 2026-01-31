/**
 * Job Card Stack Component
 * Manages a stack of job cards with gesture navigation
 */

'use client';

import { useState, useEffect } from 'react';
import type { JobListing } from '@/types/job';
import { JobCard } from './JobCard';
import { announce } from '@/lib/audio';
import { useIsMounted } from '@/lib/hooks/useIsMounted';

interface JobCardStackProps {
  jobs: JobListing[];
  onApply: (jobId: string) => void;
  onDismiss: (jobId: string) => void;
  onViewDetails: (jobId: string) => void;
  className?: string;
  matchScores?: Map<string, number>; // Map of jobId to match score
}

export function JobCardStack({
  jobs,
  onApply,
  onDismiss,
  onViewDetails,
  className,
  matchScores,
}: JobCardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissedJobs, setDismissedJobs] = useState<Set<string>>(new Set());
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const isMounted = useIsMounted();

  const currentJob = jobs[currentIndex];

  const handleApply = (jobId: string) => {
    setAppliedJobs((prev) => new Set(prev).add(jobId));
    onApply(jobId);
    moveToNext();
  };

  const handleDismiss = (jobId: string) => {
    setDismissedJobs((prev) => new Set(prev).add(jobId));
    onDismiss(jobId);
    moveToNext();
  };

  const moveToNext = () => {
    if (currentIndex < jobs.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // No more jobs (only announce on client)
      if (isMounted) {
        announce('Tidak ada pekerjaan lagi. Geser ke bawah untuk memuat ulang.');
      }
    }
  };

  const handleViewDetails = (jobId: string) => {
    onViewDetails(jobId);
  };

  // Announce when new card loads (client-side only)
  useEffect(() => {
    if (!isMounted || !currentJob) return;

    const timer = setTimeout(() => {
      announce(
        `Pekerjaan ${currentIndex + 1} dari ${jobs.length}. ${currentJob.summary}`
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [currentIndex, currentJob, jobs.length, isMounted]);

  if (!currentJob) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Tidak ada pekerjaan tersedia</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="relative">
        <JobCard
          key={currentJob.id}
          job={currentJob}
          onApply={handleApply}
          onDismiss={handleDismiss}
          onViewDetails={handleViewDetails}
          matchScore={matchScores?.get(currentJob.id)}
        />
      </div>

      {/* Progress indicator */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          {currentIndex + 1} dari {jobs.length}
        </p>
        <div className="mt-2 w-full max-w-md mx-auto h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / jobs.length) * 100}%` }}
            role="progressbar"
            aria-valuenow={currentIndex + 1}
            aria-valuemin={1}
            aria-valuemax={jobs.length}
            aria-label={`Progress: ${currentIndex + 1} dari ${jobs.length} pekerjaan`}
          />
        </div>
      </div>
    </div>
  );
}
