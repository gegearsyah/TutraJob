import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-primary">
          Inklusif Kerja
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Platform rekrutmen yang mudah diakses untuk Indonesia
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/apps/learner"
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Portal Pencari Kerja
          </Link>
          <Link
            href="/apps/employer"
            className="px-6 py-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
          >
            Portal Pemberi Kerja
          </Link>
          <Link
            href="/apps/gov"
            className="px-6 py-3 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
          >
            Portal Pemerintah
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          <Link
            href="/apps/learner/auth/login"
            className="px-6 py-3 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors"
          >
            Masuk sebagai Pencari Kerja
          </Link>
          <Link
            href="/apps/employer/auth/login"
            className="px-6 py-3 rounded-lg border border-secondary text-secondary-foreground hover:bg-secondary/10 transition-colors"
          >
            Masuk sebagai Pemberi Kerja
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mt-8">
          Untuk pengembangan: Gunakan subdomain atau tambahkan ?tenant=learner, ?tenant=employer, atau ?tenant=gov ke URL
        </p>
      </div>
    </div>
  );
}
