# 🚀 Deployment Guide - Vercel

Panduan lengkap untuk deploy aplikasi Inklusif Kerja ke Vercel.

## 📋 Prerequisites

1. **Akun Vercel** - Daftar di [vercel.com](https://vercel.com)
2. **Akun Supabase** - Sudah setup project Supabase
3. **Git Repository** - Project sudah di-initialize dengan Git
4. **Environment Variables** - Siapkan semua variabel yang diperlukan

## 🔧 Setup Git (Jika Belum)

### 1. Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit: Inklusif Kerja - Accessible Job Platform"
```

### 2. Buat Repository di GitHub/GitLab

1. Buat repository baru di GitHub/GitLab
2. Jangan initialize dengan README (sudah ada)
3. Copy URL repository

### 3. Connect Local Repository

```bash
git remote add origin <your-repository-url>
git branch -M main
git push -u origin main
```

## 🌐 Deploy ke Vercel

### Metode 1: Via Vercel Dashboard (Recommended)

1. **Login ke Vercel**
   - Buka [vercel.com](https://vercel.com)
   - Login dengan GitHub/GitLab/Bitbucket

2. **Import Project**
   - Klik "Add New Project"
   - Pilih repository yang sudah di-push ke Git
   - Vercel akan auto-detect Next.js

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (root)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Environment Variables**
   - Klik "Environment Variables"
   - Tambahkan semua variabel dari `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY
     SUPABASE_SERVICE_ROLE_KEY
     OPENAI_API_KEY (optional)
     NEXT_PUBLIC_APP_URL
     ```
   - **PENTING**: Set untuk semua environments (Production, Preview, Development)

5. **Deploy**
   - Klik "Deploy"
   - Tunggu build selesai
   - Aplikasi akan live di URL yang diberikan Vercel

### Metode 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## 🔐 Environment Variables di Vercel

### Required Variables

Tambahkan di Vercel Dashboard → Project Settings → Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Optional Variables

```env
OPENAI_API_KEY=sk-your-key-here
NODE_ENV=production
```

### Tips

- ✅ Set untuk **Production**, **Preview**, dan **Development**
- ✅ Jangan commit `.env.local` ke Git (sudah di `.gitignore`)
- ✅ Update `NEXT_PUBLIC_APP_URL` setelah deploy pertama kali

## 🌍 Custom Domain (Optional)

1. **Di Vercel Dashboard**
   - Project Settings → Domains
   - Add domain: `inklusifkerja.id` (contoh)
   - Follow DNS setup instructions

2. **Update Environment Variable**
   - Update `NEXT_PUBLIC_APP_URL` ke custom domain
   - Redeploy

## 🔄 Continuous Deployment

Vercel akan auto-deploy setiap kali Anda push ke:
- **main/master branch** → Production
- **Other branches** → Preview deployments

### Workflow

```bash
# Development
git checkout -b feature/new-feature
# ... make changes ...
git commit -m "Add new feature"
git push origin feature/new-feature
# → Vercel creates preview deployment

# Production
git checkout main
git merge feature/new-feature
git push origin main
# → Vercel deploys to production
```

## 📝 Post-Deployment Checklist

### 1. Verify Environment Variables
- ✅ Semua variabel sudah di-set di Vercel
- ✅ `NEXT_PUBLIC_APP_URL` sudah di-update ke production URL

### 2. Test Application
- ✅ Landing page bisa diakses
- ✅ Login/Signup berfungsi
- ✅ Supabase connection working
- ✅ PWA features working

### 3. Supabase Configuration
- ✅ Update Supabase Auth redirect URLs:
  - Go to Supabase Dashboard → Authentication → URL Configuration
  - Add: `https://your-app.vercel.app/**`
  - Add: `https://your-app.vercel.app/apps/learner/auth/callback`
  - Add: `https://your-app.vercel.app/apps/employer/auth/callback`

### 4. Database
- ✅ Run migrations jika ada
- ✅ Seed initial data jika diperlukan

## 🐛 Troubleshooting

### Build Fails

**Error: Missing environment variables**
- ✅ Pastikan semua `NEXT_PUBLIC_*` variabel sudah di-set di Vercel
- ✅ Check Vercel build logs untuk detail error

**Error: Module not found**
- ✅ Pastikan semua dependencies ada di `package.json`
- ✅ Run `npm install` lokal untuk verify

### Runtime Errors

**Supabase connection fails**
- ✅ Check `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ Verify Supabase project masih active
- ✅ Check Supabase Auth redirect URLs

**PWA not working**
- ✅ Check `next-pwa` configuration
- ✅ Verify service worker di browser DevTools

## 📊 Monitoring

### Vercel Analytics (Optional)

1. Enable Vercel Analytics di Project Settings
2. Track performance dan errors
3. Monitor user behavior

### Logs

- View logs di Vercel Dashboard → Deployments → [Deployment] → Logs
- Real-time logs untuk debugging

## 🔄 Update Deployment

Setelah setup, setiap push ke Git akan trigger auto-deploy:

```bash
git add .
git commit -m "Update feature"
git push origin main
# → Vercel auto-deploys
```

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase with Vercel](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)

## ✅ Quick Start Commands

```bash
# 1. Initialize Git (if not done)
git init
git add .
git commit -m "Initial commit"

# 2. Connect to remote
git remote add origin <your-repo-url>
git push -u origin main

# 3. Deploy to Vercel
# Via Dashboard: Import project from Git
# Via CLI: vercel --prod
```

---

**Last Updated:** 2024
**Status:** Ready for Vercel deployment
