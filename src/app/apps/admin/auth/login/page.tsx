/**
 * Admin Login Page
 * Login page for administrators
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
import { Eye, EyeOff, LogIn, Shield, ArrowLeft } from 'lucide-react';
import { getUserRole } from '@/lib/auth/roles';

export default function AdminLoginPage() {
  usePageAnnouncement('Login Admin', 'Halaman login untuk administrator');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted) {
      announce('Halaman login admin. Masukkan kredensial administrator Anda.');
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
        // Check if user is admin
        const role = await getUserRole();
        if (role !== 'admin') {
          // Sign out if not admin
          await supabase.auth.signOut();
          throw new Error('Akses ditolak. Hanya administrator yang dapat mengakses halaman ini.');
        }

        triggerHaptic('apply-success');
        playAudioCue('apply-success');
        announce('Login admin berhasil. Mengarahkan ke dashboard...');
        router.push('/apps/admin/dashboard');
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

  const loginButtonProps = useFocusAnnouncement({
    description: 'Tombol Masuk Admin. Klik untuk masuk ke dashboard administrator.',
    label: 'Tombol Masuk Admin',
    context: 'Tekan Enter untuk masuk',
    announceOnFocus: true,
    announceOnLongPress: true,
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-primary" aria-hidden="true" />
            <h1 className="text-3xl font-bold">Login Admin</h1>
          </div>
          <p className="text-muted-foreground">
            Masuk sebagai administrator
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
            label="Email Admin"
            description="Masukkan alamat email administrator"
            required
            format="email format"
            example="admin@inklusifkerja.id"
            placeholder="admin@inklusifkerja.id"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            id="admin-email"
          />

          <AccessibleInput
            label="Kata Sandi"
            description="Masukkan kata sandi administrator"
            required
            format="Minimal 6 karakter"
            example="••••••••"
            placeholder="Masukkan kata sandi"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            id="admin-password"
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
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
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
                <span>Masuk sebagai Admin</span>
              </>
            )}
          </button>
        </form>

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
  );
}
