/**
 * Haptic Feedback System
 * Based on FEATURE_SPECIFICATION.md Section 1.3
 */

export type HapticPattern =
  | 'apply-success'
  | 'dismiss'
  | 'error'
  | 'loading'
  | 'confirmation';

export interface HapticConfig {
  pattern: HapticPattern;
  duration: number; // milliseconds
  intensity: number; // 0-1
}

const HAPTIC_PATTERNS: Record<HapticPattern, number[]> = {
  'apply-success': [0, 200, 100, 200], // 2 short pulses
  dismiss: [0, 150], // 1 short pulse
  error: [0, 100, 50, 100, 50, 100], // 3 rapid pulses
  loading: [0, 200, 50, 200, 50, 200], // Continuous vibration
  confirmation: [0, 400], // Long pulse
};

/**
 * Trigger haptic feedback
 * @param pattern - The haptic pattern to play
 * @returns boolean - Whether haptic feedback was supported
 */
export function triggerHaptic(pattern: HapticPattern): boolean {
  if (typeof window === 'undefined' || !('navigator' in window)) {
    return false;
  }

  const vibrationPattern = HAPTIC_PATTERNS[pattern];

  // Check if Vibration API is supported
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(vibrationPattern);
      return true;
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
      return false;
    }
  }

  return false;
}

/**
 * Check if haptic feedback is supported
 */
export function isHapticSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'vibrate' in navigator;
}
