/**
 * Mobile Bottom Navigation Bar
 * Sticky navigation for easy access on mobile devices
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, FileText, BookmarkCheck, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { announce } from '@/lib/audio';
import { triggerHaptic } from '@/lib/haptic';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  ariaLabel: string;
}

const navItems: NavItem[] = [
  {
    href: '/apps/learner',
    label: 'Beranda',
    icon: Home,
    ariaLabel: 'Beranda - Halaman utama portal pencari kerja',
  },
  {
    href: '/apps/learner/jobs',
    label: 'Pekerjaan',
    icon: Briefcase,
    ariaLabel: 'Cari Pekerjaan - Jelajahi lowongan kerja yang tersedia',
  },
  {
    href: '/apps/learner/applications',
    label: 'Lamaran',
    icon: FileText,
    ariaLabel: 'Lamaran - Lacak status lamaran Anda',
  },
  {
    href: '/apps/learner/saved',
    label: 'Tersimpan',
    icon: BookmarkCheck,
    ariaLabel: 'Tersimpan - Lihat pekerjaan yang disimpan',
  },
  {
    href: '/apps/learner/profile',
    label: 'Profil',
    icon: User,
    ariaLabel: 'Profil - Kelola profil dan pengaturan',
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  const handleNavClick = (label: string) => {
    triggerHaptic('confirmation');
    announce(`Navigasi ke ${label}`);
  };

  return (
    <>
      {/* Bottom navigation - only visible on mobile */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border"
        role="navigation"
        aria-label="Navigasi utama mobile"
      >
        <div className="flex items-center justify-around h-16 px-2 safe-area-bottom">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleNavClick(item.label)}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset rounded-lg',
                  'active:bg-muted/50',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-label={item.ariaLabel}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  className={cn(
                    'w-6 h-6 transition-transform',
                    isActive && 'scale-110'
                  )}
                />
                <span
                  className={cn(
                    'text-xs font-medium',
                    isActive && 'font-semibold'
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden behind bottom nav */}
      <div className="md:hidden h-16" aria-hidden="true" />
    </>
  );
}
