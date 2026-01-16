/**
 * Admin Job Extraction Page
 * Allows admins to extract job details from external sources
 * and add them to the database for blind users
 */

'use client';

import { useState, useEffect } from 'react';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { usePageAnnouncement } from '@/hooks/usePageAnnouncement';
import { AccessibleInput } from '@/components/forms/AccessibleInput';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { FocusAnnouncement } from '@/components/accessibility/FocusAnnouncement';
import { announce } from '@/lib/audio';
import { triggerHaptic } from '@/lib/haptic';
import { supabase } from '@/lib/supabase/client';
import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';
import { 
  FileText, 
  Link as LinkIcon, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  ExternalLink,
  Send
} from 'lucide-react';
import type { JobListing } from '@/types/job';

interface ExtractedJobData {
  title: string;
  company: string;
  location: {
    address: string;
    city: string;
    district?: string;
  };
  salary?: {
    min?: number;
    max?: number;
    currency: string;
    period: 'monthly' | 'yearly';
  };
  description: string;
  requirements: string[];
  benefits: string[];
  workArrangement: 'remote' | 'hybrid' | 'on-site';
  accessibility: {
    level: 'high' | 'medium' | 'low';
    details: string[];
  };
  applicationUrl: string;
  deadline?: Date;
}

export default function JobExtractionPage() {
  usePageAnnouncement('Ekstraksi Pekerjaan', 'Halaman admin untuk mengekstrak dan menambahkan detail pekerjaan');

  const isMounted = useIsMounted();
  const [jobUrl, setJobUrl] = useState('');
  const [extractedData, setExtractedData] = useState<ExtractedJobData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [manualMode, setManualMode] = useState(false);

  // Manual form fields
  const [formData, setFormData] = useState<ExtractedJobData>({
    title: '',
    company: '',
    location: { address: '', city: '' },
    description: '',
    requirements: [],
    benefits: [],
    workArrangement: 'hybrid',
    accessibility: { level: 'medium', details: [] },
    applicationUrl: '',
    salary: { currency: 'IDR', period: 'monthly' },
  });

  const extractButtonProps = useFocusAnnouncement({
    description: 'Ekstrak detail pekerjaan dari URL yang diberikan. Sistem akan membaca halaman dan mengekstrak informasi penting.',
    label: 'Tombol Ekstrak',
    context: 'Tekan Enter untuk mengekstrak pekerjaan',
    announceOnFocus: true,
    announceOnLongPress: true,
  });

  const saveButtonProps = useFocusAnnouncement({
    description: 'Simpan pekerjaan yang telah diekstrak ke database. Pekerjaan ini akan tersedia untuk semua pengguna.',
    label: 'Tombol Simpan',
    context: 'Tekan Enter untuk menyimpan pekerjaan',
    announceOnFocus: true,
    announceOnLongPress: true,
  });

  const handleExtract = async () => {
    if (!jobUrl.trim()) {
      setError('URL pekerjaan harus diisi');
      if (isMounted) {
        triggerHaptic('error');
        announce('URL pekerjaan harus diisi');
      }
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    if (isMounted) {
      triggerHaptic('loading');
      announce('Memproses ekstraksi pekerjaan...');
    }

    try {
      // TODO: Call backend API to extract job details
      // For now, we'll use a mock extraction
      // In production, this would call an API endpoint that:
      // 1. Fetches the job page
      // 2. Uses AI/LLM to extract structured data
      // 3. Returns formatted job data

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock extracted data
      const mockExtracted: ExtractedJobData = {
        title: 'Software Developer',
        company: 'PT Teknologi Maju',
        location: {
          address: 'Jl. Sudirman No. 123',
          city: 'Jakarta Pusat',
          district: 'Sudirman',
        },
        salary: {
          min: 10000000,
          max: 15000000,
          currency: 'IDR',
          period: 'monthly',
        },
        description: 'Kami mencari Software Developer berpengalaman untuk mengembangkan aplikasi web dan mobile.',
        requirements: [
          'Minimal 3 tahun pengalaman',
          'Menguasai JavaScript, React, Node.js',
          'Memahami Git dan Agile methodology',
        ],
        benefits: ['BPJS Kesehatan', 'Tunjangan transport', 'Remote work option'],
        workArrangement: 'hybrid',
        accessibility: {
          level: 'high',
          details: ['Screen reader support', 'Flexible hours', 'Remote option'],
        },
        applicationUrl: jobUrl,
      };

      setExtractedData(mockExtracted);
      setFormData(mockExtracted);

      if (isMounted) {
        triggerHaptic('apply-success');
        announce('Ekstraksi berhasil. Silakan periksa dan edit data jika diperlukan.');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal mengekstrak pekerjaan');
      if (isMounted) {
        triggerHaptic('error');
        announce(`Kesalahan: ${err.message || 'Gagal mengekstrak pekerjaan'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (isMounted) {
      triggerHaptic('loading');
      announce('Menyimpan pekerjaan...');
    }

    try {
      const dataToSave = manualMode ? formData : extractedData;
      if (!dataToSave) {
        throw new Error('Tidak ada data untuk disimpan');
      }

      // Generate AI summary
      const summary = `Posisi: ${dataToSave.title} di ${dataToSave.company}. ${
        dataToSave.salary
          ? `Gaji: ${dataToSave.salary.min ? `${dataToSave.salary.min.toLocaleString('id-ID')}` : ''} ${
              dataToSave.salary.max ? `hingga ${dataToSave.salary.max.toLocaleString('id-ID')}` : ''
            } Rupiah per ${dataToSave.salary.period === 'monthly' ? 'bulan' : 'tahun'}.`
          : ''
      } Lokasi: ${dataToSave.location.address}, ${dataToSave.location.city}. Aksesibilitas: ${
        dataToSave.accessibility.level === 'high'
          ? 'Tinggi'
          : dataToSave.accessibility.level === 'medium'
          ? 'Sedang'
          : 'Rendah'
      } - ${dataToSave.accessibility.details.join(', ')}.`;

      const { error: insertError } = await supabase.from('job_listings').insert({
        title: dataToSave.title,
        company: dataToSave.company,
        location_address: dataToSave.location.address,
        location_city: dataToSave.location.city,
        location_district: dataToSave.location.district,
        salary_min: dataToSave.salary?.min,
        salary_max: dataToSave.salary?.max,
        salary_currency: dataToSave.salary?.currency || 'IDR',
        salary_period: dataToSave.salary?.period || 'monthly',
        description: dataToSave.description,
        summary,
        requirements: dataToSave.requirements,
        benefits: dataToSave.benefits,
        work_arrangement: dataToSave.workArrangement,
        accessibility_level: dataToSave.accessibility.level,
        accessibility_details: dataToSave.accessibility.details,
        application_url: dataToSave.applicationUrl,
        deadline: dataToSave.deadline,
        source: 'admin',
        source_id: `admin-${Date.now()}`,
        is_active: true,
      });

      if (insertError) {
        throw insertError;
      }

      setSuccess(true);
      setExtractedData(null);
      setFormData({
        title: '',
        company: '',
        location: { address: '', city: '' },
        description: '',
        requirements: [],
        benefits: [],
        workArrangement: 'hybrid',
        accessibility: { level: 'medium', details: [] },
        applicationUrl: '',
        salary: { currency: 'IDR', period: 'monthly' },
      });
      setJobUrl('');

      if (isMounted) {
        triggerHaptic('apply-success');
        announce('Pekerjaan berhasil disimpan ke database');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan pekerjaan');
      if (isMounted) {
        triggerHaptic('error');
        announce(`Kesalahan: ${err.message || 'Gagal menyimpan pekerjaan'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <FocusAnnouncement
          description="Halaman Ekstraksi Pekerjaan Admin. Di halaman ini, admin dapat mengekstrak detail pekerjaan dari URL eksternal atau memasukkan secara manual, kemudian menyimpannya ke database untuk membantu pengguna tunanetra."
          label="Halaman Ekstraksi Pekerjaan"
        >
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" aria-hidden="true" />
            Ekstraksi Pekerjaan
          </h1>
        </FocusAnnouncement>
        <p className="text-muted-foreground">
          Ekstrak dan tambahkan detail pekerjaan dari sumber eksternal untuk membantu pengguna tunanetra
        </p>
      </header>

      {error && (
        <div
          className="p-4 bg-destructive/10 border border-destructive rounded-lg mb-6"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-destructive" aria-hidden="true" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div
          className="p-4 bg-green-500/10 border border-green-500 rounded-lg mb-6"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" aria-hidden="true" />
            <p className="text-sm text-green-500">Pekerjaan berhasil disimpan!</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* URL Extraction */}
        <div className="border border-border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">Ekstrak dari URL</h2>
          <div className="space-y-4">
            <AccessibleInput
              label="URL Pekerjaan"
              description="Masukkan URL halaman pekerjaan yang ingin diekstrak"
              placeholder="https://example.com/job/123"
              type="url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              id="jobUrl"
            />
            <button
              onClick={handleExtract}
              disabled={loading || !jobUrl.trim()}
              className="w-full min-h-[48px] px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              {...extractButtonProps}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Ekstrak Pekerjaan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Manual Entry Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setManualMode(!manualMode)}
            className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            {manualMode ? 'Mode Otomatis' : 'Mode Manual'}
          </button>
        </div>

        {/* Extracted/Manual Form */}
        {(extractedData || manualMode) && (
          <div className="border border-border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">
              {manualMode ? 'Masukkan Detail Pekerjaan' : 'Data yang Diekstrak'}
            </h2>
            <div className="space-y-4">
              <AccessibleInput
                label="Judul Pekerjaan"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                id="title"
              />
              <AccessibleInput
                label="Nama Perusahaan"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                id="company"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AccessibleInput
                  label="Alamat"
                  required
                  value={formData.location.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, address: e.target.value },
                    })
                  }
                  id="address"
                />
                <AccessibleInput
                  label="Kota"
                  required
                  value={formData.location.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, city: e.target.value },
                    })
                  }
                  id="city"
                />
              </div>
              <AccessibleInput
                label="URL Lamaran"
                type="url"
                required
                value={formData.applicationUrl}
                onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
                id="applicationUrl"
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">Deskripsi Pekerjaan</label>
                <textarea
                  className="w-full min-h-[120px] px-3 py-2 border border-border rounded-lg bg-background"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Masukkan deskripsi lengkap pekerjaan..."
                />
              </div>
              <button
                onClick={handleSave}
                disabled={loading || !formData.title || !formData.company}
                className="w-full min-h-[48px] px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                {...saveButtonProps}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Simpan ke Database</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
