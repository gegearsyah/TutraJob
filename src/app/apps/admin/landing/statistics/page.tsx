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
import { LandingStatistic } from '@/types/landing';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { AccessibleInput } from '@/components/forms/AccessibleInput';
import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';

export default function AdminStatisticsPage() {
  usePageAnnouncement('Kelola Statistik', 'Halaman untuk mengelola statistik platform');
  
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
  const [statistics, setStatistics] = useState<LandingStatistic[]>([]);

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
        await loadStatistics();
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

  const loadStatistics = async () => {
    try {
      const { data, error } = await supabase
        .from('landing_statistics')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;

      // Ensure we have all three types
      const types = ['job_seekers', 'job_positions', 'employers'];
      const existing = data || [];
      const statsMap = new Map(existing.map(s => [s.stat_type, s]));

      const allStats = types.map((type, index) => {
        if (statsMap.has(type)) {
          return statsMap.get(type)!;
        }
        return {
          id: '',
          stat_type: type as 'job_seekers' | 'job_positions' | 'employers',
          label_id: type === 'job_seekers' ? 'Pencari Kerja' : type === 'job_positions' ? 'Lowongan Pekerjaan' : 'Perusahaan',
          label_en: type === 'job_seekers' ? 'Job Seekers' : type === 'job_positions' ? 'Job Positions' : 'Employers',
          value: 0,
          icon_name: type === 'job_seekers' ? 'users' : type === 'job_positions' ? 'briefcase' : 'building',
          description: '',
          order_index: index,
          is_active: true,
          created_at: '',
          updated_at: '',
        };
      });

      setStatistics(allStats);
    } catch (error) {
      console.error('Error loading statistics:', error);
      announce('Gagal memuat data statistik');
    }
  };

  const handleSave = async (stat: LandingStatistic) => {
    if (!isMounted) return;

    setSaving(true);
    triggerHaptic('loading');
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const payload = {
        stat_type: stat.stat_type,
        label_id: stat.label_id,
        label_en: stat.label_en,
        value: stat.value,
        icon_name: stat.icon_name,
        description: stat.description,
        order_index: stat.order_index,
        is_active: stat.is_active,
        updated_by: user.id,
      };

      if (stat.id) {
        const { error } = await supabase
          .from('landing_statistics')
          .update(payload)
          .eq('id', stat.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('landing_statistics')
          .insert({
            ...payload,
            created_by: user.id,
          });

        if (error) throw error;
      }

      triggerHaptic('apply-success');
      announce('Statistik berhasil disimpan');
      await loadStatistics();
    } catch (error: any) {
      console.error('Error saving statistic:', error);
      announce(`Gagal menyimpan: ${error.message}`);
      triggerHaptic('error');
    } finally {
      setSaving(false);
    }
  };

  const updateStat = (index: number, field: keyof LandingStatistic, value: any) => {
    const updated = [...statistics];
    updated[index] = { ...updated[index], [field]: value };
    setStatistics(updated);
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
        <h1 className="text-3xl font-bold mb-2">Kelola Statistik</h1>
        <p className="text-muted-foreground">
          Kelola statistik yang ditampilkan di landing page
        </p>
      </div>

      <div className="space-y-8">
        {statistics.map((stat, index) => (
          <div key={stat.stat_type} className="bg-card rounded-lg p-6 shadow-md space-y-4">
            <h2 className="text-xl font-semibold">{stat.label_id}</h2>
            
            <AccessibleInput
              label="Label (Bahasa Indonesia)"
              value={stat.label_id}
              onChange={(e) => updateStat(index, 'label_id', e.target.value)}
              required
            />

            <AccessibleInput
              label="Label (English)"
              value={stat.label_en}
              onChange={(e) => updateStat(index, 'label_en', e.target.value)}
              required
            />

            <AccessibleInput
              label="Nilai"
              type="number"
              value={stat.value.toString()}
              onChange={(e) => updateStat(index, 'value', parseInt(e.target.value) || 0)}
              required
            />

            <AccessibleInput
              label="Nama Icon"
              value={stat.icon_name || ''}
              onChange={(e) => updateStat(index, 'icon_name', e.target.value)}
              description="users, briefcase, atau building"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium">Deskripsi</label>
              <textarea
                value={stat.description || ''}
                onChange={(e) => updateStat(index, 'description', e.target.value)}
                className="w-full min-h-[48px] px-4 py-2 border rounded-lg bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                rows={2}
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 min-h-[48px]">
                <input
                  type="checkbox"
                  checked={stat.is_active}
                  onChange={(e) => updateStat(index, 'is_active', e.target.checked)}
                  className="w-5 h-5"
                />
                <span>Aktif</span>
              </label>
            </div>

            <AccessibleButton
              onClick={() => handleSave(stat)}
              disabled={saving || !stat.label_id || !stat.label_en}
              announcementText="Menyimpan statistik"
            >
              <Save className="w-4 h-4 mr-2" aria-hidden="true" />
              {saving ? 'Menyimpan...' : 'Simpan'}
            </AccessibleButton>
          </div>
        ))}
      </div>
    </div>
  );
}
