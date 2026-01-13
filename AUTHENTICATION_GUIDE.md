# 🔐 Authentication Guide - Inklusif Kerja

## 📍 Where to Login

### For Job Seekers (Pencari Kerja)

1. **From Landing Page:**
   - Visit: `http://localhost:3000/` (or your domain)
   - Click: **"Masuk sebagai Pencari Kerja"** button
   - Direct URL: `/apps/learner/auth/login`

2. **From Profile Page:**
   - Visit: `/apps/learner/profile`
   - If not logged in, you'll see login/signup buttons
   - Click: **"Masuk"** button

3. **Direct Login URL:**
   ```
   /apps/learner/auth/login
   ```

4. **Signup URL:**
   ```
   /apps/learner/auth/signup
   ```

### For Employers (Pemberi Kerja)

1. **From Landing Page:**
   - Visit: `http://localhost:3000/` (or your domain)
   - Click: **"Masuk sebagai Pemberi Kerja"** button
   - Direct URL: `/apps/employer/auth/login`

2. **Direct Login URL:**
   ```
   /apps/employer/auth/login
   ```

3. **Signup URL:**
   ```
   /apps/employer/auth/signup
   ```

## 🎯 Quick Access Links

### Job Seeker Portal
- **Main Portal:** `/apps/learner`
- **Browse Jobs:** `/apps/learner/jobs`
- **My Profile:** `/apps/learner/profile`
- **My Applications:** `/apps/learner/applications`
- **Saved Jobs:** `/apps/learner/saved`
- **Login:** `/apps/learner/auth/login`
- **Signup:** `/apps/learner/auth/signup`

### Employer Portal
- **Main Portal:** `/apps/employer`
- **Compliance Tracker:** `/apps/employer/compliance`
- **Login:** `/apps/employer/auth/login`
- **Signup:** `/apps/employer/auth/signup`

## ✨ Features Added

### 🔐 Authentication System
- ✅ **Learner Login/Signup** - Full authentication flow for job seekers
- ✅ **Employer Login/Signup** - Company registration and login
- ✅ **Accessible Forms** - All forms meet WCAG 2.1 Level AA
- ✅ **Haptic & Audio Feedback** - Feedback for all actions
- ✅ **Password Visibility Toggle** - Show/hide password for accessibility
- ✅ **Error Handling** - Clear error messages in Indonesian

### 📋 Job Features
- ✅ **Full Job Description Modal** - Expanded detail view with all job information
- ✅ **Job Detail Integration** - Double-tap or click to view full details
- ✅ **Accessible Modal** - Keyboard navigation, ARIA labels, screen reader support

### 🧭 Navigation
- ✅ **Login Links on Landing Page** - Easy access from homepage
- ✅ **Login Links on Profile Page** - Redirect when not authenticated
- ✅ **Signup Links** - Easy registration flow

## 🚀 How to Use

### For First-Time Users

1. **Job Seekers:**
   - Go to landing page (`/`)
   - Click "Masuk sebagai Pencari Kerja" or "Portal Pencari Kerja"
   - Click "Daftar di sini" to create account
   - Fill in: Full Name, Email, Password
   - Check email for verification
   - Login and complete your profile

2. **Employers:**
   - Go to landing page (`/`)
   - Click "Masuk sebagai Pemberi Kerja" or "Portal Pemberi Kerja"
   - Click "Daftar di sini" to create company account
   - Fill in: Company Name, Contact Name, Email, Password
   - Check email for verification
   - Login to access dashboard

### Viewing Job Details

1. **From Job Cards:**
   - Double-tap on any job card
   - Or click "Lihat Detail" button
   - Full modal opens with complete information

2. **From Job Detail Modal:**
   - View complete job description
   - See all requirements and benefits
   - Check accessibility details
   - Apply directly from modal
   - Open original job posting

## 🔒 Security Notes

- All passwords are hashed by Supabase Auth
- Email verification required for new accounts
- Session management handled by Supabase
- RLS (Row Level Security) policies protect user data

## 📱 Accessibility Features

- ✅ **Screen Reader Support** - All forms announced properly
- ✅ **Keyboard Navigation** - Full keyboard access
- ✅ **Touch Targets** - Minimum 48×48px for all buttons
- ✅ **ARIA Labels** - Complete labeling for assistive technologies
- ✅ **Audio Feedback** - All actions announced in Indonesian
- ✅ **Haptic Feedback** - Vibration patterns for actions

## 🐛 Troubleshooting

### Can't Login?
1. Check if email is verified (check spam folder)
2. Verify password is correct
3. Try resetting password (link on login page)
4. Check browser console for errors

### Can't Access Profile?
1. Make sure you're logged in
2. Check if you're on the correct portal (`/apps/learner` for job seekers)
3. Try logging out and back in

### Modal Not Opening?
1. Make sure JavaScript is enabled
2. Check browser console for errors
3. Try double-tapping the job card
4. Use the "Lihat Detail" button as alternative

---

**Last Updated:** 2024
**Status:** All authentication features complete and tested
