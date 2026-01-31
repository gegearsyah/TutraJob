'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useLogout } from '@/hooks/useLogout';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { announce } from '@/lib/audio';
import { useIsMounted } from '@/lib/hooks/useIsMounted';

interface UserNavigationProps {
  userType?: 'learner' | 'employer' | 'admin' | 'gov';
  settingsUrl?: string;
  profileUrl?: string;
}

export function UserNavigation({
  userType = 'learner',
  settingsUrl,
  profileUrl,
}: UserNavigationProps) {
  const [email, setEmail] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const isMounted = useIsMounted();
  const { logout } = useLogout({
    redirectTo: `/${userType === 'admin' ? 'apps/admin' : userType === 'gov' ? 'apps/gov' : userType === 'employer' ? 'apps/employer' : 'apps/learner'}/auth/login`,
  });

  useEffect(() => {
    if (!isMounted) return;

    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          setEmail(user.email);
        }
      } catch (error) {
        console.error('Error getting user:', error);
      }
    };

    getUser();
  }, [isMounted]);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  const getUserInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  if (!email) return null;

  return (
    <div className="relative">
      {/* Desktop Menu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[44px]"
        aria-label="Menu Pengguna"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
          {getUserInitials(email)}
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-50"
          role="menu"
          aria-orientation="vertical"
        >
          {/* User Info */}
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs text-muted-foreground">Akun Anda</p>
            <p className="text-sm font-semibold truncate">{email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {profileUrl && (
              <Link
                href={profileUrl}
                className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors"
                onClick={() => setIsOpen(false)}
                role="menuitem"
              >
                <User className="w-4 h-4" aria-hidden="true" />
                <span>Profil</span>
              </Link>
            )}

            {settingsUrl && (
              <Link
                href={settingsUrl}
                className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors"
                onClick={() => setIsOpen(false)}
                role="menuitem"
              >
                <Settings className="w-4 h-4" aria-hidden="true" />
                <span>Pengaturan</span>
              </Link>
            )}

            {/* Divider */}
            {(profileUrl || settingsUrl) && (
              <div className="my-2 border-t border-border"></div>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              role="menuitem"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      )}

      {/* Close menu when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
}
