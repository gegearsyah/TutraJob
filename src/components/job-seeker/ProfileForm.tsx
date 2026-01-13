/**
 * User Profile Form Component
 * Accessible form for users to input their skills, data, and upload CV
 * Based on FEATURE_SPECIFICATION.md Section 2.6
 */

'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileFormSchema, type ProfileFormData } from '@/lib/validations/profile';
import { uploadCV } from '@/lib/supabase/storage';
import { triggerHaptic } from '@/lib/haptic';
import { announce } from '@/lib/audio';
import { useAccessibleForm } from '@/hooks/useAccessibleForm';
import { profileFormFieldDescriptions } from '@/lib/form-descriptions/profile-form';
import { AccessibleInput } from '@/components/forms/AccessibleInput';
import { cn } from '@/lib/utils';
import { Upload, Plus, X, Loader2 } from 'lucide-react';

interface ProfileFormProps {
  userId?: string;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  initialData?: Partial<ProfileFormData>;
  className?: string;
}

export function ProfileForm({
  userId,
  onSubmit,
  initialData,
  className,
}: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [cvFileName, setCvFileName] = useState<string>('');

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialData || {
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        address: {
          street: '',
          city: '',
          postalCode: '',
        },
        dateOfBirth: undefined,
        nationalId: '',
      },
      professionalInfo: {
        coverLetter: '',
        workExperience: [],
        education: [],
        skills: [],
        certifications: [],
      },
      accessibility: {
        disabilityType: '',
        accommodations: [],
        assistiveTech: [],
      },
      preferences: {
        preferredSalary: {
          min: 0,
          max: 0,
        },
        preferredLocation: [],
        workArrangement: 'hybrid',
      },
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = form;

  // Enhanced accessibility features
  const {
    handleFieldFocus,
    handleFieldBlur,
    navigateToFirstError,
    announceValidationSummary,
  } = useAccessibleForm({
    form,
    fieldDescriptions: profileFormFieldDescriptions,
    autoNavigateOnError: true,
    announceOnFocus: true,
    announceOnBlur: true,
  });

  const {
    fields: workExperienceFields,
    append: appendWorkExperience,
    remove: removeWorkExperience,
  } = useFieldArray({
    control,
    name: 'professionalInfo.workExperience',
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: 'professionalInfo.education',
  });

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCvFileName(file.name);
    setValue('cvFile', file);

    // Announce file selection
    announce(`File CV dipilih: ${file.name}`);
    triggerHaptic('confirmation');
  };

  const onFormSubmit = async (data: ProfileFormData) => {
    // Validate and announce errors before submitting
    const isValid = await form.trigger();
    
    if (!isValid) {
      // Announce validation summary
      announceValidationSummary();
      // Auto-navigate to first error
      navigateToFirstError();
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Upload CV if provided
      if (data.cvFile && userId) {
        setUploadProgress(25);
        await uploadCV(data.cvFile, userId);
        setUploadProgress(50);
      }

      setUploadProgress(75);
      await onSubmit(data);
      setUploadProgress(100);

      triggerHaptic('apply-success');
      announce('Profil berhasil disimpan');
    } catch (error) {
      triggerHaptic('error');
      announce('Terjadi kesalahan saat menyimpan profil');
      console.error('Profile submission error:', error);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const commonSkills = [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Python',
    'Java',
    'SQL',
    'Git',
    'Agile',
    'Communication',
    'Problem Solving',
    'Teamwork',
  ];

  const disabilityTypes = [
    'Visual Impairment (Tunanetra)',
    'Hearing Impairment (Tunarungu)',
    'Physical Disability',
    'Other',
  ];

  const assistiveTechOptions = [
    'JAWS Screen Reader',
    'NVDA Screen Reader',
    'VoiceOver',
    'TalkBack',
    'Braille Display',
    'Voice Recognition Software',
  ];

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className={cn('space-y-8', className)}
      aria-label="Form profil pengguna"
    >
      {/* Personal Information Section */}
      <section aria-labelledby="personal-info-heading">
        <h2
          id="personal-info-heading"
          className="text-2xl font-bold mb-4"
        >
          Informasi Pribadi
        </h2>
        <div className="space-y-4">
          <AccessibleInput
            label="Nama Lengkap"
            description="Masukkan nama lengkap Anda sesuai dengan identitas resmi"
            required
            example="Contoh: Budi Santoso"
            type="text"
            {...register('personalInfo.fullName')}
            onFocus={() => handleFieldFocus('personalInfo.fullName')}
            onBlur={() => handleFieldBlur('personalInfo.fullName')}
            error={errors.personalInfo?.fullName?.message}
            id="fullName"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AccessibleInput
              label="Email"
              description="Masukkan alamat email aktif Anda untuk komunikasi"
              required
              format="email format"
              example="contoh@email.com"
              type="email"
              {...register('personalInfo.email')}
              onFocus={() => handleFieldFocus('personalInfo.email')}
              onBlur={() => handleFieldBlur('personalInfo.email')}
              error={errors.personalInfo?.email?.message}
              id="email"
            />

            <AccessibleInput
              label="Nomor Telepon"
              description="Masukkan nomor telepon yang dapat dihubungi"
              required
              format="Minimal 10 digit"
              example="081234567890"
              type="tel"
            {...register('personalInfo.phone')}
            onFocus={() => handleFieldFocus('personalInfo.phone')}
            onBlur={() => handleFieldBlur('personalInfo.phone')}
              error={errors.personalInfo?.phone?.message}
              id="phone"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium mb-2"
            >
              Alamat Lengkap *
            </label>
            <input
              id="address"
              type="text"
              {...register('personalInfo.address.street')}
              className={cn(
                'w-full min-h-[48px] px-4 py-2 border border-input rounded-lg bg-background',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                errors.personalInfo?.address?.street && 'border-destructive'
              )}
              placeholder="Jl. Contoh No. 123"
              aria-invalid={!!errors.personalInfo?.address?.street}
            />
            {errors.personalInfo?.address?.street && (
              <p className="mt-1 text-sm text-destructive" role="alert">
                {errors.personalInfo.address.street.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium mb-2"
              >
                Kota *
              </label>
              <input
                id="city"
                type="text"
                {...register('personalInfo.address.city')}
                className={cn(
                  'w-full min-h-[48px] px-4 py-2 border border-input rounded-lg bg-background',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  errors.personalInfo?.address?.city && 'border-destructive'
                )}
                aria-invalid={!!errors.personalInfo?.address?.city}
              />
            </div>

            <div>
              <label
                htmlFor="postalCode"
                className="block text-sm font-medium mb-2"
              >
                Kode Pos *
              </label>
              <input
                id="postalCode"
                type="text"
                {...register('personalInfo.address.postalCode')}
                className={cn(
                  'w-full min-h-[48px] px-4 py-2 border border-input rounded-lg bg-background',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  errors.personalInfo?.address?.postalCode && 'border-destructive'
                )}
                aria-invalid={!!errors.personalInfo?.address?.postalCode}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium mb-2"
              >
                Tanggal Lahir *
              </label>
              <input
                id="dateOfBirth"
                type="date"
                {...register('personalInfo.dateOfBirth', {
                  valueAsDate: true,
                })}
                className={cn(
                  'w-full min-h-[48px] px-4 py-2 border border-input rounded-lg bg-background',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  errors.personalInfo?.dateOfBirth && 'border-destructive'
                )}
                aria-invalid={!!errors.personalInfo?.dateOfBirth}
              />
            </div>

            <div>
              <label
                htmlFor="nationalId"
                className="block text-sm font-medium mb-2"
              >
                NIK (Nomor Induk Kependudukan) *
              </label>
              <input
                id="nationalId"
                type="text"
                {...register('personalInfo.nationalId')}
                className={cn(
                  'w-full min-h-[48px] px-4 py-2 border border-input rounded-lg bg-background',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  errors.personalInfo?.nationalId && 'border-destructive'
                )}
                aria-invalid={!!errors.personalInfo?.nationalId}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Professional Information Section */}
      <section aria-labelledby="professional-info-heading">
        <h2
          id="professional-info-heading"
          className="text-2xl font-bold mb-4"
        >
          Informasi Profesional
        </h2>

        {/* CV Upload */}
        <div className="mb-6">
          <label
            htmlFor="cvFile"
            className="block text-sm font-medium mb-2"
          >
            Upload CV/Resume (PDF atau DOCX) *
          </label>
          <div className="flex items-center gap-4">
            <label
              htmlFor="cvFile"
              className={cn(
                'flex items-center gap-2 px-4 py-3 border border-input rounded-lg cursor-pointer',
                'hover:bg-muted transition-colors min-h-[48px]',
                'focus-within:ring-2 focus-within:ring-ring'
              )}
            >
              <Upload className="w-5 h-5" />
              <span>{cvFileName || 'Pilih File CV'}</span>
              <input
                id="cvFile"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleCVUpload}
                className="sr-only"
                aria-describedby="cvFile-help"
              />
            </label>
            {cvFileName && (
              <button
                type="button"
                onClick={() => {
                  setCvFileName('');
                  setValue('cvFile', undefined);
                }}
                className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"
                aria-label="Hapus file CV"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <p id="cvFile-help" className="mt-2 text-sm text-muted-foreground">
            Maksimal 5MB. Format: PDF, DOC, atau DOCX
          </p>
        </div>

        {/* Cover Letter */}
        <div className="mb-6">
          <label
            htmlFor="coverLetter"
            className="block text-sm font-medium mb-2"
          >
            Surat Lamaran *
          </label>
          <textarea
            id="coverLetter"
            {...register('professionalInfo.coverLetter')}
            rows={6}
            className={cn(
              'w-full min-h-[120px] px-4 py-2 border border-input rounded-lg bg-background',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              errors.professionalInfo?.coverLetter && 'border-destructive'
            )}
            aria-invalid={!!errors.professionalInfo?.coverLetter}
          />
          {errors.professionalInfo?.coverLetter && (
            <p className="mt-1 text-sm text-destructive" role="alert">
              {errors.professionalInfo.coverLetter.message}
            </p>
          )}
        </div>

        {/* Skills */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Skills * (Pilih minimal 1)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {commonSkills.map((skill) => (
              <label
                key={skill}
                className="flex items-center gap-2 p-3 border border-input rounded-lg cursor-pointer hover:bg-muted transition-colors"
              >
                <input
                  type="checkbox"
                  value={skill}
                  {...register('professionalInfo.skills')}
                  className="w-5 h-5"
                />
                <span>{skill}</span>
              </label>
            ))}
          </div>
          <input
            type="text"
            placeholder="Tambah skill lain (tekan Enter)"
            className="mt-4 w-full min-h-[48px] px-4 py-2 border border-input rounded-lg bg-background"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const value = e.currentTarget.value.trim();
                if (value) {
                  const currentSkills = watch('professionalInfo.skills') || [];
                  setValue('professionalInfo.skills', [...currentSkills, value]);
                  e.currentTarget.value = '';
                }
              }
            }}
          />
          {errors.professionalInfo?.skills && (
            <p className="mt-1 text-sm text-destructive" role="alert">
              {errors.professionalInfo.skills.message}
            </p>
          )}
        </div>

        {/* Work Experience */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium">
              Pengalaman Kerja
            </label>
            <button
              type="button"
              onClick={() =>
                appendWorkExperience({
                  company: '',
                  position: '',
                  startDate: new Date(),
                  current: false,
                  description: '',
                })
              }
              className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 min-h-[48px]"
            >
              <Plus className="w-4 h-4" />
              Tambah Pengalaman
            </button>
          </div>
          {workExperienceFields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-border rounded-lg mb-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Pengalaman {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeWorkExperience(index)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"
                  aria-label={`Hapus pengalaman ${index + 1}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  {...register(`professionalInfo.workExperience.${index}.company`)}
                  placeholder="Nama Perusahaan"
                  className="min-h-[48px] px-4 py-2 border border-input rounded-lg bg-background"
                />
                <input
                  {...register(`professionalInfo.workExperience.${index}.position`)}
                  placeholder="Posisi"
                  className="min-h-[48px] px-4 py-2 border border-input rounded-lg bg-background"
                />
                <input
                  type="date"
                  {...register(`professionalInfo.workExperience.${index}.startDate`, {
                    valueAsDate: true,
                  })}
                  className="min-h-[48px] px-4 py-2 border border-input rounded-lg bg-background"
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register(`professionalInfo.workExperience.${index}.current`)}
                  />
                  <span>Masih bekerja di sini</span>
                </label>
              </div>
              <textarea
                {...register(`professionalInfo.workExperience.${index}.description`)}
                placeholder="Deskripsi pekerjaan"
                rows={3}
                className="w-full min-h-[80px] px-4 py-2 border border-input rounded-lg bg-background"
              />
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium">Pendidikan</label>
            <button
              type="button"
              onClick={() =>
                appendEducation({
                  institution: '',
                  degree: '',
                  field: '',
                  startDate: new Date(),
                  current: false,
                })
              }
              className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 min-h-[48px]"
            >
              <Plus className="w-4 h-4" />
              Tambah Pendidikan
            </button>
          </div>
          {educationFields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-border rounded-lg mb-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Pendidikan {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"
                  aria-label={`Hapus pendidikan ${index + 1}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  {...register(`professionalInfo.education.${index}.institution`)}
                  placeholder="Nama Institusi"
                  className="min-h-[48px] px-4 py-2 border border-input rounded-lg bg-background"
                />
                <input
                  {...register(`professionalInfo.education.${index}.degree`)}
                  placeholder="Gelar"
                  className="min-h-[48px] px-4 py-2 border border-input rounded-lg bg-background"
                />
                <input
                  {...register(`professionalInfo.education.${index}.field`)}
                  placeholder="Bidang Studi"
                  className="min-h-[48px] px-4 py-2 border border-input rounded-lg bg-background"
                />
                <input
                  type="date"
                  {...register(`professionalInfo.education.${index}.startDate`, {
                    valueAsDate: true,
                  })}
                  className="min-h-[48px] px-4 py-2 border border-input rounded-lg bg-background"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Accessibility Section */}
      <section aria-labelledby="accessibility-heading">
        <h2
          id="accessibility-heading"
          className="text-2xl font-bold mb-4"
        >
          Informasi Aksesibilitas
        </h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="disabilityType"
              className="block text-sm font-medium mb-2"
            >
              Jenis Disabilitas *
            </label>
            <select
              id="disabilityType"
              {...register('accessibility.disabilityType')}
              className={cn(
                'w-full min-h-[48px] px-4 py-2 border border-input rounded-lg bg-background',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                errors.accessibility?.disabilityType && 'border-destructive'
              )}
              aria-invalid={!!errors.accessibility?.disabilityType}
            >
              <option value="">Pilih jenis disabilitas</option>
              {disabilityTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Teknologi Asistif yang Digunakan
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {assistiveTechOptions.map((tech) => (
                <label
                  key={tech}
                  className="flex items-center gap-2 p-3 border border-input rounded-lg cursor-pointer hover:bg-muted transition-colors"
                >
                  <input
                    type="checkbox"
                    value={tech}
                    {...register('accessibility.assistiveTech')}
                    className="w-5 h-5"
                  />
                  <span>{tech}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Preferences Section */}
      <section aria-labelledby="preferences-heading">
        <h2
          id="preferences-heading"
          className="text-2xl font-bold mb-4"
        >
          Preferensi Pekerjaan
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="minSalary"
                className="block text-sm font-medium mb-2"
              >
                Gaji Minimal (Rupiah)
              </label>
              <input
                id="minSalary"
                type="number"
                {...register('preferences.preferredSalary.min', {
                  valueAsNumber: true,
                })}
                className="w-full min-h-[48px] px-4 py-2 border border-input rounded-lg bg-background"
              />
            </div>
            <div>
              <label
                htmlFor="maxSalary"
                className="block text-sm font-medium mb-2"
              >
                Gaji Maksimal (Rupiah)
              </label>
              <input
                id="maxSalary"
                type="number"
                {...register('preferences.preferredSalary.max', {
                  valueAsNumber: true,
                })}
                className="w-full min-h-[48px] px-4 py-2 border border-input rounded-lg bg-background"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="workArrangement"
              className="block text-sm font-medium mb-2"
            >
              Preferensi Kerja *
            </label>
            <select
              id="workArrangement"
              {...register('preferences.workArrangement')}
              className="w-full min-h-[48px] px-4 py-2 border border-input rounded-lg bg-background"
            >
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="on-site">On-site</option>
            </select>
          </div>
        </div>
      </section>

      {/* Validation Summary for Screen Readers */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
        id="form-validation-summary"
      />

      {/* Submit Button */}
      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'flex-1 min-h-[48px] px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium',
            'hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          )}
          aria-busy={isSubmitting}
          aria-describedby="form-validation-summary"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin inline" />
              Menyimpan...
            </>
          ) : (
            'Simpan Profil'
          )}
        </button>
      </div>

      {/* Upload Progress */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mt-4">
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
              role="progressbar"
              aria-valuenow={uploadProgress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <p className="mt-2 text-sm text-muted-foreground text-center">
            Mengunggah: {uploadProgress}%
          </p>
        </div>
      )}
    </form>
  );
}
