'use client';
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { AnnouncementControl } from "@/components/accessibility/AnnouncementControl";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { FocusAnnouncement } from "@/components/accessibility/FocusAnnouncement";
import Link from "next/link";
import { Home, Briefcase, User, Bookmark, FileText } from "lucide-react";

// Metadata moved to page.tsx files

export default function LearnerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/apps/learner" className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-primary">Portal Pencari Kerja</h1>
            </Link>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-2">
                <FocusAnnouncement
                  description="Kembali ke halaman utama portal pencari kerja"
                  label="Beranda"
                  context="Tekan Enter untuk membuka halaman beranda"
                  isNavigation={true}
                >
                  <Link
                    href="/apps/learner"
                    className="px-3 py-2 rounded-lg hover:bg-muted transition-colors min-h-[48px] flex items-center gap-2"
                  >
                    <Home className="w-4 h-4" aria-hidden="true" />
                    <span>Beranda</span>
                  </Link>
                </FocusAnnouncement>
                <FocusAnnouncement
                  description="Jelajahi dan cari lowongan kerja yang sesuai dengan profil Anda"
                  label="Cari Pekerjaan"
                  context="Tekan Enter untuk membuka halaman pencarian pekerjaan"
                  isNavigation={true}
                >
                  <Link
                    href="/apps/learner/jobs"
                    className="px-3 py-2 rounded-lg hover:bg-muted transition-colors min-h-[48px] flex items-center gap-2"
                  >
                    <Briefcase className="w-4 h-4" aria-hidden="true" />
                    <span>Cari Pekerjaan</span>
                  </Link>
                </FocusAnnouncement>
                <FocusAnnouncement
                  description="Lihat status semua lamaran pekerjaan yang telah Anda kirim"
                  label="Lamaran"
                  context="Tekan Enter untuk membuka halaman status lamaran"
                  isNavigation={true}
                >
                  <Link
                    href="/apps/learner/applications"
                    className="px-3 py-2 rounded-lg hover:bg-muted transition-colors min-h-[48px] flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" aria-hidden="true" />
                    <span>Lamaran</span>
                  </Link>
                </FocusAnnouncement>
                <FocusAnnouncement
                  description="Akses pekerjaan yang telah Anda simpan untuk ditinjau nanti"
                  label="Tersimpan"
                  context="Tekan Enter untuk membuka halaman pekerjaan tersimpan"
                  isNavigation={true}
                >
                  <Link
                    href="/apps/learner/saved"
                    className="px-3 py-2 rounded-lg hover:bg-muted transition-colors min-h-[48px] flex items-center gap-2"
                  >
                    <Bookmark className="w-4 h-4" aria-hidden="true" />
                    <span>Tersimpan</span>
                  </Link>
                </FocusAnnouncement>
                <FocusAnnouncement
                  description="Kelola profil pribadi, pengalaman kerja, dan preferensi pekerjaan Anda"
                  label="Profil"
                  context="Tekan Enter untuk membuka halaman profil"
                  isNavigation={true}
                >
                  <Link
                    href="/apps/learner/profile"
                    className="px-3 py-2 rounded-lg hover:bg-muted transition-colors min-h-[48px] flex items-center gap-2"
                  >
                    <User className="w-4 h-4" aria-hidden="true" />
                    <span>Profil</span>
                  </Link>
                </FocusAnnouncement>
              </nav>
              <ThemeToggle />
              <div data-tutorial="notifications">
                <NotificationCenter />
              </div>
            </div>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <AnnouncementControl variant="floating" />
    </div>
  );
}
