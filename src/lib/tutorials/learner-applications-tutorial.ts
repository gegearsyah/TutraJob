/**
 * Applications Tutorial Steps
 * Feature-specific tutorial for application tracking
 */

import type { TutorialStep } from '@/components/tutorial/TutorialOverlay';

export const learnerApplicationsTutorialSteps: TutorialStep[] = [
  {
    id: 'applications-welcome',
    title: 'Tutorial: Melacak Lamaran',
    description:
      'Selamat datang di tutorial pelacakan lamaran. Di sini Anda akan belajar cara melacak status semua lamaran pekerjaan Anda.',
    audioDescription:
      'Selamat datang di tutorial pelacakan lamaran. Di sini Anda akan belajar cara melacak status semua lamaran pekerjaan Anda.',
    position: 'center',
  },
  {
    id: 'application-list',
    title: 'Daftar Lamaran',
    description:
      'Di halaman ini, Anda akan melihat semua pekerjaan yang telah Anda lamar:\n\n• Setiap lamaran ditampilkan dalam kartu\n• Informasi pekerjaan dan perusahaan\n• Status lamaran saat ini\n• Tanggal lamaran\n• Indikator apakah RPA digunakan\n\nGunakan Tab untuk navigasi antar kartu.',
    audioDescription:
      'Di halaman ini, Anda akan melihat semua pekerjaan yang telah Anda lamar. Setiap lamaran ditampilkan dalam kartu dengan informasi pekerjaan dan perusahaan, status lamaran saat ini, tanggal lamaran, dan indikator apakah RPA digunakan. Gunakan Tab untuk navigasi antar kartu.',
    position: 'center',
  },
  {
    id: 'application-status',
    title: 'Status Lamaran',
    description:
      'Status lamaran dapat berupa:\n\n• Dikirim - Lamaran telah dikirim\n• Ditinjau - Perusahaan sedang meninjau lamaran Anda\n• Diterima - Anda diterima untuk tahap selanjutnya\n• Ditolak - Lamaran tidak diterima\n• Interview - Diundang untuk wawancara\n\nStatus akan diperbarui secara otomatis saat ada perubahan.',
    audioDescription:
      'Status lamaran dapat berupa Dikirim untuk lamaran yang telah dikirim, Ditinjau untuk perusahaan yang sedang meninjau lamaran Anda, Diterima untuk Anda yang diterima untuk tahap selanjutnya, Ditolak untuk lamaran yang tidak diterima, dan Interview untuk diundang wawancara. Status akan diperbarui secara otomatis saat ada perubahan.',
    position: 'center',
  },
  {
    id: 'application-details',
    title: 'Detail Lamaran',
    description:
      'Untuk melihat detail lengkap lamaran:\n\n• Ketuk dua kali pada kartu lamaran, atau\n• Klik tombol "Lihat Detail"\n\nDi halaman detail, Anda akan menemukan:\n• Informasi lengkap pekerjaan\n• Status dan timeline lamaran\n• Catatan dari perusahaan (jika ada)\n• Opsi untuk menarik lamaran (jika masih memungkinkan)',
    audioDescription:
      'Untuk melihat detail lengkap lamaran, ketuk dua kali pada kartu lamaran, atau klik tombol Lihat Detail. Di halaman detail, Anda akan menemukan informasi lengkap pekerjaan, status dan timeline lamaran, catatan dari perusahaan jika ada, dan opsi untuk menarik lamaran jika masih memungkinkan.',
    position: 'center',
  },
  {
    id: 'rpa-indicator',
    title: 'Indikator RPA',
    description:
      'Beberapa lamaran mungkin menggunakan RPA (Robotic Process Automation):\n\n• RPA membantu proses lamaran otomatis\n• Indikator akan muncul jika RPA digunakan\n• Ini berarti lamaran Anda diproses lebih cepat\n• Tidak ada tindakan tambahan yang diperlukan\n\nRPA membuat proses lamaran lebih efisien.',
    audioDescription:
      'Beberapa lamaran mungkin menggunakan RPA atau Robotic Process Automation. RPA membantu proses lamaran otomatis. Indikator akan muncul jika RPA digunakan. Ini berarti lamaran Anda diproses lebih cepat. Tidak ada tindakan tambahan yang diperlukan. RPA membuat proses lamaran lebih efisien.',
    position: 'center',
  },
  {
    id: 'filter-applications',
    title: 'Filter Lamaran',
    description:
      'Anda dapat memfilter lamaran berdasarkan:\n\n• Status - Pilih status tertentu (Dikirim, Ditinjau, dll)\n• Tanggal - Filter berdasarkan periode waktu\n• Perusahaan - Cari berdasarkan nama perusahaan\n\nGunakan filter untuk menemukan lamaran tertentu dengan cepat.',
    audioDescription:
      'Anda dapat memfilter lamaran berdasarkan status untuk memilih status tertentu seperti Dikirim atau Ditinjau, tanggal untuk filter berdasarkan periode waktu, dan perusahaan untuk mencari berdasarkan nama perusahaan. Gunakan filter untuk menemukan lamaran tertentu dengan cepat.',
    position: 'center',
  },
];
