/**
 * Quota Compliance Tracker
 * Real-time compliance visualization for Law No. 8/2016
 */

'use client';

import { useState, useEffect } from 'react';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { TrendingUp, Users, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ComplianceMetrics {
  totalEmployees: number;
  employeesWithDisabilities: number;
  requiredPercentage: number; // 1% or 2%
  currentPercentage: number;
  gap: number; // Employees needed
  status: 'compliant' | 'at-risk' | 'non-compliant';
}

export default function CompliancePage() {
  const [metrics, setMetrics] = useState<ComplianceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!isMounted) return;

    // TODO: Fetch from Supabase
    const loadMetrics = async () => {
      // Mock data
      const mockMetrics: ComplianceMetrics = {
        totalEmployees: 1000,
        employeesWithDisabilities: 5,
        requiredPercentage: 1, // Private sector
        currentPercentage: 0.5,
        gap: 5,
        status: 'at-risk',
      };

      setMetrics(mockMetrics);
      setLoading(false);
    };

    loadMetrics();
  }, [isMounted]);

  if (loading || !metrics) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Memuat data compliance...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = (metrics.currentPercentage / metrics.requiredPercentage) * 100;

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Pelacakan Kepatuhan Kuota</h1>
          <p className="text-muted-foreground">
            Monitor kemajuan perusahaan menuju kuota wajib UU No. 8/2016
          </p>
        </header>

        {/* Compliance Status Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 border border-border rounded-lg bg-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Status Kepatuhan</h2>
              {metrics.status === 'compliant' ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
              )}
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Saat ini: {metrics.currentPercentage}%</span>
                  <span>Diperlukan: {metrics.requiredPercentage}%</span>
                </div>
                <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    role="progressbar"
                    aria-valuenow={progressPercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">
                  Karyawan dengan disabilitas: {metrics.employeesWithDisabilities} dari{' '}
                  {metrics.totalEmployees}
                </p>
                <p className="text-lg font-semibold">
                  Kekurangan: {metrics.gap} karyawan
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-border rounded-lg bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Total Karyawan</span>
              </div>
              <p className="text-2xl font-bold">{metrics.totalEmployees}</p>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-sm text-muted-foreground">Dengan Disabilitas</span>
              </div>
              <p className="text-2xl font-bold">{metrics.employeesWithDisabilities}</p>
            </div>
          </div>
        </div>

        {/* Action Plan */}
        <div className="p-6 border border-border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">Rencana Tindakan</h2>
          <ol className="space-y-3 list-decimal list-inside">
            <li>Posting 3 lowongan pekerjaan yang aksesibel (Minggu ini)</li>
            <li>Tinjau 15 lamaran yang tertunda dari kandidat disabilitas (Minggu ini)</li>
            <li>Jadwalkan wawancara dengan 5 kandidat teratas (Minggu depan)</li>
            <li>Siapkan lingkungan testing screen reader (Bulan depan)</li>
            <li>Latih tim HR tentang perekrutan inklusif (Bulan depan)</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
