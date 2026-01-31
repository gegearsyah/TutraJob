'use client';

import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Loader2 } from 'lucide-react';
import { announceAsync, stopAnnouncement } from '@/lib/audio';
import { AccessibleButton } from '@/components/ui/AccessibleButton';

interface LandingNarratorProps {
  title: string;
  subtitle: string;
  description: string;
  autoPlay?: boolean;
  disabled?: boolean;
}

export function LandingNarrator({
  title,
  subtitle,
  description,
  autoPlay = true,
  disabled = false,
}: LandingNarratorProps) {
  const [narration, setNarration] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch narration from API
  useEffect(() => {
    if (disabled) {
      setNarration('');
      setError(null);
      setIsLoading(false);
      return;
    }

    const fetchNarration = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/landing/narrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, subtitle, description }),
        });

        if (!response.ok) {
          setError('Narasi AI sedang tidak tersedia. Tidak apa-apa, Anda tetap bisa lanjut membaca.');
          setNarration('');
          return;
        }

        const data = await response.json();
        setNarration(data.narration);

        // Auto-play if enabled and not muted
        if (autoPlay && !isMuted) {
          playNarration(data.narration);
        }
      } catch (err) {
        console.error('Narration fetch error:', err);
        setError('Narasi AI sedang tidak tersedia. Tidak apa-apa, Anda tetap bisa lanjut membaca.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNarration();
  }, [title, subtitle, description, autoPlay, disabled]);

  const playNarration = async (text: string) => {
    if (!text || isMuted) return;

    try {
      setIsPlaying(true);
      await announceAsync(text, 'id-ID', {
        rate: 0.95,
        pitch: 1.0,
        volume: 0.9,
      });
      // Set playing to false after announcement completes
      setIsPlaying(false);
    } catch (err) {
      console.error('Narration playback error:', err);
      setIsPlaying(false);
      setError('Gagal memutar narasi');
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      stopAnnouncement();
      setIsPlaying(false);
    } else if (narration) {
      playNarration(narration);
    }
  };

  const handleMuteToggle = () => {
    if (isPlaying) {
      stopAnnouncement();
      setIsPlaying(false);
    }
    setIsMuted(!isMuted);
  };

  if (error && !narration) {
    return null; // Silently fail to not disrupt user experience
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 p-4 max-w-sm"
      role="complementary"
      aria-label="Kontrol Narasi AI"
    >
      <div className="flex items-center gap-3">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Memuat narasi...</span>
          </div>
        )}

        {/* Ready State */}
        {!isLoading && narration && (
          <>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-foreground mb-1">
                Narasi AI
              </div>
              <div className="text-xs text-muted-foreground line-clamp-2">
                {narration}
              </div>
            </div>

            {/* Play/Pause Button */}
            <AccessibleButton
              onClick={handlePlayPause}
              disabled={isMuted}
              size="sm"
              className="shrink-0 w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={isPlaying ? 'Jeda narasi' : 'Putar narasi'}
              announceOnClick={true}
              announcementText={isPlaying ? 'Jeda narasi AI' : 'Putar narasi AI'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" aria-hidden="true" />
              )}
            </AccessibleButton>

            {/* Mute Toggle */}
            <AccessibleButton
              onClick={handleMuteToggle}
              size="sm"
              className="shrink-0 w-10 h-10 rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              aria-label={isMuted ? 'Aktifkan suara' : 'Nonaktifkan suara'}
              announceOnClick={true}
              announcementText={isMuted ? 'Aktifkan suara narasi' : 'Nonaktifkan suara narasi'}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Volume2 className="w-5 h-5" aria-hidden="true" />
              )}
            </AccessibleButton>
          </>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-xs text-destructive">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
