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

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
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
  
  // Rewrite the URL to remove the locale prefix
  const url = request.nextUrl.clone();
  url.pathname = pathnameWithoutLocale;
  
  const response = NextResponse.rewrite(url);
  
  // Set locale headers
  response.headers.set('x-locale', locale);
  response.headers.set('x-html-lang', locale);
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
};
