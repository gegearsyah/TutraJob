/**
 * OAuth Authentication Helpers
 * Handles Google and LinkedIn OAuth login
 */

import { supabase } from '@/lib/supabase/client';

export type OAuthProvider = 'google' | 'linkedin';

/**
 * Sign in with OAuth provider
 * @param provider - OAuth provider ('google' or 'linkedin')
 * @param redirectTo - URL to redirect to after successful login
 * @param userType - User type ('learner' or 'employer')
 */
export async function signInWithOAuth(
  provider: OAuthProvider,
  redirectTo?: string,
  userType: 'learner' | 'employer' = 'learner'
) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const defaultRedirectTo = `${baseUrl}/apps/${userType}/auth/callback`;
  const redirectUrl = redirectTo || defaultRedirectTo;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Get OAuth provider display name
 */
export function getOAuthProviderName(provider: OAuthProvider): string {
  const names: Record<OAuthProvider, string> = {
    google: 'Google',
    linkedin: 'LinkedIn',
  };
  return names[provider];
}
