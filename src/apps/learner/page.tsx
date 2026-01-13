import Link from 'next/link';

export default function LearnerPage() {
  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Welcome to Learner Portal</h2>
          <p className="text-muted-foreground">
            Accessible job search platform for job seekers
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/apps/learner/jobs"
            className="p-6 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">Find Jobs</h3>
            <p className="text-sm text-muted-foreground">
              Browse accessible job opportunities
            </p>
          </Link>
          <div className="p-6 rounded-lg border border-border bg-card">
            <h3 className="text-xl font-semibold mb-2">Apply Easily</h3>
            <p className="text-sm text-muted-foreground">
              Simple gesture-based application process
            </p>
          </div>
          <Link
            href="/apps/learner/profile"
            className="p-6 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">Lengkapi Profil</h3>
            <p className="text-sm text-muted-foreground">
              Upload CV dan lengkapi data diri
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
