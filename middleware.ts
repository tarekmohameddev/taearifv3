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

// دالة للتحقق من Custom Domain
async function getTenantIdFromCustomDomain(host: string): Promise<string | null> {
  // التحقق من أن الـ host هو custom domain (يحتوي على .com, .net, .org, إلخ)
  const isCustomDomain = /\.(com|net|org|io|co|me|info|biz|name|pro|aero|asia|cat|coop|edu|gov|int|jobs|mil|museum|tel|travel|xxx)$/i.test(host);
  
  if (!isCustomDomain) {
    console.log("🔍 Middleware: Host is not a custom domain:", host);
    return null;
  }

  try {
    // استدعاء Backend API للتحقق من Custom Domain
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const response = await fetch(`${apiUrl}/v1/tenant-website/getTenant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ websiteName: host }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && Object.keys(data).length > 0) {
        console.log("✅ Middleware: Custom domain found:", host, "->", host);
        return host; // إرجاع الـ host نفسه كـ tenantId للـ Custom Domain
      }
    }
  } catch (error) {
    console.log("🔍 Middleware: Custom domain check failed:", error);
  }
  
  return null;
}

function getTenantIdFromHost(host: string): string | null {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const productionDomain =
    process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "taearif.com";
  const localDomain = process.env.NEXT_PUBLIC_LOCAL_DOMAIN || "localhost";
  const isDevelopment = process.env.NODE_ENV === "development";

  // Extract domain from API URL for local development
  const apiHostname = new URL(apiUrl).hostname;

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
    "register",
  ];

  console.log("🔍 Middleware: Checking host:", host);
  console.log("🔍 Middleware: Local domain:", localDomain);
  console.log("🔍 Middleware: Production domain:", productionDomain);
  console.log("🔍 Middleware: Is development:", isDevelopment);
  console.log("🔍 Middleware: NODE_ENV:", process.env.NODE_ENV);

  // For localhost development: tenant1.localhost:3000 -> tenant1
  if (isDevelopment && host.includes(localDomain)) {
    const parts = host.split(".");
    if (parts.length > 1 && parts[0] !== localDomain) {
      const potentialTenantId = parts[0];
      console.log(
        "🔍 Middleware: Potential tenant ID (local):",
        potentialTenantId,
      );

      // تحقق من أن الـ tenantId ليس من الكلمات المحجوزة
      if (!reservedWords.includes(potentialTenantId.toLowerCase())) {
        console.log(
          "✅ Middleware: Valid tenant ID (local):",
          potentialTenantId,
        );
        return potentialTenantId;
      } else {
        console.log("❌ Middleware: Reserved word (local):", potentialTenantId);
      }
    }
  }

  // For production: tenant1.taearif.com -> tenant1
  // التحقق من أن الـ subdomain صحيح (يجب أن يكون لـ productionDomain فقط)
  if (!isDevelopment && host.includes(productionDomain)) {
    const parts = host.split(".");
    if (parts.length > 2) {
      const potentialTenantId = parts[0];
      const domainPart = parts.slice(1).join(".");
      
      // التحقق من أن الـ domain هو productionDomain بالضبط
      if (domainPart === productionDomain) {
        console.log(
          "🔍 Middleware: Potential tenant ID (production):",
          potentialTenantId,
        );

        // تحقق من أن الـ tenantId ليس من الكلمات المحجوزة
        if (!reservedWords.includes(potentialTenantId.toLowerCase())) {
          console.log(
            "✅ Middleware: Valid tenant ID (production):",
            potentialTenantId,
          );
          return potentialTenantId;
        } else {
          console.log(
            "❌ Middleware: Reserved word (production):",
            potentialTenantId,
          );
        }
      } else {
        console.log("❌ Middleware: Invalid subdomain - not for production domain:", domainPart);
      }
    }
  }

  console.log("❌ Middleware: No valid tenant ID found");
  return null;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const host = request.headers.get("host") || "";

  // DEBUG: Log all requests
  console.log("🔍 Middleware Debug - Request:", {
    pathname,
    host,
    url: request.url
  });

  // قائمة الصفحات التي يجب أن تكون على الدومين الأساسي فقط
  const systemPages = [
    "/dashboard",
    "/live-editor", 
    "/login",
    "/oauth",
    "/onboarding",
    "/register",
    "/updates",
    "/solutions",
    "/landing",
    "/about-us"
  ];

  // التحقق من أن الصفحات النظامية على الدومين الأساسي
  const isSystemPage = systemPages.some(page => pathname.startsWith(page));
  const productionDomain = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "taearif.com";
  const localDomain = process.env.NEXT_PUBLIC_LOCAL_DOMAIN || "localhost";
  const isDevelopment = process.env.NODE_ENV === "development";
  
  // التحقق من أن الصفحة على الدومين الأساسي
  const isOnBaseDomain = isDevelopment 
    ? host === localDomain || host === `${localDomain}:3000`
    : host === productionDomain || host === `www.${productionDomain}`;

  if (isSystemPage && !isOnBaseDomain) {
    // إعادة توجيه الصفحات النظامية إلى الدومين الأساسي
    const baseUrl = isDevelopment 
      ? `http://${localDomain}:3000${pathname}`
      : `https://${productionDomain}${pathname}`;
    
    console.log("🔄 Middleware: Redirecting system page to base domain:", baseUrl);
    return NextResponse.redirect(baseUrl);
  }

  // Extract tenantId from subdomain or custom domain
  let tenantId = getTenantIdFromHost(host);
  
  // إذا لم يتم العثور على tenantId من subdomain، تحقق من Custom Domain
  if (!tenantId) {
    tenantId = await getTenantIdFromCustomDomain(host);
  }

  // التحقق من أن الـ host هو custom domain (يحتوي على .com, .net, .org, إلخ)
  const isCustomDomain = /\.(com|net|org|io|co|me|info|biz|name|pro|aero|asia|cat|coop|edu|gov|int|jobs|mil|museum|tel|travel|xxx)$/i.test(host);
  
  // إذا كان custom domain ولم يتم العثور على tenantId، اعتبره custom domain محتمل
  if (isCustomDomain && !tenantId) {
    console.log("🔍 Middleware: Treating as potential custom domain:", host);
    tenantId = host;
  }

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
   * AUTO-REDIRECT TO ARABIC LOCALE (EXCEPT LIVE-EDITOR) - DISABLED
   * ========================================
   *
   * This section has been disabled to allow English pages to be accessible.
   * Previously, it handled automatic redirection of all pages to Arabic locale,
   * except for the live-editor page.
   *
   * PURPOSE (PREVIOUSLY):
   * - Force all pages to use Arabic locale (ar) regardless of the original URL
   * - Ensures consistent RTL experience across all sections
   * - Prevents users from accessing pages in English locale
   * - Excludes live-editor page from this redirection
   *
   * HOW IT WORKED (PREVIOUSLY):
   * 1. Detects if the current path is an English page (starts with /en)
   * 2. Checks if the page is NOT live-editor
   * 3. If both conditions are true, redirects to the same path with Arabic locale
   *
   * AFFECTED PAGES (PREVIOUSLY):
   * - /en/* -> /ar/* (except /en/live-editor)
   * - All pages except live-editor
   *
   * CURRENT BEHAVIOR:
   * - English pages are now accessible without redirection
   * - Users can access both Arabic and English versions
   * - Live-editor continues to work in both languages
   *
   * MODIFICATION NOTES:
   * - This feature has been disabled by commenting out the redirect logic
   * - To re-enable: Uncomment the redirect section below
   * - To change target locale: Replace "ar" with desired locale code
   * - To modify live-editor default: Change liveEditorDefaultLocale variable
   *
   * EXAMPLE (CURRENT):
   * User visits: /en/dashboard/analytics -> stays: /en/dashboard/analytics
   * User visits: /en/live-editor -> stays: /en/live-editor
   * User visits: /live-editor -> redirects to: /ar/live-editor
   */

  // DISABLED: Auto-redirect from English to Arabic
  // Check if this is an English page and NOT live-editor
  // const isEnglishPage = pathname.startsWith("/en/");
  // const isLiveEditor = pathname.startsWith("/en/live-editor");

  // if (isEnglishPage && !isLiveEditor) {
  //   // Extract the path without locale
  //   const pathWithoutLocale = pathname.replace("/en", "");
  //
  //   // Redirect to Arabic version of the page
  //   const newUrl = new URL(`/ar${pathWithoutLocale}`, request.url);
  //   return NextResponse.redirect(newUrl);
  // }

  // No special handling needed for /en/live-editor - let it stay in English

  // Check if pathname starts with a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  console.log("🔍 Middleware Debug - Locale Check:", {
    pathname,
    pathnameHasLocale,
    tenantId,
    host
  });

  // If no locale in pathname, redirect to appropriate default locale
  // BUT ONLY if there's a tenantId (subdomain) OR if it's a dashboard page
  if (!pathnameHasLocale) {
    // Use Arabic as default for live-editor, English for other pages
    const locale = pathname.startsWith("/live-editor")
      ? liveEditorDefaultLocale
      : defaultLocale;
    
    // Only redirect if there's a tenantId (subdomain) OR if it's a dashboard page
    const shouldRedirect = tenantId || pathname.startsWith("/dashboard") || pathname.startsWith("/login") || pathname.startsWith("/register");
    
    console.log("🔍 Middleware Debug - Redirect Decision:", {
      pathname,
      locale,
      tenantId,
      shouldRedirect,
      reason: tenantId ? "Has tenantId (subdomain)" : pathname.startsWith("/dashboard") ? "Dashboard page" : pathname.startsWith("/login") ? "Login page" : pathname.startsWith("/register") ? "Register page" : "No redirect reason"
    });

    if (shouldRedirect) {
      const newUrl = new URL(`/${locale}${pathname}`, request.url);
      console.log("🔄 Middleware Debug - Redirecting:", {
        from: request.url,
        to: newUrl.toString()
      });
      return NextResponse.redirect(newUrl);
    }
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
    console.log("✅ Middleware: Setting tenant ID header:", tenantId);
    response.headers.set("x-tenant-id", tenantId);
    
    // تحديد نوع الـ domain
    const domainType = isCustomDomain ? "custom" : "subdomain";
    response.headers.set("x-domain-type", domainType);
    
    console.log("✅ Middleware: Domain type:", domainType);
  } else {
    console.log("❌ Middleware: No tenant ID found for host:", host);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
