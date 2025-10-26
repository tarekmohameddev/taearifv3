# Dashboard Modules

## Overview

Complete reference for all 26 dashboard modules with their features, routes, and components.

---

## Module List

### 1. Dashboard Homepage (`/dashboard`)

**File:** `app/dashboard/page.tsx`  
**Component:** `WelcomeDashboard` from `@/components/homepage/welcome-dashboard`

**Features:**
- Welcome message
- Quick statistics
- Recent activity
- Quick actions
- Getting started guide

**Layout Structure:**
```typescript
<div className="flex min-h-screen flex-col">
  <DashboardHeader />
  <div className="flex flex-1 flex-col md:flex-row">
    <EnhancedSidebar activeTab="websites" />
    <main className="flex-1 p-4 md:p-6">
      <WelcomeDashboard />
    </main>
  </div>
  <GuidedTour />
</div>
```

---

### 2. Analytics (`/dashboard/analytics`)

**File:** `app/dashboard/analytics/page.tsx`  
**Component:** `AnalyticsPage` from `@/components/analytics-page`

**Purpose:** Business metrics and performance tracking

**Features:**
- Website traffic analytics
- Visitor statistics
- Page views
- Conversion tracking
- Revenue analytics
- Custom date ranges
- Export reports

**Data Source:** Store homepage analytics sub-stores
- `dashboardDevice` - Device statistics
- `dashboardSummary` - Summary cards
- `visitorData` - Visitor metrics
- `trafficSources` - Traffic data

---

### 3. Properties Management (`/dashboard/properties`)

**File:** `app/dashboard/properties/page.tsx`  
**Component:** `PropertiesManagementPage` from `@/components/property/properties-management-page`

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

**Store:** `propertiesManagement` in `context/store/propertiesManagement.js`

---

### 4. Projects (`/dashboard/projects`)

**File:** `app/dashboard/projects/page.tsx`

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

**Store:** `projectsManagement` in `context/store/projectsManagement.js`

**Relationship:** Parent of Buildings and Properties

---

### 5. Buildings (`/dashboard/buildings`)

**File:** `app/dashboard/buildings/page.tsx`

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

**Relationship:** Child of Projects, Parent of Properties

---

### 6. Customers (`/dashboard/customers`)

**File:** `app/dashboard/customers/page.tsx`  
**Component:** `customers-page`

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

**File:** `app/dashboard/crm/page.tsx`  
**Component:** `CrmPage` from `@/components/crm/crm-page`

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

**Integration:** Links to Customers module

---

### 8. Property Requests (`/dashboard/property-requests`)

**File:** `app/dashboard/property-requests/page.tsx`

**Purpose:** Handle property inquiries from website visitors

**Features:**
- Request inbox
- Request status (new, contacted, completed)
- Customer details
- Requested property details
- Response management
- Follow-up tracking

**Source:** Inquiries submitted via tenant website property pages

---

### 9. Rental Management (`/dashboard/rental-management`)

**File:** `app/dashboard/rental-management/page.tsx`  
**Component:** `RentalManagementDashboard` from `@/components/rental-management/rental-management-dashboard`

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

**Store:** `rentalManagement` in `context/store/rentalManagement.js`

**Special:** Has dedicated README at `app/dashboard/rental-management/create/README.md`

---

### 10. Purchase Management (`/dashboard/purchase-management`)

**File:** `app/dashboard/purchase-management/page.tsx`

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

**Store:** `purchaseManagement` in `context/store/purchaseManagement.js`

---

### 11. Content Management (`/dashboard/content`)

**File:** `app/dashboard/content/page.tsx`

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

**Store:** `contentManagement` in `context/store/contentManagement.js`

**Integration:** Content appears in Live Editor and tenant websites

---

### 12. Blogs (`/dashboard/blogs`)

**File:** `app/dashboard/blogs/page.tsx`

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

**Store:** `blogManagement` in `context/store/blogManagement.js`

---

### 13. Blog (Single) (`/dashboard/blog`)

**File:** `app/dashboard/blog/page.tsx`

**Purpose:** Single blog configuration (different from `/blogs`)

---

### 14. Affiliate (`/dashboard/affiliate`)

**File:** `app/dashboard/affiliate/page.tsx`  
**Component:** `AffiliateRegistrationPage` from `@/components/affiliate/affiliate-registration-page`

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

**Store:** `affiliate` in `context/store/affiliate.js`

---

### 15. Marketing (`/dashboard/marketing`)

**File:** `app/dashboard/marketing/page.tsx`  
**Component:** `marketing-page`

**Purpose:** Marketing campaign management

**Features:**
- Email campaigns
- SMS marketing
- Social media integration
- Campaign analytics
- Lead generation
- A/B testing

**Store:** `marketingDashboard` in `context/store/marketingDashboard.js`

---

### 16. Apps & Integrations (`/dashboard/apps`)

**File:** `app/dashboard/apps/page.tsx`  
**Component:** `apps-page`

**Purpose:** Third-party app integrations

**Features:**
- Available apps
- Installed apps
- API keys management
- Webhook configuration
- Integration settings

---

### 17. WhatsApp AI (`/dashboard/whatsapp-ai`)

**File:** `app/dashboard/whatsapp-ai/page.jsx`  
**Component:** `whatsapp-ai-page`

**Purpose:** AI-powered WhatsApp integration

**Features:**
- WhatsApp bot configuration
- Auto-responses
- Chat management
- AI training
- Message templates

---

### 18. Messages (`/dashboard/messages`)

**File:** `app/dashboard/messages/page.tsx`  
**Component:** `messages-page`

**Purpose:** Internal messaging system

**Features:**
- Inbox
- Sent messages
- Compose message
- Message threads
- Attachments

---

### 19. Activity Logs (`/dashboard/activity-logs`)

**File:** `app/dashboard/activity-logs/page.tsx`

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

**File:** `app/dashboard/access-control/page.tsx`

**Purpose:** User roles and permissions management

**Features:**
- User management
- Role creation
- Permission assignment
- Access levels
- Team member invitations

**Sub-Routes:**
- `/dashboard/access-control/roles` - Role management

**Permission Required:** `account_type === "tenant"` (only tenant can access)

---

### 21. Matching (`/dashboard/matching`)

**File:** `app/dashboard/matching/page.tsx`  
**Component:** `matching-page`

**Purpose:** Property-customer matching system

**Features:**
- Customer preferences
- Property recommendations
- Match algorithm
- Match notifications
- Match history

**Store:** `matchingPage` in `context/store/matchingPage.js`

---

### 22. Templates (`/dashboard/templates`)

**File:** `app/dashboard/templates/page.tsx`  
**Component:** `templates-page`

**Purpose:** Website template management

**Features:**
- Available templates
- Template preview
- Template activation
- Template customization
- Import/export templates

---

### 23. Settings (`/dashboard/settings`)

**File:** `app/dashboard/settings/page.tsx`  
**Component:** `SettingsPage` from `@/components/settings-page`

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

**Triggers:** Subscription button in DashboardHeader

---

### 24. Components Test (`/dashboard/componentsTest`)

**File:** `app/dashboard/componentsTest/page.tsx`

**Purpose:** Development/testing page for component verification

**Note:** Likely for development purposes only

---

### 25. Expenses (`/dashboard/expenses`)

**Directory:** `app/dashboard/expenses/`

**Purpose:** Expense tracking and management

**Status:** Directory exists but no page.tsx found (possibly under development)

---

### 26. Reset (`/dashboard/reset`)

**File:** `app/dashboard/reset/page.tsx`

**Purpose:** Password reset functionality (dashboard-specific)

**Features:**
- Reset password form
- Email verification
- Token validation
- New password submission

---

## Module Interconnections

### Property Management Ecosystem

**Core Modules:**
1. Projects → Buildings → Properties
2. Property Requests (inquiries)
3. Rental Management
4. Purchase Management

**Data Flow:**

```
Create Project (/dashboard/projects)
  ↓
Add Buildings to project (/dashboard/buildings)
  ↓
Add Properties to building (/dashboard/properties)
  ↓
Property appears on tenant website
  ↓
Customer submits inquiry
  ↓
Inquiry in /dashboard/property-requests
  ↓
Admin responds
  ↓
Create Contract (/dashboard/rental-management)
OR
Create Agreement (/dashboard/purchase-management)
```

---

### Customer Relationship Ecosystem

**Core Modules:**
1. Customers (database)
2. CRM (relationship management)
3. Messages (communication)
4. Activity Logs (tracking)
5. Marketing (campaigns)
6. Property Requests (leads)

**Data Flow:**

```
Customer submits property request
  ↓
Added to /dashboard/property-requests
  ↓
Admin creates customer record
  ↓
Customer in /dashboard/customers
  ↓
CRM creates lead
  ↓
Follow-up tasks created
  ↓
Messages sent (/dashboard/messages)
  ↓
Interactions logged (/dashboard/activity-logs)
  ↓
Added to marketing list
  ↓
Campaigns sent (/dashboard/marketing)
```

---

### Content Management Workflow

**Content Sections → Live Editor → Tenant Website**

```
Admin edits /dashboard/content/testimonials
  ↓
Content saved to database
  ↓
Live Editor reads from database
  ↓
Testimonials component displays on website
  ↓
Changes visible on tenant.localhost:3000
```

**Content Mapping:**
- `about` → About Us page
- `achievements` → Achievement section
- `testimonials` → Testimonials component
- `gallery` → Gallery component
- `services` → Services section
- `footer` → Footer content
- `menu` → Header menu items

---

## Common Patterns

### Pattern 1: Simple Page (No Sub-Routes)

```typescript
// app/dashboard/analytics/page.tsx
import { AnalyticsPage } from "@/components/analytics-page";

export const metadata = { title: "Analytics" };

export default function Page() {
  return <AnalyticsPage />;
}
```

### Pattern 2: CRUD Module (List + Add + Edit)

```typescript
// app/dashboard/properties/page.tsx - List
// app/dashboard/properties/add/page.tsx - Create
// app/dashboard/properties/[id]/edit/page.tsx - Update
```

### Pattern 3: Multi-Section Hub

```typescript
// app/dashboard/content/page.tsx - Hub
// app/dashboard/content/about/page.tsx - Sub-section 1
// app/dashboard/content/gallery/page.tsx - Sub-section 2
// ... 14 sub-sections total
```

---

## Module Dependencies

### Properties Module Depends On:
- Projects module (parent relationship)
- Buildings module (parent relationship)
- Customers module (ownership)

### Rental Management Depends On:
- Properties module (rental property)
- Customers module (tenant information)
- Owners module (property owner via `/owner` system)

### CRM Depends On:
- Customers module (customer data)
- Property Requests module (lead source)
- Messages module (communication)

### Marketing Depends On:
- Customers module (contact list)
- Analytics module (campaign tracking)
- Messages module (email/SMS sending)

---

## Module Quick Reference

| Module | Route | Component File | Store | Permission |
|--------|-------|----------------|-------|------------|
| **Homepage** | `/dashboard` | `components/homepage/welcome-dashboard` | `homepage/*` | - |
| **Analytics** | `/dashboard/analytics` | `components/analytics-page` | `homepage/*` | `analytics.view` |
| **Properties** | `/dashboard/properties` | `components/property/properties-management-page` | `propertiesManagement` | `properties.view` |
| **Projects** | `/dashboard/projects` | - | `projectsManagement` | `projects.view` |
| **Buildings** | `/dashboard/buildings` | - | - | `projects.view` |
| **Customers** | `/dashboard/customers` | `components/customers-page` | - | `customers.view` |
| **CRM** | `/dashboard/crm` | `components/crm/crm-page` | - | `crm.view` |
| **Requests** | `/dashboard/property-requests` | - | - | `properties.view` |
| **Rental** | `/dashboard/rental-management` | `components/rental-management/rental-management-dashboard` | `rentalManagement` | `rental.management` |
| **Purchase** | `/dashboard/purchase-management` | - | `purchaseManagement` | `purchase.management` |
| **Content** | `/dashboard/content` | - | `contentManagement` | - |
| **Blogs** | `/dashboard/blogs` | - | `blogManagement` | `blogs.view` |
| **Affiliate** | `/dashboard/affiliate` | `components/affiliate/affiliate-registration-page` | `affiliate` | `affiliate.view` |
| **Marketing** | `/dashboard/marketing` | `components/marketing-page` | `marketingDashboard` | `marketing.view` |
| **Messages** | `/dashboard/messages` | `components/messages-page` | - | `messages.view` |
| **Apps** | `/dashboard/apps` | `components/apps-page` | - | `apps.view` |
| **WhatsApp** | `/dashboard/whatsapp-ai` | `components/whatsapp-ai-page` | - | `whatsapp.ai` |
| **Templates** | `/dashboard/templates` | `components/templates-page` | - | `templates.view` |
| **Settings** | `/dashboard/settings` | `components/settings-page` | - | `settings.view` |
| **Access** | `/dashboard/access-control` | - | - | `tenant` only |
| **Logs** | `/dashboard/activity-logs` | - | - | `activity.logs.view` |
| **Matching** | `/dashboard/matching` | `components/matching-page` | `matchingPage` | - |
| **Reset** | `/dashboard/reset` | - | - | - |

---

**See Also:**
- [CORE_INFRASTRUCTURE.md](./CORE_INFRASTRUCTURE.md) - Stores used by modules
- [DATA_FLOWS.md](./DATA_FLOWS.md) - How modules interact
- [AUTHENTICATION.md](./AUTHENTICATION.md) - Permission requirements

