# ✅ Vercel Deployment Checklist

## Pre-Deployment

### 1. Git Setup
- [x] Git repository initialized
- [ ] All files committed
- [ ] Remote repository created (GitHub/GitLab)
- [ ] Code pushed to remote

### 2. Environment Variables
- [ ] `.env.local` file created locally
- [ ] All required variables documented in `ENV_EXAMPLE.md`
- [ ] Ready to add variables to Vercel dashboard

### 3. Project Files
- [x] `vercel.json` created
- [x] `.gitignore` configured
- [x] `.vercelignore` created
- [x] `DEPLOYMENT_GUIDE.md` created
- [x] `README.md` updated

### 4. Build Test
- [ ] Run `npm run build` locally - should succeed
- [ ] Check for build errors/warnings
- [ ] Verify all dependencies installed

## Vercel Deployment

### 5. Vercel Account
- [ ] Account created at vercel.com
- [ ] Connected to GitHub/GitLab/Bitbucket

### 6. Import Project
- [ ] Click "Add New Project"
- [ ] Select repository
- [ ] Framework auto-detected as Next.js
- [ ] Root directory: `./`
- [ ] Build settings verified

### 7. Environment Variables (CRITICAL)
Add these in Vercel Dashboard → Environment Variables:

**Required:**
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `NEXT_PUBLIC_APP_URL` (update after first deploy)

**Optional:**
- [ ] `OPENAI_API_KEY` (if using AI features)

**Important:**
- [ ] Set for **Production** environment
- [ ] Set for **Preview** environment
- [ ] Set for **Development** environment

### 8. Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete (~2-3 minutes)
- [ ] Check build logs for errors
- [ ] Deployment successful

## Post-Deployment

### 9. Supabase Configuration
- [ ] Update Supabase Auth → URL Configuration:
  - Site URL: `https://your-app.vercel.app`
  - Redirect URLs:
    - `https://your-app.vercel.app/**`
    - `https://your-app.vercel.app/apps/learner/auth/callback`
    - `https://your-app.vercel.app/apps/employer/auth/callback`

### 10. Update Environment Variables
- [ ] Update `NEXT_PUBLIC_APP_URL` in Vercel to production URL
- [ ] Redeploy to apply changes

### 11. Testing
- [ ] Landing page loads correctly
- [ ] Navigation works
- [ ] Login/Signup functional
- [ ] Supabase connection working
- [ ] PWA features working (if applicable)
- [ ] All routes accessible

### 12. Custom Domain (Optional)
- [ ] Add custom domain in Vercel
- [ ] Configure DNS records
- [ ] SSL certificate auto-generated
- [ ] Update `NEXT_PUBLIC_APP_URL` to custom domain
- [ ] Update Supabase redirect URLs

## Monitoring

### 13. Setup Monitoring
- [ ] Enable Vercel Analytics (optional)
- [ ] Check deployment logs
- [ ] Monitor error logs
- [ ] Set up alerts (optional)

## Quick Commands

```bash
# Initialize Git (if not done)
git init
git add .
git commit -m "Initial commit"

# Connect to remote
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main

# Deploy via CLI (alternative)
npm i -g vercel
vercel login
vercel
vercel --prod
```

## Troubleshooting

**Build fails?**
- Check Vercel build logs
- Verify all environment variables are set
- Check `package.json` dependencies
- Run `npm run build` locally to test

**Supabase connection fails?**
- Verify environment variables in Vercel
- Check Supabase Auth redirect URLs
- Verify Supabase project is active
- Check Supabase dashboard for errors

**PWA not working?**
- Check `next-pwa` configuration
- Verify service worker in browser DevTools
- Check `public/manifest.json`

---

**Status:** Ready for deployment ✅
**Last Updated:** 2024
