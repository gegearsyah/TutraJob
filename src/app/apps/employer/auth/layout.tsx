'use client';
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-2xl">🎯</span>
              <h1 className="text-xl font-bold text-primary">Inklusif Kerja</h1>
            </Link>
            <Link 
              href="/" 
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors min-h-[48px] px-3"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
