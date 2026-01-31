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
import { LandingValue } from '@/types/landing';
import { ArrowLeft, Save, Trash2, Heart, Target, Lightbulb, Shield } from 'lucide-react';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { AccessibleInput } from '@/components/forms/AccessibleInput';
import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';
import { getValues, createValue, updateValue, deleteValue } from './actions';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

const ICON_OPTIONS = [
  { value: 'heart', label: 'Hati (Kepedulian)', icon: Heart },
  { value: 'target', label: 'Target (Tujuan)', icon: Target },
  { value: 'lightbulb', label: 'Bola Lampu (Inovasi)', icon: Lightbulb },
  { value: 'shield', label: 'Perisai (Keamanan)', icon: Shield },
];

export default function AdminValuesPage() {
  usePageAnnouncement('Kelola Nilai Organisasi', 'Halaman untuk mengelola nilai-nilai organisasi');

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
  const [values, setValues] = useState<LandingValue[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LandingValue | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon_name: 'heart' as string,
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
        await loadValues();
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

  const loadValues = async () => {
    try {
      const data = await getValues();
      setValues(data || []);
    } catch (error: any) {
      console.error('Error loading values:', error);
      announce('Gagal memuat nilai organisasi. Silakan coba lagi.');
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      announce('Judul dan deskripsi wajib diisi.');
      triggerHaptic('error');
      return;
    }

    setSaving(true);
    try {
      const orderIndex = editingId
        ? values.find(v => v.id === editingId)?.order_index || values.length
        : values.length;

      if (editingId) {
        await updateValue(editingId, {
          ...formData,
          order_index: orderIndex,
        });
        announce('Nilai organisasi berhasil diperbarui.');
        triggerHaptic('apply-success');
      } else {
        await createValue({
          ...formData,
          order_index: orderIndex,
        });
        announce('Nilai organisasi berhasil ditambahkan.');
        triggerHaptic('apply-success');
      }

      setFormData({
        title: '',
        description: '',
        icon_name: 'heart',
        is_active: true,
      });
      setEditingId(null);
      await loadValues();
    } catch (error) {
      console.error('Error saving value:', error);
      announce('Gagal menyimpan nilai organisasi.');
      triggerHaptic('error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteValue(id);
      announce('Nilai organisasi berhasil dihapus.');
      triggerHaptic('apply-success');
      await loadValues();
    } catch (error) {
      console.error('Error deleting value:', error);
      announce('Gagal menghapus nilai organisasi.');
      triggerHaptic('error');
    }
  };

  const handleEdit = (value: LandingValue) => {
    setFormData({
      title: value.title,
      description: value.description,
      icon_name: value.icon_name || 'heart',
      is_active: value.is_active,
    });
    setEditingId(value.id);
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      icon_name: 'heart',
      is_active: true,
    });
    setEditingId(null);
  };

  if (loading || authLoading) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || userRole !== 'admin') {
    return null;
  }

  const selectedIcon = ICON_OPTIONS.find(opt => opt.value === formData.icon_name);
  const SelectedIconComponent = selectedIcon?.icon || Heart;

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
        <h1 className="text-3xl font-bold mb-2">Kelola Nilai Organisasi</h1>
        <p className="text-muted-foreground">
          Kelola nilai-nilai inti organisasi yang ditampilkan di landing page
        </p>
      </div>

      <div className="space-y-6">
        {/* Form Section */}
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Nilai' : 'Tambah Nilai Baru'}
          </h2>

          <div className="space-y-4">
            <AccessibleInput
              label="Judul Nilai"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Contoh: Inovasi, Kepedulian, Integritas"
              required
            />

            <div>
              <label className="block text-sm font-medium mb-2">Deskripsi</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg bg-background"
                placeholder="Jelaskan nilai ini dan pentingnya bagi organisasi"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ikon</label>
              <select
                value={formData.icon_name}
                onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              >
                {ICON_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="mt-3 p-3 bg-muted rounded-lg flex items-center gap-3">
                <SelectedIconComponent className="w-8 h-8 text-primary" />
                <span className="text-sm">{selectedIcon?.label}</span>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <span className="text-sm">Aktif</span>
            </label>

            <div className="flex gap-2">
              <AccessibleButton
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Menyimpan...' : 'Simpan Nilai'}
              </AccessibleButton>

              {editingId && (
                <AccessibleButton
                  onClick={handleCancel}
                  variant="outline"
                >
                  Batal
                </AccessibleButton>
              )}
            </div>
          </div>
        </div>

        {/* Values List */}
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">Daftar Nilai ({values.length})</h2>

          {values.length === 0 ? (
            <p className="text-muted-foreground">Belum ada nilai. Tambahkan nilai baru untuk memulai.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {values.map((value) => {
                const icon = ICON_OPTIONS.find(opt => opt.value === value.icon_name);
                const IconComponent = icon?.icon || Heart;

                return (
                  <div
                    key={value.id}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition"
                  >
                    <div className="flex-shrink-0">
                      <IconComponent className="w-8 h-8 text-primary mt-1" aria-hidden="true" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{value.title}</h3>
                        {!value.is_active && (
                          <span className="text-xs px-2 py-1 bg-muted rounded">Nonaktif</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{value.description}</p>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <AccessibleButton
                        onClick={() => handleEdit(value)}
                        variant="ghost"
                        size="sm"
                      >
                        Edit
                      </AccessibleButton>

                      <AccessibleButton
                        onClick={() => setDeleteTarget(value)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </AccessibleButton>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
    <ConfirmDialog
      isOpen={!!deleteTarget}
      title="Hapus nilai organisasi?"
      description={deleteTarget ? `Anda akan menghapus "${deleteTarget.title}". Tindakan ini tidak dapat dibatalkan.` : undefined}
      confirmLabel="Hapus"
      cancelLabel="Batal"
      onCancel={() => setDeleteTarget(null)}
      onConfirm={async () => {
        if (!deleteTarget) return;
        await handleDelete(deleteTarget.id);
        setDeleteTarget(null);
      }}
    />
    </>
  );
}
