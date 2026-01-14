/**
 * Forgot Password Page
 * Accessible forgot password page for job seekers
 */

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { usePageAnnouncement } from '@/hooks/usePageAnnouncement';
import { announce, playAudioCue } from '@/lib/audio';
import { triggerHaptic } from '@/lib/haptic';
import { AccessibleInput } from '@/components/forms/AccessibleInput';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  // Announce page on load and stop previous announcements
  usePageAnnouncement('Lupa Kata Sandi', 'Reset kata sandi Anda');

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted) {
      announce('Halaman lupa kata sandi. Masukkan email Anda untuk menerima link reset kata sandi.');
    }
  }, [isMounted]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!isMounted) return;

    try {
      triggerHaptic('loading');
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/apps/learner/auth/reset-password`,
      });

      if (resetError) {
        throw resetError;
      }

      triggerHaptic('apply-success');
      playAudioCue('apply-success');
      announce('Email reset kata sandi telah dikirim. Silakan cek inbox email Anda.');
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengirim email reset');
      triggerHaptic('error');
      playAudioCue('error');
      announce(`Kesalahan: ${err.message || 'Gagal mengirim email reset'}`);
    } finally {
      setLoading(false);
    }
  };

  const returnButtonProps = useFocusAnnouncement({
    description: 'Kembali ke halaman login. Klik untuk kembali ke halaman login pencari kerja.',
    label: 'Tombol Kembali',
    context: 'Tekan Enter untuk kembali ke halaman login',
    announceOnFocus: true,
    announceOnLongPress: true,
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Lupa Kata Sandi</h1>
          <p className="text-muted-foreground">
            Masukkan email Anda untuk menerima link reset kata sandi
          </p>
        </div>

        {success ? (
          <div className="space-y-6">
            <div
              className="p-4 bg-green-500/10 border border-green-500 rounded-lg"
              role="alert"
              aria-live="assertive"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <p className="text-sm text-green-500 font-medium">
                  Email reset kata sandi telah dikirim!
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Silakan cek inbox email Anda dan ikuti instruksi untuk reset kata sandi.
              </p>
            </div>

            <AccessibleButton
              asLink
              href="/apps/learner/auth/login"
              variant="primary"
              announcementText="Kembali ke halaman login"
              className="w-full min-h-[48px]"
            >
              <ArrowLeft className="w-5 h-5" />
              Kembali ke Login
            </AccessibleButton>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            {error && (
              <div
                className="p-4 bg-destructive/10 border border-destructive rounded-lg"
                role="alert"
                aria-live="assertive"
              >
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <AccessibleInput
              label="Email"
              description="Masukkan alamat email yang terdaftar untuk menerima link reset kata sandi"
              required
              format="email format"
              example="nama@email.com"
              placeholder="nama@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              id="email"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  <span>Kirim Link Reset</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="space-y-3">
          <AccessibleButton
            asLink
            href="/apps/learner/auth/login"
            variant="ghost"
            announcementText="Kembali ke halaman login"
            className="w-full min-h-[48px]"
            {...returnButtonProps}
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Login
          </AccessibleButton>

          <AccessibleButton
            asLink
            href="/"
            variant="ghost"
            announcementText="Kembali ke halaman utama"
            className="w-full min-h-[48px]"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Halaman Utama
          </AccessibleButton>
        </div>
      </div>
    </div>
  );
}
