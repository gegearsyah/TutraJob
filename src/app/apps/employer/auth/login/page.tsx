/**
 * Employer Login Page
 * Accessible login page for employers
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { announce, playAudioCue } from '@/lib/audio';
import { triggerHaptic } from '@/lib/haptic';
import { AccessibleInput } from '@/components/forms/AccessibleInput';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { Eye, EyeOff, LogIn, Mail, Lock, Building2, UserPlus, ArrowLeft, KeyRound } from 'lucide-react';

export default function EmployerLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted) {
      announce('Halaman login pemberi kerja. Masukkan email dan kata sandi perusahaan Anda.');
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
        announce('Login berhasil. Mengarahkan ke dashboard...');
        router.push('/apps/employer');
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
          <Building2 className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-bold mb-2">Masuk - Pemberi Kerja</h1>
          <p className="text-muted-foreground">
            Masuk ke dashboard perusahaan Anda
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
            label="Email Perusahaan"
            description="Masukkan alamat email perusahaan Anda yang terdaftar"
            required
            format="email format"
            example="perusahaan@email.com"
            placeholder="perusahaan@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            id="email"
          />

          <AccessibleInput
            label="Kata Sandi"
            description="Masukkan kata sandi perusahaan Anda"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[48px] px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        </form>

        <div className="text-center space-y-3">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Belum punya akun?
            </p>
            <AccessibleButton
              asLink
              href="/apps/employer/auth/signup"
              variant="outline"
              announcementText="Membuka halaman pendaftaran perusahaan"
              className="w-full sm:w-auto"
            >
              <UserPlus className="w-4 h-4" />
              Daftar di sini
            </AccessibleButton>
          </div>

          <AccessibleButton
            asLink
            href="/apps/employer/auth/forgot-password"
            variant="ghost"
            announcementText="Membuka halaman lupa kata sandi"
            className="w-full sm:w-auto"
          >
            <KeyRound className="w-4 h-4" />
            Lupa kata sandi?
          </AccessibleButton>
        </div>

        <div className="text-center">
          <AccessibleButton
            asLink
            href="/"
            variant="ghost"
            announcementText="Kembali ke halaman utama"
            className="text-sm text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke halaman utama
          </AccessibleButton>
        </div>
      </div>
    </div>
  );
}
