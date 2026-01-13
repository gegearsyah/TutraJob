import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  // Extract subdomain from hostname
  // Supports: learner.domain.com, employer.domain.com, gov.domain.com
  // Also supports localhost:3000 with ?tenant= query param for development
  const subdomain = hostname.split('.')[0];
  
  // Check if path already starts with /apps/ - allow direct access (no rewrite needed)
  // Routes are now in src/app/apps/ so Next.js will handle them directly
  if (url.pathname.startsWith('/apps/')) {
    const pathParts = url.pathname.split('/').filter(Boolean);
    const tenantFromPath = pathParts[1]; // /apps/learner -> learner
    
    // Valid tenant types
    const validTenants = ['learner', 'employer', 'gov'];
    
    // If it's a valid tenant path, add header and allow through
    if (validTenants.includes(tenantFromPath)) {
      const response = NextResponse.next();
      response.headers.set('x-tenant', tenantFromPath);
      return response;
    }
    
    // Allow through (Next.js will handle 404 if route doesn't exist)
    return NextResponse.next();
  }
  
  // For local development, check query param
  const tenantParam = url.searchParams.get('tenant');
  const tenant = tenantParam || (subdomain !== 'localhost' && subdomain !== 'www' ? subdomain : null);
  
  // Valid tenant types
  const validTenants = ['learner', 'employer', 'gov'];
  
  // If no tenant specified, allow access to root app (landing page)
  if (!tenant || !validTenants.includes(tenant)) {
    return NextResponse.next();
  }
  
  // Rewrite to the appropriate app folder
  url.pathname = `/apps/${tenant}${url.pathname === '/' ? '' : url.pathname}`;
  
  // Add tenant header for use in components
  const response = NextResponse.rewrite(url);
  response.headers.set('x-tenant', tenant);
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
