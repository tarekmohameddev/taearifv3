# Dashboard Debugging & Testing Guide

## Overview

Complete troubleshooting guide for common Dashboard issues with debug commands and solutions.

---

## Common Issues & Solutions

### Issue 1: "Redirected to login constantly"

**Symptoms:**

- Can't access dashboard pages
- Immediately redirected to /login
- Login seems successful but redirect happens again

**Causes:**

- Token expired or invalid
- Cookie not being set properly
- Token validation failing
- Backend API unreachable

**Debug Steps:**

```javascript
// 1. Check token in localStorage
const user = JSON.parse(localStorage.getItem("user"));
console.log("User token:", user?.token);
console.log("User email:", user?.email);

// 2. Check authToken cookie
const cookies = document.cookie.split(";");
const authCookie = cookies.find((c) => c.includes("authToken"));
console.log("Auth cookie:", authCookie);

// 3. Check AuthStore state
const authState = useAuthStore.getState();
console.log("UserIslogged:", authState.UserIslogged);
console.log("User data:", authState.userData);

// 4. Manually validate token
const response = await fetch("https://api.taearif.com/api/user", {
  headers: { Authorization: `Bearer ${user.token}` },
});
console.log("Token validation status:", response.status);
console.log("Token validation response:", await response.json());

// 5. Check if axios is locked
import { isAxiosLocked } from "@/lib/axiosInstance";
console.log("Axios locked:", isAxiosLocked());
```

**Solutions:**

1. Clear all cookies and localStorage:
   ```javascript
   localStorage.clear();
   document.cookie.split(";").forEach((c) => {
     document.cookie =
       c.trim().split("=")[0] +
       "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
   });
   ```
2. Re-login fresh
3. Check if backend API is accessible: `curl https://api.taearif.com/api/user`
4. Verify SECRET_KEY environment variable matches backend
5. Check browser console for errors

---

### Issue 2: "Dashboard shows on tenant domain"

**Symptoms:**

- Can access `/ar/dashboard` on tenant1.localhost:3000
- Dashboard loads but may have issues
- Domain validation not blocking access

**Cause:**

- Domain validation logic not working
- Layout validation bypassed
- Environment variables incorrect

**Debug Steps:**

```javascript
// Check current domain
const hostname = window.location.hostname;
console.log("Current hostname:", hostname);

// Check domain validation logic
const productionDomain =
  process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "taearif.com";
const localDomain = process.env.NEXT_PUBLIC_LOCAL_DOMAIN || "localhost";
const isDevelopment = process.env.NODE_ENV === "development";

console.log("Production domain:", productionDomain);
console.log("Local domain:", localDomain);
console.log("Is development:", isDevelopment);

const isBaseDomain = isDevelopment
  ? hostname === localDomain || hostname === `${localDomain}:3000`
  : hostname === productionDomain || hostname === `www.${productionDomain}`;

console.log("Is base domain:", isBaseDomain);

// Check layout validation state
// (add console.log in app/dashboard/layout.tsx)
```

**Solutions:**

- Dashboard should ONLY work on base domain
- Add console.log in `app/dashboard/layout.tsx` domain check (line 48)
- Verify environment variables are set correctly
- Check isValidDomain state in layout

---

### Issue 3: "Menu items not showing in sidebar"

**Symptoms:**

- Sidebar loads but shows no menu items
- Loading spinner stuck
- Empty menu
- Sidebar blank

**Causes:**

- API request failing (404, 500)
- No token in request headers
- Backend `/dashboard/menu` endpoint down
- Permission filtering hiding ALL items
- fetchSideMenus() not called

**Debug Steps:**

```javascript
// 1. Check Store state
const storeState = useStore.getState();
console.log("Sidebar data:", storeState.sidebarData);
console.log("Main nav items:", storeState.sidebarData.mainNavItems);
console.log("Loading:", storeState.sidebarData.loading);
console.log("Error:", storeState.sidebarData.error);

// 2. Check if fetchSideMenus was called
console.log("fetchSideMenus function:", typeof storeState.fetchSideMenus);

// 3. Manually call fetchSideMenus
await storeState.fetchSideMenus();
console.log("After fetch:", storeState.sidebarData);

// 4. Check user permissions
const { userData } = useAuthStore.getState();
console.log("User permissions:", userData?.permissions);
console.log("Account type:", userData?.account_type);
console.log("Has token:", !!userData?.token);

// 5. Test API directly
const response = await fetch("https://api.taearif.com/api/dashboard/menu", {
  headers: { Authorization: `Bearer ${userData.token}` },
});
console.log("API response:", response.status);
console.log("API data:", await response.json());
```

**Solutions:**

1. Ensure user has valid token in AuthStore
2. Check backend `/dashboard/menu` endpoint is working
3. Verify user has at least ONE permission
4. Admin users should see all items regardless
5. Check EnhancedSidebar component is calling fetchSideMenus
6. Check network tab for failed requests

---

### Issue 4: "Permission denied on all pages"

**Symptoms:**

- Can login successfully
- Dashboard loads fine
- Every page shows "ليس لديك صلاحية للوصول"
- Sidebar shows but pages are blocked

**Causes:**

- User has NO permissions assigned
- PermissionWrapper always returning false
- UserStore not fetching data
- UserStore.hasAccessToPage() always returns false

**Debug Steps:**

```javascript
// 1. Check UserStore state
const userStoreState = useUserStore.getState();
console.log("UserStore data:", userStoreState.userData);
console.log("Permissions array:", userStoreState.userData?.permissions);
console.log("Is initialized:", userStoreState.isInitialized);
console.log("Loading:", userStoreState.loading);

// 2. Test permission check
console.log(
  "Has access to properties:",
  userStoreState.hasAccessToPage("properties"),
);
console.log(
  "Has access to analytics:",
  userStoreState.hasAccessToPage("analytics"),
);

// 3. Check specific permission
console.log(
  "Has properties.view:",
  userStoreState.checkPermission("properties.view"),
);

// 4. Check account type
console.log("Account type:", userStoreState.userData?.account_type);
// "tenant" should bypass all permission checks

// 5. Check pathname parsing
import { usePathname } from "next/navigation";
const pathname = usePathname();
console.log("Current pathname:", pathname);

// 6. Manually test usePermissions
const { hasPermission, loading, error } = usePermissions();
console.log("usePermissions result:", { hasPermission, loading, error });
```

**Solutions:**

1. Contact admin to assign permissions in database
2. Verify user role and permissions in backend
3. Check if account_type is "tenant" (full access)
4. Ensure UserStore.fetchUserData() is called
5. Check if permissions array is empty
6. Verify permission mapping in `hooks/usePermissions.ts`

---

### Issue 5: "RTL not working / Layout broken"

**Symptoms:**

- Dashboard shows LTR (left-to-right) layout
- Text alignment wrong
- Menus on wrong side
- Layout looks reversed

**Causes:**

- RTL CSS not applied
- Dashboard layout not loading correctly
- Conflicting CSS from other components
- Wrong locale prefix

**Debug Steps:**

```javascript
// 1. Check HTML direction
console.log("HTML dir:", document.documentElement.dir);
console.log("Body dir:", document.body.dir);

// 2. Check if RTL style element exists
const rtlStyle = document.getElementById("dashboard-rtl-styles");
console.log("RTL style element:", rtlStyle);
console.log("RTL style content:", rtlStyle?.textContent);

// 3. Check computed styles
const htmlStyle = window.getComputedStyle(document.documentElement);
console.log("HTML computed direction:", htmlStyle.direction);

// 4. Check pathname locale
const pathname = window.location.pathname;
console.log("Pathname:", pathname);
console.log("Has /ar/ prefix:", pathname.includes("/ar/"));
```

**Solutions:**

1. Refresh page (Ctrl+F5 / Cmd+Shift+R)
2. Check you're on `/ar/dashboard` not `/en/dashboard`
3. Verify `app/dashboard/layout.tsx` RTL enforcement code (lines 86-111)
4. Clear browser cache
5. Check for conflicting `dir` attributes in DevTools

---

### Issue 6: "Subscription features not working"

**Symptoms:**

- Feature shows as locked even with paid plan
- Property/project limits incorrect
- Upgrade prompts appearing when shouldn't
- Days remaining shows wrong number

**Causes:**

- Subscription data not fetched from `/user` endpoint
- `is_free_plan` set incorrectly
- `package_features` array empty
- Backend returning wrong data

**Debug Steps:**

```javascript
const { userData } = useAuthStore.getState();

// Check all subscription fields
console.log("Is free plan:", userData?.is_free_plan);
console.log("Package title:", userData?.package_title);
console.log("Package features:", userData?.package_features);
console.log("Project limit:", userData?.project_limit_number);
console.log("Property limit:", userData?.real_estate_limit_number);
console.log("Days remaining:", userData?.days_remaining);
console.log("Is expired:", userData?.is_expired);

// Check if subscription data exists
console.log("Has subscription data:", !!userData?.package_title);

// Manually fetch user data
const response = await axiosInstance.get("/user");
console.log("Fresh user data:", response.data.data);
console.log("Membership:", response.data.data.membership);
```

**Solutions:**

1. Call `useAuthStore.getState().fetchUserData()` to refresh
2. Verify backend returns correct subscription in `/user` endpoint
3. Check if subscription actually expired
4. Contact support if data is incorrect in backend
5. Check AuthStore.fetchUserData() logic (line 436)

---

### Issue 7: "axios requests returning 401"

**Symptoms:**

- API calls fail with 401 Unauthorized
- Can login but subsequent requests fail
- Token not being sent with requests

**Causes:**

- Token not in AuthStore
- axios interceptor not working
- Token format incorrect
- Backend rejecting token

**Debug Steps:**

```javascript
import axiosInstance, { isAxiosLocked } from "@/lib/axiosInstance";

// 1. Check if axios is locked
console.log("Axios locked:", isAxiosLocked());

// 2. Check token in AuthStore
const token = useAuthStore.getState().userData?.token;
console.log("Token from AuthStore:", token);

// 3. Test manual request with token
const response = await fetch("https://api.taearif.com/api/user", {
  headers: { Authorization: `Bearer ${token}` },
});
console.log("Manual request status:", response.status);

// 4. Test axiosInstance request
try {
  const response = await axiosInstance.get("/user");
  console.log("axios request success:", response.data);
} catch (error) {
  console.log("axios request error:", error);
  console.log("Error details:", error.response?.data);
}

// 5. Check request headers
// (Open Network tab in DevTools)
```

**Solutions:**

1. Call `unlockAxios()` if axios is locked
2. Ensure token exists in AuthStore
3. Re-login to get fresh token
4. Check token format (should be JWT)
5. Verify backend accepts Bearer token

---

## Testing Dashboard Locally

### Setup Requirements

**1. Environment Variables (.env.local):**

```env
# Backend API
NEXT_PUBLIC_Backend_URL=https://api.taearif.com/api

# Domain Configuration
NEXT_PUBLIC_PRODUCTION_DOMAIN=taearif.com
NEXT_PUBLIC_LOCAL_DOMAIN=localhost
NODE_ENV=development

# Security
SECRET_KEY=your-secret-key-here

# OAuth (Google)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_SECRET=your-nextauth-secret

# Optional
NEXTAUTH_URL=http://localhost:3000
```

**2. Install Dependencies:**

```bash
npm install
# or
yarn install
# or
pnpm install
```

**3. Run Development Server:**

```bash
npm run dev
# Server runs on http://localhost:3000
```

**4. Access Dashboard:**

```
http://localhost:3000/ar/dashboard
```

### Test User Accounts

**Create test accounts with different roles:**

**1. Admin Account (Full Access):**

```sql
-- Database
account_type = 'admin'
permissions = []  -- Gets full access regardless
```

**Test:**

- Can access ALL modules
- Can manage users in /dashboard/access-control
- Sidebar shows all items

**2. Tenant Account (Owner):**

```sql
account_type = 'tenant'
permissions = []  -- Gets full access
```

**Test:**

- Can access all pages except access-control
- Full dashboard functionality

**3. Manager Account (Limited):**

```sql
account_type = 'manager'
permissions = ['properties.view', 'analytics.view', 'customers.view']
```

**Test:**

- Can access: properties, analytics, customers
- Cannot access: settings, crm, marketing
- Sidebar shows only permitted items

**4. Editor Account (Content Only):**

```sql
account_type = 'editor'
permissions = ['blogs.view']
```

**Test:**

- Can access: /dashboard/content/\*, /dashboard/blogs
- Cannot access: anything else
- Very limited sidebar

### Permission Testing

**Test Script:**

```javascript
// Login as each user type
const testPermissions = async () => {
  const users = [
    { email: "admin@test.com", expectedPages: ["all"] },
    { email: "manager@test.com", expectedPages: ["properties", "analytics"] },
    { email: "editor@test.com", expectedPages: ["blogs"] },
  ];

  for (const user of users) {
    // 1. Login
    await login(user.email, "password", recaptchaToken);

    // 2. Check sidebar items
    const { sidebarData } = useStore.getState();
    console.log(
      `${user.email} sees:`,
      sidebarData.mainNavItems.map((i) => i.id),
    );

    // 3. Try accessing each page
    for (const page of ["properties", "analytics", "crm", "settings"]) {
      const hasAccess = useUserStore.getState().hasAccessToPage(page);
      console.log(`${user.email} access to ${page}:`, hasAccess);
    }

    // 4. Logout
    await logout();
  }
};

testPermissions();
```

---

## Performance Considerations

### Initial Load Time

**Dashboard loads multiple resources:**

1. User authentication validation (400-800ms)
2. Subscription data fetch (300-600ms)
3. Sidebar menu fetch (200-400ms)
4. GTM scripts (100-200ms)
5. Component assets (500-1000ms)

**Total:** ~1.5-3 seconds

**Optimization Strategies:**

1. **Parallel Loading:**

```typescript
Promise.all([
  fetchUserData(),
  fetchSideMenus(),
  // Load critical data in parallel
]);
```

2. **Caching:**

- UserStore caches for 5 minutes
- Prevents repeated `/user` calls

3. **Lazy Loading:**

```typescript
const HeavyComponent = lazy(() => import("@/components/heavy"));
```

4. **GTM Strategy:**

```typescript
<Script strategy="afterInteractive" />
// Loads after page is interactive
```

### Memory Management

**Zustand Stores in Memory:**

- `AuthStore` - ~50KB (session data)
- `Store` - ~100KB (UI state, menu)
- `UserStore` - ~20KB (permissions)

**Cleanup on Logout:**

```typescript
logout: async () => {
  // 1. Clear AuthStore
  set({ UserIslogged: false, userData: null });

  // 2. Clear localStorage
  localStorage.removeItem("user");
  localStorage.removeItem("user-store");

  // 3. Clear cookies (via API)
  await fetch("/api/user/logout", { method: "POST" });

  // 4. Clear UserStore
  useUserStore.getState().clearUserData();

  // 5. Redirect
  window.location.href = "/login";
};
```

**Memory Leaks to Avoid:**

- ❌ Not cleaning up event listeners
- ❌ Keeping refs to old data
- ❌ Not canceling pending requests

---

## Debug Commands Reference

### Browser Console Commands

```javascript
// ============================================
// AUTH DEBUGGING
// ============================================

// Check login status
useAuthStore.getState().UserIslogged;

// Get user data
useAuthStore.getState().userData;

// Get token
useAuthStore.getState().userData?.token;

// Check permissions
useUserStore.getState().userData?.permissions;

// Force logout
await useAuthStore.getState().logout();

// Force login (if you have credentials)
await useAuthStore
  .getState()
  .login("email@test.com", "password", "recaptcha_token");

// ============================================
// STORE DEBUGGING
// ============================================

// Check sidebar data
useStore.getState().sidebarData;

// Refetch menu
await useStore.getState().fetchSideMenus();

// Check homepage data
useStore.getState().homepage;

// ============================================
// PERMISSION DEBUGGING
// ============================================

// Check if user can access page
useUserStore.getState().hasAccessToPage("properties");
useUserStore.getState().hasAccessToPage("analytics");
useUserStore.getState().hasAccessToPage("settings");

// Check specific permission
useUserStore.getState().checkPermission("properties.view");

// Refresh user data
await useUserStore.getState().refreshUserData();

// ============================================
// TOKEN DEBUGGING
// ============================================

// Get all cookies
document.cookie.split(";").forEach((c) => console.log(c.trim()));

// Get authToken specifically
document.cookie.split(";").find((c) => c.includes("authToken"));

// Get localStorage user
JSON.parse(localStorage.getItem("user"));

// Check axios lock status
import { isAxiosLocked } from "@/lib/axiosInstance";
isAxiosLocked();

// ============================================
// NETWORK DEBUGGING
// ============================================

// Test API endpoint manually
await fetch("https://api.taearif.com/api/user", {
  headers: {
    Authorization: `Bearer ${useAuthStore.getState().userData?.token}`,
  },
})
  .then((r) => r.json())
  .then(console.log);

// Test with axiosInstance
await axiosInstance.get("/user").then((r) => console.log(r.data));
```

---

## Advanced Debugging

### Enable Verbose Logging

**Add to `lib/axiosInstance.js`:**

```javascript
axiosInstance.interceptors.request.use((config) => {
  console.log("🔵 axios REQUEST:", {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data,
  });
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("🟢 axios RESPONSE:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.log("🔴 axios ERROR:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    return Promise.reject(error);
  },
);
```

### Monitor Store Changes

**Add to `context/AuthContext.js`:**

```javascript
const useAuthStore = create((set, get) => ({
  // ... existing code
}));

// Subscribe to all state changes
useAuthStore.subscribe((state) => {
  console.log("🔄 AuthStore changed:", state);
});
```

---

## Testing Checklist

### Pre-Deployment Testing

- [ ] Test login with email/password
- [ ] Test login with Google OAuth
- [ ] Test logout
- [ ] Test permission denied scenarios
- [ ] Test with free plan subscription
- [ ] Test with paid plan subscription
- [ ] Test with expired subscription
- [ ] Test all 26 dashboard modules load
- [ ] Test sidebar menu loads correctly
- [ ] Test RTL layout on all pages
- [ ] Test domain validation blocks tenant access
- [ ] Test token expiration handling
- [ ] Test network error handling
- [ ] Test onboarding flow
- [ ] Test guided tour

### Automated Testing (Suggested)

```typescript
describe("Dashboard Authentication", () => {
  it("should redirect to login if not authenticated", () => {
    // Test code
  });

  it("should allow access if authenticated", () => {
    // Test code
  });

  it("should block tenant domains", () => {
    // Test code
  });
});

describe("Dashboard Permissions", () => {
  it("should show only permitted menu items", () => {
    // Test code
  });

  it("should block access to restricted pages", () => {
    // Test code
  });

  it("should grant full access to tenant account type", () => {
    // Test code
  });
});
```

---

## Troubleshooting Tools

### Browser Extensions

**Recommended:**

1. **React Developer Tools** - Inspect component state
2. **Redux DevTools** - Works with Zustand
3. **Network Monitor** - Track API calls
4. **Cookie Editor** - Inspect/modify cookies

### Network Tab Analysis

**Check for:**

- Failed API requests (red in Network tab)
- Missing Authorization headers
- 401/403 status codes
- Slow responses (> 1s)
- CORS errors

### Console Error Patterns

**Common Errors:**

```
Error: Authentication required. Please login again.
→ axios is locked, call unlockAxios()

Error: فشل في جلب بيانات المستخدم
→ /api/user/getUserInfo failing

Error: useAuth must be used within AuthProvider
→ Component not wrapped in AuthProvider

Error: Invalid token.
→ Token expired or corrupted
```

---

**See Also:**

- [CORE_INFRASTRUCTURE.md](./CORE_INFRASTRUCTURE.md) - Store internals
- [AUTHENTICATION.md](./AUTHENTICATION.md) - Auth flows
- [DATA_FLOWS.md](./DATA_FLOWS.md) - Integration flows
