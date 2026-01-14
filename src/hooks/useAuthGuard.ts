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

    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          setIsAuthenticated(false);
          setUserId(null);
          
          if (onUnauthenticated) {
            onUnauthenticated();
          } else {
            // Redirect to login with return URL
            const currentPath = window.location.pathname;
            const returnUrl = encodeURIComponent(currentPath);
            router.push(`${redirectTo}?returnUrl=${returnUrl}`);
            
            if (isMounted) {
              announce('Anda harus login terlebih dahulu untuk mengakses halaman ini');
            }
          }
        } else {
          setIsAuthenticated(true);
          setUserId(user.id);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsAuthenticated(false);
        setUserId(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [isMounted, requireAuth, redirectTo, router, onUnauthenticated]);

  return {
    isAuthenticated,
    userId,
    loading,
  };
}
