# Dashboard System Architecture

## Overview

The **Dashboard System** is the primary administrative interface for platform users to manage their websites, properties, customers, and business operations. It provides a comprehensive suite of tools for content management, analytics, CRM, affiliate management, and real estate operations.

**Key Characteristics:**
- **Access**: Requires Dashboard User Authentication (see [AUTHENTICATION_SYSTEMS.md](./AUTHENTICATION_SYSTEMS.md))
- **Routes**: All routes under `/dashboard/*`
- **Language**: Arabic RTL enforced (see [LOCALE_ROUTING_SYSTEM.md](./LOCALE_ROUTING_SYSTEM.md))
- **Domain**: Only accessible on base domain (not on tenant subdomains/custom domains)
- **Protection**: Token validation + middleware + client-side auth checks

---

## Table of Contents

1. [Core Infrastructure](#core-infrastructure)
2. [Architecture](#architecture)
3. [Authentication & Access Control](#authentication--access-control)
4. [Dashboard Layout](#dashboard-layout)
5. [Dashboard Modules](#dashboard-modules)
6. [Related Systems](#related-systems)
7. [Security & Permissions](#security--permissions)
8. [Data Flow](#data-flow)

---

## Core Infrastructure

### 1. Axios Instance (`lib/axiosInstance.js`)

**Purpose:** Centralized HTTP client for all Dashboard API requests with automatic token injection and error handling

**Complete Implementation:**

```javascript
import axios from "axios";
import https from "https";
import useAuthStore from "@/context/AuthContext";

// Locking mechanism to prevent requests when unauthenticated
let axiosLocked = false;

// HTTPS agent for development (skip SSL verification)
const httpsAgent = new https.Agent({
  rejectUnauthorized: process.env.NODE_ENV === "development" ? false : true,
});

// Create axios instance with base configuration
const baseURL = process.env.NEXT_PUBLIC_Backend_URL;

const axiosInstance = axios.create({
  baseURL: baseURL, // https://api.taearif.com/api
  httpsAgent: httpsAgent,
});

// ============================================
// REQUEST INTERCEPTOR - Automatic Token Injection
// ============================================
axiosInstance.interceptors.request.use(
  (config) => {
    // Security check: Reject if axios is locked
    if (axiosLocked) {
      return Promise.reject(
        new Error("Authentication required. Please login again.")
      );
    }

    // Get token from AuthStore
    const token = useAuthStore.getState().userData?.token;

    // Inject Bearer token if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================
// RESPONSE INTERCEPTOR - Error Handling
// ============================================
axiosInstance.interceptors.response.use(
  (response) => {
    // Success - return response as-is
    return response;
  },
  async (error) => {
    // Handle different error types
    if (error.response) {
      const { status, data } = error.response;

      // 401 Unauthorized - Token expired or invalid
      if (status === 401 || data?.message === "Too Many Attempts.") {
        // Note: Auto-locking is disabled to allow retry
        // axiosLocked = true; // Disabled
      }

      // 500+ Server errors
      else if (status >= 500) {
        error.serverError = {
          status,
          message: data?.message || "خطأ في الخادم",
          timestamp: new Date().toISOString(),
          url: error.config?.url,
        };
      }

      // 400-499 Client errors
      else if (status >= 400 && status < 500) {
        error.clientError = {
          status,
          message: data?.message || "خطأ في الطلب",
          timestamp: new Date().toISOString(),
        };
      }
    }

    // Network errors (no response from server)
    else if (error.request) {
      error.networkError = {
        message: "خطأ في الاتصال بالخادم. تحقق من اتصال الإنترنت",
        timestamp: new Date().toISOString(),
      };
    }

    // Other errors
    else {
      error.unknownError = {
        message: error.message || "حدث خطأ غير متوقع",
        timestamp: new Date().toISOString(),
      };
    }

    return Promise.reject(error);
  }
);

// ============================================
// AXIOS LOCK/UNLOCK FUNCTIONS
// ============================================

// Unlock axios after successful login
export const unlockAxios = () => {
  axiosLocked = false;
};

// Check if axios is locked
export const isAxiosLocked = () => axiosLocked;

// Lock axios manually (rarely used)
export const lockAxios = () => {
  axiosLocked = true;
};

export default axiosInstance;
```

**Key Features:**

**1. Automatic Token Injection:**
- Every request automatically gets `Authorization: Bearer {token}` header
- Token read from AuthStore in real-time
- No manual token management needed in components

**2. Request Locking Mechanism:**
- Prevents API calls when user is unauthenticated
- `unlockAxios()` called after successful login
- Protects against unauthorized request attempts

**3. Error Enhancement:**
- Categorizes errors: server, client, network, unknown
- Adds metadata: timestamp, URL, status
- Provides detailed error info for debugging

**4. HTTPS Agent Configuration:**
- Development: Skip SSL verification (self-signed certs)
- Production: Full SSL verification

**Usage in Dashboard:**

```typescript
// In any dashboard component
import axiosInstance from "@/lib/axiosInstance";

// No need to add headers manually
const response = await axiosInstance.get("/properties");
// Request automatically includes: Authorization: Bearer {token}

const newProperty = await axiosInstance.post("/properties", data);
// Token injected automatically

// Error handling
try {
  const data = await axiosInstance.get("/analytics");
} catch (error) {
  if (error.serverError) {
    console.log("Server error:", error.serverError.message);
  } else if (error.networkError) {
    toast.error("خطأ في الاتصال");
  }
}
```

**Integration Points:**
- Used by: ALL dashboard modules
- Unlocked in: `login()` function in AuthStore
- Unlocked in: `fetchUserData()` in AuthStore
- Error handling: Components + global interceptor

**See [AUTHENTICATION_SYSTEMS.md](./AUTHENTICATION_SYSTEMS.md) - Axios Integration section.**

---

### 2. AuthContext / AuthStore (`context/AuthContext.js`)

**Purpose:** Main authentication store for Dashboard User system (Zustand + React Context)

**File Structure:** Dual export pattern
- Zustand store (primary): `useAuthStore`
- React Context (backward compatibility): `AuthProvider` + `useAuth()`

**Complete Store Structure:**

```javascript
import { create } from "zustand";

const useAuthStore = create((set, get) => ({
  // ============================================
  // STATE - User Session
  // ============================================
  UserIslogged: false,           // Is user authenticated?
  IsLoading: true,               // Loading state for async operations
  IsDone: false,                 // Fetch completion flag
  authenticated: false,          // Alternative auth flag
  error: null,                   // General error message
  errorLogin: null,              // Login-specific error
  errorLoginATserver: null,      // Server-side login error
  onboarding_completed: false,   // Onboarding status
  
  // ============================================
  // STATE - User Data
  // ============================================
  userData: {
    // Basic Info
    email: null,
    token: null,
    username: null,
    first_name: null,
    last_name: null,
    company_name: null,
    domain: null,
    
    // Subscription Data
    is_free_plan: null,
    is_expired: false,
    days_remaining: null,
    package_title: null,           // "Free", "Pro", "Enterprise"
    package_features: [],          // Array of feature flags
    project_limit_number: null,    // Max projects allowed
    real_estate_limit_number: null, // Max properties allowed
    
    // Permissions & Access
    permissions: [],               // Array of permission strings
    account_type: null,            // "admin", "manager", "editor"
    tenant_id: null,               // Associated tenant (if any)
    
    // Messages
    message: null,                 // System message to display
  },
  
  // ============================================
  // STATE - Google OAuth
  // ============================================
  googleUrlFetched: false,
  googleAuthUrl: null,
  
  // ============================================
  // STATE - Live Editor (Legacy - separate system now)
  // ============================================
  liveEditorUser: null,
  liveEditorLoading: false,
  liveEditorError: null,
  
  // ============================================
  // ACTIONS - Authentication
  // ============================================
  
  /**
   * Login with email and password
   * Flow: External API → Internal setAuth → Store update → localStorage
   */
  login: async (email, password, recaptchaToken) => {
    set({ IsLoading: true, errorLogin: null, errorLoginATserver: null });
    unlockAxios(); // Enable API requests
    
    try {
      // Step 1: Call external authentication API
      const externalResponse = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_URL}/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, recaptcha_token: recaptchaToken }),
        }
      );
      
      if (!externalResponse.ok) {
        const errorData = await externalResponse.json().catch(() => ({}));
        let errorMsg = errorData.message || "فشل تسجيل الدخول";
        if (errorMsg === "Invalid credentials") {
          errorMsg = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
        }
        set({ errorLogin: errorMsg });
        return { success: false, error: errorMsg };
      }
      
      const { user, token: UserToken } = await externalResponse.json();
      
      // Step 2: Set authentication cookie (httpOnly)
      const setAuthResponse = await fetch("/api/user/setAuth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, UserToken }),
      });
      
      if (!setAuthResponse.ok) {
        const errorData = await setAuthResponse.json().catch(() => ({}));
        const errorMsg = errorData.error || "فشل في تعيين التوكن";
        set({ errorLogin: errorMsg });
        return { success: false, error: errorMsg };
      }
      
      // Step 3: Update store
      const safeUserData = {
        email: user.email,
        token: UserToken,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        onboarding_completed: user.onboarding_completed || false,
      };
      
      set({ UserIslogged: true, userData: safeUserData });
      
      // Step 4: Persist to localStorage
      localStorage.setItem("user", JSON.stringify(safeUserData));
      
      // Step 5: Unlock axios for API calls
      unlockAxios();
      
      return { success: true };
    } catch (error) {
      const errorMsg = "حدث خطأ أثناء الاتصال بالخادم";
      set({ errorLoginATserver: errorMsg });
      return { success: false, error: errorMsg };
    } finally {
      set({ IsLoading: false });
    }
  },
  
  /**
   * Logout user
   * Clears all authentication state, cookies, and localStorage
   */
  logout: async (options = { redirect: true, clearStore: true }) => {
    try {
      // Call logout API to clear server-side cookie
      await fetch("/api/user/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: get().userData.token }),
      });
      
      // Clear store state
      if (options.clearStore) {
        set({ 
          UserIslogged: false, 
          authenticated: false, 
          userData: null 
        });
      }
      
      // Clear localStorage
      localStorage.removeItem("user");
      
      // Redirect to login
      if (options.redirect) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("خطأ أثناء عملية تسجيل الخروج:", error);
    }
  },
  
  /**
   * Fetch user data from server
   * Called on app initialization and after login
   */
  fetchUserData: async () => {
    set({ IsLoading: true, error: null });
    if (get().IsDone === true) return; // Prevent duplicate calls
    set({ IsDone: true, error: null });
    
    unlockAxios(); // Ensure axios is unlocked
    
    try {
      // Step 1: Get user info from cookie
      const userInfoResponse = await fetch("/api/user/getUserInfo");
      
      if (!userInfoResponse.ok) {
        set({ authenticated: false });
        throw new Error("فشل في جلب بيانات المستخدم");
      }
      
      const userData = await userInfoResponse.json();
      
      // Step 2: Update store with basic user data
      set({
        UserIslogged: true,
        userData: {
          ...userData,
          onboarding_completed: userData.onboarding_completed || false,
        },
        IsLoading: true,
        error: null,
      });
      
      // Step 3: Store in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Step 4: Fetch subscription data if not already loaded
      if (get().userData.is_free_plan == null) {
        const ress = await axiosInstance.get("/user");
        const subscriptionDATA = ress.data.data;
        
        // Step 5: Update store with subscription data
        set({
          authenticated: true,
          userData: {
            ...userData,
            days_remaining: subscriptionDATA.membership.days_remaining || null,
            is_free_plan: subscriptionDATA.membership.is_free_plan || false,
            is_expired: subscriptionDATA.membership.is_expired || false,
            package_title: subscriptionDATA.membership.package.title || null,
            package_features: subscriptionDATA.membership.package.features || [],
            project_limit_number: subscriptionDATA.membership.package.project_limit_number || null,
            real_estate_limit_number: subscriptionDATA.membership.package.real_estate_limit_number || null,
            domain: subscriptionDATA.domain || null,
            message: subscriptionDATA.message || null,
            company_name: subscriptionDATA.company_name || null,
          },
        });
      }
      
      set({ IsDone: false, error: null });
    } catch (error) {
      set({
        error: error.message || "خطأ في جلب بيانات المستخدم",
        authenticated: false,
        UserIslogged: false,
      });
      set({ IsDone: false, error: null });
    } finally {
      set({ IsLoading: false });
      set({ IsDone: false, error: null });
    }
  },
  
  /**
   * Login with OAuth token (from Google)
   * Used by /oauth/token/success page
   */
  loginWithToken: async (token) => {
    try {
      // Set token temporarily
      set((state) => ({
        userData: { ...state.userData, token },
        IsLoading: true,
      }));
      
      // Fetch user data using token
      const response = await axiosInstance.get("/user");
      const user = response.data.data?.user || response.data.data || response.data.user || response.data;
      
      const userData = {
        ...user,
        token,
        onboarding_completed: user.onboarding_completed || false,
      };
      
      // Update store
      set({
        UserIslogged: true,
        authenticated: true,
        userData,
      });
      
      // Persist to localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      
      unlockAxios();
      
      // Set authentication cookie
      const setAuthResponse = await fetch("/api/user/setAuth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, UserToken: token }),
      });
      
      if (!setAuthResponse.ok) {
        throw new Error("فشل في تعيين التوكن");
      }
      
      return { success: true };
    } catch (error) {
      set({ errorLoginATserver: "حدث خطأ أثناء الاتصال بالخادم!" });
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Fetch Google OAuth URL
   */
  fetchGoogleAuthUrl: async () => {
    const { googleUrlFetched, googleAuthUrl } = get();
    
    if (googleAuthUrl) return googleAuthUrl;
    if (googleUrlFetched) return null;
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_URL}/auth/google/redirect`
      );
      const data = await response.json();
      
      if (data.url) {
        set({ googleAuthUrl: data.url, googleUrlFetched: true });
        return data.url;
      }
      
      set({ googleUrlFetched: true });
      return null;
    } catch (error) {
      console.error("Error fetching Google auth URL:", error);
      set({ googleUrlFetched: true });
      return null;
    }
  },
  
  // ============================================
  // SETTERS
  // ============================================
  setOnboardingCompleted: (boolean) => set({ onboarding_completed: boolean }),
  setErrorLogin: (error) => set({ errorLogin: error }),
  setAuthenticated: (value) => set({ authenticated: value }),
  setUserData: (data) => set({ userData: data }),
  setUserIsLogged: (isLogged) => set({ UserIslogged: isLogged }),
  setIsLoading: (loading) => set({ IsLoading: loading }),
  clearMessage: () => set((state) => ({
    userData: { ...state.userData, message: null }
  })),
  setMessage: (message) => set((state) => ({
    userData: { ...state.userData, message }
  })),
}));

export default useAuthStore;
```

**React Context (Backward Compatibility):**

```javascript
import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
```

**Usage Patterns:**

```typescript
// Pattern 1: Zustand Store (Preferred)
import useAuthStore from "@/context/AuthContext";

function MyComponent() {
  const { UserIslogged, userData } = useAuthStore();
  const login = useAuthStore((state) => state.login);
  
  // Access user data
  console.log(userData.email, userData.token);
  
  // Call login action
  await login(email, password, recaptchaToken);
}

// Pattern 2: React Context (Legacy)
import { useAuth } from "@/context/AuthContext";

function MyComponent() {
  const { user, loading } = useAuth();
  
  // Access user data from context
  console.log(user?.email);
}
```

**When to Use:**
- **Zustand Store**: All new code, actions needed, performance-critical
- **React Context**: Legacy components, simple data access only

**See [AUTHENTICATION_SYSTEMS.md](./AUTHENTICATION_SYSTEMS.md) for complete authentication flow.**

---

### 3. Store (`context/Store.js`)

**Purpose:** Modular Zustand store aggregating multiple dashboard sub-stores

**Architecture: Micro-Store Pattern**

```javascript
const { create } = require("zustand");
const axiosInstance = require("@/lib/axiosInstance");

const useStore = create((set, get) => ({
  // Global state
  loading: false,
  
  // ============================================
  // HOMEPAGE DASHBOARD STORES
  // ============================================
  homepage: {
    // Device statistics
    ...require("./store/homepage/dashboardDevice")(set),
    
    // Summary cards (visitors, pageviews, etc.)
    ...require("./store/homepage/dashboardSummary")(set),
    
    // Visitor analytics data
    ...require("./store/homepage/visitorData")(set),
    
    // Setup progress tracking
    ...require("./store/homepage/setupProgress")(set),
    
    // Traffic sources data
    ...require("./store/homepage/trafficSources")(set),
    
    // Time range selector
    setSelectedTimeRange: (range) =>
      set((state) => ({
        homepage: { ...state.homepage, selectedTimeRange: range },
      })),
  },
  
  // ============================================
  // MODULE-SPECIFIC STORES
  // ============================================
  
  // Content Management System
  ...require("./store/contentManagement")(set),
  
  // Recent activity tracking
  ...require("./store/recentActivity")(set),
  
  // Projects management
  ...require("./store/projectsManagement")(set),
  
  // Properties management
  ...require("./store/propertiesManagement")(set),
  
  // Blog management
  ...require("./store/blogManagement")(set, get),
  
  // Affiliate program
  ...require("./store/affiliate")(set, get),
  
  // Sidebar navigation
  ...require("./store/sidebar")(set, get),
  
  // Rental management
  ...require("./store/rentalManagement")(set, get),
  
  // Purchase management
  ...require("./store/purchaseManagement")(set, get),
  
  // Property matching
  ...require("./store/matchingPage")(set, get),
  
  // Marketing dashboard
  ...require("./store/marketingDashboard")(set, get),
  
  // Rental owner dashboard
  ...require("./store/rentalOwnerDashboardPage")(set, get),
  
  // User authentication (duplicate? Check if needed)
  ...require("./store/userAuth")(set),
}));

module.exports = useStore;
```

**Sub-Store Example: Sidebar (`context/store/sidebar.js`):**

```javascript
module.exports = (set, get) => ({
  sidebarData: {
    mainNavItems: [],
    loading: false,
    error: null,
  },
  
  fetchSideMenus: async () => {
    const currentState = get();
    set({ 
      sidebarData: { 
        ...currentState.sidebarData, 
        loading: true, 
        error: null 
      } 
    });
    
    try {
      const response = await axiosInstance.get("/dashboard/menu");
      const menuItems = response.data.mainNavItems || [];
      
      set({
        sidebarData: {
          mainNavItems: menuItems,
          loading: false,
          error: null,
        },
      });
    } catch (error) {
      set({
        sidebarData: {
          ...currentState.sidebarData,
          loading: false,
          error: error.message || "فشل تحميل القائمة",
        },
      });
    }
  },
});
```

**Usage in Components:**

```typescript
import useStore from "@/context/Store";

function DashboardComponent() {
  // Access sidebar data
  const { sidebarData, fetchSideMenus } = useStore();
  const { mainNavItems, loading, error } = sidebarData;
  
  // Access homepage data
  const { homepage } = useStore();
  const { dashboardSummary, visitorData } = homepage;
  
  // Call actions
  useEffect(() => {
    fetchSideMenus();
  }, []);
}
```

**Modular Benefits:**
- Each module in separate file
- Easier maintenance
- Lazy loading possible
- Clear separation of concerns
- All aggregated in single store

**Sub-Store Files:**
```
context/store/
├── homepage/
│   ├── dashboardDevice.js
│   ├── dashboardSummary.js
│   ├── visitorData.js
│   ├── setupProgress.js
│   └── trafficSources.js
├── contentManagement.js
├── recentActivity.js
├── projectsManagement.js
├── propertiesManagement.js
├── blogManagement.js
├── affiliate.js
├── sidebar.js                    # ← Used by EnhancedSidebar
├── rentalManagement.js
├── purchaseManagement.js
├── matchingPage.js
├── marketingDashboard.js
├── rentalOwnerDashboardPage.js
└── userAuth.js
```

---

### 4. UserStore (`store/userStore.ts`)

**Purpose:** Permission-focused user data store (separate from AuthStore)

**Why Separate from AuthStore?**
- AuthStore: Authentication + session management
- UserStore: Permissions + access control
- Separation of concerns
- Used by `PermissionWrapper` and `usePermissions`

**Complete Implementation:**

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "@/lib/axiosInstance";

interface Permission {
  id: number;
  name: string;              // e.g., "properties.view"
  name_ar: string;           // "عرض العقارات"
  name_en: string;           // "View Properties"
  description: string | null;
}

interface UserData {
  id: number;
  tenant_id: number | null;
  account_type: string;      // "admin", "manager", "editor"
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  permissions: Permission[]; // Array of permission objects
  [key: string]: any;
}

interface UserState {
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  isInitialized: boolean;
}

interface UserActions {
  fetchUserData: () => Promise<void>;
  setUserData: (userData: UserData) => void;
  clearUserData: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  checkPermission: (permissionName: string) => boolean;
  hasAccessToPage: (pageSlug: string) => boolean;
  refreshUserData: () => Promise<void>;
}

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      // ============================================
      // STATE
      // ============================================
      userData: null,
      loading: false,
      error: null,
      lastFetched: null,
      isInitialized: false,

      // ============================================
      // ACTIONS
      // ============================================
      
      /**
       * Fetch user data with caching
       * Prevents excessive API calls
       */
      fetchUserData: async () => {
        const { lastFetched, userData } = get();

        // Check cache validity (5 minutes)
        if (
          userData &&
          lastFetched &&
          Date.now() - lastFetched < CACHE_DURATION
        ) {
          set({ isInitialized: true });
          return; // Use cached data
        }

        set({ loading: true, error: null });

        try {
          const response = await axiosInstance.get("/user");

          if (response.data.status === "success" && response.data.data) {
            const userData: UserData = response.data.data;
            set({
              userData,
              loading: false,
              error: null,
              lastFetched: Date.now(),
              isInitialized: true,
            });
          } else {
            throw new Error("Failed to fetch user data");
          }
        } catch (error: any) {
          console.error("Error fetching user data:", error);
          set({
            loading: false,
            error: error.message || "خطأ في جلب بيانات المستخدم",
            isInitialized: true,
          });
        }
      },

      /**
       * Check if user has specific permission
       */
      checkPermission: (permissionName: string) => {
        const { userData } = get();
        if (!userData || !userData.permissions) return false;

        return userData.permissions.some(
          (permission) => permission.name === permissionName
        );
      },

      /**
       * Check if user has access to page
       * Used by PermissionWrapper
       */
      hasAccessToPage: (pageSlug: string | null) => {
        const { userData } = get();
        if (!userData || !pageSlug) return false;

        // Special case: access-control only for tenants
        if (pageSlug === "access-control") {
          return userData.account_type === "tenant";
        }

        // Tenant account type has full access
        if (userData.account_type === "tenant") {
          return true;
        }

        // Map page slugs to permission names
        const permissionMap: { [key: string]: string } = {
          customers: "customers.view",
          live_editor: "live_editor.view",
          properties: "properties.view",
          rentals: "rentals.view",
          projects: "projects.view",
          employees: "employees.view",
          analytics: "analytics.view",
          settings: "settings.view",
          "access-control": "access.control",
          marketing: "marketing.view",
          templates: "templates.view",
          websites: "websites.view",
          "activity-logs": "activity.logs.view",
          "purchase-management": "purchase.management",
          "rental-management": "rental.management",
          "financial-reporting": "financial.reporting",
          affiliate: "affiliate.view",
          "help-center": "help.center",
          solutions: "solutions.view",
          apps: "apps.view",
          blogs: "blogs.view",
          messages: "messages.view",
          "whatsapp-ai": "whatsapp.ai",
        };

        const requiredPermission = permissionMap[pageSlug] || `${pageSlug}.view`;
        return get().checkPermission(requiredPermission);
      },

      /**
       * Force refresh user data (bypass cache)
       */
      refreshUserData: async () => {
        set({ lastFetched: null }); // Invalidate cache
        await get().fetchUserData();
      },

      // Setters
      setUserData: (userData: UserData) => {
        set({
          userData,
          lastFetched: Date.now(),
          isInitialized: true,
        });
      },

      clearUserData: () => {
        set({
          userData: null,
          loading: false,
          error: null,
          lastFetched: null,
          isInitialized: false,
        });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      // Persist configuration
      name: "user-store",
      partialize: (state) => ({
        userData: state.userData,
        lastFetched: state.lastFetched,
        isInitialized: state.isInitialized,
      }),
    }
  )
);
```

**Key Features:**

**1. Data Caching:**
- Caches user data for 5 minutes
- Prevents excessive API calls
- Automatic cache invalidation

**2. Permission Checking:**
- `checkPermission(permissionName)` - Check specific permission
- `hasAccessToPage(pageSlug)` - Check page access (used by PermissionWrapper)

**3. Account Type Handling:**
- `tenant` account type → Full access to all pages
- Other types → Permission-based access

**4. Persistence:**
- Uses Zustand persist middleware
- Stores in localStorage
- Survives page refreshes

**Usage:**

```typescript
// In PermissionWrapper
import { useUserStore } from "@/store/userStore";

const { userData, hasAccessToPage } = useUserStore();
const hasPermission = hasAccessToPage("properties");

// In usePermissions hook
export const usePermissions = () => {
  const { userData, loading, error, hasAccessToPage } = useUserStore();
  const pathname = usePathname();
  const pageSlug = getPageSlug(pathname);
  const hasPermission = hasAccessToPage(pageSlug);
  
  return { hasPermission, loading, userData, error };
};
```

**Relationship with AuthStore:**
- **AuthStore**: Login, logout, session management, token storage
- **UserStore**: Permissions, access control, page authorization
- Both fetch `/user` endpoint but use data differently
- UserStore has caching, AuthStore doesn't

---

### 5. OwnerAuthContext (`context/OwnerAuthContext.js`)

**⚠️ IMPORTANT: NOT PART OF DASHBOARD SYSTEM**

**Purpose:** Authentication for Owner Portal (`/owner/*` routes)

**Mentioned here for CLARITY and DISTINCTION:**

```javascript
import { create } from "zustand";

const useOwnerAuthStore = create((set, get) => ({
  // ============================================
  // STATE - Owner Session
  // ============================================
  ownerIsLogged: false,
  isLoading: false,
  isAuthenticated: false,
  errorLogin: null,
  errorRegister: null,
  
  ownerData: {
    email: null,
    token: null,
    first_name: null,
    last_name: null,
    tenant_id: null,      // ← Always has tenant context
    owner_id: null,
    permissions: [],
  },
  
  // ============================================
  // ACTIONS
  // ============================================
  
  login: async (email, password) => {
    // Direct API call (no internal API wrapper)
    const response = await axios.post(
      "https://api.taearif.com/api/v1/owner-rental/login",
      { email, password }
    );
    
    // Set client-side cookies (NOT httpOnly)
    document.cookie = `owner_token=${token}; path=/; max-age=604800`;
    document.cookie = `ownerRentalToken=${token}; path=/; max-age=604800`;
    
    // Update store
    set({ ownerIsLogged: true, ownerData: {...} });
    
    // Store in localStorage
    localStorage.setItem("owner_user", JSON.stringify(ownerData));
  },
  
  logout: async () => {
    // Clear cookies
    document.cookie = "owner_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "ownerRentalToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Clear localStorage
    localStorage.removeItem("owner_user");
    
    // Clear store
    set({ ownerIsLogged: false, ownerData: null });
  },
}));

export default useOwnerAuthStore;
```

**Critical Differences from Dashboard AuthStore:**

| Feature | Dashboard (AuthStore) | Owner (OwnerAuthStore) |
|---------|----------------------|------------------------|
| **Routes** | `/dashboard/*` | `/owner/*` |
| **Cookie Names** | `authToken`, `next-auth.session-token` | `owner_token`, `ownerRentalToken` |
| **Cookie Type** | httpOnly (server-set) | Client-side (less secure) |
| **API Endpoint** | `/api/login` | `/v1/owner-rental/login` |
| **API Wrapper** | Internal `/api/user/*` | Direct to backend |
| **localStorage Key** | `user` | `owner_user` |
| **Requires Tenant?** | NO | YES (only works on tenant domains) |
| **Middleware Check** | Via ClientLayout | Via middleware.ts |
| **Used By** | Dashboard pages | Owner portal pages |

**WHY THEY DON'T INTERACT:**
- Completely separate authentication systems
- Different cookies → no cross-contamination
- Different stores → independent state
- Dashboard user logged in ≠ Owner logged in
- Can be logged into both simultaneously (different sessions)

**Example:**
```
User logs into Dashboard on localhost:3000/ar/dashboard
  → AuthStore.UserIslogged = true
  → Cookie: authToken = "abc123..."
  
Same user visits tenant1.localhost:3000/ar/owner/dashboard
  → Middleware checks owner_token → NOT FOUND
  → Redirect to /owner/login
  → Must login separately as Owner
  → OwnerAuthStore.ownerIsLogged = true
  → Cookie: owner_token = "xyz789..."
  
Both sessions active simultaneously, completely independent
```

**See [AUTHENTICATION_SYSTEMS.md](./AUTHENTICATION_SYSTEMS.md) for complete separation details.**

---

## Architecture

### File Structure

```
app/dashboard/
├── layout.tsx                    # Dashboard layout wrapper (RTL, auth, GTM)
├── page.tsx                      # Dashboard homepage
├── access-control/               # User roles & permissions management
├── activity-logs/                # System activity tracking
├── affiliate/                    # Affiliate program management
├── analytics/                    # Business analytics & metrics
├── apps/                         # App integrations
├── blog/                         # Blog management
├── blogs/                        # Multi-blog management
├── buildings/                    # Building management (real estate)
├── componentsTest/               # Component testing page
├── content/                      # Content management (14 sub-sections)
├── crm/                          # Customer Relationship Management
├── customers/                    # Customer management
├── expenses/                     # Expense tracking
├── marketing/                    # Marketing tools
├── matching/                     # Property matching system
├── messages/                     # Messaging system
├── projects/                     # Real estate projects management
├── properties/                   # Property listings management
├── property-requests/            # Property inquiry management
├── purchase-management/          # Purchase transactions
├── rental-management/            # Rental contracts & operations
├── reset/                        # Password reset
├── settings/                     # Dashboard settings
├── templates/                    # Website templates
└── whatsapp-ai/                  # WhatsApp AI integration
```

### Component Architecture

Each dashboard page follows this pattern:

```typescript
// Pattern: app/dashboard/[module]/page.tsx
import { ModulePage } from "@/components/[module-path]";

export const metadata = {
  title: "Module Title",
};

export default function Page() {
  return <ModulePage />;
}
```

**Components are located in:**
- `components/[module-name]/` - Module-specific components
- Shared components: `components/ui/`, `components/mainCOMP/`

---

## Authentication & Access Control

### Authentication Requirements

**See [AUTHENTICATION_SYSTEMS.md](./AUTHENTICATION_SYSTEMS.md) for complete details.**

Dashboard pages require:
1. **Dashboard User Login** (not Owner login)
2. **Valid session token** (stored in httpOnly cookie)
3. **Active subscription** (checked via axios)
4. **Base domain access** (not tenant domain)

### Protection Layers

#### Layer 1: Middleware (Server-Side)

**File: `middleware.ts`**

```typescript
// All dashboard routes must have locale prefix
/dashboard → redirects to → /ar/dashboard
```

**See [LOCALE_ROUTING_SYSTEM.md](./LOCALE_ROUTING_SYSTEM.md) for locale handling.**

#### Layer 2: Dashboard Layout (Client-Side)

**File: `app/dashboard/layout.tsx`**

```typescript
export default function DashboardLayout({ children }) {
  const { tokenValidation } = useTokenValidation();
  const [isValidDomain, setIsValidDomain] = useState<boolean | null>(null);

  // ✅ Check 1: Verify base domain (not tenant domain)
  useEffect(() => {
    const hostname = window.location.hostname;
    const isBaseDomain = hostname === "localhost" || hostname === "taearif.com";
    setIsValidDomain(isBaseDomain);
  }, []);

  // ✅ Check 2: Validate authentication token
  if (tokenValidation.loading) {
    return <LoadingScreen />;
  }

  // ✅ Check 3: Enforce RTL direction for Arabic
  useEffect(() => {
    document.documentElement.dir = "rtl";
  }, []);

  return (
    <GTMProvider>
      <PermissionWrapper>
        {children}
      </PermissionWrapper>
    </GTMProvider>
  );
}
```

**Key Features:**
- **RTL Enforcement**: Forces Arabic right-to-left layout (lines 87-110)
- **Domain Validation**: Blocks access from tenant domains (lines 47-84)
- **Token Validation**: Verifies user session (line 42)
- **Permission Wrapper**: Role-based access control (line 140)
- **GTM Integration**: Google Tag Manager tracking (line 138)

#### Layer 3: ClientLayout (Global Auth)

**File: `app/ClientLayout.tsx`**

```typescript
export default function ClientLayout({ children }) {
  const UserIslogged = useAuthStore((state) => state.UserIslogged);
  const IsLoading = useAuthStore((state) => state.IsLoading);
  const pathname = usePathname();

  const publicPages = ["/login", "/register", "/oauth"];
  const isPublicPage = publicPages.some(page => pathname?.startsWith(page));

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!IsLoading && !UserIslogged && !isPublicPage) {
      router.push("/login");
    }
  }, [IsLoading, UserIslogged, pathname]);

  if (!UserIslogged && !isPublicPage) {
    return null; // Block render until authenticated
  }

  return <AuthProvider>{children}</AuthProvider>;
}
```

**See [AUTHENTICATION_SYSTEMS.md](./AUTHENTICATION_SYSTEMS.md) - Dashboard System section.**

### Permission System

**File: `components/PermissionWrapper.tsx`**

```typescript
export default function PermissionWrapper({ children }) {
  const { permissions } = useAuthStore((state) => state.userData);
  
  // Check user permissions against required permissions
  // Render based on access rights
}
```

**Permissions checked:**
- Page-level access
- Feature-level access
- Action-level access (create, edit, delete)

---

## Dashboard Layout

### Structure Components

#### 1. DashboardHeader

**File: `components/mainCOMP/dashboard-header.tsx`**

**Features:**
- User profile display
- Notifications
- Quick actions
- Search functionality
- Logout button

#### 2. EnhancedSidebar

**File: `components/mainCOMP/enhanced-sidebar.tsx`**

**Purpose:** Primary navigation for dashboard with dynamic menu loading

**Features:**
- **Dynamic menu loading** from API via Zustand store
- Active route highlighting
- Collapsible sections
- Permission-based menu items
- Website switcher (for multi-website users)
- Responsive height detection
- Collapse/expand functionality
- Tooltip support

**Data Source:**

```typescript
// Store: context/Store.js
const useStore = create((set, get) => ({
  sidebarData: {
    mainNavItems: [],
    loading: false,
    error: null,
  },
  
  fetchSideMenus: async () => {
    // Fetch menu structure from API
    // Store in mainNavItems
  },
}));
```

**Menu Loading Flow:**
```
Component mounts
  ↓
Check if user token exists
  ↓
fetchSideMenus() called
  ↓
GET /api/dashboard/menu (or backend endpoint)
  ↓
Response: { mainNavItems: [...] }
  ↓
Store in Zustand store
  ↓
Sidebar renders menu items
  ↓
Permission check for each item
  ↓
Display only accessible items
```

**Menu Item Structure:**
```typescript
type MainNavItem = {
  id: string;                    // Unique identifier
  label: string;                 // Display text (Arabic)
  description?: string;          // Tooltip description
  icon: React.ComponentType;     // Lucide icon component
  path: string;                  // Route path
  isAPP?: boolean;              // External app (opens in new tab)
  subItems?: MainNavItem[];     // Nested sub-menu
};
```

**Active Tab Detection:**
```typescript
const currentPath = pathname || "/";
const currentTab = mainNavItems.find(
  (item) => item.path === currentPath || 
           (item.path !== "/" && currentPath.startsWith(item.path))
)?.id || "dashboard";
```

**Responsive Behavior:**
```typescript
const useScreenHeight = () => {
  const [isShortScreen, setIsShortScreen] = useState(false);
  const [isVeryShortScreen, setIsVeryShortScreen] = useState(false);
  
  useEffect(() => {
    const checkHeight = () => {
      setIsShortScreen(window.innerHeight < 720);
      setIsVeryShortScreen(window.innerHeight < 1000);
    };
    
    checkHeight();
    window.addEventListener("resize", checkHeight);
  }, []);
  
  return { isShortScreen, isVeryShortScreen };
};
```

**External App Handling:**
```typescript
const handleItemClick = (item: MainNavItem, e: any) => {
  if (item.isAPP) {
    e.preventDefault();
    const url = `${item.path}?token=${userData.token}`;
    window.open(url, "_blank"); // Open in new tab
  }
  // Regular links use Next.js Link component
};
```

**Typical Menu Structure:**
```
Dashboard Home
├── Websites (live-editor access)
├── Analytics
├── Properties
│   ├── All Properties
│   ├── For Sale
│   ├── For Rent
│   └── Projects
├── Customers
│   ├── Customer List
│   ├── CRM
│   └── Activity Logs
├── Content (14 sub-sections)
│   ├── About
│   ├── Achievements
│   ├── Banner
│   ├── Brands
│   ├── Categories
│   ├── Footer
│   ├── Gallery
│   ├── General
│   ├── Menu
│   ├── Portfolio
│   ├── Services
│   ├── Skills
│   ├── Testimonials
│   └── Why Choose Us
├── Marketing
├── Affiliate
├── Apps & Integrations
├── Rental Management
├── Purchase Management
├── Access Control
└── Settings
```

#### 3. GuidedTour

**File: `components/mainCOMP/guided-tour.tsx`**

**Features:**
- First-time user onboarding
- Interactive tutorial
- Feature highlights
- Skip/complete tracking

---

## Dashboard Modules

### 1. Dashboard Homepage (`/dashboard`)

**File: `app/dashboard/page.tsx`**

**Component: `WelcomeDashboard`**

**Features:**
- Welcome message
- Quick statistics
- Recent activity
- Quick actions
- Getting started guide

---

### 2. Analytics (`/dashboard/analytics`)

**File: `app/dashboard/analytics/page.tsx`**

**Component: `AnalyticsPage`**

**Purpose:** Business metrics and performance tracking

**Features:**
- Website traffic analytics
- Visitor statistics
- Page views
- Conversion tracking
- Revenue analytics
- Custom date ranges
- Export reports

**Related Systems:**
- GA4 tracking integration
- GTM event tracking

---

### 3. Properties Management (`/dashboard/properties`)

**File: `app/dashboard/properties/page.tsx`**

**Component: `PropertiesManagementPage`**

**Purpose:** Real estate property listings management

**Features:**
- Property listing grid
- Add new property
- Edit property
- Delete property
- Property status management (available, sold, rented)
- Image gallery management
- Property details (price, location, specs)
- Search and filter
- Bulk actions

**Sub-Routes:**
- `/dashboard/properties/add` - Add new property
- `/dashboard/properties/[id]/edit` - Edit property

---

### 4. Projects (`/dashboard/projects`)

**File: `app/dashboard/projects/page.tsx`**

**Purpose:** Real estate project management (buildings, compounds)

**Features:**
- Project listing
- Add new project
- Edit project details
- Project phases
- Unit management
- Master plan uploads
- Location mapping

**Sub-Routes:**
- `/dashboard/projects/add` - Add new project
- `/dashboard/projects/[id]/edit` - Edit project

---

### 5. Buildings (`/dashboard/buildings`)

**File: `app/dashboard/buildings/page.tsx`**

**Purpose:** Building management within projects

**Features:**
- Building listing
- Floor plans
- Unit allocation
- Facility management
- Maintenance tracking

**Sub-Routes:**
- `/dashboard/buildings/add` - Add new building
- `/dashboard/buildings/[id]/edit` - Edit building

---

### 6. Customers (`/dashboard/customers`)

**File: `app/dashboard/customers/page.tsx`**

**Component: `customers-page`**

**Purpose:** Customer database management

**Features:**
- Customer listing
- Customer profiles
- Contact information
- Customer tags/categories
- Search and filter
- Export customer data
- Customer notes
- Activity history

---

### 7. CRM (`/dashboard/crm`)

**File: `app/dashboard/crm/page.tsx`**

**Component: `CrmPage`**

**Purpose:** Customer Relationship Management

**Features:**
- Lead management
- Sales pipeline
- Deal tracking
- Follow-up reminders
- Customer interactions
- Task management
- Email integration
- Sales reports

---

### 8. Property Requests (`/dashboard/property-requests`)

**File: `app/dashboard/property-requests/page.tsx`**

**Purpose:** Handle property inquiries from website visitors

**Features:**
- Request inbox
- Request status (new, contacted, completed)
- Customer details
- Requested property details
- Response management
- Follow-up tracking

---

### 9. Rental Management (`/dashboard/rental-management`)

**File: `app/dashboard/rental-management/page.tsx`**

**Component: `RentalManagementDashboard`**

**Purpose:** Comprehensive rental operations management

**Features:**
- Rental contracts
- Tenant management
- Rent collection tracking
- Payment reminders
- Lease renewals
- Maintenance requests
- Deposit management
- Rental reports

**Sub-Routes:**
- `/dashboard/rental-management/contracts` - Contract management
- `/dashboard/rental-management/owners` - Owner management
- `/dashboard/rental-management/daily-followup` - Daily tasks
- `/dashboard/rental-management/create` - Create new contract

**Special:** Has its own README at `app/dashboard/rental-management/create/README.md`

---

### 10. Purchase Management (`/dashboard/purchase-management`)

**File: `app/dashboard/purchase-management/page.tsx`**

**Purpose:** Property purchase transaction management

**Features:**
- Purchase agreements
- Payment schedules
- Buyer information
- Document management
- Payment tracking
- Completion status

**Sub-Routes:**
- `/dashboard/purchase-management/[id]` - Purchase details

---

### 11. Content Management (`/dashboard/content`)

**File: `app/dashboard/content/page.tsx`**

**Purpose:** Website content management hub

**14 Sub-Sections:**

#### 11.1 About (`/dashboard/content/about`)
- About us page content
- Company information
- Team members
- Mission & vision

#### 11.2 Achievements (`/dashboard/content/achievements`)
- Achievement badges
- Milestones
- Statistics

#### 11.3 Banner (`/dashboard/content/banner`)
- Homepage banners
- Promotional banners
- Image uploads

#### 11.4 Brands (`/dashboard/content/brands`)
- Partner brands
- Brand logos
- Brand links

#### 11.5 Categories (`/dashboard/content/categories`)
- Property categories
- Service categories
- Category management

#### 11.6 Footer (`/dashboard/content/footer`)
- Footer content
- Footer links
- Social media links
- Contact information

#### 11.7 Gallery (`/dashboard/content/gallery`)
- Image gallery
- Video gallery
- Media organization

#### 11.8 General (`/dashboard/content/general`)
- General site settings
- Global content
- Company details

#### 11.9 Menu (`/dashboard/content/menu`)
- Navigation menu
- Menu structure
- Menu items

#### 11.10 Portfolio (`/dashboard/content/portfolio`)
- Portfolio items
- Case studies
- Past projects

#### 11.11 Services (`/dashboard/content/services`)
- Service offerings
- Service descriptions
- Service pricing

#### 11.12 Skills (`/dashboard/content/skills`)
- Team skills
- Expertise areas
- Skill levels

#### 11.13 Testimonials (`/dashboard/content/testimonials`)
- Customer reviews
- Testimonial management
- Rating display

#### 11.14 Why Choose Us (`/dashboard/content/why-choose-us`)
- Value propositions
- Unique selling points
- Benefits

---

### 12. Blogs (`/dashboard/blogs`)

**File: `app/dashboard/blogs/page.tsx`**

**Purpose:** Blog post management

**Features:**
- Blog post listing
- Add new post
- Edit post
- Delete post
- Categories & tags
- Featured image
- SEO settings
- Publish/draft status

**Sub-Routes:**
- `/dashboard/blogs/add` - Create new blog post

---

### 13. Blog (Single) (`/dashboard/blog`)

**File: `app/dashboard/blog/page.tsx`**

**Purpose:** Single blog configuration (different from `/blogs`)

---

### 14. Affiliate (`/dashboard/affiliate`)

**File: `app/dashboard/affiliate/page.tsx`**

**Component: `AffiliateRegistrationPage`**

**Purpose:** Affiliate marketing program management

**Features:**
- Affiliate dashboard
- Referral tracking
- Commission management
- Affiliate links
- Performance reports
- Payout history

**Sub-Routes:**
- `/dashboard/affiliate/register` - Affiliate registration
- `/dashboard/affiliate/dashboard` - Affiliate dashboard
- `/dashboard/affiliate/links` - Affiliate links
- `/dashboard/affiliate/payments` - Payment history

---

### 15. Marketing (`/dashboard/marketing`)

**File: `app/dashboard/marketing/page.tsx`**

**Component: `marketing-page`**

**Purpose:** Marketing campaign management

**Features:**
- Email campaigns
- SMS marketing
- Social media integration
- Campaign analytics
- Lead generation
- A/B testing

---

### 16. Apps & Integrations (`/dashboard/apps`)

**File: `app/dashboard/apps/page.tsx`**

**Component: `apps-page`**

**Purpose:** Third-party app integrations

**Features:**
- Available apps
- Installed apps
- API keys management
- Webhook configuration
- Integration settings

---

### 17. WhatsApp AI (`/dashboard/whatsapp-ai`)

**File: `app/dashboard/whatsapp-ai/page.jsx`**

**Component: `whatsapp-ai-page`**

**Purpose:** AI-powered WhatsApp integration

**Features:**
- WhatsApp bot configuration
- Auto-responses
- Chat management
- AI training
- Message templates

---

### 18. Messages (`/dashboard/messages`)

**File: `app/dashboard/messages/page.tsx`**

**Component: `messages-page`**

**Purpose:** Internal messaging system

**Features:**
- Inbox
- Sent messages
- Compose message
- Message threads
- Attachments

---

### 19. Activity Logs (`/dashboard/activity-logs`)

**File: `app/dashboard/activity-logs/page.tsx`**

**Purpose:** System activity tracking and auditing

**Features:**
- User activity logs
- System events
- Change history
- Filter by user/date/action
- Export logs

**Sub-Routes:**
- `/dashboard/activity-logs/customer/[slug]` - Customer-specific logs
- `/dashboard/activity-logs/property/[slug]` - Property-specific logs
- `/dashboard/activity-logs/project/[slug]` - Project-specific logs

---

### 20. Access Control (`/dashboard/access-control`)

**File: `app/dashboard/access-control/page.tsx`**

**Purpose:** User roles and permissions management

**Features:**
- User management
- Role creation
- Permission assignment
- Access levels
- Team member invitations

**Sub-Routes:**
- `/dashboard/access-control/roles` - Role management

---

### 21. Matching (`/dashboard/matching`)

**File: `app/dashboard/matching/page.tsx`**

**Component: `matching-page`**

**Purpose:** Property-customer matching system

**Features:**
- Customer preferences
- Property recommendations
- Match algorithm
- Match notifications
- Match history

---

### 22. Templates (`/dashboard/templates`)

**File: `app/dashboard/templates/page.tsx`**

**Component: `templates-page`**

**Purpose:** Website template management

**Features:**
- Available templates
- Template preview
- Template activation
- Template customization
- Import/export templates

---

### 23. Settings (`/dashboard/settings`)

**File: `app/dashboard/settings/page.tsx`**

**Component: `SettingsPage`**

**Purpose:** Dashboard and account settings

**Features:**
- Profile settings
- Password change
- Notification preferences
- Language settings
- Theme settings
- Subscription management
- Billing information
- API access

---

### 24. Components Test (`/dashboard/componentsTest`)

**File: `app/dashboard/componentsTest/page.tsx`**

**Purpose:** Development/testing page for component verification

**Note:** Likely for development purposes only

---

### 25. Expenses (`/dashboard/expenses`)

**Directory:** `app/dashboard/expenses/`

**Purpose:** Expense tracking and management

**Status:** Directory exists but no page.tsx found (possibly under development)

---

### 26. Reset (`/dashboard/reset`)

**File: `app/dashboard/reset/page.tsx`**

**Purpose:** Password reset functionality (dashboard-specific)

**Features:**
- Reset password form
- Email verification
- Token validation
- New password submission

---

## Module Details & Interconnections

### Property Management Ecosystem

**Core Modules:**
1. `/dashboard/properties` - Property listings CRUD
2. `/dashboard/projects` - Real estate projects
3. `/dashboard/buildings` - Building management
4. `/dashboard/property-requests` - Customer inquiries
5. `/dashboard/rental-management` - Rental operations
6. `/dashboard/purchase-management` - Purchase operations

**Data Flow Between Modules:**

```
User creates Project in /dashboard/projects
  ↓
Project saved in database
  ↓
User adds Buildings to project in /dashboard/buildings
  ↓
Building linked to project
  ↓
User adds Properties to building in /dashboard/properties
  ↓
Property linked to building and project
  ↓
Property appears on tenant website (for-sale, for-rent pages)
  ↓
Customer submits inquiry on tenant website
  ↓
Inquiry appears in /dashboard/property-requests
  ↓
Admin responds to inquiry
  ↓
If rental → Create contract in /dashboard/rental-management
If purchase → Create agreement in /dashboard/purchase-management
  ↓
Transaction tracked and managed in respective module
```

### Content Management Workflow

**All 14 Content Sub-Sections** feed into Live Editor:

```
Admin edits content in /dashboard/content/about
  ↓
Content saved to database
  ↓
Live Editor reads content from database
  ↓
About Us component displays updated content on tenant website
  ↓
Changes reflected on tenant.localhost:3000/about-us
```

**Sub-Sections Mapped to Website Components:**
- `about` → About Us page
- `achievements` → Achievement section
- `testimonials` → Testimonials component
- `gallery` → Gallery component
- `services` → Services section
- `footer` → Footer content
- `menu` → Header menu items

**See [COMPONENT_LOADING_SYSTEM.md](./COMPONENT_LOADING_SYSTEM.md) for component architecture.**

### Customer Relationship Flow

**Modules Involved:**
1. `/dashboard/customers` - Customer database
2. `/dashboard/crm` - Relationship management
3. `/dashboard/messages` - Communication
4. `/dashboard/activity-logs` - Interaction tracking
5. `/dashboard/marketing` - Campaigns

**Flow:**

```
Customer submits property request on website
  ↓
Added to /dashboard/property-requests
  ↓
Admin responds → creates customer record
  ↓
Customer saved in /dashboard/customers
  ↓
CRM creates lead in /dashboard/crm
  ↓
Follow-up tasks created
  ↓
Messages sent via /dashboard/messages
  ↓
All interactions logged in /dashboard/activity-logs
  ↓
Customer added to marketing list in /dashboard/marketing
  ↓
Targeted campaigns sent
```

---

## Related Systems

### 1. Authentication System

**See [AUTHENTICATION_SYSTEMS.md](./AUTHENTICATION_SYSTEMS.md)**

**Key Points:**
- Dashboard uses **Dashboard User Authentication** (not Owner auth)
- Token stored in httpOnly cookie
- Session managed by Zustand store
- OAuth support (Google)

### 2. Locale Routing

**See [LOCALE_ROUTING_SYSTEM.md](./LOCALE_ROUTING_SYSTEM.md)**

**Key Points:**
- All dashboard routes require `/ar/` prefix
- Middleware auto-redirects: `/dashboard` → `/ar/dashboard`
- English (`/en/`) dashboard routes redirect to Arabic
- RTL enforced in layout

### 3. Middleware & Tenant Detection

**See [MIDDLEWARE_TENANT_DETECTION.md](./MIDDLEWARE_TENANT_DETECTION.md)**

**Key Points:**
- Dashboard accessible ONLY on base domain
- Tenant domains (subdomains/custom domains) cannot access dashboard
- Layout validates domain type and blocks tenant access

### 4. Component Loading System

**See [COMPONENT_LOADING_SYSTEM.md](./COMPONENT_LOADING_SYSTEM.md)**

**Key Points:**
- Dashboard uses standard React components (not dynamic lazy loading like tenant pages)
- Components imported directly from `@/components/`

### 5. ReCAPTCHA System

**See [RECAPTCHA_SYSTEM.md](./RECAPTCHA_SYSTEM.md)**

**Key Points:**
- ReCAPTCHA used on login page (protects dashboard access)
- Not used within dashboard pages

---

## Security & Permissions

### Token Validation

**Hook: `hooks/useTokenValidation.ts`**

**Purpose:** Validates user session token on dashboard page load

**Complete Flow:**

```typescript
export function useTokenValidation() {
  const [tokenValidation, setTokenValidation] = useState({
    isValid: null,
    message: "",
    loading: true,
  });
  
  const [isSameAccount, setIsSameAccount] = useState(false);
  const [newUserData, setNewUserData] = useState<any>(null);

  // Step 1: Fetch user info from cookie
  const fetchUserInfo = async () => {
    const userInfoResponse = await fetch("/api/user/getUserInfo");
    const userData = await userInfoResponse.json();
    return userData;
  };

  // Step 2: Validate token with backend
  const validateToken = async (token: string) => {
    try {
      const response = await axiosInstance.get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.status === 200) {
        const userData = response.data.data;
        
        // Update AuthStore with fresh data
        setUserData({
          email: userData.email,
          token: token,
          username: userData.username,
          permissions: userData.permissions || [],
          account_type: userData.account_type,
          // ... subscription data
          is_free_plan: userData.is_free_plan,
          package_features: userData.membership?.package?.features || [],
        });
        
        setTokenValidation({
          isValid: true,
          message: "الـ token صالح",
          loading: false,
        });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        // Token expired or invalid
        clearAuthCookie();
        clearAuthContextData();
        await logout({ redirect: false, clearStore: true });
        
        setTokenValidation({
          isValid: false,
          message: "الـ token منتهي الصلاحية أو غير صحيح",
          loading: false,
        });
      }
    }
  };

  // Step 3: Initialize on component mount
  useEffect(() => {
    const initializeTokenValidation = async () => {
      // Skip validation on register page
      const isRegisterPage = /^\/[a-z]{2}\/register(\/|$)/.test(pathname);
      if (isRegisterPage) {
        setTokenValidation({ isValid: null, message: "تخطي التحقق", loading: false });
        return;
      }
      
      // Fetch user info from cookie
      const userInfo = await fetchUserInfo();
      
      if (!userInfo || !userInfo.token) {
        setTokenValidation({ isValid: false, message: "لا يوجد token", loading: false });
        handleInvalidToken();
        return;
      }
      
      // Validate token
      await validateToken(userInfo.token);
    };
    
    initializeTokenValidation();
  }, []);

  // Step 4: Handle invalid token
  useEffect(() => {
    if (tokenValidation.isValid === false && !tokenValidation.loading) {
      handleInvalidToken(); // Redirect to login
    }
  }, [tokenValidation.isValid, tokenValidation.loading]);

  return { tokenValidation };
}
```

**Cookie Handling:**
```typescript
const clearAuthCookie = () => {
  document.cookie = "authToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  document.cookie = `authToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
};
```

**AuthContext Data Clearing:**
```typescript
const clearAuthContextData = () => {
  setUserData({
    email: null,
    token: null,
    username: null,
    permissions: [],
    account_type: null,
    tenant_id: null,
    // ... reset all fields
  });
  setUserIsLogged(false);
  setAuthenticated(false);
};
```

**Used In:**
- `app/dashboard/layout.tsx` (line 42)

**See [AUTHENTICATION_SYSTEMS.md](./AUTHENTICATION_SYSTEMS.md) for token storage details.**

### Permission Wrapper

**Component: `components/PermissionWrapper.tsx`**

**Purpose:** Role-based access control for dashboard pages

**Flow:**
```typescript
export default function PermissionWrapper({ children, fallback }) {
  const { hasPermission, loading, error, userData } = usePermissions();
  
  // Step 1: Loading state
  if (loading) {
    return <LoadingScreen message="جاري التحقق من الصلاحيات..." />;
  }
  
  // Step 2: Error state
  if (error) {
    return <ErrorScreen error={error} />;
  }
  
  // Step 3: Permission check
  if (!hasPermission) {
    return <AccessDeniedScreen />;
  }
  
  // Step 4: Grant access
  return <>{children}</>;
}
```

**Hook: `hooks/usePermissions.ts`**

```typescript
export const usePermissions = () => {
  const pathname = usePathname();
  const { userData, loading, error, hasAccessToPage } = useUserStore();
  
  // Extract page slug from pathname
  const pageSlug = getPageSlug(pathname); // e.g., "properties", "analytics"
  
  // Map slug to permission name
  const permissionName = getPermissionName(pageSlug); // e.g., "properties.view"
  
  // Check if user has permission
  const hasPermission = hasAccessToPage(pageSlug);
  
  return { hasPermission, loading, userData, error };
};
```

**Permission Mapping:**
```typescript
const permissionMap = {
  "customers": "customers.view",
  "properties": "properties.view",
  "analytics": "analytics.view",
  "rental-management": "rental.management",
  "purchase-management": "purchase.management",
  "access-control": "access.control",
  "activity-logs": "activity.logs.view",
  "affiliate": "affiliate.view",
  "marketing": "marketing.view",
  "whatsapp-ai": "whatsapp.ai",
  // ... more mappings
};
```

**User Store: `store/userStore.ts`**

```typescript
export const useUserStore = create((set, get) => ({
  userData: null,
  loading: false,
  error: null,
  isInitialized: false,
  
  fetchUserData: async () => {
    // Fetch user data from API
    // Store permissions array
  },
  
  hasAccessToPage: (pageSlug: string) => {
    const { userData } = get();
    const permissions = userData?.permissions || [];
    const requiredPermission = getPermissionName(pageSlug);
    
    // Admin has access to everything
    if (userData?.account_type === "admin") return true;
    
    // Check if user has required permission
    return permissions.includes(requiredPermission);
  },
}));
```

**Permission Levels:**
- **Admin**: Full access to all modules
- **Manager**: Access based on assigned permissions
- **Editor**: Limited to content management
- **Viewer**: Read-only access

**Access Denied Screen:**
- Shows Shield icon
- Displays "ليس لديك صلاحية للوصول"
- Provides "Back" and "Go to Dashboard" buttons

---

## Sidebar Menu System

### Dynamic Menu Loading

**Store: `context/Store.js`**

```javascript
const useStore = create((set, get) => ({
  sidebarData: {
    mainNavItems: [],
    loading: false,
    error: null,
  },
  
  fetchSideMenus: async () => {
    set({ sidebarData: { ...get().sidebarData, loading: true, error: null } });
    
    try {
      // Fetch menu structure from backend API
      const response = await axiosInstance.get("/dashboard/menu");
      const menuItems = response.data.mainNavItems || [];
      
      set({
        sidebarData: {
          mainNavItems: menuItems,
          loading: false,
          error: null,
        },
      });
    } catch (error) {
      set({
        sidebarData: {
          ...get().sidebarData,
          loading: false,
          error: error.message,
        },
      });
    }
  },
}));
```

### Menu Item Filtering by Permission

**In EnhancedSidebar component:**

```typescript
const visibleMenuItems = mainNavItems.filter((item) => {
  // Admin sees all items
  if (userData?.account_type === "admin") return true;
  
  // Check if user has permission for this item
  const requiredPermission = getPermissionName(item.id);
  return userData?.permissions?.includes(requiredPermission);
});
```

### First-Time User Detection

```typescript
useEffect(() => {
  const hasVisitedBefore = localStorage.getItem("hasVisitedBefore");
  
  if (hasVisitedBefore) {
    setIsNewUser(false);
  } else {
    // Mark as visited after 3 days
    setTimeout(() => {
      localStorage.setItem("hasVisitedBefore", "true");
      setIsNewUser(false);
    }, 3 * 24 * 60 * 60 * 1000);
  }
}, []);
```

**Used for:**
- Guided tour activation
- Welcome messages
- Onboarding tips

---

## Data Flow

### Dashboard Page Load Flow

```
User visits /dashboard/properties
  ↓
Middleware checks locale
  ↓
Redirects to /ar/dashboard/properties (if needed)
  ↓
Dashboard Layout loads
  ↓
Validates domain (must be base domain)
  ↓
Validates token (useTokenValidation hook)
  ↓
If invalid → redirect to /login
  ↓
If valid → continue
  ↓
Enforces RTL direction
  ↓
Loads GTM tracking
  ↓
Checks permissions (PermissionWrapper)
  ↓
If no permission → show access denied
  ↓
If has permission → render page
  ↓
Page component loads
  ↓
PropertiesManagementPage component renders
  ↓
Fetches data from API using axiosInstance
  ↓
Displays property management interface
```

### API Request Flow

```
Dashboard page needs data
  ↓
Uses axiosInstance from @/lib/axiosInstance
  ↓
Request interceptor adds Bearer token automatically
  ↓
POST/GET/PUT/DELETE https://api.taearif.com/api/...
  ↓
Response interceptor handles errors
  ↓
If 401 (unauthorized) → redirect to login
  ↓
If success → return data to page
  ↓
Page updates UI with data
```

**See [AUTHENTICATION_SYSTEMS.md](./AUTHENTICATION_SYSTEMS.md) - Axios Integration section.**

---

## Common Patterns

### Pattern 1: Standard Dashboard Page

```typescript
// app/dashboard/[module]/page.tsx
import { ModulePage } from "@/components/[module]";

export const metadata = {
  title: "Module Title",
};

export default function Page() {
  return <ModulePage />;
}
```

### Pattern 2: CRUD Page with Sub-Routes

```typescript
// app/dashboard/properties/page.tsx - List view
import { PropertiesManagementPage } from "@/components/property/properties-management-page";

export default function Page() {
  return <PropertiesManagementPage />;
}

// app/dashboard/properties/add/page.tsx - Create
// app/dashboard/properties/[id]/edit/page.tsx - Edit
```

### Pattern 3: Multi-Section Module

```typescript
// app/dashboard/content/page.tsx - Hub page
// app/dashboard/content/about/page.tsx - Sub-section
// app/dashboard/content/gallery/page.tsx - Sub-section
// ... 14 sub-sections total
```

---

## Domain Validation

### Why Dashboard Blocks Tenant Domains

**Scenario: User on tenant domain tries to access dashboard**

```
User visits: tenant1.localhost:3000/ar/dashboard
  ↓
Dashboard layout loads
  ↓
Domain validation checks host: "tenant1.localhost"
  ↓
Detects subdomain (tenant domain)
  ↓
isValidDomain = false
  ↓
Loads TenantPageWrapper instead
  ↓
Dashboard blocked for security
```

**Reason:**
- Dashboard is for platform administration
- Tenant domains are for customer-facing websites
- Prevents confusion and security risks
- Keeps admin and tenant contexts separate

**Correct Access:**
- `localhost:3000/ar/dashboard` ✓
- `taearif.com/ar/dashboard` ✓
- `tenant1.localhost:3000/ar/dashboard` ✗

---

## RTL Enforcement

### Why Dashboard Forces RTL

**File: `app/dashboard/layout.tsx` (lines 86-111)**

```typescript
useEffect(() => {
  const style = document.createElement("style");
  style.id = "dashboard-rtl-styles";
  style.textContent = `
    html { direction: rtl !important; }
    body { direction: rtl !important; }
    * { direction: rtl !important; }
  `;
  document.head.appendChild(style);

  return () => {
    document.getElementById("dashboard-rtl-styles")?.remove();
  };
}, []);
```

**Reason:**
- Dashboard designed for Arabic interface
- All UI text in Arabic
- RTL layout required for proper display
- Complements locale system (always `/ar/` prefix)

**See [LOCALE_ROUTING_SYSTEM.md](./LOCALE_ROUTING_SYSTEM.md) for details.**

---

## GTM Integration

### Google Tag Manager in Dashboard

**File: `app/dashboard/layout.tsx` (line 138)**

```typescript
import GTMProvider from "@/components/GTMProvider2";

export default function DashboardLayout({ children }) {
  return (
    <GTMProvider containerId="GTM-KBL37C9T">
      {children}
    </GTMProvider>
  );
}
```

**Tracks:**
- Page views
- User interactions
- Form submissions
- Error events
- Performance metrics

**Container ID:** `GTM-KBL37C9T` (Dashboard-specific)

---

## Subscription & Package Management

### Free vs Paid Features

Dashboard checks user subscription status:

```typescript
const { is_free_plan, package_features } = useAuthStore(
  (state) => state.userData
);

// Conditional feature access
if (!is_free_plan || package_features.includes("advanced_analytics")) {
  // Show advanced features
}
```

**Stored in `userData` from AuthStore:**
- `is_free_plan` - Boolean
- `package_title` - "Free", "Pro", "Enterprise"
- `package_features` - Array of enabled features
- `project_limit_number` - Max projects
- `real_estate_limit_number` - Max properties

**See [AUTHENTICATION_SYSTEMS.md](./AUTHENTICATION_SYSTEMS.md) - Store Structure section.**

---

## ReCAPTCHA Integration

### Dashboard Login Protection

**See [RECAPTCHA_SYSTEM.md](./RECAPTCHA_SYSTEM.md) for complete implementation.**

**Login Page: `components/signin-up/login-page.tsx`**

```typescript
const handleLogin = async (e) => {
  e.preventDefault();
  
  // Execute reCAPTCHA
  const recaptchaToken = await executeRecaptcha("login");
  
  if (!recaptchaToken) {
    toast.error("فشل التحقق من reCAPTCHA");
    return;
  }
  
  // Login with reCAPTCHA token
  const result = await login(email, password, recaptchaToken);
  
  if (result.success) {
    router.push("/dashboard");
  }
};
```

**Backend Validation:**
```
Login request with reCAPTCHA token
  ↓
POST /api/login
  Body: { email, password, recaptcha_token }
  ↓
Backend validates reCAPTCHA with Google
  ↓
If valid → proceed with authentication
If invalid → reject login attempt
```

**Protection Against:**
- Brute force attacks
- Automated login attempts
- Bot traffic
- Account takeover attempts

**Implementation Details:**
- ReCAPTCHA v3 (invisible)
- Score-based validation
- Applied on login and register pages
- NOT applied within dashboard (only on entry)

---

## Live Editor Integration

### Dashboard to Live Editor Connection

**Navigation Path:**
```
Dashboard Sidebar → "Websites" menu item → Live Editor
```

**File: `components/mainCOMP/enhanced-sidebar.tsx`**

```typescript
const mainNavItems = [
  {
    id: "websites",
    label: "المواقع",
    path: "/live-editor",
    icon: Globe,
    isAPP: false, // Internal navigation
  },
  // ... other items
];
```

**Access Flow:**
```
User clicks "Websites" in sidebar
  ↓
Navigate to /ar/live-editor
  ↓
Middleware validates locale
  ↓
Dashboard layout NOT applied (different layout)
  ↓
Live editor layout loads
  ↓
User can edit website components
```

**Key Difference:**
- Dashboard uses `app/dashboard/layout.tsx`
- Live Editor uses `app/live-editor/layout.tsx`
- Separate layouts allow different UI/UX

**See [liveeditor.md](./liveeditor.md) for complete Live Editor documentation.**

### Dashboard Features Affecting Live Editor

**1. Website Management:**
- Create new website → available in live editor
- Website settings → affect live editor behavior
- Template selection → loads in live editor

**2. Content Management:**
- Content created in `/dashboard/content/*` → editable in live editor
- Blogs, galleries, testimonials → synchronized

**3. Domain Management:**
- Configure custom domain in dashboard
- Domain active → website accessible via custom domain

---

## API Endpoints Reference

### Dashboard-Specific APIs

**All endpoints use base URL:** `https://api.taearif.com/api`

**Authentication:** Bearer token in Authorization header

| Endpoint | Method | Purpose | Used By |
|----------|--------|---------|---------|
| `/user` | GET | Get user data + subscription | Token validation, dashboard load |
| `/dashboard/menu` | GET | Get sidebar menu structure | EnhancedSidebar |
| `/properties` | GET | List properties | Properties page |
| `/properties` | POST | Create property | Add property page |
| `/properties/{id}` | PUT | Update property | Edit property page |
| `/properties/{id}` | DELETE | Delete property | Properties management |
| `/projects` | GET/POST/PUT/DELETE | Project CRUD | Projects module |
| `/customers` | GET/POST/PUT/DELETE | Customer CRUD | Customers module |
| `/rental-contracts` | GET/POST/PUT/DELETE | Rental CRUD | Rental management |
| `/analytics/stats` | GET | Get analytics data | Analytics page |
| `/affiliate/*` | Various | Affiliate operations | Affiliate module |
| `/crm/*` | Various | CRM operations | CRM module |
| `/marketing/*` | Various | Marketing operations | Marketing module |

**See [AUTHENTICATION_SYSTEMS.md](./AUTHENTICATION_SYSTEMS.md) for auth API endpoints.**

---

## Store Architecture

### Primary Stores Used in Dashboard

#### 1. AuthStore (`context/AuthContext.js`)

**Purpose:** User authentication and session management

**State:**
```javascript
{
  UserIslogged: boolean,
  IsLoading: boolean,
  userData: {
    email, token, username, permissions,
    account_type, is_free_plan, package_features,
    // ... subscription data
  },
}
```

**Actions:**
- `login()`, `logout()`, `fetchUserData()`
- `loginWithToken()` (for OAuth)

**See [AUTHENTICATION_SYSTEMS.md](./AUTHENTICATION_SYSTEMS.md)**

#### 2. Store (`context/Store.js`)

**Purpose:** Dashboard UI state and data

**State:**
```javascript
{
  sidebarData: {
    mainNavItems: [],
    loading: boolean,
    error: null,
  },
  cart: {
    items: [],
  },
}
```

**Actions:**
- `fetchSideMenus()`
- `addToCart()`, `removeFromCart()`

#### 3. UserStore (`store/userStore.ts`)

**Purpose:** User data + permissions (separate from AuthStore)

**State:**
```typescript
{
  userData: {
    permissions: string[],
    account_type: string,
    // ... user details
  },
  loading: boolean,
  error: string | null,
  isInitialized: boolean,
}
```

**Actions:**
- `fetchUserData()`
- `hasAccessToPage(pageSlug: string)`
- `refreshUserData()`

**Used by:** `hooks/usePermissions.ts`

---

## Caching & Performance

### Component Caching

**See [componentsCachingSystem.md](./componentsCachingSystem.md) for details.**

**Not directly used in Dashboard pages** - caching primarily for tenant pages

### API Response Caching

**Dashboard does NOT cache API responses** - always fetches fresh data

**Reason:**
- Real-time data required for admin operations
- Frequent updates to properties, customers, etc.
- Prevents stale data issues

### Static Asset Caching

**File: `middleware.ts` (lines 223-241)**

```typescript
// Cache headers for static components (only when no tenantId)
if (
  !tenantId &&
  (pathname === "/" || pathname === "/solutions" || pathname === "/updates")
) {
  response.headers.set(
    "Cache-Control",
    "public, max-age=31536000, immutable"
  );
  response.headers.set("X-Component-Type", "taearif-static");
}
```

**Dashboard routes excluded from static caching**

---

## Error Handling

### Token Validation Errors

```typescript
// If token invalid or expired
if (tokenValidation.isValid === false) {
  clearAllCookies();
  router.push("/login");
}
```

### Permission Errors

```typescript
// If user lacks permission
if (!hasPermission) {
  return <AccessDeniedScreen />;
}
```

### API Request Errors

**Handled by axios interceptor:**

```typescript
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

**See [AUTHENTICATION_SYSTEMS.md](./AUTHENTICATION_SYSTEMS.md) - Axios Integration.**

### Network Errors

```typescript
// Caught in components
try {
  const data = await fetchDashboardData();
} catch (error) {
  if (error.networkError) {
    toast.error("خطأ في الاتصال بالخادم");
  }
}
```

---

## Metadata & SEO

### Dashboard Pages Metadata

**Dashboard pages have simple, static metadata:**

```typescript
// Example: app/dashboard/properties/page.tsx
export const metadata = {
  title: "إدارة العقارات",
};
```

**Why simple metadata?**
- Dashboard is admin interface (not public-facing)
- SEO not relevant (requires authentication)
- No dynamic metadata needed

**Contrast with tenant pages:**

**See [metaDataIntegration.md](./metaDataIntegration.md)**

Tenant pages have:
- Dynamic metadata based on tenantId
- Locale-specific titles (Arabic/English)
- OpenGraph tags
- SEO optimization

Dashboard pages:
- Static metadata
- Always Arabic
- No OpenGraph needed
- No SEO optimization

---

## Onboarding System

### First-Time User Flow

```
User registers → Login → Dashboard loads
  ↓
Check onboarding_completed flag
  ↓
If false → Redirect to /onboarding
  ↓
User completes onboarding
  ↓
Update user: onboarding_completed = true
  ↓
Redirect to /dashboard
  ↓
Show GuidedTour component
  ↓
User completes tour
  ↓
Mark hasVisitedBefore in localStorage
```

**File: `app/ClientLayout.tsx` (lines 161-193)**

```typescript
useEffect(() => {
  async function fetchUser() {
    if (isMounted && !IsLoading && UserIslogged && !onboardingCompleted) {
      if (pathname !== "/onboarding") {
        try {
          const response = await axiosInstance.get("/user");
          const completed = response.data.data.onboarding_completed;
          setOnboardingCompleted(completed);
          
          if (completed == undefined) {
            router.push("/onboarding");
          }
        } catch (error) {
          router.push("/onboarding");
        }
      }
    }
  }
  fetchUser();
}, [isMounted, IsLoading, UserIslogged, onboardingCompleted]);
```

**Onboarding Page:**
- Dual-mode: Works with and without tenant
- If on base domain → Taearif onboarding
- If on tenant domain → Tenant-specific onboarding

**See [MIDDLEWARE_TENANT_DETECTION.md](./MIDDLEWARE_TENANT_DETECTION.md) - Dual-Mode Pages.**

---

## Data Flow

### Dashboard Page Load Flow

```
User visits /dashboard/properties
  ↓
Middleware checks locale
  ↓
Redirects to /ar/dashboard/properties (if needed)
  ↓
Dashboard Layout loads
  ↓
Validates domain (must be base domain)
  ↓
Validates token (useTokenValidation hook)
  ↓
If invalid → redirect to /login
  ↓
If valid → continue
  ↓
Enforces RTL direction
  ↓
Loads GTM tracking
  ↓
Checks permissions (PermissionWrapper)
  ↓
If no permission → show access denied
  ↓
If has permission → render page
  ↓
Page component loads
  ↓
PropertiesManagementPage component renders
  ↓
Fetches data from API using axiosInstance
  ↓
Displays property management interface
```

### API Request Flow

```
Dashboard page needs data
  ↓
Uses axiosInstance from @/lib/axiosInstance
  ↓
Request interceptor adds Bearer token automatically
  ↓
POST/GET/PUT/DELETE https://api.taearif.com/api/...
  ↓
Response interceptor handles errors
  ↓
If 401 (unauthorized) → redirect to login
  ↓
If success → return data to page
  ↓
Page updates UI with data
```

**See [AUTHENTICATION_SYSTEMS.md](./AUTHENTICATION_SYSTEMS.md) - Axios Integration section.**

### Sidebar Menu Load Flow

```
Dashboard page loads
  ↓
EnhancedSidebar component mounts
  ↓
Checks if user token exists
  ↓
fetchSideMenus() called (Store.js)
  ↓
GET /api/dashboard/menu with Bearer token
  ↓
Response: { mainNavItems: [...] }
  ↓
Store in Zustand store
  ↓
Filter items by user permissions
  ↓
Render visible menu items
  ↓
Highlight active route
```

### Subscription Check Flow

```
Dashboard loads
  ↓
fetchUserData() called (AuthStore)
  ↓
GET /user endpoint
  ↓
Response includes subscription data:
  - is_free_plan
  - package_title
  - package_features
  - project_limit_number
  - real_estate_limit_number
  - days_remaining
  ↓
Store in userData
  ↓
Components check subscription:
  - if (is_free_plan && feature_locked) → show upgrade prompt
  - if (days_remaining < 7) → show renewal reminder
  ↓
Conditional feature rendering
```

---

## Summary

### Dashboard System Characteristics

**Access:**
- ✅ Requires Dashboard User authentication
- ✅ Base domain only (localhost, taearif.com)
- ✅ Arabic locale required (`/ar/`)
- ✅ RTL direction enforced
- ✅ Valid session token
- ❌ Not accessible on tenant domains
- ❌ Not accessible with Owner authentication
- ❌ Not accessible in English locale

**Modules:** 26 main modules covering:
- Property management
- Customer management
- Content management
- CRM
- Analytics
- Marketing
- Affiliate program
- Rental operations
- Purchase transactions
- Access control
- Settings

**Related Systems:**
- Dashboard User Authentication
- Locale routing (Arabic RTL)
- Middleware tenant detection
- Permission system
- GTM tracking
- Subscription management

**Security Layers:**
1. Middleware locale enforcement
2. Dashboard layout domain validation
3. Dashboard layout token validation
4. ClientLayout authentication check
5. PermissionWrapper role-based access
6. API request authentication (Bearer token)

---

## Quick Reference

### Access Requirements Checklist

- [ ] Dashboard User logged in (not Owner)
- [ ] On base domain (not tenant subdomain/custom domain)
- [ ] URL has `/ar/` locale prefix
- [ ] Valid session token in cookie
- [ ] Active subscription (for some features)
- [ ] Required permissions (for restricted pages)

### Related Documentation

1. **[AUTHENTICATION_SYSTEMS.md](./AUTHENTICATION_SYSTEMS.md)** - Dashboard User auth system
2. **[LOCALE_ROUTING_SYSTEM.md](./LOCALE_ROUTING_SYSTEM.md)** - Arabic locale enforcement
3. **[MIDDLEWARE_TENANT_DETECTION.md](./MIDDLEWARE_TENANT_DETECTION.md)** - Domain validation
4. **[COMPONENT_LOADING_SYSTEM.md](./COMPONENT_LOADING_SYSTEM.md)** - Component architecture
5. **[RECAPTCHA_SYSTEM.md](./RECAPTCHA_SYSTEM.md)** - Login protection

### Example URLs

**Valid:**
- `localhost:3000/ar/dashboard`
- `localhost:3000/ar/dashboard/properties`
- `taearif.com/ar/dashboard/analytics`

**Invalid (will redirect or block):**
- `localhost:3000/dashboard` → redirects to `/ar/dashboard`
- `localhost:3000/en/dashboard` → redirects to `/ar/dashboard`
- `tenant1.localhost:3000/ar/dashboard` → blocked (tenant domain)
- `custom-domain.com/ar/dashboard` → blocked (custom domain)

---

## Debugging Dashboard Issues

### Common Issues & Solutions

#### Issue 1: "Redirected to login constantly"

**Symptoms:**
- Can't access dashboard pages
- Immediately redirected to login
- Login seems successful but redirect happens again

**Causes:**
- Token expired or invalid
- Cookie not being set properly
- Token validation failing

**Debug Steps:**
```javascript
// 1. Check token in localStorage
const user = JSON.parse(localStorage.getItem("user"));
console.log("User token:", user?.token);

// 2. Check authToken cookie
const authCookie = document.cookie.split(';').find(c => c.includes('authToken'));
console.log("Auth cookie:", authCookie);

// 3. Check AuthStore state
console.log("UserIslogged:", useAuthStore.getState().UserIslogged);

// 4. Manually validate token
const response = await fetch("https://api.taearif.com/api/user", {
  headers: { Authorization: `Bearer ${user.token}` }
});
console.log("Token validation:", response.status);
```

**Solutions:**
- Clear all cookies and localStorage
- Re-login
- Check if backend API is accessible
- Verify SECRET_KEY environment variable

#### Issue 2: "Dashboard shows on tenant domain"

**Symptoms:**
- Can access `/ar/dashboard` on tenant1.localhost:3000
- Dashboard loads but may have issues

**Cause:**
- Domain validation not working
- Layout validation bypassed

**Debug Steps:**
```javascript
// Check domain validation
const hostname = window.location.hostname;
console.log("Current hostname:", hostname);

const isBaseDomain = hostname === "localhost" || hostname === "taearif.com";
console.log("Is base domain:", isBaseDomain);
```

**Solution:**
- Dashboard should only work on base domain
- If accessing from tenant domain → blocked by layout validation
- Check `app/dashboard/layout.tsx` domain validation (lines 47-84)

#### Issue 3: "Menu items not showing in sidebar"

**Symptoms:**
- Sidebar loads but shows no menu items
- Loading spinner stuck
- Empty menu

**Causes:**
- API request failing
- No token in request
- Backend menu endpoint down
- Permission filtering hiding all items

**Debug Steps:**
```javascript
// 1. Check Store state
const { sidebarData } = useStore.getState();
console.log("Sidebar data:", sidebarData);

// 2. Check if fetchSideMenus was called
console.log("Loading:", sidebarData.loading);
console.log("Error:", sidebarData.error);

// 3. Check permissions
const { userData } = useAuthStore.getState();
console.log("User permissions:", userData?.permissions);
console.log("Account type:", userData?.account_type);
```

**Solutions:**
- Ensure user has valid token
- Check backend API `/dashboard/menu` endpoint
- Verify user has at least one permission
- Admin users should see all items regardless

#### Issue 4: "Permission denied on all pages"

**Symptoms:**
- Can login successfully
- Dashboard loads
- Every page shows "ليس لديك صلاحية للوصول"

**Causes:**
- User has no permissions assigned
- PermissionWrapper always returning false
- UserStore not fetching data

**Debug Steps:**
```javascript
// 1. Check UserStore
const { userData, hasAccessToPage } = useUserStore.getState();
console.log("UserStore data:", userData);
console.log("Permissions:", userData?.permissions);

// 2. Test permission check
console.log("Has access to properties:", hasAccessToPage("properties"));

// 3. Check account type
console.log("Account type:", userData?.account_type);
// Admin should bypass all permission checks
```

**Solutions:**
- Contact admin to assign permissions
- Verify user role in database
- Check if account_type is "admin"
- Ensure UserStore is fetching data

#### Issue 5: "RTL not working / Layout broken"

**Symptoms:**
- Dashboard shows LTR layout
- Text alignment wrong
- Layout looks broken

**Causes:**
- RTL CSS not applied
- Dashboard layout not loading
- Conflicting CSS

**Debug Steps:**
```javascript
// Check HTML direction
console.log("HTML dir:", document.documentElement.dir);
console.log("Body dir:", document.body.dir);

// Check if RTL style exists
const rtlStyle = document.getElementById("dashboard-rtl-styles");
console.log("RTL style element:", rtlStyle);
```

**Solutions:**
- Refresh page
- Check `app/dashboard/layout.tsx` RTL enforcement (lines 86-111)
- Ensure on `/ar/` locale path
- Clear browser cache

#### Issue 6: "Subscription features not working"

**Symptoms:**
- Feature shows as locked even with paid plan
- Incorrect limits shown
- Upgrade prompts appearing incorrectly

**Causes:**
- Subscription data not fetched
- is_free_plan incorrectly set
- package_features array empty

**Debug Steps:**
```javascript
const { userData } = useAuthStore.getState();
console.log("Is free plan:", userData?.is_free_plan);
console.log("Package title:", userData?.package_title);
console.log("Package features:", userData?.package_features);
console.log("Project limit:", userData?.project_limit_number);
console.log("Property limit:", userData?.real_estate_limit_number);
console.log("Days remaining:", userData?.days_remaining);
```

**Solutions:**
- Call `fetchUserData()` to refresh subscription data
- Verify backend returns correct subscription info
- Check if subscription expired
- Contact support if data is incorrect

---

## Testing Dashboard Locally

### Setup Requirements

**1. Environment Variables:**
```env
NEXT_PUBLIC_Backend_URL=https://api.taearif.com/api
NEXT_PUBLIC_PRODUCTION_DOMAIN=taearif.com
NEXT_PUBLIC_LOCAL_DOMAIN=localhost
NODE_ENV=development
SECRET_KEY=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_SECRET=your-nextauth-secret
```

**2. Run Development Server:**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

**3. Access Dashboard:**
```
http://localhost:3000/ar/dashboard
```

### Test User Accounts

**Create test accounts with different roles:**

**Admin Account:**
- Full access to all modules
- Can manage permissions
- Can access all features

**Manager Account:**
- Limited permissions
- Can access assigned modules
- Cannot manage users

**Editor Account:**
- Content management only
- No access to settings
- No access to analytics

**Test Permission System:**
```javascript
// Login as each user type
// Verify sidebar shows only permitted items
// Try accessing restricted pages
// Verify PermissionWrapper blocks access correctly
```

---

## Performance Considerations

### Initial Load Time

**Dashboard loads multiple resources:**
1. User authentication validation
2. Subscription data fetch
3. Sidebar menu fetch
4. GTM scripts
5. Component assets

**Optimization:**
- Token validation runs in parallel with component load
- Sidebar menu fetched after initial render
- GTM loaded with `afterInteractive` strategy
- Components lazy-loaded where possible

### Memory Management

**Zustand stores persist in memory:**
- AuthStore - user session data
- Store - UI state and menu
- UserStore - permissions and access

**Cleanup on logout:**
```typescript
logout: async () => {
  // Clear all stores
  set({ UserIslogged: false, userData: null });
  
  // Clear localStorage
  localStorage.removeItem("user");
  
  // Clear cookies
  // (handled by /api/user/logout)
  
  // Redirect
  window.location.href = "/login";
}
```

---

## Advanced Features

### Multi-Website Management

**For users with multiple tenant websites:**

**Sidebar shows website switcher:**
```typescript
const websites = userData?.websites || [];

<Select value={currentWebsite} onValueChange={switchWebsite}>
  {websites.map(site => (
    <SelectItem value={site.id}>{site.name}</SelectItem>
  ))}
</Select>
```

**When user switches website:**
- Update context
- Refresh data for new website
- Live editor loads new website

### Notification System

**DashboardHeader shows notifications:**
- New property requests
- Rental payment reminders
- Contract expirations
- System alerts

**Fetched from:** `/api/notifications`

**Updated in real-time** (polling or websockets)

### Search Functionality

**DashboardHeader includes global search:**
- Search properties
- Search customers
- Search projects
- Search content

**Keyboard shortcut:** `Cmd/Ctrl + K`

---

## Dashboard vs Tenant Website Separation

### Architecture Separation

**Dashboard System:**
- **Domain:** Base domain only (localhost, taearif.com)
- **Purpose:** Platform administration
- **Users:** Platform users with dashboard accounts
- **Authentication:** Dashboard User system
- **Routes:** `/dashboard/*`
- **Layout:** `app/dashboard/layout.tsx`
- **Language:** Arabic only (RTL enforced)
- **Components:** Admin UI components

**Tenant Website System:**
- **Domain:** Subdomain or custom domain (tenant1.localhost, custom.com)
- **Purpose:** Customer-facing websites
- **Users:** Website visitors + property owners
- **Authentication:** Owner system (for `/owner/*` routes only)
- **Routes:** `/`, `/about-us`, `/for-rent`, `/for-sale`, etc.
- **Layout:** `app/layout.tsx`
- **Language:** Arabic + English (locale-based)
- **Components:** Tenant UI components (dynamic loading)

**See [MIDDLEWARE_TENANT_DETECTION.md](./MIDDLEWARE_TENANT_DETECTION.md) for tenant detection.**

### How They Interact

**1. Website Creation in Dashboard:**
```
Admin logs into Dashboard
  ↓
Creates new website in /dashboard/settings
  ↓
Assigns subdomain: "mycompany"
  ↓
Website saved with username: "mycompany"
  ↓
Website accessible at: mycompany.localhost:3000
```

**2. Content Synchronization:**
```
Admin edits content in /dashboard/content/testimonials
  ↓
Content saved to database for tenant
  ↓
Tenant website fetches content via tenantStore
  ↓
Testimonials component displays updated content
  ↓
Changes visible immediately on tenant website
```

**3. Property Listing Flow:**
```
Admin adds property in /dashboard/properties
  ↓
Property saved with tenant_id = user's tenant
  ↓
Property appears on tenant website automatically
  ↓
Visible in /for-sale or /for-rent pages
  ↓
Customer can view and inquire
  ↓
Inquiry sent to /dashboard/property-requests
```

**See [COMPONENT_LOADING_SYSTEM.md](./COMPONENT_LOADING_SYSTEM.md) for component loading on tenant sites.**

### Key Architectural Principle

**COMPLETE SEPARATION:**
- Dashboard and Tenant systems share database
- Dashboard manages data
- Tenant websites display data
- No direct component sharing
- Different layouts, different routing, different authentication
- Linked only through data layer (API)

**Example:**
- Dashboard user cannot access `/owner/*` routes (different auth system)
- Owner cannot access `/dashboard/*` routes (different auth system)
- Tenant visitor cannot access dashboard (no authentication)
- Dashboard user manages content that tenant website displays

**See [AUTHENTICATION_SYSTEMS.md](./AUTHENTICATION_SYSTEMS.md) for complete auth separation.**

---

## Translation System in Dashboard

### Editor Sidebar Translations

**See [editorSidebarTranslationSystem.md](./editorSidebarTranslationSystem.md) for details.**

**When accessing Live Editor from Dashboard:**

```
Dashboard Sidebar → Click "Websites" → Navigate to /ar/live-editor
  ↓
Live Editor loads
  ↓
Editor sidebar uses translation system
  ↓
Reads from lib/i18n/locales/ar.json
  ↓
Displays Arabic labels for components, settings, etc.
```

**Translation Keys Used:**
```json
{
  "editor": {
    "title": "محرر الموقع المباشر",
    "components": "المكونات",
    "settings": "الإعدادات",
    "save_changes": "حفظ التغييرات"
  }
}
```

**Store: `context-liveeditor/editorI18nStore.ts`**

```typescript
export const useEditorI18nStore = create((set, get) => ({
  locale: "ar",
  t: (key: string) => {
    const translations = get().translations;
    return translations[locale][key] || key;
  },
}));
```

**See [LOCALE_ROUTING_SYSTEM.md](./LOCALE_ROUTING_SYSTEM.md) for locale system.**

### Dashboard UI Translations

**Dashboard uses hardcoded Arabic text:**
- No translation system needed (Arabic-only)
- All labels in Arabic
- RTL enforced globally

**Different from:**
- Tenant websites (support Arabic + English)
- Live Editor sidebar (uses translation system)

---

## Default Data System

### Dashboard Default Data

**See [ifDataDoesntExistPutTheDefaultDataOnTheEditorSidebar.md](./ifDataDoesntExistPutTheDefaultDataOnTheEditorSidebar.md)**

**When user accesses Live Editor from Dashboard:**

```
User clicks "Edit Website" in sidebar
  ↓
Navigate to /ar/live-editor
  ↓
editorStore checks for component data
  ↓
If no data exists:
  ↓
  Load default data from editorStoreFunctions
  ↓
  Display default components in sidebar
  ↓
  User can edit and save
  ↓
  Next load will use saved data instead of defaults
```

**Default Data Sources:**
- `context-liveeditor/editorStoreFunctions/headerFunctions.ts` → Header defaults
- `context-liveeditor/editorStoreFunctions/heroFunctions.ts` → Hero defaults
- `context-liveeditor/editorStoreFunctions/footerFunctions.ts` → Footer defaults
- ... (one for each component type)

**See [COMPONENT_LOADING_SYSTEM.md](./COMPONENT_LOADING_SYSTEM.md) for complete component system.**

---

**Last Updated:** Based on current codebase analysis  
**Maintained By:** Architecture documentation system

