/**
 * Job Seeker Tutorial Steps - Home Page
 * Simplified introductory guide for the home page only
 */

import type { TutorialStep } from '@/components/tutorial/TutorialOverlay';

export const learnerTutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Selamat Datang di Inklusif Kerja!',
    description:
      'Selamat datang di Inklusif Kerja! Platform pencarian kerja yang mudah diakses untuk semua.\n\nTutorial ini akan memperkenalkan Anda pada fitur-fitur utama aplikasi. Setiap fitur memiliki tutorial tersendiri yang lebih detail.\n\nTekan "Berikutnya" untuk melanjutkan.',
    audioDescription:
      'Selamat datang di Inklusif Kerja. Platform pencarian kerja yang mudah diakses untuk semua. Tutorial ini akan memperkenalkan Anda pada fitur-fitur utama aplikasi. Setiap fitur memiliki tutorial tersendiri yang lebih detail. Tekan tombol Berikutnya untuk melanjutkan.',
    position: 'center',
  },
  {
    id: 'profile-setup',
    title: 'Instruksi Pertama: Lengkapi Profil Anda',
    description:
      'Langkah pertama adalah melengkapi profil Anda. Klik menu "Profil" di navigasi.\n\nDi halaman profil, Anda dapat:\n• Mengisi data pribadi\n• Upload CV/Resume\n• Menambahkan pengalaman kerja\n• Menambahkan pendidikan\n• Mengatur preferensi pekerjaan\n\nProfil yang lengkap meningkatkan peluang Anda mendapatkan pekerjaan.\n\nKlik menu Profil untuk tutorial lebih lengkap tentang pengelolaan profil.',
    audioDescription:
      'Instruksi Pertama: Lengkapi Profil Anda. Langkah pertama adalah melengkapi profil Anda. Klik menu Profil di navigasi. Di halaman profil, Anda dapat mengisi data pribadi, upload CV atau Resume, menambahkan pengalaman kerja, menambahkan pendidikan, dan mengatur preferensi pekerjaan. Profil yang lengkap meningkatkan peluang Anda mendapatkan pekerjaan. Klik menu Profil untuk tutorial lebih lengkap tentang pengelolaan profil.',
    targetSelector: 'a[href="/apps/learner/profile"]',
    targetButtonLabel: 'Profil',
    targetButtonInstructions: 'Tombol Profil berada di menu navigasi bagian atas. Tekan Tab beberapa kali hingga menemukan tombol Profil, lalu tekan Enter.',
    position: 'bottom',
    keyboardHint: 'Tekan Tab untuk menemukan tombol Profil, lalu Enter untuk membuka.',
  },
  {
    id: 'browse-jobs',
    title: 'Instruksi Kedua: Mencari Pekerjaan dan Kartu Pekerjaan',
    description:
      'Klik menu "Cari Pekerjaan" untuk mengakses daftar lowongan kerja yang tersedia.\n\nDi halaman ini, Anda akan menemukan kartu pekerjaan yang dapat Anda jelajahi menggunakan gerakan geser.\n\nLangkah dalam menggeser sebagai berikut:\n• Geser ke KANAN - Melamar pekerjaan\n• Geser ke KIRI - Melewatkan pekerjaan\n• Ketuk DUA KALI - Membuka detail lengkap\n• Tekan LAMA - Menyimpan pekerjaan\n\nAnda juga dapat menggunakan tombol keyboard:\n• Tekan A - Melamar\n• Tekan D - Melewatkan\n• Tekan S - Menyimpan\n\nBuka halaman Cari Pekerjaan untuk tutorial lengkap tentang pencarian pekerjaan.',
    audioDescription:
      'Instruksi Kedua: Mencari Pekerjaan dan Kartu Pekerjaan. Klik menu Cari Pekerjaan untuk mengakses daftar lowongan kerja yang tersedia. Di halaman ini, Anda akan menemukan kartu pekerjaan yang dapat Anda jelajahi menggunakan gerakan geser. Langkah dalam menggeser sebagai berikut: Geser ke kanan untuk melamar pekerjaan, Geser ke kiri untuk melewatkan pekerjaan, Ketuk dua kali untuk membuka detail lengkap, Tekan lama untuk menyimpan pekerjaan. Anda juga dapat menggunakan tombol keyboard: Tekan A untuk melamar, D untuk melewatkan, dan S untuk menyimpan. Buka halaman Cari Pekerjaan untuk tutorial lengkap tentang pencarian pekerjaan.',
    targetSelector: 'a[href="/apps/learner/jobs"]',
    targetButtonLabel: 'Cari Pekerjaan',
    targetButtonInstructions: 'Tombol Cari Pekerjaan berada di menu navigasi. Tekan Tab dari Beranda untuk menemukannya, lalu tekan Enter.',
    position: 'bottom',
    keyboardHint: 'Tekan Tab dari Beranda untuk menemukan tombol Cari Pekerjaan.',
  },
  {
    id: 'filters',
    title: 'Instruksi Ketiga: Filter Pekerjaan',
    description:
      'Gunakan filter untuk menemukan pekerjaan yang sesuai:\n\n• Pencarian teks - Cari berdasarkan kata kunci\n• Filter lokasi - Pilih kota yang diinginkan\n• Filter gaji - Tentukan rentang gaji minimum dan maksimum\n• Filter aksesibilitas - Pilih tingkat aksesibilitas\n• Filter jenis kerja - Remote, Hybrid, atau On-site\n\nKlik tombol "Filter" untuk membuka panel filter.\n\nDi halaman Cari Pekerjaan, Anda akan menemukan tutorial tentang cara menggunakan filter.',
    audioDescription:
      'Instruksi Ketiga: Filter Pekerjaan. Gunakan filter untuk menemukan pekerjaan yang sesuai. Pencarian teks untuk mencari berdasarkan kata kunci. Filter lokasi untuk memilih kota yang diinginkan. Filter gaji untuk menentukan rentang gaji minimum dan maksimum. Filter aksesibilitas untuk memilih tingkat aksesibilitas. Dan filter jenis kerja untuk Remote, Hybrid, atau On-site. Klik tombol Filter untuk membuka panel filter. Di halaman Cari Pekerjaan, Anda akan menemukan tutorial tentang cara menggunakan filter.',
    position: 'center',
  },
  {
    id: 'job-details',
    title: 'Instruksi Keempat: Detail Pekerjaan',
    description:
      'Untuk mengakses detail lengkap pekerjaan:\n\n• Ketuk dua kali pada kartu pekerjaan, atau\n• Klik tombol "Lihat Detail"\n\nDi halaman detail, Anda akan menemukan:\n• Deskripsi lengkap pekerjaan\n• Semua persyaratan\n• Tunjangan dan benefit\n• Detail aksesibilitas lokasi\n• Tombol untuk melamar langsung\n\nTutorial lengkap tersedia di halaman Cari Pekerjaan.',
    audioDescription:
      'Instruksi Keempat: Detail Pekerjaan. Untuk mengakses detail lengkap pekerjaan, ketuk dua kali pada kartu pekerjaan, atau klik tombol Lihat Detail. Di halaman detail, Anda akan menemukan deskripsi lengkap pekerjaan, semua persyaratan, tunjangan dan benefit, detail aksesibilitas lokasi, dan tombol untuk melamar langsung. Tutorial lengkap tersedia di halaman Cari Pekerjaan.',
    position: 'center',
  },
  {
    id: 'apply-and-save',
    title: 'Instruksi Kelima: Melamar dan Menyimpan Pekerjaan',
    description:
      'Ada beberapa cara untuk melamar:\n\n1. Geser kartu ke kanan\n2. Klik tombol "Lamar" pada kartu\n3. Klik "Lamar Sekarang" di halaman detail\n\nSetelah melamar, Anda akan menerima:\n• Konfirmasi haptic (getaran)\n• Pengumuman audio\n• Pekerjaan akan muncul di halaman "Lamaran"\n\nAnda dapat menyimpannya:\n\n• Tekan lama pada kartu pekerjaan, atau\n• Klik tombol "Simpan" (jika tersedia)\n\nPekerjaan yang disimpan dapat diakses di halaman "Tersimpan" di menu navigasi.',
    audioDescription:
      'Instruksi Kelima: Melamar dan Menyimpan Pekerjaan. Ada beberapa cara untuk melamar. Geser kartu ke kanan, klik tombol Lamar pada kartu, atau klik Lamar Sekarang di halaman detail. Setelah melamar, Anda akan menerima konfirmasi haptic berupa getaran, pengumuman audio, dan pekerjaan akan muncul di halaman Lamaran. Anda dapat menyimpannya dengan menekan lama pada kartu pekerjaan, atau klik tombol Simpan jika tersedia. Pekerjaan yang disimpan dapat diakses di halaman Tersimpan di menu navigasi.',
    position: 'center',
  },
  {
    id: 'applications',
    title: 'Instruksi Keenam: Pelacakan Status Lamaran Pekerjaan',
    description:
      'Di halaman "Lamaran", Anda dapat:\n\n• Mengakses semua pekerjaan yang telah Anda lamar\n• Memeriksa status setiap lamaran (Dikirim, Ditinjau, Diterima, Ditolak)\n• Memeriksa tanggal lamaran\n\nStatus akan diperbarui secara otomatis saat ada perubahan.\n\nKlik menu Lamaran untuk tutorial lengkap tentang pelacakan lamaran.',
    audioDescription:
      'Instruksi Keenam: Pelacakan Status Lamaran Pekerjaan. Di halaman Lamaran, Anda dapat mengakses semua pekerjaan yang telah Anda lamar, memeriksa status setiap lamaran seperti Dikirim, Ditinjau, Diterima, atau Ditolak, dan memeriksa tanggal lamaran. Status akan diperbarui secara otomatis saat ada perubahan. Klik menu Lamaran untuk tutorial lengkap tentang pelacakan lamaran.',
    targetSelector: 'a[href="/apps/learner/applications"]',
    targetButtonLabel: 'Lamaran',
    targetButtonInstructions: 'Tombol Lamaran berada di menu navigasi. Tekan Tab beberapa kali dari Cari Pekerjaan untuk menemukannya, lalu tekan Enter.',
    position: 'bottom',
    keyboardHint: 'Tekan Tab dari Cari Pekerjaan untuk menemukan tombol Lamaran.',
  },
];
