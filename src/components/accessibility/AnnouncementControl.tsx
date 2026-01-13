/**
 * Announcement Control Component
 * Button to stop current audio announcements
 */

'use client';

import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { stopAnnouncement, isSpeechSynthesisSupported } from '@/lib/audio';
import { triggerHaptic } from '@/lib/haptic';
import { VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnnouncementControlProps {
  className?: string;
  variant?: 'floating' | 'inline';
}

export function AnnouncementControl({ className, variant = 'floating' }: AnnouncementControlProps) {
  const isMounted = useIsMounted();

  if (!isMounted || !isSpeechSynthesisSupported()) {
    return null;
  }

  const handleStop = () => {
    stopAnnouncement();
    triggerHaptic('dismiss');
    // Announce that announcement was stopped
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance('Pengumuman dihentikan');
        utterance.lang = 'id-ID';
        utterance.rate = 1.0;
        utterance.volume = 0.8;
        window.speechSynthesis.speak(utterance);
      }, 100);
    }
  };

  if (variant === 'floating') {
    return (
      <button
        onClick={handleStop}
        className={cn(
          'fixed bottom-4 right-4 z-50',
          'min-h-[48px] min-w-[48px]',
          'bg-background border border-border rounded-full shadow-lg',
          'hover:bg-muted transition-colors',
          'flex items-center justify-center',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        aria-label="Hentikan pengumuman suara"
        title="Hentikan pengumuman suara"
      >
        <VolumeX className="w-5 h-5 text-muted-foreground" />
      </button>
    );
  }

  return (
    <button
      onClick={handleStop}
      className={cn(
        'min-h-[48px] min-w-[48px] px-3',
        'bg-background border border-border rounded-lg',
        'hover:bg-muted transition-colors',
        'flex items-center justify-center gap-2',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      aria-label="Hentikan pengumuman suara"
    >
      <VolumeX className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm">Hentikan Suara</span>
    </button>
  );
}
