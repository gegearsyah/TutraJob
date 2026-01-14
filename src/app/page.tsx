'use client';

import { useEffect } from 'react';
import Link from "next/link";
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { announce } from '@/lib/audio';
import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';

export default function Home() {
  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      // Announce immediately when page loads
      const announceWelcome = () => {
        if ('speechSynthesis' in window) {
          announce('Selamat datang di aplikasi Inklusif Kerja. Platform rekrutmen yang mudah diakses untuk Indonesia. Pilih portal yang ingin Anda akses: Portal Pencari Kerja, Portal Pemberi Kerja, atau Portal Pemerintah.');
        }
      };

      // Try immediately, then retry if needed
      announceWelcome();
      const timer = setTimeout(() => {
        if (window.speechSynthesis.getVoices().length === 0) {
          // Voices not loaded yet, wait a bit more
          setTimeout(announceWelcome, 300);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isMounted]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-primary">
          Inklusif Kerja
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Platform rekrutmen yang mudah diakses untuk Indonesia
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          {(() => {
            const learnerPortalProps = useFocusAnnouncement({
              description: 'Portal Pencari Kerja. Klik untuk mengakses portal pencari kerja, di mana Anda dapat mencari pekerjaan, melamar, dan mengelola profil Anda.',
              label: 'Tombol Portal Pencari Kerja',
              context: 'Tekan Enter untuk membuka Portal Pencari Kerja',
              announceOnFocus: true,
              announceOnLongPress: true,
            });
            return (
              <Link
                href="/apps/learner"
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors min-h-[48px] flex items-center justify-center"
                {...learnerPortalProps}
              >
                Portal Pencari Kerja
              </Link>
            );
          })()}
          {(() => {
            const employerPortalProps = useFocusAnnouncement({
              description: 'Portal Pemberi Kerja. Klik untuk mengakses portal pemberi kerja, di mana Anda dapat memposting lowongan, mengelola kandidat, dan melacak compliance.',
              label: 'Tombol Portal Pemberi Kerja',
              context: 'Tekan Enter untuk membuka Portal Pemberi Kerja',
              announceOnFocus: true,
              announceOnLongPress: true,
            });
            return (
              <Link
                href="/apps/employer"
                className="px-6 py-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors min-h-[48px] flex items-center justify-center"
                {...employerPortalProps}
              >
                Portal Pemberi Kerja
              </Link>
            );
          })()}
          {(() => {
            const govPortalProps = useFocusAnnouncement({
              description: 'Portal Pemerintah. Klik untuk mengakses portal pemerintah, di mana Anda dapat memantau compliance perusahaan dan melihat statistik industri.',
              label: 'Tombol Portal Pemerintah',
              context: 'Tekan Enter untuk membuka Portal Pemerintah',
              announceOnFocus: true,
              announceOnLongPress: true,
            });
            return (
              <Link
                href="/apps/gov"
                className="px-6 py-3 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors min-h-[48px] flex items-center justify-center"
                {...govPortalProps}
              >
                Portal Pemerintah
              </Link>
            );
          })()}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          {(() => {
            const learnerLoginProps = useFocusAnnouncement({
              description: 'Masuk sebagai Pencari Kerja. Klik untuk masuk ke akun pencari kerja Anda. Jika belum punya akun, Anda dapat mendaftar terlebih dahulu.',
              label: 'Tombol Masuk sebagai Pencari Kerja',
              context: 'Tekan Enter untuk membuka halaman login pencari kerja',
              announceOnFocus: true,
              announceOnLongPress: true,
            });
            return (
              <Link
                href="/apps/learner/auth/login"
                className="px-6 py-3 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors min-h-[48px] flex items-center justify-center"
                {...learnerLoginProps}
              >
                Masuk sebagai Pencari Kerja
              </Link>
            );
          })()}
          {(() => {
            const employerLoginProps = useFocusAnnouncement({
              description: 'Masuk sebagai Pemberi Kerja. Klik untuk masuk ke akun pemberi kerja Anda. Jika belum punya akun, Anda dapat mendaftar terlebih dahulu.',
              label: 'Tombol Masuk sebagai Pemberi Kerja',
              context: 'Tekan Enter untuk membuka halaman login pemberi kerja',
              announceOnFocus: true,
              announceOnLongPress: true,
            });
            return (
              <Link
                href="/apps/employer/auth/login"
                className="px-6 py-3 rounded-lg border border-secondary text-secondary-foreground hover:bg-secondary/10 transition-colors min-h-[48px] flex items-center justify-center"
                {...employerLoginProps}
              >
                Masuk sebagai Pemberi Kerja
              </Link>
            );
          })()}
        </div>
        <p className="text-sm text-muted-foreground mt-8">
          Untuk pengembangan: Gunakan subdomain atau tambahkan ?tenant=learner, ?tenant=employer, atau ?tenant=gov ke URL
        </p>
      </div>
    </div>
  );
}
