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
import { useFocusAnnouncement } from '@/hooks/useFocusAnnouncement';
import { FocusAnnouncement } from '@/components/accessibility/FocusAnnouncement';
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
      let cvFilePath: string | undefined = undefined;

      // Upload CV if provided
      if (data.cvFile && userId) {
        setUploadProgress(25);
        const uploadResult = await uploadCV(data.cvFile, userId);
        cvFilePath = uploadResult.path;
        setUploadProgress(50);
        announce(`CV berhasil diunggah: ${data.cvFile.name}`);
      }

      setUploadProgress(75);
      // Pass CV file path to onSubmit
      await onSubmit({ ...data, cvFilePath });
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
        <FocusAnnouncement
          description="Bagian Informasi Pribadi. Di bagian ini, Anda akan mengisi data pribadi seperti nama, email, alamat, tanggal lahir, dan NIK. Semua field yang ditandai dengan tanda bintang adalah wajib diisi."
          label="Bagian Informasi Pribadi"
        >
          <h2
            id="personal-info-heading"
            className="text-2xl font-bold mb-4"
          >
            Informasi Pribadi
          </h2>
        </FocusAnnouncement>
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

          <AccessibleInput
            label="Alamat Lengkap"
            description="Masukkan alamat lengkap tempat tinggal Anda"
            required
            example="Jl. Sudirman No. 123, RT 05 RW 02"
            type="text"
            {...register('personalInfo.address.street')}
            onFocus={() => handleFieldFocus('personalInfo.address.street')}
            onBlur={() => handleFieldBlur('personalInfo.address.street')}
            error={errors.personalInfo?.address?.street?.message}
            id="address"
            placeholder="Jl. Contoh No. 123"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AccessibleInput
              label="Kota"
              description="Masukkan kota tempat tinggal Anda"
              required
              example="Jakarta Pusat"
              type="text"
              {...register('personalInfo.address.city')}
              onFocus={() => handleFieldFocus('personalInfo.address.city')}
              onBlur={() => handleFieldBlur('personalInfo.address.city')}
              error={errors.personalInfo?.address?.city?.message}
              id="city"
            />

            <AccessibleInput
              label="Kode Pos"
              description="Masukkan kode pos alamat Anda"
              required
              format="5 digit"
              example="10220"
              type="text"
              {...register('personalInfo.address.postalCode')}
              onFocus={() => handleFieldFocus('personalInfo.address.postalCode')}
              onBlur={() => handleFieldBlur('personalInfo.address.postalCode')}
              error={errors.personalInfo?.address?.postalCode?.message}
              id="postalCode"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AccessibleInput
              label="Tanggal Lahir"
              description="Pilih tanggal lahir Anda"
              required
              format="DD/MM/YYYY"
              example="01/01/1990"
              type="date"
              {...register('personalInfo.dateOfBirth', {
                valueAsDate: true,
              })}
              onFocus={() => handleFieldFocus('personalInfo.dateOfBirth')}
              onBlur={() => handleFieldBlur('personalInfo.dateOfBirth')}
              error={errors.personalInfo?.dateOfBirth?.message}
              id="dateOfBirth"
            />

            <AccessibleInput
              label="NIK (Nomor Induk Kependudukan)"
              description="Masukkan NIK sesuai KTP Anda"
              required
              format="16 digit"
              example="3201010101900001"
              type="text"
              {...register('personalInfo.nationalId')}
              onFocus={() => handleFieldFocus('personalInfo.nationalId')}
              onBlur={() => handleFieldBlur('personalInfo.nationalId')}
              error={errors.personalInfo?.nationalId?.message}
              id="nationalId"
            />
          </div>
        </div>
      </section>

      {/* Professional Information Section */}
      <section aria-labelledby="professional-info-heading">
        <FocusAnnouncement
          description="Bagian Informasi Profesional. Di bagian ini, Anda akan mengisi informasi tentang CV, surat lamaran, keahlian, pengalaman kerja, dan pendidikan. Bagian ini penting untuk menunjukkan kualifikasi Anda kepada pemberi kerja."
          label="Bagian Informasi Profesional"
        >
          <h2
            id="professional-info-heading"
            className="text-2xl font-bold mb-4"
          >
            Informasi Profesional
          </h2>
        </FocusAnnouncement>

        {/* CV Upload */}
        <div className="mb-6">
          {(() => {
            const cvUploadProps = useFocusAnnouncement({
              description: 'Upload CV atau Resume. Klik untuk memilih file CV Anda dalam format PDF atau DOCX. Maksimal ukuran file 5MB. File CV akan digunakan untuk melamar pekerjaan.',
              label: 'Upload CV atau Resume',
              context: 'Klik untuk memilih file CV',
              announceOnFocus: true,
              announceOnLongPress: true,
            });

            const removeCvProps = useFocusAnnouncement({
              description: 'Hapus file CV yang telah dipilih',
              label: 'Hapus File CV',
              context: 'Klik untuk menghapus file CV',
              announceOnFocus: true,
              announceOnLongPress: true,
            });

            return (
              <>
                <FocusAnnouncement
                  description="Upload CV atau Resume. File CV Anda akan digunakan saat melamar pekerjaan. Format yang didukung: PDF, DOC, atau DOCX. Maksimal ukuran 5MB."
                  label="Upload CV"
                >
                  <label
                    htmlFor="cvFile"
                    className="block text-sm font-medium mb-2"
                  >
                    Upload CV/Resume (PDF atau DOCX) *
                  </label>
                </FocusAnnouncement>
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="cvFile"
                    className={cn(
                      'flex items-center gap-2 px-4 py-3 border border-input rounded-lg cursor-pointer',
                      'hover:bg-muted transition-colors min-h-[48px]',
                      'focus-within:ring-2 focus-within:ring-ring'
                    )}
                    {...cvUploadProps}
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
                        announce('File CV dihapus');
                        triggerHaptic('dismiss');
                      }}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg min-h-[48px] min-w-[48px] flex items-center justify-center"
                      aria-label="Hapus file CV"
                      {...removeCvProps}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <p id="cvFile-help" className="mt-2 text-sm text-muted-foreground">
                  Maksimal 5MB. Format: PDF, DOC, atau DOCX
                </p>
              </>
            );
          })()}
        </div>

        {/* Cover Letter */}
        <div className="mb-6">
          <FocusAnnouncement
            description="Surat Lamaran. Tulis surat lamaran yang menjelaskan mengapa Anda cocok untuk posisi yang dilamar. Minimal 50 karakter. Field ini wajib diisi."
            label="Surat Lamaran"
          >
            <label
              htmlFor="coverLetter"
              className="block text-sm font-medium mb-2"
            >
              Surat Lamaran *
            </label>
          </FocusAnnouncement>
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
            aria-describedby="coverLetter-description coverLetter-error"
            onFocus={() => {
              handleFieldFocus('professionalInfo.coverLetter');
              announce('Field Surat Lamaran. Tulis surat lamaran yang menjelaskan mengapa Anda cocok untuk posisi yang dilamar. Minimal 50 karakter. Field ini wajib diisi.');
            }}
            onBlur={() => handleFieldBlur('professionalInfo.coverLetter')}
          />
          <p id="coverLetter-description" className="sr-only">
            Tulis surat lamaran yang menjelaskan mengapa Anda cocok untuk posisi yang dilamar. Minimal 50 karakter.
          </p>
          {errors.professionalInfo?.coverLetter && (
            <p id="coverLetter-error" className="mt-1 text-sm text-destructive" role="alert">
              {errors.professionalInfo.coverLetter.message}
            </p>
          )}
        </div>

        {/* Skills */}
        <div className="mb-6">
          <FocusAnnouncement
            description="Keahlian atau Skills. Pilih minimal 1 keahlian yang Anda kuasai. Anda dapat memilih beberapa keahlian dengan mencentang checkbox. Field ini wajib diisi."
            label="Keahlian"
          >
            <label className="block text-sm font-medium mb-2">
              Skills * (Pilih minimal 1)
            </label>
          </FocusAnnouncement>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {commonSkills.map((skill) => {
              const skillChecked = watch('professionalInfo.skills')?.includes(skill);
              return (
                <label
                  key={skill}
                  className="flex items-center gap-2 p-3 border border-input rounded-lg cursor-pointer hover:bg-muted transition-colors min-h-[48px]"
                  onFocus={() => {
                    announce(`Checkbox keahlian ${skill}. ${skillChecked ? 'Terpilih' : 'Tidak terpilih'}. Tekan Space untuk memilih atau membatalkan.`);
                  }}
                >
                  <input
                    type="checkbox"
                    value={skill}
                    {...register('professionalInfo.skills')}
                    className="w-5 h-5"
                    onChange={(e) => {
                      const currentSkills = watch('professionalInfo.skills') || [];
                      if (e.target.checked) {
                        setValue('professionalInfo.skills', [...currentSkills, skill]);
                        announce(`${skill} ditambahkan ke daftar keahlian`);
                        triggerHaptic('confirmation');
                      } else {
                        setValue('professionalInfo.skills', currentSkills.filter(s => s !== skill));
                        announce(`${skill} dihapus dari daftar keahlian`);
                        triggerHaptic('dismiss');
                      }
                    }}
                  />
                  <span>{skill}</span>
                </label>
              );
            })}
          </div>
          <AccessibleInput
            label="Tambah Skill Lain"
            description="Masukkan skill yang tidak ada di daftar, lalu tekan Enter untuk menambahkan"
            example="Contoh: Machine Learning"
            type="text"
            placeholder="Tambah skill lain (tekan Enter)"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const value = e.currentTarget.value.trim();
                if (value) {
                  const currentSkills = watch('professionalInfo.skills') || [];
                  setValue('professionalInfo.skills', [...currentSkills, value]);
                  e.currentTarget.value = '';
                  announce(`Skill ${value} ditambahkan ke daftar keahlian`);
                  triggerHaptic('confirmation');
                }
              }
            }}
            onFocus={() => {
              announce('Field tambah skill lain. Masukkan skill yang tidak ada di daftar, lalu tekan Enter untuk menambahkan.');
            }}
            id="customSkill"
          />
          {errors.professionalInfo?.skills && (
            <p className="mt-1 text-sm text-destructive" role="alert">
              {errors.professionalInfo.skills.message}
            </p>
          )}
        </div>

        {/* Work Experience */}
        <div className="mb-6">
          <FocusAnnouncement
            description="Pengalaman Kerja. Di bagian ini, Anda dapat menambahkan pengalaman kerja Anda. Klik tombol Tambah Pengalaman untuk menambahkan entri baru. Setiap entri memerlukan nama perusahaan, posisi, tanggal mulai, dan deskripsi pekerjaan."
            label="Pengalaman Kerja"
          >
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium">
                Pengalaman Kerja
              </label>
              {(() => {
                const addWorkExpProps = useFocusAnnouncement({
                  description: 'Tambah entri pengalaman kerja baru. Setelah diklik, form baru akan muncul untuk mengisi detail pengalaman kerja.',
                  label: 'Tambah Pengalaman',
                  context: 'Klik untuk menambahkan pengalaman kerja',
                  announceOnFocus: true,
                  announceOnLongPress: true,
                });

                return (
                  <button
                    type="button"
                    onClick={() => {
                      appendWorkExperience({
                        company: '',
                        position: '',
                        startDate: new Date(),
                        current: false,
                        description: '',
                      });
                      announce('Form pengalaman kerja baru ditambahkan');
                      triggerHaptic('confirmation');
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 min-h-[48px]"
                    {...addWorkExpProps}
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Pengalaman
                  </button>
                );
              })()}
            </div>
          </FocusAnnouncement>
          {workExperienceFields.map((field, index) => {
            const removeWorkExpProps = useFocusAnnouncement({
              description: `Hapus pengalaman kerja nomor ${index + 1}`,
              label: `Hapus Pengalaman ${index + 1}`,
              context: 'Klik untuk menghapus entri ini',
              announceOnFocus: true,
              announceOnLongPress: true,
            });

            return (
              <div
                key={field.id}
                className="p-4 border border-border rounded-lg mb-4 space-y-4"
              >
                <FocusAnnouncement
                  description={`Pengalaman Kerja nomor ${index + 1}. Isi nama perusahaan, posisi, tanggal mulai, dan deskripsi pekerjaan. Centang "Masih bekerja di sini" jika Anda masih bekerja di perusahaan ini.`}
                  label={`Pengalaman ${index + 1}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Pengalaman {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => {
                        removeWorkExperience(index);
                        announce(`Pengalaman kerja nomor ${index + 1} dihapus`);
                        triggerHaptic('dismiss');
                      }}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg min-h-[48px] min-w-[48px] flex items-center justify-center"
                      aria-label={`Hapus pengalaman ${index + 1}`}
                      {...removeWorkExpProps}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </FocusAnnouncement>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AccessibleInput
                    label={`Nama Perusahaan - Pengalaman ${index + 1}`}
                    description="Masukkan nama perusahaan tempat Anda bekerja"
                    required
                    example="PT Teknologi Indonesia"
                    type="text"
                    {...register(`professionalInfo.workExperience.${index}.company`)}
                    onFocus={() => handleFieldFocus(`professionalInfo.workExperience.${index}.company`)}
                    onBlur={() => handleFieldBlur(`professionalInfo.workExperience.${index}.company`)}
                    placeholder="Nama Perusahaan"
                    id={`workExp-${index}-company`}
                  />
                  <AccessibleInput
                    label={`Posisi - Pengalaman ${index + 1}`}
                    description="Masukkan posisi atau jabatan Anda"
                    required
                    example="Software Developer"
                    type="text"
                    {...register(`professionalInfo.workExperience.${index}.position`)}
                    onFocus={() => handleFieldFocus(`professionalInfo.workExperience.${index}.position`)}
                    onBlur={() => handleFieldBlur(`professionalInfo.workExperience.${index}.position`)}
                    placeholder="Posisi"
                    id={`workExp-${index}-position`}
                  />
                  <AccessibleInput
                    label={`Tanggal Mulai - Pengalaman ${index + 1}`}
                    description="Pilih tanggal mulai bekerja"
                    required
                    format="DD/MM/YYYY"
                    type="date"
                    {...register(`professionalInfo.workExperience.${index}.startDate`, {
                      valueAsDate: true,
                    })}
                    onFocus={() => handleFieldFocus(`professionalInfo.workExperience.${index}.startDate`)}
                    onBlur={() => handleFieldBlur(`professionalInfo.workExperience.${index}.startDate`)}
                    id={`workExp-${index}-startDate`}
                  />
                  <label className="flex items-center gap-2 min-h-[48px] p-2 border border-input rounded-lg hover:bg-muted cursor-pointer"
                    onFocus={() => {
                      const isCurrent = watch(`professionalInfo.workExperience.${index}.current`);
                      announce(`Checkbox "Masih bekerja di sini" untuk pengalaman ${index + 1}. ${isCurrent ? 'Tercentang' : 'Tidak tercentang'}. Tekan Space untuk memilih.`);
                    }}
                  >
                    <input
                      type="checkbox"
                      {...register(`professionalInfo.workExperience.${index}.current`)}
                      className="w-5 h-5"
                      onChange={(e) => {
                        announce(e.target.checked ? 'Anda masih bekerja di perusahaan ini' : 'Anda sudah tidak bekerja di perusahaan ini');
                        triggerHaptic('confirmation');
                      }}
                    />
                    <span>Masih bekerja di sini</span>
                  </label>
                </div>
                <div>
                  <FocusAnnouncement
                    description={`Deskripsi pekerjaan untuk pengalaman ${index + 1}. Jelaskan tanggung jawab dan pencapaian Anda di posisi ini. Minimal 10 karakter.`}
                    label={`Deskripsi - Pengalaman ${index + 1}`}
                  >
                    <label className="block text-sm font-medium mb-2">
                      Deskripsi Pekerjaan
                    </label>
                  </FocusAnnouncement>
                  <textarea
                    {...register(`professionalInfo.workExperience.${index}.description`)}
                    placeholder="Deskripsi pekerjaan"
                    rows={3}
                    className="w-full min-h-[80px] px-4 py-2 border border-input rounded-lg bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onFocus={() => {
                      announce(`Field deskripsi pekerjaan untuk pengalaman ${index + 1}. Jelaskan tanggung jawab dan pencapaian Anda. Minimal 10 karakter.`);
                    }}
                    onBlur={() => {
                      const desc = watch(`professionalInfo.workExperience.${index}.description`);
                      if (desc) {
                        announce('Deskripsi pekerjaan telah diisi');
                        triggerHaptic('confirmation');
                      }
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Education */}
        <div className="mb-6">
          <FocusAnnouncement
            description="Pendidikan. Di bagian ini, Anda dapat menambahkan riwayat pendidikan Anda. Klik tombol Tambah Pendidikan untuk menambahkan entri baru. Setiap entri memerlukan nama institusi, gelar, bidang studi, dan tanggal mulai."
            label="Pendidikan"
          >
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium">Pendidikan</label>
              {(() => {
                const addEducationProps = useFocusAnnouncement({
                  description: 'Tambah entri pendidikan baru. Setelah diklik, form baru akan muncul untuk mengisi detail pendidikan.',
                  label: 'Tambah Pendidikan',
                  context: 'Klik untuk menambahkan pendidikan',
                  announceOnFocus: true,
                  announceOnLongPress: true,
                });

                return (
                  <button
                    type="button"
                    onClick={() => {
                      appendEducation({
                        institution: '',
                        degree: '',
                        field: '',
                        startDate: new Date(),
                        current: false,
                      });
                      announce('Form pendidikan baru ditambahkan');
                      triggerHaptic('confirmation');
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 min-h-[48px]"
                    {...addEducationProps}
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Pendidikan
                  </button>
                );
              })()}
            </div>
          </FocusAnnouncement>
          {educationFields.map((field, index) => {
            const removeEducationProps = useFocusAnnouncement({
              description: `Hapus pendidikan nomor ${index + 1}`,
              label: `Hapus Pendidikan ${index + 1}`,
              context: 'Klik untuk menghapus entri ini',
              announceOnFocus: true,
              announceOnLongPress: true,
            });

            return (
              <div
                key={field.id}
                className="p-4 border border-border rounded-lg mb-4 space-y-4"
              >
                <FocusAnnouncement
                  description={`Pendidikan nomor ${index + 1}. Isi nama institusi, gelar, bidang studi, dan tanggal mulai.`}
                  label={`Pendidikan ${index + 1}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Pendidikan {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => {
                        removeEducation(index);
                        announce(`Pendidikan nomor ${index + 1} dihapus`);
                        triggerHaptic('dismiss');
                      }}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg min-h-[48px] min-w-[48px] flex items-center justify-center"
                      aria-label={`Hapus pendidikan ${index + 1}`}
                      {...removeEducationProps}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </FocusAnnouncement>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AccessibleInput
                    label={`Nama Institusi - Pendidikan ${index + 1}`}
                    description="Masukkan nama sekolah atau universitas"
                    required
                    example="Universitas Indonesia"
                    type="text"
                    {...register(`professionalInfo.education.${index}.institution`)}
                    onFocus={() => handleFieldFocus(`professionalInfo.education.${index}.institution`)}
                    onBlur={() => handleFieldBlur(`professionalInfo.education.${index}.institution`)}
                    placeholder="Nama Institusi"
                    id={`education-${index}-institution`}
                  />
                  <AccessibleInput
                    label={`Gelar - Pendidikan ${index + 1}`}
                    description="Masukkan gelar yang diperoleh"
                    required
                    example="Sarjana Teknik Informatika"
                    type="text"
                    {...register(`professionalInfo.education.${index}.degree`)}
                    onFocus={() => handleFieldFocus(`professionalInfo.education.${index}.degree`)}
                    onBlur={() => handleFieldBlur(`professionalInfo.education.${index}.degree`)}
                    placeholder="Gelar"
                    id={`education-${index}-degree`}
                  />
                  <AccessibleInput
                    label={`Bidang Studi - Pendidikan ${index + 1}`}
                    description="Masukkan bidang studi atau jurusan"
                    required
                    example="Teknik Informatika"
                    type="text"
                    {...register(`professionalInfo.education.${index}.field`)}
                    onFocus={() => handleFieldFocus(`professionalInfo.education.${index}.field`)}
                    onBlur={() => handleFieldBlur(`professionalInfo.education.${index}.field`)}
                    placeholder="Bidang Studi"
                    id={`education-${index}-field`}
                  />
                  <AccessibleInput
                    label={`Tanggal Mulai - Pendidikan ${index + 1}`}
                    description="Pilih tanggal mulai pendidikan"
                    required
                    format="DD/MM/YYYY"
                    type="date"
                    {...register(`professionalInfo.education.${index}.startDate`, {
                      valueAsDate: true,
                    })}
                    onFocus={() => handleFieldFocus(`professionalInfo.education.${index}.startDate`)}
                    onBlur={() => handleFieldBlur(`professionalInfo.education.${index}.startDate`)}
                    id={`education-${index}-startDate`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Accessibility Section */}
      <section aria-labelledby="accessibility-heading">
        <FocusAnnouncement
          description="Bagian Informasi Aksesibilitas. Di bagian ini, Anda akan mengisi jenis disabilitas dan teknologi asistif yang Anda gunakan. Informasi ini membantu kami menyediakan dukungan yang tepat untuk Anda."
          label="Bagian Informasi Aksesibilitas"
        >
          <h2
            id="accessibility-heading"
            className="text-2xl font-bold mb-4"
          >
            Informasi Aksesibilitas
          </h2>
        </FocusAnnouncement>
        <div className="space-y-4">
          <div>
            <FocusAnnouncement
              description="Jenis Disabilitas. Pilih jenis disabilitas yang Anda miliki dari dropdown. Field ini wajib diisi."
              label="Jenis Disabilitas"
            >
              <label
                htmlFor="disabilityType"
                className="block text-sm font-medium mb-2"
              >
                Jenis Disabilitas *
              </label>
            </FocusAnnouncement>
            <select
              id="disabilityType"
              {...register('accessibility.disabilityType')}
              className={cn(
                'w-full min-h-[48px] px-4 py-2 border border-input rounded-lg bg-background',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                errors.accessibility?.disabilityType && 'border-destructive'
              )}
              aria-invalid={!!errors.accessibility?.disabilityType}
              onFocus={() => {
                handleFieldFocus('accessibility.disabilityType');
                announce('Dropdown Jenis Disabilitas. Pilih jenis disabilitas yang Anda miliki. Gunakan tombol panah atas atau bawah untuk navigasi, Enter untuk memilih. Field ini wajib diisi.');
              }}
              onChange={(e) => {
                if (e.target.value) {
                  announce(`Jenis disabilitas dipilih: ${e.target.value}`);
                  triggerHaptic('confirmation');
                }
              }}
            >
              <option value="">Pilih jenis disabilitas</option>
              {disabilityTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.accessibility?.disabilityType && (
              <p className="mt-1 text-sm text-destructive" role="alert">
                {errors.accessibility.disabilityType.message}
              </p>
            )}
          </div>

          <div>
            <FocusAnnouncement
              description="Teknologi Asistif yang Digunakan. Pilih teknologi asistif yang Anda gunakan dengan mencentang checkbox. Anda dapat memilih beberapa teknologi."
              label="Teknologi Asistif"
            >
              <label className="block text-sm font-medium mb-2">
                Teknologi Asistif yang Digunakan
              </label>
            </FocusAnnouncement>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {assistiveTechOptions.map((tech) => {
                const techChecked = watch('accessibility.assistiveTech')?.includes(tech);
                return (
                  <label
                    key={tech}
                    className="flex items-center gap-2 p-3 border border-input rounded-lg cursor-pointer hover:bg-muted transition-colors min-h-[48px]"
                    onFocus={() => {
                      announce(`Checkbox teknologi asistif ${tech}. ${techChecked ? 'Terpilih' : 'Tidak terpilih'}. Tekan Space untuk memilih atau membatalkan.`);
                    }}
                  >
                    <input
                      type="checkbox"
                      value={tech}
                      {...register('accessibility.assistiveTech')}
                      className="w-5 h-5"
                      onChange={(e) => {
                        const currentTech = watch('accessibility.assistiveTech') || [];
                        if (e.target.checked) {
                          setValue('accessibility.assistiveTech', [...currentTech, tech]);
                          announce(`${tech} ditambahkan ke daftar teknologi asistif`);
                          triggerHaptic('confirmation');
                        } else {
                          setValue('accessibility.assistiveTech', currentTech.filter(t => t !== tech));
                          announce(`${tech} dihapus dari daftar teknologi asistif`);
                          triggerHaptic('dismiss');
                        }
                      }}
                    />
                    <span>{tech}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Preferences Section */}
      <section aria-labelledby="preferences-heading">
        <FocusAnnouncement
          description="Bagian Preferensi Pekerjaan. Di bagian ini, Anda akan mengisi preferensi gaji, lokasi, dan jenis kerja yang Anda inginkan. Informasi ini akan digunakan untuk mencocokkan Anda dengan pekerjaan yang sesuai."
          label="Bagian Preferensi Pekerjaan"
        >
          <h2
            id="preferences-heading"
            className="text-2xl font-bold mb-4"
          >
            Preferensi Pekerjaan
          </h2>
        </FocusAnnouncement>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AccessibleInput
              label="Gaji Minimal"
              description="Masukkan gaji minimum yang Anda harapkan dalam Rupiah"
              format="Angka tanpa titik atau koma"
              example="5000000"
              type="number"
              {...register('preferences.preferredSalary.min', {
                valueAsNumber: true,
              })}
              onFocus={() => handleFieldFocus('preferences.preferredSalary.min')}
              onBlur={() => handleFieldBlur('preferences.preferredSalary.min')}
              id="minSalary"
            />
            <AccessibleInput
              label="Gaji Maksimal"
              description="Masukkan gaji maksimum yang Anda harapkan dalam Rupiah"
              format="Angka tanpa titik atau koma"
              example="10000000"
              type="number"
              {...register('preferences.preferredSalary.max', {
                valueAsNumber: true,
              })}
              onFocus={() => handleFieldFocus('preferences.preferredSalary.max')}
              onBlur={() => handleFieldBlur('preferences.preferredSalary.max')}
              id="maxSalary"
            />
          </div>

          <div>
            <FocusAnnouncement
              description="Preferensi Kerja. Pilih jenis kerja yang Anda inginkan: Remote (kerja dari jarak jauh), Hybrid (kombinasi remote dan di kantor), atau On-site (harus datang ke kantor). Field ini wajib diisi."
              label="Preferensi Kerja"
            >
              <label
                htmlFor="workArrangement"
                className="block text-sm font-medium mb-2"
              >
                Preferensi Kerja *
              </label>
            </FocusAnnouncement>
            <select
              id="workArrangement"
              {...register('preferences.workArrangement')}
              className="w-full min-h-[48px] px-4 py-2 border border-input rounded-lg bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onFocus={() => {
                handleFieldFocus('preferences.workArrangement');
                announce('Dropdown Preferensi Kerja. Pilih jenis kerja yang Anda inginkan: Remote, Hybrid, atau On-site. Gunakan tombol panah untuk navigasi, Enter untuk memilih. Field ini wajib diisi.');
              }}
              onChange={(e) => {
                const arrangementNames: Record<string, string> = {
                  remote: 'Remote - kerja dari jarak jauh',
                  hybrid: 'Hybrid - kombinasi remote dan di kantor',
                  'on-site': 'On-site - harus datang ke kantor',
                };
                announce(`Preferensi kerja dipilih: ${arrangementNames[e.target.value] || e.target.value}`);
                triggerHaptic('confirmation');
              }}
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
        {(() => {
          const submitButtonProps = useFocusAnnouncement({
            description: 'Tombol Simpan Profil. Klik untuk menyimpan semua informasi yang telah Anda isi. Jika ada field yang belum diisi atau memiliki error, sistem akan memberitahu Anda.',
            label: 'Tombol Simpan Profil',
            context: 'Tekan Enter untuk menyimpan profil',
            announceOnFocus: true,
            announceOnLongPress: true,
          });

          return (
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
              {...submitButtonProps}
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
          );
        })()}
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
