# Panduan Setup Admin dan Scraping

## Cara Login sebagai Admin

### 1. Membuat Akun Admin di Supabase

#### Opsi A: Melalui Supabase Dashboard (Recommended)

1. Buka **Supabase Dashboard** → **Authentication** → **Users**
2. Klik **Add User** → **Create new user**
3. Isi:
   - **Email**: `admin@inklusifkerja.id` (atau email admin Anda)
   - **Password**: Buat password yang kuat
   - **Auto Confirm User**: ✅ Centang
4. Setelah user dibuat, klik pada user tersebut
5. Di bagian **User Metadata**, klik **Edit**
6. Tambahkan metadata:
   ```json
   {
     "user_type": "admin"
   }
   ```
7. Klik **Save**

#### Opsi B: Melalui SQL (Supabase SQL Editor)

Jalankan query berikut di Supabase SQL Editor:

```sql
-- Ganti email dan password sesuai kebutuhan
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@inklusifkerja.id',
  crypt('your-secure-password', gen_salt('bf')),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"user_type": "admin"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

**Catatan**: Untuk password, gunakan fungsi `crypt()` atau set password melalui dashboard, lalu update metadata.

#### Opsi C: Sign Up Manual (untuk testing)

1. Buka aplikasi → **Sign Up** dengan email yang berakhiran `@admin.inklusifkerja.id` atau mengandung `admin@`
2. Setelah sign up, update metadata di Supabase Dashboard:
   - Buka **Authentication** → **Users**
   - Klik user yang baru dibuat
   - Edit **User Metadata** → Tambahkan `{"user_type": "admin"}`
   - Save

### 2. Login sebagai Admin

1. Buka aplikasi
2. Navigasi ke: `/apps/admin/auth/login`
   - Atau klik link "Admin Login" jika tersedia
3. Masukkan:
   - **Email**: Email admin yang sudah dibuat
   - **Password**: Password admin
4. Klik **Masuk sebagai Admin**
5. Jika berhasil, akan diarahkan ke **Dashboard Admin**

## Mengatur Scraping Pekerjaan

### 1. Akses Halaman Scraping

Setelah login sebagai admin:
1. Dari **Dashboard Admin**, klik **Pengaturan Scraping**
2. Atau navigasi langsung ke: `/apps/admin/scraping`

### 2. Menambah Sumber Scraping

1. Klik **Tambah Sumber**
2. Isi form:
   - **Nama Sumber**: Nama website/sumber (contoh: KarirHub, DNetwork)
   - **Base URL**: URL utama website (contoh: `https://karirhub.com`)
   - **Job List URL**: URL halaman yang menampilkan daftar pekerjaan
     - Contoh: `https://karirhub.com/jobs`
     - Contoh: `https://dnetwork.id/lowongan`
   - **CSS Selector** (Opsional): Selector CSS untuk menemukan link pekerjaan
     - Contoh: `.job-link`, `a[href*="job"]`, `.card-job a`
     - Biarkan kosong jika tidak yakin
   - **Interval (Jam)**: Berapa jam sekali scraping dilakukan (default: 6 jam)
   - **Aktifkan scraping otomatis**: Centang untuk mengaktifkan
   - **Deskripsi** (Opsional): Deskripsi sumber scraping
3. Klik **Tambah Sumber**

### 3. Mengelola Sumber Scraping

Setiap sumber scraping yang ditambahkan akan muncul di daftar dengan opsi:

- **Aktifkan/Nonaktifkan**: Toggle untuk mengaktifkan atau menonaktifkan scraping
- **Uji**: Test scraping dari sumber tersebut
- **Hapus**: Hapus sumber scraping

### 4. Contoh Konfigurasi

#### KarirHub
```
Nama Sumber: KarirHub
Base URL: https://karirhub.com
Job List URL: https://karirhub.com/jobs
CSS Selector: .job-card a (atau biarkan kosong)
Interval: 6 jam
```

#### DNetwork
```
Nama Sumber: DNetwork
Base URL: https://dnetwork.id
Job List URL: https://dnetwork.id/lowongan
CSS Selector: .job-link (atau biarkan kosong)
Interval: 6 jam
```

#### JobStreet Indonesia
```
Nama Sumber: JobStreet Indonesia
Base URL: https://www.jobstreet.co.id
Job List URL: https://www.jobstreet.co.id/id/jobs
CSS Selector: a[data-testid="job-title-link"] (atau biarkan kosong)
Interval: 12 jam
```

## Cara Kerja Scraping

### 1. Manual Scraping (Sekarang)

Saat ini, scraping dilakukan secara manual melalui:
- **Halaman Ekstraksi Pekerjaan** (``/apps/admin/job-extraction``)
- Admin memasukkan URL pekerjaan secara manual
- Sistem mengekstrak detail pekerjaan

### 2. Otomatis Scraping (Future)

Untuk implementasi scraping otomatis, Anda perlu:

1. **Backend API** untuk scraping:
   - Endpoint untuk menjalankan scraping
   - Menggunakan library seperti `puppeteer`, `cheerio`, atau `playwright`
   - Mengikuti interval yang dikonfigurasi

2. **Database Table** untuk menyimpan konfigurasi:
   ```sql
   CREATE TABLE scraping_sources (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name TEXT NOT NULL,
     base_url TEXT NOT NULL,
     job_list_url TEXT NOT NULL,
     selector TEXT,
     enabled BOOLEAN DEFAULT true,
     interval_hours INTEGER DEFAULT 6,
     description TEXT,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

3. **Cron Job atau Scheduled Task**:
   - Menjalankan scraping sesuai interval
   - Menyimpan hasil ke database

## Troubleshooting

### Tidak Bisa Login sebagai Admin

1. **Cek User Metadata**:
   - Pastikan `user_type` di metadata adalah `"admin"`
   - Buka Supabase Dashboard → Authentication → Users
   - Klik user → Edit User Metadata

2. **Cek Email**:
   - Email harus sudah dikonfirmasi
   - Atau gunakan email dengan format `admin@` atau `@admin.inklusifkerja.id`

3. **Cek Password**:
   - Pastikan password benar
   - Jika lupa, reset melalui Supabase Dashboard

### Scraping Tidak Berfungsi

1. **Cek URL**:
   - Pastikan URL valid dan dapat diakses
   - Test URL di browser

2. **Cek CSS Selector**:
   - Gunakan browser DevTools untuk inspect elemen
   - Pastikan selector benar
   - Biarkan kosong jika tidak yakin (sistem akan menggunakan default)

3. **Cek Network**:
   - Pastikan website tidak memblokir scraping
   - Beberapa website memerlukan headers atau cookies

## Catatan Penting

1. **Keamanan**:
   - Jangan share kredensial admin
   - Gunakan password yang kuat
   - Hanya berikan akses admin kepada orang yang dipercaya

2. **Scraping Etis**:
   - Hormati `robots.txt` website
   - Jangan terlalu sering scraping (gunakan interval yang wajar)
   - Ikuti Terms of Service website yang di-scrape

3. **Data Storage**:
   - Saat ini, konfigurasi scraping disimpan di `localStorage`
   - Untuk production, gunakan database (Supabase)
   - Buat table `scraping_sources` seperti contoh di atas

## Next Steps

1. **Implementasi Backend Scraping**:
   - Buat API endpoint untuk scraping
   - Integrasikan dengan konfigurasi di database

2. **Scheduled Scraping**:
   - Setup cron job atau scheduled task
   - Otomatis scraping sesuai interval

3. **Error Handling**:
   - Logging untuk error scraping
   - Notifikasi jika scraping gagal

4. **Data Validation**:
   - Validasi data yang di-scrape
   - Filter duplikat
   - Quality check
