import type { Metadata } from "next";

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
      <header className="border-b border-border bg-card">
        <div className="container py-4">
          <h1 className="text-2xl font-bold text-primary">Learner Portal</h1>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
