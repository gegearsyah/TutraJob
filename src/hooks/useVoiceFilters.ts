/**
 * Voice-Activated Filters Hook
 * Uses Web Speech API to recognize voice commands for filtering jobs
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { announce } from '@/lib/audio';
import { triggerHaptic } from '@/lib/haptic';
import type { FilterState } from '@/components/job-seeker/JobFilters';

interface VoiceCommand {
  action: 'filter' | 'clear' | 'help';
  params: {
    location?: string[];
    accessibility?: ('high' | 'medium' | 'low')[];
    workArrangement?: ('remote' | 'hybrid' | 'on-site')[];
    salaryMin?: number;
    remote?: boolean;
    transjakarta?: boolean;
  };
}

/**
 * Parse voice command into structured command
 * Pure function - no dependencies on component state
 */
function parseVoiceCommand(transcript: string): VoiceCommand {
  const lower = transcript.toLowerCase();

  // Clear filters
  if (
    lower.includes('hapus') ||
    lower.includes('reset') ||
    lower.includes('bersihkan') ||
    lower.includes('clear')
  ) {
    return { action: 'clear', params: {} };
  }

  // Help command
  if (
    lower.includes('bantuan') ||
    lower.includes('help') ||
    lower.includes('perintah') ||
    lower.includes('command')
  ) {
    return { action: 'help', params: {} };
  }

  // Default to filter action
  const params: VoiceCommand['params'] = {};

  // Location filters
  const locations: string[] = [];
  if (lower.includes('jakarta')) {
    locations.push('Jakarta Pusat');
    locations.push('Jakarta Selatan');
    locations.push('Jakarta Utara');
    locations.push('Jakarta Barat');
    locations.push('Jakarta Timur');
  }
  if (lower.includes('bandung')) locations.push('Bandung');
  if (lower.includes('surabaya')) locations.push('Surabaya');
  if (lower.includes('yogyakarta') || lower.includes('jogja')) locations.push('Yogyakarta');
  if (lower.includes('semarang')) locations.push('Semarang');
  if (lower.includes('medan')) locations.push('Medan');
  if (lower.includes('makassar')) locations.push('Makassar');
  if (lower.includes('denpasar')) locations.push('Denpasar');
  if (locations.length > 0) {
    params.location = locations;
  }

  // TransJakarta filter
  if (
    lower.includes('transjakarta') ||
    lower.includes('trans jakarta') ||
    lower.includes('dekat transjakarta') ||
    lower.includes('stasiun transjakarta')
  ) {
    params.transjakarta = true;
  }

  // Accessibility level filters
  if (lower.includes('aksesibilitas tinggi') || lower.includes('aksesibilitas tinggi')) {
    params.accessibility = ['high'];
  } else if (lower.includes('aksesibilitas sedang') || lower.includes('aksesibilitas medium')) {
    params.accessibility = ['medium'];
  } else if (lower.includes('aksesibilitas rendah') || lower.includes('aksesibilitas low')) {
    params.accessibility = ['low'];
  } else if (lower.includes('aksesibilitas')) {
    // If just "aksesibilitas" is mentioned, default to high
    params.accessibility = ['high'];
  }

  // Work arrangement filters
  if (
    lower.includes('remote') ||
    lower.includes('kerja remote') ||
    lower.includes('kerja dari rumah') ||
    lower.includes('wfh')
  ) {
    params.workArrangement = ['remote'];
  } else if (
    lower.includes('hybrid') ||
    lower.includes('kerja hybrid') ||
    lower.includes('campuran')
  ) {
    params.workArrangement = ['hybrid'];
  } else if (
    lower.includes('on-site') ||
    lower.includes('onsite') ||
    lower.includes('di kantor') ||
    lower.includes('kerja di kantor')
  ) {
    params.workArrangement = ['on-site'];
  }

  // Salary filters
  const salaryMatch = lower.match(/(\d+)\s*(juta|million)/);
  if (salaryMatch) {
    const amount = parseInt(salaryMatch[1], 10);
    if (lower.includes('diatas') || lower.includes('lebih dari') || lower.includes('minimal')) {
      params.salaryMin = amount * 1000000; // Convert to Rupiah
    }
  }

  return { action: 'filter', params };
}

export function useVoiceFilters(
  onFilterChange: (filters: FilterState) => void,
  currentFilters: FilterState
) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const applyCommandRef = useRef<(command: VoiceCommand) => void>();
  const isMounted = useIsMounted();

  // Check if Web Speech API is supported
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'id-ID'; // Indonesian language

      recognition.onstart = () => {
        if (isMounted) {
          setIsListening(true);
          announce('Mendengarkan perintah suara Anda');
          triggerHaptic('loading');
        }
      };

      recognition.onend = () => {
        if (isMounted) {
          setIsListening(false);
        }
      };

      recognition.onerror = (event: any) => {
        if (isMounted) {
          setIsListening(false);
          const errorMessage =
            event.error === 'no-speech'
              ? 'Tidak ada suara terdeteksi. Coba lagi.'
              : event.error === 'audio-capture'
              ? 'Tidak dapat mengakses mikrofon. Pastikan izin mikrofon diberikan.'
              : event.error === 'not-allowed'
              ? 'Akses mikrofon ditolak. Harap berikan izin di pengaturan browser.'
              : 'Terjadi kesalahan saat mengenali suara.';
          setError(errorMessage);
          announce(errorMessage);
          triggerHaptic('error');
        }
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        if (!isMounted) return;

        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        console.log('[Voice Filter] Recognized:', transcript);

        try {
          const command = parseVoiceCommand(transcript);
          // Use ref to get the latest version of applyVoiceCommand
          if (applyCommandRef.current) {
            applyCommandRef.current(command);
          }
        } catch (err) {
          const errorMsg =
            err instanceof Error
              ? err.message
              : 'Tidak dapat memahami perintah. Coba lagi dengan perintah yang lebih jelas.';
          setError(errorMsg);
          announce(errorMsg);
          triggerHaptic('error');
        }
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      setError('Browser Anda tidak mendukung pengenalan suara. Gunakan browser modern seperti Chrome atau Edge.');
    }
  }, [isMounted]);

  /**
   * Apply voice command to filters
   */
  const applyVoiceCommand = useCallback(
    (command: VoiceCommand) => {
      if (!isMounted) return;

      if (command.action === 'clear') {
        onFilterChange({
          search: '',
          location: [],
          salaryMin: null,
          salaryMax: null,
          accessibilityLevel: [],
          workArrangement: [],
        });
        announce('Semua filter telah dihapus');
        triggerHaptic('confirmation');
        return;
      }

      if (command.action === 'help') {
        const helpMessage = `Perintah suara yang tersedia: Tampilkan pekerjaan remote, Tampilkan pekerjaan dengan aksesibilitas tinggi, Tampilkan pekerjaan di Jakarta, Tampilkan pekerjaan dekat TransJakarta, Tampilkan pekerjaan dengan gaji diatas 10 juta, Hapus semua filter.`;
        announce(helpMessage);
        return;
      }

      // Apply filter command
      const newFilters: FilterState = { ...currentFilters };

      if (command.params.location) {
        newFilters.location = [
          ...new Set([...currentFilters.location, ...command.params.location]),
        ];
      }

      if (command.params.accessibility) {
        newFilters.accessibilityLevel = [
          ...new Set([
            ...currentFilters.accessibilityLevel,
            ...command.params.accessibility,
          ]),
        ];
      }

      if (command.params.workArrangement) {
        newFilters.workArrangement = [
          ...new Set([
            ...currentFilters.workArrangement,
            ...command.params.workArrangement,
          ]),
        ];
      }

      if (command.params.salaryMin) {
        newFilters.salaryMin = command.params.salaryMin;
      }

      // Apply TransJakarta filter (this would need special handling in the filter component)
      // For now, we'll just announce it
      if (command.params.transjakarta) {
        announce('Filter TransJakarta diterapkan. Menampilkan pekerjaan dekat stasiun TransJakarta.');
      }

      onFilterChange(newFilters);

      // Announce applied filters
      const appliedFilters: string[] = [];
      if (command.params.location) {
        appliedFilters.push(`lokasi: ${command.params.location.join(', ')}`);
      }
      if (command.params.accessibility) {
        appliedFilters.push(`aksesibilitas: ${command.params.accessibility.join(', ')}`);
      }
      if (command.params.workArrangement) {
        appliedFilters.push(
          `jenis kerja: ${command.params.workArrangement.join(', ')}`
        );
      }
      if (command.params.salaryMin) {
        appliedFilters.push(`gaji minimal: ${command.params.salaryMin / 1000000} juta`);
      }

      if (appliedFilters.length > 0) {
        announce(`Filter diterapkan: ${appliedFilters.join(', ')}`);
        triggerHaptic('apply-success');
      } else {
        announce('Perintah tidak dikenali. Coba lagi dengan perintah yang lebih jelas.');
        triggerHaptic('error');
      }
    },
    [isMounted, currentFilters, onFilterChange]
  );

  // Update ref whenever applyVoiceCommand changes
  useEffect(() => {
    applyCommandRef.current = applyVoiceCommand;
  }, [applyVoiceCommand]);

  /**
   * Start listening for voice commands
   */
  const startListening = useCallback(() => {
    if (!isMounted || !recognitionRef.current || isListening) return;

    try {
      setError(null);
      const recognition = recognitionRef.current;
      if (recognition) {
        recognition.start();
      }
    } catch (err) {
      const errorMsg = 'Tidak dapat memulai pengenalan suara. Pastikan mikrofon tersedia.';
      setError(errorMsg);
      announce(errorMsg);
      triggerHaptic('error');
    }
  }, [isMounted, isListening]);

  /**
   * Stop listening for voice commands
   */
  const stopListening = useCallback(() => {
    if (!isMounted || !recognitionRef.current || !isListening) return;

    try {
      const recognition = recognitionRef.current;
      if (recognition) {
        recognition.stop();
        announce('Berhenti mendengarkan');
        triggerHaptic('dismiss');
      }
    } catch (err) {
      console.error('Error stopping recognition:', err);
    }
  }, [isMounted, isListening]);

  /**
   * Toggle listening state
   */
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    toggleListening,
  };
}
