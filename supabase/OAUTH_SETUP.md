# OAuth Setup Guide (Google & LinkedIn)

## Prerequisites

1. Supabase project with Authentication enabled
2. Google Cloud Console account (for Google OAuth)
3. LinkedIn Developer account (for LinkedIn OAuth)

## Step 1: Configure Google OAuth

### 1.1 Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure OAuth consent screen (if not done):
   - User Type: External
   - App name: Inklusif Kerja
   - User support email: your-email@example.com
   - Developer contact: your-email@example.com
6. Create OAuth client ID:
   - Application type: **Web application**
   - Name: Inklusif Kerja Web Client
   - Authorized redirect URIs:
     ```
     https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
     ```
     Replace `YOUR_PROJECT_REF` with your Supabase project reference
7. Copy the **Client ID** and **Client Secret**

### 1.2 Configure in Supabase

1. Go to Supabase Dashboard > **Authentication** > **Providers**
2. Find **Google** and click to enable
3. Enter:
   - **Client ID**: (from Google Cloud Console)
   - **Client Secret**: (from Google Cloud Console)
4. Click **Save**

## Step 2: Configure LinkedIn OAuth

### 2.1 Create LinkedIn App

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Click **Create app**
3. Fill in app details:
   - App name: Inklusif Kerja
   - LinkedIn Page: (select or create a page)
   - App logo: (upload a logo)
   - Privacy policy URL: (your privacy policy URL)
   - App use: (select appropriate option)
4. In **Auth** tab:
   - Add redirect URL:
     ```
     https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
     ```
   - Requested scopes: `openid`, `profile`, `email`
5. Copy the **Client ID** and **Client Secret**

### 2.2 Configure in Supabase

1. Go to Supabase Dashboard > **Authentication** > **Providers**
2. Find **LinkedIn** and click to enable
3. Enter:
   - **Client ID**: (from LinkedIn Developers)
   - **Client Secret**: (from LinkedIn Developers)
4. Click **Save**

## Step 3: Update Redirect URLs

### For Development (localhost)

Add these redirect URLs to your OAuth providers:

**Google:**
```
http://localhost:3000/apps/learner/auth/callback
```

**LinkedIn:**
```
http://localhost:3000/apps/learner/auth/callback
```

### For Production

Add your production domain:

**Google:**
```
https://yourdomain.com/apps/learner/auth/callback
```

**LinkedIn:**
```
https://yourdomain.com/apps/learner/auth/callback
```

## Step 4: Test OAuth Login

1. Start your development server: `npm run dev`
2. Go to `/apps/learner/auth/login`
3. Click "Masuk dengan Google" or "Masuk dengan LinkedIn"
4. Complete the OAuth flow
5. You should be redirected back to your app

## Troubleshooting

### Error: "redirect_uri_mismatch"

- **Cause**: Redirect URI in OAuth provider doesn't match Supabase callback URL
- **Fix**: 
  1. Check Supabase callback URL: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
  2. Make sure this exact URL is in your OAuth provider's authorized redirect URIs

### Error: "invalid_client"

- **Cause**: Client ID or Client Secret is incorrect
- **Fix**: 
  1. Double-check credentials in Supabase Dashboard
  2. Make sure there are no extra spaces
  3. Regenerate credentials if needed

### Error: "access_denied"

- **Cause**: User denied OAuth permission
- **Fix**: This is normal - user can try again

### OAuth works but user not created

- **Cause**: User metadata not being set correctly
- **Fix**: Check that OAuth providers are returning email and name fields

## Security Notes

1. **Never commit** OAuth credentials to version control
2. Use environment variables for sensitive data
3. Keep Client Secrets secure
4. Regularly rotate OAuth credentials
5. Monitor OAuth usage in provider dashboards

## Additional Resources

- [Supabase OAuth Documentation](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [LinkedIn OAuth Setup](https://docs.microsoft.com/en-us/linkedin/shared/authentication/authentication)
