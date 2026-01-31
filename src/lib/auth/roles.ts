/**
 * Role-based Authentication Utilities
 * Handles user roles (learner, employer, gov, admin)
 * Queries from dedicated users table instead of auth metadata
 */

import { supabase } from '@/lib/supabase/client';

export type UserRole = 'learner' | 'employer' | 'gov' | 'admin';

/**
 * Get user role from users table
 */
export async function getUserRole(): Promise<UserRole | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
    }

    const userId = session?.user?.id;
    if (!userId) return null;

    // Query role from users table (most reliable)
    const { data, error } = await supabase
      .from('users')
      .select('user_type')
      .eq('id', userId)
      .single();

    if (error) {
      console.warn('Error querying users table:', error.message);
      // Fallback to metadata
      const userEmail = session?.user?.email;
      if (userEmail?.endsWith('@admin.inklusifkerja.id') || userEmail?.includes('admin@')) {
        return 'admin';
      }
      return 'learner';
    }

    const role = data?.user_type as UserRole | null;
    return role ?? 'learner';
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

/**
 * Check if user has specific role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const userRole = await getUserRole();
  return userRole === role;
}

/**
 * Require specific role (throws if not matched)
 */
export async function requireRole(role: UserRole): Promise<void> {
  const userRole = await getUserRole();

  if (userRole !== role) {
    throw new Error(`Access denied. Required role: ${role}`);
  }
}
