# Middleware and Tenant Detection System

## Overview

This document explains how the Next.js middleware detects tenant vs non-tenant requests and how different pages handle this distinction.

## Core Concepts

### What is a Tenant?
A **tenant** is an individual customer/organization that has their own subdomain or custom domain within the multi-tenant platform.

### What is Non-Tenant?
**Non-tenant** refers to the base application pages (dashboard, login, register, etc.) that are accessed directly on the main domain without any tenant identifier.

---

## Middleware Flow (`middleware.ts`)

### ⚠️ Important Update (October 26, 2025)

**Query Parameters Preservation:** The middleware now preserves query parameters during locale redirects.

**Why Important:**
- URL-based filtering for property listings
- Shareable search URLs
- Deep linking with parameters

**Implementation (Line 329-331):**
```typescript
const searchParams = request.nextUrl.search; // Get ?key=value
const newUrl = new URL(`/${locale}${pathname}${searchParams}`, request.url);
return NextResponse.redirect(newUrl);
```

See `docs/important/URL_QUERY_PARAMETERS.md` for full details.

---

### Step 1: Extract Host and Pathname
```typescript
const pathname = request.nextUrl.pathname;
const host = request.headers.get("host") || "";
```

### Step 2: Determine if Base Domain
```typescript
const productionDomain = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "taearif.com";
const localDomain = process.env.NEXT_PUBLIC_LOCAL_DOMAIN || "localhost";
const isDevelopment = process.env.NODE_ENV === "development";

const isOnBaseDomain = isDevelopment 
  ? host === localDomain || host === `${localDomain}:3000`
  : host === productionDomain || host === `www.${productionDomain}`;
```

**Result:**
- `localhost:3000` → Base Domain (non-tenant)
- `taearif.com` → Base Domain (non-tenant)
- `www.taearif.com` → Base Domain (non-tenant)

### Step 3: Extract Tenant ID from Subdomain
```typescript
function getTenantIdFromHost(host: string): string | null {
  // Reserved words that cannot be tenant IDs
  const reservedWords = [
    "www", "api", "admin", "app", "mail", "ftp", "blog", "shop", "store",
    "dashboard", "live-editor", "auth", "login", "register"
  ];

  // For localhost development: tenant1.localhost:3000 → tenant1
  if (isDevelopment && host.includes(localDomain)) {
    const parts = host.split(".");
    if (parts.length > 1 && parts[0] !== localDomain) {
      const potentialTenantId = parts[0];
      if (!reservedWords.includes(potentialTenantId.toLowerCase())) {
        return potentialTenantId;
      }
    }
  }

  // For production: tenant1.taearif.com → tenant1
  if (!isDevelopment && host.includes(productionDomain)) {
    const parts = host.split(".");
    if (parts.length > 2) {
      const potentialTenantId = parts[0];
      const domainPart = parts.slice(1).join(".");
      if (domainPart === productionDomain) {
        if (!reservedWords.includes(potentialTenantId.toLowerCase())) {
          return potentialTenantId;
        }
      }
    }
  }

  return null;
}
```

**Examples:**
- `tenant1.localhost:3000` → tenantId = `"tenant1"`
- `lira.taearif.com` → tenantId = `"lira"`
- `www.taearif.com` → tenantId = `null` (reserved word)
- `localhost:3000` → tenantId = `null` (base domain)

### Step 4: Detect Custom Domain
```typescript
function getTenantIdFromCustomDomain(host: string): string | null {
  // Check if on base domain
  if (isOnBaseDomain) {
    return null;
  }
  
  // Check if host is a custom domain (.com, .net, .org, etc.)
  const isCustomDomain = /\.(com|net|org|io|co|me|info|biz|name|pro|aero|asia|cat|coop|edu|gov|int|jobs|mil|museum|tel|travel|xxx)$/i.test(host);
  
  if (isCustomDomain) {
    return host; // Return the full hostname as tenant ID
  }

  return null;
}
```

**Examples:**
- `custom-domain.com` → tenantId = `"custom-domain.com"`
- `mycompany.net` → tenantId = `"mycompany.net"`
- `taearif.com` → tenantId = `null` (excluded as base domain)

### Step 5: Combine Both Detection Methods
```typescript
let tenantId = getTenantIdFromHost(host);

if (!tenantId) {
  tenantId = getTenantIdFromCustomDomain(host);
}
```

### Step 6: Set Headers
```typescript
if (tenantId) {
  response.headers.set("x-tenant-id", tenantId);
  const domainType = isCustomDomain ? "custom" : "subdomain";
  response.headers.set("x-domain-type", domainType);
}
```

**Headers passed to pages:**
- `x-tenant-id`: The extracted tenant identifier (or null)
- `x-domain-type`: Either "custom" or "subdomain"
- `x-locale`: Current locale ("ar" or "en")
- `x-pathname`: Pathname without locale prefix

---

## Page-Level Tenant Detection

### Pattern 1: Tenant-Only Pages
Pages that **ONLY** work with a tenant and show 404 otherwise.

**Example: `app/property-requests/create/page.tsx`**
```typescript
export default async function PropertyRequestsCreatePage() {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");

  // If no tenantId, show 404
  if (!tenantId) {
    notFound();
  }

  return <TenantPageWrapper tenantId={tenantId} slug={"property-requests/create"} />;
}
```

**Result:**
- `localhost:3000/property-requests/create` → 404 (no tenant)
- `tenant1.localhost:3000/property-requests/create` → Shows tenant's page ✓

### Pattern 2: Non-Tenant Only Pages
Pages that **ONLY** work without a tenant and show 404 if accessed with tenant.

**Example: `app/solutions/page.tsx`**
```typescript
export default async function Solutions() {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");

  // If there is a tenantId, this is a tenant-specific page - don't show generic solutions
  if (tenantId) {
    notFound();
  }

  return <SolutionsPage />;
}
```

**Result:**
- `localhost:3000/solutions` → Shows Taearif solutions page ✓
- `tenant1.localhost:3000/solutions` → 404 (tenant domain)

### Pattern 3: Dual-Mode Pages
Pages that work **BOTH** with and without tenant, showing different content.

**Example: `app/page.tsx` (Homepage)**
```typescript
export default async function HomePage() {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");
  const domainType = headersList.get("x-domain-type") as "subdomain" | "custom" | null;

  // If no tenantId, show Taearif official page
  if (!tenantId) {
    return <TaearifLandingPage />;
  }

  // If tenantId exists (subdomain or custom domain), show tenant's homepage
  return <HomePageWrapper tenantId={tenantId} domainType={domainType} />;
}
```

**Result:**
- `localhost:3000/` → Shows Taearif official landing page
- `tenant1.localhost:3000/` → Shows tenant1's homepage
- `custom-domain.com/` → Shows custom-domain's homepage

**Example: `app/about-us/page.tsx`**
```typescript
export default async function AboutUs() {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");
  const domainType = headersList.get("x-domain-type") as "subdomain" | "custom" | null;

  // If tenantId exists, show tenant-specific about-us
  if (tenantId) {
    return <TenantPageWrapper tenantId={tenantId} slug={"about-us"} domainType={domainType} />;
  }

  // If no tenantId, show main website's about-us
  return <AboutUsPage />;
}
```

**Result:**
- `localhost:3000/about-us` → Shows Taearif's about us page
- `tenant1.localhost:3000/about-us` → Shows tenant1's about us page

### Pattern 4: Always Available Pages
Pages that don't check tenantId at all (usually auth-related).

**Example: `app/login/page.tsx`**
```typescript
export default function Login() {
  return <LoginPage />;
}
```

**Example: `app/register/page.tsx`**
```typescript
export default function Register() {
  return <RegisterPage />;
}
```

**Result:**
- Works on any domain, doesn't care about tenant context
- `localhost:3000/login` → Login page
- `tenant1.localhost:3000/login` → Same login page

### Pattern 5: Auth Check with Optional Tenant
Pages that may pass tenantId for context but don't require it.

**Example: `app/auth/signin/page.tsx`**
```typescript
export default async function SignInPage() {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");

  return <SignInPageWrapper tenantId={tenantId} />;
}
```

**Result:**
- Passes tenantId to component if available, but doesn't require it

---

## Complete Flow Examples

### Example 1: Base Domain Access
```
User visits: http://localhost:3000/
↓
Middleware extracts:
  - host = "localhost"
  - pathname = "/"
↓
Middleware checks:
  - isOnBaseDomain? YES
  - tenantId = null
↓
Middleware sets headers:
  - x-tenant-id: (not set)
  - x-locale: "ar" (after redirect)
  - x-pathname: "/"
↓
Page receives:
  - tenantId = null
↓
app/page.tsx logic:
  if (!tenantId) return <TaearifLandingPage />
↓
Result: Shows Taearif official homepage
```

### Example 2: Subdomain Access
```
User visits: http://tenant1.localhost:3000/
↓
Middleware extracts:
  - host = "tenant1.localhost"
  - pathname = "/"
↓
Middleware checks:
  - isOnBaseDomain? NO
  - getTenantIdFromHost("tenant1.localhost") → "tenant1"
  - tenantId = "tenant1"
↓
Middleware sets headers:
  - x-tenant-id: "tenant1"
  - x-domain-type: "subdomain"
  - x-locale: "ar"
  - x-pathname: "/"
↓
Page receives:
  - tenantId = "tenant1"
  - domainType = "subdomain"
↓
app/page.tsx logic:
  if (tenantId) return <HomePageWrapper tenantId="tenant1" />
↓
Result: Shows tenant1's homepage with their custom content
```

### Example 3: Custom Domain Access
```
User visits: http://mycompany.com/
↓
Middleware extracts:
  - host = "mycompany.com"
  - pathname = "/"
↓
Middleware checks:
  - isOnBaseDomain? NO (not taearif.com or localhost)
  - getTenantIdFromHost("mycompany.com") → null (no subdomain)
  - getTenantIdFromCustomDomain("mycompany.com") → "mycompany.com"
  - tenantId = "mycompany.com"
↓
Middleware sets headers:
  - x-tenant-id: "mycompany.com"
  - x-domain-type: "custom"
  - x-locale: "ar"
  - x-pathname: "/"
↓
Page receives:
  - tenantId = "mycompany.com"
  - domainType = "custom"
↓
app/page.tsx logic:
  if (tenantId) return <HomePageWrapper tenantId="mycompany.com" />
↓
Result: Shows mycompany.com's homepage with their custom content
```

### Example 4: Accessing Tenant-Only Page without Tenant
```
User visits: http://localhost:3000/property-requests/create
↓
Middleware extracts:
  - host = "localhost"
  - tenantId = null
↓
Middleware sets headers:
  - x-tenant-id: (not set)
↓
Page receives:
  - tenantId = null
↓
app/property-requests/create/page.tsx logic:
  if (!tenantId) notFound();
↓
Result: Shows 404 page
```

### Example 5: Accessing Non-Tenant Page with Tenant
```
User visits: http://tenant1.localhost:3000/solutions
↓
Middleware extracts:
  - host = "tenant1.localhost"
  - tenantId = "tenant1"
↓
Middleware sets headers:
  - x-tenant-id: "tenant1"
↓
Page receives:
  - tenantId = "tenant1"
↓
app/solutions/page.tsx logic:
  if (tenantId) notFound();
↓
Result: Shows 404 page
```

---

## Summary Table

| Page Type | tenantId Required | Behavior |
|-----------|------------------|----------|
| **Tenant-Only** | YES | `if (!tenantId) notFound()` |
| **Non-Tenant Only** | NO (must be null) | `if (tenantId) notFound()` |
| **Dual-Mode** | Optional | Shows different content based on tenantId |
| **Always Available** | Ignored | Works regardless of tenantId |
| **Auth with Context** | Optional | Passes tenantId for context |

## Page Categories

### Tenant-Only Pages
- `/property-requests/create` - Property request form
- `/[slug]` - Dynamic tenant pages (for-rent, for-sale, projects, etc.)
- `/property/[id]` - Individual property details
- `/project/[id]` - Individual project details

### Non-Tenant Only Pages
- `/solutions` - Taearif solutions page
- `/dashboard/*` - Admin dashboard (requires separate auth)

### Dual-Mode Pages
- `/` - Homepage (Taearif vs Tenant)
- `/about-us` - About page (Taearif vs Tenant)
- `/privacy-policy` - Privacy page (Taearif vs Tenant)
- `/landing` - Landing page (Taearif vs Tenant)
- `/get-started` - Get started page (Taearif vs Tenant)
- `/updates` - Updates page (Taearif vs Tenant)
- `/onboarding` - Onboarding (Taearif vs Tenant)

### Always Available Pages
- `/login` - Login page
- `/register` - Register page
- `/forgot-password` - Password recovery

### Auth with Optional Context
- `/auth/signin` - OAuth signin
- `/auth/error` - OAuth error
- `/oauth/token/success` - OAuth callback
- `/oauth/social/extra-info` - OAuth extra info

---

## Key Points for AI Understanding

1. **Middleware runs BEFORE every page**
   - Extracts tenant information from host
   - Sets headers for pages to consume

2. **Three ways to identify tenant:**
   - Subdomain in development: `tenant1.localhost`
   - Subdomain in production: `tenant1.taearif.com`
   - Custom domain: `custom-domain.com`

3. **Reserved words cannot be tenant IDs:**
   - `www`, `api`, `admin`, `dashboard`, `live-editor`, etc.

4. **Pages use `headers()` to get tenant info:**
   ```typescript
   const headersList = await headers();
   const tenantId = headersList.get("x-tenant-id");
   ```

5. **Four page patterns:**
   - Tenant-only (404 if no tenant)
   - Non-tenant only (404 if tenant exists)
   - Dual-mode (different content based on tenant)
   - Always available (ignores tenant)

6. **Tenant detection is purely hostname-based:**
   - No database lookup in middleware
   - Fast and efficient
   - Tenant data fetched later in components

7. **Base domain determination:**
   - Exact match with configured domain
   - No subdomain extraction on base domain
   - Includes `www` prefix as base domain

This system enables a true multi-tenant architecture where each tenant gets their own subdomain or custom domain with isolated content while sharing the same codebase.

