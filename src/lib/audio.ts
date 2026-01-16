/**
 * Audio Feedback System
 * Based on FEATURE_SPECIFICATION.md Section 1.4
 */

export type AudioCue =
  | 'apply-success'
  | 'dismiss'
  | 'error'
  | 'card-load'
  | 'saved';

// Cache for the best Indonesian voice
let cachedIndonesianVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;
let isSpeaking = false; // Flag to prevent overlapping announcements

const VOICE_STORAGE_KEY = 'inklusif-kerja-preferred-voice';

/**
 * Get user's preferred voice name from storage
 */
function getPreferredVoiceName(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(VOICE_STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Set user's preferred voice name in storage
 */
export function setPreferredVoiceName(voiceName: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(VOICE_STORAGE_KEY, voiceName);
    // Clear cache to force reload with new preference
    cachedIndonesianVoice = null;
    voicesLoaded = false;
    
    // Reload the voice immediately
    const voices = getVoices();
    if (voices.length > 0) {
      const preferredVoice = voices.find(v => v.name === voiceName);
      if (preferredVoice && preferredVoice.lang.toLowerCase().startsWith('id')) {
        cachedIndonesianVoice = preferredVoice;
        voicesLoaded = true;
        console.log('[TTS] Voice preference updated:', preferredVoice.name);
      }
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Clear voice cache (useful when voices change)
 */
export function clearVoiceCache(): void {
  cachedIndonesianVoice = null;
  voicesLoaded = false;
}

/**
 * Get all available voices (with loading support)
 */
function getVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  return window.speechSynthesis.getVoices();
}

/**
 * Find the best Indonesian voice available
 * Prioritizes native Indonesian voices and avoids English voices trying to speak Indonesian
 */
function findBestIndonesianVoice(): SpeechSynthesisVoice | null {
  const voices = getVoices();
  
  if (voices.length === 0) {
    return null;
  }

  // First, filter out English voices that might try to speak Indonesian
  // These are voices that are clearly English but might support id-ID
  const englishVoiceNames = [
    'zira', 'david', 'mark', 'hazel', 'susan', 'george', 'james',
    'linda', 'richard', 'karen', 'samantha', 'alex', 'daniel',
    'fiona', 'fred', 'kathy', 'princess', 'victoria', 'veena',
    'us english', 'en-us', 'english', 'american'
  ];

  // Filter Indonesian voices - be less restrictive, let users choose
  // Only exclude clearly English-only voices
  const indonesianVoices = voices.filter((voice) => {
    const lang = voice.lang.toLowerCase();
    const name = voice.name.toLowerCase();
    
    // Must have Indonesian language code
    if (!lang.startsWith('id')) {
      return false;
    }
    
    // Only exclude voices that are clearly English-only (not multilingual)
    // Allow voices that might work even if not perfect
    const isEnglishOnly = (
      name.includes('us english') ||
      name.includes('en-us') ||
      (name.includes('english') && !name.includes('indonesian') && !name.includes('indonesia'))
    );
    
    return !isEnglishOnly;
  });

  if (indonesianVoices.length === 0) {
    // Last resort: find any voice with id-ID that's not clearly English
    const idLangVoices = voices.filter((voice) => {
      const lang = voice.lang.toLowerCase();
      const name = voice.name.toLowerCase();
      
      if (!lang.startsWith('id')) return false;
      
      // Still exclude English voices
      return !englishVoiceNames.some(englishName => 
        name.includes(englishName)
      );
    });
    
    if (idLangVoices.length > 0) {
      // Prefer voices with "id-id" in language code (more specific)
      const specificIdVoice = idLangVoices.find(v => 
        v.lang.toLowerCase() === 'id-id'
      );
      if (specificIdVoice) return specificIdVoice;
      
      return idLangVoices[0];
    }
    
    return null;
  }

  // Score voices based on how likely they are to be native Indonesian
  // But don't be too restrictive - prefer but don't exclude
  const scoredVoices = indonesianVoices.map(voice => {
    const name = voice.name.toLowerCase();
    const lang = voice.lang.toLowerCase();
    let score = 0;
    
    // Higher score for voices with "Indonesian" in name
    if (name.includes('indonesian')) score += 10;
    if (name.includes('indonesia')) score += 8;
    
    // Higher score for specific id-ID language code
    if (lang === 'id-id') score += 5;
    if (lang === 'id') score += 3;
    
    // Prefer Google Indonesian voices (usually good quality)
    if (name.includes('google') && name.includes('indonesian')) score += 15;
    if (name.includes('google') && name.includes('indonesia')) score += 12;
    
    // Prefer Microsoft Indonesian voices
    if (name.includes('microsoft') && name.includes('indonesian')) score += 12;
    if (name.includes('microsoft') && name.includes('indonesia')) score += 10;
    
    // Prefer female voices (often sound better/more natural)
    const femaleIndicators = ['female', 'woman', 'lady', 'sari', 'lailah', 'damayanti'];
    if (femaleIndicators.some(indicator => name.includes(indicator))) score += 5;
    
    // Prefer voices with "id" in name
    if (name.includes(' id') || name.includes('-id')) score += 3;
    
    // Slight penalty for voices with "en" or "english" but don't exclude
    if (name.includes('en-') || (name.includes('english') && !name.includes('indonesian'))) score -= 5;
    
    return { voice, score };
  });

  // Sort by score (highest first)
  scoredVoices.sort((a, b) => b.score - a.score);

  // Return the highest scored voice
  const bestVoice = scoredVoices[0]?.voice;
  
  if (bestVoice) {
    console.log('[TTS] Selected Indonesian voice:', bestVoice.name, bestVoice.lang, 'Score:', scoredVoices[0].score);
  }

  return bestVoice || null;
}

/**
 * Load and cache the best Indonesian voice
 * This should be called after voices are loaded
 * Checks user preference first, then falls back to best available
 */
function loadIndonesianVoice(): SpeechSynthesisVoice | null {
  if (cachedIndonesianVoice) {
    return cachedIndonesianVoice;
  }

  const voices = getVoices();
  if (voices.length === 0) {
    return null;
  }

  // First, check if user has a preferred voice
  const preferredVoiceName = getPreferredVoiceName();
  if (preferredVoiceName) {
    const preferredVoice = voices.find(v => v.name === preferredVoiceName);
    if (preferredVoice) {
      // Verify it's an Indonesian voice
      const lang = preferredVoice.lang.toLowerCase();
      if (lang.startsWith('id')) {
        cachedIndonesianVoice = preferredVoice;
        console.log('[TTS] Using user preferred voice:', preferredVoice.name, preferredVoice.lang);
        return preferredVoice;
      }
    }
  }

  // Fall back to finding the best Indonesian voice
  const voice = findBestIndonesianVoice();
  if (voice) {
    cachedIndonesianVoice = voice;
    console.log('[TTS] Selected Indonesian voice:', voice.name, voice.lang);
  } else {
    console.warn('[TTS] No Indonesian voice found. Using system default.');
  }

  return voice;
}

/**
 * Wait for voices to load and then cache the best Indonesian voice
 */
function ensureVoicesLoaded(): Promise<void> {
  return new Promise((resolve) => {
    if (voicesLoaded && cachedIndonesianVoice) {
      resolve();
      return;
    }

    const voices = getVoices();
    if (voices.length > 0) {
      loadIndonesianVoice();
      voicesLoaded = true;
      resolve();
      return;
    }

    // Voices might not be loaded yet, wait for the voiceschanged event
    const onVoicesChanged = () => {
      loadIndonesianVoice();
      voicesLoaded = true;
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
      resolve();
    };

    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);

    // Fallback timeout
    setTimeout(() => {
      if (!voicesLoaded) {
        loadIndonesianVoice();
        voicesLoaded = true;
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
        resolve();
      }
    }, 1000);
  });
}

/**
 * Async version of announce that waits for voices to load
 * Use this when you have time to wait for the best voice
 * @param message - Message to announce
 * @param lang - Language code (default: 'id-ID' for Indonesian)
 * @param options - Additional options for speech
 */
export async function announceAsync(
  message: string,
  lang: string = 'id-ID',
  options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
  }
): Promise<void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Ensure voices are loaded
  await ensureVoicesLoaded();

  const utterance = new SpeechSynthesisUtterance(message);
  
  // Use the best Indonesian voice if available
  const bestVoice = loadIndonesianVoice();
  if (bestVoice) {
    utterance.voice = bestVoice;
    // Always use the voice's native language code for best pronunciation
    utterance.lang = bestVoice.lang;
  } else {
    // Fallback: use id-ID if no voice found
    utterance.lang = lang;
  }
  
  utterance.volume = options?.volume ?? 0.8;
  utterance.rate = options?.rate ?? 0.95; // Slightly slower for better clarity
  utterance.pitch = options?.pitch ?? 1.0;

  window.speechSynthesis.speak(utterance);
}

/**
 * Synchronous version of announce (for backward compatibility)
 * Uses cached voice if available, otherwise tries to find one quickly
 * Prevents double announcements by ensuring only one speech at a time
 */
export function announceSync(message: string, lang: string = 'id-ID'): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    return;
  }

  // Cancel any ongoing speech immediately to prevent overlap
  // This must be called before checking isSpeaking to ensure clean state
  window.speechSynthesis.cancel();
  
  // Wait a tiny bit to ensure cancellation is processed
  // This prevents double announcements
  if (isSpeaking) {
    // If something was speaking, wait a bit longer
    setTimeout(() => {
      isSpeaking = false;
      speakMessage(message, lang);
    }, 50);
    return;
  }

  isSpeaking = false;
  speakMessage(message, lang);
}

function speakMessage(message: string, lang: string = 'id-ID'): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  // Try to load voice if not cached (quick check)
  // This will check user preference first
  if (!cachedIndonesianVoice) {
    const voice = loadIndonesianVoice();
    if (voice) {
      cachedIndonesianVoice = voice;
    }
  }

  const utterance = new SpeechSynthesisUtterance(message);
  
  // Use cached voice if available - ensure we only use ONE voice
  if (cachedIndonesianVoice) {
    utterance.voice = cachedIndonesianVoice;
    // Always use the voice's native language code for best pronunciation
    utterance.lang = cachedIndonesianVoice.lang;
  } else {
    // Fallback: try to find any voice that supports id-ID
    const voices = getVoices();
    const fallbackVoice = voices.find(v => v.lang.toLowerCase().startsWith('id'));
    if (fallbackVoice) {
      utterance.voice = fallbackVoice;
      utterance.lang = fallbackVoice.lang;
    } else {
      // Last resort: use id-ID language code
      utterance.lang = lang;
    }
  }
  
  utterance.volume = 0.8;
  utterance.rate = 0.95; // Slightly slower for better clarity
  utterance.pitch = 1.0;

  // Track speaking state to prevent overlaps
  utterance.onstart = () => {
    isSpeaking = true;
  };

  utterance.onend = () => {
    isSpeaking = false;
  };

  utterance.onerror = (error) => {
    isSpeaking = false;
    // Don't log interruption errors (they're expected when canceling)
    if (error.error !== 'interrupted') {
      console.warn('[TTS] Speech error:', error);
    }
  };

  // Speak the message
  window.speechSynthesis.speak(utterance);
}

/**
 * Backward-compatible announce function (synchronous)
 * This is the main function used throughout the app
 */
export function announce(message: string, lang: string = 'id-ID'): void {
  // Use sync version for backward compatibility
  // The async version is available as announceAsync if needed
  announceSync(message, lang);
}

/**
 * Stop current speech
 */
export function stopAnnouncement(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Check if speech synthesis is supported
 */
export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window;
}

/**
 * Play audio cue (for future implementation with audio files)
 * @param cue - Audio cue type
 */
export function playAudioCue(cue: AudioCue): void {
  // TODO: Implement audio file playback
  // For now, use TTS as fallback
  const messages: Record<AudioCue, string> = {
    'apply-success': 'Lamaran berhasil dikirim',
    dismiss: 'Pekerjaan berikutnya',
    error: 'Terjadi kesalahan',
    'card-load': 'Memuat pekerjaan',
    saved: 'Tersimpan',
  };

  // Use sync version for audio cues (they're short and immediate)
  announceSync(messages[cue]);
}

/**
 * Get information about available Indonesian voices
 * Useful for debugging and user preferences
 */
export function getIndonesianVoicesInfo(): {
  available: boolean;
  voiceName: string | null;
  voiceLang: string | null;
  allVoices: Array<{ name: string; lang: string; default: boolean }>;
} {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return {
      available: false,
      voiceName: null,
      voiceLang: null,
      allVoices: [],
    };
  }

  const voices = getVoices();
  const indonesianVoices = voices
    .filter((voice) => {
      const lang = voice.lang.toLowerCase();
      const name = voice.name.toLowerCase();
      return (
        lang.startsWith('id') ||
        name.includes('indonesian') ||
        name.includes('indonesia')
      );
    })
    .map((voice) => ({
      name: voice.name,
      lang: voice.lang,
      default: voice.default,
    }));

  const bestVoice = loadIndonesianVoice();

  return {
    available: bestVoice !== null,
    voiceName: bestVoice?.name || null,
    voiceLang: bestVoice?.lang || null,
    allVoices: indonesianVoices,
  };
}

/**
 * Preload voices on app initialization
 * Call this early in the app lifecycle
 */
export function preloadVoices(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  // Try to load voices immediately
  ensureVoicesLoaded().catch((err) => {
    console.warn('[TTS] Failed to preload voices:', err);
  });
}
