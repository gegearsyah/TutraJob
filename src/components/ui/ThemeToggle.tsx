/**
 * Theme Toggle Component
 * Accessible theme switcher for light/dark mode
 */

'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { AccessibleButton } from './AccessibleButton';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { announce } from '@/lib/audio';

export function ThemeToggle() {
  const disableDarkMode = true;
  if (disableDarkMode) {
    return null;
  }

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isMounted = useIsMounted();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isMounted) {
    return (
      <div className="min-w-[48px] min-h-[48px] flex items-center justify-center">
        <div className="w-5 h-5" aria-hidden="true" />
      </div>
    );
  }

  const handleToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (isMounted) {
      const themeName = newTheme === 'dark' ? 'Mode gelap' : 'Mode terang';
      announce(`Tema diubah ke ${themeName}`);
    }
  };

  return (
    <AccessibleButton
      variant="ghost"
      onClick={handleToggle}
      aria-label={theme === 'dark' ? 'Ubah ke mode terang' : 'Ubah ke mode gelap'}
      announcementText={theme === 'dark' ? 'Mengubah ke mode terang' : 'Mengubah ke mode gelap'}
      className="min-w-[48px] min-h-[48px] p-2"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5" aria-hidden="true" />
      ) : (
        <Moon className="w-5 h-5" aria-hidden="true" />
      )}
      <span className="sr-only">{theme === 'dark' ? 'Ubah ke mode terang' : 'Ubah ke mode gelap'}</span>
    </AccessibleButton>
  );
}
