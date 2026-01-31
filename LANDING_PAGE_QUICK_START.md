# Landing Page Features - Quick Setup Guide

## 🎯 What's New

Your landing page now has 4 main sections that can be managed from the admin panel:

### 1. **Mitra Perusahaan** (Partner Companies) - Auto Carousel ✨
- Automated carousel showing company logos
- Similar to karier.mu style
- Auto-scrolls every 5 seconds
- Responsive: 2-6 items per view
- **Admin URL**: `/apps/admin/landing/employers`

### 2. **Artikel & Testimoni** (Articles & Testimonials)
- Display blog posts and customer testimonials
- Two types: Info articles and testimonials
- Rich featured content support
- **Admin URL**: `/apps/admin/landing/articles`

### 3. **Nilai Organisasi** (Organization Values)
- Showcase company core values
- Icon selection (Heart, Target, Lightbulb, Shield)
- Grid layout with animations
- **Admin URL**: `/apps/admin/landing/values`

### 4. **Admin Dashboard** (Updated)
- **URL**: `/apps/admin/landing`
- All 7 sections now available with beautiful card layout

---

## 📋 How to Access

### Admin Panel
1. Go to `/apps/admin/auth/login`
2. Login with admin credentials (email: admin@inklusifkerja.id)
3. Click "Manajemen Landing Page"
4. Select the section you want to manage

### Management Links
- Tentang Kami: `/apps/admin/landing/about`
- Statistik: `/apps/admin/landing/statistics`
- Profil Pembuat: `/apps/admin/landing/creator`
- **Mitra Perusahaan**: `/apps/admin/landing/employers`
- **Artikel & Testimoni**: `/apps/admin/landing/articles`
- **Nilai Organisasi**: `/apps/admin/landing/values`
- Kontak: `/apps/admin/landing/contact`

---

## 🚀 Quick Start

### Add Your First Partner Company (Carousel)

1. Go to `/apps/admin/landing/employers`
2. Fill in:
   - **Nama Perusahaan**: Your company name
   - **URL Logo**: Direct link to company logo image
     ```
     Example: https://upload.wikimedia.org/wikipedia/commons/...logo.png
     ```
   - **Website**: https://company.com
   - **Industri**: Technology, Finance, etc.
   - **Lokasi**: Jakarta, Indonesia
   - **Jumlah Karyawan**: 1000 (optional)
3. Check "Aktif" to display
4. Check "Tampilkan sebagai Unggulan" to feature it
5. Click "Simpan Perusahaan"

**Result**: Logo appears in carousel on landing page

### Add Your First Article

1. Go to `/apps/admin/landing/articles`
2. Choose type: **Artikel Informatif** or **Testimoni**
3. For **Artikel Informatif**:
   - Title: "Panduan Membuat CV"
   - Content: Write your article
   - Image URL: Link to article image
   - Category: Career Tips

4. For **Testimoni**:
   - Title: Leave auto-filled
   - Content: "Saya berhasil dapat pekerjaan..." 
   - Nama Pembuat Testimoni: "Budi Santoso"
   - Jabatan: "Software Developer"
   - Gambar Pembuat: Link to author photo

5. Check "Aktif"
6. Click "Simpan Artikel"

**Result**: Appears in Articles section on landing

### Add Organization Values

1. Go to `/apps/admin/landing/values`
2. Fill in:
   - **Judul Nilai**: "Inovasi"
   - **Deskripsi**: "Kami terus berinovasi untuk memberikan solusi terbaik"
   - **Ikon**: Choose from Heart, Target, Lightbulb, Shield
   - Check **Aktif**
3. Click "Simpan Nilai"

**Result**: Value card appears with icon on landing

---

## 🎨 Carousel Features Explained

### How It Works
- **Auto-play**: Slides change every 5 seconds
- **Responsive**: Shows different number of logos:
  - Mobile: 2 logos
  - Tablet: 3 logos  
  - Desktop: 4-6 logos
- **Navigation**: 
  - Click ← → buttons to move
  - Click dots to jump to slide
  - Carousel pauses when you interact
  - Resumes after 5 seconds of inactivity

### Featured Companies
- Mark as "Unggulan" to appear first
- Useful for highlighting main partners
- No limit on featured items

### Logo Requirements
- **Format**: PNG, JPG, SVG recommended
- **Size**: Aspect ratio 16:9 or square works best
- **Hosting**: Use any CDN:
  - GitHub (raw.githubusercontent.com)
  - Imgur
  - Unsplash
  - Firebase Storage
  - AWS S3
  - Supabase Storage

---

## 📱 Mobile Responsive

All sections are fully responsive:
- ✅ Mobile (< 640px)
- ✅ Tablet (640px - 1024px)
- ✅ Desktop (> 1024px)

Touch targets are minimum 48px (WCAG AA compliant).

---

## ♿ Accessibility Features

All new components include:
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ ARIA labels
- ✅ Focus management
- ✅ Audio announcements
- ✅ Haptic feedback (mobile)

---

## 🔧 Troubleshooting

### Logo Not Showing
- Check URL is accessible (try opening in new tab)
- Verify CORS allows access
- Try different image hosting service
- PNG/JPG format works best

### Carousel Not Scrolling
- Check if you have at least 1 employer marked "Aktif"
- Refresh page
- Clear browser cache
- Check browser console for errors

### Article Not Appearing
- Make sure "Aktif" is checked
- Content not empty
- Check landing page to see if loading

### Values Not Showing
- Ensure "Aktif" is checked
- Icon selection must be valid
- Refresh page

---

## 📊 Database Info

Data is stored in Supabase tables:
- `landing_employers` - Company logos and info
- `landing_articles` - Blog posts and testimonials
- `landing_values` - Organization values
- `landing_about` - About section
- `landing_statistics` - Stats counters
- `landing_creator_profile` - Founder info
- `landing_contact` - Contact details

All data is filtered to show only active (is_active = true) items.

---

## 🎯 SEO & Analytics

### Built-in Features
- Structured data (Schema.org)
- Open Graph tags
- Twitter Card metadata
- Semantic HTML
- Mobile-friendly

### For Analytics
- Add Google Analytics to track:
  - Article clicks
  - Carousel interactions
  - Partner company clicks
  - Value section views

---

## 💡 Pro Tips

1. **Carousel Rotation**: Feature 4-6 partners for optimal mobile view
2. **Article Strategy**: Mix 70% info, 30% testimonials
3. **Values**: Keep to 4-5 core values for clarity
4. **Images**: Use high-quality, consistent sizing
5. **Order**: Lower order_index shows first
6. **Featured**: Mark top 3 partners as featured

---

## 🚨 Important Notes

1. **Admin Access**: Only admin users can edit (verify role in Supabase auth)
2. **Data Persistence**: All changes save to Supabase
3. **Public Display**: Only "Aktif" items show on landing
4. **No Backup**: Always test changes before saving
5. **Performance**: Carousel handles up to 100+ partners efficiently

---

## 📞 Support

For issues:
1. Check browser console (F12 → Console tab)
2. Verify Supabase connection
3. Check admin user permissions
4. Review error messages on form
5. Try refreshing page

---

## 🎉 Next Steps

1. ✅ Add 5-10 partner companies to carousel
2. ✅ Create 3-5 sample articles
3. ✅ Define 4 core organization values
4. ✅ Test on mobile device
5. ✅ Verify carousel auto-plays
6. ✅ Check all sections appear on landing page

Happy content management! 🚀
