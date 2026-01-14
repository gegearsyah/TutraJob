/**
 * Job Comparison Tool Component
 * Compare multiple jobs side-by-side (audio-friendly)
 * Based on FEATURE_CHECKLIST.md
 */

'use client';

import { useState } from 'react';
import { X, CheckCircle2, MapPin, DollarSign, Clock, Building2 } from 'lucide-react';
import { FocusAnnouncement } from '@/components/accessibility/FocusAnnouncement';
import { AnnounceableText } from '@/components/accessibility/AnnounceableText';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';
import { announce } from '@/lib/audio';
import { triggerHaptic } from '@/lib/haptic';
import type { JobListing } from '@/types/job';
import { cn } from '@/lib/utils';

interface JobComparisonProps {
  jobs: JobListing[];
  onClose: () => void;
  onRemoveJob: (jobId: string) => void;
}

export function JobComparison({ jobs, onClose, onRemoveJob }: JobComparisonProps) {
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set(jobs.map(j => j.id)));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleRemove = (jobId: string) => {
    setSelectedJobs(prev => {
      const newSet = new Set(prev);
      newSet.delete(jobId);
      return newSet;
    });
    onRemoveJob(jobId);
    triggerHaptic('dismiss');
    announce('Pekerjaan dihapus dari perbandingan');
  };

  const comparisonJobs = jobs.filter(j => selectedJobs.has(j.id));

  if (comparisonJobs.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
        <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">Perbandingan Pekerjaan</h2>
          <p className="text-muted-foreground mb-4">
            Tidak ada pekerjaan untuk dibandingkan
          </p>
          <AccessibleButton
            onClick={onClose}
            variant="primary"
            announcementText="Menutup perbandingan pekerjaan"
            className="w-full"
          >
            Tutup
          </AccessibleButton>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
      <div className="bg-card border border-border rounded-lg p-4 sm:p-6 max-w-7xl w-full my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <FocusAnnouncement
            description={`Perbandingan ${comparisonJobs.length} pekerjaan. Bandingkan gaji, lokasi, aksesibilitas, dan fitur lainnya.`}
            label="Judul Perbandingan"
          >
            <h2 className="text-xl sm:text-2xl font-bold">Perbandingan Pekerjaan</h2>
          </FocusAnnouncement>
          <AccessibleButton
            onClick={onClose}
            variant="ghost"
            announcementText="Menutup perbandingan pekerjaan"
            className="min-w-[48px] min-h-[48px]"
          >
            <X className="w-5 h-5" />
          </AccessibleButton>
        </div>

        {/* Comparison Table - Mobile optimized */}
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-3 text-left font-semibold sticky left-0 bg-card z-10 min-w-[200px]">
                    Kriteria
                  </th>
                  {comparisonJobs.map((job) => (
                    <th
                      key={job.id}
                      className="p-3 text-left font-semibold min-w-[250px] sm:min-w-[300px]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <AnnounceableText
                            description={`Pekerjaan ${job.title} di ${job.company}`}
                            label="Judul Pekerjaan"
                            as="div"
                            className="font-semibold text-sm sm:text-base"
                          >
                            {job.title}
                          </AnnounceableText>
                          <AnnounceableText
                            description={`Perusahaan ${job.company}`}
                            label="Nama Perusahaan"
                            as="div"
                            className="text-xs sm:text-sm text-muted-foreground"
                          >
                            {job.company}
                          </AnnounceableText>
                        </div>
                        <button
                          onClick={() => handleRemove(job.id)}
                          className="min-w-[32px] min-h-[32px] p-1 hover:bg-muted rounded transition-colors flex-shrink-0"
                          aria-label={`Hapus ${job.title} dari perbandingan`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Salary */}
                <tr className="border-b border-border">
                  <td className="p-3 font-medium sticky left-0 bg-card z-10">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" aria-hidden="true" />
                      <span>Gaji</span>
                    </div>
                  </td>
                  {comparisonJobs.map((job) => (
                    <td key={job.id} className="p-3">
                      {job.salary ? (
                        <AnnounceableText
                          description={`Gaji ${job.salary.min ? formatCurrency(job.salary.min) : 'Tidak disebutkan'} hingga ${job.salary.max ? formatCurrency(job.salary.max) : 'Tidak disebutkan'} per ${job.salary.period === 'monthly' ? 'bulan' : 'tahun'}`}
                          label="Gaji"
                        >
                          {job.salary.min && job.salary.max
                            ? `${formatCurrency(job.salary.min)} - ${formatCurrency(job.salary.max)}/${job.salary.period === 'monthly' ? 'bln' : 'thn'}`
                            : job.salary.min
                            ? `Mulai ${formatCurrency(job.salary.min)}/${job.salary.period === 'monthly' ? 'bln' : 'thn'}`
                            : 'Tidak disebutkan'}
                        </AnnounceableText>
                      ) : (
                        <span className="text-muted-foreground">Tidak disebutkan</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Location */}
                <tr className="border-b border-border">
                  <td className="p-3 font-medium sticky left-0 bg-card z-10">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" aria-hidden="true" />
                      <span>Lokasi</span>
                    </div>
                  </td>
                  {comparisonJobs.map((job) => (
                    <td key={job.id} className="p-3">
                      <AnnounceableText
                        description={`Lokasi ${job.location.address}, ${job.location.city}${job.location.district ? `, ${job.location.district}` : ''}${job.location.transjakartaDistance ? `. Jarak ${job.location.transjakartaDistance} meter dari stasiun TransJakarta` : ''}`}
                        label="Lokasi"
                      >
                        <div className="text-sm">
                          <div>{job.location.city}</div>
                          {job.location.district && (
                            <div className="text-xs text-muted-foreground">{job.location.district}</div>
                          )}
                          {job.location.transjakartaDistance && (
                            <div className="text-xs text-muted-foreground">
                              {job.location.transjakartaDistance}m dari TransJakarta
                            </div>
                          )}
                        </div>
                      </AnnounceableText>
                    </td>
                  ))}
                </tr>

                {/* Work Arrangement */}
                <tr className="border-b border-border">
                  <td className="p-3 font-medium sticky left-0 bg-card z-10">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" aria-hidden="true" />
                      <span>Pengaturan Kerja</span>
                    </div>
                  </td>
                  {comparisonJobs.map((job) => (
                    <td key={job.id} className="p-3">
                      <AnnounceableText
                        description={`Pengaturan kerja: ${job.workArrangement === 'remote' ? 'Remote (kerja dari rumah)' : job.workArrangement === 'hybrid' ? 'Hybrid (kombinasi remote dan on-site)' : 'On-site (kerja di kantor)'}`}
                        label="Pengaturan Kerja"
                      >
                        {job.workArrangement === 'remote' ? 'Remote' :
                         job.workArrangement === 'hybrid' ? 'Hybrid' :
                         'On-site'}
                      </AnnounceableText>
                    </td>
                  ))}
                </tr>

                {/* Accessibility Level */}
                <tr className="border-b border-border">
                  <td className="p-3 font-medium sticky left-0 bg-card z-10">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                      <span>Aksesibilitas</span>
                    </div>
                  </td>
                  {comparisonJobs.map((job) => (
                    <td key={job.id} className="p-3">
                      <div className={cn(
                        'px-3 py-1 rounded-full text-xs font-medium inline-block',
                        job.accessibility.level === 'high' ? 'bg-green-500/10 text-green-500' :
                        job.accessibility.level === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-red-500/10 text-red-500'
                      )}>
                        <AnnounceableText
                          description={`Tingkat aksesibilitas: ${job.accessibility.level === 'high' ? 'Tinggi' : job.accessibility.level === 'medium' ? 'Sedang' : 'Rendah'}. ${job.accessibility.details.join(', ')}`}
                          label="Tingkat Aksesibilitas"
                        >
                          {job.accessibility.level === 'high' ? 'Tinggi' :
                           job.accessibility.level === 'medium' ? 'Sedang' :
                           'Rendah'}
                        </AnnounceableText>
                      </div>
                      {job.accessibility.details.length > 0 && (
                        <ul className="mt-2 text-xs text-muted-foreground list-disc list-inside">
                          {job.accessibility.details.slice(0, 3).map((detail, idx) => (
                            <li key={idx}>{detail}</li>
                          ))}
                        </ul>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Requirements */}
                <tr className="border-b border-border">
                  <td className="p-3 font-medium sticky left-0 bg-card z-10">
                    <span>Persyaratan</span>
                  </td>
                  {comparisonJobs.map((job) => (
                    <td key={job.id} className="p-3">
                      <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                        {job.requirements.slice(0, 3).map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                        {job.requirements.length > 3 && (
                          <li className="text-muted-foreground italic">
                            +{job.requirements.length - 3} persyaratan lainnya
                          </li>
                        )}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Benefits */}
                <tr>
                  <td className="p-3 font-medium sticky left-0 bg-card z-10">
                    <span>Benefit</span>
                  </td>
                  {comparisonJobs.map((job) => (
                    <td key={job.id} className="p-3">
                      <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                        {job.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" aria-hidden="true" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile-friendly summary */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg sm:hidden">
          <h3 className="font-semibold mb-2 text-sm">Ringkasan Perbandingan</h3>
          <p className="text-xs text-muted-foreground">
            Geser ke kiri atau kanan pada tabel di atas untuk melihat semua detail perbandingan.
          </p>
        </div>
      </div>
    </div>
  );
}
