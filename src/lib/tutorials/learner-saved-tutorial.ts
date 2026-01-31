/**
 * Saved Jobs Tutorial Steps
 * Feature-specific tutorial for saved jobs feature
 */

import type { TutorialStep } from '@/components/tutorial/TutorialOverlay';

export const learnerSavedTutorialSteps: TutorialStep[] = [
  {
    id: 'saved-welcome',
    title: 'Tutorial: Pekerjaan Tersimpan',
    description:
      'Selamat datang di tutorial pekerjaan tersimpan. Di sini Anda akan belajar cara menyimpan dan mengelola pekerjaan yang menarik.',
    audioDescription:
      'Selamat datang di tutorial pekerjaan tersimpan. Di sini Anda akan belajar cara menyimpan dan mengelola pekerjaan yang menarik.',
    position: 'center',
  },
  {
    id: 'save-job',
    title: 'Menyimpan Pekerjaan',
    description:
      'Ada beberapa cara untuk menyimpan pekerjaan:\n\n• Tekan lama pada kartu pekerjaan\n• Klik tombol "Simpan" pada kartu (jika tersedia)\n• Gunakan tombol keyboard S saat fokus pada kartu\n\nPekerjaan yang disimpan akan muncul di halaman ini.',
    audioDescription:
      'Ada beberapa cara untuk menyimpan pekerjaan. Tekan lama pada kartu pekerjaan, klik tombol Simpan pada kartu jika tersedia, atau gunakan tombol keyboard S saat fokus pada kartu. Pekerjaan yang disimpan akan muncul di halaman ini.',
    position: 'center',
  },
  {
    id: 'saved-list',
    title: 'Daftar Pekerjaan Tersimpan',
    description:
      'Di halaman ini, Anda akan melihat semua pekerjaan yang telah Anda simpan:\n\n• Setiap pekerjaan ditampilkan dalam kartu\n• Informasi lengkap pekerjaan dan perusahaan\n• Tanggal penyimpanan\n• Status apakah sudah dilamar atau belum\n\nGunakan Tab untuk navigasi antar kartu.',
    audioDescription:
      'Di halaman ini, Anda akan melihat semua pekerjaan yang telah Anda simpan. Setiap pekerjaan ditampilkan dalam kartu dengan informasi lengkap pekerjaan dan perusahaan, tanggal penyimpanan, dan status apakah sudah dilamar atau belum. Gunakan Tab untuk navigasi antar kartu.',
    position: 'center',
  },
  {
    id: 'saved-actions',
    title: 'Aksi pada Pekerjaan Tersimpan',
    description:
      'Dari halaman pekerjaan tersimpan, Anda dapat:\n\n• Melihat detail lengkap - Ketuk dua kali atau klik "Lihat Detail"\n• Melamar pekerjaan - Klik tombol "Lamar"\n• Menghapus dari tersimpan - Klik tombol "Hapus"\n\nPekerjaan yang sudah dilamar tetap tersimpan untuk referensi.',
    audioDescription:
      'Dari halaman pekerjaan tersimpan, Anda dapat melihat detail lengkap dengan ketuk dua kali atau klik Lihat Detail, melamar pekerjaan dengan klik tombol Lamar, dan menghapus dari tersimpan dengan klik tombol Hapus. Pekerjaan yang sudah dilamar tetap tersimpan untuk referensi.',
    position: 'center',
  },
  {
    id: 'organize-saved',
    title: 'Mengorganisir Pekerjaan Tersimpan',
    description:
      'Anda dapat mengorganisir pekerjaan tersimpan:\n\n• Hapus pekerjaan yang tidak lagi menarik\n• Simpan pekerjaan untuk referensi masa depan\n• Gunakan sebagai daftar wishlist pekerjaan\n\nPekerjaan tersimpan membantu Anda mengelola kandidat pekerjaan.',
    audioDescription:
      'Anda dapat mengorganisir pekerjaan tersimpan. Hapus pekerjaan yang tidak lagi menarik, simpan pekerjaan untuk referensi masa depan, gunakan sebagai daftar wishlist pekerjaan. Pekerjaan tersimpan membantu Anda mengelola kandidat pekerjaan.',
    position: 'center',
  },
];
