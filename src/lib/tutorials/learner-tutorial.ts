/**
 * Job Seeker Tutorial Steps
 * Comprehensive step-by-step guide for job seekers
 */

import type { TutorialStep } from '@/components/tutorial/TutorialOverlay';

export const learnerTutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Selamat Datang di Inklusif Kerja!',
    description:
      'Selamat datang di platform pencarian kerja yang mudah diakses. Tutorial ini akan memandu Anda melalui semua fitur aplikasi.\n\nTekan "Berikutnya" untuk melanjutkan.',
    audioDescription:
      'Selamat datang di Inklusif Kerja. Platform pencarian kerja yang mudah diakses. Tutorial ini akan memandu Anda melalui semua fitur aplikasi. Tekan tombol Berikutnya untuk melanjutkan.',
    position: 'center',
  },
  {
    id: 'navigation',
    title: 'Navigasi Menu',
    description:
      'Di bagian atas halaman, Anda akan melihat menu navigasi:\n\n• Beranda - Kembali ke halaman utama\n• Cari Pekerjaan - Jelajahi lowongan kerja\n• Lamaran - Lihat status lamaran Anda\n• Tersimpan - Pekerjaan yang disimpan\n• Profil - Kelola profil Anda\n\nGunakan menu ini untuk berpindah antar halaman.',
    audioDescription:
      'Di bagian atas halaman, Anda akan melihat menu navigasi. Beranda untuk kembali ke halaman utama. Cari Pekerjaan untuk menjelajahi lowongan kerja. Lamaran untuk melihat status lamaran Anda. Tersimpan untuk pekerjaan yang disimpan. Dan Profil untuk mengelola profil Anda. Gunakan menu ini untuk berpindah antar halaman.',
    targetSelector: 'nav',
    targetButtonLabel: 'Menu Navigasi',
    targetButtonInstructions: 'Menu navigasi berada di bagian atas halaman. Gunakan Tab untuk berpindah antar menu, lalu tekan Enter untuk memilih.',
    position: 'bottom',
    keyboardHint: 'Gunakan Tab untuk navigasi menu, Enter untuk memilih.',
  },
  {
    id: 'profile-setup',
    title: 'Lengkapi Profil Anda',
    description:
      'Langkah pertama adalah melengkapi profil Anda. Klik menu "Profil" di navigasi.\n\nDi halaman profil, Anda dapat:\n• Mengisi data pribadi\n• Upload CV/Resume\n• Menambahkan pengalaman kerja\n• Menambahkan pendidikan\n• Mengatur preferensi pekerjaan\n\nProfil yang lengkap meningkatkan peluang Anda mendapatkan pekerjaan.',
    audioDescription:
      'Langkah pertama adalah melengkapi profil Anda. Klik menu Profil di navigasi. Di halaman profil, Anda dapat mengisi data pribadi, upload CV atau Resume, menambahkan pengalaman kerja, menambahkan pendidikan, dan mengatur preferensi pekerjaan. Profil yang lengkap meningkatkan peluang Anda mendapatkan pekerjaan.',
    targetSelector: 'a[href="/apps/learner/profile"]',
    targetButtonLabel: 'Profil',
    targetButtonInstructions: 'Tombol Profil berada di menu navigasi bagian atas. Geser ke kanan dari tombol Beranda, atau tekan Tab beberapa kali hingga menemukan tombol Profil, lalu tekan Enter.',
    position: 'bottom',
    keyboardHint: 'Tekan Tab untuk menemukan tombol Profil, lalu Enter untuk membuka.',
  },
  {
    id: 'browse-jobs',
    title: 'Mencari Pekerjaan',
    description:
      'Klik menu "Cari Pekerjaan" untuk melihat daftar lowongan kerja yang tersedia.\n\nDi halaman ini, Anda akan melihat kartu pekerjaan yang dapat Anda jelajahi menggunakan gerakan geser.',
    audioDescription:
      'Klik menu Cari Pekerjaan untuk melihat daftar lowongan kerja yang tersedia. Di halaman ini, Anda akan melihat kartu pekerjaan yang dapat Anda jelajahi menggunakan gerakan geser.',
    targetSelector: 'a[href="/apps/learner/jobs"]',
    targetButtonLabel: 'Cari Pekerjaan',
    targetButtonInstructions: 'Tombol Cari Pekerjaan berada di menu navigasi, setelah tombol Beranda. Tekan Tab dari Beranda untuk menemukannya, lalu tekan Enter.',
    position: 'bottom',
    keyboardHint: 'Tekan Tab dari Beranda untuk menemukan tombol Cari Pekerjaan.',
  },
  {
    id: 'gestures',
    title: 'Gerakan Geser (Gestures)',
    description:
      'Kartu pekerjaan mendukung gerakan geser untuk navigasi cepat:\n\n• Geser ke KANAN - Melamar pekerjaan\n• Geser ke KIRI - Melewatkan pekerjaan\n• Ketuk DUA KALI - Melihat detail lengkap\n• Tekan LAMA - Menyimpan pekerjaan\n\nAnda juga dapat menggunakan tombol keyboard:\n• Tekan A - Melamar\n• Tekan D - Melewatkan\n• Tekan S - Menyimpan',
    audioDescription:
      'Kartu pekerjaan mendukung gerakan geser untuk navigasi cepat. Geser ke kanan untuk melamar pekerjaan. Geser ke kiri untuk melewatkan pekerjaan. Ketuk dua kali untuk melihat detail lengkap. Tekan lama untuk menyimpan pekerjaan. Anda juga dapat menggunakan tombol keyboard. Tekan A untuk melamar, D untuk melewatkan, dan S untuk menyimpan.',
    position: 'center',
  },
  {
    id: 'job-card',
    title: 'Kartu Pekerjaan',
    description:
      'Setiap kartu pekerjaan menampilkan:\n\n• Judul pekerjaan dan nama perusahaan\n• Lokasi dan jarak dari TransJakarta\n• Rentang gaji\n• Tingkat aksesibilitas\n• Ringkasan pekerjaan (dibaca oleh screen reader)\n\nKartu ini dirancang untuk mudah diakses dengan screen reader dan navigasi keyboard.',
    audioDescription:
      'Setiap kartu pekerjaan menampilkan judul pekerjaan dan nama perusahaan, lokasi dan jarak dari TransJakarta, rentang gaji, tingkat aksesibilitas, dan ringkasan pekerjaan yang dibaca oleh screen reader. Kartu ini dirancang untuk mudah diakses dengan screen reader dan navigasi keyboard.',
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
    targetButtonInstructions: 'Tombol Filter berada di halaman Cari Pekerjaan, di bawah judul halaman. Gunakan Tab untuk menemukannya, atau cari tombol dengan label "Filter" atau "Tampilkan Filter".',
    position: 'bottom',
    keyboardHint: 'Gunakan Tab untuk menemukan tombol Filter di halaman.',
  },
  {
    id: 'job-details',
    title: 'Detail Pekerjaan',
    description:
      'Untuk melihat detail lengkap pekerjaan:\n\n• Ketuk dua kali pada kartu pekerjaan, atau\n• Klik tombol "Lihat Detail"\n\nDi halaman detail, Anda akan melihat:\n• Deskripsi lengkap pekerjaan\n• Semua persyaratan\n• Tunjangan dan benefit\n• Detail aksesibilitas lokasi\n• Tombol untuk melamar langsung',
    audioDescription:
      'Untuk melihat detail lengkap pekerjaan, ketuk dua kali pada kartu pekerjaan, atau klik tombol Lihat Detail. Di halaman detail, Anda akan melihat deskripsi lengkap pekerjaan, semua persyaratan, tunjangan dan benefit, detail aksesibilitas lokasi, dan tombol untuk melamar langsung.',
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
  {
    id: 'save-job',
    title: 'Menyimpan Pekerjaan',
    description:
      'Jika Anda menemukan pekerjaan yang menarik tetapi belum siap melamar, Anda dapat menyimpannya:\n\n• Tekan lama pada kartu pekerjaan, atau\n• Klik tombol "Simpan" (jika tersedia)\n\nPekerjaan yang disimpan dapat dilihat di halaman "Tersimpan" di menu navigasi.',
    audioDescription:
      'Jika Anda menemukan pekerjaan yang menarik tetapi belum siap melamar, Anda dapat menyimpannya. Tekan lama pada kartu pekerjaan, atau klik tombol Simpan jika tersedia. Pekerjaan yang disimpan dapat dilihat di halaman Tersimpan di menu navigasi.',
    position: 'center',
  },
  {
    id: 'applications',
    title: 'Melacak Lamaran',
    description:
      'Di halaman "Lamaran", Anda dapat:\n\n• Melihat semua pekerjaan yang telah Anda lamar\n• Melihat status setiap lamaran (Dikirim, Ditinjau, Diterima, Ditolak)\n• Melihat tanggal lamaran\n• Melihat apakah RPA digunakan untuk melamar\n\nStatus akan diperbarui secara otomatis saat ada perubahan.',
    audioDescription:
      'Di halaman Lamaran, Anda dapat melihat semua pekerjaan yang telah Anda lamar, melihat status setiap lamaran seperti Dikirim, Ditinjau, Diterima, atau Ditolak, melihat tanggal lamaran, dan melihat apakah RPA digunakan untuk melamar. Status akan diperbarui secara otomatis saat ada perubahan.',
    targetSelector: 'a[href="/apps/learner/applications"]',
    targetButtonLabel: 'Lamaran',
    targetButtonInstructions: 'Tombol Lamaran berada di menu navigasi, setelah tombol Cari Pekerjaan. Tekan Tab beberapa kali dari Cari Pekerjaan untuk menemukannya, lalu tekan Enter.',
    position: 'bottom',
    keyboardHint: 'Tekan Tab dari Cari Pekerjaan untuk menemukan tombol Lamaran.',
  },
  {
    id: 'notifications',
    title: 'Pusat Notifikasi',
    description:
      'Ikon bel di pojok kanan atas adalah Pusat Notifikasi.\n\nDi sini Anda akan menerima:\n• Notifikasi status lamaran\n• Pekerjaan baru yang sesuai dengan profil Anda\n• Pengingat untuk melengkapi profil\n• Update penting lainnya\n\nNotifikasi akan dibacakan oleh screen reader dan memberikan getaran haptic.',
    audioDescription:
      'Ikon bel di pojok kanan atas adalah Pusat Notifikasi. Di sini Anda akan menerima notifikasi status lamaran, pekerjaan baru yang sesuai dengan profil Anda, pengingat untuk melengkapi profil, dan update penting lainnya. Notifikasi akan dibacakan oleh screen reader dan memberikan getaran haptic.',
    targetSelector: '[data-tutorial="notifications"]',
    targetButtonLabel: 'Notifikasi',
    targetButtonInstructions: 'Tombol Notifikasi adalah ikon bel di pojok kanan atas layar, setelah menu navigasi. Gunakan Tab untuk berpindah ke akhir menu, atau tekan Shift+Tab dari tombol Profil untuk menemukannya.',
    position: 'left',
    keyboardHint: 'Tekan Tab dari tombol Profil untuk menemukan tombol Notifikasi di pojok kanan.',
  },
  {
    id: 'audio-feedback',
    title: 'Fitur Audio dan Haptic',
    description:
      'Aplikasi ini dilengkapi dengan:\n\n• Audio Feedback - Semua tindakan diumumkan dalam bahasa Indonesia\n• Haptic Feedback - Getaran untuk konfirmasi tindakan\n• Screen Reader Support - Kompatibel dengan JAWS, NVDA, VoiceOver\n• Keyboard Navigation - Semua fitur dapat diakses dengan keyboard\n\nPastikan audio dan getaran diaktifkan untuk pengalaman terbaik.',
    audioDescription:
      'Aplikasi ini dilengkapi dengan Audio Feedback untuk semua tindakan yang diumumkan dalam bahasa Indonesia, Haptic Feedback berupa getaran untuk konfirmasi tindakan, Screen Reader Support yang kompatibel dengan JAWS, NVDA, dan VoiceOver, serta Keyboard Navigation dimana semua fitur dapat diakses dengan keyboard. Pastikan audio dan getaran diaktifkan untuk pengalaman terbaik.',
    position: 'center',
  },
  {
    id: 'complete',
    title: 'Tutorial Selesai!',
    description:
      'Selamat! Anda telah menyelesaikan tutorial.\n\nSekarang Anda siap untuk:\n• Melengkapi profil Anda\n• Mencari pekerjaan yang sesuai\n• Melamar dengan mudah\n• Melacak status lamaran\n\nJika Anda perlu melihat tutorial lagi, klik tombol "Tutorial" di halaman profil.\n\nSelamat mencari kerja!',
    audioDescription:
      'Selamat! Anda telah menyelesaikan tutorial. Sekarang Anda siap untuk melengkapi profil Anda, mencari pekerjaan yang sesuai, melamar dengan mudah, dan melacak status lamaran. Jika Anda perlu melihat tutorial lagi, klik tombol Tutorial di halaman profil. Selamat mencari kerja!',
    position: 'center',
  },
];
