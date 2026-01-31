/**
 * Profile Tutorial Steps
 * Feature-specific tutorial for profile management
 */

import type { TutorialStep } from '@/components/tutorial/TutorialOverlay';

export const learnerProfileTutorialSteps: TutorialStep[] = [
  {
    id: 'profile-welcome',
    title: 'Tutorial: Kelola Profil',
    description:
      'Selamat datang di tutorial pengelolaan profil. Di sini Anda akan belajar cara melengkapi dan mengelola profil Anda.\n\nProfil yang lengkap meningkatkan peluang Anda mendapatkan pekerjaan yang sesuai.',
    audioDescription:
      'Selamat datang di tutorial pengelolaan profil. Di sini Anda akan belajar cara melengkapi dan mengelola profil Anda. Profil yang lengkap meningkatkan peluang Anda mendapatkan pekerjaan yang sesuai.',
    position: 'center',
  },
  {
    id: 'profile-form',
    title: 'Formulir Profil',
    description:
      'Formulir profil terdiri dari beberapa bagian:\n\n• Data Pribadi - Nama, email, nomor telepon\n• Informasi Profesional - Skills, pengalaman kerja, pendidikan\n• Informasi Aksesibilitas - Kebutuhan aksesibilitas Anda\n• Preferensi Pekerjaan - Lokasi, jenis kerja, gaji yang diinginkan\n\nIsi semua bagian dengan informasi yang akurat.',
    audioDescription:
      'Formulir profil terdiri dari beberapa bagian. Data Pribadi untuk nama, email, nomor telepon. Informasi Profesional untuk skills, pengalaman kerja, pendidikan. Informasi Aksesibilitas untuk kebutuhan aksesibilitas Anda. Dan Preferensi Pekerjaan untuk lokasi, jenis kerja, gaji yang diinginkan. Isi semua bagian dengan informasi yang akurat.',
    position: 'center',
  },
  {
    id: 'cv-upload',
    title: 'Upload CV/Resume',
    description:
      'Anda dapat mengupload CV atau Resume dalam format PDF atau DOCX.\n\n• Klik tombol "Pilih File" di bagian CV/Resume\n• Pilih file dari perangkat Anda\n• File akan diupload secara otomatis\n• Pastikan file tidak lebih dari 5MB\n\nCV yang baik membantu perusahaan memahami kualifikasi Anda.',
    audioDescription:
      'Anda dapat mengupload CV atau Resume dalam format PDF atau DOCX. Klik tombol Pilih File di bagian CV atau Resume, pilih file dari perangkat Anda, file akan diupload secara otomatis. Pastikan file tidak lebih dari 5MB. CV yang baik membantu perusahaan memahami kualifikasi Anda.',
    position: 'center',
  },
  {
    id: 'work-experience',
    title: 'Pengalaman Kerja',
    description:
      'Tambahkan pengalaman kerja Anda:\n\n• Klik tombol "Tambah Pengalaman Kerja"\n• Isi nama perusahaan, posisi, periode kerja\n• Tambahkan deskripsi tugas dan pencapaian\n• Anda dapat menambahkan multiple pengalaman\n• Gunakan tombol "Hapus" untuk menghapus pengalaman\n\nPengalaman kerja yang detail membantu menunjukkan keahlian Anda.',
    audioDescription:
      'Tambahkan pengalaman kerja Anda. Klik tombol Tambah Pengalaman Kerja, isi nama perusahaan, posisi, periode kerja, tambahkan deskripsi tugas dan pencapaian. Anda dapat menambahkan multiple pengalaman. Gunakan tombol Hapus untuk menghapus pengalaman. Pengalaman kerja yang detail membantu menunjukkan keahlian Anda.',
    position: 'center',
  },
  {
    id: 'education',
    title: 'Pendidikan',
    description:
      'Tambahkan riwayat pendidikan:\n\n• Klik tombol "Tambah Pendidikan"\n• Pilih tingkat pendidikan (SMA, D3, S1, S2, S3)\n• Isi nama institusi dan jurusan\n• Masukkan tahun lulus\n• Anda dapat menambahkan multiple pendidikan\n\nRiwayat pendidikan membantu menunjukkan latar belakang akademik Anda.',
    audioDescription:
      'Tambahkan riwayat pendidikan. Klik tombol Tambah Pendidikan, pilih tingkat pendidikan seperti SMA, D3, S1, S2, atau S3, isi nama institusi dan jurusan, masukkan tahun lulus. Anda dapat menambahkan multiple pendidikan. Riwayat pendidikan membantu menunjukkan latar belakang akademik Anda.',
    position: 'center',
  },
  {
    id: 'accessibility-info',
    title: 'Informasi Aksesibilitas',
    description:
      'Bagian ini penting untuk membantu perusahaan menyediakan akomodasi yang tepat:\n\n• Pilih jenis disabilitas (jika ada)\n• Jelaskan kebutuhan aksesibilitas Anda\n• Sebutkan akomodasi yang diperlukan\n• Informasi ini membantu perusahaan mempersiapkan lingkungan kerja yang inklusif\n\nInformasi ini bersifat pribadi dan hanya dibagikan dengan perusahaan yang relevan.',
    audioDescription:
      'Bagian ini penting untuk membantu perusahaan menyediakan akomodasi yang tepat. Pilih jenis disabilitas jika ada, jelaskan kebutuhan aksesibilitas Anda, sebutkan akomodasi yang diperlukan. Informasi ini membantu perusahaan mempersiapkan lingkungan kerja yang inklusif. Informasi ini bersifat pribadi dan hanya dibagikan dengan perusahaan yang relevan.',
    position: 'center',
  },
  {
    id: 'save-profile',
    title: 'Menyimpan Profil',
    description:
      'Setelah melengkapi semua informasi:\n\n• Klik tombol "Simpan Profil" di bagian bawah\n• Sistem akan memvalidasi data Anda\n• Jika ada kesalahan, perbaiki terlebih dahulu\n• Setelah berhasil, Anda akan mendapat konfirmasi\n• Profil akan digunakan untuk pencocokan pekerjaan\n\nPastikan semua informasi akurat sebelum menyimpan.',
    audioDescription:
      'Setelah melengkapi semua informasi, klik tombol Simpan Profil di bagian bawah. Sistem akan memvalidasi data Anda. Jika ada kesalahan, perbaiki terlebih dahulu. Setelah berhasil, Anda akan mendapat konfirmasi. Profil akan digunakan untuk pencocokan pekerjaan. Pastikan semua informasi akurat sebelum menyimpan.',
    position: 'center',
  },
];
