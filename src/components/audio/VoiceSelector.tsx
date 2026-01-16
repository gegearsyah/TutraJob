/**
 * Voice Selector Component
 * Allows users to see and test available Indonesian voices
 * Useful for debugging voice selection issues
 */

'use client';

import { useState, useEffect } from 'react';
import { getIndonesianVoicesInfo, announce } from '@/lib/audio';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { FocusAnnouncement } from '@/components/accessibility/FocusAnnouncement';

export function VoiceSelector() {
  const isMounted = useIsMounted();
  const [voiceInfo, setVoiceInfo] = useState<ReturnType<typeof getIndonesianVoicesInfo>>({
    available: false,
    voiceName: null,
    voiceLang: null,
    allVoices: [],
  });
  const [testMessage] = useState('Selamat datang di aplikasi Inklusif Kerja');

  useEffect(() => {
    if (!isMounted) return;

    // Get voice info after a short delay to ensure voices are loaded
    const timer = setTimeout(() => {
      const info = getIndonesianVoicesInfo();
      setVoiceInfo(info);
    }, 500);

    return () => clearTimeout(timer);
  }, [isMounted]);

  const handleTestVoice = () => {
    if (isMounted) {
      announce(testMessage);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="p-4 border border-border rounded-lg bg-card space-y-4">
      <FocusAnnouncement
        description="Informasi suara Text-to-Speech. Di sini Anda dapat melihat suara yang sedang digunakan dan suara Indonesia yang tersedia."
        label="Informasi Suara TTS"
      >
        <h3 className="text-lg font-semibold mb-2">Informasi Suara TTS</h3>
      </FocusAnnouncement>

      {voiceInfo.available ? (
        <div className="space-y-2">
          <p className="text-sm">
            <strong>Suara yang digunakan:</strong> {voiceInfo.voiceName || 'Tidak diketahui'}
          </p>
          <p className="text-sm">
            <strong>Bahasa:</strong> {voiceInfo.voiceLang || 'Tidak diketahui'}
          </p>
          
          {voiceInfo.allVoices.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">
                Semua suara Indonesia yang tersedia ({voiceInfo.allVoices.length}):
              </p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                {voiceInfo.allVoices.map((voice, index) => (
                  <li key={index}>
                    {voice.name} ({voice.lang}) {voice.default && '(Default)'}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <AccessibleButton
            onClick={handleTestVoice}
            variant="outline"
            announcementText="Menguji suara dengan pesan contoh"
            className="mt-4"
          >
            Uji Suara
          </AccessibleButton>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Tidak ada suara Indonesia yang ditemukan.
          </p>
          <p className="text-xs text-muted-foreground">
            Sistem akan menggunakan suara default yang mungkin tidak optimal untuk bahasa Indonesia.
            Untuk hasil terbaik, instal suara Indonesia melalui pengaturan sistem.
          </p>
        </div>
      )}
    </div>
  );
}
