# ♿ Form Accessibility Guide - For Blind Users

## 🎯 Overview

Semua form di aplikasi Inklusif Kerja telah ditingkatkan dengan fitur aksesibilitas komprehensif untuk pengguna tunanetra. Setiap field form memberikan informasi lengkap tentang apa yang harus diisi, format yang diperlukan, dan error yang terjadi.

## 🔊 Audio Announcements

### Saat Field Difokuskan

Ketika Anda memfokuskan ke sebuah field, sistem akan mengumumkan:

1. **Label Field** - Nama field
2. **Deskripsi** - Penjelasan apa yang harus diisi
3. **Status Wajib** - Apakah field wajib diisi atau tidak
4. **Format** - Format data yang diperlukan
5. **Contoh** - Contoh input yang valid
6. **Error (jika ada)** - Error yang terjadi pada field tersebut

**Contoh Pengumuman:**
```
"Nama Lengkap. Masukkan nama lengkap Anda sesuai dengan identitas resmi. 
Field ini wajib diisi. Contoh: Budi Santoso."
```

### Saat Field Ditinggalkan (Blur)

Ketika Anda meninggalkan field:

1. **Jika ada error** - Error akan diumumkan
2. **Jika field terisi** - Konfirmasi bahwa field telah diisi
3. **Haptic feedback** - Getaran untuk konfirmasi

**Contoh Pengumuman:**
```
"Error di Email: Email tidak valid."
atau
"Email telah diisi."
```

### Saat Submit Form

Jika ada error saat submit:

1. **Ringkasan Error** - Jumlah error dan field yang bermasalah
2. **Field yang Belum Diisi** - Daftar field wajib yang belum diisi
3. **Error Pertama** - Detail error pertama yang ditemukan
4. **Auto-navigation** - Fokus otomatis dipindahkan ke field error pertama

**Contoh Pengumuman:**
```
"Form memiliki 3 error. 2 field wajib belum diisi: Nama Lengkap, Email. 
Error pertama: Email. Email tidak valid."
```

## ⌨️ Keyboard Navigation

### Navigasi Field

- **Tab** - Pindah ke field berikutnya
- **Shift + Tab** - Kembali ke field sebelumnya
- **Enter** - Submit form (jika di tombol submit)
- **Escape** - Batal (jika didukung)

### Auto-Navigation ke Error

Saat submit form dengan error:
- Fokus **otomatis** dipindahkan ke field error pertama
- Field di-scroll ke tengah layar
- Error diumumkan dengan audio
- Getaran haptic untuk konfirmasi

## 📋 Field Descriptions

### Informasi yang Disediakan

Setiap field menyediakan:

1. **Label** - Nama field yang jelas
2. **Deskripsi** - Penjelasan lengkap tentang field
3. **Format** - Format data yang diperlukan
4. **Contoh** - Contoh input yang valid
5. **Status Wajib** - Indikator field wajib (*)
6. **Error Message** - Pesan error yang jelas

### Contoh Field Descriptions

#### Nama Lengkap
- **Label:** Nama Lengkap
- **Deskripsi:** Masukkan nama lengkap Anda sesuai dengan identitas resmi
- **Wajib:** Ya
- **Contoh:** Budi Santoso

#### Email
- **Label:** Email
- **Deskripsi:** Masukkan alamat email aktif Anda untuk komunikasi
- **Format:** email format
- **Wajib:** Ya
- **Contoh:** contoh@email.com

#### Nomor Telepon
- **Label:** Nomor Telepon
- **Deskripsi:** Masukkan nomor telepon yang dapat dihubungi
- **Format:** Minimal 10 digit
- **Wajib:** Ya
- **Contoh:** 081234567890

#### Tanggal Lahir
- **Label:** Tanggal Lahir
- **Deskripsi:** Pilih tanggal lahir Anda
- **Format:** DD/MM/YYYY
- **Wajib:** Ya
- **Contoh:** 01/01/1990

## ✅ Validation Features

### Real-Time Validation

- Error diumumkan saat field ditinggalkan
- Error baru diumumkan saat terjadi
- Konfirmasi saat field terisi dengan benar

### Error Announcements

Error diumumkan dengan format:
```
"Error di [Label Field]: [Pesan Error]"
```

**Contoh:**
```
"Error di Email: Email tidak valid."
"Error di Nomor Telepon: Nomor telepon harus minimal 10 digit."
```

### Validation Summary

Saat submit dengan error, ringkasan diumumkan:
```
"Form memiliki [jumlah] error. [jumlah] field wajib belum diisi: [daftar field]. 
Error pertama: [label field]. [pesan error]."
```

## 🎯 Auto-Navigation

### Fitur Auto-Navigation

1. **Saat Submit dengan Error**
   - Fokus otomatis ke field error pertama
   - Field di-scroll ke tengah layar
   - Error diumumkan dengan audio
   - Getaran haptic untuk konfirmasi

2. **Navigasi Berurutan**
   - Setelah memperbaiki error, tekan Tab untuk ke field berikutnya
   - Atau submit lagi untuk auto-navigate ke error berikutnya

### Cara Menggunakan

1. Isi form seperti biasa
2. Tekan tombol "Simpan" atau "Submit"
3. Jika ada error, fokus akan otomatis pindah ke field error pertama
4. Dengarkan pengumuman error
5. Perbaiki error
6. Submit lagi untuk ke error berikutnya (jika ada)

## 📱 Screen Reader Support

### ARIA Labels

Semua field memiliki:
- `aria-label` - Label yang jelas
- `aria-describedby` - Deskripsi field
- `aria-invalid` - Status validasi
- `aria-required` - Status wajib
- `aria-live` - Region untuk pengumuman

### Live Regions

- **Polite** - Pengumuman tidak mengganggu
- **Assertive** - Pengumuman error (prioritas tinggi)
- **Atomic** - Pengumuman lengkap sekaligus

## 💡 Tips untuk Pengguna Tunanetra

### 1. Dengarkan Instruksi Lengkap

- Jangan terburu-buru saat field difokuskan
- Dengarkan semua informasi yang diumumkan
- Perhatikan format dan contoh yang diberikan

### 2. Gunakan Keyboard Navigation

- Gunakan Tab untuk berpindah antar field
- Gunakan Shift+Tab untuk kembali
- Jangan gunakan mouse (tidak diperlukan)

### 3. Perhatikan Error Messages

- Dengarkan error dengan teliti
- Perhatikan format yang diperlukan
- Gunakan contoh sebagai panduan

### 4. Gunakan Auto-Navigation

- Biarkan sistem memindahkan fokus ke error
- Ikuti pengumuman untuk menemukan field error
- Perbaiki error satu per satu

### 5. Validasi Sebelum Submit

- Pastikan semua field wajib terisi
- Perhatikan format yang diperlukan
- Dengarkan konfirmasi saat field terisi

## 🔧 Troubleshooting

### Audio Tidak Jelas

1. Periksa volume browser
2. Periksa volume sistem
3. Pastikan tidak ada tab lain yang memutar audio
4. Coba refresh halaman

### Field Tidak Ditemukan

1. Gunakan Tab untuk navigasi
2. Dengarkan pengumuman dengan teliti
3. Gunakan screen reader search (Ctrl+F di NVDA)
4. Coba auto-navigation dengan submit form

### Error Tidak Diumumkan

1. Pastikan field ditinggalkan (blur)
2. Pastikan submit form untuk trigger validation
3. Periksa apakah screen reader aktif
4. Refresh halaman jika perlu

### Auto-Navigation Tidak Bekerja

1. Pastikan ada error di form
2. Pastikan submit form (bukan hanya blur field)
3. Tunggu beberapa detik untuk auto-navigation
4. Coba manual dengan Tab

## 📊 Field Types Supported

### Text Input
- Nama, Alamat, dll
- Format dan contoh disediakan

### Email Input
- Format email otomatis divalidasi
- Contoh email disediakan

### Tel Input
- Format nomor telepon
- Minimal digit disediakan

### Date Input
- Format tanggal (DD/MM/YYYY)
- Picker tanggal aksesibel

### Select/Dropdown
- Opsi dibacakan oleh screen reader
- Navigasi dengan Arrow keys

### Textarea
- Input teks panjang
- Format dan contoh disediakan

### File Upload
- Pengumuman saat file dipilih
- Format file dan ukuran maksimal diumumkan

## ✅ Best Practices

1. **Dengarkan Instruksi Lengkap** - Jangan terburu-buru
2. **Gunakan Keyboard** - Lebih akurat untuk navigasi
3. **Perhatikan Format** - Ikuti format yang diberikan
4. **Gunakan Contoh** - Contoh membantu memahami format
5. **Validasi Sebelum Submit** - Pastikan semua field terisi
6. **Gunakan Auto-Navigation** - Biarkan sistem memandu Anda

---

**Last Updated:** 2024
**Status:** Fully accessible forms with comprehensive audio announcements and auto-navigation
