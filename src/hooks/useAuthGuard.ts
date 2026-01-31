/**
 * Authentication Guard Hook
 * Redirects to login if user is not authenticated
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { announce } from '@/lib/audio';

interface UseAuthGuardOptions {
  redirectTo?: string;
  requireAuth?: boolean;
  onUnauthenticated?: () => void;
}

export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const {
    redirectTo = '/apps/learner/auth/login',
    requireAuth = true,
    onUnauthenticated,
  } = options;

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!isMounted || !requireAuth) {
      setLoading(false);
      return;
    }

    let isActive = true;

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          if (!isActive) return;
          setIsAuthenticated(true);
          setUserId(session.user.id);
          setLoading(false);
          return;
        }

        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          if (!isActive) return;
          setIsAuthenticated(false);
          setUserId(null);

          if (onUnauthenticated) {
            onUnauthenticated();
          } else {
            const currentPath = window.location.pathname;
            const returnUrl = encodeURIComponent(currentPath);
            router.push(`${redirectTo}?returnUrl=${returnUrl}`);

            if (isMounted) {
              announce('Anda harus login terlebih dahulu untuk mengakses halaman ini');
            }
          }
        } else {
          if (!isActive) return;
          setIsAuthenticated(true);
          setUserId(user.id);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        if (!isActive) return;
        setIsAuthenticated(false);
        setUserId(null);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isActive) return;
      if (session?.user) {
        setIsAuthenticated(true);
        setUserId(session.user.id);
      } else {
        setIsAuthenticated(false);
        setUserId(null);
      }
      setLoading(false);
    });

    return () => {
      isActive = false;
      authListener?.subscription?.unsubscribe();
    };
  }, [isMounted, requireAuth, redirectTo, router, onUnauthenticated]);

  return {
    isAuthenticated,
    userId,
    loading,
  };
}
