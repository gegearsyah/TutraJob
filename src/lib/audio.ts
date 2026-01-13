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

/**
 * Announce text using Text-to-Speech
 * @param message - Message to announce
 * @param lang - Language code (default: 'id-ID' for Indonesian)
 */
export function announce(message: string, lang: string = 'id-ID'): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = lang;
  utterance.volume = 0.8;
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
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

  announce(messages[cue]);
}
