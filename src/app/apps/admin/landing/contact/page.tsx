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
import { LandingContact } from '@/types/landing';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { AccessibleInput } from '@/components/forms/AccessibleInput';
import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { getContacts, createContact, updateContact, deleteContact } from './actions';

const CONTACT_TYPES: Array<LandingContact['contact_type']> = ['email', 'phone', 'address', 'social'];

export default function AdminContactPage() {
  usePageAnnouncement('Kelola Kontak', 'Halaman untuk mengelola informasi kontak di landing page');

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
  const [contacts, setContacts] = useState<LandingContact[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LandingContact | null>(null);
  const [formData, setFormData] = useState({
    contact_type: 'email' as LandingContact['contact_type'],
    label: '',
    value: '',
    icon_name: '',
    order_index: '',
    is_active: true,
  });

  const { isAuthenticated, loading: authLoading } = useAuthGuard({
    requireAuth: true,
    redirectTo: '/apps/admin/auth/login',
  });

  useEffect(() => {
    if (!isMounted || authLoading) return;

    if (!isAuthenticated) {
      setLoading(false);
      router.push('/apps/admin/auth/login');
      return;
    }

    const checkAdmin = async () => {
      try {
        const role = await getUserRole();
        if (role !== 'admin') {
          announce('Akses ditolak. Hanya administrator yang dapat mengakses halaman ini.');
          router.push('/apps/admin/auth/login');
          return;
        }
        setUserRole(role);
        await loadContacts();
      } catch (error) {
        console.error('Error checking admin role:', error);
        router.push('/apps/admin/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [isMounted, isAuthenticated, authLoading, router]);

  const loadContacts = async () => {
    try {
      const data = await getContacts();
      setContacts(data || []);
    } catch (error: any) {
      console.error('Error loading contacts:', error);
      announce('Gagal memuat data kontak. Silakan coba lagi.');
    }
  };

  const resetForm = () => {
    setFormData({
      contact_type: 'email',
      label: '',
      value: '',
      icon_name: '',
      order_index: '',
      is_active: true,
    });
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!formData.label || !formData.value) {
      announce('Label dan nilai kontak wajib diisi.');
      triggerHaptic('error');
      return;
    }

    setSaving(true);
    try {
      const orderIndex = editingId
        ? contacts.find(c => c.id === editingId)?.order_index ?? contacts.length
        : contacts.length;

      const payload = {
        contact_type: formData.contact_type,
        label: formData.label,
        value: formData.value,
        icon_name: formData.icon_name || undefined,
        order_index: formData.order_index ? parseInt(formData.order_index) : orderIndex,
        is_active: formData.is_active,
      };

      if (editingId) {
        await updateContact(editingId, payload);
        announce('Kontak berhasil diperbarui.');
        triggerHaptic('apply-success');
      } else {
        await createContact(payload);
        announce('Kontak berhasil ditambahkan.');
        triggerHaptic('apply-success');
      }

      resetForm();
      await loadContacts();
    } catch (error) {
      console.error('Error saving contact:', error);
      announce('Gagal menyimpan kontak.');
      triggerHaptic('error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContact(id);
      announce('Kontak berhasil dihapus.');
      triggerHaptic('apply-success');
      await loadContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      announce('Gagal menghapus kontak.');
      triggerHaptic('error');
    }
  };

  const handleEdit = (contact: LandingContact) => {
    setFormData({
      contact_type: contact.contact_type,
      label: contact.label,
      value: contact.value,
      icon_name: contact.icon_name || '',
      order_index: contact.order_index?.toString() || '',
      is_active: contact.is_active,
    });
    setEditingId(contact.id);
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
      <div className="container py-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <Link
            href="/apps/admin/landing"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 min-h-[48px]"
            {...backButtonProps}
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            Kembali
          </Link>
          <h1 className="text-3xl font-bold mb-2">Kelola Kontak</h1>
          <p className="text-muted-foreground">Kelola informasi kontak yang ditampilkan di landing page</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border p-6 space-y-4 sticky top-6">
              <h2 className="text-lg font-semibold">{editingId ? 'Edit Kontak' : 'Tambah Kontak'}</h2>

              <div className="space-y-2">
                <label className="text-sm font-medium">Jenis Kontak</label>
                <select
                  value={formData.contact_type}
                  onChange={(e) => setFormData({ ...formData, contact_type: e.target.value as LandingContact['contact_type'] })}
                  className="w-full min-h-[48px] px-4 py-2 border rounded-lg bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {CONTACT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <AccessibleInput
                label="Label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                required
                description="Contoh: Email, Telepon, Alamat"
              />

              <AccessibleInput
                label="Nilai"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                required
                description="Contoh: info@inklusifkerja.id"
              />

              <AccessibleInput
                label="Icon (opsional)"
                value={formData.icon_name}
                onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                description="Contoh: mail, phone, map-pin"
              />

              <AccessibleInput
                label="Urutan (opsional)"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: e.target.value })}
                type="number"
                description="Semakin kecil semakin atas"
              />

              <label className="flex items-center gap-2 min-h-[48px]">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5"
                />
                <span>Aktif</span>
              </label>

              <div className="flex flex-col gap-3">
                <AccessibleButton
                  onClick={handleSave}
                  disabled={saving || !formData.label || !formData.value}
                  announcementText={saving ? 'Menyimpan...' : 'Menyimpan kontak'}
                >
                  <Save className="w-4 h-4 mr-2" aria-hidden="true" />
                  {saving ? 'Menyimpan...' : editingId ? 'Perbarui' : 'Simpan'}
                </AccessibleButton>

                {editingId && (
                  <AccessibleButton
                    onClick={resetForm}
                    variant="outline"
                    announcementText="Membatalkan perubahan"
                  >
                    Batal
                  </AccessibleButton>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {contacts.length === 0 ? (
              <div className="bg-card rounded-xl border p-8 text-center">
                <p className="text-muted-foreground">Belum ada data kontak.</p>
              </div>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="bg-card rounded-xl border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm px-2 py-1 bg-primary/10 rounded">{contact.contact_type}</span>
                      {!contact.is_active && (
                        <span className="text-xs px-2 py-1 bg-muted rounded">Nonaktif</span>
                      )}
                    </div>
                    <h3 className="font-semibold mt-2">{contact.label}</h3>
                    <p className="text-sm text-muted-foreground">{contact.value}</p>
                    {contact.icon_name && (
                      <p className="text-xs text-muted-foreground mt-1">Icon: {contact.icon_name}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <AccessibleButton
                      onClick={() => handleEdit(contact)}
                      variant="ghost"
                      size="sm"
                    >
                      Edit
                    </AccessibleButton>

                    <AccessibleButton
                      onClick={() => setDeleteTarget(contact)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </AccessibleButton>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus kontak?"
        description={deleteTarget ? `Anda akan menghapus "${deleteTarget.label}". Tindakan ini tidak dapat dibatalkan.` : undefined}
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
