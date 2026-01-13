# Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Root: http://localhost:3000
   - Learner Portal: http://localhost:3000?tenant=learner
   - Employer Portal: http://localhost:3000?tenant=employer
   - Government Portal: http://localhost:3000?tenant=gov

## Multi-Tenant Routing

### Development Mode
Use query parameters to test different tenants:
- `?tenant=learner`
- `?tenant=employer`
- `?tenant=gov`

### Production Mode
Configure subdomains in your hosting provider:
- `learner.yourdomain.com` → Learner Portal
- `employer.yourdomain.com` → Employer Portal
- `gov.yourdomain.com` → Government Portal

## PWA Setup

1. **Generate Icons**
   - Create `icon-192x192.png` (192x192px)
   - Create `icon-512x512.png` (512x512px)
   - Place both in `/public/` directory
   - You can use tools like:
     - [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
     - [RealFaviconGenerator](https://realfavicongenerator.net/)

2. **Test PWA**
   - Build the app: `npm run build`
   - Start production server: `npm start`
   - Open in browser and check "Add to Home Screen" option

## Adding shadcn/ui Components

```bash
# Initialize (already done, but for reference)
npx shadcn@latest init

# Add components as needed
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
```

## Environment Variables

Create a `.env.local` file for environment-specific variables:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Project Structure

```
src/
├── app/              # Root application
│   ├── layout.tsx   # Root layout with theme
│   ├── page.tsx     # Landing page
│   └── globals.css  # Design system styles
├── apps/            # Multi-tenant applications
│   ├── learner/     # Job seeker portal
│   ├── employer/    # Employer dashboard
│   └── gov/         # Government portal
├── components/       # Shared React components
├── lib/             # Utility functions
└── middleware.ts    # Subdomain routing logic
```

## Design System

The application uses a comprehensive design system defined in `FRONTEND_DESIGN_SPECIFICATION.md`:

- **Colors**: HSL-based color system with dark mode support
- **Typography**: Plus Jakarta Sans font family
- **Spacing**: Tailwind's default spacing scale
- **Components**: shadcn/ui compatible structure

## Troubleshooting

### Middleware not working?
- Check that `src/middleware.ts` exists
- Verify the matcher pattern in middleware config
- For local development, use `?tenant=` query parameter

### PWA not installing?
- Ensure you're running a production build (`npm run build && npm start`)
- Check browser console for service worker errors
- Verify `manifest.json` is accessible at `/manifest.json`
- Ensure icons exist in `/public/` directory

### Theme not switching?
- Verify `next-themes` is installed
- Check that `ThemeProvider` wraps your app in `layout.tsx`
- Ensure `darkMode: ["class"]` is set in `tailwind.config.ts`
