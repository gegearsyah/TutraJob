/**
 * Voice Preloader Component
 * Preloads Indonesian voices on app initialization
 */

'use client';

import { useEffect } from 'react';
import { preloadVoices } from '@/lib/audio';

export function VoicePreloader() {
  useEffect(() => {
    // Preload voices when component mounts
    preloadVoices();
  }, []);

  return null; // This component doesn't render anything
}
