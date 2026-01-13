/**
 * Hook for announcing element details on focus or long press
 * Provides detailed audio feedback for blind users
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { announce, stopAnnouncement } from '@/lib/audio';
import { triggerHaptic } from '@/lib/haptic';
import { useIsMounted } from '@/lib/hooks/useIsMounted';

interface UseFocusAnnouncementOptions {
  /**
   * Detailed description to announce when focused
   */
  description: string;
  /**
   * Short label for quick reference
   */
  label?: string;
  /**
   * Additional context information
   */
  context?: string;
  /**
   * Whether to announce on focus (keyboard navigation)
   */
  announceOnFocus?: boolean;
  /**
   * Whether to announce on long press (mobile)
   */
  announceOnLongPress?: boolean;
  /**
   * Delay in ms before announcing (to avoid interrupting user)
   */
  delay?: number;
  /**
   * Whether this is a navigation element
   */
  isNavigation?: boolean;
}

/**
 * Hook to provide detailed audio announcements on focus or long press
 * 
 * Usage:
 * ```tsx
 * const announcementProps = useFocusAnnouncement({
 *   description: 'Menu untuk melihat semua pekerjaan yang tersedia',
 *   label: 'Cari Pekerjaan',
 *   context: 'Tekan Enter untuk membuka halaman',
 *   announceOnFocus: true,
 *   announceOnLongPress: true,
 * });
 * 
 * <Link {...announcementProps}>Cari Pekerjaan</Link>
 * ```
 */
export function useFocusAnnouncement({
  description,
  label,
  context,
  announceOnFocus = true,
  announceOnLongPress = true,
  delay = 300,
  isNavigation = false,
}: UseFocusAnnouncementOptions) {
  const isMounted = useIsMounted();
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartTimeRef = useRef<number | null>(null);
  const hasAnnouncedRef = useRef(false);

  // Build comprehensive announcement
  const buildAnnouncement = (): string => {
    const parts: string[] = [];

    if (label) {
      parts.push(label);
    }

    parts.push(description);

    if (context) {
      parts.push(context);
    }

    if (isNavigation) {
      parts.push('Gunakan Tab untuk navigasi, Enter untuk mengaktifkan.');
    }

    return parts.join('. ');
  };

  // Handle focus event
  const handleFocus = (e?: React.FocusEvent<HTMLElement>) => {
    if (!isMounted || !announceOnFocus || hasAnnouncedRef.current) return;

    hasAnnouncedRef.current = true;
    setTimeout(() => {
      stopAnnouncement();
      announce(buildAnnouncement());
      triggerHaptic('loading');
      hasAnnouncedRef.current = false;
    }, delay);
  };

  // Handle blur event
  const handleBlur = (e?: React.FocusEvent<HTMLElement>) => {
    hasAnnouncedRef.current = false;
  };

  // Handle touch start (for long press detection)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMounted || !announceOnLongPress) return;

    touchStartTimeRef.current = Date.now();
    setIsLongPressing(true);

    // Start long press timer (500ms)
    longPressTimerRef.current = setTimeout(() => {
      if (isLongPressing) {
        stopAnnouncement();
        announce(buildAnnouncement());
        triggerHaptic('loading');
        setIsLongPressing(false);
      }
    }, 500);
  };

  // Handle touch end (cancel long press)
  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setIsLongPressing(false);
    touchStartTimeRef.current = null;
  };

  // Handle touch cancel
  const handleTouchCancel = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setIsLongPressing(false);
    touchStartTimeRef.current = null;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  return {
    onFocus: handleFocus,
    onBlur: handleBlur,
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchCancel,
    'aria-label': label || description,
  } as React.HTMLAttributes<HTMLElement>;
}
