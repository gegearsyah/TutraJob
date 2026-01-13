# 📚 Tutorial & Onboarding Guide - Inklusif Kerja

## 🎯 Overview

Aplikasi Inklusif Kerja dilengkapi dengan sistem tutorial interaktif yang memandu pengguna melalui semua fitur aplikasi langkah demi langkah. Tutorial ini dirancang untuk mudah diakses dengan dukungan screen reader, audio feedback, dan navigasi keyboard.

## 🚀 Fitur Tutorial

### ✨ Karakteristik Utama

- **Step-by-Step Guidance** - Panduan langkah demi langkah yang jelas
- **Element Highlighting** - Menyorot elemen yang sedang dijelaskan
- **Audio Announcements** - Semua langkah diumumkan dalam bahasa Indonesia
- **Haptic Feedback** - Getaran untuk konfirmasi navigasi
- **Progress Tracking** - Melacak kemajuan dan penyelesaian tutorial
- **Skip Functionality** - Dapat dilewati kapan saja
- **Keyboard Navigation** - Dapat dinavigasi sepenuhnya dengan keyboard
- **Auto-Start** - Otomatis dimulai untuk pengguna baru

## 👤 Tutorial untuk Pencari Kerja (Job Seeker)

### 📋 Langkah-Langkah Tutorial

1. **Selamat Datang** - Pengenalan aplikasi
2. **Navigasi Menu** - Cara menggunakan menu navigasi
3. **Lengkapi Profil** - Cara mengisi profil dan upload CV
4. **Mencari Pekerjaan** - Cara menjelajahi lowongan kerja
5. **Gerakan Geser** - Penjelasan sistem gesture (swipe, tap, long press)
6. **Kartu Pekerjaan** - Memahami informasi di kartu pekerjaan
7. **Filter Pekerjaan** - Cara menggunakan filter untuk mencari pekerjaan
8. **Detail Pekerjaan** - Cara melihat detail lengkap pekerjaan
9. **Melamar Pekerjaan** - Cara melamar pekerjaan
10. **Menyimpan Pekerjaan** - Cara menyimpan pekerjaan untuk nanti
11. **Melacak Lamaran** - Cara melihat status lamaran
12. **Pusat Notifikasi** - Menggunakan sistem notifikasi
13. **Fitur Audio dan Haptic** - Memahami feedback audio dan haptic
14. **Tutorial Selesai** - Pesan penyelesaian

### 🎯 Cara Menggunakan

#### Otomatis (Pengguna Baru)
- Tutorial akan otomatis dimulai saat pertama kali mengakses portal
- Muncul setelah 1 detik di halaman utama

#### Manual
1. Klik tombol **"Mulai Tutorial"** di halaman utama
2. Atau klik tombol **"Tutorial"** di halaman profil
3. Ikuti langkah-langkah yang ditampilkan
4. Gunakan tombol **"Berikutnya"** untuk melanjutkan
5. Gunakan tombol **"Sebelumnya"** untuk kembali
6. Klik **"Lewati"** untuk melewatkan tutorial
7. Klik **"Selesai"** di langkah terakhir

### ⌨️ Navigasi Keyboard

- **Tab** - Navigasi antar tombol
- **Enter/Space** - Aktifkan tombol
- **Escape** - Tutup tutorial
- **Arrow Keys** - Navigasi (jika didukung)

## 🏢 Tutorial untuk Pemberi Kerja (Employer)

### 📋 Langkah-Langkah Tutorial

1. **Selamat Datang** - Pengenalan portal pemberi kerja
2. **Pelacakan Kepatuhan** - Memahami sistem tracking kuota
3. **Membuat Lowongan** - Cara membuat lowongan kerja yang inklusif
4. **Melihat Kandidat** - Cara meninjau lamaran yang masuk
5. **Blind Audio Screening** - Menggunakan screening tanpa bias
6. **Profil Akomodasi** - Memahami dan menghitung akomodasi
7. **Analitik dan Laporan** - Menggunakan dashboard analitik
8. **Tutorial Selesai** - Pesan penyelesaian

### 🎯 Cara Menggunakan

Sama seperti tutorial pencari kerja:
- Otomatis dimulai untuk pengguna baru
- Atau klik tombol **"Mulai Tutorial"** di dashboard

## 🔧 Teknis

### Komponen Utama

1. **TutorialOverlay** (`src/components/tutorial/TutorialOverlay.tsx`)
   - Komponen overlay utama yang menampilkan tutorial
   - Menangani highlighting, positioning, dan navigasi

2. **TutorialButton** (`src/components/tutorial/TutorialButton.tsx`)
   - Tombol untuk memulai tutorial
   - Menampilkan status completion

3. **useTutorial Hook** (`src/hooks/useTutorial.ts`)
   - Hook untuk mengelola state tutorial
   - Tracking completion di localStorage

4. **Tutorial Data**
   - `src/lib/tutorials/learner-tutorial.ts` - Data tutorial pencari kerja
   - `src/lib/tutorials/employer-tutorial.ts` - Data tutorial pemberi kerja

### Struktur Data Tutorial Step

```typescript
interface TutorialStep {
  id: string;                    // Unique identifier
  title: string;                 // Step title
  description: string;           // Step description
  audioDescription?: string;    // Extended audio description
  targetSelector?: string;      // CSS selector untuk highlighting
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: () => void;          // Action saat step ditampilkan
  beforeAction?: () => void;    // Action sebelum step ditampilkan
}
```

### Progress Tracking

Tutorial completion disimpan di `localStorage`:
- Key: `tutorials_completed`
- Value: Array of tutorial IDs yang telah diselesaikan
- Format: `["learner-main", "employer-main", ...]`

### Auto-Start Logic

Tutorial otomatis dimulai jika:
1. User belum pernah menyelesaikan tutorial (checked via localStorage)
2. User belum melihat welcome message di session ini (checked via sessionStorage)
3. Delay 1 detik setelah halaman dimuat

## 🎨 Customization

### Menambahkan Step Baru

1. Edit file tutorial data (`learner-tutorial.ts` atau `employer-tutorial.ts`)
2. Tambahkan step baru ke array:
```typescript
{
  id: 'new-step',
  title: 'Judul Step',
  description: 'Deskripsi step...',
  audioDescription: 'Deskripsi audio yang lebih panjang...',
  targetSelector: 'selector-css', // Optional
  position: 'bottom', // Optional
}
```

### Mengubah Highlighting

Gunakan `targetSelector` untuk menyorot elemen:
- CSS selector: `'#element-id'`
- Class selector: `'.class-name'`
- Attribute selector: `'[data-tutorial="filters"]'`
- Complex selector: `'nav a[href="/apps/learner/profile"]'`

### Positioning Tooltip

Pilih posisi tooltip relatif terhadap elemen yang disorot:
- `'top'` - Di atas elemen
- `'bottom'` - Di bawah elemen (default)
- `'left'` - Di kiri elemen
- `'right'` - Di kanan elemen
- `'center'` - Di tengah layar (untuk step umum)

## ♿ Aksesibilitas

### Fitur Aksesibilitas

- ✅ **Screen Reader Support** - Semua langkah diumumkan
- ✅ **ARIA Labels** - Label lengkap untuk semua elemen
- ✅ **Keyboard Navigation** - Dapat dinavigasi sepenuhnya dengan keyboard
- ✅ **Focus Management** - Fokus otomatis ke elemen yang disorot
- ✅ **Audio Feedback** - Pengumuman dalam bahasa Indonesia
- ✅ **Haptic Feedback** - Getaran untuk konfirmasi
- ✅ **High Contrast** - Tooltip dengan kontras tinggi
- ✅ **Touch Targets** - Semua tombol minimum 48×48px

### Testing dengan Screen Reader

1. Aktifkan screen reader (JAWS, NVDA, atau VoiceOver)
2. Mulai tutorial
3. Pastikan semua langkah diumumkan dengan jelas
4. Pastikan navigasi dapat dilakukan dengan keyboard
5. Pastikan elemen yang disorot dapat diakses

## 📱 Responsive Design

Tutorial dirancang untuk bekerja di:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

Tooltip akan menyesuaikan posisi dan ukuran sesuai layar.

## 🐛 Troubleshooting

### Tutorial Tidak Muncul

1. Cek apakah tutorial sudah diselesaikan:
   - Buka DevTools → Application → Local Storage
   - Cek key `tutorials_completed`
   - Hapus tutorial ID jika perlu reset

2. Cek sessionStorage:
   - Hapus key `learner_welcome_shown` atau `employer_welcome_shown`
   - Refresh halaman

3. Cek console untuk error

### Highlighting Tidak Bekerja

1. Pastikan `targetSelector` valid
2. Pastikan elemen ada di DOM saat tutorial dimulai
3. Cek apakah elemen terlihat (tidak hidden)

### Audio Tidak Berfungsi

1. Pastikan browser mendukung Web Speech API
2. Cek apakah audio tidak di-mute
3. Pastikan `useIsMounted` hook bekerja dengan benar

## 🔄 Reset Tutorial

Untuk mereset tutorial:

1. **Via Code:**
```typescript
const { resetTutorial } = useTutorial('tutorial-id');
resetTutorial();
```

2. **Via localStorage:**
```javascript
// Di browser console
localStorage.removeItem('tutorials_completed');
sessionStorage.removeItem('learner_welcome_shown');
sessionStorage.removeItem('employer_welcome_shown');
location.reload();
```

## 📊 Statistik

Tutorial completion dapat dilacak untuk analitik:
- Jumlah pengguna yang menyelesaikan tutorial
- Langkah mana yang paling sering dilewati
- Waktu rata-rata untuk menyelesaikan tutorial

## 🎓 Best Practices

1. **Keep Steps Short** - Setiap step harus fokus pada satu konsep
2. **Clear Instructions** - Gunakan bahasa yang jelas dan sederhana
3. **Logical Flow** - Urutkan langkah secara logis
4. **Visual Cues** - Gunakan highlighting untuk menunjukkan elemen
5. **Audio Descriptions** - Sediakan deskripsi audio yang lebih detail
6. **Skip Option** - Selalu berikan opsi untuk melewatkan
7. **Progress Indicator** - Tampilkan progress yang jelas

---

**Last Updated:** 2024
**Status:** Tutorial system fully implemented and tested
