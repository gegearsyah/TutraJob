# ♿ Tutorial Accessibility Guide - For Blind Users

## 🎯 Overview

Tutorial sistem Inklusif Kerja dirancang khusus untuk mudah diakses oleh pengguna tunanetra. Semua fitur dapat digunakan sepenuhnya dengan screen reader, keyboard navigation, dan gesture controls.

## 🔊 Audio Instructions

### Instruksi Audio Lengkap

Setiap langkah tutorial memberikan instruksi audio yang detail, termasuk:

1. **Deskripsi Langkah** - Apa yang akan dipelajari
2. **Lokasi Tombol** - Di mana tombol berada (atas, bawah, kiri, kanan)
3. **Cara Menemukan** - Cara menemukan tombol dengan keyboard atau screen reader
4. **Tindakan yang Diperlukan** - Apa yang harus dilakukan
5. **Navigasi Tutorial** - Cara berpindah antar langkah

### Contoh Instruksi Audio

```
"Langkah pertama adalah melengkapi profil Anda. 
Klik menu Profil di navigasi. 
Tombol Profil berada di menu navigasi bagian atas. 
Geser ke kanan dari tombol Beranda, atau tekan Tab beberapa kali 
hingga menemukan tombol Profil, lalu tekan Enter. 
Tekan Tab untuk menemukan tombol Profil, lalu Enter untuk membuka. 
Tekan Tab untuk navigasi antar tombol, Enter untuk mengaktifkan. 
Geser kanan untuk langkah berikutnya, geser kiri untuk langkah sebelumnya, 
geser bawah untuk melewatkan tutorial."
```

## ⌨️ Keyboard Navigation

### Navigasi Tutorial

- **Tab** - Berpindah antar tombol dalam tutorial
- **Shift + Tab** - Kembali ke tombol sebelumnya
- **Enter / Space** - Mengaktifkan tombol yang terfokus
- **Arrow Right / Arrow Down** - Langkah berikutnya
- **Arrow Left / Arrow Up** - Langkah sebelumnya
- **Escape** - Melewatkan/menutup tutorial

### Navigasi Aplikasi

- **Tab** - Berpindah antar elemen
- **Enter** - Mengaktifkan link atau tombol
- **Space** - Mengaktifkan tombol
- **Arrow Keys** - Navigasi dalam menu (jika didukung)

## 👆 Gesture Navigation (Swipe)

Tutorial mendukung navigasi dengan gesture:

- **Geser Kanan** → Langkah berikutnya
- **Geser Kiri** → Langkah sebelumnya  
- **Geser Bawah** → Melewatkan tutorial

### Cara Menggunakan Gesture

1. Letakkan jari di layar (di area tutorial)
2. Geser ke arah yang diinginkan
3. Lepaskan jari
4. Tutorial akan merespons dengan getaran haptic
5. Audio akan mengumumkan tindakan yang dilakukan

## 🎯 Finding Buttons

### Instruksi untuk Setiap Tombol

Setiap langkah tutorial memberikan instruksi spesifik untuk menemukan tombol:

#### Contoh: Tombol "Profil"

**Instruksi Audio:**
```
"Tombol Profil berada di menu navigasi bagian atas. 
Geser ke kanan dari tombol Beranda, atau tekan Tab beberapa kali 
hingga menemukan tombol Profil, lalu tekan Enter."
```

**Instruksi Keyboard:**
- Tekan Tab dari tombol Beranda
- Atau tekan Shift+Tab dari tombol Cari Pekerjaan
- Screen reader akan mengumumkan: "Profil, link"

#### Contoh: Tombol "Filter"

**Instruksi Audio:**
```
"Tombol Filter berada di halaman Cari Pekerjaan, di bawah judul halaman. 
Gunakan Tab untuk menemukannya, atau cari tombol dengan label 'Filter' 
atau 'Tampilkan Filter'."
```

**Instruksi Keyboard:**
- Tekan Tab dari judul halaman
- Atau gunakan screen reader untuk mencari "Filter"
- Screen reader akan mengumumkan: "Filter, button"

## 📍 Button Location Descriptions

Tutorial memberikan deskripsi lokasi yang jelas:

- **"Di bagian atas"** - Di bagian atas halaman/layar
- **"Di bagian bawah"** - Di bagian bawah halaman/layar
- **"Di pojok kanan atas"** - Di sudut kanan atas
- **"Di pojok kiri atas"** - Di sudut kiri atas
- **"Setelah tombol X"** - Setelah tombol tertentu
- **"Sebelum tombol Y"** - Sebelum tombol tertentu

## 🎤 Screen Reader Support

### ARIA Labels

Semua tombol memiliki label ARIA yang jelas:

- `aria-label` - Label deskriptif
- `aria-describedby` - Deskripsi tambahan
- `aria-live` - Region yang diumumkan otomatis

### Focus Management

- Fokus otomatis dipindahkan ke tombol yang relevan
- Fokus dipindahkan ke tombol "Berikutnya" setelah setiap langkah
- Screen reader mengumumkan elemen yang terfokus

### Live Regions

Tutorial menggunakan `aria-live="polite"` untuk:
- Mengumumkan perubahan langkah
- Mengumumkan lokasi tombol
- Mengumumkan instruksi navigasi

## 🔊 Audio Announcements

### Urutan Pengumuman

1. **Judul Langkah** - "Langkah 3 dari 14"
2. **Deskripsi Langkah** - Penjelasan lengkap
3. **Instruksi Tombol** - Cara menemukan tombol
4. **Hint Keyboard** - Shortcut keyboard
5. **Hint Gesture** - Gesture yang dapat digunakan
6. **Lokasi Tombol** - Posisi tombol di layar (jika relevan)

### Timing

- Pengumuman pertama: 300ms setelah langkah dimulai
- Pengumuman lokasi: 500ms setelah elemen difokuskan
- Pengumuman fokus: 1000ms setelah langkah dimulai

## 🎯 Step-by-Step Example

### Langkah: "Lengkapi Profil Anda"

1. **Audio Announcement:**
   ```
   "Langkah 3 dari 14. Lengkapi Profil Anda. 
   Langkah pertama adalah melengkapi profil Anda. 
   Klik menu Profil di navigasi. 
   Tombol Profil berada di menu navigasi bagian atas. 
   Geser ke kanan dari tombol Beranda, atau tekan Tab beberapa kali 
   hingga menemukan tombol Profil, lalu tekan Enter."
   ```

2. **Focus Management:**
   - Tombol "Profil" otomatis difokuskan
   - Screen reader mengumumkan: "Profil, link, di menu navigasi"

3. **Location Announcement:**
   ```
   "Tombol Profil berada di bagian atas layar, kanan."
   ```

4. **Tutorial Navigation:**
   ```
   "Fokus sekarang pada tombol Berikutnya di tutorial. 
   Tekan Enter untuk melanjutkan, atau geser kanan."
   ```

## 🎮 Gesture Controls

### Tutorial Navigation Gestures

| Gesture | Action | Haptic Feedback |
|---------|--------|-----------------|
| Swipe Right | Next Step | 2 short pulses |
| Swipe Left | Previous Step | 1 short pulse |
| Swipe Down | Skip Tutorial | 3 rapid pulses |

### How to Use

1. **Swipe Right (Next):**
   - Letakkan jari di layar tutorial
   - Geser ke kanan dengan cepat
   - Lepaskan
   - Getaran: 2 pulses pendek
   - Audio: "Langkah berikutnya"

2. **Swipe Left (Previous):**
   - Letakkan jari di layar tutorial
   - Geser ke kiri dengan cepat
   - Lepaskan
   - Getaran: 1 pulse pendek
   - Audio: "Langkah sebelumnya"

3. **Swipe Down (Skip):**
   - Letakkan jari di layar tutorial
   - Geser ke bawah dengan cepat
   - Lepaskan
   - Getaran: 3 pulses cepat
   - Audio: "Tutorial dilewati"

## 💡 Tips untuk Pengguna Tunanetra

### 1. Gunakan Screen Reader

- Aktifkan screen reader (JAWS, NVDA, atau VoiceOver)
- Pastikan volume audio cukup keras
- Gunakan headphone untuk pengalaman lebih baik

### 2. Gunakan Keyboard

- Keyboard navigation lebih cepat dan akurat
- Gunakan Tab untuk berpindah antar elemen
- Gunakan Enter untuk mengaktifkan

### 3. Gunakan Gesture

- Gesture sangat berguna di mobile
- Latih gesture swipe untuk navigasi cepat
- Perhatikan getaran haptic untuk konfirmasi

### 4. Dengarkan Instruksi Lengkap

- Jangan terburu-buru
- Dengarkan semua instruksi audio
- Ulangi langkah jika perlu

### 5. Gunakan Fitur Ulang

- Klik "Mulai Ulang Tutorial" jika perlu
- Tutorial dapat diulang kapan saja
- Progress disimpan di localStorage

## 🔧 Troubleshooting

### Audio Tidak Jelas

1. Periksa volume browser
2. Periksa volume sistem
3. Pastikan tidak ada tab lain yang memutar audio
4. Coba refresh halaman

### Tombol Tidak Ditemukan

1. Gunakan Tab untuk navigasi
2. Gunakan screen reader search (Ctrl+F di NVDA)
3. Dengarkan instruksi audio dengan teliti
4. Coba ulangi langkah

### Gesture Tidak Berfungsi

1. Pastikan jari tidak terlalu lama di layar
2. Geser dengan cepat dan tegas
3. Pastikan gesture dilakukan di area tutorial
4. Coba gunakan keyboard sebagai alternatif

### Screen Reader Tidak Mengumumkan

1. Periksa apakah screen reader aktif
2. Periksa fokus pada elemen yang benar
3. Gunakan navigasi keyboard untuk memindahkan fokus
4. Refresh halaman jika perlu

## 📱 Mobile vs Desktop

### Mobile (Touch Screen)

- **Gesture Navigation** - Swipe untuk navigasi
- **Touch Targets** - Semua tombol minimum 48×48px
- **Haptic Feedback** - Getaran untuk setiap tindakan
- **Audio Announcements** - Semua diumumkan

### Desktop (Keyboard)

- **Keyboard Navigation** - Tab, Enter, Arrow keys
- **Screen Reader** - Dukungan penuh JAWS, NVDA
- **Focus Indicators** - Fokus jelas terlihat
- **Audio Announcements** - Semua diumumkan

## ✅ Best Practices

1. **Dengarkan Instruksi Lengkap** - Jangan terburu-buru
2. **Gunakan Keyboard** - Lebih akurat untuk navigasi
3. **Gunakan Gesture** - Lebih cepat di mobile
4. **Ulangi Jika Perlu** - Tutorial dapat diulang
5. **Minta Bantuan** - Jika mengalami kesulitan

---

**Last Updated:** 2024
**Status:** Fully accessible for blind users with screen reader, keyboard, and gesture support
