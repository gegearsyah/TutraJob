/**
 * Role-based Authentication Utilities
 * Handles user roles (learner, employer, gov)
 */

import { supabase } from '@/lib/supabase/client';

export type UserRole = 'learner' | 'employer' | 'gov';

/**
 * Get user role from auth metadata
 */
export async function getUserRole(): Promise<UserRole | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    // Check user metadata for role
    const userType = user.user_metadata?.user_type as string;
    
    if (userType === 'learner' || userType === 'employer' || userType === 'gov') {
      return userType as UserRole;
    }

    // Default to learner if no role specified
    return 'learner';
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

/**
 * Get user role from server-side
 * Note: This requires service role key for admin access
 */
export async function getUserRoleServer(userId: string): Promise<UserRole | null> {
  try {
    // For now, use client-side method
    // In production, this should use Supabase Admin API with service role key
    return await getUserRole();
  } catch (error) {
    console.error('Error getting user role (server):', error);
    return null;
  }
}
