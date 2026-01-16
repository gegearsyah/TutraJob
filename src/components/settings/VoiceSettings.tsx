/**
 * Voice Settings Component
 * Allows users to select and test voices directly in the app
 */

'use client';

import { useState, useEffect } from 'react';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { announce, getIndonesianVoicesInfo, stopAnnouncement, setPreferredVoiceName } from '@/lib/audio';
import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';
import { FocusAnnouncement } from '@/components/accessibility/FocusAnnouncement';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { triggerHaptic } from '@/lib/haptic';
import { Volume2, Play, CheckCircle, AlertCircle } from 'lucide-react';

const TEST_MESSAGE = 'Selamat datang di aplikasi Inklusif Kerja. Ini adalah contoh suara untuk memastikan kualitas pengucapan bahasa Indonesia.';

interface VoiceOption {
  name: string;
  lang: string;
  voice: SpeechSynthesisVoice;
  isDefault: boolean;
  score: number;
}

const VOICE_STORAGE_KEY = 'inklusif-kerja-preferred-voice';

/**
 * Individual Voice Option Item Component
 * Extracted to ensure hooks are called consistently
 */
function VoiceOptionItem({
  voiceOption,
  isSelected,
  isCurrentlyTesting,
  onSelect,
  onTest,
}: {
  voiceOption: VoiceOption;
  isSelected: boolean;
  isCurrentlyTesting: boolean;
  onSelect: () => void;
  onTest: () => void;
}) {
  const handleSelectClick = (e: React.MouseEvent) => {
    // Stop any ongoing announcements from focus immediately
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    // Small delay to ensure cancellation is processed
    setTimeout(() => {
      onSelect();
    }, 50);
  };

  const handleTestClick = (e: React.MouseEvent) => {
    // Stop any ongoing announcements from focus immediately
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    // Small delay to ensure cancellation is processed
    setTimeout(() => {
      onTest();
    }, 50);
  };

  const voiceButtonProps = useFocusAnnouncement({
    description: `Suara ${voiceOption.name}, bahasa ${voiceOption.lang}. ${isSelected ? 'Sedang dipilih' : 'Tidak dipilih'}. Klik untuk memilih suara ini.`,
    label: `Suara ${voiceOption.name}`,
    context: 'Klik untuk memilih suara ini',
    announceOnFocus: true,
    announceOnLongPress: true,
  });

  const testButtonPropsForVoice = useFocusAnnouncement({
    description: `Uji suara ${voiceOption.name}`,
    label: `Uji ${voiceOption.name}`,
    context: 'Klik untuk menguji suara ini',
    announceOnFocus: true,
    announceOnLongPress: true,
  });

  return (
    <div
      className={`
        p-3 border rounded-lg transition-colors
        ${isSelected 
          ? 'border-primary bg-primary/5' 
          : 'border-border hover:bg-muted/50'
        }
      `}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectClick}
              className={`
                flex-1 text-left min-h-[44px] px-3 py-2 rounded
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                ${isSelected ? 'font-semibold' : ''}
              `}
              {...voiceButtonProps}
            >
              <div className="flex items-center gap-2">
                {isSelected && (
                  <CheckCircle className="w-4 h-4 text-primary" aria-hidden="true" />
                )}
                <span>{voiceOption.name}</span>
                {voiceOption.isDefault && (
                  <span className="text-xs text-muted-foreground">(Default)</span>
                )}
                {voiceOption.score >= 10 && (
                  <span className="text-xs text-primary font-medium">(Direkomendasikan)</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {voiceOption.lang}
                {voiceOption.name.toLowerCase().includes('female') || 
                 voiceOption.name.toLowerCase().includes('woman') ||
                 voiceOption.name.toLowerCase().includes('lady') ? (
                  <span className="ml-2 text-primary">• Suara Wanita</span>
                ) : null}
              </div>
            </button>
          </div>
        </div>
        <button
          onClick={handleTestClick}
          disabled={isCurrentlyTesting}
          className={`
            min-h-[44px] min-w-[44px] px-3 py-2 rounded-lg
            border border-border hover:bg-muted transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
          `}
          aria-label={`Uji suara ${voiceOption.name}`}
          {...testButtonPropsForVoice}
        >
          {isCurrentlyTesting ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <Play className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}

export function VoiceSettings() {
  const isMounted = useIsMounted();
  const [availableVoices, setAvailableVoices] = useState<VoiceOption[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load saved preference
  useEffect(() => {
    if (!isMounted) return;

    const savedVoice = localStorage.getItem(VOICE_STORAGE_KEY);
    if (savedVoice) {
      setSelectedVoiceName(savedVoice);
    }

    // Wait for voices to load
    const loadVoices = () => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setLoading(false);
        return;
      }

      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        // Wait for voiceschanged event
        const onVoicesChanged = () => {
          const loadedVoices = window.speechSynthesis.getVoices();
          processVoices(loadedVoices);
          window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
        };
        window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
        return;
      }

      processVoices(voices);
    };

    const processVoices = (voices: SpeechSynthesisVoice[]) => {
      // Show ALL voices that support Indonesian (id-ID or id)
      // Let users decide which sounds best, even if it's not a "perfect" Indonesian voice
      const indonesianVoices = voices
        .filter((voice) => {
          const lang = voice.lang.toLowerCase();
          // Must support Indonesian language code
          return lang.startsWith('id');
        })
        .map((voice) => {
          const name = voice.name.toLowerCase();
          const lang = voice.lang.toLowerCase();
          
          // Score voices for better sorting (but don't exclude any)
          let score = 0;
          if (name.includes('indonesian')) score += 10;
          if (name.includes('indonesia')) score += 8;
          if (name.includes('google') && (name.includes('indonesian') || name.includes('indonesia'))) score += 15;
          if (name.includes('microsoft') && (name.includes('indonesian') || name.includes('indonesia'))) score += 12;
          if (lang === 'id-id') score += 5;
          
          // Prefer female voices (often sound better for Indonesian)
          const femaleIndicators = ['female', 'woman', 'lady', 'sari', 'lailah', 'damayanti', 'google indonesia', 'microsoft indonesia'];
          if (femaleIndicators.some(indicator => name.includes(indicator))) score += 3;
          
          return {
            name: voice.name,
            lang: voice.lang,
            voice,
            isDefault: voice.default,
            score,
          };
        })
        .sort((a, b) => {
          // Sort by score first (highest first)
          if (b.score !== a.score) return b.score - a.score;
          
          // Then by default
          if (a.isDefault && !b.isDefault) return -1;
          if (!a.isDefault && b.isDefault) return 1;
          
          // Then alphabetically
          return a.name.localeCompare(b.name);
        });

      setAvailableVoices(indonesianVoices);
      
      // If no saved preference, use the first (best) voice
      if (!selectedVoiceName && indonesianVoices.length > 0) {
        const bestVoice = indonesianVoices[0];
        setSelectedVoiceName(bestVoice.name);
        localStorage.setItem(VOICE_STORAGE_KEY, bestVoice.name);
      }
      
      setLoading(false);
    };

    loadVoices();
  }, [isMounted, selectedVoiceName]);

  const handleTestVoice = (voiceName: string) => {
    if (!isMounted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    // Cancel all ongoing speech first
    stopAnnouncement();
    
    // Wait a bit to ensure cancellation is complete
    setTimeout(() => {
      setIsTesting(true);
      triggerHaptic('loading');

      const voice = availableVoices.find(v => v.name === voiceName)?.voice;
      if (!voice) {
        setIsTesting(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(TEST_MESSAGE);
      utterance.voice = voice;
      utterance.lang = voice.lang;
      utterance.volume = 0.8;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setIsTesting(false);
        triggerHaptic('confirmation');
        // Don't announce here to prevent double announcement
        // The user already heard the test message
      };

      utterance.onerror = (error) => {
        setIsTesting(false);
        triggerHaptic('error');
        console.error('Voice test error:', error);
        // Only announce error if it's a real error, not just cancellation
        if (error.error !== 'interrupted') {
          stopAnnouncement();
          setTimeout(() => {
            announce('Terjadi kesalahan saat menguji suara');
          }, 100);
        }
      };

      window.speechSynthesis.speak(utterance);
    }, 100);
  };

  const handleSelectVoice = (voiceName: string) => {
    // Cancel any ongoing announcements first
    stopAnnouncement();
    
    setSelectedVoiceName(voiceName);
    setPreferredVoiceName(voiceName); // Update in audio.ts
    
    const voice = availableVoices.find(v => v.name === voiceName)?.voice;
    if (voice && isMounted) {
      triggerHaptic('confirmation');
      // Wait a bit before announcing to ensure no overlap
      setTimeout(() => {
        announce(`Suara ${voiceName} dipilih sebagai suara default. Pengaturan telah disimpan.`);
      }, 150);
    }
  };

  if (loading) {
    return (
      <div className="p-4 border border-border rounded-lg bg-card">
        <p className="text-sm text-muted-foreground">Memuat daftar suara...</p>
      </div>
    );
  }

  if (availableVoices.length === 0) {
    return (
      <div className="p-4 border border-border rounded-lg bg-card space-y-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-warning mt-0.5" aria-hidden="true" />
          <div className="flex-1">
            <FocusAnnouncement
              description="Tidak ada suara Indonesia yang ditemukan di sistem Anda. Untuk hasil terbaik, instal suara Indonesia melalui pengaturan sistem. Lihat panduan di VOICE_SETUP_GUIDE.md"
              label="Peringatan Suara"
            >
              <h3 className="font-semibold mb-2">Tidak Ada Suara Indonesia Ditemukan</h3>
            </FocusAnnouncement>
            <p className="text-sm text-muted-foreground">
              Sistem Anda tidak memiliki suara Indonesia yang terpasang. Aplikasi akan menggunakan suara default yang mungkin tidak optimal untuk bahasa Indonesia.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Untuk menginstal suara Indonesia, lihat panduan di <code className="text-xs bg-muted px-1 py-0.5 rounded">VOICE_SETUP_GUIDE.md</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border border-border rounded-lg bg-card space-y-4">
      <FocusAnnouncement
        description="Pengaturan Suara. Di sini Anda dapat memilih dan menguji suara Indonesia yang tersedia. Pilih suara yang terdengar paling natural untuk Anda."
        label="Pengaturan Suara"
      >
        <div className="flex items-center gap-2 mb-4">
          <Volume2 className="w-5 h-5 text-primary" aria-hidden="true" />
          <h3 className="text-lg font-semibold">Pengaturan Suara</h3>
        </div>
      </FocusAnnouncement>

      <p className="text-sm text-muted-foreground">
        Pilih suara yang terdengar paling natural untuk bahasa Indonesia. Semua suara di bawah ini mendukung bahasa Indonesia. Klik "Uji" untuk mendengarkan contoh suara dan pilih yang terdengar terbaik untuk Anda.
      </p>
      <p className="text-xs text-muted-foreground italic">
        Tip: Suara wanita sering kali terdengar lebih natural untuk bahasa Indonesia. Coba beberapa suara untuk menemukan yang paling cocok.
      </p>

      <div className="space-y-2">
        {availableVoices.map((voiceOption) => (
          <VoiceOptionItem
            key={voiceOption.name}
            voiceOption={voiceOption}
            isSelected={selectedVoiceName === voiceOption.name}
            isCurrentlyTesting={isTesting && selectedVoiceName === voiceOption.name}
            onSelect={() => handleSelectVoice(voiceOption.name)}
            onTest={() => handleTestVoice(voiceOption.name)}
          />
        ))}
      </div>

      {selectedVoiceName && (
        <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-sm">
            <strong>Suara yang dipilih:</strong> {selectedVoiceName}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Pilihan Anda telah disimpan dan akan digunakan untuk semua pengumuman suara.
          </p>
        </div>
      )}
    </div>
  );
}
