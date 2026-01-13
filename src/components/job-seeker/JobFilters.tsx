/**
 * Job Filters Component
 * Filter jobs by location, salary, accessibility, etc.
 */

'use client';

import { useState } from 'react';
import { Search, MapPin, DollarSign, Accessibility } from 'lucide-react';
import { FocusAnnouncement } from '@/components/accessibility/FocusAnnouncement';
import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';
import { cn } from '@/lib/utils';

interface JobFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  className?: string;
}

export interface FilterState {
  search: string;
  location: string[];
  salaryMin: number | null;
  salaryMax: number | null;
  accessibilityLevel: ('high' | 'medium' | 'low')[];
  workArrangement: ('remote' | 'hybrid' | 'on-site')[];
}

export function JobFilters({ onFilterChange, className }: JobFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    location: [],
    salaryMin: null,
    salaryMax: null,
    accessibilityLevel: [],
    workArrangement: [],
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const locations = [
    'Jakarta Pusat',
    'Jakarta Selatan',
    'Jakarta Barat',
    'Jakarta Utara',
    'Jakarta Timur',
  ];

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari pekerjaan, perusahaan, atau skill..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="w-full min-h-[48px] pl-12 pr-4 py-2 border border-input rounded-lg bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Cari pekerjaan"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {(() => {
          const toggleButtonProps = useFocusAnnouncement({
            description: `${isExpanded ? 'Sembunyikan' : 'Tampilkan'} panel filter lanjutan. Panel ini berisi filter untuk lokasi, gaji, tingkat aksesibilitas, dan tipe kerja.`,
            label: isExpanded ? 'Sembunyikan Filter' : 'Tampilkan Filter',
            context: 'Tekan Enter untuk membuka atau menutup panel filter',
            announceOnFocus: true,
            announceOnLongPress: true,
          });

          return (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-expanded={isExpanded}
              {...toggleButtonProps}
            >
              {isExpanded ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
            </button>
          );
        })()}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-4 border border-border rounded-lg bg-card space-y-4">
          {/* Location Filter */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-medium">
              <MapPin className="w-4 h-4" />
              Lokasi
            </label>
            <div className="flex flex-wrap gap-2">
              {locations.map((location) => {
                const isSelected = filters.location.includes(location);
                const locationButtonProps = useFocusAnnouncement({
                  description: `Filter lokasi: ${location}. ${isSelected ? 'Filter ini aktif. Tekan untuk menonaktifkan.' : 'Filter ini tidak aktif. Tekan untuk mengaktifkan filter lokasi ini.'}`,
                  label: `Filter ${location}`,
                  context: isSelected ? 'Tekan Enter untuk menonaktifkan' : 'Tekan Enter untuk mengaktifkan',
                  announceOnFocus: true,
                  announceOnLongPress: true,
                });

                return (
                  <button
                    key={location}
                    onClick={() => {
                      const newLocations = filters.location.includes(location)
                        ? filters.location.filter((l) => l !== location)
                        : [...filters.location, location];
                      updateFilter('location', newLocations);
                    }}
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-lg border transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border hover:bg-muted'
                    )}
                    aria-pressed={isSelected}
                    {...locationButtonProps}
                  >
                    {location}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Salary Filter */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-medium">
              <DollarSign className="w-4 h-4" />
              Rentang Gaji (Rupiah)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="salaryMin" className="block text-sm mb-1">
                  Minimum
                </label>
                <input
                  id="salaryMin"
                  type="number"
                  placeholder="0"
                  value={filters.salaryMin || ''}
                  onChange={(e) =>
                    updateFilter('salaryMin', e.target.value ? Number(e.target.value) : null)
                  }
                  className="w-full min-h-[48px] px-4 py-2 border border-input rounded-lg bg-background"
                />
              </div>
              <div>
                <label htmlFor="salaryMax" className="block text-sm mb-1">
                  Maksimum
                </label>
                <input
                  id="salaryMax"
                  type="number"
                  placeholder="Tidak terbatas"
                  value={filters.salaryMax || ''}
                  onChange={(e) =>
                    updateFilter('salaryMax', e.target.value ? Number(e.target.value) : null)
                  }
                  className="w-full min-h-[48px] px-4 py-2 border border-input rounded-lg bg-background"
                />
              </div>
            </div>
          </div>

          {/* Accessibility Level */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-medium">
              <Accessibility className="w-4 h-4" />
              Tingkat Aksesibilitas
            </label>
            <div className="flex flex-wrap gap-2">
              {(['high', 'medium', 'low'] as const).map((level) => {
                const labels = { high: 'Tinggi', medium: 'Sedang', low: 'Rendah' };
                const isSelected = filters.accessibilityLevel.includes(level);
                const levelButtonProps = useFocusAnnouncement({
                  description: `Filter tingkat aksesibilitas: ${labels[level]}. ${isSelected ? 'Filter ini aktif. Tekan untuk menonaktifkan.' : 'Filter ini tidak aktif. Tekan untuk mengaktifkan filter aksesibilitas ' + labels[level] + '.'}`,
                  label: `Filter Aksesibilitas ${labels[level]}`,
                  context: isSelected ? 'Tekan Enter untuk menonaktifkan' : 'Tekan Enter untuk mengaktifkan',
                  announceOnFocus: true,
                  announceOnLongPress: true,
                });

                return (
                  <button
                    key={level}
                    onClick={() => {
                      const newLevels = filters.accessibilityLevel.includes(level)
                        ? filters.accessibilityLevel.filter((l) => l !== level)
                        : [...filters.accessibilityLevel, level];
                      updateFilter('accessibilityLevel', newLevels);
                    }}
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-lg border transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border hover:bg-muted'
                    )}
                    aria-pressed={isSelected}
                    {...levelButtonProps}
                  >
                    {labels[level]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Work Arrangement */}
          <div>
            <label className="block mb-2 font-medium">Tipe Kerja</label>
            <div className="flex flex-wrap gap-2">
              {(['remote', 'hybrid', 'on-site'] as const).map((arrangement) => {
                const labels = {
                  remote: 'Remote',
                  hybrid: 'Hybrid',
                  'on-site': 'On-site',
                };
                const descriptions = {
                  remote: 'Kerja dari jarak jauh, tidak perlu datang ke kantor',
                  hybrid: 'Kombinasi kerja dari rumah dan di kantor',
                  'on-site': 'Kerja di kantor, harus datang setiap hari',
                };
                const isSelected = filters.workArrangement.includes(arrangement);
                const arrangementButtonProps = useFocusAnnouncement({
                  description: `Filter tipe kerja: ${labels[arrangement]}. ${descriptions[arrangement]}. ${isSelected ? 'Filter ini aktif. Tekan untuk menonaktifkan.' : 'Filter ini tidak aktif. Tekan untuk mengaktifkan filter tipe kerja ' + labels[arrangement] + '.'}`,
                  label: `Filter ${labels[arrangement]}`,
                  context: isSelected ? 'Tekan Enter untuk menonaktifkan' : 'Tekan Enter untuk mengaktifkan',
                  announceOnFocus: true,
                  announceOnLongPress: true,
                });

                return (
                  <button
                    key={arrangement}
                    onClick={() => {
                      const newArrangements = filters.workArrangement.includes(arrangement)
                        ? filters.workArrangement.filter((a) => a !== arrangement)
                        : [...filters.workArrangement, arrangement];
                      updateFilter('workArrangement', newArrangements);
                    }}
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-lg border transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border hover:bg-muted'
                    )}
                    aria-pressed={isSelected}
                    {...arrangementButtonProps}
                  >
                    {labels[arrangement]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clear Filters */}
          {(() => {
            const clearButtonProps = useFocusAnnouncement({
              description: 'Hapus semua filter yang telah diaktifkan. Setelah dihapus, semua pekerjaan akan ditampilkan kembali tanpa filter.',
              label: 'Hapus Semua Filter',
              context: 'Tekan Enter untuk menghapus semua filter',
              announceOnFocus: true,
              announceOnLongPress: true,
            });

            return (
              <button
                onClick={() => {
                  const clearedFilters: FilterState = {
                    search: '',
                    location: [],
                    salaryMin: null,
                    salaryMax: null,
                    accessibilityLevel: [],
                    workArrangement: [],
                  };
                  setFilters(clearedFilters);
                  onFilterChange(clearedFilters);
                }}
                className="w-full px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...clearButtonProps}
              >
                Hapus Semua Filter
              </button>
            );
          })()}
        </div>
      )}
    </div>
  );
}
