# Multiple Creators Carousel - Implementation Guide

## What Changed ✅

The creator profile section now displays **multiple creators in a carousel** instead of just one person.

### New Files Created

1. **src/components/landing/CreatorsCarousel.tsx** ✨
   - Beautiful carousel component for displaying multiple creators
   - Auto-scroll every 5 seconds
   - Responsive: 1 item (mobile), 2 items (tablet), 3 items (desktop)
   - Navigation buttons and dot indicators
   - Click on dots to jump to specific creator
   - Pause on user interaction, resume after 5 seconds

2. **src/app/apps/admin/landing/creator/actions.ts** ✨
   - Server actions for managing creators
   - `getCreators()` - Fetch all active creators
   - `createCreator()` - Add new creator
   - `updateCreator()` - Edit existing creator
   - `deleteCreator()` - Remove creator

3. **supabase/landing-page-seed-multiple-creators.sql** ✨
   - Updated seed data with 4 example creators:
     - Dr. Budi Santoso (Founder & CEO)
     - Siti Nurhaliza (Chief Product Officer)
     - Ahmad Wijaya (Chief Technology Officer)
     - Rini Kartika (Head of Community)
   - Each with profile photo, bio, social links, and achievements

### Updated Files

1. **src/app/apps/admin/landing/creator/page.tsx** 🔧
   - Changed from single creator to **multiple creators list**
   - Form now supports adding many creators
   - Carousel preview in admin panel
   - Edit/delete individual creators
   - Add achievements per creator
   - Add social media links per creator

---

## Admin Features (Updated)

### Add Multiple Creators

1. Go to `/apps/admin/landing/creator`
2. Fill form with creator details:
   - Name (required)
   - Title/Position (required)
   - Bio/Description (required)
   - Profile Image URL
   - Social Links (LinkedIn, Twitter, GitHub, Website)
   - Achievements (multiple)
3. Click "Simpan" to add
4. Creator appears in carousel on landing page

### Edit Creator

1. Click "Edit" on creator card
2. Update any fields
3. Click "Perbarui" to save changes

### Delete Creator

1. Click trash icon on creator card
2. Confirm deletion
3. Creator removed from carousel

### Sort Creators

- Creators display in `order_index` sequence
- Adjust order_index in form to reorder

---

## Landing Page Display

### Creators Carousel Component

```tsx
import CreatorsCarousel from '@/components/landing/CreatorsCarousel';

export default function LandingPage({ creators }: Props) {
  return (
    <section>
      <h2>Tim Pembuat Platform</h2>
      <CreatorsCarousel 
        creators={creators}
        autoplay={true}
        autoplayInterval={5000}
      />
    </section>
  );
}
```

### Responsive Behavior

- **Mobile (< 640px)**: Shows 1 creator card
- **Tablet (640px - 1024px)**: Shows 2 creator cards
- **Desktop (1024px+)**: Shows 3 creator cards

### Auto-Scroll

- Automatically rotates every 5 seconds
- Pauses when user clicks navigation buttons
- Resumes after 5 seconds of inactivity
- Previous/Next buttons visible when more creators than visible

---

## Database Structure

### landing_creator_profile Table

```sql
CREATE TABLE landing_creator_profile (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,                 -- Creator's full name
  title TEXT NOT NULL,                -- Job title/position
  bio TEXT NOT NULL,                  -- Description/bio
  image_url TEXT,                     -- Profile photo URL
  social_links JSONB,                 -- {linkedin, twitter, github, website}
  achievements TEXT[],                -- Array of achievements
  order_index INTEGER,                -- Display order in carousel
  is_active BOOLEAN,                  -- Show on landing page
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  created_by UUID,
  updated_by UUID
);
```

---

## Setup Instructions

### 1. Load Multiple Creators Seed Data

```sql
-- In Supabase SQL Editor:
-- Run: supabase/landing-page-seed-multiple-creators.sql
```

This adds 4 example creators to test the carousel.

### 2. Or Clean Old Single Creator Data

If you previously had only one creator:

```sql
-- Keep only 4 creators (example data)
-- Remove old single creator
DELETE FROM public.landing_creator_profile 
WHERE order_index IS NULL 
  OR order_index > 4;
```

### 3. Update Landing Page Integration

Ensure your landing page component uses:

```tsx
import CreatorsCarousel from '@/components/landing/CreatorsCarousel';

// In your landing page component:
<CreatorsCarousel creators={creators} autoplay={true} autoplayInterval={5000} />
```

---

## Data Structure Per Creator

Each creator has:

```typescript
{
  id: "uuid",
  name: "Dr. Budi Santoso",
  title: "Founder & CEO",
  bio: "Visioner platform dengan 15+ tahun di tech industry...",
  image_url: "https://images.unsplash.com/...",
  social_links: {
    linkedin: "https://linkedin.com/in/budisantoso",
    twitter: "https://twitter.com/budisantoso",
    github: "https://github.com/budisantoso",
    website: "https://budisantoso.id"
  },
  achievements: [
    "Founder Inklusif Kerja",
    "15+ tahun di Tech Industry",
    "WCAG 2.1 Expert",
    "Social Entrepreneur"
  ],
  order_index: 0,
  is_active: true,
  created_at: "2026-01-31T...",
  updated_at: "2026-01-31T..."
}
```

---

## Carousel Features

### Visual Design
- Beautiful card layout with photo
- Name, title, and bio visible
- Top 2 achievements shown
- Social media links displayed
- Active/inactive status badge

### Navigation
- **Previous Button** - Goes to previous item (disabled at start)
- **Next Button** - Goes to next item (disabled at end)
- **Dot Indicators** - Click to jump to specific page
- **Auto-scroll** - Rotates every 5 seconds

### Responsiveness
- Cards stack to fit screen
- Buttons remain accessible on all sizes
- Touch-friendly on mobile (48px+ targets)
- Smooth transitions between slides

### Accessibility (WCAG 2.1 AA)
- Keyboard navigation (arrow keys)
- Screen reader support
- Proper ARIA labels
- 48px+ touch targets
- High contrast buttons

---

## Example Admin Flow

1. **Create First Creator:**
   - Name: "Founder Name"
   - Title: "Founder & CEO"
   - Bio: "Founder biography..."
   - Photo: Upload or paste image URL
   - Achievements: Add 3-5 key achievements
   - Click "Simpan"

2. **Create Second Creator:**
   - Repeat above
   - Different name and role
   - Different photo

3. **View on Landing:**
   - Go to home page
   - Scroll to "Tim Pembuat" section
   - See carousel with both creators
   - Carousel auto-scrolls between them

4. **Edit Creator:**
   - Go back to admin
   - Click "Edit" on any creator
   - Update information
   - Click "Perbarui"
   - Changes appear on landing immediately

---

## File Inventory

```
✅ Created:
  src/components/landing/CreatorsCarousel.tsx
  src/app/apps/admin/landing/creator/actions.ts
  supabase/landing-page-seed-multiple-creators.sql

🔧 Updated:
  src/app/apps/admin/landing/creator/page.tsx
  (converted from single to multiple creators)

📊 Database:
  landing_creator_profile table (already exists, now supports multiple)
```

---

## Next Steps

1. **Run seed data:**
   ```sql
   -- Run: supabase/landing-page-seed-multiple-creators.sql
   ```

2. **Test admin page:**
   - Go to `/apps/admin/landing/creator`
   - Should see list of 4 creators
   - Try adding new creator
   - Try editing/deleting

3. **Test landing page:**
   - Go to `/` (home)
   - Look for creator carousel section
   - Watch it auto-scroll between creators
   - Click buttons and dots to navigate

4. **Customize:**
   - Replace example photos with real URLs
   - Update creator names/roles
   - Add your team members
   - Reorder using order_index

---

## Comparison: Before vs After

### Before (Single Creator)
```
Admin Page: Shows one form for one creator
Landing: Shows single static creator profile
Database: Only supports one creator
```

### After (Multiple Creators Carousel)
```
Admin Page: List of creators with add/edit/delete
Landing: Beautiful carousel that auto-scrolls
Database: Supports unlimited creators
Navigation: Buttons, dots, keyboard navigation
```

---

**Status:** ✅ Ready to Use  
**Last Updated:** January 31, 2026  
**Tested:** Admin pages, carousel component, server actions
