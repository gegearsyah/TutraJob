# 🚀 Quick Vercel Deployment Guide

## Step 1: Initialize Git (Jika Belum)

```bash
git init
git add .
git commit -m "Initial commit: Inklusif Kerja"
```

## Step 2: Push ke GitHub/GitLab

```bash
# Buat repository baru di GitHub/GitLab, lalu:
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main
```

## Step 3: Deploy ke Vercel

### Via Dashboard (Recommended)

1. **Login ke [vercel.com](https://vercel.com)**
2. **Klik "Add New Project"**
3. **Import Git Repository** - Pilih repository Anda
4. **Configure:**
   - Framework: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. **Environment Variables:**
   - Klik "Environment Variables"
   - Tambahkan semua variabel dari `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY
     SUPABASE_SERVICE_ROLE_KEY
     NEXT_PUBLIC_APP_URL
     OPENAI_API_KEY (optional)
     ```
   - Set untuk: **Production**, **Preview**, **Development**

6. **Deploy!**
   - Klik "Deploy"
   - Tunggu build selesai (~2-3 menit)
   - Aplikasi live di `https://your-project.vercel.app`

### Via CLI

```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

## Step 4: Post-Deployment

### 1. Update Supabase Auth URLs

Di Supabase Dashboard → Authentication → URL Configuration:

- **Site URL**: `https://your-app.vercel.app`
- **Redirect URLs**: 
  - `https://your-app.vercel.app/**`
  - `https://your-app.vercel.app/apps/learner/auth/callback`
  - `https://your-app.vercel.app/apps/employer/auth/callback`

### 2. Update NEXT_PUBLIC_APP_URL

Di Vercel Dashboard → Environment Variables:
- Update `NEXT_PUBLIC_APP_URL` ke production URL
- Redeploy

### 3. Test Application

- ✅ Landing page
- ✅ Login/Signup
- ✅ Supabase connection
- ✅ PWA features

## 🔄 Auto-Deploy

Setelah setup, setiap push ke `main` branch akan auto-deploy:

```bash
git add .
git commit -m "Update"
git push origin main
# → Vercel auto-deploys
```

## 📊 Monitoring

- **Logs**: Vercel Dashboard → Deployments → [Deployment] → Logs
- **Analytics**: Enable di Project Settings
- **Errors**: Check Function Logs

## 🐛 Troubleshooting

**Build fails?**
- Check build logs di Vercel
- Verify all environment variables are set
- Check `package.json` dependencies

**Supabase connection fails?**
- Verify environment variables
- Check Supabase Auth redirect URLs
- Verify Supabase project is active

---

**Lihat [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) untuk panduan lengkap**
