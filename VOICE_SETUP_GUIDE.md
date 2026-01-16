# Panduan Setup Suara Indonesia untuk TTS

## Masalah: Suara Terdengar Seperti Orang Inggris Membaca Bahasa Indonesia

Jika suara yang keluar terdengar seperti orang yang berbicara bahasa Inggris mencoba membaca teks Indonesia, kemungkinan sistem Anda tidak memiliki suara Indonesia asli yang terpasang.

## Solusi: Instal Suara Indonesia Asli

### Windows 10/11

1. **Buka Settings** (Pengaturan)
2. Pergi ke **Time & Language** → **Language**
3. Klik **Add a language**
4. Cari dan pilih **Indonesian (Indonesia)**
5. Klik **Next** dan pastikan **Speech** dicentang
6. Klik **Install**
7. Setelah instalasi selesai, restart browser

**Atau melalui Control Panel:**
1. Buka **Control Panel** → **Clock and Region** → **Region**
2. Klik tab **Administrative** → **Change system locale**
3. Pilih **Indonesian (Indonesia)**
4. Restart komputer

### macOS

1. Buka **System Preferences** → **Accessibility** → **Spoken Content**
2. Klik **System Voice** → **Customize...**
3. Cari **Indonesian** dalam daftar
4. Centang suara Indonesia yang ingin digunakan
5. Klik **OK**
6. Pilih suara Indonesia sebagai default
7. Restart browser

### Chrome/Edge (Web Speech API)

Chrome dan Edge menggunakan suara dari sistem operasi. Setelah menginstal suara Indonesia di sistem, browser akan otomatis menggunakannya.

**Untuk memeriksa suara yang tersedia:**
1. Buka Developer Console (F12)
2. Jalankan: `speechSynthesis.getVoices().filter(v => v.lang.startsWith('id')).map(v => v.name)`
3. Ini akan menampilkan semua suara Indonesia yang tersedia

### Android

1. Buka **Settings** → **System** → **Languages & input
2. Pilih **Text-to-speech output**
3. Pilih engine TTS (Google Text-to-speech atau Samsung TTS)
4. Klik **Language** dan pilih **Indonesian**
5. Unduh paket bahasa Indonesia jika diminta
6. Restart aplikasi browser

### iOS

1. Buka **Settings** → **Accessibility** → **Spoken Content**
2. Pilih **Voices**
3. Pilih **Indonesian**
4. Unduh suara Indonesia yang diinginkan
5. Set sebagai default
6. Restart aplikasi browser

## Memeriksa Suara yang Digunakan

Di halaman Profil (`/apps/learner/profile`), ada komponen **Informasi Suara TTS** yang menampilkan:
- Suara yang sedang digunakan
- Semua suara Indonesia yang tersedia di sistem Anda
- Tombol untuk menguji suara

## Suara Indonesia yang Direkomendasikan

### Windows
- **Microsoft Zira** (jika tersedia versi Indonesia)
- **Google Indonesian** (jika terpasang)

### macOS
- **Lailah** (Indonesian female voice)
- **Damayanti** (Indonesian female voice)

### Chrome/Edge
- **Google Indonesia** (jika terpasang)
- Suara sistem yang mendukung id-ID

## Troubleshooting

### Suara Masih Terdengar Seperti Bahasa Inggris

1. **Pastikan suara Indonesia terpasang:**
   - Cek di halaman Profil → Informasi Suara TTS
   - Jika tidak ada suara Indonesia, ikuti langkah instalasi di atas

2. **Clear cache browser:**
   - Tekan Ctrl+Shift+Delete (Windows) atau Cmd+Shift+Delete (Mac)
   - Clear cache dan cookies
   - Restart browser

3. **Restart browser:**
   - Tutup semua tab browser
   - Restart browser sepenuhnya
   - Buka aplikasi lagi

4. **Cek console browser:**
   - Buka Developer Console (F12)
   - Lihat log `[TTS] Selected Indonesian voice:`
   - Pastikan suara yang dipilih adalah suara Indonesia, bukan suara Inggris

### Tidak Ada Suara Indonesia yang Tersedia

Jika sistem Anda tidak memiliki suara Indonesia:
1. **Windows:** Instal Language Pack Indonesia melalui Settings
2. **macOS:** Unduh suara Indonesia melalui System Preferences
3. **Android:** Unduh paket bahasa Indonesia untuk TTS engine
4. **iOS:** Unduh suara Indonesia melalui Settings

Setelah instalasi, restart browser dan aplikasi.

## Catatan Teknis

Aplikasi ini menggunakan algoritma scoring untuk memilih suara terbaik:
- **Prioritas tertinggi:** Suara dengan "Indonesian" di nama dan "id-ID" di language code
- **Prioritas tinggi:** Suara Google atau Microsoft Indonesian
- **Dihindari:** Suara Inggris yang mungkin mencoba membaca bahasa Indonesia

Jika tidak ada suara Indonesia yang ditemukan, sistem akan menggunakan suara default yang mungkin tidak optimal.
