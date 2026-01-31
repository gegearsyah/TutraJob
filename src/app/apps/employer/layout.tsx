'use client';
import type { Metadata } from "next";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { usePathname } from "next/navigation";

export default function EmployerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname?.includes('/auth/');

  return (
    <div className="min-h-screen bg-background">
      {!isAuthPage && (
      <header className="border-b border-border bg-card">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-industri-primary">Employer Portal</h1>
            <ThemeToggle />
          </div>
        </div>
      </header>
      )}
      <main>{children}</main>
    </div>
  );
}
