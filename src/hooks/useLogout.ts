/**
 * Logout Hook
 * Provides unified logout functionality across the app
 */

'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { announce } from '@/lib/audio';
import { triggerHaptic } from '@/lib/haptic';
import { useIsMounted } from '@/lib/hooks/useIsMounted';

interface UseLogoutOptions {
  redirectTo?: string;
  onLogout?: () => void;
}

export function useLogout(options: UseLogoutOptions = {}) {
  const {
    redirectTo = '/',
    onLogout,
  } = options;

  const router = useRouter();
  const isMounted = useIsMounted();

  const logout = async () => {
    try {
      if (isMounted) {
        triggerHaptic('dismiss');
        announce('Anda keluar dari akun. Anda akan dialihkan ke halaman login.');
      }

      // Call onLogout callback if provided
      if (onLogout) {
        onLogout();
      }

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error logging out:', error);
        if (isMounted) {
          announce('Gagal keluar. Silakan coba lagi.');
          triggerHaptic('error');
        }
        return false;
      }

      // Clear any local storage data
      try {
        sessionStorage.clear();
        // Keep app settings but clear session data
        const theme = localStorage.getItem('theme');
        localStorage.clear();
        if (theme) localStorage.setItem('theme', theme);
      } catch (error) {
        console.error('Error clearing storage:', error);
      }

      if (isMounted) {
        triggerHaptic('apply-success');
      }

      // Redirect to login or home
      router.push(redirectTo);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      if (isMounted) {
        announce('Terjadi kesalahan saat keluar.');
        triggerHaptic('error');
      }
      return false;
    }
  };

  return { logout };
}
