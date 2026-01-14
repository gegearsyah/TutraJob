/**
 * Application Deadline Reminders Hook
 * Automated reminders for job application deadlines
 * Based on FEATURE_CHECKLIST.md
 */

'use client';

import { useEffect, useState } from 'react';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { announce } from '@/lib/audio';
import { triggerHaptic } from '@/lib/haptic';
import type { JobListing } from '@/types/job';

interface DeadlineReminder {
  jobId: string;
  jobTitle: string;
  company: string;
  deadline: Date;
  daysUntil: number;
}

export function useDeadlineReminders(jobs: JobListing[]) {
  const [reminders, setReminders] = useState<DeadlineReminder[]>([]);
  const [notifiedJobs, setNotifiedJobs] = useState<Set<string>>(new Set());
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!isMounted) return;

    // Check for jobs with deadlines
    const jobsWithDeadlines = jobs
      .filter(job => job.deadline && new Date(job.deadline) > new Date())
      .map(job => {
        const deadline = new Date(job.deadline!);
        const now = new Date();
        const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        return {
          jobId: job.id,
          jobTitle: job.title,
          company: job.company,
          deadline,
          daysUntil,
        };
      })
      .filter(reminder => reminder.daysUntil <= 3 && reminder.daysUntil >= 0)
      .sort((a, b) => a.daysUntil - b.daysUntil);

    setReminders(jobsWithDeadlines);

    // Check for reminders that need notification
    jobsWithDeadlines.forEach(reminder => {
      if (!notifiedJobs.has(reminder.jobId)) {
        // Notify for 1 day and 3 days before deadline
        if (reminder.daysUntil === 1 || reminder.daysUntil === 3) {
          const message = reminder.daysUntil === 1
            ? `Peringatan: Deadline lamaran untuk ${reminder.jobTitle} di ${reminder.company} besok!`
            : `Pengingat: Deadline lamaran untuk ${reminder.jobTitle} di ${reminder.company} dalam ${reminder.daysUntil} hari.`;

          announce(message);
          triggerHaptic('loading');
          setNotifiedJobs(prev => new Set(prev).add(reminder.jobId));
        }
      }
    });
  }, [jobs, isMounted, notifiedJobs]);

  return reminders;
}
