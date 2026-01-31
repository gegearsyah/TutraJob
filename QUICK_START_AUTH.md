# Quick Start: Login & Authentication

## For Users

### How to Login

1. **Go to your portal:**
   - **Learners:** https://yourapp.com/apps/learner/auth/login
   - **Employers:** https://yourapp.com/apps/employer/auth/login
   - **Admins:** https://yourapp.com/apps/admin/auth/login

2. **Enter your credentials:**
   - Email address
   - Password

3. **Click "Login"**

4. **You're in!** 🎉
   - Dashboard loads
   - Your email appears in top-right corner

### How to Logout

1. **Click your email** in top-right corner
   - A dropdown menu appears

2. **Click "Keluar"** (Logout)

3. **Confirmed!**
   - You'll be logged out
   - Redirected to login page
   - Session cleared

### What if I Forget Password?

1. On login page, click **"Lupa Password?"** (Forgot Password)
2. Enter your email
3. Check your email for reset link
4. Click link and set new password
5. Login with new password

### What if I Can't Access a Page?

You'll see: "Memverifikasi akses..." (Verifying access)

**Reasons:**
- You're not logged in → Login first
- Your session expired → Login again
- You don't have access to this role → Check with admin

## For Admins

### Creating User Accounts

**Method 1: Supabase Dashboard (Easiest)**

1. Go to https://supabase.com
2. Login to your project
3. Go to **Authentication → Users**
4. Click **"Add User"** → **"Create new user"**
5. Fill in:
   - Email: user@example.com
   - Password: (must be 6+ chars)
   - Auto Confirm User: ON
6. Click **"Create User"**
7. Now add their role:
   - Click the user
   - Click **"Edit User"**
   - Scroll to "Raw App Metadata"
   - Add:
     ```json
     {
       "user_type": "learner"
     }
     ```
   - Click **"Save"**

**Method 2: SQL (Advanced)**

```sql
-- Create learner
INSERT INTO auth.users (email, password, user_metadata, email_confirmed_at)
VALUES (
  'learner@example.com',
  crypt('password123', gen_salt('bf')),
  '{"user_type": "learner"}',
  NOW()
);

-- Create admin
INSERT INTO auth.users (email, password, user_metadata, email_confirmed_at)
VALUES (
  'admin@example.com',
  crypt('adminpass123', gen_salt('bf')),
  '{"user_type": "admin"}',
  NOW()
);
```

### User Types

| Type | Access | Portal |
|------|--------|--------|
| `learner` | Job search, profile, applications | /apps/learner |
| `employer` | Job posting, candidate review | /apps/employer |
| `admin` | Landing page management, scraping | /apps/admin |
| `gov` | Compliance monitoring | /apps/gov |

### Verifying User Role

```sql
-- Check all users and their roles
SELECT 
  email,
  raw_user_meta_data->>'user_type' as user_type,
  created_at,
  email_confirmed_at
FROM auth.users
ORDER BY created_at DESC;

-- Check specific user
SELECT 
  email,
  raw_user_meta_data->>'user_type' as user_type
FROM auth.users
WHERE email = 'user@example.com';
```

### Changing User Role

```sql
-- Update user role
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{user_type}',
  '"admin"'
)
WHERE email = 'user@example.com';
```

### Disabling Users

```sql
-- Disable user (prevent login)
UPDATE auth.users
SET is_sso_user = false
WHERE email = 'user@example.com';

-- Or delete user
DELETE FROM auth.users
WHERE email = 'user@example.com';
```

## For Developers

### Import Auth Hooks

```typescript
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useLogout } from '@/hooks/useLogout';
import { getUserRole, hasRole } from '@/lib/auth/roles';
```

### Protect a Page

```typescript
'use client';

import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function ProtectedPage() {
  const { isAuthenticated, loading } = useAuthGuard({
    requireAuth: true,
    redirectTo: '/apps/learner/auth/login',
  });

  if (loading) return <p>Loading...</p>;
  if (!isAuthenticated) return null;

  return <p>This page is protected!</p>;
}
```

### Check if User is Admin

```typescript
'use client';

import { useEffect, useState } from 'react';
import { hasRole } from '@/lib/auth/roles';

export default function AdminOnly() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    hasRole('admin').then(setIsAdmin);
  }, []);

  if (!isAdmin) return <p>Access Denied</p>;
  return <p>Admin Panel</p>;
}
```

### Add Logout Button

```typescript
import { useLogout } from '@/hooks/useLogout';

export function LogoutButton() {
  const { logout } = useLogout();

  return (
    <button onClick={() => logout()}>
      Logout
    </button>
  );
}
```

### Get Current User

```typescript
import { supabase } from '@/lib/supabase/client';

const { data: { user } } = await supabase.auth.getUser();
console.log(user?.email); // User's email
```

## Troubleshooting

### Login Not Working

**Check:**
1. ✓ Email is correct and registered
2. ✓ Password is correct
3. ✓ Account email is confirmed
4. ✓ Supabase project is set up
5. ✓ Environment variables are correct

**Fix:**
- Clear browser cache
- Try incognito window
- Check Supabase dashboard for errors
- Verify NEXT_PUBLIC_SUPABASE_URL is correct

### Can't Access Dashboard After Login

**Check:**
1. ✓ You have the correct user role
2. ✓ Your email is verified
3. ✓ Your account is not disabled

**Fix:**
- Check your role in Supabase dashboard
- Admin can reassign your role
- Clear cookies and try again

### Logout Not Working

**Check:**
1. ✓ Supabase connection is working
2. ✓ Browser allows localStorage
3. ✓ Network connection is stable

**Fix:**
- Refresh page (F5)
- Clear browser storage
- Check browser console for errors
- Try different browser

### Can't See My User Email in Menu

**Check:**
1. ✓ You're fully logged in
2. ✓ Page has UserNavigation component
3. ✓ Supabase is fetching user data

**Fix:**
- Refresh page
- Check browser console
- Log out and log in again

## Security Notes

⚠️ **Important:**
- Never share your password
- Don't log in from public WiFi
- Log out when done
- Clear cookies before leaving
- Report security issues immediately

✅ **Good Practice:**
- Use strong passwords (8+ chars, numbers, symbols)
- Change password regularly
- Use unique password per site
- Enable 2FA if available (ask admin)

## Support

**For Issues:**
1. Check this guide first
2. Check AUTHENTICATION_COMPLETE.md
3. Check browser console for errors
4. Contact your administrator

**For Admin/Developer Support:**
- See AUTHENTICATION_COMPLETE.md
- Check Supabase dashboard logs
- Review auth hooks documentation

---

**Last Updated:** January 31, 2026
**Version:** 1.0
