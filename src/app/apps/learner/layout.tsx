import type { Metadata } from "next";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { AnnouncementControl } from "@/components/accessibility/AnnouncementControl";
import Link from "next/link";
import { Home, Briefcase, User, Bookmark, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Learner Portal - Inklusif Kerja",
  description: "Job seeker portal for accessible employment opportunities",
};

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
                <Link
                  href="/apps/learner"
                  className="px-3 py-2 rounded-lg hover:bg-muted transition-colors min-h-[48px] flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  <span>Beranda</span>
                </Link>
                <Link
                  href="/apps/learner/jobs"
                  className="px-3 py-2 rounded-lg hover:bg-muted transition-colors min-h-[48px] flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Cari Pekerjaan</span>
                </Link>
                <Link
                  href="/apps/learner/applications"
                  className="px-3 py-2 rounded-lg hover:bg-muted transition-colors min-h-[48px] flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Lamaran</span>
                </Link>
                <Link
                  href="/apps/learner/saved"
                  className="px-3 py-2 rounded-lg hover:bg-muted transition-colors min-h-[48px] flex items-center gap-2"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Tersimpan</span>
                </Link>
                <Link
                  href="/apps/learner/profile"
                  className="px-3 py-2 rounded-lg hover:bg-muted transition-colors min-h-[48px] flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>Profil</span>
                </Link>
              </nav>
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
