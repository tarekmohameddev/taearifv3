# Locale Routing System

## Overview

The application implements a **custom i18n (internationalization) routing system** using Next.js middleware that:
- Supports two locales: **Arabic (`ar`)** and **English (`en`)**
- Handles automatic locale prefix injection
- Manages RTL/LTR direction switching
- Implements locale-based redirects vs rewrites
- Has special handling for specific pages

---

## Core Concepts

### Supported Locales
```typescript
const locales = ["ar", "en"];
const defaultLocale = "en";
const liveEditorDefaultLocale = "ar";
```

### URL Structure
All pages (except special cases) must have a locale prefix:

**Valid URLs:**
- `/ar/dashboard` ✓
- `/en/dashboard` ✓
- `/ar/` ✓ (homepage in Arabic)
- `/en/about-us` ✓

**Invalid URLs (will redirect):**
- `/dashboard` → redirects to `/ar/dashboard`
- `/` → redirects to `/ar/`
- `/about-us` → redirects to `/ar/about-us`

---

## Middleware Locale Processing

### Step 1: Check if Pathname Has Locale

```typescript
function getLocale(pathname: string) {
  const segments = pathname.split("/");
  const firstSegment = segments[1];

  if (locales.includes(firstSegment)) {
    return firstSegment;
  }

  return defaultLocale;
}

const pathnameHasLocale = locales.some(
  (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
);
```

**Examples:**
- `/ar/dashboard` → `pathnameHasLocale = true`, `locale = "ar"`
- `/en/about-us` → `pathnameHasLocale = true`, `locale = "en"`
- `/dashboard` → `pathnameHasLocale = false`, `locale = "en"` (default)
- `/` → `pathnameHasLocale = false`, `locale = "en"` (default)

### Step 2: Redirect if No Locale

```typescript
if (!pathnameHasLocale) {
  // Use Arabic as default for all pages
  const locale = "ar";
  
  // Redirect for all pages that don't have locale
  const shouldRedirect = true;
  
  if (shouldRedirect) {
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }
}
```

**Flow:**
```
User visits: /dashboard
  ↓
Middleware detects: No locale prefix
  ↓
Creates redirect URL: /ar/dashboard
  ↓
NextResponse.redirect(new URL("/ar/dashboard"))
  ↓
Browser redirects (URL changes in browser)
  ↓
New request: /ar/dashboard
  ↓
Middleware detects: Has locale prefix
  ↓
Continue to Step 3
```

### Step 3: Remove Locale from Pathname

```typescript
function removeLocaleFromPathname(pathname: string) {
  const segments = pathname.split("/");
  const firstSegment = segments[1];

  if (locales.includes(firstSegment)) {
    return "/" + segments.slice(2).join("/");
  }

  return pathname;
}

const locale = getLocale(pathname);
const pathnameWithoutLocale = removeLocaleFromPathname(pathname);
```

**Examples:**
- `/ar/dashboard` → `pathnameWithoutLocale = "/dashboard"`
- `/en/about-us` → `pathnameWithoutLocale = "/about-us"`
- `/ar/property/123` → `pathnameWithoutLocale = "/property/123"`
- `/en/` → `pathnameWithoutLocale = "/"`

### Step 4: Rewrite URL (Remove Locale Prefix)

```typescript
const url = request.nextUrl.clone();
url.pathname = pathnameWithoutLocale;

const response = NextResponse.rewrite(url);
```

**What is Rewrite?**
- **URL in browser stays the same** (e.g., `/ar/dashboard`)
- **Next.js internally routes to** `/dashboard` (page file)
- User doesn't see URL change
- Server-side only transformation

**Flow:**
```
Browser shows: /ar/dashboard
  ↓
Middleware rewrites to: /dashboard
  ↓
Next.js loads file: app/dashboard/page.tsx
  ↓
Response sent back to browser
  ↓
Browser still shows: /ar/dashboard
```

### Step 5: Set Locale Headers

```typescript
response.headers.set("x-locale", locale);
response.headers.set("x-html-lang", locale);
response.headers.set("x-pathname", pathnameWithoutLocale);
```

**Headers sent to page component:**
- `x-locale`: `"ar"` or `"en"`
- `x-html-lang`: Same as x-locale (for HTML lang attribute)
- `x-pathname`: Pathname without locale (e.g., `"/dashboard"`)

---

## Redirect vs Rewrite: Critical Difference

### Redirect (Step 2)
**When:** URL has NO locale prefix
**Action:** `NextResponse.redirect()`
**Result:** 
- Browser URL changes
- New HTTP request
- Status code: 307 (Temporary Redirect) or 308 (Permanent)

**Example:**
```
User types: localhost:3000/dashboard
  ↓
Middleware: No locale detected
  ↓
NextResponse.redirect("/ar/dashboard")
  ↓
Browser URL changes to: localhost:3000/ar/dashboard
  ↓
New request sent with: /ar/dashboard
```

### Rewrite (Step 4)
**When:** URL HAS locale prefix
**Action:** `NextResponse.rewrite()`
**Result:**
- Browser URL stays the same
- No new HTTP request
- Internal routing only

**Example:**
```
User visits: localhost:3000/ar/dashboard
  ↓
Middleware: Locale "ar" detected
  ↓
NextResponse.rewrite("/dashboard")
  ↓
Browser URL stays: localhost:3000/ar/dashboard
  ↓
Next.js loads: app/dashboard/page.tsx
```

### Visual Comparison

```
REDIRECT:
Browser: /dashboard → [REDIRECT] → /ar/dashboard
Server:  /dashboard → [NEW REQUEST] → /ar/dashboard → rewrite → /dashboard

REWRITE:
Browser: /ar/dashboard → [NO CHANGE] → /ar/dashboard
Server:  /ar/dashboard → [REWRITE] → /dashboard
```

---

## Special Case: Homepage

```typescript
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
```

**Flow:**
```
User visits: /ar
  ↓
Middleware detects: pathname === "/ar"
  ↓
Rewrite to: /
  ↓
Next.js loads: app/page.tsx
  ↓
Headers: x-locale = "ar", x-pathname = "/"
```

---

## Reading Locale in Page Components

### Server Components (Server-Side)

```typescript
import { headers } from "next/headers";

export default async function Page() {
  const headersList = await headers();
  const locale = headersList.get("x-locale") || "ar";
  const pathname = headersList.get("x-pathname") || "";
  
  return (
    <div>
      <p>Current locale: {locale}</p>
      <p>Pathname: {pathname}</p>
    </div>
  );
}
```

### Client Components

Locale is passed down via props or context (I18nProvider).

```typescript
"use client";
import { useClientI18n } from "@/context-liveeditor/clientI18nStore";

export default function ClientComponent() {
  const { locale, t } = useClientI18n();
  
  return (
    <div>
      <p>{t('welcome_message')}</p>
      <p>Current locale: {locale}</p>
    </div>
  );
}
```

---

## Root Layout Locale Handling

### File: `app/layout.tsx`

```typescript
export default async function RootLayout({ children }) {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");
  const pathname = headersList.get("x-pathname") || "";
  const locale = headersList.get("x-locale") || "";
  
  // Pages that support dynamic dir based on locale
  const landingPages = [
    "/", "/solutions", "/updates", "/landing", "/about-us"
  ];
  
  const isLandingPage = landingPages.includes(pathname);
  
  // Set dir based on locale for specific pages
  const dir = isLandingPage ? (locale === "ar" ? "rtl" : "ltr") : "rtl";

  return (
    <html lang="ar" dir={dir} className="light" suppressHydrationWarning>
      <body>
        {/* ... */}
        {children}
      </body>
    </html>
  );
}
```

**Key Points:**
1. **Landing pages** use dynamic `dir` based on locale:
   - `locale = "ar"` → `dir = "rtl"`
   - `locale = "en"` → `dir = "ltr"`

2. **Other pages** always use `dir = "rtl"` (Arabic by default)

3. HTML `lang` attribute is **always "ar"** (hardcoded)

---

## Locale-Based Redirects in Layout

### Redirect English to Arabic (Except Special Pages)

```typescript
// app/layout.tsx
const isLiveEditorPage = pathname === "/live-editor" || pathname.startsWith("/live-editor/");

if (locale === "en" && !isLiveEditorPage && !isLandingPage) {
  const redirectUrl = `/ar${pathname}`;
  redirect(redirectUrl);
}
```

**Logic:**
- If user accesses English version (`/en/*`)
- AND it's NOT live-editor page
- AND it's NOT a landing page
- THEN redirect to Arabic version (`/ar/*`)

**Examples:**
```
/en/dashboard → redirect → /ar/dashboard
/en/properties → redirect → /ar/properties
/en/live-editor → NO REDIRECT (allowed in English)
/en/landing → NO REDIRECT (allowed in English)
/en/about-us → NO REDIRECT (allowed in English)
```

**Why?**
- Most pages are designed for Arabic (RTL)
- Only specific pages support English properly
- Forces users to use Arabic for dashboard/admin pages

---

## Complete Locale Flow Examples

### Example 1: User Visits Dashboard (No Locale)

```
1. User types: localhost:3000/dashboard
   ↓
2. Middleware receives:
   - pathname = "/dashboard"
   - host = "localhost"
   ↓
3. Check if pathname has locale:
   - pathnameHasLocale = false
   ↓
4. Redirect to add locale:
   - newUrl = "/ar/dashboard"
   - NextResponse.redirect(newUrl)
   ↓
5. Browser redirects (URL changes):
   - New URL: localhost:3000/ar/dashboard
   ↓
6. New request to middleware:
   - pathname = "/ar/dashboard"
   ↓
7. Check if pathname has locale:
   - pathnameHasLocale = true
   - locale = "ar"
   ↓
8. Remove locale from pathname:
   - pathnameWithoutLocale = "/dashboard"
   ↓
9. Rewrite URL:
   - url.pathname = "/dashboard"
   - NextResponse.rewrite(url)
   ↓
10. Set headers:
    - x-locale: "ar"
    - x-pathname: "/dashboard"
    ↓
11. Next.js loads: app/dashboard/page.tsx
    ↓
12. Page receives headers:
    - locale = "ar"
    - pathname = "/dashboard"
    ↓
13. Render page in Arabic
```

### Example 2: User Visits English Homepage

```
1. User visits: localhost:3000/en/
   ↓
2. Middleware receives:
   - pathname = "/en/"
   - normalized to "/en"
   ↓
3. Check if pathname has locale:
   - pathnameHasLocale = true
   - locale = "en"
   ↓
4. Special case check:
   - pathname === "/en" → true
   ↓
5. Rewrite to homepage:
   - url.pathname = "/"
   - NextResponse.rewrite(url)
   ↓
6. Set headers:
   - x-locale: "en"
   - x-pathname: "/"
   ↓
7. Next.js loads: app/page.tsx
   ↓
8. Layout receives:
   - locale = "en"
   - pathname = "/"
   ↓
9. Check if landing page:
   - isLandingPage = true (pathname is "/")
   ↓
10. Set direction:
    - dir = locale === "ar" ? "rtl" : "ltr"
    - dir = "ltr" (because locale is "en")
    ↓
11. No redirect (landing page allowed in English)
    ↓
12. Render homepage in English with LTR direction
```

### Example 3: User Tries English Dashboard

```
1. User visits: localhost:3000/en/dashboard
   ↓
2. Middleware processes:
   - locale = "en"
   - pathnameWithoutLocale = "/dashboard"
   - Sets headers, rewrites to /dashboard
   ↓
3. Next.js loads app/dashboard/page.tsx
   ↓
4. Layout component receives:
   - locale = "en"
   - pathname = "/dashboard"
   ↓
5. Check conditions:
   - locale === "en" → true
   - isLiveEditorPage → false
   - isLandingPage → false
   ↓
6. Redirect condition met:
   - redirectUrl = "/ar/dashboard"
   - redirect(redirectUrl)
   ↓
7. Browser redirects to:
   - localhost:3000/ar/dashboard
   ↓
8. Middleware processes Arabic version
   ↓
9. Render dashboard in Arabic
```

### Example 4: Tenant Subdomain with Locale

```
1. User visits: tenant1.localhost:3000/about-us
   ↓
2. Middleware receives:
   - host = "tenant1.localhost"
   - pathname = "/about-us"
   ↓
3. Extract tenant ID:
   - tenantId = "tenant1"
   ↓
4. Check if pathname has locale:
   - pathnameHasLocale = false
   ↓
5. Redirect to add locale:
   - newUrl = "/ar/about-us"
   - NextResponse.redirect(newUrl)
   ↓
6. Browser redirects:
   - New URL: tenant1.localhost:3000/ar/about-us
   ↓
7. Middleware processes:
   - host = "tenant1.localhost"
   - pathname = "/ar/about-us"
   - tenantId = "tenant1"
   - locale = "ar"
   - pathnameWithoutLocale = "/about-us"
   ↓
8. Rewrite and set headers:
   - x-tenant-id: "tenant1"
   - x-locale: "ar"
   - x-pathname: "/about-us"
   ↓
9. Next.js loads: app/about-us/page.tsx
   ↓
10. Page receives:
    - tenantId = "tenant1"
    - locale = "ar"
    ↓
11. Render tenant's about-us page in Arabic
```

---

## Middleware Configuration

### Matcher Pattern

```typescript
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

**What this means:**
- Middleware runs on **ALL routes** except:
  - `/api/*` - API routes
  - `/_next/static/*` - Static files
  - `/_next/image/*` - Image optimization
  - `/favicon.ico` - Favicon

**Why exclude these?**
- API routes don't need locale prefixes
- Static files are locale-agnostic
- Performance optimization (no unnecessary processing)

---

## Skip Middleware for Specific Paths

```typescript
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
```

**Paths that bypass locale processing:**
- `/api/*` - API routes
- `/_next/*` - Next.js internal files
- Any path with `.` (files like `/logo.png`)
- `/favicon.ico`
- `/images/*`, `/icons/*` - Static assets

---

## Disabled Feature: Auto-Redirect to Arabic

### Historical Context

The middleware used to have a feature that forced **ALL English pages** to redirect to Arabic:

```typescript
// DISABLED CODE (commented out in middleware)
/*
const isEnglishPage = pathname.startsWith("/en/");
const isLiveEditor = pathname.startsWith("/en/live-editor");

if (isEnglishPage && !isLiveEditor) {
  const pathWithoutLocale = pathname.replace("/en", "");
  const newUrl = new URL(`/ar${pathWithoutLocale}`, request.url);
  return NextResponse.redirect(newUrl);
}
*/
```

**Why disabled?**
- Too restrictive - users couldn't access English versions
- Moved logic to Layout component for more granular control
- Now only specific pages (non-landing, non-live-editor) redirect to Arabic

**Current behavior:**
- English pages ARE accessible
- Only dashboard/admin pages redirect to Arabic
- Landing pages can be in English or Arabic

---

## I18n Provider System

### Server-Side I18n

**File: `context-liveeditor/editorI18nStore.ts`**

Provides translations for server components and editor.

### Client-Side I18n

**File: `context-liveeditor/clientI18nStore.ts`**

```typescript
import { create } from "zustand";

type ClientI18nStore = {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string) => string;
};

export const useClientI18nStore = create<ClientI18nStore>((set, get) => ({
  locale: "ar",
  setLocale: (locale) => set({ locale }),
  t: (key) => {
    const { locale } = get();
    // Translation logic
    return translations[locale]?.[key] || key;
  },
}));
```

### I18nProvider Component

**File: `components/providers/I18nProvider.tsx`**

```typescript
"use client";
import { useEffect } from "react";
import { useClientI18nStore } from "@/context-liveeditor/clientI18nStore";

export function I18nProvider({ children }) {
  const setLocale = useClientI18nStore((state) => state.setLocale);
  
  useEffect(() => {
    // Extract locale from URL on client side
    const pathSegments = window.location.pathname.split("/");
    const localeFromPath = pathSegments[1];
    
    if (["ar", "en"].includes(localeFromPath)) {
      setLocale(localeFromPath);
    }
  }, [setLocale]);
  
  return <>{children}</>;
}
```

**Usage in pages:**

```typescript
// app/HomePageWrapper.tsx
import { I18nProvider } from "@/components/providers/I18nProvider";

export default function HomePageWrapper({ tenantId }) {
  return (
    <I18nProvider>
      <div>
        {/* All children can use useClientI18n() to get translations */}
        {children}
      </div>
    </I18nProvider>
  );
}
```

---

## Language Switcher

### Component: LanguageDropdown

**File: `components/tenant/LanguageDropdown.tsx`**

```typescript
"use client";
import { useRouter, usePathname } from "next/navigation";

export function LanguageDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1] || "ar";
  
  const switchLanguage = (newLocale: string) => {
    // Extract pathname without locale
    const pathSegments = pathname.split("/");
    const pathWithoutLocale = pathSegments.slice(2).join("/");
    
    // Build new path with new locale
    const newPath = `/${newLocale}/${pathWithoutLocale}`;
    
    // Navigate to new locale
    router.push(newPath);
  };
  
  return (
    <select 
      value={currentLocale} 
      onChange={(e) => switchLanguage(e.target.value)}
    >
      <option value="ar">العربية</option>
      <option value="en">English</option>
    </select>
  );
}
```

**Flow:**
```
Current URL: /ar/about-us
  ↓
User selects "English"
  ↓
Extract path without locale: "about-us"
  ↓
Build new path: /en/about-us
  ↓
router.push("/en/about-us")
  ↓
Page reloads with English locale
```

---

## RTL/LTR Direction Handling

### Layout-Level Direction

```typescript
// app/layout.tsx
const landingPages = ["/", "/solutions", "/updates", "/landing", "/about-us"];
const isLandingPage = landingPages.includes(pathname);

const dir = isLandingPage ? (locale === "ar" ? "rtl" : "ltr") : "rtl";

return (
  <html lang="ar" dir={dir}>
    {/* ... */}
  </html>
);
```

**Logic:**
1. **Landing pages** (/, /solutions, etc.):
   - Arabic → RTL
   - English → LTR

2. **Other pages** (dashboard, admin, etc.):
   - Always RTL (forced Arabic)

### CSS RTL Support

Tailwind CSS automatically flips certain properties in RTL mode:

```css
/* In LTR (dir="ltr") */
ml-4 → margin-left: 1rem

/* In RTL (dir="rtl") */
ml-4 → margin-right: 1rem (flipped automatically)
```

**RTL-safe classes:**
- `ml-*` / `mr-*` → Auto-flip
- `pl-*` / `pr-*` → Auto-flip
- `left-*` / `right-*` → Auto-flip
- `rounded-l-*` / `rounded-r-*` → Auto-flip

**Use logical properties when possible:**
- `ms-*` (margin-start) - Always correct in RTL/LTR
- `me-*` (margin-end) - Always correct in RTL/LTR

---

## Locale in Metadata Generation

### Server-Side Metadata

```typescript
// app/page.tsx
export async function generateMetadata() {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");
  const locale = headersList.get("x-locale") || "ar";
  
  const meta = await getMetaForSlugServer("/", tenantId);
  
  const title = locale === "ar" 
    ? meta.titleAr || meta.titleEn 
    : meta.titleEn || meta.titleAr;
    
  const description = locale === "ar"
    ? meta.descriptionAr || meta.descriptionEn
    : meta.descriptionEn || meta.descriptionAr;
  
  return {
    title,
    description,
    openGraph: {
      title: meta.og.title || title,
      description: meta.og.description || description,
      locale: locale,
    },
  };
}
```

**Logic:**
- If locale is "ar", prefer Arabic content, fallback to English
- If locale is "en", prefer English content, fallback to Arabic
- Always provide OpenGraph metadata with correct locale

---

## Common Patterns and Best Practices

### Pattern 1: Reading Locale in Server Component

```typescript
import { headers } from "next/headers";

export default async function MyPage() {
  const headersList = await headers();
  const locale = headersList.get("x-locale") || "ar";
  
  return (
    <div>
      {locale === "ar" ? "مرحباً" : "Welcome"}
    </div>
  );
}
```

### Pattern 2: Reading Locale in Client Component

```typescript
"use client";
import { useClientI18n } from "@/context-liveeditor/clientI18nStore";

export default function MyClientComponent() {
  const { locale, t } = useClientI18n();
  
  return (
    <div>
      {t('welcome_message')}
    </div>
  );
}
```

### Pattern 3: Building Locale-Aware Links

```typescript
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LocalizedLink({ href, children }) {
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1] || "ar";
  
  const localizedHref = `/${currentLocale}${href}`;
  
  return <Link href={localizedHref}>{children}</Link>;
}

// Usage:
<LocalizedLink href="/about-us">About Us</LocalizedLink>
// Renders: <Link href="/ar/about-us"> if current locale is "ar"
// Renders: <Link href="/en/about-us"> if current locale is "en"
```

### Pattern 4: Conditional Rendering Based on Locale

```typescript
export default function ConditionalContent() {
  const locale = useClientI18nStore(state => state.locale);
  
  return (
    <div>
      {locale === "ar" ? (
        <ArabicContent />
      ) : (
        <EnglishContent />
      )}
    </div>
  );
}
```

---

## Debugging Locale Issues

### Check Current Locale

```javascript
// Browser console
const pathname = window.location.pathname;
const locale = pathname.split("/")[1];
console.log("Current locale:", locale);

// Check headers (in server component)
const headersList = await headers();
console.log("x-locale header:", headersList.get("x-locale"));
```

### Common Issues

#### Issue 1: "Page redirects infinitely"
**Cause:** Middleware redirects to add locale, but locale is immediately removed
**Solution:** Check if pathname correctly includes locale after redirect

#### Issue 2: "Wrong direction (RTL/LTR)"
**Cause:** `dir` attribute not set correctly in Layout
**Solution:** Verify `isLandingPage` logic and locale detection

#### Issue 3: "Translations don't work"
**Cause:** I18nProvider not wrapping component, or locale not extracted from URL
**Solution:** 
- Ensure I18nProvider wraps components
- Check `useClientI18n()` hook returns correct locale

#### Issue 4: "Links lose locale prefix"
**Cause:** Hard-coded links without locale
**Solution:** Use LocalizedLink component or manually add locale prefix

---

## Summary

### Key Principles

1. **All URLs must have locale prefix** (except API and static files)
   - Middleware automatically redirects to add `/ar` if missing

2. **Redirect vs Rewrite**
   - Redirect: When NO locale → adds locale and changes URL
   - Rewrite: When HAS locale → removes locale internally, keeps URL

3. **Locale is passed via headers**
   - `x-locale`: Current locale ("ar" or "en")
   - `x-pathname`: Pathname without locale

4. **RTL/LTR handling**
   - Landing pages: Dynamic based on locale
   - Other pages: Always RTL (forced Arabic)

5. **English restrictions**
   - Dashboard/admin pages redirect to Arabic
   - Landing pages allowed in English
   - Live-editor allowed in English

6. **Locale persistence**
   - URL-based (no cookies/localStorage)
   - Each navigation maintains current locale
   - Language switcher changes URL locale prefix

### Flow Summary

```
User Request
  ↓
Middleware checks locale in URL
  ↓
No locale? → REDIRECT to /ar/path (URL changes)
Has locale? → Continue
  ↓
Remove locale from pathname
  ↓
REWRITE to path without locale (URL stays same)
  ↓
Set headers (x-locale, x-pathname)
  ↓
Next.js loads page file
  ↓
Layout checks locale for RTL/LTR
  ↓
Layout may redirect /en to /ar (for non-landing pages)
  ↓
Page renders with correct locale
```

This system ensures all pages have proper locale handling while maintaining clean URLs and proper i18n support.

