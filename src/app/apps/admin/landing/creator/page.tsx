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
import { LandingCreatorProfile } from '@/types/landing';
import { ArrowLeft, Save, Trash2, Plus } from 'lucide-react';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { AccessibleInput } from '@/components/forms/AccessibleInput';
import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';
import { getCreators, createCreator, updateCreator, deleteCreator } from './actions';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export default function AdminCreatorPage() {
  usePageAnnouncement('Kelola Profil Pembuat', 'Halaman untuk mengelola profil pembuat platform dalam carousel');
  
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
  const [creators, setCreators] = useState<LandingCreatorProfile[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LandingCreatorProfile | null>(null);
  const [achievementInput, setAchievementInput] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    image_url: '',
    social_links: {
      linkedin: '',
      twitter: '',
      github: '',
      website: '',
    },
    achievements: [] as string[],
    order_index: 0,
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
        await loadCreators();
      } catch (error) {
        console.error('Error checking admin role:', error);
        router.push('/apps/admin/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [isMounted, isAuthenticated, authLoading, router]);

  const loadCreators = async () => {
    try {
      const data = await getCreators();
      setCreators(data || []);
    } catch (error: any) {
      console.error('Error loading creators:', error);
      announce('Gagal memuat data pembuat. Silakan coba lagi.');
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.title || !formData.bio) {
      announce('Nama, jabatan, dan bio wajib diisi.');
      triggerHaptic('error');
      return;
    }

    setSaving(true);
    try {
      const orderIndex = editingId
        ? creators.find(c => c.id === editingId)?.order_index || creators.length
        : creators.length;

      const creatorData = {
        ...formData,
        order_index: orderIndex,
        social_links: formData.social_links || {},
      };

      if (editingId) {
        await updateCreator(editingId, creatorData);
        announce('Profil pembuat berhasil diperbarui.');
        triggerHaptic('apply-success');
      } else {
        await createCreator(creatorData);
        announce('Profil pembuat berhasil ditambahkan.');
        triggerHaptic('apply-success');
      }

      setFormData({
        name: '',
        title: '',
        bio: '',
        image_url: '',
        social_links: {
          linkedin: '',
          twitter: '',
          github: '',
          website: '',
        },
        achievements: [],
        order_index: 0,
        is_active: true,
      });
      setAchievementInput('');
      setEditingId(null);
      await loadCreators();
    } catch (error) {
      console.error('Error saving creator:', error);
      announce('Gagal menyimpan profil pembuat.');
      triggerHaptic('error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCreator(id);
      announce('Profil pembuat berhasil dihapus.');
      triggerHaptic('apply-success');
      await loadCreators();
    } catch (error) {
      console.error('Error deleting creator:', error);
      announce('Gagal menghapus profil pembuat.');
      triggerHaptic('error');
    }
  };

  const handleEdit = (creator: LandingCreatorProfile) => {
    setFormData({
      name: creator.name,
      title: creator.title,
      bio: creator.bio,
      image_url: creator.image_url || '',
      social_links: {
        linkedin: creator.social_links?.linkedin ?? '',
        twitter: creator.social_links?.twitter ?? '',
        github: creator.social_links?.github ?? '',
        website: creator.social_links?.website ?? '',
      },
      achievements: creator.achievements || [],
      order_index: creator.order_index,
      is_active: creator.is_active,
    });
    setEditingId(creator.id);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      title: '',
      bio: '',
      image_url: '',
      social_links: {
        linkedin: '',
        twitter: '',
        github: '',
        website: '',
      },
      achievements: [],
      order_index: 0,
      is_active: true,
    });
    setAchievementInput('');
    setEditingId(null);
  };

  const addAchievement = () => {
    if (achievementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, achievementInput.trim()],
      }));
      setAchievementInput('');
      announce(`Pencapaian "${achievementInput}" ditambahkan.`);
    }
  };

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
    announce('Pencapaian dihapus.');
  };

  if (!isMounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Memuat...</div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/apps/admin/landing" {...backButtonProps}>
            <AccessibleButton
              variant="ghost"
              size="sm"
              className="mb-4 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </AccessibleButton>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Profil Pembuat</h1>
          <p className="text-gray-600 mt-2">
            Kelola profil pembuat platform yang ditampilkan dalam carousel
          </p>
        </div>

                      (e.target as HTMLImageElement).src = '/placeholder-avatar.svg';
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">
                {editingId ? 'Edit Pembuat' : 'Tambah Pembuat Baru'}
              </h2>

              {/* Form Fields */}
              <div className="space-y-4">
                <AccessibleInput
                  label="Nama Lengkap"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Dr. Budi Santoso"
                  required
                />

                <AccessibleInput
                  label="Jabatan"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Founder & CEO"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio (Deskripsi)
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Deskripsi singkat tentang pembuat..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    required
                  />
                </div>

                <AccessibleInput
                  label="URL Foto (Image URL)"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                  type="url"
                />

                {formData.image_url && (
                  <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={formData.image_url}
                      alt={formData.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/placeholder-avatar.svg';
                      }}
                    />
                  </div>
                )}

                {/* Social Links */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-sm mb-3">Tautan Media Sosial (Opsional)</h3>
                  <div className="space-y-2">
                    <AccessibleInput
                      label="LinkedIn"
                      value={formData.social_links.linkedin}
                      onChange={(e) => setFormData({
                        ...formData,
                        social_links: { ...formData.social_links, linkedin: e.target.value }
                      })}
                      placeholder="https://linkedin.com/in/..."
                      type="url"
                    />
                    <AccessibleInput
                      label="Twitter"
                      value={formData.social_links.twitter}
                      onChange={(e) => setFormData({
                        ...formData,
                        social_links: { ...formData.social_links, twitter: e.target.value }
                      })}
                      placeholder="https://twitter.com/..."
                      type="url"
                    />
                    <AccessibleInput
                      label="GitHub"
                      value={formData.social_links.github}
                      onChange={(e) => setFormData({
                        ...formData,
                        social_links: { ...formData.social_links, github: e.target.value }
                      })}
                      placeholder="https://github.com/..."
                      type="url"
                    />
                    <AccessibleInput
                      label="Website"
                      value={formData.social_links.website}
                      onChange={(e) => setFormData({
                        ...formData,
                        social_links: { ...formData.social_links, website: e.target.value }
                      })}
                      placeholder="https://example.com"
                      type="url"
                    />
                  </div>
                </div>

                {/* Achievements */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-sm mb-3">Pencapaian</h3>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={achievementInput}
                      onChange={(e) => setAchievementInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addAchievement()}
                      placeholder="Tambah pencapaian..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button
                      onClick={addAchievement}
                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium"
                    >
                      Tambah
                    </button>
                  </div>
                  {formData.achievements.length > 0 && (
                    <div className="space-y-1">
                      {formData.achievements.map((achievement, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-blue-50 p-2 rounded text-sm"
                        >
                          <span className="text-gray-700 line-clamp-1">{achievement}</span>
                          <button
                            onClick={() => removeAchievement(idx)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Active Toggle */}
                <div className="flex items-center gap-2 border-t pt-4">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    id="is-active"
                    className="w-4 h-4 text-blue-600 cursor-pointer"
                  />
                  <label htmlFor="is-active" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Tampilkan di landing page
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <AccessibleButton
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? 'Perbarui' : 'Simpan'}
                  </AccessibleButton>
                  {editingId && (
                    <AccessibleButton
                      onClick={handleCancel}
                      variant="ghost"
                      className="flex-1"
                    >
                      Batal
                    </AccessibleButton>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {creators.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-600">Belum ada profil pembuat. Tambahkan yang pertama!</p>
                </div>
              ) : (
                creators.map((creator) => (
                  <div key={creator.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex gap-4 p-4">
                      {/* Image */}
                      {creator.image_url && (
                        <div className="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={creator.image_url}
                            alt={creator.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-grow">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{creator.name}</h3>
                            <p className="text-sm text-blue-600 font-semibold">{creator.title}</p>
                            <p className="text-sm text-gray-600 line-clamp-2 mt-1">{creator.bio}</p>
                          </div>
                          <div className="flex gap-2">
                            <AccessibleButton
                              onClick={() => handleEdit(creator)}
                              size="sm"
                              variant="ghost"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Edit
                            </AccessibleButton>
                            <AccessibleButton
                              onClick={() => setDeleteTarget(creator)}
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </AccessibleButton>
                          </div>
                        </div>

                        {/* Achievements */}
                        {creator.achievements && creator.achievements.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {creator.achievements.slice(0, 3).map((achievement, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                              >
                                {achievement}
                              </span>
                            ))}
                            {creator.achievements.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{creator.achievements.length - 3} lebih
                              </span>
                            )}
                          </div>
                        )}

                        {/* Status */}
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            creator.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {creator.is_active ? 'Aktif' : 'Tidak Aktif'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    <ConfirmDialog
      isOpen={!!deleteTarget}
      title="Hapus profil pembuat?"
      description={deleteTarget ? `Anda akan menghapus profil ${deleteTarget.name}. Tindakan ini tidak dapat dibatalkan.` : undefined}
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
