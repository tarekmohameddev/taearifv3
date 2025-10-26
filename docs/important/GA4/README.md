# GA4 Analytics System Documentation

## Overview

The GA4 Analytics System is designed to track user interactions across a **multi-tenant website builder platform**. Each tenant (client) has their own website (subdomain or custom domain), and the system provides comprehensive analytics with tenant-specific segmentation.

## Purpose

1. **Track tenant-specific analytics** - Distinguish between different tenants' websites
2. **Measure user engagement** - Page views, property views, project views, form submissions
3. **Provide business insights** - Which tenants get the most traffic, which properties are popular
4. **Integrate with existing architecture** - Work seamlessly with middleware tenant detection system

## Key Characteristics

- **Multi-Tenant Architecture**: Each tenant has a unique `tenant_id` tracked as a custom dimension
- **Dual Tracking System**: Both GA4 (for detailed event tracking) and GTM (for tag management)
- **Domain-Aware**: Different tracking behavior for base domain, subdomains, and custom domains
- **Tenant-Specific**: Each event includes `tenant_id` as a parameter for filtering
- **Server-Side Tenant Detection**: Uses Next.js middleware headers to extract tenant information
- **Client-Side Tracking**: All GA4 events are fired from client components
- **Validation Layer**: Multiple checks to prevent invalid tenant IDs (empty, 'www', null)

---

## Documentation Structure

This documentation is split into focused files for better AI comprehension and maintainability:

### 1. [Architecture & Components](./ARCHITECTURE.md)
**Topics Covered:**
- System Layers & Flow Diagrams
- File Structure
- Multi-Tenant Tracking Strategy
- Core Components Deep Dive:
  - GA4Provider Component
  - Core Tracking Functions (ga4-tracking.ts)
  - GTMProvider Component
  - GTM Utility Functions
- Middleware Integration
- Data Flow Architecture

**When to Read:** Understanding system architecture, component interactions, and data flow

---

### 2. [Tracking & Events](./TRACKING_AND_EVENTS.md)
**Topics Covered:**
- Event Tracking System (Automatic vs On-Demand)
- Implementation Patterns (Homepage, Tenant Pages, Property/Project Details)
- Tenant ID Extraction & Validation
- Domain-Based Tracking Logic
- Custom Events & User Properties
- Page View Tracking Mechanism
- Property & Project Tracking
- Dual Analytics System (GA4 vs GTM)

**When to Read:** Implementing tracking, creating custom events, understanding tracking patterns

---

### 3. [Configuration](./CONFIGURATION.md)
**Topics Covered:**
- Environment Variables Setup
- Environment Variable Usage Map
- GA4 Admin Configuration
- GTM Container Setup
- Development vs Production Settings

**When to Read:** Setting up GA4 tracking, configuring environments, deploying to production

---

### 4. [Debugging Guide](./DEBUGGING.md)
**Topics Covered:**
- Console Logging Strategy
- Debugging Steps (Console, Network, GA4 Reports, Middleware)
- Testing Scenarios
- Common Issues & Solutions:
  - No Events Tracked
  - Events Missing tenant_id
  - Duplicate Events
  - Tracking on Base Domain
- Validation Techniques

**When to Read:** Troubleshooting tracking issues, debugging events, solving problems

---

### 5. [Best Practices & Security](./BEST_PRACTICES.md)
**Topics Covered:**
- Performance Optimization
- Security & Privacy
- GDPR Compliance
- Best Practices (6 key rules)
- Code Examples (Good vs Bad)
- Memory Management
- Event Batching Strategies

**When to Read:** Optimizing performance, ensuring security, following best practices

---

## Quick Start

### 1. For Understanding the System
Start with → **[ARCHITECTURE.md](./ARCHITECTURE.md)**

### 2. For Implementing Tracking
Start with → **[TRACKING_AND_EVENTS.md](./TRACKING_AND_EVENTS.md)**

### 3. For Setup & Configuration
Start with → **[CONFIGURATION.md](./CONFIGURATION.md)**

### 4. For Troubleshooting
Start with → **[DEBUGGING.md](./DEBUGGING.md)**

### 5. For Optimization
Start with → **[BEST_PRACTICES.md](./BEST_PRACTICES.md)**

---

## Key Files Reference

| Component | File | Purpose |
|-----------|------|---------|
| GA4 Provider | `components/GA4Provider.tsx` | Initialize & track |
| GA4 Functions | `lib/ga4-tracking.ts` | Core tracking logic |
| GTM Provider | `components/GTMProvider.tsx` | Tag management |
| GTM Functions | `lib/gtm.ts` | GTM utilities |
| Homepage Wrapper | `app/HomePageWrapper.tsx` | Homepage tracking |
| Tenant Wrapper | `app/TenantPageWrapper.tsx` | Tenant pages tracking |
| Property Wrapper | `app/property/[id]/PropertyPageWrapper.tsx` | Property tracking |
| Project Wrapper | `app/project/[id]/ProjectPageWrapper.tsx` | Project tracking |
| Middleware | `middleware.ts` | Tenant detection |

---

## Related Documentation

### 1. Middleware & Tenant Detection
**File**: `docs/important/MIDDLEWARE_TENANT_DETECTION.md`  
**Connection**: Middleware sets `x-tenant-id` header that GA4 uses  
**Key Functions**: `getTenantIdFromHost()`, `getTenantIdFromCustomDomain()`

### 2. Locale Routing System
**File**: `docs/important/LOCALE_ROUTING_SYSTEM.md`  
**Connection**: Locale changes trigger page view events  
**Key Headers**: `x-locale` (used for internationalized tracking)

### 3. Authentication Systems
**File**: `docs/important/AUTHENTICATION_SYSTEMS.md`  
**Connection**: Dashboard has separate GTM container (GTM-KBL37C9T)  
**Separation**: Tenant analytics ≠ Dashboard analytics

---

## Summary of Key Concepts

### Multi-Tenant Tracking Strategy

**Challenge**: Track different tenants separately while excluding main platform

**Solution**:
1. **Middleware Detection**: Extract `tenant_id` from subdomain/custom domain
2. **Header Injection**: Pass `tenant_id` via `x-tenant-id` header
3. **Client-Side Validation**: Verify and track with `tenant_id` parameter
4. **GA4 Segmentation**: Filter reports by `tenant_id` custom dimension

### Tracking Flow

```
User Visit → Middleware (detect tenant) → Server Component (read headers) 
→ Client Wrapper (inject providers) → GA4Provider (initialize & track) 
→ Google Analytics 4 (collect with tenant_id)
```

### Event Types

1. **Automatic Events**:
   - Page Views (on route change)

2. **On-Demand Events**:
   - Property Views (on property page mount)
   - Project Views (on project page mount)
   - Custom Events (via `trackEvent()` function)

---

## Contact & Maintenance

**Last Updated**: December 2024  
**Version**: 2.0 (Split Documentation)  
**Maintained By**: Development Team

For issues or questions about GA4 tracking:
1. Check console logs first
2. Verify network requests in DevTools
3. Review appropriate documentation file
4. Check GA4 real-time reports
5. Review related middleware documentation

---

**Documentation Split Strategy**: Each file is under 800 lines for optimal AI processing and human readability.

