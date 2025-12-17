# GA4 Analytics - Architecture & Components

> **Part of**: [GA4 Analytics System Documentation](./README.md)

This document provides an in-depth understanding of the GA4 Analytics system architecture, core components, and data flow.

---

## Table of Contents

1. [System Layers](#system-layers)
2. [File Structure](#file-structure)
3. [Multi-Tenant Tracking Strategy](#multi-tenant-tracking-strategy)
4. [Core Components Deep Dive](#core-components-deep-dive)
5. [Integration with Middleware](#integration-with-middleware)
6. [Data Flow Architecture](#data-flow-architecture)

---

## System Layers

### High-Level Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     User Visits Tenant Website                  │
│                  (subdomain.taearif.com OR custom.com)          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Next.js Middleware (middleware.ts)                 │
│  - Detects tenant from subdomain/custom domain                 │
│  - Sets headers: x-tenant-id, x-domain-type, x-pathname         │
│  - Validates domain type                                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Server Component (page.tsx)                        │
│  - Reads headers from middleware                                │
│  - Extracts tenantId from x-tenant-id header                    │
│  - Passes tenantId to client wrapper component                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│         Client Wrapper Component (e.g., HomePageWrapper)        │
│  - Wraps page content with providers                            │
│  - Passes tenantId down to GTMProvider and GA4Provider          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
        ┌────────────────────┴────────────────────┐
        ▼                                         ▼
┌──────────────────┐                    ┌──────────────────┐
│   GTMProvider    │                    │   GA4Provider    │
│  (GTM Tracking)  │                    │  (GA4 Tracking)  │
└──────────────────┘                    └────────┬─────────┘
                                                 │
                         ┌───────────────────────┼───────────────────────┐
                         ▼                       ▼                       ▼
              ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
              │  initializeGA4() │   │ trackPageView()  │   │ trackPropertyView│
              │   (lib/ga4)      │   │   (automatic)    │   │   (on demand)    │
              └──────────────────┘   └──────────────────┘   └──────────────────┘
                         │                       │                       │
                         └───────────────────────┼───────────────────────┘
                                                 ▼
                                    ┌────────────────────────┐
                                    │  Google Analytics 4    │
                                    │  Event Collection      │
                                    │  (with tenant_id)      │
                                    └────────────────────────┘
```

---

## File Structure

```
project-root/
├── middleware.ts                          # Tenant detection, header injection
├── app/
│   ├── page.tsx                           # Homepage server component
│   ├── [slug]/page.tsx                    # Tenant pages server component
│   ├── property/[id]/page.tsx             # Property detail server component
│   ├── project/[id]/page.tsx              # Project detail server component
│   ├── HomePageWrapper.tsx                # Homepage client wrapper
│   ├── TenantPageWrapper.tsx              # Tenant pages client wrapper
│   └── property/[id]/PropertyPageWrapper.tsx  # Property detail client wrapper
├── components/
│   ├── GA4Provider.tsx                    # GA4 initialization & tracking provider
│   └── GTMProvider.tsx                    # Google Tag Manager provider
├── lib/
│   ├── ga4-tracking.ts                    # Core GA4 tracking functions
│   └── gtm.ts                             # GTM utility functions
└── docs/important/GA4/
    ├── README.md                          # Documentation index
    ├── ARCHITECTURE.md                    # This file
    ├── TRACKING_AND_EVENTS.md             # Tracking implementation
    ├── CONFIGURATION.md                   # Environment setup
    ├── DEBUGGING.md                       # Troubleshooting guide
    └── BEST_PRACTICES.md                  # Best practices & security
```

---

## Multi-Tenant Tracking Strategy

### The Challenge

In a multi-tenant architecture where:

- **Base domain** (`taearif.com`, `www.taearif.com`) - Main platform, no tracking needed
- **Tenant subdomains** (`lira.taearif.com`, `company.taearif.com`) - Individual client websites
- **Custom domains** (`customdomain.com`, `mybusiness.net`) - Client-owned domains pointing to platform

We need to:

1. **Exclude** main platform from GA4 tracking (to avoid polluting tenant analytics)
2. **Include** all tenant websites (subdomains and custom domains)
3. **Attach** `tenant_id` to every event for proper segmentation
4. **Validate** tenant IDs to prevent invalid data

### Solution Architecture

#### 1. Middleware Layer (Server-Side Detection)

**File**: `middleware.ts`

The middleware runs on **every request** and:

- Extracts the hostname from the request
- Determines if it's a subdomain or custom domain
- Identifies the `tenant_id`
- Sets custom headers (`x-tenant-id`, `x-domain-type`, `x-pathname`)

```typescript
// Simplified middleware logic
export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  // Extract tenant ID from subdomain or custom domain
  let tenantId = getTenantIdFromHost(host);

  // Set headers for server components
  const headers = new Headers(request.headers);
  headers.set("x-tenant-id", tenantId || "");
  headers.set("x-domain-type", domainType);
  headers.set("x-pathname", pathname);

  return NextResponse.next({ request: { headers } });
}
```

#### 2. Server Component Layer (Header Reading)

**Files**: `app/page.tsx`, `app/[slug]/page.tsx`, etc.

Server components read the headers set by middleware:

```typescript
// app/page.tsx
export default async function HomePage() {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");
  const domainType = headersList.get("x-domain-type");

  // Pass to client wrapper
  return <HomePageWrapper tenantId={tenantId} domainType={domainType} />;
}
```

#### 3. Client Wrapper Layer (Provider Injection)

**Files**: `app/HomePageWrapper.tsx`, `app/TenantPageWrapper.tsx`, etc.

Client components wrap content with analytics providers:

```typescript
// app/HomePageWrapper.tsx
export default function HomePageWrapper({ tenantId, domainType }) {
  return (
    <GTMProvider>
      <GA4Provider tenantId={tenantId}>
        <I18nProvider>
          {/* Page content */}
        </I18nProvider>
      </GA4Provider>
    </GTMProvider>
  );
}
```

---

## Core Components Deep Dive

### 1. GA4Provider Component

**File**: `components/GA4Provider.tsx`

**Responsibility**:

- Initialize GA4 script on mount
- Automatically track page views on route changes
- Validate tenant IDs before tracking
- Set tenant context for all events
- **[NEW]** Handle custom domains by using `username` from API

**Key Features**:

- **One-Time Initialization**: Uses `useState` to ensure GA4 script loads only once
- **Domain Filtering**: Skips tracking for base domain (`www.taearif.com`, `taearif.com`)
- **Custom Domain Support**: Tracks custom domains (e.g., `liraksa.com`)
- **Tenant ID Fallback**: If `tenantId` prop is empty, extracts from domain
- **API Integration**: Subscribes to `tenantStore` to get `username` for custom domains
- **Smart tenant_id Selection**: Uses `username` from API for custom domains, subdomain for others
- **Validation Layer**: Multiple checks to prevent invalid tenant IDs
- **Automatic Page View Tracking**: Triggers on `pathname` change
- **Delayed Tracking**: 500ms timeout to ensure GTM loads first

**Updated Props** (December 2024):

- `tenantId: string | null` - Tenant identifier from middleware
- `domainType?: "subdomain" | "custom" | null` - **[NEW]** Domain type for smart routing
- `children: React.ReactNode` - Child components

**Full Code Analysis (Updated December 2024)**:

```typescript
// components/GA4Provider.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  initializeGA4,
  trackPageView,
  setTenantContext,
} from "@/lib/ga4-tracking";
import useTenantStore from "@/context-liveeditor/tenantStore";  // ← NEW

interface GA4ProviderProps {
  tenantId: string | null;
  domainType?: "subdomain" | "custom" | null;  // ← NEW
  children: React.ReactNode;
}

export default function GA4Provider({ tenantId, domainType, children }: GA4ProviderProps) {
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);

  // ← NEW: Get username from tenantStore for custom domains
  const tenantData = useTenantStore((s) => s.tenantData);

  // ═══════════════════════════════════════════════════════════════
  // INITIALIZATION EFFECT - Runs only once
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
    const shouldTrack = shouldTrackDomain(currentDomain);

    // Skip tracking for base domain
    if (!shouldTrack) {
      console.log('Skipping GA4 tracking for domain:', currentDomain);
      return;
    }

    // Initialize GA4 script
    if (!isInitialized) {
      initializeGA4();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // ═══════════════════════════════════════════════════════════════
  // PAGE VIEW TRACKING EFFECT - Runs on route change
  // UPDATED: Now handles custom domains with username from API
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentDomain = window.location.hostname;
    const domainTenantId = getTenantIdFromDomain(currentDomain);

    // Fallback: Use tenantId prop if valid, else extract from domain
    let finalTenantId = (tenantId && tenantId.trim() !== '') ? tenantId : domainTenantId;

    // ✅ NEW: For custom domains, use username from API instead of domain
    if (domainType === 'custom' && tenantData?.username) {
      finalTenantId = tenantData.username;
      console.log('🌐 GA4: Using username from API for custom domain:', finalTenantId);
    }

    // Validate tenant ID
    const isValidTenantId = finalTenantId &&
                           finalTenantId.trim() !== '' &&
                           finalTenantId !== 'www' &&
                           finalTenantId !== '(not set)';

    if (isValidTenantId && pathname && isInitialized) {
      // Set tenant context (user properties)
      setTenantContext(finalTenantId, finalTenantId);

      // Track page view with tenant_id as event parameter
      setTimeout(() => {
        trackPageView(finalTenantId, pathname);
      }, 500); // Delay to ensure GTM loads first
    } else {
      console.warn('⚠️ Missing required data for tracking:', {
        finalTenantId,
        pathname,
        isInitialized,
        isValidTenantId,
        domainType,  // ← NEW
        tenantDataUsername: tenantData?.username,  // ← NEW
      });
    }
  }, [tenantId, pathname, isInitialized, domainType, tenantData?.username]);  // ← UPDATED dependencies

  return <>{children}</>;
}

// ═══════════════════════════════════════════════════════════════
// DOMAIN VALIDATION HELPER
// ═══════════════════════════════════════════════════════════════
const shouldTrackDomain = (domain: string): boolean => {
  const productionDomain = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "taearif.com";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const isDevelopment = process.env.NODE_ENV === "development";

  const localDomain = new URL(apiUrl).hostname;

  // Don't track main domain
  if (domain === `www.${productionDomain}` || domain === productionDomain) {
    console.log('Skipping tracking for main domain:', domain);
    return false;
  }

  // Track tenant subdomains (e.g., lira.taearif.com)
  if (domain.endsWith(`.${productionDomain}`)) {
    const subdomain = domain.replace(`.${productionDomain}`, '');
    if (subdomain === 'www') {
      console.log('Skipping tracking for www subdomain');
      return false;
    }
    return true;
  }

  // Track localhost for development
  if (isDevelopment && (domain === localDomain || domain.includes(localDomain))) {
    return true;
  }

  // ✅ NEW: Track custom domains (any domain that's not the base domain)
  // Custom domains like: liraksa.com, mybusiness.net, etc.
  const isCustomDomain = /\.(com|net|org|io|co|me|info|biz|name|pro|aero|asia|cat|coop|edu|gov|int|jobs|mil|museum|tel|travel|xxx)$/i.test(domain);
  if (isCustomDomain) {
    console.log('Tracking custom domain:', domain);
    return true;
  }

  return false;
};

// ═══════════════════════════════════════════════════════════════
// TENANT ID EXTRACTION HELPER
// ═══════════════════════════════════════════════════════════════
const getTenantIdFromDomain = (domain: string): string | null => {
  const productionDomain = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "taearif.com";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const isDevelopment = process.env.NODE_ENV === "development";

  const localDomain = new URL(apiUrl).hostname;

  // Production: lira.taearif.com -> lira
  if (domain.endsWith(`.${productionDomain}`)) {
    const subdomain = domain.replace(`.${productionDomain}`, "");

    // Exclude 'www' and empty subdomains
    if (!subdomain || subdomain.trim() === '' || subdomain === 'www') {
      console.warn('Skipping invalid subdomain (not a tenant):', subdomain);
      return null;
    }

    console.log('Extracted tenant from production domain:', subdomain);
    return subdomain;
  }

  // Development: lira.localhost -> lira
  if (isDevelopment && domain.includes(localDomain)) {
    const parts = domain.split(".");
    if (parts.length > 1 && parts[0] !== localDomain) {
      const subdomain = parts[0];

      if (!subdomain || subdomain.trim() === '' || subdomain === 'www') {
        console.warn('Skipping invalid subdomain (not a tenant):', subdomain);
        return null;
      }

      console.log('Extracted tenant from dev domain:', subdomain);
      return subdomain;
    }
  }

  console.warn('Could not extract tenant from domain:', domain);
  return null;
};
```

**Key Insights**:

1. **Why Two Effects?**
   - **First Effect** (`[isInitialized]`): Loads GA4 script once, checks domain validity
   - **Second Effect** (`[tenantId, pathname, isInitialized, domainType, tenantData?.username]`): Tracks page views on navigation

2. **Why `setTimeout(500)`?**
   - Ensures GTM script loads before GA4 fires events
   - Prevents race conditions in tag firing order

3. **Why Fallback Logic?**
   - Server component might pass empty `tenantId` in edge cases
   - Client-side domain extraction acts as backup

4. **Why Skip 'www'?**
   - `www.taearif.com` is the base domain, not a tenant
   - Prevents polluting GA4 with non-tenant traffic

5. **[NEW] Why Use username from API for Custom Domains?** (December 2024)
   - **Problem**: Custom domains like `liraksa.com` would send full domain as `tenant_id`
   - **Solution**: Fetch tenant data, use `username` field (e.g., `"lira"`)
   - **Benefit**: Consistent `tenant_id` regardless of domain type (subdomain vs custom)
   - **Example**: Both `lira.taearif.com` and `liraksa.com` send `tenant_id: "lira"`

6. **[NEW] How Custom Domain Detection Works?**
   - `shouldTrackDomain()` now includes regex for custom TLDs (.com, .net, etc.)
   - Any valid custom domain triggers tracking
   - GA4Provider checks `domainType === 'custom'` to use API username

---

### 2. Core Tracking Functions

**File**: `lib/ga4-tracking.ts`

**Responsibility**:

- Load GA4 script dynamically
- Provide tracking functions for different event types
- Validate all data before sending to GA4
- Configure GA4 with custom settings

**Full Code Analysis**:

```typescript
// lib/ga4-tracking.ts
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-RVFKM2F9ZN";

// ═══════════════════════════════════════════════════════════════
// FUNCTION: initializeGA4()
// PURPOSE: Load GA4 script and configure tracking
// ═══════════════════════════════════════════════════════════════
export function initializeGA4(): void {
  if (typeof window === "undefined") return;

  // Prevent duplicate script loading
  if (!window.gtag) {
    // Create and inject GA4 script
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag function
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());

    // Configure GA4 - IMPORTANT: Disable automatic page_view
    window.gtag("config", GA_MEASUREMENT_ID, {
      send_page_view: false, // We track manually with tenant_id
    });

    console.log("✅ GA4 initialized:", GA_MEASUREMENT_ID);
  }
}

// ═══════════════════════════════════════════════════════════════
// FUNCTION: setTenantContext()
// PURPOSE: Set user properties for tenant grouping
// ═══════════════════════════════════════════════════════════════
export function setTenantContext(tenantId: string, username: string): void {
  if (typeof window === "undefined" || !window.gtag) return;

  // Validate tenant_id
  if (!tenantId || tenantId.trim() === "" || tenantId === "www") {
    console.warn("⚠️ Invalid tenant_id, skipping context setting:", tenantId);
    return;
  }

  // Set user properties (persists across events)
  window.gtag("set", "user_properties", {
    tenant_id: tenantId,
    username: username,
  });

  console.log("🔧 Tenant context set:", tenantId);
}

// ═══════════════════════════════════════════════════════════════
// FUNCTION: trackPageView()
// PURPOSE: Send page_view event with tenant_id as parameter
// CRITICAL: This is how backend receives tenant_id
// ═══════════════════════════════════════════════════════════════
export function trackPageView(tenantId: string, pagePath: string): void {
  if (typeof window === "undefined" || !window.gtag) {
    console.warn("⚠️ gtag not available");
    return;
  }

  // Validate tenant_id
  if (!tenantId || tenantId.trim() === "" || tenantId === "www") {
    console.warn("⚠️ Invalid tenant_id, skipping tracking:", tenantId);
    return;
  }

  // Send page_view event with tenant_id as custom parameter
  window.gtag("event", "page_view", {
    page_path: pagePath,
    tenant_id: tenantId, // ← Backend looks for this!
  });

  console.log("📊 Page view tracked:", {
    path: pagePath,
    tenant_id: tenantId,
  });
}

// ═══════════════════════════════════════════════════════════════
// FUNCTION: trackPropertyView()
// PURPOSE: Track when user views a property detail page
// ═══════════════════════════════════════════════════════════════
export function trackPropertyView(
  tenantId: string,
  propertySlug: string,
): void {
  if (typeof window === "undefined" || !window.gtag) return;

  if (!tenantId || tenantId.trim() === "" || tenantId === "www") {
    console.warn(
      "⚠️ Invalid tenant_id, skipping property view tracking:",
      tenantId,
    );
    return;
  }

  window.gtag("event", "view_property", {
    property_slug: propertySlug,
    tenant_id: tenantId, // ← Always include tenant_id
  });

  console.log("🏠 Property view tracked:", {
    slug: propertySlug,
    tenant_id: tenantId,
  });
}

// ═══════════════════════════════════════════════════════════════
// FUNCTION: trackProjectView()
// PURPOSE: Track when user views a project detail page
// ═══════════════════════════════════════════════════════════════
export function trackProjectView(tenantId: string, projectSlug: string): void {
  if (typeof window === "undefined" || !window.gtag) return;

  if (!tenantId || tenantId.trim() === "" || tenantId === "www") {
    console.warn(
      "⚠️ Invalid tenant_id, skipping project view tracking:",
      tenantId,
    );
    return;
  }

  window.gtag("event", "view_project", {
    project_slug: projectSlug,
    tenant_id: tenantId,
  });

  console.log("🏢 Project view tracked:", {
    slug: projectSlug,
    tenant_id: tenantId,
  });
}

// ═══════════════════════════════════════════════════════════════
// FUNCTION: trackEvent()
// PURPOSE: Generic event tracking with tenant_id
// ═══════════════════════════════════════════════════════════════
export function trackEvent(
  eventName: string,
  tenantId: string,
  eventParams?: Record<string, any>,
): void {
  if (typeof window === "undefined" || !window.gtag) return;

  if (!tenantId || tenantId.trim() === "" || tenantId === "www") {
    console.warn("⚠️ Invalid tenant_id, skipping event tracking:", tenantId);
    return;
  }

  window.gtag("event", eventName, {
    ...eventParams,
    tenant_id: tenantId, // ← ALWAYS include tenant_id
  });

  console.log(`📌 Event tracked: ${eventName}`, {
    tenant_id: tenantId,
    ...eventParams,
  });
}
```

**Key Insights**:

1. **Why Disable `send_page_view: false`?**
   - Default GA4 sends `page_view` automatically without `tenant_id`
   - We need manual control to inject `tenant_id` into every event
   - This is **critical** for multi-tenant analytics

2. **Why Validate Every Function?**
   - Prevents empty `tenant_id` from reaching GA4
   - Avoids polluting data with invalid values like `'www'`, `'(not set)'`
   - Ensures clean, queryable data in GA4 reports

3. **Why `tenant_id` as Event Parameter (not just User Property)?**
   - **User Properties**: Persist across events but harder to filter in reports
   - **Event Parameters**: Easier to create custom reports and segments
   - **Both Approaches Used**: Context sets user properties, events set parameters

---

### 3. GTMProvider Component

**File**: `components/GTMProvider.tsx`

**Responsibility**:

- Load Google Tag Manager script
- Track page views for GTM tags
- Initialize dataLayer

**Code Analysis**:

```typescript
// components/GTMProvider.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { initDataLayer, trackPageView } from "@/lib/gtm";

interface GTMProviderProps {
  children: React.ReactNode;
}

export default function GTMProvider({ children }: GTMProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize dataLayer on mount
  useEffect(() => {
    initDataLayer();
  }, []);

  // Track page views on route changes
  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    trackPageView(url);
  }, [pathname, searchParams]);

  return (
    <>
      {/* Google Tag Manager Script */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID || "GTM-KS62NNTG"}');
          `,
        }}
      />
      {children}
    </>
  );
}
```

**Key Insights**:

1. **Why Both GTM and GA4?**
   - **GTM**: Manages all tags (GA4, Facebook Pixel, etc.) from one dashboard
   - **GA4**: Direct integration for custom event tracking
   - **Strategy**: Use GTM for tag management, GA4 for programmatic tracking

2. **Why `strategy="afterInteractive"`?**
   - Loads script after page becomes interactive
   - Prevents blocking initial page render
   - Optimizes performance

---

### 4. GTM Utility Functions

**File**: `lib/gtm.ts`

**Responsibility**:

- Initialize GTM dataLayer with tenant configuration
- Provide utility functions for event tracking
- Extract tenant ID from domain for GTM

**Code Analysis**:

```typescript
// lib/gtm.ts
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// ═══════════════════════════════════════════════════════════════
// FUNCTION: initDataLayer()
// PURPOSE: Initialize GTM with tenant-specific configuration
// ═══════════════════════════════════════════════════════════════
export const initDataLayer = () => {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function () {
        window.dataLayer.push(arguments);
      };

    // Initialize GA4 with tenant configuration
    const ga4Id =
      process.env.NEXT_PUBLIC_GA4_ID ||
      process.env.GOOGLE_ANALYTICS_PROPERTY_ID ||
      "G-WTN83NMVW1";
    const tenantId = getTenantIdFromCurrentDomain();

    if (tenantId) {
      window.gtag("js", new Date());
      window.gtag("config", ga4Id, {
        custom_map: {
          dimension1: "tenant_id", // Map tenant_id to custom dimension 1
        },
        tenant_id: tenantId,
      });
      console.log(`GA4 tenant_id = ${tenantId}`);
    }
  }
};

// ═══════════════════════════════════════════════════════════════
// FUNCTION: getTenantIdFromCurrentDomain()
// PURPOSE: Extract tenant ID from current browser domain
// ═══════════════════════════════════════════════════════════════
const getTenantIdFromCurrentDomain = (): string | null => {
  if (typeof window === "undefined") return null;

  const productionDomain =
    process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "taearif.com";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const isDevelopment = process.env.NODE_ENV === "development";

  const localDomain = new URL(apiUrl).hostname;
  const currentDomain = window.location.hostname;

  // Production: tenant1.taearif.com -> tenant1
  if (!isDevelopment && currentDomain.endsWith(`.${productionDomain}`)) {
    return currentDomain.replace(`.${productionDomain}`, "");
  }

  // Development: tenant1.localhost -> tenant1
  if (isDevelopment && currentDomain.includes(localDomain)) {
    const parts = currentDomain.split(".");
    if (parts.length > 1 && parts[0] !== localDomain) {
      return parts[0];
    }
  }

  return null;
};

// Other tracking functions: trackEvent, trackPageView, etc.
```

**Key Insights**:

1. **Custom Dimension Mapping**:
   - `dimension1: "tenant_id"` maps the `tenant_id` parameter to GA4's custom dimension 1
   - Must be configured in GA4 admin panel to match

2. **Dual Initialization**:
   - Both `lib/ga4-tracking.ts` and `lib/gtm.ts` initialize GA4
   - GTM version includes custom dimension mapping
   - GA4 version provides manual tracking control

---

## Integration with Middleware

### How Middleware Feeds tenantId to GA4

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User visits: lira.taearif.com/for-rent                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. Middleware (middleware.ts)                                   │
│    - Extracts host: "lira.taearif.com"                          │
│    - Calls getTenantIdFromHost("lira.taearif.com")              │
│    - Returns tenantId = "lira"                                  │
│    - Sets header: x-tenant-id = "lira"                          │
│    - Sets header: x-domain-type = "subdomain"                   │
│    - Sets header: x-pathname = "/for-rent"                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. Server Component (app/[slug]/page.tsx)                       │
│    const headersList = await headers();                         │
│    const tenantId = headersList.get("x-tenant-id");  // "lira"  │
│    const domainType = headersList.get("x-domain-type");         │
│    return <TenantPageWrapper tenantId={tenantId} slug="for-rent" />│
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Client Wrapper (app/TenantPageWrapper.tsx)                   │
│    <GTMProvider>                                                 │
│      <GA4Provider tenantId="lira">                               │
│        {children}                                                │
│      </GA4Provider>                                              │
│    </GTMProvider>                                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. GA4Provider (components/GA4Provider.tsx)                      │
│    - Receives tenantId prop = "lira"                             │
│    - Calls trackPageView("lira", "/for-rent")                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. Google Analytics 4                                            │
│    Event: page_view                                              │
│    Parameters:                                                   │
│      - page_path: "/for-rent"                                    │
│      - tenant_id: "lira"                                         │
└─────────────────────────────────────────────────────────────────┘
```

### Related Documentation

For detailed understanding of middleware tenant detection:

- **See**: `docs/important/MIDDLEWARE_TENANT_DETECTION.md`
- **Key Functions**: `getTenantIdFromHost()`, `getTenantIdFromCustomDomain()`
- **Header Injection**: `x-tenant-id`, `x-domain-type`, `x-pathname`, `x-locale`

---

## Data Flow Architecture

### Page Load Flow with GA4 Tracking

```
USER ACTION: Navigate to tenant website
              ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1: Middleware Processing (Server-Side)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  File: middleware.ts

  Input: Request to "lira.taearif.com/for-rent"

  Process:
    1. Extract hostname from request
    2. Determine if subdomain or custom domain
    3. Extract tenant ID
    4. Set custom headers

  Output:
    Headers:
      x-tenant-id: "lira"
      x-domain-type: "subdomain"
      x-pathname: "/for-rent"
      x-locale: "ar"
              ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2: Server Component Rendering
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  File: app/[slug]/page.tsx

  Process:
    1. Read headers from middleware
    2. Extract tenantId and domainType
    3. Pass to client wrapper component

  Code:
    const headersList = await headers();
    const tenantId = headersList.get("x-tenant-id");
    return <TenantPageWrapper tenantId={tenantId} slug="for-rent" />;
              ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3: Client Wrapper Mounting (Client-Side)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  File: app/TenantPageWrapper.tsx

  Process:
    1. Receive tenantId prop
    2. Wrap content with providers
    3. Pass tenantId to GA4Provider

  JSX:
    <GTMProvider>
      <GA4Provider tenantId="lira">
        <I18nProvider>
          {content}
        </I18nProvider>
      </GA4Provider>
    </GTMProvider>
              ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4: GTM Initialization (First Provider)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  File: components/GTMProvider.tsx

  Process:
    1. Load GTM script
    2. Initialize dataLayer
    3. Configure with tenant_id from domain

  Timing: Immediately on mount
              ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5: GA4 Initialization (Second Provider)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  File: components/GA4Provider.tsx

  Process:
    1. Check if domain should be tracked
    2. Initialize GA4 script (if not already loaded)
    3. Set initialized state

  Code Flow:
    useEffect(() => {
      const shouldTrack = shouldTrackDomain(currentDomain);
      if (!shouldTrack) return;

      if (!isInitialized) {
        initializeGA4();
        setIsInitialized(true);
      }
    }, [isInitialized]);

  Output: GA4 script loaded, gtag() function available
              ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 6: Page View Tracking
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  File: components/GA4Provider.tsx

  Trigger: pathname changes OR component mounts

  Process:
    1. Extract final tenant ID (prop or domain)
    2. Validate tenant ID
    3. Set tenant context
    4. Track page view with 500ms delay

  Code Flow:
    useEffect(() => {
      const finalTenantId = tenantId || getTenantIdFromDomain();

      if (isValidTenantId && pathname && isInitialized) {
        setTenantContext(finalTenantId, finalTenantId);

        setTimeout(() => {
          trackPageView(finalTenantId, pathname);
        }, 500);
      }
    }, [tenantId, pathname, isInitialized]);

  GA4 Event Sent:
    event: "page_view"
    parameters:
      page_path: "/for-rent"
      tenant_id: "lira"
              ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 7: Google Analytics Processing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Service: Google Analytics 4

  Receives:
    {
      event_name: "page_view",
      event_params: {
        page_path: "/for-rent",
        tenant_id: "lira"
      },
      user_properties: {
        tenant_id: "lira",
        username: "lira"
      }
    }

  Processing:
    - Stores event in BigQuery
    - Updates real-time reports
    - Applies custom dimension mapping
    - Enables filtering by tenant_id in reports
```

---

---

## Custom Domain Integration (Added December 2024)

### Complete Flow for Custom Domains

```
┌─────────────────────────────────────────────────────────────────┐
│ User visits Custom Domain: liraksa.com/ar                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: Middleware Detection                                    │
│  - host = "liraksa.com"                                          │
│  - getTenantIdFromHost() → null (no subdomain)                  │
│  - getTenantIdFromCustomDomain() → "liraksa.com" ✅             │
│  - Sets headers:                                                │
│    x-tenant-id: "liraksa.com"                                   │
│    x-domain-type: "custom"  ← CRITICAL                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: Server Component                                        │
│  - Reads headers: tenantId="liraksa.com", domainType="custom"  │
│  - Passes both to wrapper                                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: Wrapper Component (e.g., HomePageWrapper)              │
│  - Calls: fetchTenantData("liraksa.com")                       │
│  - API Request: POST /v1/tenant-website/getTenant              │
│    Body: { websiteName: "liraksa.com" }                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: API Response                                            │
│  {                                                               │
│    username: "lira",  ← This is what we need!                   │
│    globalComponentsData: {...},                                 │
│    componentSettings: {...},                                    │
│    ...                                                           │
│  }                                                               │
│  - Stored in tenantStore: tenantData.username = "lira"         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 5: GA4Provider Logic                                       │
│  - tenantId prop = "liraksa.com"                                │
│  - domainType = "custom"                                        │
│  - tenantData.username = "lira" (from tenantStore)              │
│  - Condition Check:                                             │
│    if (domainType === 'custom' && tenantData?.username)        │
│      finalTenantId = tenantData.username  ✅                    │
│  - Result: finalTenantId = "lira"                               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 6: GA4 Event Sent                                          │
│  Event: page_view                                                │
│  Parameters:                                                     │
│    page_path: "/ar"                                             │
│    tenant_id: "lira"  ✅✅✅                                     │
│                                                                  │
│  Network Request:                                                │
│  https://www.google-analytics.com/g/collect?                    │
│    v=2&en=page_view&ep.tenant_id=lira                           │
└─────────────────────────────────────────────────────────────────┘
```

### Comparison Table

| Domain Type       | Example            | Middleware tenantId | API Called? | API username | GA4 tenant_id              |
| ----------------- | ------------------ | ------------------- | ----------- | ------------ | -------------------------- |
| **Base Domain**   | `www.taearif.com`  | `null`              | ❌ No       | -            | - (No tracking)            |
| **Subdomain**     | `lira.taearif.com` | `"lira"`            | ✅ Yes      | `"lira"`     | `"lira"` (from middleware) |
| **Custom Domain** | `liraksa.com`      | `"liraksa.com"`     | ✅ Yes      | `"lira"`     | **`"lira"`** (from API) ✅ |

### Key Files Modified

1. **`components/GA4Provider.tsx`**
   - Added `domainType` prop
   - Added `useTenantStore` subscription
   - Added custom domain logic: `if (domainType === 'custom' && tenantData?.username)`

2. **`app/HomePageWrapper.tsx`**
   - Passes `domainType` to GA4Provider

3. **`app/TenantPageWrapper.tsx`**
   - Passes `domainType` to GA4Provider

4. **`app/property/[id]/PropertyPageWrapper.tsx`**
   - Passes `domainType` to GA4Provider
   - Uses username for `trackPropertyView()`

5. **`app/project/[id]/ProjectPageWrapper.tsx`**
   - Passes `domainType` to GA4Provider
   - Uses username for `trackProjectView()`

### Console Logs for Debugging

When visiting a custom domain, you should see:

```
✅ Middleware: Custom domain detected: liraksa.com
✅ Middleware: Setting tenant ID header: liraksa.com
✅ Middleware: Domain type: custom
Tracking custom domain: liraksa.com
🌐 GA4: Using username from API for custom domain: lira
📊 Page view tracked: { path: "/ar", tenant_id: "lira" }
```

### Benefits

1. **Consistent Tracking**: Same `tenant_id` for subdomain and custom domain
2. **Clean Data**: No full domain names in GA4 reports
3. **Accurate Analytics**: All tenant traffic unified under single ID
4. **Scalable**: Works for any custom domain configuration

---

## Next Steps

- **For Tracking Implementation**: See [TRACKING_AND_EVENTS.md](./TRACKING_AND_EVENTS.md)
- **For Environment Setup**: See [CONFIGURATION.md](./CONFIGURATION.md)
- **For Troubleshooting**: See [DEBUGGING.md](./DEBUGGING.md)
- **For Best Practices**: See [BEST_PRACTICES.md](./BEST_PRACTICES.md)

---

**Last Updated**: December 28, 2024  
**Version**: 2.1 (Added Custom Domain Support)
