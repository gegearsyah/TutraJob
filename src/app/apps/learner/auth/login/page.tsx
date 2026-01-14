/**
 * Learner Login Page
 * Accessible login page for job seekers
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
import { Eye, EyeOff, LogIn, Mail, Lock, UserPlus, ArrowLeft, KeyRound } from 'lucide-react';

export default function LoginPage() {
  // Announce page on load and stop previous announcements
  usePageAnnouncement('Masuk', 'Masuk ke akun pencari kerja');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const isMounted = useIsMounted();

  // Get return URL from query params
  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const returnUrl = params.get('returnUrl');
      if (returnUrl) {
        // Store return URL for after login
        sessionStorage.setItem('loginReturnUrl', returnUrl);
      }
    }
  }, [isMounted]);

  useEffect(() => {
    if (isMounted) {
      announce('Halaman login. Masukkan email dan kata sandi Anda.');
    }
  }, [isMounted]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!isMounted) return;

    try {
      triggerHaptic('loading');
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (data.user) {
        triggerHaptic('apply-success');
        playAudioCue('apply-success');
        announce('Login berhasil. Mengarahkan...');
        
        // Check for return URL
        const returnUrl = sessionStorage.getItem('loginReturnUrl');
        if (returnUrl) {
          sessionStorage.removeItem('loginReturnUrl');
          router.push(decodeURIComponent(returnUrl));
        } else {
          router.push('/apps/learner');
        }
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login');
      triggerHaptic('error');
      playAudioCue('error');
      announce(`Kesalahan: ${err.message || 'Login gagal'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Masuk</h1>
          <p className="text-muted-foreground">
            Masuk ke akun Anda untuk melanjutkan
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
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
            description="Masukkan alamat email Anda yang terdaftar"
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
            description="Masukkan kata sandi Anda"
            required
            format="Minimal 6 karakter"
            example="••••••••"
            placeholder="Masukkan kata sandi"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
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

          {(() => {
            const loginButtonProps = useFocusAnnouncement({
              description: 'Tombol Masuk. Klik untuk masuk ke akun Anda dengan email dan kata sandi yang telah Anda masukkan.',
              label: 'Tombol Masuk',
              context: 'Tekan Enter untuk masuk ke akun',
              announceOnFocus: true,
              announceOnLongPress: true,
            });
            return (
              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[48px] px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                {...loginButtonProps}
              >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Masuk</span>
              </>
            )}
              </button>
            );
          })()}
        </form>

        <div className="space-y-3">
          <AccessibleButton
            asLink
            href="/apps/learner/auth/signup"
            variant="outline"
            announcementText="Membuka halaman pendaftaran"
            className="w-full min-h-[48px]"
          >
            <UserPlus className="w-5 h-5" />
            Daftar di sini
          </AccessibleButton>

          <AccessibleButton
            asLink
            href="/apps/learner/auth/forgot-password"
            variant="ghost"
            announcementText="Membuka halaman lupa kata sandi"
            className="w-full min-h-[48px]"
          >
            <KeyRound className="w-5 h-5" />
            Lupa kata sandi?
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
