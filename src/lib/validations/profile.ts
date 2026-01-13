/**
 * Profile Form Validation Schema
 * Using Zod for form validation
 */

import { z } from 'zod';

export const personalInfoSchema = z.object({
  fullName: z.string().min(2, 'Nama harus minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().min(10, 'Nomor telepon harus minimal 10 digit'),
  address: z.object({
    street: z.string().min(5, 'Alamat lengkap harus diisi'),
    city: z.string().min(2, 'Kota harus diisi'),
    postalCode: z.string().min(5, 'Kode pos harus diisi'),
  }),
  dateOfBirth: z.date({
    required_error: 'Tanggal lahir harus diisi',
  }),
  nationalId: z.string().min(16, 'NIK harus 16 digit'),
});

export const workExperienceSchema = z.object({
  company: z.string().min(2, 'Nama perusahaan harus diisi'),
  position: z.string().min(2, 'Posisi harus diisi'),
  startDate: z.date({
    required_error: 'Tanggal mulai harus diisi',
  }),
  endDate: z.date().optional(),
  current: z.boolean().default(false),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
});

export const educationSchema = z.object({
  institution: z.string().min(2, 'Nama institusi harus diisi'),
  degree: z.string().min(2, 'Gelar harus diisi'),
  field: z.string().min(2, 'Bidang studi harus diisi'),
  startDate: z.date({
    required_error: 'Tanggal mulai harus diisi',
  }),
  endDate: z.date().optional(),
  current: z.boolean().default(false),
});

export const profileFormSchema = z.object({
  personalInfo: personalInfoSchema,
  professionalInfo: z.object({
    coverLetter: z.string().min(50, 'Surat lamaran minimal 50 karakter'),
    workExperience: z.array(workExperienceSchema).optional(),
    education: z.array(educationSchema).optional(),
    skills: z.array(z.string()).min(1, 'Minimal pilih 1 skill'),
    certifications: z.array(z.string()).optional(),
  }),
  accessibility: z.object({
    disabilityType: z.string().min(1, 'Jenis disabilitas harus diisi'),
    accommodations: z.array(z.string()).optional(),
    assistiveTech: z.array(z.string()).optional(),
  }),
  preferences: z.object({
    preferredSalary: z.object({
      min: z.number().min(0, 'Gaji minimal harus positif'),
      max: z.number().min(0, 'Gaji maksimal harus positif'),
    }),
    preferredLocation: z.array(z.string()).min(1, 'Minimal pilih 1 lokasi'),
    workArrangement: z.enum(['remote', 'hybrid', 'on-site']),
  }),
  cvFile: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      'File CV maksimal 5MB'
    )
    .refine(
      (file) =>
        !file ||
        ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(
          file.type
        ),
      'File CV harus format PDF atau DOCX'
    ),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;
