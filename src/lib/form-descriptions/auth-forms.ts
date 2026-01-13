/**
 * Authentication Form Field Descriptions
 * For login and signup forms
 */

import type { FieldDescription } from '@/hooks/useAccessibleForm';

export const loginFormFieldDescriptions: Record<string, FieldDescription> = {
  email: {
    label: 'Email',
    description: 'Masukkan alamat email Anda yang terdaftar',
    required: true,
    format: 'email format',
    example: 'nama@email.com',
    placeholder: 'nama@email.com',
  },
  password: {
    label: 'Kata Sandi',
    description: 'Masukkan kata sandi Anda',
    required: true,
    format: 'Minimal 6 karakter',
    example: '••••••••',
    placeholder: 'Masukkan kata sandi',
  },
};

export const signupFormFieldDescriptions: Record<string, FieldDescription> = {
  fullName: {
    label: 'Nama Lengkap',
    description: 'Masukkan nama lengkap Anda',
    required: true,
    example: 'Budi Santoso',
  },
  companyName: {
    label: 'Nama Perusahaan',
    description: 'Masukkan nama perusahaan Anda',
    required: true,
    example: 'PT Teknologi Indonesia',
  },
  contactName: {
    label: 'Nama Kontak',
    description: 'Masukkan nama kontak person perusahaan',
    required: true,
    example: 'Budi Santoso',
  },
  email: {
    label: 'Email',
    description: 'Masukkan alamat email aktif Anda',
    required: true,
    format: 'email format',
    example: 'nama@email.com',
    placeholder: 'nama@email.com',
  },
  password: {
    label: 'Kata Sandi',
    description: 'Buat kata sandi yang kuat, minimal 6 karakter',
    required: true,
    format: 'Minimal 6 karakter',
    example: '••••••••',
    placeholder: 'Minimal 6 karakter',
  },
  confirmPassword: {
    label: 'Konfirmasi Kata Sandi',
    description: 'Ulangi kata sandi yang sama untuk konfirmasi',
    required: true,
    format: 'Harus sama dengan kata sandi',
    example: '••••••••',
    placeholder: 'Ulangi kata sandi',
  },
};
