# Dashboard System Documentation

## Overview

The **Dashboard System** is the primary administrative interface for platform users to manage their websites, properties, customers, and business operations.

**Key Characteristics:**
- **Access**: Requires Dashboard User Authentication
- **Routes**: All routes under `/dashboard/*`
- **Language**: Arabic RTL enforced
- **Domain**: Only accessible on base domain (localhost, taearif.com)
- **Protection**: Multi-layer security (token + middleware + permissions)

---

## Documentation Structure

This documentation is split into focused files for better maintainability and faster AI comprehension:

### 1. **[CORE_INFRASTRUCTURE.md](./CORE_INFRASTRUCTURE.md)**
**What:** Core system components and stores  
**Covers:**
- `lib/axiosInstance.js` - HTTP client with token injection
- `context/AuthContext.js` - Dashboard authentication store
- `context/Store.js` - Modular dashboard stores
- `store/userStore.ts` - Permissions store
- `context/OwnerAuthContext.js` - Owner system (for comparison)

**Read when:** Working with authentication, API calls, or store management

---

### 2. **[AUTHENTICATION.md](./AUTHENTICATION.md)**
**What:** Authentication flows and access control  
**Covers:**
- Protection layers (middleware, layout, ClientLayout)
- Token validation system
- Permission wrapper
- OAuth integration
- ReCAPTCHA integration

**Read when:** Debugging auth issues, implementing security features

---

### 3. **[MODULES.md](./MODULES.md)**
**What:** All 26 dashboard modules in detail  
**Covers:**
- Properties, Projects, Buildings
- Customers, CRM, Messages
- Content Management (14 sub-sections)
- Analytics, Marketing, Affiliate
- Rental & Purchase Management
- Settings, Templates, Apps

**Read when:** Working on specific dashboard module functionality

---

### 4. **[DATA_FLOWS.md](./DATA_FLOWS.md)**
**What:** Data flows and system interactions  
**Covers:**
- Page load flows
- API request flows
- Subscription checks
- Module interconnections
- Dashboard ↔ Live Editor integration
- Dashboard ↔ Tenant website sync

**Read when:** Understanding how data moves through the system

---

### 5. **[DEBUGGING.md](./DEBUGGING.md)**
**What:** Troubleshooting and testing  
**Covers:**
- Common issues and solutions
- Debug commands
- Testing locally
- Performance considerations
- Error handling

**Read when:** Debugging issues or setting up development environment

---

### 6. **[RELATED_SYSTEMS.md](./RELATED_SYSTEMS.md)**
**What:** Links to other system documentation  
**Covers:**
- Authentication systems
- Locale routing
- Middleware & tenant detection
- Component loading
- ReCAPTCHA system
- Metadata integration

**Read when:** Need to understand how dashboard integrates with other systems

---

## Quick Access Guide

### "I want to understand..."

**...how authentication works**  
→ Read [AUTHENTICATION.md](./AUTHENTICATION.md)

**...what stores are available**  
→ Read [CORE_INFRASTRUCTURE.md](./CORE_INFRASTRUCTURE.md)

**...specific module functionality**  
→ Read [MODULES.md](./MODULES.md)

**...how data flows**  
→ Read [DATA_FLOWS.md](./DATA_FLOWS.md)

**...why something is not working**  
→ Read [DEBUGGING.md](./DEBUGGING.md)

**...integration with other systems**  
→ Read [RELATED_SYSTEMS.md](./RELATED_SYSTEMS.md)

---

## Access Requirements Checklist

Before accessing dashboard pages, verify:

- [ ] Dashboard User logged in (not Owner)
- [ ] On base domain (localhost or taearif.com)
- [ ] URL has `/ar/` locale prefix
- [ ] Valid session token in cookie
- [ ] Active subscription (for some features)
- [ ] Required permissions (for restricted pages)

---

## Example URLs

**✅ Valid:**
- `localhost:3000/ar/dashboard`
- `localhost:3000/ar/dashboard/properties`
- `taearif.com/ar/dashboard/analytics`

**❌ Invalid (will redirect or block):**
- `localhost:3000/dashboard` → redirects to `/ar/dashboard`
- `localhost:3000/en/dashboard` → redirects to `/ar/dashboard`
- `tenant1.localhost:3000/ar/dashboard` → blocked (tenant domain)

---

## Dashboard Modules Quick Reference

| Module | Route | Purpose |
|--------|-------|---------|
| **Properties** | `/dashboard/properties` | Property listings CRUD |
| **Projects** | `/dashboard/projects` | Real estate projects |
| **Buildings** | `/dashboard/buildings` | Building management |
| **Customers** | `/dashboard/customers` | Customer database |
| **CRM** | `/dashboard/crm` | Customer relationship |
| **Analytics** | `/dashboard/analytics` | Business metrics |
| **Content** | `/dashboard/content` | 14 content sections |
| **Rental Mgmt** | `/dashboard/rental-management` | Rental operations |
| **Purchase Mgmt** | `/dashboard/purchase-management` | Purchase transactions |
| **Affiliate** | `/dashboard/affiliate` | Affiliate program |
| **Marketing** | `/dashboard/marketing` | Marketing campaigns |
| **Messages** | `/dashboard/messages` | Internal messaging |
| **Apps** | `/dashboard/apps` | App integrations |
| **WhatsApp AI** | `/dashboard/whatsapp-ai` | WhatsApp automation |
| **Templates** | `/dashboard/templates` | Website templates |
| **Settings** | `/dashboard/settings` | Dashboard settings |
| **Access Control** | `/dashboard/access-control` | Roles & permissions |
| **Activity Logs** | `/dashboard/activity-logs` | Audit logs |
| **Property Requests** | `/dashboard/property-requests` | Customer inquiries |
| **Matching** | `/dashboard/matching` | Property matching |
| **Blogs** | `/dashboard/blogs` | Blog management |

---

## System Architecture Summary

```
┌─────────────────────────────────────────────────────────┐
│                    Dashboard System                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Auth       │  │   Stores     │  │   API        │ │
│  │   System     │←→│   (Zustand)  │←→│   Client     │ │
│  │  (AuthStore) │  │   (Store)    │  │  (axios)     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│         ↓                  ↓                  ↓         │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Dashboard Layout (RTL + Validation)      │  │
│  └──────────────────────────────────────────────────┘  │
│         ↓                                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Permission Wrapper (Access Control)      │  │
│  └──────────────────────────────────────────────────┘  │
│         ↓                                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Dashboard Modules (26)              │  │
│  │  Properties│Analytics│CRM│Content│Rental│...    │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Related External Systems

- **[../AUTHENTICATION_SYSTEMS.md](../AUTHENTICATION_SYSTEMS.md)** - Authentication architecture
- **[../LOCALE_ROUTING_SYSTEM.md](../LOCALE_ROUTING_SYSTEM.md)** - Locale handling
- **[../MIDDLEWARE_TENANT_DETECTION.md](../MIDDLEWARE_TENANT_DETECTION.md)** - Domain validation
- **[../COMPONENT_LOADING_SYSTEM.md](../COMPONENT_LOADING_SYSTEM.md)** - Component system
- **[../RECAPTCHA_SYSTEM.md](../RECAPTCHA_SYSTEM.md)** - Security protection

---

**Last Updated:** Based on current codebase analysis  
**Maintained By:** Architecture documentation system

