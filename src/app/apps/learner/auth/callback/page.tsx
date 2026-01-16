/**
 * OAuth Callback Page
 * Handles OAuth redirects from Google and LinkedIn
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { announce } from '@/lib/audio';
import { triggerHaptic } from '@/lib/haptic';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const isMounted = useIsMounted();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isMounted) return;

    const handleCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (data.session) {
          setStatus('success');
          triggerHaptic('apply-success');
          announce('Login berhasil. Mengarahkan...');

          // Check for return URL
          const returnUrl = sessionStorage.getItem('loginReturnUrl');
          if (returnUrl) {
            sessionStorage.removeItem('loginReturnUrl');
            setTimeout(() => {
              router.push(decodeURIComponent(returnUrl));
            }, 1000);
          } else {
            setTimeout(() => {
              router.push('/apps/learner');
            }, 1000);
          }
        } else {
          throw new Error('No session found');
        }
      } catch (err: any) {
        setStatus('error');
        setError(err.message || 'Terjadi kesalahan saat login');
        triggerHaptic('error');
        announce(`Kesalahan: ${err.message || 'Login gagal'}`);
        
        setTimeout(() => {
          router.push('/apps/learner/auth/login');
        }, 3000);
      }
    };

    handleCallback();
  }, [isMounted, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md text-center space-y-4">
        {status === 'loading' && (
          <>
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <h1 className="text-2xl font-bold">Memproses login...</h1>
            <p className="text-muted-foreground">Mohon tunggu sebentar</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-4xl mb-4">✅</div>
            <h1 className="text-2xl font-bold">Login berhasil!</h1>
            <p className="text-muted-foreground">Mengarahkan ke halaman utama...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-4xl mb-4">❌</div>
            <h1 className="text-2xl font-bold">Login gagal</h1>
            <p className="text-muted-foreground">{error}</p>
            <p className="text-sm text-muted-foreground mt-4">
              Mengarahkan ke halaman login...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
