/**
 * Jobs Browsing Tutorial Steps
 * Feature-specific tutorial for job browsing and filtering
 */

import type { TutorialStep } from '@/components/tutorial/TutorialOverlay';

export const learnerJobsTutorialSteps: TutorialStep[] = [
  {
    id: 'jobs-welcome',
    title: 'Tutorial: Mencari Pekerjaan',
    description:
      'Selamat datang di tutorial pencarian pekerjaan. Di sini Anda akan belajar cara mencari dan menemukan pekerjaan yang sesuai dengan profil Anda.',
    audioDescription:
      'Selamat datang di tutorial pencarian pekerjaan. Di sini Anda akan belajar cara mencari dan menemukan pekerjaan yang sesuai dengan profil Anda.',
    position: 'center',
  },
  {
    id: 'job-cards',
    title: 'Kartu Pekerjaan',
    description:
      'Setiap kartu pekerjaan menampilkan:\n\n• Judul pekerjaan dan nama perusahaan\n• Lokasi dan jarak dari TransJakarta\n• Rentang gaji\n• Tingkat aksesibilitas\n• Ringkasan pekerjaan\n\nKartu ini dirancang untuk mudah diakses dengan screen reader dan navigasi keyboard.',
    audioDescription:
      'Setiap kartu pekerjaan menampilkan judul pekerjaan dan nama perusahaan, lokasi dan jarak dari TransJakarta, rentang gaji, tingkat aksesibilitas, dan ringkasan pekerjaan. Kartu ini dirancang untuk mudah diakses dengan screen reader dan navigasi keyboard.',
    position: 'center',
  },
  {
    id: 'gestures',
    title: 'Gerakan Geser (Gestures)',
    description:
      'Kartu pekerjaan mendukung gerakan geser untuk navigasi cepat:\n\n• Geser ke KANAN - Melamar pekerjaan\n• Geser ke KIRI - Melewatkan pekerjaan\n• Ketuk DUA KALI - Membuka detail lengkap\n• Tekan LAMA - Menyimpan pekerjaan\n\nAnda juga dapat menggunakan tombol keyboard:\n• Tekan A - Melamar\n• Tekan D - Melewatkan\n• Tekan S - Menyimpan',
    audioDescription:
      'Kartu pekerjaan mendukung gerakan geser untuk navigasi cepat. Geser ke kanan untuk melamar pekerjaan. Geser ke kiri untuk melewatkan pekerjaan. Ketuk dua kali untuk membuka detail lengkap. Tekan lama untuk menyimpan pekerjaan. Anda juga dapat menggunakan tombol keyboard. Tekan A untuk melamar, D untuk melewatkan, dan S untuk menyimpan.',
    position: 'center',
  },
  {
    id: 'filters',
    title: 'Filter Pekerjaan',
    description:
      'Gunakan filter untuk menemukan pekerjaan yang sesuai:\n\n• Pencarian teks - Cari berdasarkan kata kunci\n• Filter lokasi - Pilih kota yang diinginkan\n• Filter gaji - Tentukan rentang gaji minimum dan maksimum\n• Filter aksesibilitas - Pilih tingkat aksesibilitas\n• Filter jenis kerja - Remote, Hybrid, atau On-site\n\nKlik tombol "Filter" untuk membuka panel filter.',
    audioDescription:
      'Gunakan filter untuk menemukan pekerjaan yang sesuai. Pencarian teks untuk mencari berdasarkan kata kunci. Filter lokasi untuk memilih kota yang diinginkan. Filter gaji untuk menentukan rentang gaji minimum dan maksimum. Filter aksesibilitas untuk memilih tingkat aksesibilitas. Dan filter jenis kerja untuk Remote, Hybrid, atau On-site. Klik tombol Filter untuk membuka panel filter.',
    targetSelector: '[data-tutorial="filters"]',
    targetButtonLabel: 'Filter',
    targetButtonInstructions: 'Tombol Filter berada di halaman Cari Pekerjaan, di bawah judul halaman. Gunakan Tab untuk menemukannya.',
    position: 'bottom',
    keyboardHint: 'Gunakan Tab untuk menemukan tombol Filter di halaman.',
  },
  {
    id: 'voice-filters',
    title: 'Filter Suara',
    description:
      'Anda juga dapat menggunakan filter suara:\n\n• Klik tombol "Filter Suara"\n• Berbicara perintah filter Anda\n• Contoh: "Filter gaji minimum 5 juta"\n• Sistem akan menerapkan filter secara otomatis\n\nFilter suara memudahkan navigasi tanpa keyboard.',
    audioDescription:
      'Anda juga dapat menggunakan filter suara. Klik tombol Filter Suara, berbicara perintah filter Anda, contoh: Filter gaji minimum 5 juta. Sistem akan menerapkan filter secara otomatis. Filter suara memudahkan navigasi tanpa keyboard.',
    position: 'center',
  },
  {
    id: 'job-details',
    title: 'Detail Pekerjaan',
    description:
      'Untuk mengakses detail lengkap pekerjaan:\n\n• Ketuk dua kali pada kartu pekerjaan, atau\n• Klik tombol "Lihat Detail"\n\nDi halaman detail, Anda akan menemukan:\n• Deskripsi lengkap pekerjaan\n• Semua persyaratan\n• Tunjangan dan benefit\n• Detail aksesibilitas lokasi\n• Tombol untuk melamar langsung',
    audioDescription:
      'Untuk mengakses detail lengkap pekerjaan, ketuk dua kali pada kartu pekerjaan, atau klik tombol Lihat Detail. Di halaman detail, Anda akan menemukan deskripsi lengkap pekerjaan, semua persyaratan, tunjangan dan benefit, detail aksesibilitas lokasi, dan tombol untuk melamar langsung.',
    position: 'center',
  },
  {
    id: 'apply',
    title: 'Melamar Pekerjaan',
    description:
      'Ada beberapa cara untuk melamar:\n\n1. Geser kartu ke kanan\n2. Klik tombol "Lamar" pada kartu\n3. Klik "Lamar Sekarang" di halaman detail\n\nSetelah melamar, Anda akan menerima:\n• Konfirmasi haptic (getaran)\n• Pengumuman audio\n• Pekerjaan akan muncul di halaman "Lamaran"',
    audioDescription:
      'Ada beberapa cara untuk melamar. Geser kartu ke kanan, klik tombol Lamar pada kartu, atau klik Lamar Sekarang di halaman detail. Setelah melamar, Anda akan menerima konfirmasi haptic berupa getaran, pengumuman audio, dan pekerjaan akan muncul di halaman Lamaran.',
    position: 'center',
  },
];
