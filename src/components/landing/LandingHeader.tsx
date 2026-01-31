'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const learnerPortalProps = useFocusAnnouncement({
    description: 'Portal Pencari Kerja. Klik untuk mengakses portal pencari kerja.',
    label: 'Tombol Portal Pencari Kerja',
    context: 'Tekan Enter untuk membuka Portal Pencari Kerja',
    announceOnFocus: true,
    announceOnLongPress: true,
  });

  const employerPortalProps = useFocusAnnouncement({
    description: 'Portal Pemberi Kerja. Klik untuk mengakses portal pemberi kerja.',
    label: 'Tombol Portal Pemberi Kerja',
    context: 'Tekan Enter untuk membuka Portal Pemberi Kerja',
    announceOnFocus: true,
    announceOnLongPress: true,
  });

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 group ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm hover:bg-white hover:shadow-md' 
          : 'bg-transparent hover:bg-black/20'
      }`}
      aria-label="Navigasi utama"
    >
      <div className="px-4 py-3">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={`flex items-center gap-2 font-bold text-xl hover:opacity-90 transition-all min-h-[40px] ${
              isScrolled ? 'text-primary' : 'text-white'
            }`}
          >
            <span className="text-xl">🎯</span>
            <span>Inklusif Kerja</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="#about"
              className={`transition-all min-h-[40px] flex items-center px-3 py-2 rounded-lg text-sm ${
                isScrolled 
                  ? 'text-gray-600 hover:text-primary hover:bg-primary/5' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Tentang
            </Link>
            <Link
              href="#creators"
              className={`transition-all min-h-[40px] flex items-center px-3 py-2 rounded-lg text-sm ${
                isScrolled 
                  ? 'text-gray-600 hover:text-primary hover:bg-primary/5' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Tim
            </Link>
            <Link
              href="#partners"
              className={`transition-all min-h-[40px] flex items-center px-3 py-2 rounded-lg text-sm ${
                isScrolled 
                  ? 'text-gray-600 hover:text-primary hover:bg-primary/5' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Mitra
            </Link>
            <Link
              href="#contact"
              className={`transition-all min-h-[40px] flex items-center px-3 py-2 rounded-lg text-sm ${
                isScrolled 
                  ? 'text-gray-600 hover:text-primary hover:bg-primary/5' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Kontak
            </Link>

            {/* Desktop CTA Buttons */}
            <div className="flex gap-2 ml-2">
              <Link
                href="/apps/learner"
                className={`px-3 py-2 rounded-lg transition-all duration-300 min-h-[40px] flex items-center gap-1 text-xs font-semibold ${
                  isScrolled
                    ? 'bg-primary/10 text-primary hover:bg-primary/20 hover:scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm hover:scale-105'
                }`}
                {...learnerPortalProps}
              >
                Pencari Kerja
              </Link>
              <Link
                href="/apps/employer"
                className="px-3 py-2 rounded-lg bg-secondary/80 text-secondary-foreground hover:bg-secondary hover:scale-105 transition-all duration-300 min-h-[40px] flex items-center gap-1 text-xs font-semibold"
                {...employerPortalProps}
              >
                Pemberi Kerja
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg transition-all ${
              isScrolled 
                ? 'text-primary hover:bg-gray-100 hover:scale-110' 
                : 'text-white hover:bg-white/10 hover:scale-110'
            }`}
            aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            className={`md:hidden mt-3 rounded-lg p-3 space-y-1 ${
              isScrolled 
                ? 'bg-white shadow-lg border border-gray-200' 
                : 'bg-black/80 backdrop-blur-sm'
            }`}
          >
            <Link
              href="#about"
              className={`block px-3 py-2 rounded-lg transition-all min-h-[40px] flex items-center text-sm ${
                isScrolled
                  ? 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Tentang
            </Link>
            <Link
              href="#creators"
              className={`block px-3 py-2 rounded-lg transition-all min-h-[40px] flex items-center text-sm ${
                isScrolled
                  ? 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Tim
            </Link>
            <Link
              href="#partners"
              className={`block px-3 py-2 rounded-lg transition-all min-h-[40px] flex items-center text-sm ${
                isScrolled
                  ? 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Mitra
            </Link>
            <Link
              href="#contact"
              className={`block px-3 py-2 rounded-lg transition-all min-h-[40px] flex items-center text-sm ${
                isScrolled
                  ? 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Kontak
            </Link>
            <div className="space-y-2 mt-3 pt-2 border-t border-white/10">
              <Link
                href="/apps/learner"
                className="block text-center px-3 py-2 rounded-lg bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300 min-h-[40px] flex items-center justify-center gap-2 font-semibold text-sm"
                onClick={() => setIsMenuOpen(false)}
                {...learnerPortalProps}
              >
                Portal Pencari Kerja
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/apps/employer"
                className="block text-center px-3 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:scale-105 transition-all duration-300 min-h-[40px] flex items-center justify-center gap-2 font-semibold text-sm"
                onClick={() => setIsMenuOpen(false)}
                {...employerPortalProps}
              >
                Portal Pemberi Kerja
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
