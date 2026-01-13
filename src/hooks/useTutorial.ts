/**
 * Tutorial Hook
 * Manages tutorial state and completion tracking
 */

import { useState, useEffect } from 'react';
import { useIsMounted } from '@/lib/hooks/useIsMounted';

export function useTutorial(tutorialId: string) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;

    const completed = JSON.parse(localStorage.getItem('tutorials_completed') || '[]');
    setHasCompleted(completed.includes(tutorialId));
  }, [tutorialId, isMounted]);

  const startTutorial = () => {
    setIsOpen(true);
  };

  const closeTutorial = () => {
    setIsOpen(false);
  };

  const completeTutorial = () => {
    if (typeof window !== 'undefined') {
      const completed = JSON.parse(localStorage.getItem('tutorials_completed') || '[]');
      if (!completed.includes(tutorialId)) {
        completed.push(tutorialId);
        localStorage.setItem('tutorials_completed', JSON.stringify(completed));
      }
      setHasCompleted(true);
    }
    setIsOpen(false);
  };

  const resetTutorial = () => {
    if (typeof window !== 'undefined') {
      const completed = JSON.parse(localStorage.getItem('tutorials_completed') || '[]');
      const filtered = completed.filter((id: string) => id !== tutorialId);
      localStorage.setItem('tutorials_completed', JSON.stringify(filtered));
      setHasCompleted(false);
    }
    setIsOpen(true);
  };

  return {
    isOpen,
    hasCompleted,
    startTutorial,
    closeTutorial,
    completeTutorial,
    resetTutorial,
  };
}
