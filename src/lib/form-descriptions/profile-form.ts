/**
 * Profile Form Field Descriptions
 * Comprehensive descriptions for all form fields for blind users
 */

import type { FieldDescription } from '@/hooks/useAccessibleForm';

export const profileFormFieldDescriptions: Record<string, FieldDescription> = {
  'personalInfo.fullName': {
    label: 'Nama Lengkap',
    description: 'Masukkan nama lengkap Anda sesuai dengan identitas resmi',
    required: true,
    example: 'Contoh: Budi Santoso',
  },
  'personalInfo.email': {
    label: 'Email',
    description: 'Masukkan alamat email aktif Anda untuk komunikasi',
    required: true,
    format: 'email format',
    example: 'contoh@email.com',
  },
  'personalInfo.phone': {
    label: 'Nomor Telepon',
    description: 'Masukkan nomor telepon yang dapat dihubungi',
    required: true,
    format: 'Minimal 10 digit',
    example: '081234567890',
  },
  'personalInfo.address.street': {
    label: 'Alamat Lengkap',
    description: 'Masukkan alamat lengkap tempat tinggal Anda',
    required: true,
    example: 'Jl. Sudirman No. 123, RT 05 RW 02',
  },
  'personalInfo.address.city': {
    label: 'Kota',
    description: 'Masukkan kota tempat tinggal Anda',
    required: true,
    example: 'Jakarta Pusat',
  },
  'personalInfo.address.postalCode': {
    label: 'Kode Pos',
    description: 'Masukkan kode pos alamat Anda',
    required: true,
    format: '5 digit',
    example: '10220',
  },
  'personalInfo.dateOfBirth': {
    label: 'Tanggal Lahir',
    description: 'Pilih tanggal lahir Anda',
    required: true,
    format: 'DD/MM/YYYY',
    example: '01/01/1990',
  },
  'personalInfo.nationalId': {
    label: 'NIK (Nomor Induk Kependudukan)',
    description: 'Masukkan NIK sesuai KTP Anda',
    required: true,
    format: '16 digit',
    example: '3201010101900001',
  },
  'professionalInfo.coverLetter': {
    label: 'Surat Lamaran',
    description: 'Tulis surat lamaran yang menjelaskan mengapa Anda cocok untuk posisi yang dilamar',
    required: true,
    format: 'Minimal 50 karakter',
    example: 'Saya tertarik untuk melamar posisi...',
  },
  'professionalInfo.skills': {
    label: 'Keahlian',
    description: 'Pilih minimal 1 keahlian yang Anda kuasai',
    required: true,
    example: 'JavaScript, React, Node.js',
  },
  'accessibility.disabilityType': {
    label: 'Jenis Disabilitas',
    description: 'Pilih jenis disabilitas yang Anda miliki',
    required: true,
    example: 'Tunanetra, Tunarungu, dll',
  },
  'preferences.preferredSalary.min': {
    label: 'Gaji Minimum yang Diharapkan',
    description: 'Masukkan gaji minimum yang Anda harapkan dalam Rupiah',
    required: true,
    format: 'Angka tanpa titik atau koma',
    example: '5000000',
  },
  'preferences.preferredSalary.max': {
    label: 'Gaji Maksimum yang Diharapkan',
    description: 'Masukkan gaji maksimum yang Anda harapkan dalam Rupiah',
    required: true,
    format: 'Angka tanpa titik atau koma',
    example: '10000000',
  },
  'preferences.preferredLocation': {
    label: 'Lokasi yang Diinginkan',
    description: 'Pilih minimal 1 lokasi kerja yang Anda inginkan',
    required: true,
    example: 'Jakarta, Bandung, Surabaya',
  },
  'preferences.workArrangement': {
    label: 'Jenis Kerja',
    description: 'Pilih jenis kerja yang Anda inginkan: Remote, Hybrid, atau On-site',
    required: true,
    example: 'Hybrid',
  },
  'professionalInfo.workExperience.0.company': {
    label: 'Nama Perusahaan',
    description: 'Masukkan nama perusahaan tempat Anda bekerja',
    required: true,
    example: 'PT Teknologi Indonesia',
  },
  'professionalInfo.workExperience.0.position': {
    label: 'Posisi',
    description: 'Masukkan posisi atau jabatan Anda di perusahaan',
    required: true,
    example: 'Software Developer',
  },
  'professionalInfo.workExperience.0.startDate': {
    label: 'Tanggal Mulai Bekerja',
    description: 'Pilih tanggal mulai bekerja di perusahaan ini',
    required: true,
    format: 'DD/MM/YYYY',
    example: '01/01/2020',
  },
  'professionalInfo.workExperience.0.description': {
    label: 'Deskripsi Pekerjaan',
    description: 'Jelaskan tanggung jawab dan pencapaian Anda di posisi ini',
    required: true,
    format: 'Minimal 10 karakter',
    example: 'Mengembangkan aplikasi web menggunakan React...',
  },
  'professionalInfo.education.0.institution': {
    label: 'Nama Institusi',
    description: 'Masukkan nama sekolah atau universitas',
    required: true,
    example: 'Universitas Indonesia',
  },
  'professionalInfo.education.0.degree': {
    label: 'Gelar',
    description: 'Masukkan gelar yang diperoleh',
    required: true,
    example: 'Sarjana Teknik Informatika',
  },
  'professionalInfo.education.0.field': {
    label: 'Bidang Studi',
    description: 'Masukkan bidang studi atau jurusan',
    required: true,
    example: 'Teknik Informatika',
  },
  'cvFile': {
    label: 'File CV atau Resume',
    description: 'Upload file CV atau Resume Anda dalam format PDF atau DOCX, maksimal 5MB',
    required: false,
    format: 'PDF atau DOCX, maksimal 5MB',
    example: 'CV_Budi_Santoso.pdf',
  },
};
