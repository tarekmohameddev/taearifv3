# Authentication Systems Architecture

## Overview

The application has **TWO SEPARATE authentication systems** that operate independently:

1. **Dashboard Users System** - For platform administrators and users
2. **Owner System** - For property owners accessing tenant-specific dashboards

These systems use different cookies, different stores, and different APIs to maintain complete separation.

---

## System 1: Dashboard Users Authentication

### Purpose

Authenticates users who access the **main platform dashboard** at `/dashboard/*` routes.

### Technology Stack

- **State Management**: Zustand store (`context/AuthContext.js`)
- **Cookie Name**: `next-auth.session-token` (NextAuth) + custom token storage
- **API Base URL**: `process.env.NEXT_PUBLIC_Backend_URL` (https://api.taearif.com/api)
- **Protected Routes**: `/dashboard/*`, `/onboarding`

### Store Structure (`context/AuthContext.js`)

```javascript
const useAuthStore = create((set, get) => ({
  // State
  UserIslogged: false,
  IsLoading: true,
  authenticated: false,
  userData: {
    email: null,
    token: null,
    username: null,
    domain: null,
    first_name: null,
    last_name: null,
    is_free_plan: null,
    is_expired: false,
    days_remaining: null,
    package_title: null,
    package_features: [],
    project_limit_number: null,
    real_estate_limit_number: null,
    message: null,
    company_name: null,
    permissions: [],
    account_type: null,
    tenant_id: null,
  },

  // Actions
  login: async (email, password, recaptchaToken) => {},
  logout: async () => {},
  fetchUserData: async () => {},
  loginWithToken: async (token) => {},
}));
```

### Authentication Flow

#### 1. Login Process

```javascript
// User enters credentials
login(email, password, recaptchaToken)
  ↓
// Call external API
POST https://api.taearif.com/api/login
  Body: { email, password, recaptcha_token }
  ↓
// API returns { user, token }
  ↓
// Call internal API to set cookie
POST /api/user/setAuth
  Body: { user, UserToken }
  ↓
// Set cookie on server side (httpOnly)
  ↓
// Update Zustand store
set({
  UserIslogged: true,
  userData: { ...user, token }
})
  ↓
// Store in localStorage for persistence
localStorage.setItem("user", JSON.stringify(userData))
  ↓
// Unlock axios for authenticated requests
unlockAxios()
```

**Files Involved:**

- `context/AuthContext.js` - Zustand store with login action
- `pages/api/user/setAuth.js` - Server API to set httpOnly cookie
- `lib/axiosInstance.js` - Axios interceptor that adds Bearer token

#### 2. Token Storage

**Two-tier storage:**

1. **localStorage**: For client-side persistence (page refresh)
2. **httpOnly Cookie**: Set by server API for secure requests

```javascript
// Client side (localStorage)
localStorage.setItem(
  "user",
  JSON.stringify({
    email: user.email,
    token: token,
    username: user.username,
    // ... other user data
  }),
);

// Server side (httpOnly cookie via API)
res.setHeader("Set-Cookie", [
  `user_token=${token}; HttpOnly; Secure; Path=/; Max-Age=604800`,
  `user_email=${user.email}; Path=/; Max-Age=604800`,
]);
```

#### 3. Axios Integration

**File: `lib/axiosInstance.js`**

```javascript
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_Backend_URL,
});

// Request interceptor - adds token automatically
axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().userData?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handles 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired - redirect to login
    }
    return Promise.reject(error);
  },
);
```

#### 4. Protected Routes (ClientLayout)

**File: `app/ClientLayout.tsx`**

```javascript
export default function ClientLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const UserIslogged = useAuthStore((state) => state.UserIslogged);
  const IsLoading = useAuthStore((state) => state.IsLoading);

  // Public pages that don't require authentication
  const publicPages = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset",
    "/onboarding",
    "/landing",
    "/live-editor",
    "/oauth",
  ];

  const isPublicPage = publicPages.some((page) => pathname?.startsWith(page));

  useEffect(() => {
    // If not logged in and not on public page, redirect to login
    if (!IsLoading && !UserIslogged && !isPublicPage) {
      router.push("/login");
    }
  }, [IsLoading, UserIslogged, pathname]);

  // Don't render protected content until auth check is complete
  if (!UserIslogged && !isPublicPage) {
    return null;
  }

  return <AuthProvider>{children}</AuthProvider>;
}
```

#### 5. Fetch User Data on Mount

```javascript
fetchUserData: async () => {
  set({ IsLoading: true });

  try {
    // Call API to get user info from cookie
    const response = await fetch("/api/user/getUserInfo");
    const userData = await response.json();

    set({
      UserIslogged: true,
      userData: { ...userData },
    });

    // Also fetch subscription data
    const subscriptionRes = await axiosInstance.get("/user");
    const subscriptionData = subscriptionRes.data.data;

    set({
      userData: {
        ...userData,
        is_free_plan: subscriptionData.membership.is_free_plan,
        package_title: subscriptionData.membership.package.title,
        // ... more subscription data
      },
    });
  } catch (error) {
    set({
      UserIslogged: false,
      authenticated: false,
    });
  } finally {
    set({ IsLoading: false });
  }
};
```

#### 6. Logout Process

```javascript
logout: async (options = { redirect: true, clearStore: true }) => {
  try {
    // Call logout API
    await fetch("/api/user/logout", {
      method: "POST",
      body: JSON.stringify({ token: get().userData.token }),
    });

    // Clear store
    if (options.clearStore) {
      set({
        UserIslogged: false,
        authenticated: false,
        userData: null,
      });
    }

    // Clear localStorage
    localStorage.removeItem("user");

    // Redirect to login
    if (options.redirect) {
      window.location.href = "/login";
    }
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
```

### OAuth Integration (Google)

#### NextAuth Configuration

**File: `pages/api/auth/[...nextauth].js`**

```javascript
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "google" && profile) {
        // Check if user exists
        const checkUserResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_Backend_URL}/auth/check-user`,
          { email: profile.email },
        );

        let userData;

        if (checkUserResponse.data.exists) {
          // Login existing user
          const loginResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_Backend_URL}/auth/google/login`,
            {
              email: profile.email,
              google_id: profile.sub,
              name: profile.name,
            },
          );
          userData = loginResponse.data;
        } else {
          // Register new user
          const registerResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_Backend_URL}/auth/google/register`,
            {
              email: profile.email,
              google_id: profile.sub,
              first_name: profile.given_name,
              last_name: profile.family_name,
              username: profile.name.replace(/\s+/g, "-").toLowerCase(),
            },
          );
          userData = registerResponse.data;
        }

        // Store in token
        token.token = userData.token;
        token.user = userData.user;
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.token;
      session.userData = token.user;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
});
```

#### OAuth Flow

```
User clicks "Sign in with Google"
  ↓
Redirect to Google OAuth consent screen
  ↓
User approves
  ↓
Google redirects to /api/auth/callback/google?code=...
  ↓
NextAuth handles callback
  ↓
JWT callback checks if user exists:
  - If exists: Call /auth/google/login
  - If new: Call /auth/google/register
  ↓
Store token in NextAuth session
  ↓
Redirect to /oauth/token/success
  ↓
Client extracts token from URL
  ↓
Call useAuthStore.loginWithToken(token)
  ↓
Update Zustand store & localStorage
  ↓
Redirect to /dashboard
```

**OAuth Success Handler:**

```javascript
// app/oauth/token/success/page.jsx
"use client";
import { useEffect } from "react";
import useAuthStore from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function OAuthSuccessPageContent() {
  const router = useRouter();
  const loginWithToken = useAuthStore((state) => state.loginWithToken);

  useEffect(() => {
    // Extract token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // Login with token
      loginWithToken(token).then((result) => {
        if (result.success) {
          router.push("/dashboard");
        }
      });
    }
  }, []);

  return <div>Processing OAuth login...</div>;
}
```

---

## System 2: Owner Authentication

### Purpose

Authenticates **property owners** who access tenant-specific owner dashboards at `/owner/*` routes.

### Technology Stack

- **State Management**: Zustand store (`context/OwnerAuthContext.js`)
- **Cookie Names**: `owner_token` + `ownerRentalToken`
- **API Base URL**: `https://api.taearif.com/api/v1/owner-rental`
- **Protected Routes**: `/owner/dashboard`, `/owner/*` (except login/register)

### Store Structure (`context/OwnerAuthContext.js`)

```javascript
const useOwnerAuthStore = create((set, get) => ({
  // State
  ownerIsLogged: false,
  isLoading: false,
  isAuthenticated: false,
  ownerData: {
    email: null,
    token: null,
    first_name: null,
    last_name: null,
    tenant_id: null,
    owner_id: null,
    permissions: [],
  },

  // Actions
  login: async (email, password) => {},
  register: async (email, password, firstName, lastName, phone) => {},
  logout: async () => {},
  fetchOwnerData: async () => {},
  initializeFromStorage: async () => {},
}));
```

### Authentication Flow

#### 1. Login Process

```javascript
login: async (email, password) => {
  set({ isLoading: true, errorLogin: null });

  try {
    // Call owner rental API directly
    const response = await axios.post(
      "https://api.taearif.com/api/v1/owner-rental/login",
      { email, password },
    );

    const { success, data } = response.data;

    if (success && data && data.token && data.owner_rental) {
      const { owner_rental: user, token } = data;

      // Set TWO cookies (client-side)
      const cookieOptions = {
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      };

      document.cookie = `owner_token=${token}; path=/; max-age=${cookieOptions.maxAge}`;
      document.cookie = `ownerRentalToken=${token}; path=/; max-age=${cookieOptions.maxAge}`;

      // Update store
      const safeOwnerData = {
        email: user.email,
        token: token,
        first_name: user.name ? user.name.split(" ")[0] : null,
        last_name: user.name ? user.name.split(" ").slice(1).join(" ") : null,
        tenant_id: user.tenant_id,
        owner_id: user.id,
        permissions: user.permissions || [],
      };

      set({
        ownerIsLogged: true,
        isAuthenticated: true,
        ownerData: safeOwnerData,
      });

      // Store in localStorage
      localStorage.setItem("owner_user", JSON.stringify(safeOwnerData));

      toast.success("تم تسجيل الدخول بنجاح!");
      return { success: true, user: safeOwnerData };
    }
  } catch (error) {
    // Handle errors
    set({ errorLogin: "فشل تسجيل الدخول" });
  } finally {
    set({ isLoading: false });
  }
};
```

**Key Differences from Dashboard System:**

1. **Direct API call** (no internal API wrapper)
2. **Client-side cookie setting** (not httpOnly)
3. **Different token storage keys** (`owner_token` vs `user_token`)
4. **Separate localStorage key** (`owner_user`)

#### 2. Middleware Protection

**File: `middleware.ts`**

```typescript
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameWithoutLocale = removeLocaleFromPathname(pathname);

  // Check for owner authentication on owner pages
  if (
    pathnameWithoutLocale.startsWith("/owner/") &&
    !pathnameWithoutLocale.startsWith("/owner/login") &&
    !pathnameWithoutLocale.startsWith("/owner/register")
  ) {
    const ownerToken = request.cookies.get("owner_token")?.value;

    if (!ownerToken) {
      console.log("🔒 Middleware: No owner token found, redirecting to login");
      const loginUrl = new URL(`/${locale}/owner/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Continue with request if token exists
  return NextResponse.next();
}
```

**Flow:**

```
User visits /owner/dashboard
  ↓
Middleware checks for owner_token cookie
  ↓
Token exists?
  ├─ YES → Allow access to page
  └─ NO → Redirect to /owner/login
```

#### 3. Owner Layout Protection

**File: `app/owner/layout.tsx`**

```typescript
export default async function OwnerLayout({ children }) {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");

  // Owner pages REQUIRE a tenantId (subdomain or custom domain)
  if (!tenantId) {
    notFound(); // Show 404 if accessed on base domain
  }

  return <>{children}</>;
}
```

**Important:** Owner pages can ONLY be accessed on:

- Subdomain: `tenant1.localhost:3000/owner/dashboard`
- Custom domain: `custom-domain.com/owner/dashboard`

They will show 404 if accessed on base domain: `localhost:3000/owner/dashboard`

#### 4. Owner Dashboard Data Fetching

**File: `app/owner/dashboard/page.tsx`**

```typescript
export default function OwnerDashboard() {
  const { ownerData, fetchOwnerData } = useOwnerAuthStore();
  const { fetchTenantData, tenantData } = useTenantStore();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      // 1. Verify token exists in cookie
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('owner_token='))
        ?.split('=')[1];

      if (!token) {
        router.push("/owner/login");
        return;
      }

      // 2. Fetch owner data
      await fetchOwnerData();

      // 3. Fetch dashboard data
      await fetchDashboardData();

      // 4. Extract tenant ID from hostname
      const tenantId = extractTenantId(window.location.hostname);

      // 5. Fetch tenant data
      if (tenantId) {
        await fetchTenantData(tenantId);
      }
    };

    checkAuthAndLoad();
  }, []);

  const fetchDashboardData = async () => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('ownerRentalToken='))
      ?.split('=')[1];

    const response = await fetch(
      "https://api.taearif.com/api/v1/owner-rental/dashboard",
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    setDashboardData(data.data);
  };

  return (
    <div>
      {/* Display dashboard data */}
      <h1>Welcome, {ownerData?.first_name} {ownerData?.last_name}</h1>

      {/* Display tenant logo from tenant data */}
      {tenantData?.globalComponentsData?.header?.logo?.image && (
        <img src={tenantData.globalComponentsData.header.logo.image} />
      )}

      {/* Display dashboard statistics */}
      {dashboardData && (
        <div>
          <p>Total Properties: {dashboardData.summary_cards.total_properties}</p>
          <p>Due Rent: {dashboardData.summary_cards.due_rent}</p>
        </div>
      )}
    </div>
  );
}
```

**Owner Dashboard Flow:**

```
Owner visits tenant1.localhost:3000/owner/dashboard
  ↓
Middleware checks owner_token → exists
  ↓
Owner layout checks tenantId → exists ("tenant1")
  ↓
Page component:
  1. Verifies token in cookie
  2. Fetches owner data (name, email, etc.)
  3. Fetches dashboard data (properties, rent, etc.)
  4. Fetches tenant data (logo, branding, etc.)
  ↓
Displays personalized dashboard with:
  - Owner information
  - Tenant branding
  - Owner's properties data
```

#### 5. Tenant ID Extraction in Owner Pages

```typescript
const extractTenantId = (host: string): string | null => {
  const productionDomain =
    process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "taearif.com";
  const localDomain = process.env.NEXT_PUBLIC_LOCAL_DOMAIN || "localhost";
  const isDevelopment = process.env.NODE_ENV === "development";

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

  // Check if on base domain
  const isOnBaseDomain = isDevelopment
    ? host === localDomain || host === `${localDomain}:3000`
    : host === productionDomain || host === `www.${productionDomain}`;

  if (isOnBaseDomain) return null;

  // Extract from subdomain
  if (isDevelopment && host.includes(localDomain)) {
    const parts = host.split(".");
    if (parts.length > 1 && parts[0] !== localDomain) {
      const potentialTenantId = parts[0];
      if (!reservedWords.includes(potentialTenantId.toLowerCase())) {
        return potentialTenantId;
      }
    }
  }

  // Extract from production subdomain
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

  // Check for custom domain
  const isCustomDomain = /\.(com|net|org|io|co|me|info|biz|name|pro)$/i.test(
    host,
  );
  if (isCustomDomain) {
    return host;
  }

  return null;
};
```

#### 6. Logout Process

```javascript
logout: async () => {
  try {
    // Clear cookies
    document.cookie =
      "owner_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "ownerRentalToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Clear localStorage
    localStorage.removeItem("owner_user");

    // Clear store
    set({
      ownerIsLogged: false,
      isAuthenticated: false,
      ownerData: {
        email: null,
        token: null,
        first_name: null,
        last_name: null,
        tenant_id: null,
        owner_id: null,
        permissions: [],
      },
    });

    toast.success("تم تسجيل الخروج بنجاح");
    return { success: true };
  } catch (error) {
    return { success: false, error: "فشل تسجيل الخروج" };
  }
};
```

---

## Key Differences Between Systems

### Comparison Table

| Feature                   | Dashboard Users                                    | Owner System                                                |
| ------------------------- | -------------------------------------------------- | ----------------------------------------------------------- |
| **Purpose**               | Platform administration                            | Property owner portal                                       |
| **Routes**                | `/dashboard/*`, `/onboarding`                      | `/owner/*`                                                  |
| **Store**                 | `useAuthStore`                                     | `useOwnerAuthStore`                                         |
| **Cookie Names**          | `next-auth.session-token`, `user_token`            | `owner_token`, `ownerRentalToken`                           |
| **API Endpoint**          | `/api/login` → `https://api.taearif.com/api/login` | Direct: `https://api.taearif.com/api/v1/owner-rental/login` |
| **Token Storage**         | localStorage (`user`) + httpOnly cookie            | localStorage (`owner_user`) + client cookie                 |
| **Middleware Protection** | Via `ClientLayout` (client-side)                   | Via `middleware.ts` (server-side)                           |
| **Requires Tenant?**      | NO (works on base domain)                          | YES (requires subdomain/custom domain)                      |
| **OAuth Support**         | YES (NextAuth with Google)                         | NO                                                          |
| **axios Integration**     | YES (interceptors)                                 | NO (direct fetch)                                           |
| **Cookie Security**       | httpOnly (server-set)                              | Client-side (less secure)                                   |
| **Registration**          | `/register` (public)                               | `/owner/register` (tenant-specific)                         |

### When to Use Each System

#### Use Dashboard Users System When:

1. User needs to **manage the platform** (create websites, manage customers, etc.)
2. User needs to access **`/dashboard/*`** routes
3. User doesn't need tenant-specific context
4. User registers through **`/register`** page
5. OAuth login is required

**Example Users:**

- Platform administrators
- Website creators
- Marketing teams
- Support staff

#### Use Owner System When:

1. User is a **property owner** in a specific tenant's system
2. User needs to access **`/owner/*`** routes
3. User needs to view their **properties, tenants, rent collection**
4. User must be on a **subdomain or custom domain** (tenant-specific)
5. Access is within tenant's context

**Example Users:**

- Property owners
- Real estate investors
- Building managers
- Landlords

### Authentication State Isolation

**Both systems maintain completely separate state:**

```javascript
// Dashboard User State
const dashboardUser = useAuthStore((state) => ({
  isLogged: state.UserIslogged,
  data: state.userData,
}));

// Owner State (different store, doesn't affect dashboard)
const owner = useOwnerAuthStore((state) => ({
  isLogged: state.ownerIsLogged,
  data: state.ownerData,
}));

// A user can be:
// - Logged in to dashboard but NOT owner
// - Logged in to owner but NOT dashboard
// - Logged in to BOTH (separate sessions)
// - Logged in to NEITHER
```

### Cookie Namespace Separation

```javascript
// Dashboard cookies
document.cookie = "user_token=abc123...";
document.cookie = "next-auth.session-token=xyz789...";

// Owner cookies (different names, no conflict)
document.cookie = "owner_token=def456...";
document.cookie = "ownerRentalToken=def456...";

// Both can coexist without interfering with each other
```

---

## Complete Authentication Flows

### Flow 1: Dashboard User Login → Dashboard Access

```
1. User visits: localhost:3000/login
   ↓
2. Enters credentials + reCAPTCHA
   ↓
3. useAuthStore.login(email, password, recaptchaToken)
   ↓
4. POST https://api.taearif.com/api/login
   ↓
5. Response: { user, token }
   ↓
6. POST /api/user/setAuth { user, UserToken }
   ↓
7. Server sets httpOnly cookie: user_token
   ↓
8. Update Zustand store: UserIslogged = true
   ↓
9. Store in localStorage: "user"
   ↓
10. Unlock axios with Bearer token
    ↓
11. Redirect to /dashboard
    ↓
12. ClientLayout checks auth → allowed
    ↓
13. Dashboard loads with user data
```

### Flow 2: Owner Login → Owner Dashboard Access

```
1. User visits: tenant1.localhost:3000/owner/login
   ↓
2. Middleware checks x-tenant-id header → "tenant1"
   ↓
3. Owner login page loads (tenant-specific)
   ↓
4. User enters credentials
   ↓
5. useOwnerAuthStore.login(email, password)
   ↓
6. POST https://api.taearif.com/api/v1/owner-rental/login
   ↓
7. Response: { owner_rental, token }
   ↓
8. Set cookies client-side: owner_token, ownerRentalToken
   ↓
9. Update Zustand store: ownerIsLogged = true
   ↓
10. Store in localStorage: "owner_user"
    ↓
11. Redirect to /owner/dashboard
    ↓
12. Middleware checks owner_token cookie → exists
    ↓
13. Owner layout checks tenantId → exists
    ↓
14. Page extracts tenantId from hostname
    ↓
15. Fetch owner data + dashboard data + tenant data
    ↓
16. Display personalized dashboard with tenant branding
```

### Flow 3: Google OAuth Login → Dashboard Access

```
1. User visits: localhost:3000/login
   ↓
2. Clicks "Sign in with Google"
   ↓
3. Redirect to Google OAuth consent screen
   ↓
4. User approves
   ↓
5. Google redirects: /api/auth/callback/google?code=...
   ↓
6. NextAuth JWT callback:
   - Check if user exists: POST /auth/check-user
   - If exists: POST /auth/google/login
   - If new: POST /auth/google/register
   ↓
7. Store token in NextAuth session
   ↓
8. Redirect to /oauth/token/success?token=...
   ↓
9. Page extracts token from URL
   ↓
10. useAuthStore.loginWithToken(token)
    ↓
11. POST /api/user/setAuth { user, UserToken }
    ↓
12. Update store + localStorage
    ↓
13. Redirect to /dashboard
    ↓
14. Dashboard loads with OAuth user
```

### Flow 4: Owner Without Tenant Context (404)

```
1. Owner visits: localhost:3000/owner/dashboard
   ↓
2. Middleware extracts host: "localhost"
   ↓
3. getTenantIdFromHost("localhost") → null
   ↓
4. Middleware sets x-tenant-id: (not set)
   ↓
5. Owner layout checks tenantId → null
   ↓
6. notFound() called
   ↓
7. 404 page displayed

   Why? Owner pages REQUIRE tenant context
```

### Flow 5: Cross-System Independence

```
Scenario: User logged into dashboard, visits owner page

1. User logged in as dashboard user
   - Cookie: user_token = "abc123"
   - Store: useAuthStore.UserIslogged = true
   ↓
2. User visits: tenant1.localhost:3000/owner/dashboard
   ↓
3. Middleware checks owner_token → NOT FOUND
   (dashboard user_token is different cookie)
   ↓
4. Redirect to /owner/login
   ↓
5. Owner login required (separate system)

Why? Different authentication systems don't recognize each other's tokens
```

---

## Security Considerations

### Dashboard System Security

- **httpOnly cookies** - Cannot be accessed by JavaScript (XSS protection)
- **Server-side token validation** - All requests go through `/api/user/*`
- **Axios interceptors** - Automatic token refresh and error handling
- **CSRF protection** - NextAuth built-in CSRF tokens

### Owner System Security

- **Client-side cookies** - Accessible by JavaScript (less secure)
- **Direct API calls** - No server-side validation layer
- **Middleware protection** - Server-side route protection
- **Token expiration** - 7-day expiration enforced

### Recommendations for Production

**Dashboard System (Current):**
✅ Good security posture
✅ httpOnly cookies
✅ Server-side validation
✅ CSRF protection

**Owner System (Needs Improvement):**
⚠️ Client-side cookies - vulnerable to XSS
⚠️ No server-side validation layer
⚠️ No CSRF protection

**Suggested Improvements:**

1. Move owner cookies to httpOnly
2. Add server API layer (`/api/owner/*`)
3. Implement CSRF tokens
4. Add JWT refresh token mechanism
5. Implement rate limiting

---

## API Endpoints Summary

### Dashboard User APIs

| Endpoint                | Method | Purpose              |
| ----------------------- | ------ | -------------------- |
| `/api/login`            | POST   | External API login   |
| `/api/user/setAuth`     | POST   | Set httpOnly cookie  |
| `/api/user/getUserInfo` | GET    | Get user from cookie |
| `/api/user/logout`      | POST   | Clear session        |
| `/auth/check-user`      | POST   | Check if user exists |
| `/auth/google/login`    | POST   | OAuth login          |
| `/auth/google/register` | POST   | OAuth register       |

### Owner APIs

| Endpoint                     | Method | Purpose               |
| ---------------------------- | ------ | --------------------- |
| `/v1/owner-rental/login`     | POST   | Owner login           |
| `/v1/owner-rental/register`  | POST   | Owner register        |
| `/v1/owner-rental/dashboard` | GET    | Get dashboard data    |
| `/api/owner/getOwnerInfo`    | GET    | Get owner from cookie |

---

## localStorage Keys

```javascript
// Dashboard System
localStorage.getItem("user")
// Structure:
{
  email: "user@example.com",
  token: "eyJhbGc...",
  username: "johndoe",
  first_name: "John",
  last_name: "Doe",
  // ... more fields
}

// Owner System
localStorage.getItem("owner_user")
// Structure:
{
  email: "owner@example.com",
  token: "eyJhbGc...",
  first_name: "Jane",
  last_name: "Smith",
  tenant_id: 123,
  owner_id: 456,
  permissions: ["view_properties", "manage_rent"],
}
```

---

## Debugging Authentication Issues

### Check Dashboard User Auth Status

```javascript
// In browser console
const authState = JSON.parse(localStorage.getItem("user"));
console.log("Dashboard User:", authState);

// Check cookie
document.cookie.split(";").find((c) => c.includes("user_token"));
```

### Check Owner Auth Status

```javascript
// In browser console
const ownerState = JSON.parse(localStorage.getItem("owner_user"));
console.log("Owner User:", ownerState);

// Check cookies
document.cookie.split(";").find((c) => c.includes("owner_token"));
document.cookie.split(";").find((c) => c.includes("ownerRentalToken"));
```

### Common Issues

#### Issue 1: "Redirected to login after refresh"

**Cause:** Token expired or localStorage cleared
**Solution:**

- Check localStorage for user/owner_user
- Check cookie existence
- Verify token hasn't expired (7 days for owner, session for dashboard)

#### Issue 2: "Can't access owner dashboard"

**Cause:** Not on a tenant domain
**Solution:**

- Owner pages require subdomain: `tenant1.localhost:3000`
- Won't work on: `localhost:3000`

#### Issue 3: "Axios requests fail with 401"

**Cause:** Dashboard token not in store
**Solution:**

- Verify `useAuthStore.getState().userData.token` exists
- Check axios interceptor is adding Bearer token

#### Issue 4: "Dashboard login shows on tenant domain"

**Cause:** Dashboard login is public, shows everywhere
**Solution:**

- This is expected behavior
- Dashboard login accessible on all domains
- Owner login only on tenant domains

---

## Summary

The application uses **TWO COMPLETELY SEPARATE** authentication systems:

1. **Dashboard Users System**
   - For platform administration
   - Routes: `/dashboard/*`, `/onboarding`
   - Secure httpOnly cookies
   - OAuth support
   - Works on base domain

2. **Owner System**
   - For property owners
   - Routes: `/owner/*`
   - Client-side cookies
   - No OAuth
   - Requires tenant domain

**Key Principle:** These systems do NOT interact or share authentication state. A user logged into one system is NOT authenticated in the other system.

**Access Patterns:**

- Dashboard user on `localhost:3000/dashboard` ✓
- Dashboard user on `tenant1.localhost:3000/dashboard` ✓
- Owner on `tenant1.localhost:3000/owner/dashboard` ✓
- Owner on `localhost:3000/owner/dashboard` ✗ (404 - no tenant)
- Dashboard user trying `/owner/*` ✗ (requires owner login)
- Owner trying `/dashboard/*` ✗ (requires dashboard login)
