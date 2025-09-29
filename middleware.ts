import { NextRequest, NextResponse } from 'next/server';

const locales = ['ar', 'en'];
const defaultLocale = 'en';

function getLocale(pathname: string) {
  const segments = pathname.split('/');
  const firstSegment = segments[1];
  
  if (locales.includes(firstSegment)) {
    return firstSegment;
  }
  
  return defaultLocale;
}

function removeLocaleFromPathname(pathname: string) {
  const segments = pathname.split('/');
  const firstSegment = segments[1];
  
  if (locales.includes(firstSegment)) {
    return '/' + segments.slice(2).join('/');
  }
  
  return pathname;
}

function getTenantIdFromHost(host: string): string | null {
  // For localhost development: tenant1.localhost:3000 -> tenant1
  if (host.includes('localhost')) {
    const parts = host.split('.');
    if (parts.length > 1 && parts[0] !== 'localhost') {
      return parts[0];
    }
  }
  
  // For production: tenant1.example.com -> tenant1
  const parts = host.split('.');
  if (parts.length > 2) {
    return parts[0];
  }
  
  return null;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const host = request.headers.get('host') || '';
  
  // Extract tenantId from subdomain
  const tenantId = getTenantIdFromHost(host);
  
  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/icons/')
  ) {
    return NextResponse.next();
  }
  
  // Check if pathname starts with a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If no locale in pathname, redirect to default locale
  if (!pathnameHasLocale) {
    const locale = defaultLocale;
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  // Extract locale and remove it from pathname for routing
  const locale = getLocale(pathname);
  const pathnameWithoutLocale = removeLocaleFromPathname(pathname);
  
  // Special case: if pathname is just /locale (e.g., /en), rewrite to homepage
  if (pathname === `/${locale}`) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    
    const response = NextResponse.rewrite(url);
    response.headers.set('x-locale', locale);
    response.headers.set('x-html-lang', locale);
    
    if (tenantId) {
      response.headers.set('x-tenant-id', tenantId);
    }
    
    return response;
  }
  
  // Rewrite the URL to remove the locale prefix
  const url = request.nextUrl.clone();
  url.pathname = pathnameWithoutLocale;
  
  const response = NextResponse.rewrite(url);
  
  // Set locale headers
  response.headers.set('x-locale', locale);
  response.headers.set('x-html-lang', locale);
  
  // Set tenantId header if found
  if (tenantId) {
    response.headers.set('x-tenant-id', tenantId);
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
};