# Dashboard Related Systems

## Overview

Links to external system documentation and how they integrate with the Dashboard.

---

## Core System Dependencies

### 1. Authentication Systems

**File:** [../AUTHENTICATION_SYSTEMS.md](../AUTHENTICATION_SYSTEMS.md)

**What it covers:**
- TWO separate auth systems (Dashboard vs Owner)
- Dashboard User authentication flow
- Owner authentication flow
- OAuth integration (NextAuth + Google)
- Token storage (httpOnly cookies)
- Session management
- Login/logout flows

**Relevant to Dashboard:**
- Dashboard uses **Dashboard User system**
- AuthStore implementation
- Cookie: `authToken` (httpOnly)
- localStorage: `user`
- OAuth callback handling

**Key Takeaway:** Dashboard and Owner systems are COMPLETELY separate.

---

### 2. Locale Routing System

**File:** [../LOCALE_ROUTING_SYSTEM.md](../LOCALE_ROUTING_SYSTEM.md)

**What it covers:**
- Locale prefixing (`/ar/`, `/en/`)
- Middleware locale handling
- Redirect vs Rewrite
- RTL/LTR direction switching
- I18n provider system
- Language switcher

**Relevant to Dashboard:**
- ALL dashboard routes require `/ar/` prefix
- `/dashboard` → redirects to `/ar/dashboard`
- `/en/dashboard` → redirects to `/ar/dashboard`
- RTL enforced in dashboard layout
- No English support for dashboard

**Key Takeaway:** Dashboard is Arabic-only with automatic locale enforcement.

---

### 3. Middleware & Tenant Detection

**File:** [../MIDDLEWARE_TENANT_DETECTION.md](../MIDDLEWARE_TENANT_DETECTION.md)

**What it covers:**
- Subdomain detection
- Custom domain detection
- Base domain vs tenant domain
- Reserved words
- x-tenant-id header
- Tenant-only vs Non-tenant pages

**Relevant to Dashboard:**
- Dashboard is **Non-Tenant Only**
- Accessible ONLY on base domain (localhost, taearif.com)
- Blocked on tenant domains (tenant1.localhost, custom.com)
- Dashboard layout validates domain type
- If tenantId exists → block dashboard access

**Key Takeaway:** Dashboard cannot be accessed from tenant domains.

---

### 4. Component Loading System

**File:** [../COMPONENT_LOADING_SYSTEM.md](../COMPONENT_LOADING_SYSTEM.md)

**What it covers:**
- Dynamic component loading (lazy imports)
- Component variants (hero1, hero2, etc.)
- ComponentsList registry
- Default data system
- Skeleton loading states

**Relevant to Dashboard:**
- Dashboard uses **standard imports** (not lazy loading)
- Components imported directly from `@/components/`
- No dynamic component loading in dashboard
- Different from tenant pages (which use dynamic loading)

**Key Takeaway:** Dashboard uses simple imports, tenant pages use dynamic loading.

---

### 5. ReCAPTCHA System

**File:** [../RECAPTCHA_SYSTEM.md](../RECAPTCHA_SYSTEM.md)

**What it covers:**
- ReCAPTCHA v3 implementation
- Client-side integration
- Server-side validation
- Score-based protection
- reCAPTCHA providers

**Relevant to Dashboard:**
- ReCAPTCHA used on `/login` page
- Protects dashboard from brute force
- Required for `AuthStore.login()` function
- NOT used within dashboard pages (only entry point)

**Key Takeaway:** ReCAPTCHA protects login, not individual dashboard pages.

---

## Optional System Integrations

### 6. Metadata Integration

**File:** [../metaDataIntegration.md](../metaDataIntegration.md)

**What it covers:**
- Dynamic metadata generation
- Locale-based meta tags
- OpenGraph tags
- SEO optimization
- getMetaForSlugServer()

**Relevant to Dashboard:**
- Dashboard pages have **simple static metadata**
- No dynamic metadata (not public-facing)
- No SEO needed (requires authentication)
- Example: `export const metadata = { title: "Analytics" }`

**Key Difference:**
- Tenant pages: Dynamic, SEO-optimized metadata
- Dashboard pages: Static, simple metadata

---

### 7. Component Caching System

**File:** [../componentsCachingSystem.md](../componentsCachingSystem.md)

**What it covers:**
- Component data caching
- Default data fallbacks
- EditorStore caching
- Tenant data caching

**Relevant to Dashboard:**
- Dashboard does NOT use component caching
- UserStore has 5-minute caching (different purpose)
- No localStorage caching for components
- Dashboard always fetches fresh data

**Key Difference:**
- Tenant pages: Component data cached
- Dashboard pages: Fresh API data always

---

### 8. Editor Sidebar Translation System

**File:** [../editorSidebarTranslationSystem.md](../editorSidebarTranslationSystem.md)

**What it covers:**
- Live Editor translations
- editorI18nStore
- Translation files (ar.json, en.json)
- Component label translations

**Relevant to Dashboard:**
- Used when dashboard user accesses `/live-editor`
- Dashboard itself uses hardcoded Arabic text
- No translation system for dashboard UI

**Key Takeaway:** Translations only for Live Editor, not dashboard.

---

### 9. Default Data System

**File:** [../ifDataDoesntExistPutTheDefaultDataOnTheEditorSidebar.md](../ifDataDoesntExistPutTheDefaultDataOnTheEditorSidebar.md)

**What it covers:**
- Default component data
- editorStoreFunctions
- Fallback data loading
- ComponentStructure

**Relevant to Dashboard:**
- Used when dashboard user accesses Live Editor
- Dashboard pages don't use default data system
- Live Editor loads defaults if no data exists

**Key Takeaway:** Default data for Live Editor, not dashboard modules.

---

### 10. Live Editor System

**File:** [../liveeditor.md](../liveeditor.md)

**What it covers:**
- Live Editor architecture
- EditorStore
- Component editing
- Preview system
- Save functionality

**Relevant to Dashboard:**
- Accessed via dashboard sidebar → "Websites" menu item
- Route: `/ar/live-editor`
- Different layout from dashboard
- Content created in `/dashboard/content/*` → editable in Live Editor

**Integration Points:**
1. Dashboard sidebar → Live Editor navigation
2. Dashboard content → Live Editor components
3. Dashboard settings → Live Editor configuration

---

## System Integration Map

```
┌─────────────────────────────────────────────────────────┐
│                   Dashboard System                       │
│  (BASE DOMAIN ONLY: localhost, taearif.com)            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Uses:                                                   │
│  ✅ Dashboard User Authentication                       │
│  ✅ Locale Routing (/ar/ prefix)                        │
│  ✅ Middleware (locale, NOT tenant detection)           │
│  ✅ ReCAPTCHA (login protection)                        │
│  ✅ Translation System (for Live Editor only)           │
│  ✅ Default Data (for Live Editor only)                 │
│                                                          │
│  Does NOT use:                                           │
│  ❌ Component Loading System (tenant-specific)          │
│  ❌ Component Caching (tenant-specific)                 │
│  ❌ Metadata Integration (public pages only)            │
│  ❌ Owner Authentication                                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
         │                                    │
         │                                    │
         ↓                                    ↓
┌──────────────────┐           ┌─────────────────────────┐
│   Live Editor    │           │   Tenant Website        │
│   /live-editor   │           │   (subdomains/custom)   │
├──────────────────┤           ├─────────────────────────┤
│ Uses:            │           │ Uses:                   │
│ ✅ Component     │           │ ✅ Component Loading   │
│   Loading        │           │ ✅ Metadata Integration│
│ ✅ Translations  │           │ ✅ Tenant Detection    │
│ ✅ Default Data  │           │ ✅ Locale Routing      │
│                  │           │ ✅ Owner Auth (/owner) │
└──────────────────┘           └─────────────────────────┘
```

---

## When to Read Each Doc

### Debugging Dashboard Issues

**Login problems?**  
→ Read [../AUTHENTICATION_SYSTEMS.md](../AUTHENTICATION_SYSTEMS.md)  
→ Read [AUTHENTICATION.md](./AUTHENTICATION.md)

**Permission denied errors?**  
→ Read [AUTHENTICATION.md](./AUTHENTICATION.md) - Permission section  
→ Read [CORE_INFRASTRUCTURE.md](./CORE_INFRASTRUCTURE.md) - UserStore

**Locale/URL issues?**  
→ Read [../LOCALE_ROUTING_SYSTEM.md](../LOCALE_ROUTING_SYSTEM.md)

**Domain access problems?**  
→ Read [../MIDDLEWARE_TENANT_DETECTION.md](../MIDDLEWARE_TENANT_DETECTION.md)

**API call failures?**  
→ Read [CORE_INFRASTRUCTURE.md](./CORE_INFRASTRUCTURE.md) - axiosInstance

**Store/state issues?**  
→ Read [CORE_INFRASTRUCTURE.md](./CORE_INFRASTRUCTURE.md) - All stores

### Implementing New Features

**New dashboard module?**  
→ Read [MODULES.md](./MODULES.md) - Common patterns  
→ Read [AUTHENTICATION.md](./AUTHENTICATION.md) - Permission setup

**Integrating with tenant website?**  
→ Read [DATA_FLOWS.md](./DATA_FLOWS.md) - Sync flows  
→ Read [../COMPONENT_LOADING_SYSTEM.md](../COMPONENT_LOADING_SYSTEM.md)

**Working with Live Editor?**  
→ Read [../liveeditor.md](../liveeditor.md)  
→ Read [DATA_FLOWS.md](./DATA_FLOWS.md) - Live Editor integration

**Adding permissions?**  
→ Read [AUTHENTICATION.md](./AUTHENTICATION.md) - Permission system  
→ Read [CORE_INFRASTRUCTURE.md](./CORE_INFRASTRUCTURE.md) - UserStore

---

## External Documentation Quick Reference

| System | File | Dashboard Usage |
|--------|------|----------------|
| **Auth** | `AUTHENTICATION_SYSTEMS.md` | Dashboard User auth flow |
| **Locale** | `LOCALE_ROUTING_SYSTEM.md` | `/ar/` prefix requirement |
| **Middleware** | `MIDDLEWARE_TENANT_DETECTION.md` | Domain blocking |
| **Components** | `COMPONENT_LOADING_SYSTEM.md` | NOT used (standard imports) |
| **ReCAPTCHA** | `RECAPTCHA_SYSTEM.md` | Login protection |
| **Metadata** | `metaDataIntegration.md` | NOT used (static metadata) |
| **Caching** | `componentsCachingSystem.md` | NOT used |
| **Translations** | `editorSidebarTranslationSystem.md` | Live Editor only |
| **Defaults** | `ifDataDoesntExist...md` | Live Editor only |
| **Live Editor** | `liveeditor.md` | Accessed from dashboard |

---

**See Also:**
- [README.md](./README.md) - Documentation index
- [CORE_INFRASTRUCTURE.md](./CORE_INFRASTRUCTURE.md) - Core systems
- [AUTHENTICATION.md](./AUTHENTICATION.md) - Auth details
- [MODULES.md](./MODULES.md) - All modules
- [DATA_FLOWS.md](./DATA_FLOWS.md) - Data flows
- [DEBUGGING.md](./DEBUGGING.md) - Troubleshooting

