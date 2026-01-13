import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employer Portal - Inklusif Kerja",
  description: "Employer dashboard for inclusive recruitment",
};

export default function EmployerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container py-4">
          <h1 className="text-2xl font-bold text-industri-primary">Employer Portal</h1>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
