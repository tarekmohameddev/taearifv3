import { NextRequest, NextResponse } from "next/server";

const locales = ["ar", "en"];
const defaultLocale = "en";

// Default locale for live-editor pages
const liveEditorDefaultLocale = "ar";

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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const productionDomain = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "mandhoor.com";
  const isDevelopment = process.env.NODE_ENV === "development";

  // Extract domain from API URL for local development
  const localDomain = new URL(apiUrl).hostname;

  // قائمة بالكلمات المحجوزة التي لا يجب أن تكون tenantId
  const reservedWords = [
    "www",
    "api",
    "admin",
    "app",
    "mail",
    "ftp",
    "blog",
    "shop",
    "store",
    "dashboard",
    "live-editor",
    "auth",
    "login",
    "register"
  ];

  console.log('🔍 Middleware: Checking host:', host);
  console.log('🔍 Middleware: Local domain:', localDomain);
  console.log('🔍 Middleware: Production domain:', productionDomain);
  console.log('🔍 Middleware: Is development:', isDevelopment);

  // For localhost development: tenant1.localhost:3000 -> tenant1
  if (isDevelopment && host.includes(localDomain)) {
    const parts = host.split(".");
    if (parts.length > 1 && parts[0] !== localDomain) {
      const potentialTenantId = parts[0];
      console.log('🔍 Middleware: Potential tenant ID (local):', potentialTenantId);
      
      // تحقق من أن الـ tenantId ليس من الكلمات المحجوزة
      if (!reservedWords.includes(potentialTenantId.toLowerCase())) {
        console.log('✅ Middleware: Valid tenant ID (local):', potentialTenantId);
        return potentialTenantId;
      } else {
        console.log('❌ Middleware: Reserved word (local):', potentialTenantId);
      }
    }
  }

  // For production: tenant1.mandhoor.com -> tenant1
  if (!isDevelopment && host.includes(productionDomain)) {
    const parts = host.split(".");
    if (parts.length > 2) {
      const potentialTenantId = parts[0];
      console.log('🔍 Middleware: Potential tenant ID (production):', potentialTenantId);
      
      // تحقق من أن الـ tenantId ليس من الكلمات المحجوزة
      if (!reservedWords.includes(potentialTenantId.toLowerCase())) {
        console.log('✅ Middleware: Valid tenant ID (production):', potentialTenantId);
        return potentialTenantId;
      } else {
        console.log('❌ Middleware: Reserved word (production):', potentialTenantId);
      }
    }
  }

  console.log('❌ Middleware: No valid tenant ID found');
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
  if (
    !tenantId &&
    (pathname === "/" ||
      pathname === "/solutions" ||
      pathname === "/updates" ||
      pathname === "/landing" ||
      pathname === "/about-us")
  ) {
    // تحسين cache للمكونات Taearif
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable",
    );
    response.headers.set("X-Component-Type", "taearif-static");
  }

  /*
   * ========================================
   * AUTO-REDIRECT TO ARABIC LOCALE (EXCEPT LIVE-EDITOR)
   * ========================================
   *
   * This section handles automatic redirection of all pages to Arabic locale,
   * except for the live-editor page.
   *
   * PURPOSE:
   * - Force all pages to use Arabic locale (ar) regardless of the original URL
   * - Ensures consistent RTL experience across all sections
   * - Prevents users from accessing pages in English locale
   * - Excludes live-editor page from this redirection
   *
   * HOW IT WORKS:
   * 1. Detects if the current path is an English page (starts with /en)
   * 2. Checks if the page is NOT live-editor
   * 3. If both conditions are true, redirects to the same path with Arabic locale
   *
   * AFFECTED PAGES:
   * - /en/* -> /ar/* (except /en/live-editor)
   * - All pages except live-editor
   *
   * LIVE-EDITOR HANDLING:
   * - /en/live-editor -> stays in English (no redirect)
   * - /live-editor (no locale) -> redirects to: /ar/live-editor
   * - Arabic is the default locale for live-editor when no locale is specified
   *
   * MODIFICATION NOTES:
   * - To disable this feature: Comment out the entire redirect section
   * - To change target locale: Replace "ar" with desired locale code
   * - To modify live-editor default: Change liveEditorDefaultLocale variable
   *
   * EXAMPLE:
   * User visits: /en/dashboard/analytics -> redirects to: /ar/dashboard/analytics
   * User visits: /en/live-editor -> stays: /en/live-editor
   * User visits: /live-editor -> redirects to: /ar/live-editor
   */

  // Check if this is an English page and NOT live-editor
  const isEnglishPage = pathname.startsWith("/en/");
  const isLiveEditor = pathname.startsWith("/en/live-editor");

  if (isEnglishPage && !isLiveEditor) {
    // Extract the path without locale
    const pathWithoutLocale = pathname.replace("/en", "");

    // Redirect to Arabic version of the page
    const newUrl = new URL(`/ar${pathWithoutLocale}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  // No special handling needed for /en/live-editor - let it stay in English

  // Check if pathname starts with a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  // If no locale in pathname, redirect to appropriate default locale
  if (!pathnameHasLocale) {
    // Use Arabic as default for live-editor, English for other pages
    const locale = pathname.startsWith("/live-editor")
      ? liveEditorDefaultLocale
      : defaultLocale;
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
