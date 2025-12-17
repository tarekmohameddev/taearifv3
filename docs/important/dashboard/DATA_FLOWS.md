# Dashboard Data Flows & Integration

## Overview

This document explains how data flows through the Dashboard System and how it integrates with other systems.

---

## Core Data Flows

### 1. Dashboard Page Load Flow

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
If valid → continue
  ↓
Enforces RTL direction
  ↓
Loads GTM tracking
  ↓
Checks permissions (PermissionWrapper)
  ↓
If no permission → show access denied
If has permission → render page
  ↓
Page component loads (PropertiesManagementPage)
  ↓
Component fetches data using axiosInstance
  ↓
Displays property management interface
```

---

### 2. API Request Flow

```
Dashboard page needs data
  ↓
Uses axiosInstance from @/lib/axiosInstance
  ↓
Request interceptor runs:
  - Checks if axios is locked
  - Gets token from AuthStore
  - Adds Authorization: Bearer {token}
  ↓
POST/GET/PUT/DELETE https://api.taearif.com/api/...
  ↓
Backend validates token
  ↓
Response interceptor runs:
  - Categorizes errors (server/client/network)
  - Adds metadata
  ↓
If 401 Unauthorized → redirect to /login
If 500 Server Error → add error.serverError
If success → return data
  ↓
Page component receives data
  ↓
Updates UI with data
```

**See [CORE_INFRASTRUCTURE.md](./CORE_INFRASTRUCTURE.md) - axiosInstance section**

---

### 3. Sidebar Menu Load Flow

```
Dashboard page loads
  ↓
EnhancedSidebar component mounts
  ↓
useEffect() triggers
  ↓
Checks if user token exists (useAuthStore)
  ↓
Calls fetchSideMenus() from Store
  ↓
GET /api/dashboard/menu with Bearer token
  ↓
Response: { mainNavItems: [...] }
  ↓
Store in Zustand store (Store.sidebarData)
  ↓
Filter items by user permissions:
  - Admin → show all
  - Others → show only permitted items
  ↓
Render visible menu items
  ↓
Highlight active route based on pathname
```

---

### 4. Subscription Check Flow

```
Dashboard loads
  ↓
fetchUserData() called (AuthStore)
  ↓
GET /api/user/getUserInfo (basic data)
  ↓
GET /user (full data with subscription)
  ↓
Response includes:
  - is_free_plan: boolean
  - package_title: string
  - package_features: string[]
  - project_limit_number: number
  - real_estate_limit_number: number
  - days_remaining: number
  ↓
Store in AuthStore.userData
  ↓
Components check subscription:
  if (is_free_plan && feature === "advanced_analytics") {
    return <UpgradePrompt />;
  }
  ↓
  if (days_remaining < 7) {
    return <RenewalReminder />;
  }
  ↓
Conditional feature rendering
```

---

## Module Interconnection Flows

### Property Management Ecosystem Flow

```
┌──────────────────────────────────────────────────────────┐
│               Property Management Flow                    │
└──────────────────────────────────────────────────────────┘

Admin creates Project in /dashboard/projects
  ↓ (Save to database: projects table)
Project ID = 123
  ↓
Admin adds Building to project in /dashboard/buildings
  ↓ (Save to database: buildings table, project_id = 123)
Building ID = 456
  ↓
Admin adds Property to building in /dashboard/properties
  ↓ (Save to database: properties table, building_id = 456, project_id = 123)
Property ID = 789
  ↓
Property appears on tenant website automatically
  (Read from properties table via tenantStore)
  ↓
Customer views property on tenant.localhost:3000/for-sale
  ↓
Customer submits inquiry form
  ↓
Inquiry saved to database: property_requests table
  (property_id = 789, customer_info = {...})
  ↓
Inquiry appears in /dashboard/property-requests
  ↓
Admin responds to inquiry
  ↓
Decision:
  ├─ Rental → Navigate to /dashboard/rental-management
  │   ↓ Create contract (property_id = 789)
  │   ↓ Contract saved to rental_contracts table
  │   ↓ Track payments, renewals
  │
  └─ Purchase → Navigate to /dashboard/purchase-management
      ↓ Create agreement (property_id = 789)
      ↓ Agreement saved to purchase_agreements table
      ↓ Track payment schedule
```

---

### Customer Relationship Flow

```
┌──────────────────────────────────────────────────────────┐
│            Customer Relationship Management Flow          │
└──────────────────────────────────────────────────────────┘

Customer submits property request on website
  ↓
Saved to property_requests table
  ↓
Appears in /dashboard/property-requests
  ↓
Admin clicks "Create Customer"
  ↓
Navigate to /dashboard/customers
  ↓
Customer record created
  (email, phone, name, source = "property_request")
  ↓
Saved to customers table
  ↓
CRM automatically creates lead in /dashboard/crm
  (customer_id linked, status = "new")
  ↓
Saved to crm_leads table
  ↓
Admin creates follow-up tasks in CRM
  ↓
Tasks saved to crm_tasks table
  ↓
Admin sends message via /dashboard/messages
  ↓
Message saved to messages table
  ↓
Interaction logged in /dashboard/activity-logs
  (action = "message_sent", customer_id, timestamp)
  ↓
Logged to activity_logs table
  ↓
Customer added to marketing list in /dashboard/marketing
  ↓
Saved to marketing_lists table
  ↓
Campaign sent (email/SMS)
  ↓
Campaign tracked in marketing_campaigns table
```

---

### Content Synchronization Flow

```
┌──────────────────────────────────────────────────────────┐
│          Content Management Synchronization Flow         │
└──────────────────────────────────────────────────────────┘

Admin edits content in /dashboard/content/testimonials
  ↓
Form submits data
  ↓
POST /api/content/testimonials
  Body: { title, description, rating, author, ... }
  ↓
Saved to content_testimonials table
  (tenant_id = user's tenant_id)
  ↓
Success response
  ↓
Meanwhile, on tenant website:
  ↓
Tenant website loads (tenant1.localhost:3000)
  ↓
HomePageWrapper fetches tenant data
  ↓
tenantStore.fetchTenantData("tenant1")
  ↓
GET /v1/tenant-website/getTenant
  Body: { websiteName: "tenant1" }
  ↓
Response includes componentSettings with content
  ↓
Testimonials component reads from componentSettings
  ↓
Displays updated testimonials
  ↓
Changes visible immediately (or after page refresh)
```

**See [../COMPONENT_LOADING_SYSTEM.md](../COMPONENT_LOADING_SYSTEM.md)**

---

## Dashboard ↔ Live Editor Integration

### Access Flow

```
User in Dashboard → Clicks "Websites" in sidebar
  ↓
Navigate to /ar/live-editor
  ↓
Middleware validates locale
  ↓
Dashboard layout NOT applied
  (Different layout: app/live-editor/layout.tsx)
  ↓
Live Editor loads
  ↓
editorStore reads:
  - globalComponentsData (header, footer)
  - componentSettings (page components)
  ↓
User edits components
  ↓
Saves changes
  ↓
Changes reflected on tenant website
```

**See [../liveeditor.md](../liveeditor.md)**

### Data Synchronization

**Dashboard Content → Live Editor:**

```
/dashboard/content/about → edits saved
  ↓
Database: content_about table updated
  ↓
Live Editor reads from database
  ↓
About Us component in editor
  ↓
User can further customize
  ↓
Saves to componentSettings
  ↓
Tenant website displays merged:
  (content_about + componentSettings.about)
```

---

## Dashboard ↔ Tenant Website Sync

### Property Listing Sync

```
/dashboard/properties → Add new property
  ↓
Property saved with tenant_id
  ↓
Tenant website fetches properties
  GET /api/properties?tenant_id=...
  ↓
Grid component displays properties
  ↓
Visible immediately on /for-sale or /for-rent
```

### Website Settings Sync

```
/dashboard/settings → Update domain/branding
  ↓
Settings saved to tenant table
  ↓
Tenant website reads on load
  ↓
Header shows updated logo/name
```

---

## Subscription & Feature Gating

### Feature Access Flow

```
User accesses /dashboard/analytics
  ↓
Component checks subscription:
  const { is_free_plan, package_features } = useAuthStore(
    (state) => state.userData
  );
  ↓
If free plan AND feature not included:
  ↓
  Show upgrade prompt:
    <UpgradeCard
      feature="Advanced Analytics"
      requiredPlan="Pro"
    />
  ↓
If has access:
  ↓
  Render full analytics dashboard
```

### Limit Checking

```
User tries to add property
  ↓
Check current count vs limit:
  const { real_estate_limit_number } = userData;
  const currentCount = await fetchPropertyCount();
  ↓
If currentCount >= real_estate_limit_number:
  ↓
  Show limit reached message
  ↓
Else:
  ↓
  Allow property creation
```

---

## Multi-Website Management Flow

```
User with multiple websites
  ↓
Dashboard header shows website switcher
  ↓
<Select>
  <Option value="website1">Website 1</Option>
  <Option value="website2">Website 2</Option>
</Select>
  ↓
User selects "Website 2"
  ↓
Update context: currentWebsiteId = "website2"
  ↓
Refresh all data for new website:
  - Properties filtered by website
  - Analytics for specific website
  - Content for specific website
  ↓
Live editor loads correct website
```

---

## Complete User Journey Example

### Scenario: Admin manages property listing

```
1. Login
   ↓
   POST /api/login
   → Set cookie, update AuthStore
   → Redirect to /ar/dashboard

2. Dashboard Loads
   ↓
   Token validated
   → Subscription data fetched
   → Sidebar menu loaded
   → Dashboard homepage shown

3. Navigate to Properties
   ↓
   Click "Properties" in sidebar
   → Route to /ar/dashboard/properties
   → Permission checked (properties.view)
   → PropertiesManagementPage renders

4. Fetch Properties
   ↓
   GET /api/properties
   → axiosInstance adds token
   → Response: { properties: [...] }
   → Display in grid

5. Add New Property
   ↓
   Click "Add Property"
   → Route to /ar/dashboard/properties/add
   → Fill form (title, price, images, etc.)
   → Submit

6. Save Property
   ↓
   POST /api/properties
   → axiosInstance adds token
   → Body: { title, price, images, tenant_id }
   → Property saved to database
   → Success response

7. Property Appears on Website
   ↓
   Tenant website loads
   → fetchTenantData()
   → Properties fetched (filtered by tenant_id)
   → Grid component displays new property
   → Visible on tenant.localhost:3000/for-sale

8. Customer Inquiry
   ↓
   Customer clicks "Inquire"
   → Form submission
   → POST /api/property-requests
   → Saved to database

9. Handle Inquiry
   ↓
   Admin checks /dashboard/property-requests
   → New request appears
   → Admin responds
   → Creates customer record
   → CRM lead created
   → Follow-up scheduled
```

---

**See Also:**

- [MODULES.md](./MODULES.md) - Individual module details
- [CORE_INFRASTRUCTURE.md](./CORE_INFRASTRUCTURE.md) - Store architecture
- [AUTHENTICATION.md](./AUTHENTICATION.md) - Auth flows
