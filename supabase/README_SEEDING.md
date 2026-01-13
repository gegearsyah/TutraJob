# Supabase Data Seeding Guide

## Quick Start

1. **Run the schema first** (if not already done):
   ```sql
   -- Copy and paste contents of schema.sql into Supabase SQL Editor
   ```

2. **Seed job listings**:
   ```sql
   -- Copy and paste contents of seed.sql into Supabase SQL Editor
   -- This will create 5 sample job listings
   ```

3. **Create users and seed profiles**:
   - Create users via Supabase Auth dashboard or API
   - Get their UUIDs
   - Update `seed-users.sql` with actual UUIDs
   - Run the updated script

## Step-by-Step Seeding

### Step 1: Create Schema
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/schema.sql`
3. Paste and run

### Step 2: Seed Job Listings
1. Copy contents of `supabase/seed.sql`
2. Paste and run in SQL Editor
3. Verify: Check `job_listings` table

### Step 3: Create Test Users

#### Option A: Via Supabase Dashboard
1. Go to Authentication → Users
2. Click "Add User"
3. Create users with emails:
   - `budi.santoso@example.com`
   - `siti.nurhaliza@example.com`
   - `employer@example.com`
4. Copy their UUIDs

#### Option B: Via SQL (for testing)
```sql
-- Create auth user (requires Supabase admin)
-- Note: This is usually done via Auth API or dashboard
```

### Step 4: Seed User Profiles
1. Open `supabase/seed-users.sql`
2. Replace `USER_UUID_HERE` with actual UUIDs from Step 3
3. Uncomment the INSERT statements
4. Run in SQL Editor

### Step 5: Seed Applications (Optional)
1. After users and jobs exist
2. Uncomment application INSERTs in `seed-users.sql`
3. Update UUIDs
4. Run

## Verification Queries

```sql
-- Check job listings
SELECT id, title, company, is_active FROM public.job_listings;

-- Check user profiles
SELECT id, full_name, email, skills FROM public.user_profiles;

-- Check applications
SELECT a.id, a.status, j.title, u.full_name 
FROM public.applications a
JOIN public.job_listings j ON a.job_id = j.id
JOIN public.user_profiles u ON a.user_id = u.id;

-- Check work experience
SELECT we.*, up.full_name 
FROM public.work_experience we
JOIN public.user_profiles up ON we.user_id = up.id;
```

## Sample Data Included

### Job Listings (5 jobs)
- Software Developer (PT Teknologi Indonesia)
- Data Analyst (PT Data Insights)
- Frontend Developer (PT Digital Solutions)
- Content Writer (PT Media Kreatif)
- Customer Service (PT Layanan Pelanggan)

### User Profiles (2 sample users)
- Budi Santoso - Software Developer
- Siti Nurhaliza - Data Analyst

### Features
- All jobs have Indonesian summaries
- Accessibility information included
- Salary ranges specified
- Location with TransJakarta distances
- Work arrangements (remote/hybrid/on-site)

## Troubleshooting

### Error: Foreign key constraint
- Make sure users exist in `auth.users` before inserting into `user_profiles`
- User profile `id` must match `auth.users.id`

### Error: Duplicate key
- Check if data already exists
- Use `TRUNCATE` to clear tables (be careful!)
- Or use `ON CONFLICT` clauses

### Missing UUIDs
- Get UUIDs from Supabase Auth dashboard
- Or query: `SELECT id, email FROM auth.users;`

## Next Steps

After seeding:
1. Test job browsing at `/apps/learner/jobs`
2. Create a user profile at `/apps/learner/profile`
3. Test application submission
4. View applications at `/apps/learner/applications`
