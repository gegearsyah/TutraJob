/**
 * Admin Scraping Configuration Page
 * Allows admins to configure job scraping URLs and settings
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsMounted } from '@/lib/hooks/useIsMounted';
import { usePageAnnouncement } from '@/hooks/usePageAnnouncement';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { getUserRole } from '@/lib/auth/roles';
import { supabase } from '@/lib/supabase/client';
import { announce } from '@/lib/audio';
import { triggerHaptic } from '@/lib/haptic';
import { AccessibleInput } from '@/components/forms/AccessibleInput';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { FocusAnnouncement } from '@/components/accessibility/FocusAnnouncement';
import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';
import { 
  Link as LinkIcon, 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  RefreshCw,
  Save,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Settings
} from 'lucide-react';
import Link from 'next/link';

interface ScrapingSource {
  id?: string;
  name: string;
  baseUrl: string;
  jobListUrl: string; // URL to the page listing jobs
  enabled: boolean;
  intervalHours: number;
  selector?: string; // CSS selector for job links (optional)
  description?: string;
}

export default function ScrapingConfigPage() {
  // All hooks at top level before any conditional logic
  usePageAnnouncement('Pengaturan Scraping', 'Halaman konfigurasi scraping pekerjaan');

  const isMounted = useIsMounted();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sources, setSources] = useState<ScrapingSource[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Check authentication and admin role
  const { isAuthenticated, loading: authLoading } = useAuthGuard({
    requireAuth: true,
    redirectTo: '/apps/admin/auth/login',
  });

  const [newSource, setNewSource] = useState<ScrapingSource>({
    name: '',
    baseUrl: '',
    jobListUrl: '',
    enabled: true,
    intervalHours: 6,
    selector: '',
    description: '',
  });

  // Define all hooks before rendering - MOVED BEFORE EARLY RETURNS
  const addButtonProps = useFocusAnnouncement({
    description: 'Tambah sumber scraping baru. Setelah diklik, form akan muncul untuk mengisi detail sumber scraping.',
    label: 'Tambah Sumber',
    context: 'Klik untuk menambahkan sumber scraping',
    announceOnFocus: true,
    announceOnLongPress: true,
  });

  useEffect(() => {
    if (!isMounted || authLoading) return;

    const checkAdmin = async () => {
      try {
        const role = await getUserRole();
        if (role !== 'admin') {
          router.push('/apps/admin/auth/login');
          return;
        }
        setUserRole(role);
        loadSources();
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

  const loadSources = async () => {
    try {
      // Load from Supabase (you'll need to create a scraping_sources table)
      // For now, use localStorage as fallback
      const saved = localStorage.getItem('scraping-sources');
      if (saved) {
        setSources(JSON.parse(saved));
      } else {
        // Default sources
        setSources([
          {
            id: '1',
            name: 'KarirHub',
            baseUrl: 'https://karirhub.com',
            jobListUrl: 'https://karirhub.com/jobs',
            enabled: true,
            intervalHours: 6,
            description: 'Situs pencarian kerja populer di Indonesia',
          },
          {
            id: '2',
            name: 'DNetwork',
            baseUrl: 'https://dnetwork.id',
            jobListUrl: 'https://dnetwork.id/lowongan',
            enabled: true,
            intervalHours: 6,
            description: 'Platform rekrutmen untuk disabilitas',
          },
        ]);
      }
    } catch (error) {
      console.error('Error loading sources:', error);
    }
  };

  const handleAddSource = () => {
    if (!newSource.name || !newSource.baseUrl || !newSource.jobListUrl) {
      setError('Nama, Base URL, dan Job List URL harus diisi');
      if (isMounted) {
        triggerHaptic('error');
        announce('Semua field wajib harus diisi');
      }
      return;
    }

    const source: ScrapingSource = {
      ...newSource,
      id: Date.now().toString(),
    };

    const updated = [...sources, source];
    setSources(updated);
    saveSources(updated);

    setNewSource({
      name: '',
      baseUrl: '',
      jobListUrl: '',
      enabled: true,
      intervalHours: 6,
      selector: '',
      description: '',
    });
    setIsAdding(false);

    if (isMounted) {
      triggerHaptic('apply-success');
      announce(`Sumber scraping ${source.name} berhasil ditambahkan`);
    }
  };

  const handleDeleteSource = (id: string) => {
    const updated = sources.filter(s => s.id !== id);
    setSources(updated);
    saveSources(updated);

    if (isMounted) {
      triggerHaptic('dismiss');
      announce('Sumber scraping dihapus');
    }
  };

  const handleToggleSource = (id: string) => {
    const updated = sources.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    setSources(updated);
    saveSources(updated);

    const source = sources.find(s => s.id === id);
    if (isMounted) {
      triggerHaptic('confirmation');
      announce(`Sumber scraping ${source?.name} ${source?.enabled ? 'dinonaktifkan' : 'diaktifkan'}`);
    }
  };

  const saveSources = (sourcesToSave: ScrapingSource[]) => {
    try {
      localStorage.setItem('scraping-sources', JSON.stringify(sourcesToSave));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving sources:', error);
      setError('Gagal menyimpan konfigurasi');
    }
  };

  const handleTestScraping = async (source: ScrapingSource) => {
    if (isMounted) {
      triggerHaptic('loading');
      announce(`Menguji scraping dari ${source.name}...`);
    }

    // TODO: Call backend API to test scraping
    // For now, just show a message
    setTimeout(() => {
      if (isMounted) {
        triggerHaptic('apply-success');
        announce(`Pengujian scraping dari ${source.name} selesai. Periksa hasil di console.`);
      }
    }, 2000);
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
    <div className="container py-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/apps/admin/dashboard"
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Kembali ke dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <FocusAnnouncement
              description="Halaman Pengaturan Scraping. Di sini Anda dapat mengatur URL dan link untuk scraping pekerjaan dari berbagai sumber."
              label="Pengaturan Scraping"
            >
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <LinkIcon className="w-8 h-8 text-primary" aria-hidden="true" />
                Pengaturan Scraping
              </h1>
            </FocusAnnouncement>
          </div>
        </div>
        <p className="text-muted-foreground">
          Kelola URL dan konfigurasi untuk scraping pekerjaan dari berbagai sumber
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
            <p className="text-sm text-green-500">Konfigurasi berhasil disimpan!</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Add New Source */}
        <div className="border border-border rounded-lg p-6 bg-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Tambah Sumber Scraping</h2>
            <button
              onClick={() => {
                setIsAdding(!isAdding);
                if (isMounted) {
                  announce(isAdding ? 'Form tambah sumber ditutup' : 'Form tambah sumber dibuka');
                }
              }}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors min-h-[48px]"
              {...addButtonProps}
            >
              {isAdding ? (
                <>
                  <Pause className="w-4 h-4" />
                  Batal
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Tambah Sumber
                </>
              )}
            </button>
          </div>

          {isAdding && (
            <div className="space-y-4 mt-4">
              <AccessibleInput
                label="Nama Sumber"
                description="Nama sumber scraping, contoh: KarirHub, DNetwork"
                required
                value={newSource.name}
                onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                placeholder="Contoh: KarirHub"
                id="source-name"
              />

              <AccessibleInput
                label="Base URL"
                description="URL utama website, contoh: https://karirhub.com"
                required
                type="url"
                value={newSource.baseUrl}
                onChange={(e) => setNewSource({ ...newSource, baseUrl: e.target.value })}
                placeholder="https://example.com"
                id="base-url"
              />

              <AccessibleInput
                label="Job List URL"
                description="URL halaman yang menampilkan daftar pekerjaan"
                required
                type="url"
                value={newSource.jobListUrl}
                onChange={(e) => setNewSource({ ...newSource, jobListUrl: e.target.value })}
                placeholder="https://example.com/jobs"
                id="job-list-url"
              />

              <AccessibleInput
                label="CSS Selector (Opsional)"
                description="Selector CSS untuk menemukan link pekerjaan, contoh: .job-link, a[href*='job']"
                value={newSource.selector || ''}
                onChange={(e) => setNewSource({ ...newSource, selector: e.target.value })}
                placeholder=".job-link"
                id="css-selector"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AccessibleInput
                  label="Interval (Jam)"
                  description="Berapa jam sekali scraping dilakukan"
                  type="number"
                  value={newSource.intervalHours.toString()}
                  onChange={(e) => setNewSource({ ...newSource, intervalHours: parseInt(e.target.value) || 6 })}
                  id="interval-hours"
                />

                <div className="flex items-center gap-2 min-h-[48px]">
                  <input
                    type="checkbox"
                    id="enabled"
                    checked={newSource.enabled}
                    onChange={(e) => setNewSource({ ...newSource, enabled: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <label htmlFor="enabled" className="text-sm">
                    Aktifkan scraping otomatis
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Deskripsi (Opsional)</label>
                <textarea
                  value={newSource.description || ''}
                  onChange={(e) => setNewSource({ ...newSource, description: e.target.value })}
                  className="w-full min-h-[80px] px-4 py-2 border border-input rounded-lg bg-background"
                  placeholder="Deskripsi sumber scraping..."
                />
              </div>

              <AccessibleButton
                onClick={handleAddSource}
                variant="primary"
                announcementText="Menambahkan sumber scraping baru"
                className="w-full"
              >
                <Plus className="w-5 h-5" />
                Tambah Sumber
              </AccessibleButton>
            </div>
          )}
        </div>

        {/* Existing Sources */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Sumber Scraping yang Dikonfigurasi</h2>
          
          {sources.length === 0 ? (
            <div className="p-8 border border-border rounded-lg bg-card text-center">
              <p className="text-muted-foreground">Belum ada sumber scraping yang dikonfigurasi</p>
            </div>
          ) : (
            sources.map((source) => {
              const toggleProps = useFocusAnnouncement({
                description: `${source.enabled ? 'Nonaktifkan' : 'Aktifkan'} scraping dari ${source.name}`,
                label: `${source.enabled ? 'Nonaktifkan' : 'Aktifkan'} Scraping`,
                context: 'Klik untuk mengubah status',
                announceOnFocus: true,
                announceOnLongPress: true,
              });

              const testProps = useFocusAnnouncement({
                description: `Uji scraping dari ${source.name}`,
                label: 'Uji Scraping',
                context: 'Klik untuk menguji',
                announceOnFocus: true,
                announceOnLongPress: true,
              });

              const deleteProps = useFocusAnnouncement({
                description: `Hapus sumber scraping ${source.name}`,
                label: 'Hapus Sumber',
                context: 'Klik untuk menghapus',
                announceOnFocus: true,
                announceOnLongPress: true,
              });

              return (
                <div
                  key={source.id}
                  className={`p-6 border rounded-lg bg-card ${
                    source.enabled ? 'border-primary/20' : 'border-border opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{source.name}</h3>
                        {source.enabled ? (
                          <span className="px-2 py-1 text-xs bg-green-500/10 text-green-500 rounded">
                            Aktif
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                            Nonaktif
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Base URL:</strong>{' '}
                          <a
                            href={source.baseUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {source.baseUrl}
                          </a>
                        </p>
                        <p>
                          <strong>Job List URL:</strong>{' '}
                          <a
                            href={source.jobListUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {source.jobListUrl}
                          </a>
                        </p>
                        {source.selector && (
                          <p>
                            <strong>CSS Selector:</strong> <code className="text-xs bg-muted px-1 py-0.5 rounded">{source.selector}</code>
                          </p>
                        )}
                        <p>
                          <strong>Interval:</strong> Setiap {source.intervalHours} jam
                        </p>
                        {source.description && (
                          <p className="text-muted-foreground">{source.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleToggleSource(source.id!)}
                        className={`
                          min-h-[44px] min-w-[44px] px-3 py-2 rounded-lg border transition-colors
                          flex items-center justify-center gap-2
                          ${source.enabled 
                            ? 'border-warning/20 bg-warning/10 hover:bg-warning/20' 
                            : 'border-primary/20 bg-primary/10 hover:bg-primary/20'
                          }
                        `}
                        {...toggleProps}
                      >
                        {source.enabled ? (
                          <>
                            <Pause className="w-4 h-4" />
                            <span className="hidden sm:inline">Nonaktifkan</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            <span className="hidden sm:inline">Aktifkan</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleTestScraping(source)}
                        className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2"
                        {...testProps}
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span className="hidden sm:inline">Uji</span>
                      </button>

                      <button
                        onClick={() => handleDeleteSource(source.id!)}
                        className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-lg border border-destructive/20 bg-destructive/10 hover:bg-destructive/20 transition-colors flex items-center justify-center"
                        {...deleteProps}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
