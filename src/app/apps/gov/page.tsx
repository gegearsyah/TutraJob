export default function GovPage() {
  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Welcome to Government Portal</h2>
          <p className="text-muted-foreground">
            Oversight and compliance monitoring dashboard
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-lg border border-border bg-card">
            <h3 className="text-xl font-semibold mb-2">Compliance Reports</h3>
            <p className="text-sm text-muted-foreground">
              Monitor employer compliance with Law No. 8/2016
            </p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <h3 className="text-xl font-semibold mb-2">Statistics</h3>
            <p className="text-sm text-muted-foreground">
              View employment statistics and trends
            </p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <h3 className="text-xl font-semibold mb-2">Policy Management</h3>
            <p className="text-sm text-muted-foreground">
              Manage policies and regulations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
