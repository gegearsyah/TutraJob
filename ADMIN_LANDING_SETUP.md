# Admin Landing Page - Complete Setup Guide

## Problem Summary

You're seeing "Supabase error loading values: {}" in the admin pages because:

1. **Tables may not exist** - Run migration first
2. **RLS policies blocking admin** - The policies check `raw_user_meta_data` but your user has `user_metadata`
3. **Authentication context mismatch** - The RLS check and app logic use different metadata fields

## Solution (Step by Step)

### Step 1: Run Database Schema Migration

⚠️ **This is REQUIRED first**

**In Supabase Dashboard:**

1. Go to **SQL Editor** → **New Query**
2. Open file: `supabase/landing-page-schema.sql`
3. Copy entire contents
4. Paste into Supabase SQL Editor
5. Click **Run**
6. Wait for success ✓

**Expected output:** 
```
CREATE TABLE
7 tables created
Indexes created
RLS enabled
Policies created
Triggers created
```

### Step 2: Fix RLS Policies

After schema is created, run the RLS fix:

**In Supabase Dashboard:**

1. Go to **SQL Editor** → **New Query**
2. Open file: `supabase/fix-rls-policies.sql`
3. Copy entire contents
4. Paste into new query
5. Click **Run**
6. Wait for success ✓

**This creates:**
- Helper function `is_admin()` that checks both metadata formats
- New RLS policies that allow admin read/write
- Public read policies for active content

### Step 3: Seed Sample Data

**In Supabase Dashboard:**

1. Go to **SQL Editor** → **New Query**
2. Open file: `supabase/landing-page-seed.sql`
3. Copy entire contents
4. Paste into new query
5. Click **Run**
6. Wait for success ✓

**Expected:** Sample data added to all tables

### Step 4: Verify Your Admin User

Your user account needs `user_type = 'admin'` in Supabase auth metadata.

**Check in Supabase Dashboard:**

1. Go to **Authentication** → **Users**
2. Click your user account
3. Scroll to **Raw App Metadata**
4. Should see:
   ```json
   {
     "user_type": "admin"
   }
   ```

**If missing, add it:**

1. Click the "..." menu next to your user
2. Select **Edit User**
3. Update **Raw App Metadata**:
   ```json
   {
     "user_type": "admin"
   }
   ```
4. Click **Save**

OR use the SQL command:

```sql
-- Update specific user to admin
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{user_type}',
  '"admin"'
)
WHERE email = 'your-email@example.com';
```

### Step 5: Test Admin Features

After all setup is complete:

1. Go to http://localhost:3000/apps/admin/landing
2. Click **"Kelola Artikel"** (Articles)
3. Should see list (might be empty or have seed data)
4. Click **"Tambah Artikel"** to add new article
5. Fill form and click **Simpan**
6. Article should appear in list
7. Try **"Kelola Perusahaan"** (Employers)
8. Try **"Kelola Nilai"** (Values)

**If you see errors:**

Open browser **DevTools** (F12) → **Console** tab:
- Look for detailed error messages
- They now show: `message`, `code`, `details`, `hint`
- Share these details if you need help

---

## File Checklist

✅ **Schema Files (in `supabase/`):**
- [ ] `landing-page-schema.sql` - Main schema (RUN FIRST)
- [ ] `fix-rls-policies.sql` - Fixed RLS policies (RUN SECOND)
- [ ] `landing-page-seed.sql` - Sample data (RUN THIRD)

✅ **Admin Page Files (already created):**
- [ ] `src/app/apps/admin/landing/articles/page.tsx`
- [ ] `src/app/apps/admin/landing/employers/page.tsx`
- [ ] `src/app/apps/admin/landing/values/page.tsx`

✅ **Documentation Files (already created):**
- [ ] `LANDING_PAGE_FEATURES_SUMMARY.md`
- [ ] `LANDING_PAGE_QUICK_START.md`
- [ ] `CAROUSEL_TECHNICAL_GUIDE.md`
- [ ] `LANDING_PAGE_CONTENT_GUIDE.md`

---

## What Each Migration Does

### landing-page-schema.sql
- Creates 7 tables:
  - `landing_about` - About Us content
  - `landing_statistics` - Statistics (job seekers, positions, employers)
  - `landing_creator_profile` - Creator/founder profile
  - `landing_employers` - Partner companies
  - `landing_articles` - Articles & testimonials
  - `landing_values` - Organization values
  - `landing_contact` - Contact information

- Enables Row Level Security (RLS)
- Creates basic RLS policies (public read, admin write)
- Creates triggers for `updated_at` timestamps
- Creates indexes for performance

### fix-rls-policies.sql
- Creates `is_admin()` function that checks:
  - `raw_user_meta_data->>'user_type' = 'admin'`
  - Email ends with `@admin.inklusifkerja.id`
  - Email starts with `admin@`

- Replaces all RLS policies with clearer, more flexible ones
- Separates public read policies from admin policies
- Fixes the metadata format mismatch issue

### landing-page-seed.sql
- Adds initial data:
  - About Us content
  - 3 statistics
  - Creator profile
  - 4 organization values
  - 3 contact methods

---

## Troubleshooting

### "Supabase error loading values: {}"

**Causes and fixes:**

1. **Tables don't exist**
   - Fix: Run `landing-page-schema.sql`

2. **RLS policies blocking**
   - Fix: Run `fix-rls-policies.sql`

3. **User not marked as admin**
   - Fix: Check auth metadata (see Step 4 above)

4. **Metadata field mismatch**
   - Fix: `fix-rls-policies.sql` creates `is_admin()` function that checks both

### Error appears but landing page works

This is a **sign that RLS needs fixing**:
- Landing page uses `supabaseAdmin` (server-side) - bypasses RLS
- Admin pages use `supabase` (browser client) - respects RLS

**Fix:** Run `fix-rls-policies.sql`

### "Akses ditolak" or "Access Denied"

Your user doesn't have `user_type = 'admin'`:
- Check Step 4 above
- Update auth metadata
- Log out and log back in

### Form saves but data doesn't appear

1. Check browser DevTools Console for errors
2. Verify RLS policies allow INSERT/UPDATE
3. Check that record has `is_active = true`
4. Refresh page manually (sometimes UI doesn't update)

### "relation "landing_articles" does not exist"

**Tables not created yet:**
- Run `landing-page-schema.sql` first

### All three admin pages showing same error

**Systematic issue:**
1. Verify tables exist: Run in Supabase SQL Editor:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name LIKE 'landing_%';
   ```
2. Should see 7 tables. If missing, run `landing-page-schema.sql`

3. Check RLS policies:
   ```sql
   SELECT tablename, policyname FROM pg_policies 
   WHERE tablename LIKE 'landing_%';
   ```
4. Should see many policies. If missing or different, run `fix-rls-policies.sql`

---

## Recommended Order

1. **Run migrations first** (in this order):
   ```
   1. landing-page-schema.sql
   2. fix-rls-policies.sql
   3. landing-page-seed.sql
   ```

2. **Verify admin user** has `user_type = 'admin'`

3. **Test each admin page**:
   - Articles
   - Employers
   - Values

4. **Add sample content** through admin UI

5. **Check landing page** to see content displayed

---

## Admin Pages Quick Reference

### Articles Admin
- **URL:** `/apps/admin/landing/articles`
- **Create:** Add articles (info) or testimonials
- **Edit:** Modify existing content
- **Delete:** Remove with confirmation
- **Features:** Type selector, featured toggle, active toggle

### Employers Admin
- **URL:** `/apps/admin/landing/employers`
- **Create:** Add partner companies with logo
- **Edit:** Modify company info
- **Delete:** Remove from carousel
- **Features:** Logo preview, featured sort, carousel integration

### Values Admin
- **URL:** `/apps/admin/landing/values`
- **Create:** Add organization values (max 6 recommended)
- **Edit:** Change title, description, icon
- **Delete:** Remove value
- **Features:** Icon picker (4 options), active toggle

---

## Next Steps After Setup

1. **Add content:**
   - Go to each admin page
   - Add 3-5 articles/testimonials
   - Add 8-12 partner companies
   - Add 4-6 organization values

2. **Customize carousel:**
   - Mark important employers as "Featured"
   - Featured employers appear first in carousel

3. **Test responsive:**
   - Open landing page on mobile
   - Verify carousel shows 2 items on mobile
   - Verify auto-scroll works

4. **Test accessibility:**
   - Navigate with keyboard only
   - Test with screen reader
   - Verify 48px+ touch targets

---

## Support

If you still see errors after following these steps:

1. **Take a screenshot** of the browser console error
2. **Note the error details:**
   - Error code
   - Error message
   - Which admin page
   - Which action (load, save, delete)
3. **Check:**
   - Did you run all 3 SQL migrations?
   - Is your user marked as admin in Supabase?
   - Do the tables exist in Supabase?

---

**Last Updated:** January 31, 2026  
**Status:** ✅ Ready for Setup
