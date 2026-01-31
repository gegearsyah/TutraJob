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
import { LandingArticle } from '@/types/landing';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { AccessibleInput } from '@/components/forms/AccessibleInput';
import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';
import { getArticles, createArticle, updateArticle, deleteArticle } from './actions';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export default function AdminArticlesPage() {
  usePageAnnouncement('Kelola Artikel & Testimoni', 'Halaman untuk mengelola artikel informatif dan testimoni');

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
  const [articles, setArticles] = useState<LandingArticle[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LandingArticle | null>(null);
  const [formData, setFormData] = useState({
    type: 'info' as 'info' | 'testimonial',
    title: '',
    content: '',
    author_name: '',
    author_title: '',
    author_image_url: '',
    image_url: '',
    category: '',
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
        await loadArticles();
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

  const loadArticles = async () => {
    try {
      const data = await getArticles();
      setArticles(data || []);
    } catch (error: any) {
      console.error('Error loading articles:', error);
      announce('Gagal memuat artikel. Silakan coba lagi.');
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      announce('Judul dan konten wajib diisi.');
      triggerHaptic('error');
      return;
    }

    setSaving(true);
    try {
      const orderIndex = editingId
        ? articles.find(a => a.id === editingId)?.order_index || articles.length
        : articles.length;

      if (editingId) {
        await updateArticle(editingId, {
          ...formData,
          order_index: orderIndex,
        });
        announce('Artikel berhasil diperbarui.');
        triggerHaptic('apply-success');
      } else {
        await createArticle({
          ...formData,
          order_index: orderIndex,
        });
        announce('Artikel berhasil ditambahkan.');
        triggerHaptic('apply-success');
      }

      setFormData({
        type: 'info',
        title: '',
        content: '',
        author_name: '',
        author_title: '',
        author_image_url: '',
        image_url: '',
        category: '',
        is_featured: false,
        is_active: true,
      });
      setEditingId(null);
      await loadArticles();
    } catch (error) {
      console.error('Error saving article:', error);
      announce('Gagal menyimpan artikel.');
      triggerHaptic('error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteArticle(id);

      announce('Artikel berhasil dihapus.');
      triggerHaptic('apply-success');
      await loadArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      announce('Gagal menghapus artikel.');
      triggerHaptic('error');
    }
  };

  const handleEdit = (article: LandingArticle) => {
    setFormData({
      type: article.type,
      title: article.title,
      content: article.content,
      author_name: article.author_name || '',
      author_title: article.author_title || '',
      author_image_url: article.author_image_url || '',
      image_url: article.image_url || '',
      category: article.category || '',
      is_featured: article.is_featured,
      is_active: article.is_active,
    });
    setEditingId(article.id);
  };

  const handleCancel = () => {
    setFormData({
      type: 'info',
      title: '',
      content: '',
      author_name: '',
      author_title: '',
      author_image_url: '',
      image_url: '',
      category: '',
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
        <h1 className="text-3xl font-bold mb-2">Kelola Artikel & Testimoni</h1>
        <p className="text-muted-foreground">
          Kelola artikel informatif dan testimoni yang ditampilkan di landing page
        </p>
      </div>

      <div className="space-y-6">
        {/* Form Section */}
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Artikel' : 'Tambah Artikel Baru'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tipe</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'info' | 'testimonial' })}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              >
                <option value="info">Artikel Informatif</option>
                <option value="testimonial">Testimoni</option>
              </select>
            </div>

            <AccessibleInput
              label="Judul Artikel"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Masukkan judul artikel yang menarik..."
              required
            />

            <div>
              <label className="block text-sm font-medium mb-2">
                Konten Artikel *
                <span className="text-xs text-muted-foreground ml-2">
                  Gunakan # untuk heading, ## untuk sub-heading, &gt; untuk kutipan
                </span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={12}
                className="w-full px-4 py-3 border rounded-lg bg-background font-mono text-sm leading-relaxed"
                placeholder="Tulis konten artikel Anda di sini...&#10;&#10;# Heading Utama&#10;Paragraf pertama dengan penjelasan lengkap.&#10;&#10;## Sub Heading&#10;Paragraf berikutnya.&#10;&#10;> Ini adalah kutipan penting"
                required
              />
              <p className="text-xs text-muted-foreground mt-2">
                {formData.content.split(' ').filter(w => w.length > 0).length} kata • 
                ~{Math.ceil(formData.content.split(' ').filter(w => w.length > 0).length / 200)} menit baca
              </p>
            </div>

            {/* Author Info - for both types */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="md:col-span-2">
                <h3 className="font-semibold mb-2">Informasi Penulis</h3>
              </div>
              
              <AccessibleInput
                label={formData.type === 'testimonial' ? 'Nama Pembuat Testimoni' : 'Nama Penulis'}
                value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                placeholder="John Doe"
              />

              <AccessibleInput
                label={formData.type === 'testimonial' ? 'Jabatan/Peran' : 'Posisi Penulis'}
                value={formData.author_title}
                onChange={(e) => setFormData({ ...formData, author_title: e.target.value })}
                placeholder="Software Engineer"
              />

              <div className="md:col-span-2">
                <AccessibleInput
                  label="URL Foto Penulis"
                  value={formData.author_image_url}
                  onChange={(e) => setFormData({ ...formData, author_image_url: e.target.value })}
                  placeholder="https://example.com/author.jpg"
                />
                {formData.author_image_url && (
                  <div className="mt-2 relative w-16 h-16 rounded-full overflow-hidden border-2">
                    <img src={formData.author_image_url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Featured Image */}
            <div className="space-y-2">
              <AccessibleInput
                label="URL Gambar Unggulan"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/featured-image.jpg"
              />
              {formData.image_url && (
                <div className="relative aspect-video rounded-lg overflow-hidden border">
                  <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <AccessibleInput
              label="Kategori"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Karir, Teknologi, Tips, dll."
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
                {saving ? 'Menyimpan...' : 'Simpan Artikel'}
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

        {/* Articles List */}
        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">Daftar Artikel ({articles.length})</h2>

          {articles.length === 0 ? (
            <p className="text-muted-foreground">Belum ada artikel. Tambahkan artikel baru untuk memulai.</p>
          ) : (
            <div className="space-y-3">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-start justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{article.title}</h3>
                      <span className="text-xs px-2 py-1 bg-primary/20 rounded">
                        {article.type === 'info' ? 'Artikel' : 'Testimoni'}
                      </span>
                      {!article.is_active && (
                        <span className="text-xs px-2 py-1 bg-muted rounded">Nonaktif</span>
                      )}
                      {article.is_featured && (
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Unggulan</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{article.content}</p>
                    {article.author_name && (
                      <p className="text-xs text-muted-foreground mt-1">— {article.author_name}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <AccessibleButton
                      onClick={() => handleEdit(article)}
                      variant="ghost"
                      size="sm"
                    >
                      Edit
                    </AccessibleButton>

                    <AccessibleButton
                      onClick={() => setDeleteTarget(article)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
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
      title="Hapus artikel?"
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
