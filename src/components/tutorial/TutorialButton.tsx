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

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors min-h-[48px] ${className || ''}`}
      aria-label={hasCompleted ? 'Mulai ulang tutorial' : 'Mulai tutorial'}
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
