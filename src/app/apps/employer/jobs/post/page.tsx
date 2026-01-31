/**
 * Job Posting Page
 * Create and post new job vacancies
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePageAnnouncement } from '@/hooks/usePageAnnouncement';
import { AccessibleInput } from '@/components/forms/AccessibleInput';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { TutorialOverlay } from '@/components/tutorial/TutorialOverlay';
import { TutorialButton } from '@/components/tutorial/TutorialButton';
import { useTutorial } from '@/hooks/useTutorial';
import { announce, playAudioCue } from '@/lib/audio';
import { triggerHaptic } from '@/lib/haptic';
import { Briefcase, MapPin, DollarSign, Clock, Users, FileText, Save, X } from 'lucide-react';

const jobPostingTutorialSteps = [
  {
    id: 'post-welcome',
    title: 'Tutorial: Posting Lowongan',
    description: 'Selamat datang di tutorial posting lowongan. Di sini Anda akan belajar cara membuat dan memposting lowongan pekerjaan yang aksesibel.',
    audioDescription: 'Selamat datang di tutorial posting lowongan. Di sini Anda akan belajar cara membuat dan memposting lowongan pekerjaan yang aksesibel.',
    position: 'center' as const,
  },
  {
    id: 'post-form',
    title: 'Formulir Lowongan',
    description: 'Formulir posting lowongan terdiri dari beberapa bagian: Judul pekerjaan, Deskripsi, Persyaratan, Lokasi, Gaji, dan Informasi aksesibilitas. Isi semua bagian dengan informasi yang jelas dan akurat.',
    audioDescription: 'Formulir posting lowongan terdiri dari beberapa bagian: Judul pekerjaan, Deskripsi, Persyaratan, Lokasi, Gaji, dan Informasi aksesibilitas. Isi semua bagian dengan informasi yang jelas dan akurat.',
    position: 'center' as const,
  },
  {
    id: 'post-accessibility',
    title: 'Informasi Aksesibilitas',
    description: 'Bagian penting: Informasi aksesibilitas lokasi. Jelaskan fasilitas aksesibilitas yang tersedia di lokasi kerja, seperti akses kursi roda, toilet aksesibel, dll. Ini membantu kandidat memahami apakah lokasi sesuai dengan kebutuhan mereka.',
    audioDescription: 'Bagian penting: Informasi aksesibilitas lokasi. Jelaskan fasilitas aksesibilitas yang tersedia di lokasi kerja, seperti akses kursi roda, toilet aksesibel, dll. Ini membantu kandidat memahami apakah lokasi sesuai dengan kebutuhan mereka.',
    position: 'center' as const,
  },
];

export default function JobPostingPage() {
  usePageAnnouncement('Posting Lowongan', 'Buat dan posting lowongan pekerjaan baru');

  const router = useRouter();
  const { isOpen, hasCompleted, startTutorial, closeTutorial, completeTutorial } = useTutorial('employer-job-posting');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    workType: 'on-site',
    accessibilityInfo: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      triggerHaptic('loading');
      // TODO: Save to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      triggerHaptic('apply-success');
      playAudioCue('apply-success');
      announce('Lowongan berhasil diposting');
      router.push('/apps/employer/jobs');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memposting lowongan');
      triggerHaptic('error');
      playAudioCue('error');
      announce(`Kesalahan: ${err.message || 'Gagal memposting lowongan'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Posting Lowongan Baru</h1>
            <p className="text-muted-foreground">
              Buat lowongan pekerjaan yang aksesibel dan inklusif
            </p>
          </div>
          <TutorialButton
            onStart={startTutorial}
            tutorialId="employer-job-posting"
            label="Tutorial"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div
              className="p-4 bg-destructive/10 border border-destructive rounded-lg"
              role="alert"
              aria-live="assertive"
            >
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <AccessibleInput
            label="Judul Pekerjaan"
            description="Masukkan judul pekerjaan yang jelas dan deskriptif"
            required
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Contoh: Software Developer"
            id="title"
          />

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Deskripsi Pekerjaan
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              className="w-full min-h-[120px] px-4 py-2 border border-border rounded-lg bg-background"
              placeholder="Jelaskan detail pekerjaan, tanggung jawab, dan tugas utama..."
              required
            />
          </div>

          <div>
            <label htmlFor="requirements" className="block text-sm font-medium mb-2">
              Persyaratan
            </label>
            <textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              rows={4}
              className="w-full min-h-[100px] px-4 py-2 border border-border rounded-lg bg-background"
              placeholder="Sebutkan kualifikasi, skills, dan pengalaman yang dibutuhkan..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AccessibleInput
              label="Lokasi"
              description="Masukkan lokasi kerja"
              required
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Jakarta Selatan"
              id="location"
            />

            <div>
              <label htmlFor="workType" className="block text-sm font-medium mb-2">
                Jenis Kerja
              </label>
              <select
                id="workType"
                value={formData.workType}
                onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                className="w-full min-h-[48px] px-4 py-2 border border-border rounded-lg bg-background"
                required
              >
                <option value="on-site">On-site</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AccessibleInput
              label="Gaji Minimum"
              description="Masukkan gaji minimum (dalam juta rupiah)"
              type="number"
              value={formData.salaryMin}
              onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
              placeholder="5"
              id="salaryMin"
            />

            <AccessibleInput
              label="Gaji Maksimum"
              description="Masukkan gaji maksimum (dalam juta rupiah)"
              type="number"
              value={formData.salaryMax}
              onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
              placeholder="10"
              id="salaryMax"
            />
          </div>

          <div>
            <label htmlFor="accessibilityInfo" className="block text-sm font-medium mb-2">
              Informasi Aksesibilitas Lokasi
            </label>
            <textarea
              id="accessibilityInfo"
              value={formData.accessibilityInfo}
              onChange={(e) => setFormData({ ...formData, accessibilityInfo: e.target.value })}
              rows={4}
              className="w-full min-h-[100px] px-4 py-2 border border-border rounded-lg bg-background"
              placeholder="Jelaskan fasilitas aksesibilitas yang tersedia: akses kursi roda, toilet aksesibel, lift, dll..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Informasi ini membantu kandidat memahami apakah lokasi sesuai dengan kebutuhan mereka.
            </p>
          </div>

          <div className="flex gap-4">
            <AccessibleButton
              type="submit"
              disabled={loading}
              announcementText="Memposting lowongan pekerjaan"
              className="flex-1 min-h-[48px]"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Memproses...' : 'Posting Lowongan'}
            </AccessibleButton>

            <AccessibleButton
              type="button"
              variant="outline"
              onClick={() => router.back()}
              announcementText="Membatalkan dan kembali"
              className="min-h-[48px]"
            >
              <X className="w-5 h-5" />
              Batal
            </AccessibleButton>
          </div>
        </form>
      </div>

      <TutorialOverlay
        steps={jobPostingTutorialSteps}
        isOpen={isOpen}
        onClose={closeTutorial}
        onComplete={completeTutorial}
        tutorialId="employer-job-posting"
        title="Tutorial Posting Lowongan"
      />
    </div>
  );
}
