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
import { signInWithOAuth, getOAuthProviderName, type OAuthProvider } from '@/lib/auth/oauth';

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

  const handleOAuthLogin = async (provider: OAuthProvider) => {
    if (!isMounted) return;

    try {
      setError(null);
      triggerHaptic('loading');
      announce(`Memproses login dengan ${getOAuthProviderName(provider)}...`);
      
      // Get return URL if exists
      const returnUrl = sessionStorage.getItem('loginReturnUrl');
      const redirectTo = returnUrl 
        ? `${window.location.origin}${decodeURIComponent(returnUrl)}`
        : undefined;

      await signInWithOAuth(provider, redirectTo, 'learner');
    } catch (err: any) {
      setError(err.message || `Terjadi kesalahan saat login dengan ${getOAuthProviderName(provider)}`);
      triggerHaptic('error');
      playAudioCue('error');
      announce(`Kesalahan: ${err.message || 'Login gagal'}`);
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

        {/* OAuth Login Buttons */}
        <div className="space-y-3">
          {(() => {
            const googleButtonProps = useFocusAnnouncement({
              description: 'Masuk dengan Google. Klik untuk menggunakan akun Google Anda.',
              label: 'Masuk dengan Google',
              context: 'Tekan Enter untuk login dengan Google',
              announceOnFocus: true,
              announceOnLongPress: true,
            });

            const linkedinButtonProps = useFocusAnnouncement({
              description: 'Masuk dengan LinkedIn. Klik untuk menggunakan akun LinkedIn Anda.',
              label: 'Masuk dengan LinkedIn',
              context: 'Tekan Enter untuk login dengan LinkedIn',
              announceOnFocus: true,
              announceOnLongPress: true,
            });

            return (
              <>
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('google')}
                  disabled={loading}
                  className="w-full min-h-[48px] px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  {...googleButtonProps}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Masuk dengan Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuthLogin('linkedin')}
                  disabled={loading}
                  className="w-full min-h-[48px] px-4 py-2 bg-[#0077b5] text-white rounded-lg hover:bg-[#006399] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  {...linkedinButtonProps}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span>Masuk dengan LinkedIn</span>
                </button>
              </>
            );
          })()}
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">atau</span>
          </div>
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
