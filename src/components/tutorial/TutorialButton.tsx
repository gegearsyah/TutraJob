/**
 * Tutorial Button Component
 * Button to start/restart tutorial
 */

'use client';

import { useState, useEffect } from 'react';
import { PlayCircle, RotateCcw } from 'lucide-react';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { announce } from '@/lib/audio';
import { triggerHaptic } from '@/lib/haptic';
import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';

interface TutorialButtonProps {
  onStart: () => void;
  tutorialId: string;
  label?: string;
  className?: string;
}

export function TutorialButton({
  onStart,
  tutorialId,
  label = 'Tutorial',
  className,
}: TutorialButtonProps) {
  const [hasCompleted, setHasCompleted] = useState(false);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;

    const completed = JSON.parse(localStorage.getItem('tutorials_completed') || '[]');
    setHasCompleted(completed.includes(tutorialId));
  }, [tutorialId, isMounted]);

  const handleClick = () => {
    if (isMounted) {
      triggerHaptic('loading');
      announce(hasCompleted ? 'Memulai ulang tutorial' : 'Memulai tutorial');
    }
    onStart();
  };

  const buttonProps = useFocusAnnouncement({
    description: hasCompleted 
      ? 'Tombol Mulai Ulang Tutorial. Klik untuk memulai tutorial dari awal. Tutorial akan memandu Anda melalui semua fitur aplikasi dengan langkah demi langkah.'
      : 'Tombol Mulai Tutorial. Klik untuk memulai tutorial yang akan memandu Anda melalui semua fitur aplikasi dengan langkah demi langkah. Tutorial ini akan menjelaskan cara menggunakan navigasi, mencari pekerjaan, melamar, dan mengelola profil.',
    label: hasCompleted ? 'Tombol Mulai Ulang Tutorial' : 'Tombol Mulai Tutorial',
    context: 'Tekan Enter untuk memulai tutorial',
    announceOnFocus: true,
    announceOnLongPress: true,
  });

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors min-h-[48px] w-full sm:w-auto ${className || ''}`}
      aria-label={hasCompleted ? 'Mulai ulang tutorial' : 'Mulai tutorial'}
      {...buttonProps}
    >
      {hasCompleted ? (
        <>
          <RotateCcw className="w-5 h-5" />
          <span>Mulai Ulang Tutorial</span>
        </>
      ) : (
        <>
          <PlayCircle className="w-5 h-5" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
