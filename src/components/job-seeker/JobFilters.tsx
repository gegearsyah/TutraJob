/**
 * Job Filters Component
 * Filter jobs by location, salary, accessibility, etc.
 */

'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Accessibility, Mic, MicOff } from 'lucide-react';
import { FocusAnnouncement } from '@/components/accessibility/FocusAnnouncement';
import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';
import { useVoiceFilters } from '@/hooks/useVoiceFilters';
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

// Helper components to ensure hooks are always called in the same order
interface FilterButtonProps {
  label: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
  context?: string;
}

function FilterButton({ label, description, isSelected, onClick, context }: FilterButtonProps) {
  const buttonProps = useFocusAnnouncement({
    description,
    label,
    context: context || (isSelected ? 'Tekan Enter untuk menonaktifkan' : 'Tekan Enter untuk mengaktifkan'),
    announceOnFocus: true,
    announceOnLongPress: true,
  });

  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 text-sm rounded-lg border transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isSelected
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-background border-border hover:bg-muted'
      )}
      aria-pressed={isSelected}
      {...buttonProps}
    >
      {label}
    </button>
  );
}

interface ToggleFilterButtonProps {
  isExpanded: boolean;
  onClick: () => void;
}

function ToggleFilterButton({ isExpanded, onClick }: ToggleFilterButtonProps) {
  const buttonProps = useFocusAnnouncement({
    description: `${isExpanded ? 'Sembunyikan' : 'Tampilkan'} panel filter lanjutan. Panel ini berisi filter untuk lokasi, gaji, tingkat aksesibilitas, dan tipe kerja.`,
    label: isExpanded ? 'Sembunyikan Filter' : 'Tampilkan Filter',
    context: 'Tekan Enter untuk membuka atau menutup panel filter',
    announceOnFocus: true,
    announceOnLongPress: true,
  });

  return (
    <button
      onClick={onClick}
      className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-expanded={isExpanded}
      {...buttonProps}
    >
      {isExpanded ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
    </button>
  );
}

interface VoiceFilterButtonProps {
  isListening: boolean;
  isSupported: boolean;
  onClick: () => void;
}

function VoiceFilterButton({ isListening, isSupported, onClick }: VoiceFilterButtonProps) {
  // Always call hook, even if component won't render
  const buttonProps = useFocusAnnouncement({
    description: isListening
      ? 'Mendengarkan perintah suara. Ucapkan perintah filter seperti "Tampilkan pekerjaan remote" atau "Tampilkan pekerjaan dengan aksesibilitas tinggi". Tekan lagi untuk berhenti.'
      : 'Aktifkan filter suara. Tekan tombol ini dan ucapkan perintah filter seperti "Tampilkan pekerjaan remote" atau "Tampilkan pekerjaan di Jakarta".',
    label: isListening ? 'Berhenti Mendengarkan' : 'Filter Suara',
    context: isListening ? 'Tekan Enter untuk berhenti mendengarkan' : 'Tekan Enter untuk mulai mendengarkan perintah suara',
    announceOnFocus: true,
    announceOnLongPress: true,
  });

  // Conditionally render, but hook is always called
  if (!isSupported) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 text-sm border border-border rounded-lg transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring flex items-center gap-2',
        isListening
          ? 'bg-red-500/10 border-red-500 text-red-600 hover:bg-red-500/20'
          : 'bg-background hover:bg-muted'
      )}
      aria-pressed={isListening}
      {...buttonProps}
    >
      {isListening ? (
        <>
          <MicOff className="w-4 h-4" />
          <span>Berhenti</span>
        </>
      ) : (
        <>
          <Mic className="w-4 h-4" />
          <span>Filter Suara</span>
        </>
      )}
    </button>
  );
}

interface ClearFiltersButtonProps {
  onClick: () => void;
}

function ClearFiltersButton({ onClick }: ClearFiltersButtonProps) {
  const buttonProps = useFocusAnnouncement({
    description: 'Hapus semua filter yang telah diaktifkan. Setelah dihapus, semua pekerjaan akan ditampilkan kembali tanpa filter.',
    label: 'Hapus Semua Filter',
    context: 'Tekan Enter untuk menghapus semua filter',
    announceOnFocus: true,
    announceOnLongPress: true,
  });

  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      {...buttonProps}
    >
      Hapus Semua Filter
    </button>
  );
}

export function JobFilters({ onFilterChange, className }: JobFiltersProps) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    location: [],
    salaryMin: null,
    salaryMax: null,
    accessibilityLevel: [],
    workArrangement: [],
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Voice filters integration
  const {
    isListening,
    isSupported,
    error: voiceError,
    toggleListening,
  } = useVoiceFilters(onFilterChange, filters);

  // Sync filters when they change externally
  useEffect(() => {
    // This effect ensures filters are in sync
  }, [filters]);

  const locations = [
    'Jakarta Pusat',
    'Jakarta Selatan',
    'Jakarta Barat',
    'Jakarta Utara',
    'Jakarta Timur',
  ];

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      search: '',
      location: [],
      salaryMin: null,
      salaryMax: null,
      accessibilityLevel: [],
      workArrangement: [],
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  // Count active filters
  const activeFilterCount = 
    filters.location.length +
    filters.accessibilityLevel.length +
    filters.workArrangement.length +
    (filters.salaryMin ? 1 : 0) +
    (filters.salaryMax ? 1 : 0);

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
          className="w-full min-h-[48px] pl-12 pr-4 py-2 text-base border border-input rounded-lg bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Cari pekerjaan"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Mobile: Filter button with count badge */}
        <button
          onClick={() => {
            setIsExpanded(!isExpanded);
            setIsMobileFilterOpen(!isMobileFilterOpen);
          }}
          className="md:hidden relative px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring flex items-center gap-2"
          aria-label={`Filter - ${activeFilterCount} filter aktif`}
        >
          Filter
          {activeFilterCount > 0 && (
            <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Desktop: Toggle button */}
        <div className="hidden md:block">
          <ToggleFilterButton
            isExpanded={isExpanded}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        </div>

        {/* Voice Filter Button - Always render component to ensure hook is called */}
        <VoiceFilterButton
          isListening={isListening}
          isSupported={isSupported}
          onClick={toggleListening}
        />

        {/* Voice Error Message */}
        {voiceError && (
          <div
            className="px-4 py-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg"
            role="alert"
            aria-live="polite"
          >
            {voiceError}
          </div>
        )}
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
                return (
                  <FilterButton
                    key={location}
                    label={location}
                    description={`Filter lokasi: ${location}. ${isSelected ? 'Filter ini aktif. Tekan untuk menonaktifkan.' : 'Filter ini tidak aktif. Tekan untuk mengaktifkan filter lokasi ini.'}`}
                    isSelected={isSelected}
                    onClick={() => {
                      const newLocations = filters.location.includes(location)
                        ? filters.location.filter((l) => l !== location)
                        : [...filters.location, location];
                      updateFilter('location', newLocations);
                    }}
                  />
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
                return (
                  <FilterButton
                    key={level}
                    label={labels[level]}
                    description={`Filter tingkat aksesibilitas: ${labels[level]}. ${isSelected ? 'Filter ini aktif. Tekan untuk menonaktifkan.' : 'Filter ini tidak aktif. Tekan untuk mengaktifkan filter aksesibilitas ' + labels[level] + '.'}`}
                    isSelected={isSelected}
                    onClick={() => {
                      const newLevels = filters.accessibilityLevel.includes(level)
                        ? filters.accessibilityLevel.filter((l) => l !== level)
                        : [...filters.accessibilityLevel, level];
                      updateFilter('accessibilityLevel', newLevels);
                    }}
                  />
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
                return (
                  <FilterButton
                    key={arrangement}
                    label={labels[arrangement]}
                    description={`Filter tipe kerja: ${labels[arrangement]}. ${descriptions[arrangement]}. ${isSelected ? 'Filter ini aktif. Tekan untuk menonaktifkan.' : 'Filter ini tidak aktif. Tekan untuk mengaktifkan filter tipe kerja ' + labels[arrangement] + '.'}`}
                    isSelected={isSelected}
                    onClick={() => {
                      const newArrangements = filters.workArrangement.includes(arrangement)
                        ? filters.workArrangement.filter((a) => a !== arrangement)
                        : [...filters.workArrangement, arrangement];
                      updateFilter('workArrangement', newArrangements);
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Clear Filters */}
          <ClearFiltersButton
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
          />
        </div>
      )}
    </div>
  );
}
