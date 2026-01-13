export default function EmployerPage() {
  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Welcome to Employer Portal</h2>
          <p className="text-muted-foreground">
            Manage inclusive recruitment and compliance tracking
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-lg border border-border bg-card">
            <h3 className="text-xl font-semibold mb-2">Post Jobs</h3>
            <p className="text-sm text-muted-foreground">
              Create accessible job listings
            </p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <h3 className="text-xl font-semibold mb-2">Compliance Tracker</h3>
            <p className="text-sm text-muted-foreground">
              Monitor hiring quota compliance
            </p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <h3 className="text-xl font-semibold mb-2">Review Candidates</h3>
            <p className="text-sm text-muted-foreground">
              Unbiased screening tools
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
