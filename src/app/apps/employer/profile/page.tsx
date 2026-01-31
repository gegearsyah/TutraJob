/**
 * Company Profile Page
 * Detailed company profile management
 */

'use client';

import { useState, useEffect } from 'react';
import { usePageAnnouncement } from '@/hooks/usePageAnnouncement';
import { AccessibleInput } from '@/components/forms/AccessibleInput';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { TutorialOverlay } from '@/components/tutorial/TutorialOverlay';
import { TutorialButton } from '@/components/tutorial/TutorialButton';
import { useTutorial } from '@/hooks/useTutorial';
import { announce, playAudioCue } from '@/lib/audio';
import { triggerHaptic } from '@/lib/haptic';
import { Building2, MapPin, Phone, Mail, Globe, Users, FileText, Save, Award } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

const companyProfileTutorialSteps = [
  {
    id: 'profile-welcome',
    title: 'Tutorial: Profil Perusahaan',
    description: 'Selamat datang di tutorial profil perusahaan. Di sini Anda akan belajar cara melengkapi dan mengelola profil perusahaan Anda.',
    audioDescription: 'Selamat datang di tutorial profil perusahaan. Di sini Anda akan belajar cara melengkapi dan mengelola profil perusahaan Anda.',
    position: 'center' as const,
  },
  {
    id: 'profile-info',
    title: 'Informasi Perusahaan',
    description: 'Lengkapi informasi dasar perusahaan: Nama perusahaan, Alamat, Nomor telepon, Email, Website, dan Deskripsi perusahaan. Informasi yang lengkap membantu kandidat memahami perusahaan Anda.',
    audioDescription: 'Lengkapi informasi dasar perusahaan: Nama perusahaan, Alamat, Nomor telepon, Email, Website, dan Deskripsi perusahaan. Informasi yang lengkap membantu kandidat memahami perusahaan Anda.',
    position: 'center' as const,
  },
  {
    id: 'profile-compliance',
    title: 'Informasi Kepatuhan',
    description: 'Bagian penting: Informasi kepatuhan. Tunjukkan bahwa perusahaan Anda mematuhi UU No. 8/2016, termasuk kuota 2% untuk Penyandang Disabilitas, akomodasi yang disediakan, dan komitmen inklusivitas.',
    audioDescription: 'Bagian penting: Informasi kepatuhan. Tunjukkan bahwa perusahaan Anda mematuhi UU No. 8/2016, termasuk kuota 2% untuk Penyandang Disabilitas, akomodasi yang disediakan, dan komitmen inklusivitas.',
    position: 'center' as const,
  },
];

export default function CompanyProfilePage() {
  usePageAnnouncement('Profil Perusahaan', 'Kelola profil perusahaan Anda');

  const { isOpen, hasCompleted, startTutorial, closeTutorial, completeTutorial } = useTutorial('employer-profile');

  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    city: '',
    province: '',
    phone: '',
    email: '',
    website: '',
    description: '',
    complianceInfo: '',
    accommodations: '',
    pwdQuota: '',
    pwdCurrent: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load existing profile
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // TODO: Load company profile from database
          // For now, just set loading to false
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      triggerHaptic('loading');
      // TODO: Save to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      triggerHaptic('apply-success');
      playAudioCue('apply-success');
      announce('Profil perusahaan berhasil disimpan');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan profil');
      triggerHaptic('error');
      playAudioCue('error');
      announce(`Kesalahan: ${err.message || 'Gagal menyimpan profil'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Memuat profil...</p>
        </div>
      </div>
    );
  }

  const compliancePercentage = formData.pwdQuota && formData.pwdCurrent
    ? Math.round((parseInt(formData.pwdCurrent) / parseInt(formData.pwdQuota)) * 100)
    : 0;

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Profil Perusahaan</h1>
            <p className="text-muted-foreground">
              Kelola informasi dan kepatuhan perusahaan Anda
            </p>
          </div>
          <TutorialButton
            onStart={startTutorial}
            tutorialId="employer-profile"
            label="Tutorial"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div
              className="p-4 bg-destructive/10 border border-destructive rounded-lg"
              role="alert"
              aria-live="assertive"
            >
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4 p-6 border border-border rounded-lg bg-card">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Informasi Dasar
            </h2>

            <AccessibleInput
              label="Nama Perusahaan"
              description="Masukkan nama lengkap perusahaan"
              required
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="PT Contoh Indonesia"
              id="companyName"
            />

            <AccessibleInput
              label="Alamat"
              description="Masukkan alamat lengkap perusahaan"
              required
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Jl. Contoh No. 123"
              id="address"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AccessibleInput
                label="Kota"
                description="Masukkan kota"
                required
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Jakarta"
                id="city"
              />

              <AccessibleInput
                label="Provinsi"
                description="Masukkan provinsi"
                required
                type="text"
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                placeholder="DKI Jakarta"
                id="province"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AccessibleInput
                label="Nomor Telepon"
                description="Masukkan nomor telepon perusahaan"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="021-12345678"
                id="phone"
              />

              <AccessibleInput
                label="Email"
                description="Masukkan email perusahaan"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="info@perusahaan.com"
                id="email"
              />
            </div>

            <AccessibleInput
              label="Website"
              description="Masukkan website perusahaan (opsional)"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://www.perusahaan.com"
              id="website"
            />

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Deskripsi Perusahaan
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                className="w-full min-h-[120px] px-4 py-2 border border-border rounded-lg bg-background"
                placeholder="Jelaskan tentang perusahaan Anda, visi, misi, dan budaya kerja..."
              />
            </div>
          </div>

          {/* Compliance Information */}
          <div className="space-y-4 p-6 border border-border rounded-lg bg-card">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Award className="w-5 h-5" />
              Informasi Kepatuhan
            </h2>

            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm text-foreground mb-2">
                <strong>UU No. 8/2016 tentang Penyandang Disabilitas</strong> mewajibkan perusahaan dengan minimal 100 karyawan untuk mempekerjakan minimal 2% Penyandang Disabilitas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AccessibleInput
                label="Kuota Wajib PwD (2%)"
                description="Jumlah karyawan Penyandang Disabilitas yang wajib dipekerjakan"
                type="number"
                value={formData.pwdQuota}
                onChange={(e) => setFormData({ ...formData, pwdQuota: e.target.value })}
                placeholder="2"
                id="pwdQuota"
              />

              <AccessibleInput
                label="PwD Saat Ini"
                description="Jumlah karyawan Penyandang Disabilitas yang saat ini bekerja"
                type="number"
                value={formData.pwdCurrent}
                onChange={(e) => setFormData({ ...formData, pwdCurrent: e.target.value })}
                placeholder="1"
                id="pwdCurrent"
              />
            </div>

            {formData.pwdQuota && formData.pwdCurrent && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Progress Kepatuhan</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-4 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${Math.min(compliancePercentage, 100)}%` }}
                      role="progressbar"
                      aria-valuenow={compliancePercentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <span className="text-sm font-medium">{compliancePercentage}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {compliancePercentage >= 100
                    ? 'Perusahaan Anda telah memenuhi kuota wajib'
                    : `Masih perlu ${Math.max(0, parseInt(formData.pwdQuota) - parseInt(formData.pwdCurrent))} karyawan PwD untuk memenuhi kuota`}
                </p>
              </div>
            )}

            <div>
              <label htmlFor="accommodations" className="block text-sm font-medium mb-2">
                Akomodasi yang Disediakan
              </label>
              <textarea
                id="accommodations"
                value={formData.accommodations}
                onChange={(e) => setFormData({ ...formData, accommodations: e.target.value })}
                rows={4}
                className="w-full min-h-[100px] px-4 py-2 border border-border rounded-lg bg-background"
                placeholder="Jelaskan akomodasi yang disediakan: akses kursi roda, screen reader, keyboard khusus, dll..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Informasi ini membantu kandidat memahami dukungan yang tersedia.
              </p>
            </div>

            <div>
              <label htmlFor="complianceInfo" className="block text-sm font-medium mb-2">
                Komitmen Inklusivitas
              </label>
              <textarea
                id="complianceInfo"
                value={formData.complianceInfo}
                onChange={(e) => setFormData({ ...formData, complianceInfo: e.target.value })}
                rows={4}
                className="w-full min-h-[100px] px-4 py-2 border border-border rounded-lg bg-background"
                placeholder="Jelaskan komitmen perusahaan terhadap inklusivitas dan kesetaraan..."
              />
            </div>
          </div>

          <AccessibleButton
            type="submit"
            disabled={saving}
            announcementText="Menyimpan profil perusahaan"
            className="w-full min-h-[48px]"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Menyimpan...' : 'Simpan Profil'}
          </AccessibleButton>
        </form>
      </div>

      <TutorialOverlay
        steps={companyProfileTutorialSteps}
        isOpen={isOpen}
        onClose={closeTutorial}
        onComplete={completeTutorial}
        tutorialId="employer-profile"
        title="Tutorial Profil Perusahaan"
      />
    </div>
  );
}
