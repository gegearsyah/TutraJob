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
import { LandingEmployer } from '@/types/landing';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { AccessibleInput } from '@/components/forms/AccessibleInput';
import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';
import { getEmployers, createEmployer, updateEmployer, deleteEmployer } from './actions';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export default function AdminEmployersPage() {
  usePageAnnouncement('Kelola Mitra Perusahaan', 'Halaman untuk mengelola daftar perusahaan mitra');

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
  const [employers, setEmployers] = useState<LandingEmployer[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LandingEmployer | null>(null);
  const [formData, setFormData] = useState({
    company_name: '',
    logo_url: '',
    description: '',
    website_url: '',
    industry: '',
    employee_count: '',
    location: '',
    is_featured: false,
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
        await loadEmployers();
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

  const loadEmployers = async () => {
    try {
      const data = await getEmployers();
      setEmployers(data || []);
    } catch (error: any) {
      console.error('Error loading employers:', error);
      announce('Gagal memuat data perusahaan. Silakan coba lagi.');
    }
  };

  const handleSave = async () => {
    if (!formData.company_name || !formData.logo_url) {
      announce('Nama perusahaan dan URL logo wajib diisi.');
      triggerHaptic('error');
      return;
    }

    setSaving(true);
    try {
      const orderIndex = editingId
        ? employers.find(e => e.id === editingId)?.order_index || employers.length
        : employers.length;

      const saveData = {
        ...formData,
        employee_count: formData.employee_count ? parseInt(formData.employee_count) : undefined,
        order_index: orderIndex,
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        await updateEmployer(editingId, saveData);
        announce('Data perusahaan berhasil diperbarui.');
        triggerHaptic('apply-success');
      } else {
        await createEmployer({
          ...saveData,
        });
        announce('Data perusahaan berhasil ditambahkan.');
        triggerHaptic('apply-success');
      }

      setFormData({
        company_name: '',
        logo_url: '',
        description: '',
        website_url: '',
        industry: '',
        employee_count: '',
        location: '',
        is_featured: false,
        is_active: true,
      });
      setEditingId(null);
      await loadEmployers();
    } catch (error) {
      console.error('Error saving employer:', error);
      announce('Gagal menyimpan data perusahaan.');
      triggerHaptic('error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEmployer(id);


      announce('Perusahaan berhasil dihapus.');
      triggerHaptic('apply-success');
      await loadEmployers();
    } catch (error) {
      console.error('Error deleting employer:', error);
      announce('Gagal menghapus perusahaan.');
      triggerHaptic('error');
    }
  };

  const handleEdit = (employer: LandingEmployer) => {
    setFormData({
      company_name: employer.company_name,
      logo_url: employer.logo_url || '',
      description: employer.description || '',
      website_url: employer.website_url || '',
      industry: employer.industry || '',
      employee_count: employer.employee_count?.toString() || '',
      location: employer.location || '',
      is_featured: employer.is_featured,
      is_active: employer.is_active,
    });
    setEditingId(employer.id);
  };

  const handleCancel = () => {
    setFormData({
      company_name: '',
      logo_url: '',
      description: '',
      website_url: '',
      industry: '',
      employee_count: '',
      location: '',
      is_featured: false,
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
        <h1 className="text-3xl font-bold mb-2">Kelola Mitra Perusahaan</h1>
        <p className="text-muted-foreground">
          Kelola daftar perusahaan mitra yang ditampilkan dalam carousel di landing page
        </p>
      </div>

      <div className="space-y-6">
        {/* Form Section */}
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Perusahaan' : 'Tambah Perusahaan Baru'}
          </h2>

          <div className="space-y-4">
            <AccessibleInput
              label="Nama Perusahaan"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              required
            />

            <AccessibleInput
              label="URL Logo (Link gambar logo perusahaan)"
              value={formData.logo_url}
              onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
              placeholder="https://example.com/logo.png"
              required
            />

            {formData.logo_url && (
              <div>
                <label className="block text-sm font-medium mb-2">Preview Logo</label>
                <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={formData.logo_url}
                    alt={formData.company_name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-logo.svg';
                    }}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Deskripsi Perusahaan</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg bg-background"
                placeholder="Jelaskan tentang perusahaan dan layanannya"
              />
            </div>

            <AccessibleInput
              label="Website"
              value={formData.website_url}
              onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
              placeholder="https://example.com"
            />

            <AccessibleInput
              label="Industri"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              placeholder="Teknologi, Keuangan, dll"
            />

            <AccessibleInput
              label="Jumlah Karyawan"
              value={formData.employee_count}
              onChange={(e) => setFormData({ ...formData, employee_count: e.target.value })}
              type="number"
              placeholder="1000"
            />

            <AccessibleInput
              label="Lokasi"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Jakarta, Indonesia"
            />

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                />
                <span className="text-sm">Tampilkan sebagai Unggulan</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                <span className="text-sm">Aktif</span>
              </label>
            </div>

            <div className="flex gap-2">
              <AccessibleButton
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Menyimpan...' : 'Simpan Perusahaan'}
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

        {/* Employers List */}
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">Daftar Perusahaan ({employers.length})</h2>

          {employers.length === 0 ? (
            <p className="text-muted-foreground">Belum ada perusahaan. Tambahkan perusahaan baru untuk memulai.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {employers.map((employer) => (
                <div
                  key={employer.id}
                  className="relative group border rounded-lg p-4 hover:bg-muted/50 transition flex flex-col"
                >
                  {/* Logo */}
                  <div className="w-full h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden mb-2">
                    {employer.logo_url ? (
                      <img
                        src={employer.logo_url}
                        alt={employer.company_name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-logo.svg';
                        }}
                      />
                    ) : (
                      <div className="text-muted-foreground text-xs text-center">No Logo</div>
                    )}
                  </div>

                  {/* Company Name */}
                  <h3 className="font-semibold text-sm line-clamp-2">{employer.company_name}</h3>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {!employer.is_active && (
                      <span className="text-xs px-2 py-0.5 bg-muted rounded">Nonaktif</span>
                    )}
                    {employer.is_featured && (
                      <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">Unggulan</span>
                    )}
                  </div>

                  {/* Location */}
                  {employer.location && (
                    <p className="text-xs text-muted-foreground mt-1">{employer.location}</p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition">
                    <AccessibleButton
                      onClick={() => handleEdit(employer)}
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-xs"
                    >
                      Edit
                    </AccessibleButton>

                    <AccessibleButton
                      onClick={() => setDeleteTarget(employer)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 text-xs"
                    >
                      <Trash2 className="w-3 h-3" />
                    </AccessibleButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    <ConfirmDialog
      isOpen={!!deleteTarget}
      title="Hapus perusahaan?"
      description={deleteTarget ? `Anda akan menghapus ${deleteTarget.company_name}. Tindakan ini tidak dapat dibatalkan.` : undefined}
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
