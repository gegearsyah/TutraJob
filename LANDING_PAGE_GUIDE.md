# Landing Page Implementation Guide

## Overview

This guide covers the landing page implementation with all required sections, admin CRUD functionality, SEO optimization, and PwD (People with Disabilities) UX compliance.

## Features Implemented

### 1. Landing Page Sections

- ✅ **About Us & Why We're Different** - Company information and unique selling points
- ✅ **Statistics** - Dynamic statistics display (Job Seekers, Job Positions, Employers)
- ✅ **Creator Profile** - Profile of platform creator with social links
- ✅ **List of Employers** - Partner companies showcase
- ✅ **Articles: Infos & Testimonials** - Educational articles and user testimonials
- ✅ **Organization Values** - Core values of the organization
- ✅ **Contact Information** - Contact details (email, phone, address)

### 2. Admin CRUD Pages

Admin can manage all landing page content through dedicated CRUD pages:

- `/apps/admin/landing` - Main landing page management dashboard
- `/apps/admin/landing/about` - Manage About Us content
- `/apps/admin/landing/statistics` - Manage statistics
- `/apps/admin/landing/creator` - Manage creator profile (to be created)
- `/apps/admin/landing/employers` - Manage partner employers (to be created)
- `/apps/admin/landing/articles` - Manage articles and testimonials (to be created)
- `/apps/admin/landing/values` - Manage organization values (to be created)
- `/apps/admin/landing/contact` - Manage contact information (to be created)

### 3. SEO Features

- ✅ **Metadata** - Comprehensive meta tags for title, description, keywords
- ✅ **Open Graph** - Social media sharing optimization
- ✅ **Twitter Cards** - Twitter sharing optimization
- ✅ **Structured Data** - JSON-LD schema.org markup for Organization
- ✅ **Canonical URLs** - Proper canonical URL setup

### 4. PwD UX Compliance (WCAG 2.1 Level AA)

- ✅ **ARIA Labels** - All interactive elements have proper ARIA labels
- ✅ **Keyboard Navigation** - Full keyboard accessibility
- ✅ **Screen Reader Support** - Compatible with TalkBack, VoiceOver, JAWS, NVDA
- ✅ **Focus Management** - Visible focus indicators
- ✅ **Touch Targets** - Minimum 48×48px touch targets
- ✅ **Audio Announcements** - Text-to-speech announcements for all actions
- ✅ **Haptic Feedback** - Vibration feedback for interactions
- ✅ **Semantic HTML** - Proper use of semantic HTML elements
- ✅ **Color Contrast** - Meets WCAG contrast requirements
- ✅ **Alternative Text** - All images have descriptive alt text

## Database Schema

All landing page content is stored in Supabase with the following tables:

1. `landing_about` - About Us content
2. `landing_statistics` - Platform statistics
3. `landing_creator_profile` - Creator profile
4. `landing_employers` - Partner employers
5. `landing_articles` - Articles and testimonials
6. `landing_values` - Organization values
7. `landing_contact` - Contact information

See `supabase/landing-page-schema.sql` for complete schema.

## Setup Instructions

### 1. Database Setup

Run the schema and seed files in Supabase:

```sql
-- Run in Supabase SQL Editor
-- 1. First, run the schema
\i supabase/landing-page-schema.sql

-- 2. Then, run the seed data
\i supabase/landing-page-seed.sql
```

Or execute the SQL files directly in Supabase Dashboard → SQL Editor.

### 2. Environment Variables

Ensure these are set in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # or your production URL
```

### 3. Admin Access

To access admin pages:

1. Create an admin user in Supabase (see `ADMIN_SETUP_GUIDE.md`)
2. Login at `/apps/admin/auth/login`
3. Navigate to `/apps/admin/landing`

## File Structure

```
src/
├── app/
│   ├── page.tsx                          # Main landing page (server component)
│   ├── api/
│   │   └── landing/                      # API routes for landing page data
│   │       ├── about/route.ts
│   │       ├── statistics/route.ts
│   │       ├── creator/route.ts
│   │       ├── employers/route.ts
│   │       ├── articles/route.ts
│   │       ├── values/route.ts
│   │       └── contact/route.ts
│   └── apps/
│       └── admin/
│           └── landing/                   # Admin CRUD pages
│               ├── page.tsx              # Landing page management dashboard
│               ├── about/page.tsx       # About Us CRUD
│               └── statistics/page.tsx  # Statistics CRUD
├── components/
│   └── landing/
│       └── LandingPage.tsx               # Main landing page component
└── types/
    └── landing.ts                        # TypeScript types for landing page

supabase/
├── landing-page-schema.sql              # Database schema
└── landing-page-seed.sql                # Seed data
```

## Usage

### Viewing the Landing Page

The landing page is accessible at the root URL (`/`). It automatically fetches and displays all active content from the database.

### Managing Content (Admin)

1. Login as admin at `/apps/admin/auth/login`
2. Navigate to `/apps/admin/landing`
3. Select the section you want to manage
4. Edit and save changes

### Adding New Content

Each admin page provides forms to:
- Create new content
- Update existing content
- Delete/deactivate content

## API Endpoints

All API endpoints are publicly readable but only admins can write:

- `GET /api/landing/about` - Get About Us content
- `GET /api/landing/statistics` - Get statistics
- `GET /api/landing/creator` - Get creator profile
- `GET /api/landing/employers` - Get partner employers
- `GET /api/landing/articles?type=info|testimonial` - Get articles
- `GET /api/landing/values` - Get organization values
- `GET /api/landing/contact` - Get contact information

## Customization

### Adding New Sections

1. Create database table in `supabase/landing-page-schema.sql`
2. Create API route in `src/app/api/landing/[section]/route.ts`
3. Add TypeScript type in `src/types/landing.ts`
4. Add section component in `src/components/landing/LandingPage.tsx`
5. Create admin CRUD page in `src/app/apps/admin/landing/[section]/page.tsx`

### Styling

The landing page uses Tailwind CSS with the existing design system. All components follow the accessibility guidelines and use the theme colors.

## Testing

### Accessibility Testing

1. **Keyboard Navigation**: Test all interactive elements with keyboard only
2. **Screen Reader**: Test with NVDA (Windows), JAWS (Windows), VoiceOver (Mac/iOS), or TalkBack (Android)
3. **Color Contrast**: Use tools like WebAIM Contrast Checker
4. **Touch Targets**: Ensure all buttons are at least 48×48px

### SEO Testing

1. Use Google Search Console to verify structured data
2. Test Open Graph tags with Facebook Sharing Debugger
3. Test Twitter Cards with Twitter Card Validator
4. Verify meta tags with browser dev tools

## Troubleshooting

### Content Not Showing

- Check if content is marked as `is_active = true` in database
- Verify API routes are working (check browser Network tab)
- Check Supabase RLS policies allow public read access

### Admin Can't Edit

- Verify user has `user_type: 'admin'` in Supabase auth metadata
- Check RLS policies allow admin write access
- Verify user is logged in

### Images Not Loading

- Ensure image URLs are absolute URLs (not relative)
- Check CORS settings if images are hosted externally
- Verify image URLs are accessible

## Next Steps

To complete the implementation, create the remaining admin CRUD pages:

1. Creator Profile CRUD (`/apps/admin/landing/creator/page.tsx`)
2. Employers CRUD (`/apps/admin/landing/employers/page.tsx`)
3. Articles CRUD (`/apps/admin/landing/articles/page.tsx`)
4. Values CRUD (`/apps/admin/landing/values/page.tsx`)
5. Contact CRUD (`/apps/admin/landing/contact/page.tsx`)

These can follow the same pattern as the About and Statistics pages.

## Support

For issues or questions, refer to:
- `FEATURE_CHECKLIST.md` - Feature implementation status
- `ADMIN_SETUP_GUIDE.md` - Admin setup instructions
- `SETUP.md` - General setup guide
