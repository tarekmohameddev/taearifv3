import { NextRequest, NextResponse } from "next/server";

const locales = ["ar", "en"];
const defaultLocale = "en";

function getLocale(pathname: string) {
  const segments = pathname.split("/");
  const firstSegment = segments[1];

  if (locales.includes(firstSegment)) {
    return firstSegment;
  }

  return defaultLocale;
}

function removeLocaleFromPathname(pathname: string) {
  const segments = pathname.split("/");
  const firstSegment = segments[1];

  if (locales.includes(firstSegment)) {
    return "/" + segments.slice(2).join("/");
  }

  return pathname;
}

function getTenantIdFromHost(host: string): string | null {
  const localDomain = process.env.NEXT_PUBLIC_LOCAL_DOMAIN || "localhost";
  const productionDomain =
    process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "mandhoor.com";
  const isDevelopment = process.env.NODE_ENV === "development";

  // قائمة بالكلمات المحجوزة التي لا يجب أن تكون tenantId
  const reservedWords = ["www", "api", "admin", "app", "mail", "ftp", "blog", "shop", "store"];

  // For localhost development: tenant1.localhost:3000 -> tenant1
  if (host.includes(localDomain)) {
    const parts = host.split(".");
    if (parts.length > 1 && parts[0] !== localDomain) {
      const potentialTenantId = parts[0];
      // تحقق من أن الـ tenantId ليس من الكلمات المحجوزة
      if (!reservedWords.includes(potentialTenantId.toLowerCase())) {
        return potentialTenantId;
      }
    }
  }

  // For production: tenant1.mandhoor.com -> tenant1
  // تحقق من أن الـ host يحتوي على mandhoor.com أو taearif.com
  if (!isDevelopment && (host.includes("mandhoor.com") || host.includes("taearif.com"))) {
    const parts = host.split(".");
    if (parts.length > 2) {
      const potentialTenantId = parts[0];
      // تحقق من أن الـ tenantId ليس من الكلمات المحجوزة
      if (!reservedWords.includes(potentialTenantId.toLowerCase())) {
        return potentialTenantId;
      }
    }
  }

  return null;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const host = request.headers.get("host") || "";

  // Extract tenantId from subdomain
  const tenantId = getTenantIdFromHost(host);

  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/icons/")
  ) {
    return NextResponse.next();
  }

  // تحسين الأداء للمكونات الثابتة - إضافة cache headers
  let response = NextResponse.next();
  
  // إضافة cache headers للمكونات الثابتة (عندما لا يوجد tenantId)
  if (!tenantId && (
    pathname === "/" ||
    pathname === "/solutions" ||
    pathname === "/updates" ||
    pathname === "/landing" ||
    pathname === "/about-us"
  )) {
    // تحسين cache للمكونات Taearif
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    response.headers.set('X-Component-Type', 'taearif-static');
  }

  /*
   * ========================================
   * DASHBOARD AUTO-REDIRECT TO ARABIC LOCALE
   * ========================================
   * 
   * This section handles automatic redirection of dashboard pages to Arabic locale.
   * 
   * PURPOSE:
   * - Force all dashboard pages to use Arabic locale (ar) regardless of the original URL
   * - Ensures consistent RTL experience across all dashboard sections
   * - Prevents users from accessing dashboard in English locale
   * 
   * HOW IT WORKS:
   * 1. Detects if the current path is a dashboard page (starts with /dashboard)
   * 2. Checks if the current locale is English (en)
   * 3. If both conditions are true, redirects to the same path with Arabic locale
   * 
   * AFFECTED PAGES:
   * - /en/dashboard/* -> /ar/dashboard/*
   * - All dashboard subpages (affiliate, analytics, apps, blog, etc.)
   * 
   * MODIFICATION NOTES:
   * - To disable this feature: Comment out the entire dashboard redirect section
   * - To change target locale: Replace "ar" with desired locale code
   * - To modify affected paths: Update the dashboard path check condition
   * 
   * EXAMPLE:
   * User visits: /en/dashboard/analytics
   * System redirects to: /ar/dashboard/analytics
   */
  
  // Check if this is a dashboard page and current locale is English
  const isDashboardPage = pathname.startsWith("/en/dashboard") || 
                         pathname.startsWith("/dashboard");
  
  if (isDashboardPage) {
    // Extract the path without locale for dashboard pages
    let dashboardPath = pathname;
    
    // If path starts with /en/dashboard, remove /en prefix
    if (pathname.startsWith("/en/dashboard")) {
      dashboardPath = pathname.replace("/en", "");
    }
    // If path starts with /dashboard (no locale), keep as is
    else if (pathname.startsWith("/dashboard")) {
      dashboardPath = pathname;
    }
    
    // Redirect to Arabic version of the dashboard page
    const newUrl = new URL(`/ar${dashboardPath}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  // Check if pathname starts with a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
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
    url.pathname = "/";

    const response = NextResponse.rewrite(url);
    response.headers.set("x-locale", locale);
    response.headers.set("x-html-lang", locale);
    response.headers.set("x-pathname", "/");

    if (tenantId) {
      response.headers.set("x-tenant-id", tenantId);
    }

    return response;
  }

  // Rewrite the URL to remove the locale prefix
  const url = request.nextUrl.clone();
  url.pathname = pathnameWithoutLocale;

  response = NextResponse.rewrite(url);

  // Set locale headers
  response.headers.set("x-locale", locale);
  response.headers.set("x-html-lang", locale);
  response.headers.set("x-pathname", pathnameWithoutLocale);

  // Set tenantId header if found
  if (tenantId) {
    response.headers.set("x-tenant-id", tenantId);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
