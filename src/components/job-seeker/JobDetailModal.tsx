/**
 * Full Job Description Modal
 * Expanded detail view for job listings
 */

'use client';

import { useEffect } from 'react';
import { X, MapPin, DollarSign, Clock, Briefcase, CheckCircle, ExternalLink } from 'lucide-react';
import type { JobListing } from '@/types/job';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { announce } from '@/lib/audio';
import { cn } from '@/lib/utils';

interface JobDetailModalProps {
  job: JobListing | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (jobId: string) => void;
}

export function JobDetailModal({ job, isOpen, onClose, onApply }: JobDetailModalProps) {
  const isMounted = useIsMounted();

  useEffect(() => {
    if (isOpen && job && isMounted) {
      announce(`Detail lengkap pekerjaan: ${job.title} di ${job.company}`);
    }
  }, [isOpen, job, isMounted]);

  if (!isOpen || !job) return null;

  const formatSalary = () => {
    if (!job.salary) return 'Gaji tidak disebutkan';
    const { min, max, currency, period } = job.salary;
    const minFormatted = min ? new Intl.NumberFormat('id-ID').format(min) : '';
    const maxFormatted = max ? new Intl.NumberFormat('id-ID').format(max) : '';
    const periodText = period === 'monthly' ? 'per bulan' : 'per tahun';

    if (min && max) {
      return `Rp ${minFormatted} - Rp ${maxFormatted} ${periodText}`;
    } else if (min) {
      return `Rp ${minFormatted}+ ${periodText}`;
    } else if (max) {
      return `Hingga Rp ${maxFormatted} ${periodText}`;
    }
    return 'Gaji tidak disebutkan';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-detail-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-background rounded-lg shadow-xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border">
          <div className="flex-1 pr-4">
            <h2 id="job-detail-title" className="text-2xl font-bold mb-2">
              {job.title}
            </h2>
            <p className="text-lg text-muted-foreground">{job.company}</p>
          </div>
          <button
            onClick={onClose}
            className="min-w-[48px] min-h-[48px] p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Tutup detail pekerjaan"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Lokasi</p>
                <p className="font-medium">
                  {job.location.address}, {job.location.city}
                  {job.location.district && `, ${job.location.district}`}
                </p>
                {job.location.transjakartaDistance && (
                  <p className="text-sm text-muted-foreground">
                    {job.location.transjakartaDistance} meter dari stasiun TransJakarta
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Gaji</p>
                <p className="font-medium">{formatSalary()}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Jenis Kerja</p>
                <p className="font-medium capitalize">
                  {job.workArrangement === 'on-site'
                    ? 'Di kantor'
                    : job.workArrangement === 'remote'
                    ? 'Remote'
                    : 'Hybrid'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Briefcase className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Aksesibilitas</p>
                <p className="font-medium capitalize">
                  {job.accessibility.level === 'high'
                    ? 'Tinggi'
                    : job.accessibility.level === 'medium'
                    ? 'Sedang'
                    : 'Rendah'}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Deskripsi Pekerjaan</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
          </div>

          {/* Requirements */}
          {job.requirements.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Persyaratan</h3>
              <ul className="space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {job.benefits.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Tunjangan & Benefit</h3>
              <ul className="space-y-2">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Accessibility Details */}
          {job.accessibility.details.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Detail Aksesibilitas</h3>
              <ul className="space-y-2">
                {job.accessibility.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Location Details */}
          {job.location.accessibility && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Aksesibilitas Lokasi</h3>
              <p className="text-muted-foreground">{job.location.accessibility}</p>
            </div>
          )}

          {/* Deadline */}
          {job.deadline && (
            <div>
              <p className="text-sm text-muted-foreground">
                <strong>Batas waktu pendaftaran:</strong> {formatDate(job.deadline)}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-border gap-4">
          <a
            href={job.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors min-h-[48px]"
          >
            <ExternalLink className="w-5 h-5" />
            <span>Buka di situs asli</span>
          </a>
          <button
            onClick={() => {
              onApply(job.id);
              onClose();
            }}
            className="flex-1 min-h-[48px] px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Lamar Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
}
