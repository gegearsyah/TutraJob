/**
 * Employer Tutorial Steps
 * Comprehensive step-by-step guide for employers
 */

import type { TutorialStep } from '@/components/tutorial/TutorialOverlay';

export const employerTutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Selamat Datang - Portal Pemberi Kerja',
    description:
      'Selamat datang di Portal Pemberi Kerja Inklusif Kerja. Tutorial ini akan memandu Anda melalui semua fitur untuk merekrut kandidat yang beragam dan inklusif.\n\nTekan "Berikutnya" untuk melanjutkan.',
    audioDescription:
      'Selamat datang di Portal Pemberi Kerja Inklusif Kerja. Tutorial ini akan memandu Anda melalui semua fitur untuk merekrut kandidat yang beragam dan inklusif. Tekan tombol Berikutnya untuk melanjutkan.',
    position: 'center',
  },
  {
    id: 'compliance',
    title: 'Pelacakan Kepatuhan Kuota',
    description:
      'Sebagai pemberi kerja, Anda diwajibkan memenuhi kuota penyandang disabilitas sesuai peraturan.\n\nDi halaman "Kepatuhan", Anda dapat:\n• Memeriksa status kepatuhan real-time\n• Memeriksa jumlah karyawan disabilitas saat ini\n• Memeriksa kuota yang harus dipenuhi\n• Memeriksa gap yang perlu diisi\n• Menerima rekomendasi tindakan',
    audioDescription:
      'Sebagai pemberi kerja, Anda diwajibkan memenuhi kuota penyandang disabilitas sesuai peraturan. Di halaman Kepatuhan, Anda dapat memeriksa status kepatuhan real-time, memeriksa jumlah karyawan disabilitas saat ini, memeriksa kuota yang harus dipenuhi, memeriksa gap yang perlu diisi, dan menerima rekomendasi tindakan.',
    position: 'center',
  },
  {
    id: 'posting-jobs',
    title: 'Membuat Lowongan Kerja',
    description:
      'Untuk membuat lowongan kerja baru:\n\n1. Klik "Buat Lowongan" di dashboard\n2. Isi informasi pekerjaan:\n   • Judul dan deskripsi\n   • Lokasi dan aksesibilitas\n   • Gaji dan benefit\n   • Persyaratan\n3. Pilih tingkat aksesibilitas yang disediakan\n4. Publikasikan lowongan\n\nForm akan memeriksa aksesibilitas konten secara otomatis.',
    audioDescription:
      'Untuk membuat lowongan kerja baru, klik Buat Lowongan di dashboard. Isi informasi pekerjaan termasuk judul dan deskripsi, lokasi dan aksesibilitas, gaji dan benefit, serta persyaratan. Pilih tingkat aksesibilitas yang disediakan, lalu publikasikan lowongan. Form akan memeriksa aksesibilitas konten secara otomatis.',
    position: 'center',
  },
  {
    id: 'candidates',
    title: 'Mengakses Kandidat',
    description:
      'Di halaman "Kandidat", Anda dapat:\n\n• Mengakses semua lamaran yang masuk\n• Filter berdasarkan posisi, status, atau tanggal\n• Mengakses profil kandidat\n• Menggunakan Blind Audio Screening untuk penilaian yang tidak bias\n• Memeriksa skill mapping dengan kebutuhan pekerjaan',
    audioDescription:
      'Di halaman Kandidat, Anda dapat mengakses semua lamaran yang masuk, filter berdasarkan posisi, status, atau tanggal, mengakses profil kandidat, menggunakan Blind Audio Screening untuk penilaian yang tidak bias, dan memeriksa skill mapping dengan kebutuhan pekerjaan.',
    position: 'center',
  },
  {
    id: 'blind-screening',
    title: 'Blind Audio Screening',
    description:
      'Fitur Blind Audio Screening membantu Anda menilai kandidat tanpa bias:\n\n• Profil kandidat dibacakan tanpa nama, foto, atau informasi demografis\n• Fokus pada kualifikasi dan pengalaman\n• Penilaian berdasarkan kemampuan, bukan penampilan\n• Meningkatkan keragaman dan inklusivitas\n\nGunakan fitur ini untuk penilaian yang lebih adil.',
    audioDescription:
      'Fitur Blind Audio Screening membantu Anda menilai kandidat tanpa bias. Profil kandidat dibacakan tanpa nama, foto, atau informasi demografis. Fokus pada kualifikasi dan pengalaman. Penilaian berdasarkan kemampuan, bukan penampilan. Meningkatkan keragaman dan inklusivitas. Gunakan fitur ini untuk penilaian yang lebih adil.',
    position: 'center',
  },
  {
    id: 'accommodation',
    title: 'Profil Akomodasi yang Wajar',
    description:
      'Fitur ini membantu Anda:\n\n• Menghitung biaya akomodasi yang diperlukan\n• Mengakses profil akomodasi yang umum digunakan\n• Memahami kebutuhan aksesibilitas\n• Merencanakan budget untuk inklusivitas\n• Mencari solusi akomodasi yang cost-effective',
    audioDescription:
      'Fitur ini membantu Anda menghitung biaya akomodasi yang diperlukan, mengakses profil akomodasi yang umum digunakan, memahami kebutuhan aksesibilitas, merencanakan budget untuk inklusivitas, dan mencari solusi akomodasi yang cost-effective.',
    position: 'center',
  },
  {
    id: 'analytics',
    title: 'Analitik dan Laporan',
    description:
      'Di dashboard analitik, Anda dapat mengakses:\n\n• Jumlah views per lowongan\n• Tingkat konversi lamaran\n• Waktu rata-rata untuk mengisi posisi\n• Statistik kepatuhan kuota\n• Laporan bulanan untuk compliance\n\nGunakan data ini untuk meningkatkan proses rekrutmen.',
    audioDescription:
      'Di dashboard analitik, Anda dapat mengakses jumlah views per lowongan, tingkat konversi lamaran, waktu rata-rata untuk mengisi posisi, statistik kepatuhan kuota, dan laporan bulanan untuk compliance. Gunakan data ini untuk meningkatkan proses rekrutmen.',
    position: 'center',
  },
  {
    id: 'complete',
    title: 'Tutorial Selesai!',
    description:
      'Selamat! Anda telah menyelesaikan tutorial.\n\nSekarang Anda siap untuk:\n• Membuat lowongan kerja yang inklusif\n• Melacak kepatuhan kuota\n• Menilai kandidat dengan adil\n• Menggunakan fitur akomodasi\n\nJika Anda perlu mengakses tutorial lagi, klik tombol "Tutorial" di dashboard.\n\nSelamat merekrut!',
    audioDescription:
      'Selamat! Anda telah menyelesaikan tutorial. Sekarang Anda siap untuk membuat lowongan kerja yang inklusif, melacak kepatuhan kuota, menilai kandidat dengan adil, dan menggunakan fitur akomodasi. Jika Anda perlu mengakses tutorial lagi, klik tombol Tutorial di dashboard. Selamat merekrut!',
    position: 'center',
  },
];
