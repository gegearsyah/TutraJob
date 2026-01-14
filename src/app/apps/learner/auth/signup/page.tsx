/**
 * Learner Signup Page
 * Accessible signup page for job seekers
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { usePageAnnouncement } from '@/hooks/usePageAnnouncement';
import { announce, playAudioCue } from '@/lib/audio';
import { triggerHaptic } from '@/lib/haptic';
import { AccessibleInput } from '@/components/forms/AccessibleInput';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';
import { Eye, EyeOff, UserPlus, Mail, Lock, User, LogIn, ArrowLeft } from 'lucide-react';

export default function SignupPage() {
  // Announce page on load and stop previous announcements
  usePageAnnouncement('Daftar', 'Buat akun pencari kerja baru');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted) {
      announce('Halaman pendaftaran. Lengkapi formulir untuk membuat akun baru.');
    }
  }, [isMounted]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Kata sandi tidak cocok');
      if (isMounted) {
        triggerHaptic('error');
        playAudioCue('error');
        announce('Kata sandi tidak cocok');
      }
      return;
    }

    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter');
      if (isMounted) {
        triggerHaptic('error');
        playAudioCue('error');
        announce('Kata sandi minimal 6 karakter');
      }
      return;
    }

    setLoading(true);

    if (!isMounted) return;

    try {
      triggerHaptic('loading');
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: 'learner',
          },
        },
      });

      if (authError) {
        throw authError;
      }

      if (data.user) {
        triggerHaptic('apply-success');
        playAudioCue('apply-success');
        announce('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.');
        router.push('/apps/learner/auth/verify-email');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mendaftar');
      triggerHaptic('error');
      playAudioCue('error');
      announce(`Kesalahan: ${err.message || 'Pendaftaran gagal'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Daftar</h1>
          <p className="text-muted-foreground">
            Buat akun baru untuk mulai mencari pekerjaan
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
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
            label="Nama Lengkap"
            description="Masukkan nama lengkap Anda"
            required
            example="Budi Santoso"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            placeholder="Nama lengkap Anda"
            id="fullName"
          />

          <AccessibleInput
            label="Email"
            description="Masukkan alamat email aktif Anda"
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

          <AccessibleInput
            label="Kata Sandi"
            description="Buat kata sandi yang kuat, minimal 6 karakter"
            required
            format="Minimal 6 karakter"
            example="••••••••"
            placeholder="Minimal 6 karakter"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            id="password"
            suffix={
              <button
                type="button"
                onClick={() => {
                  setShowPassword(!showPassword);
                  if (isMounted) {
                    announce(showPassword ? 'Kata sandi disembunyikan' : 'Kata sandi ditampilkan');
                    triggerHaptic('loading');
                  }
                }}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-muted rounded-lg transition-colors"
                aria-label={showPassword ? 'Sembunyikan kata sandi. Tekan untuk menyembunyikan kata sandi' : 'Tampilkan kata sandi. Tekan untuk menampilkan kata sandi'}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Eye className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            }
          />

          <AccessibleInput
            label="Konfirmasi Kata Sandi"
            description="Ulangi kata sandi yang sama untuk konfirmasi"
            required
            format="Harus sama dengan kata sandi"
            example="••••••••"
            placeholder="Ulangi kata sandi"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            id="confirmPassword"
            suffix={
              <button
                type="button"
                onClick={() => {
                  setShowConfirmPassword(!showConfirmPassword);
                  if (isMounted) {
                    announce(showConfirmPassword ? 'Konfirmasi kata sandi disembunyikan' : 'Konfirmasi kata sandi ditampilkan');
                    triggerHaptic('loading');
                  }
                }}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-muted rounded-lg transition-colors"
                aria-label={showConfirmPassword ? 'Sembunyikan konfirmasi kata sandi. Tekan untuk menyembunyikan konfirmasi kata sandi' : 'Tampilkan konfirmasi kata sandi. Tekan untuk menampilkan konfirmasi kata sandi'}
                aria-pressed={showConfirmPassword}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Eye className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            }
          />

          {(() => {
            const signupButtonProps = useFocusAnnouncement({
              description: 'Tombol Daftar. Klik untuk membuat akun baru dengan informasi yang telah Anda isi di formulir.',
              label: 'Tombol Daftar',
              context: 'Tekan Enter untuk membuat akun baru',
              announceOnFocus: true,
              announceOnLongPress: true,
            });
            return (
              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[48px] px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                {...signupButtonProps}
              >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                <span>Daftar</span>
              </>
            )}
              </button>
            );
          })()}
        </form>

        <div className="space-y-3">
          <AccessibleButton
            asLink
            href="/apps/learner/auth/login"
            variant="outline"
            announcementText="Membuka halaman login"
            className="w-full min-h-[48px]"
          >
            <LogIn className="w-5 h-5" />
            Masuk di sini
          </AccessibleButton>

          <AccessibleButton
            asLink
            href="/"
            variant="ghost"
            announcementText="Kembali ke halaman utama"
            className="w-full min-h-[48px]"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke halaman utama
          </AccessibleButton>
        </div>
      </div>
    </div>
  );
}
