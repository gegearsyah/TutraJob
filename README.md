# 🎯 Inklusif Kerja

Platform rekrutmen yang mudah diakses untuk Indonesia - Aplikasi pencarian kerja yang dirancang khusus untuk pengguna tunanetra dengan fitur aksesibilitas lengkap.

## ✨ Fitur Utama

### 👤 Untuk Pencari Kerja
- ✅ **Gesture-based Navigation** - Geser kanan/kiri untuk melamar/melewatkan
- ✅ **Audio Feedback** - Semua aksi diumumkan dalam Bahasa Indonesia
- ✅ **Haptic Feedback** - Getaran untuk konfirmasi aksi
- ✅ **Screen Reader Support** - Kompatibel dengan TalkBack, VoiceOver, JAWS
- ✅ **Tutorial Interaktif** - Panduan step-by-step untuk semua fitur
- ✅ **Form Accessibility** - Form dengan audio guidance lengkap
- ✅ **Job Card System** - Sistem kartu pekerjaan yang mudah diakses
- ✅ **Application Tracking** - Lacak status lamaran Anda

### 🏢 Untuk Pemberi Kerja
- ✅ **Compliance Tracker** - Lacak kuota rekrutmen inklusif
- ✅ **Accessible Dashboard** - Dashboard yang mudah diakses
- ✅ **Job Posting** - Buat lowongan kerja dengan checker aksesibilitas

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm atau yarn
- Supabase account
- Git

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd TutraJob

# Install dependencies
npm install

# Setup environment variables
cp ENV_EXAMPLE.md .env.local
# Edit .env.local dengan credentials Anda

# Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📚 Documentation

- **[SETUP_ENV.md](./SETUP_ENV.md)** - Setup environment variables
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deploy ke Vercel
- **[AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md)** - Panduan autentikasi
- **[FEATURE_SPECIFICATION.md](./FEATURE_SPECIFICATION.md)** - Spesifikasi fitur lengkap
- **[TUTORIAL_GUIDE.md](./TUTORIAL_GUIDE.md)** - Panduan sistem tutorial
- **[FORM_ACCESSIBILITY_GUIDE.md](./FORM_ACCESSIBILITY_GUIDE.md)** - Panduan aksesibilitas form

## 🌐 Deployment

### Deploy ke Vercel

1. **Push ke Git**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy via Vercel Dashboard**
   - Import project dari Git repository
   - Set environment variables
   - Deploy!

Lihat **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** untuk panduan lengkap.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **PWA**: next-pwa
- **Language**: TypeScript
- **Accessibility**: WCAG 2.1 Level AA

## 📁 Project Structure

```
TutraJob/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── apps/         # Multi-tenant apps (learner, employer, gov)
│   │   └── layout.tsx    # Root layout
│   ├── components/       # React components
│   ├── lib/              # Utilities & helpers
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript types
├── supabase/             # Database schema & seeds
├── public/               # Static assets
└── docs/                # Documentation
```

## 🔐 Environment Variables

Lihat **[ENV_EXAMPLE.md](./ENV_EXAMPLE.md)** untuk daftar lengkap variabel environment.

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 🧪 Development

```bash
# Development server (webpack - for PWA)
npm run dev

# Development server (turbopack - faster, but PWA disabled)
npm run dev:turbo

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## ♿ Accessibility Features

- ✅ **WCAG 2.1 Level AA** compliant
- ✅ **Screen Reader** support (TalkBack, VoiceOver, JAWS)
- ✅ **Keyboard Navigation** - Full keyboard access
- ✅ **Touch Targets** - Minimum 48×48px
- ✅ **Audio Feedback** - All actions announced
- ✅ **Haptic Feedback** - Vibration patterns
- ✅ **High Contrast** - Support for high contrast mode
- ✅ **Focus Management** - Logical focus order

## 📝 License

Private - All rights reserved

## 👥 Contributors

- Development Team

---

**Made with ❤️ for accessible employment in Indonesia**
