import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Government Portal - Inklusif Kerja",
  description: "Government dashboard for employment oversight",
};

export default function GovLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container py-4">
          <h1 className="text-2xl font-bold text-primary">Government Portal</h1>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
