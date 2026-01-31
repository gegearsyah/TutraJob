'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { getUserRole } from '@/lib/auth/roles';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { usePageAnnouncement } from '@/hooks/usePageAnnouncement';
import { announce } from '@/lib/audio';
import { triggerHaptic } from '@/lib/haptic';
import { supabase } from '@/lib/supabase/client';
import { LandingAbout } from '@/types/landing';
import { ArrowLeft, Save, Trash2, Plus } from 'lucide-react';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { AccessibleInput } from '@/components/forms/AccessibleInput';
import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export default function AdminAboutPage() {
  usePageAnnouncement('Kelola Tentang Kami', 'Halaman untuk mengelola konten tentang kami');
  
  const backButtonProps = useFocusAnnouncement({
    description: 'Kembali ke manajemen landing page',
    label: 'Tombol Kembali',
    announceOnFocus: true,
  });

  const isMounted = useIsMounted();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [about, setAbout] = useState<LandingAbout | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    why_different_title: '',
    why_different_items: [] as Array<{ title: string; description: string }>,
    image_url: '',
    order_index: 0,
    is_active: true,
  });

  const { isAuthenticated, loading: authLoading } = useAuthGuard({
    requireAuth: true,
    redirectTo: '/apps/admin/auth/login',
  });

  useEffect(() => {
    if (!isMounted || authLoading) return;

    const checkAdmin = async () => {
      try {
        const role = await getUserRole();
        if (role !== 'admin') {
          announce('Akses ditolak. Hanya administrator yang dapat mengakses halaman ini.');
          router.push('/apps/admin/auth/login');
          return;
        }
        setUserRole(role);
        await loadAbout();
      } catch (error) {
        console.error('Error checking admin role:', error);
        router.push('/apps/admin/auth/login');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      checkAdmin();
    }
  }, [isMounted, isAuthenticated, authLoading, router]);

  const loadAbout = async () => {
    try {
      const { data, error } = await supabase
        .from('landing_about')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setAbout(data);
        setFormData({
          title: data.title || '',
          subtitle: data.subtitle || '',
          description: data.description || '',
          why_different_title: data.why_different_title || '',
          why_different_items: data.why_different_items || [],
          image_url: data.image_url || '',
          order_index: data.order_index || 0,
          is_active: data.is_active ?? true,
        });
      }
    } catch (error) {
      console.error('Error loading about:', error);
      announce('Gagal memuat data tentang kami');
    }
  };

  const handleSave = async () => {
    if (!isMounted) return;

    setSaving(true);
    triggerHaptic('loading');
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const payload = {
        ...formData,
        updated_by: user.id,
      };

      if (about) {
        // Update existing
        const { error } = await supabase
          .from('landing_about')
          .update(payload)
          .eq('id', about.id);

        if (error) throw error;
        announce('Data tentang kami berhasil diperbarui');
      } else {
        // Create new
        const { error } = await supabase
          .from('landing_about')
          .insert({
            ...payload,
            created_by: user.id,
          });

        if (error) throw error;
        announce('Data tentang kami berhasil dibuat');
      }

      triggerHaptic('apply-success');
      await loadAbout();
    } catch (error: any) {
      console.error('Error saving about:', error);
      announce(`Gagal menyimpan: ${error.message}`);
      triggerHaptic('error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isMounted || !about) return;

    triggerHaptic('dismiss');
    
    try {
      const { error } = await supabase
        .from('landing_about')
        .update({ is_active: false })
        .eq('id', about.id);

      if (error) throw error;

      announce('Data tentang kami berhasil dihapus');
      triggerHaptic('apply-success');
      router.push('/apps/admin/landing');
    } catch (error: any) {
      console.error('Error deleting about:', error);
      announce(`Gagal menghapus: ${error.message}`);
      triggerHaptic('error');
    }
  };

  const addWhyDifferentItem = () => {
    setFormData({
      ...formData,
      why_different_items: [...formData.why_different_items, { title: '', description: '' }],
    });
  };

  const updateWhyDifferentItem = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...formData.why_different_items];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, why_different_items: updated });
  };

  const removeWhyDifferentItem = (index: number) => {
    setFormData({
      ...formData,
      why_different_items: formData.why_different_items.filter((_, i) => i !== index),
    });
  };

  if (loading || authLoading) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || userRole !== 'admin') {
    return null;
  }

  return (
    <>
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href="/apps/admin/landing"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 min-h-[48px]"
          {...backButtonProps}
        >
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          Kembali
        </Link>
        <h1 className="text-3xl font-bold mb-2">Kelola Tentang Kami</h1>
      </div>

      <div className="space-y-6">
        <AccessibleInput
          label="Judul"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <AccessibleInput
          label="Subjudul"
          value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Deskripsi <span className="text-destructive">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full min-h-[48px] px-4 py-2 border rounded-lg bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            rows={6}
            required
            aria-required="true"
          />
        </div>

        <AccessibleInput
          label="URL Gambar"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          description="URL lengkap ke gambar yang akan ditampilkan"
        />

        <AccessibleInput
          label="Judul Bagian 'Mengapa Kami Berbeda'"
          value={formData.why_different_title}
          onChange={(e) => setFormData({ ...formData, why_different_title: e.target.value })}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">Item 'Mengapa Kami Berbeda'</label>
            <AccessibleButton
              onClick={addWhyDifferentItem}
              variant="outline"
              size="sm"
              announcementText="Menambahkan item baru"
            >
              <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
              Tambah Item
            </AccessibleButton>
          </div>

          {formData.why_different_items.map((item, index) => (
            <div key={index} className="bg-card p-4 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Item {index + 1}</span>
                <AccessibleButton
                  onClick={() => removeWhyDifferentItem(index)}
                  variant="ghost"
                  size="sm"
                  announcementText={`Menghapus item ${index + 1}`}
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </AccessibleButton>
              </div>
              <AccessibleInput
                label="Judul"
                value={item.title}
                onChange={(e) => updateWhyDifferentItem(index, 'title', e.target.value)}
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium">Deskripsi</label>
                <textarea
                  value={item.description}
                  onChange={(e) => updateWhyDifferentItem(index, 'description', e.target.value)}
                  className="w-full min-h-[48px] px-4 py-2 border rounded-lg bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 min-h-[48px]">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5"
            />
            <span>Aktif</span>
          </label>
        </div>

        <div className="flex gap-4">
          <AccessibleButton
            onClick={handleSave}
            disabled={saving || !formData.title || !formData.description}
            announcementText={saving ? 'Menyimpan...' : 'Menyimpan data tentang kami'}
          >
            <Save className="w-4 h-4 mr-2" aria-hidden="true" />
            {saving ? 'Menyimpan...' : 'Simpan'}
          </AccessibleButton>

          {about && (
            <AccessibleButton
              onClick={() => setDeleteOpen(true)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              announcementText="Menghapus data tentang kami"
            >
              <Trash2 className="w-4 h-4 mr-2" aria-hidden="true" />
              Hapus
            </AccessibleButton>
          )}
        </div>
      </div>
    </div>
    <ConfirmDialog
      isOpen={deleteOpen}
      title="Hapus data tentang kami?"
      description="Tindakan ini akan menonaktifkan data tentang kami yang sedang aktif."
      confirmLabel="Hapus"
      cancelLabel="Batal"
      onCancel={() => setDeleteOpen(false)}
      onConfirm={async () => {
        await handleDelete();
        setDeleteOpen(false);
      }}
    />
    </>
  );
}
