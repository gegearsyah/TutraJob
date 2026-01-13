# 🔧 Setup Environment Variables

## Masalah: Variabel Environment Hilang

Jika Anda melihat pesan error "Variabel Environment Hilang" untuk:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Ini berarti file `.env.local` belum dibuat atau variabel belum diisi.

## ✅ Solusi

### 1. Buat File `.env.local`

Buat file `.env.local` di **root directory** project (sama level dengan `package.json`).

### 2. Copy Template dari `ENV_EXAMPLE.md`

**PENTING:** Jangan copy seluruh isi `ENV_EXAMPLE.md`! File tersebut berisi markdown formatting.

Yang perlu Anda copy adalah **hanya bagian di dalam code block** (antara ```env dan ```), **BUKAN** markdown syntax-nya.

**Cara yang benar:**
1. Buka `ENV_EXAMPLE.md`
2. Copy **hanya** bagian variabel environment (yang ada di dalam ```env ... ```)
3. **JANGAN** copy teks "Copy this to..." atau markdown code block markers (```env dan ```)
4. Paste ke `.env.local`

**Contoh yang SALAH:**
```env
# Environment Variables Example

Copy this to `.env.local` in the root directory...

```env
NEXT_PUBLIC_SUPABASE_URL=...
```

**Contoh yang BENAR:**
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 3. Isi Variabel Supabase (WAJIB)

Dapatkan nilai dari Supabase Dashboard:

1. Buka [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda
3. Pergi ke **Settings** → **API**
4. Copy nilai berikut:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Contoh `.env.local` Minimal

```env
# Supabase (WAJIB)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# OpenAI (Opsional - untuk fitur JD Reader)
OPENAI_API_KEY=sk-your-key-here
```

### 5. Verifikasi dengan Script Check

Jalankan script untuk memeriksa apakah variabel sudah benar:

```bash
node check-env.js
```

Script ini akan:
- ✅ Memeriksa apakah `.env.local` ada
- ✅ Memeriksa apakah variabel required sudah diisi
- ✅ Memeriksa format variabel

### 6. Restart Development Server

**PENTING:** Setelah membuat/mengubah `.env.local`, **WAJIB restart development server**:

```bash
# 1. Stop server (Ctrl+C di terminal yang menjalankan npm run dev)

# 2. Hapus cache Next.js (opsional tapi direkomendasikan)
rm -rf .next
# Atau di Windows:
rmdir /s /q .next

# 3. Jalankan lagi:
npm run dev
```

**Mengapa harus restart?**
- Next.js membaca `.env.local` saat **start**, bukan saat runtime
- Variabel `NEXT_PUBLIC_*` di-embed ke bundle saat build/start
- Perubahan `.env.local` tidak akan terdeteksi tanpa restart

## ⚠️ Catatan Penting

1. **`.env.local` tidak di-commit ke Git**
   - File ini sudah ada di `.gitignore`
   - Jangan share file ini ke public

2. **Variabel `NEXT_PUBLIC_*` harus diisi**
   - Variabel ini di-expose ke client-side
   - Harus diisi untuk aplikasi bisa berjalan

3. **Restart Server Setelah Perubahan**
   - Next.js membaca `.env.local` saat start
   - Perubahan tidak akan terdeteksi tanpa restart

4. **Format yang Benar**
   ```env
   # ✅ BENAR - tidak ada spasi, tidak ada quotes
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   
   # ❌ SALAH - ada spasi
   NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
   
   # ❌ SALAH - ada quotes (kecuali nilai mengandung spasi)
   NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
   ```

## 🔍 Verifikasi

Setelah setup, cek apakah variabel terdeteksi:

1. Restart server
2. Buka aplikasi di browser
3. Error message seharusnya hilang
4. Jika masih muncul, cek:
   - File `.env.local` ada di root directory
   - Tidak ada typo di nama variabel
   - Nilai variabel tidak kosong
   - Server sudah di-restart

## 📝 Dapatkan Supabase Credentials

Jika belum punya Supabase project:

1. Daftar di [supabase.com](https://supabase.com)
2. Buat project baru
3. Tunggu project selesai dibuat
4. Ambil credentials dari Settings → API
5. Copy ke `.env.local`

## 🆘 Masih Error?

Jika masih muncul error setelah setup:

### 1. Verifikasi dengan Script
```bash
node check-env.js
```

### 2. Cek Lokasi File
`.env.local` harus di **root directory** (sama level dengan `package.json`):
```
TutraJob/
├── .env.local          ← Di sini!
├── package.json
├── next.config.js
└── src/
```

### 3. Cek Format File
Pastikan format benar:
```env
# ✅ BENAR
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ❌ SALAH - ada spasi
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co

# ❌ SALAH - ada quotes (kecuali nilai mengandung spasi)
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"

# ❌ SALAH - masih placeholder
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
```

### 4. Restart Server dengan Clear Cache
```bash
# Stop server (Ctrl+C)

# Hapus cache
rm -rf .next
# Windows: rmdir /s /q .next

# Restart
npm run dev
```

### 5. Cek di Browser Console
Buka browser console (F12) dan ketik:
```javascript
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
```
Jika `undefined`, berarti:
- Server belum di-restart setelah membuat `.env.local`
- Atau variabel tidak di-embed dengan benar

### 6. Cek File Encoding
Pastikan `.env.local` menggunakan encoding **UTF-8** (bukan UTF-8 BOM)

### 7. Cek Apakah File Terbaca
Di terminal, jalankan:
```bash
# Windows PowerShell
Get-Content .env.local | Select-String "NEXT_PUBLIC_SUPABASE_URL"

# Windows CMD
findstr "NEXT_PUBLIC_SUPABASE_URL" .env.local
```
Pastikan output menampilkan variabel dengan nilai yang benar.

---

**Last Updated:** 2024
