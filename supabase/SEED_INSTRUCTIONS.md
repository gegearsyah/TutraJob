# Seed Data Instructions

## Quick Start Guide

### Option 1: Using seed-ready.sql (Recommended)

1. **Create users in Supabase Auth Dashboard:**
   - Go to: Supabase Dashboard > Authentication > Users
   - Click "Add User" and create these 4 users:
     - Email: `budi.santoso@example.com`, Password: `Test123!`
     - Email: `sari.wijaya@example.com`, Password: `Test123!`
     - Email: `andi.pratama@example.com`, Password: `Test123!`
     - Email: `pt.tech@example.com`, Password: `Test123!` (employer)

2. **Get the UUIDs:**
   - In Supabase SQL Editor, run:
   ```sql
   SELECT id, email FROM auth.users 
   WHERE email IN (
     'budi.santoso@example.com',
     'sari.wijaya@example.com',
     'andi.pratama@example.com',
     'pt.tech@example.com'
   );
   ```

3. **Update seed-ready.sql:**
   - Open `supabase/seed-ready.sql`
   - Find the `DECLARE` section at the top
   - Replace the placeholder UUIDs with the actual UUIDs from step 2:
     ```sql
     user_uuid_1 UUID := 'YOUR_ACTUAL_UUID_HERE'; -- budi.santoso@example.com
     user_uuid_2 UUID := 'YOUR_ACTUAL_UUID_HERE'; -- sari.wijaya@example.com
     user_uuid_3 UUID := 'YOUR_ACTUAL_UUID_HERE'; -- andi.pratama@example.com
     employer_uuid UUID := 'YOUR_ACTUAL_UUID_HERE'; -- pt.tech@example.com
     ```

4. **Run the seed script:**
   - Copy the entire content of `seed-ready.sql`
   - Paste it into Supabase SQL Editor
   - Click "Run"

### Option 2: Using Supabase CLI (Advanced)

If you have Supabase CLI installed, you can create users programmatically:

```bash
# Create users via Supabase CLI
supabase auth create-user --email budi.santoso@example.com --password Test123!
supabase auth create-user --email sari.wijaya@example.com --password Test123!
supabase auth create-user --email andi.pratama@example.com --password Test123!
supabase auth create-user --email pt.tech@example.com --password Test123!
```

Then follow steps 2-4 from Option 1.

## What Gets Created

The seed script creates:

- ✅ **3 User Profiles** (Budi, Sari, Andi) with:
  - Personal information
  - Work experience
  - Education history
  - Skills and preferences

- ✅ **10 Job Listings** including:
  - Software Developer
  - Data Analyst
  - UI/UX Designer
  - Frontend Developer
  - Backend Developer
  - Product Manager
  - QA Engineer
  - DevOps Engineer
  - Full Stack Developer
  - Mobile Developer

- ✅ **3 Applications** with status history:
  - Budi → Software Developer (under-review)
  - Sari → Data Analyst (interview-scheduled)
  - Andi → UI/UX Designer (rejected)

- ✅ **1 Employer Profile** (PT Teknologi Indonesia)

## Understanding UUIDs

**UUID** stands for "Universally Unique Identifier". It's a 128-bit identifier that looks like:
```
550e8400-e29b-41d4-a716-446655440000
```

**Why UUIDs?**
- They're globally unique (no collisions)
- Used by Supabase Auth to identify users
- Required for foreign key relationships

**In this seed file:**
- User UUIDs must match `auth.users.id` (you get these from Supabase Auth)
- Job UUIDs are auto-generated using `gen_random_uuid()`
- Application UUIDs are auto-generated using `gen_random_uuid()`

## Troubleshooting

### Error: "violates foreign key constraint"
- **Cause**: User UUID doesn't exist in `auth.users`
- **Fix**: Make sure you created the users in Supabase Auth first

### Error: "duplicate key value"
- **Cause**: Running the script multiple times
- **Fix**: The script uses `ON CONFLICT DO NOTHING` so it's safe to run multiple times, but you might see this warning

### Users not showing up
- **Cause**: RLS (Row Level Security) policies might be blocking access
- **Fix**: Make sure you're logged in as the user or using service role key

## File Structure

- `seed-ready.sql` - Complete seed data with all UUIDs ready to use
- `seed.sql` - Basic job listings only (no users)
- `seed-extended.sql` - Extended data (commented out, needs UUID replacement)
- `seed-users.sql` - User profiles only (commented out, needs UUID replacement)

## Next Steps

After seeding:
1. Test login with the created users
2. Browse job listings
3. Test application flow
4. Check user profiles

## Need Help?

If you encounter issues:
1. Check Supabase logs in the Dashboard
2. Verify users exist in `auth.users` table
3. Ensure UUIDs match exactly (case-sensitive)
4. Check RLS policies if data isn't visible
