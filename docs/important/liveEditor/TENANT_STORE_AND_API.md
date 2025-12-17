# Tenant Store and API Integration

## Table of Contents

1. [Overview](#overview)
2. [tenantStore Architecture](#tenantstore-architecture)
3. [Data Fetching Flow](#data-fetching-flow)
4. [Data Saving Flow](#data-saving-flow)
5. [API Endpoints](#api-endpoints)
6. [Data Structure](#data-structure)
7. [Integration with editorStore](#integration-with-editorstore)

---

## Overview

The **tenantStore** is a Zustand store responsible for:

- **Fetching tenant data** from API
- **Caching tenant data** to prevent duplicate requests
- **Saving changes** to database via API
- **Managing loading states** and error handling
- **Providing tenant metadata** (ID, name, settings)

**Location**: `context-liveeditor/tenantStore.jsx`

**Technology**: Zustand (state management) + Axios (HTTP client)

---

## tenantStore Architecture

### Store Structure

```typescript
interface TenantStore {
  // ═══════════════════════════════════════════════════════════
  // DATA STATE
  // ═══════════════════════════════════════════════════════════
  tenantData: TenantData | null;
  tenant: any | null;
  tenantId: string | null;
  lastFetchedWebsite: string | null;

  // ═══════════════════════════════════════════════════════════
  // LOADING STATE
  // ═══════════════════════════════════════════════════════════
  loadingTenantData: boolean;
  loading: boolean; // Alias for loadingTenantData
  error: string | null;

  // ═══════════════════════════════════════════════════════════
  // SETTERS
  // ═══════════════════════════════════════════════════════════
  setTenant: (tenant: any) => void;
  setTenantId: (tenantId: string) => void;

  // ═══════════════════════════════════════════════════════════
  // DATA FETCHING
  // ═══════════════════════════════════════════════════════════
  fetchTenantData: (websiteName: string) => Promise<void>;

  // ═══════════════════════════════════════════════════════════
  // LEGACY UPDATE FUNCTIONS (mostly unused)
  // ═══════════════════════════════════════════════════════════
  updateHeader: (headerData: any) => void;
  updateHero: (heroData: any) => void;
  updateFooter: (footerData: any) => void;
  // ... more legacy functions

  // ═══════════════════════════════════════════════════════════
  // LEGACY SAVE FUNCTIONS (mostly unused)
  // ═══════════════════════════════════════════════════════════
  saveHeaderChanges: (tenantId, headerData, variant) => Promise<void>;
  saveHeroChanges: (tenantId, heroData, variant) => Promise<void>;
  // ... more legacy save functions
}
```

### Key Properties

**tenantData Structure**:

```typescript
{
  _id: "tenant-mongodb-id",
  username: "tenant-username",
  websiteName: "tenant-website-name",
  email: "tenant@example.com",

  // Component data organized by page
  componentSettings: {
    "homepage": {
      "uuid-1": {
        id: "uuid-1",
        type: "hero",
        componentName: "hero1",
        data: {...},
        position: 0
      },
      "uuid-2": {
        id: "uuid-2",
        type: "halfTextHalfImage",
        componentName: "halfTextHalfImage1",
        data: {...},
        position: 1
      }
    },
    "about-us": {
      // About page components
    }
  },

  // Global components (shared across all pages)
  globalComponentsData: {
    header: {
      visible: true,
      logo: {...},
      menu: [...]
    },
    footer: {
      visible: true,
      content: {...}
    }
  },

  // Legacy global component data (backward compatibility)
  globalHeaderData: {...},
  globalFooterData: {...},

  // Website metadata and SEO
  WebsiteLayout: {
    metaTags: {
      pages: [
        {
          path: "/",
          TitleAr: "الصفحة الرئيسية",
          TitleEn: "Homepage",
          DescriptionAr: "...",
          DescriptionEn: "...",
          // ... more meta fields
        }
      ]
    }
  },

  // Other tenant properties
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-15T12:30:00.000Z"
}
```

---

## Data Fetching Flow

### fetchTenantData Implementation

```typescript
fetchTenantData: async (websiteName) => {
  const state = useTenantStore.getState();

  // ═══════════════════════════════════════════════════════════
  // STEP 1: Prevent Duplicate Requests
  // ═══════════════════════════════════════════════════════════
  if (
    state.loadingTenantData ||
    (state.tenantData && state.tenantData.username === websiteName)
  ) {
    console.log("🚫 Skipping fetch - already loading or loaded:", websiteName);
    return; // Exit early
  }

  // ═══════════════════════════════════════════════════════════
  // STEP 2: Set Loading State
  // ═══════════════════════════════════════════════════════════
  set({
    loadingTenantData: true,
    error: null,
  });

  console.log("🔄 Fetching tenant data:", websiteName);

  try {
    // ═══════════════════════════════════════════════════════════
    // STEP 3: API Request
    // ═══════════════════════════════════════════════════════════
    const response = await axiosInstance.post("/v1/tenant-website/getTenant", {
      websiteName,
    });

    const data = response.data || {};

    console.log("✅ Tenant data received:", {
      username: data.username,
      hasComponentSettings: !!data.componentSettings,
      hasGlobalComponents: !!data.globalComponentsData,
      pagesCount: Object.keys(data.componentSettings || {}).length,
    });

    // ═══════════════════════════════════════════════════════════
    // STEP 4: Load into editorStore
    // ═══════════════════════════════════════════════════════════
    const { useEditorStore } = await import("./editorStore");
    const editorStore = useEditorStore.getState();

    // Load global components data
    if (data.globalComponentsData) {
      console.log("📦 Loading globalComponentsData into editorStore");
      editorStore.setGlobalComponentsData(data.globalComponentsData);
    }

    // Load WebsiteLayout (meta tags)
    if (
      data.WebsiteLayout &&
      data.WebsiteLayout.metaTags &&
      data.WebsiteLayout.metaTags.pages
    ) {
      console.log("📦 Loading WebsiteLayout into editorStore");
      editorStore.setWebsiteLayout(data.WebsiteLayout);
    }

    // ═══════════════════════════════════════════════════════════
    // STEP 5: Update tenantStore State
    // ═══════════════════════════════════════════════════════════
    set({
      tenantData: data,
      loadingTenantData: false,
      lastFetchedWebsite: websiteName,
    });

    console.log("✅ Tenant data loaded successfully");
  } catch (error) {
    // ═══════════════════════════════════════════════════════════
    // ERROR HANDLING
    // ═══════════════════════════════════════════════════════════
    console.error("[tenantStore] Error fetching tenant data:", error);

    set({
      error: error.message || "Failed to fetch tenant data",
      loadingTenantData: false,
    });
  }
};
```

### Complete Fetch Flow

```
FETCH TENANT DATA FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRIGGER:
────────────────────────────────────────────────
LiveEditorEffects.tsx:
  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);


CHECK CACHE:
────────────────────────────────────────────────
if (loadingTenantData) {
  return;  // Already fetching
}

if (tenantData && tenantData.username === websiteName) {
  return;  // Already have this data
}


API REQUEST:
────────────────────────────────────────────────
POST /v1/tenant-website/getTenant
Body: { websiteName: "tenant123" }

Headers:
  Authorization: Bearer {jwt-token}
  Content-Type: application/json


RESPONSE:
────────────────────────────────────────────────
{
  status: "success",
  data: {
    _id: "...",
    username: "tenant123",
    componentSettings: {
      homepage: {...},
      "about-us": {...}
    },
    globalComponentsData: {
      header: {...},
      footer: {...}
    },
    WebsiteLayout: {
      metaTags: {
        pages: [...]
      }
    }
  }
}


LOAD INTO STORES:
────────────────────────────────────────────────
1. tenantStore:
   set({ tenantData: response.data })

2. editorStore:
   editorStore.setGlobalComponentsData(data.globalComponentsData)
   editorStore.setWebsiteLayout(data.WebsiteLayout)
   editorStore.loadFromDatabase(data)  // Called elsewhere


RESULT: All data loaded ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Data Saving Flow

### Save Pages Endpoint

**Modern Approach**: Save all pages at once

```typescript
// In EditorProvider or save handler
const confirmSave = async () => {
  const state = useEditorStore.getState();

  // ═══════════════════════════════════════════════════════════
  // STEP 1: Build Payload
  // ═══════════════════════════════════════════════════════════
  const payload = {
    tenantId: tenantId || "",

    // All pages with components
    pages: state.pageComponentsByPage,
    // {
    //   "homepage": [component1, component2, ...],
    //   "about-us": [component1, component2, ...],
    //   "contact": [component1, component2, ...]
    // }

    // Global components (header & footer)
    globalComponentsData: state.globalComponentsData,
    // {
    //   header: {...},
    //   footer: {...}
    // }
  };

  console.log("📤 Save payload:", {
    tenantId: payload.tenantId,
    pagesCount: Object.keys(payload.pages).length,
    hasGlobalHeader: !!payload.globalComponentsData?.header,
    hasGlobalFooter: !!payload.globalComponentsData?.footer,
  });

  // ═══════════════════════════════════════════════════════════
  // STEP 2: API Request
  // ═══════════════════════════════════════════════════════════
  try {
    const response = await axiosInstance.post(
      "/v1/tenant-website/save-pages",
      payload,
    );

    console.log("✅ Save successful:", response.data);

    // ═══════════════════════════════════════════════════════════
    // STEP 3: Update UI
    // ═══════════════════════════════════════════════════════════
    closeDialog();
    toast.success("Changes saved successfully!");

    // Reset change tracking
    state.setHasChangesMade(false);
  } catch (error) {
    console.error("❌ Save failed:", error);
    toast.error("Failed to save changes");
  }
};
```

### Legacy Save Functions (Individual Components)

```typescript
// These exist in tenantStore but are mostly UNUSED
// Modern approach uses save-pages endpoint

saveHeaderChanges: async (tenantId, headerData, variant) => {
  try {
    const response = await axiosInstance.post(
      "/v1/tenant-website/saveHeaderComponent",
      {
        tenantId,
        headerData,
        variant,
      },
    );

    if (response.data.status === "success") {
      // Update local tenantData
      set((state) => ({
        tenantData: {
          ...state.tenantData,
          componentSettings: {
            ...state.tenantData.componentSettings,
            header: {
              data: headerData,
              variant,
            },
          },
        },
      }));
    }

    return response.data;
  } catch (error) {
    console.error("Error saving header:", error);
    throw error;
  }
};
```

**Note**: Legacy functions exist for backward compatibility but are generally NOT used. The modern approach uses `save-pages` to save all components at once.

---

## API Endpoints

### GET Tenant Data

**Endpoint**: `POST /v1/tenant-website/getTenant`

**Request**:

```json
{
  "websiteName": "tenant123"
}
```

**Response**:

```json
{
  "status": "success",
  "data": {
    "_id": "mongodb-object-id",
    "username": "tenant123",
    "websiteName": "tenant123",
    "email": "tenant@example.com",
    "componentSettings": {
      "homepage": {
        "uuid-abc": {
          "id": "uuid-abc",
          "type": "hero",
          "componentName": "hero1",
          "name": "Hero",
          "data": {
            "visible": true,
            "content": {
              "title": "Welcome"
            }
          },
          "position": 0,
          "layout": {
            "row": 0,
            "col": 0,
            "span": 2
          }
        }
      }
    },
    "globalComponentsData": {
      "header": {
        "visible": true,
        "logo": {
          "type": "image+text",
          "text": "Company Name"
        },
        "menu": [
          {
            "id": "home",
            "type": "link",
            "text": "Home",
            "url": "/"
          }
        ]
      },
      "footer": {
        "visible": true,
        "content": {
          "companyInfo": {
            "name": "Company"
          }
        }
      }
    },
    "WebsiteLayout": {
      "metaTags": {
        "pages": [
          {
            "path": "/",
            "TitleAr": "الصفحة الرئيسية",
            "TitleEn": "Homepage"
          }
        ]
      }
    }
  }
}
```

**Error Response**:

```json
{
  "status": "error",
  "message": "Tenant not found"
}
```

---

### POST Save Pages

**Endpoint**: `POST /v1/tenant-website/save-pages`

**Request**:

```json
{
  "tenantId": "tenant-id",
  "pages": {
    "homepage": [
      {
        "id": "uuid-abc",
        "type": "hero",
        "componentName": "hero1",
        "name": "Hero",
        "data": {
          "visible": true,
          "content": {
            "title": "Updated Title"
          }
        },
        "position": 0,
        "layout": {
          "row": 0,
          "col": 0,
          "span": 2
        }
      }
    ],
    "about-us": [...]
  },
  "globalComponentsData": {
    "header": {
      "visible": true,
      "logo": {...},
      "menu": [...]
    },
    "footer": {
      "visible": true,
      "content": {...}
    }
  }
}
```

**Response**:

```json
{
  "status": "success",
  "message": "Pages saved successfully",
  "data": {
    "pagesUpdated": 2,
    "componentsUpdated": 15,
    "globalComponentsUpdated": true
  }
}
```

---

## Data Structure

### componentSettings Structure

**Format**: Object with pages as keys, components as nested objects

```typescript
componentSettings: {
  [pageSlug]: {
    [componentId]: {
      id: string;              // Component UUID
      type: string;            // "hero", "header", etc.
      componentName: string;   // "hero1", "hero2", etc.
      name: string;            // Display name
      data: ComponentData;     // Component configuration
      position: number;        // Render order
      layout?: GridLayout;     // Layout information
    }
  }
}
```

**Example**:

```typescript
{
  "homepage": {
    "3f4a8b2c-5d6e-4f7a-8b9c-0d1e2f3a4b5c": {
      id: "3f4a8b2c-5d6e-4f7a-8b9c-0d1e2f3a4b5c",
      type: "hero",
      componentName: "hero1",
      name: "Hero",
      data: {
        visible: true,
        content: {
          title: "Find Your Dream Home",
          subtitle: "Best real estate options"
        }
      },
      position: 0,
      layout: { row: 0, col: 0, span: 2 }
    },

    "6g7h8i9j-0k1l-2m3n-4o5p-6q7r8s9t0u1v": {
      id: "6g7h8i9j-0k1l-2m3n-4o5p-6q7r8s9t0u1v",
      type: "halfTextHalfImage",
      componentName: "halfTextHalfImage3",
      name: "Half Text Half Image",
      data: {
        visible: true,
        title: "Our Mission",
        description: "We provide..."
      },
      position: 1,
      layout: { row: 1, col: 0, span: 2 }
    }
  },

  "about-us": {
    // About page components
  }
}
```

### globalComponentsData Structure

**Format**: Object with component types as keys

```typescript
globalComponentsData: {
  header: {
    visible: boolean;
    position: {
      type: "sticky" | "fixed" | "relative";
      top: number;
      zIndex: number;
    };
    height: {
      desktop: number;
      tablet: number;
      mobile: number;
    };
    background: {
      type: "solid" | "gradient" | "image";
      colors: {
        from: string;
        to: string;
      };
      opacity: string;
      blur: boolean;
    };
    logo: {
      type: "image" | "text" | "image+text";
      image: string;
      text: string;
      url: string;
    };
    menu: Array<{
      id: string;
      type: "link" | "dropdown" | "mega_menu" | "button";
      text: string;
      url: string;
      submenu?: Array<{
        title: string;
        items: Array<{
          text: string;
          url: string;
        }>;
      }>;
    }>;
    actions: {
      search: { enabled: boolean };
      user: { showProfile: boolean };
    };
    // ... more header configuration
  },

  footer: {
    visible: boolean;
    background: {
      type: "image" | "solid" | "gradient";
      image: string;
      color: string;
      overlay: {
        enabled: boolean;
        opacity: string;
        color: string;
      };
    };
    layout: {
      columns: string;
      spacing: string;
      padding: string;
    };
    content: {
      companyInfo: {
        enabled: boolean;
        name: string;
        description: string;
        logo: string;
      };
      quickLinks: {
        enabled: boolean;
        title: string;
        links: Array<{
          text: string;
          url: string;
        }>;
      };
      contactInfo: {
        enabled: boolean;
        title: string;
        address: string;
        phone1: string;
        phone2: string;
        email: string;
      };
      socialMedia: {
        enabled: boolean;
        title: string;
        platforms: Array<{
          name: string;
          icon: string;
          url: string;
          color: string;
        }>;
      };
    };
    footerBottom: {
      enabled: boolean;
      copyright: string;
      legalLinks: Array<{
        text: string;
        url: string;
      }>;
    };
    // ... more footer configuration
  }
}
```

---

## Integration with editorStore

### Data Transfer Points

#### Point 1: After Fetching

```typescript
// In tenantStore.fetchTenantData()
const { useEditorStore } = await import("./editorStore");
const editorStore = useEditorStore.getState();

// Transfer global data
if (data.globalComponentsData) {
  editorStore.setGlobalComponentsData(data.globalComponentsData);
}

// Transfer meta tags
if (data.WebsiteLayout) {
  editorStore.setWebsiteLayout(data.WebsiteLayout);
}
```

**Why Immediate Transfer?**

- editorStore is authoritative for editing
- tenantStore just fetches from API
- Separation of concerns (fetching vs editing)

#### Point 2: After Fetching (In LiveEditorEffects)

```typescript
// In LiveEditorEffects.tsx
useEffect(() => {
  if (!initialized && tenantData) {
    // Load complete database into editorStore
    editorStore.loadFromDatabase(tenantData);

    setInitialized(true);
  }
}, [initialized, tenantData]);
```

**loadFromDatabase Execution**:

```typescript
loadFromDatabase: (tenantData) =>
  set((state) => {
    const newState = { ...state };

    // Load global components
    newState.globalHeaderData = tenantData.globalHeaderData || defaults;
    newState.globalFooterData = tenantData.globalFooterData || defaults;
    newState.globalComponentsData = tenantData.globalComponentsData || defaults;

    // Load page components
    Object.entries(tenantData.componentSettings).forEach(([page, settings]) => {
      // Set pageComponentsByPage
      newState.pageComponentsByPage[page] = Object.values(settings);

      // Load into component type states
      Object.values(settings).forEach((comp) => {
        switch (comp.type) {
          case "hero":
            newState.heroStates[comp.id] = comp.data;
            break;
          case "header":
            newState.headerStates[comp.id] = comp.data;
            break;
          // ... all component types
        }
      });
    });

    return newState;
  });
```

---

## Helper Functions

### findFirstHeader / findFirstFooter

**Purpose**: Locate header/footer in componentSettings (legacy approach)

```typescript
const findFirstHeader = (componentSettings) => {
  if (!componentSettings) return null;

  for (const pageName in componentSettings) {
    const page = componentSettings[pageName];

    for (const componentId in page) {
      const component = page[componentId];

      if (
        component.type === "header" &&
        component.componentName === "header1"
      ) {
        return {
          id: componentId,
          data: component.data,
        };
      }
    }
  }

  return null;
};
```

**Use Case**: Extract global header from old data format where it was stored in pages

**Modern Approach**: Use `globalComponentsData.header` directly

---

## Cache Management

### Preventing Duplicate Requests

```typescript
fetchTenantData: async (websiteName) => {
  const state = useTenantStore.getState();

  // CHECK 1: Already loading?
  if (state.loadingTenantData) {
    console.log("Already fetching, skipping");
    return;
  }

  // CHECK 2: Already have data for this website?
  if (state.tenantData && state.tenantData.username === websiteName) {
    console.log("Data already loaded for:", websiteName);
    return;
  }

  // CHECK 3: Same as last fetched?
  if (state.lastFetchedWebsite === websiteName) {
    console.log("Recently fetched:", websiteName);
    return;
  }

  // All checks passed - proceed with fetch
  set({ loadingTenantData: true });
  // ... fetch logic
};
```

**Benefits**:

- Avoids duplicate API calls
- Reduces server load
- Faster user experience
- Prevents data race conditions

### Cache Invalidation

```typescript
// Force refresh (e.g., after another user makes changes)
const refreshTenantData = async (websiteName) => {
  // Clear cache
  set({
    tenantData: null,
    lastFetchedWebsite: null,
  });

  // Fetch fresh data
  await fetchTenantData(websiteName);
};
```

---

## Error Handling

### Fetch Errors

```typescript
try {
  const response = await axiosInstance.post(...);

  // Success handling

} catch (error) {
  console.error("[tenantStore] Error fetching:", error);

  set({
    error: error.message || "Unknown error",
    loadingTenantData: false
  });

  // Optionally show user notification
  toast.error("Failed to load website data");
}
```

### Save Errors

```typescript
try {
  await axiosInstance.post("/v1/tenant-website/save-pages", payload);

  toast.success("Saved!");
} catch (error) {
  console.error("Save error:", error);

  if (error.response?.status === 401) {
    toast.error("Unauthorized - please log in");
    router.push("/login");
  } else if (error.response?.status === 400) {
    toast.error("Invalid data - please check your changes");
  } else {
    toast.error("Failed to save - please try again");
  }
}
```

---

## Loading States

### Usage in Components

```typescript
// In LiveEditor or components
const { tenantData, loading, error } = useTenantStore();

if (loading) {
  return <LoadingSpinner />;
}

if (error) {
  return <ErrorMessage message={error} />;
}

if (!tenantData) {
  return <NoDataMessage />;
}

// Render with data
return <Editor data={tenantData} />;
```

### Loading State Transitions

```
Initial State:
  loadingTenantData: false
  tenantData: null
  error: null

Fetch Started:
  loadingTenantData: true  ← Changed
  tenantData: null
  error: null              ← Cleared

Fetch Success:
  loadingTenantData: false  ← Changed
  tenantData: {...}        ← Set
  error: null

Fetch Error:
  loadingTenantData: false  ← Changed
  tenantData: null
  error: "Error message"   ← Set
```

---

## Integration Points

### Point 1: Initial Load

```
App Loads
  ↓
tenantStore initialized
  ↓
tenantId set (from URL or context)
  ↓
LiveEditorEffects detects tenantId
  ↓
fetchTenantData(tenantId)
  ↓
tenantData loaded
  ↓
editorStore.loadFromDatabase(tenantData)
  ↓
Components render with data
```

### Point 2: Save Operation

```
User makes changes
  ↓
Changes stored in editorStore
  ↓
User clicks "Publish"
  ↓
Build payload from editorStore
  ↓
POST to save-pages endpoint
  ↓
Database updated
  ↓
No need to update tenantStore
  (Will reload on next fetch)
```

### Point 3: Component Access

```typescript
// Components can access tenantStore directly
const tenantData = useTenantStore((s) => s.tenantData);

// Extract tenant-specific data
const getTenantComponentData = () => {
  if (!tenantData?.componentSettings) return {};

  // Search in componentSettings
  for (const [page, components] of Object.entries(
    tenantData.componentSettings,
  )) {
    for (const [id, comp] of Object.entries(components)) {
      if (comp.type === "hero" && comp.id === props.id) {
        return comp.data;
      }
    }
  }

  return {};
};

const tenantComponentData = getTenantComponentData();

// Merge with other sources
const mergedData = {
  ...defaultData,
  ...tenantComponentData,
  ...storeData,
};
```

---

## Important Notes for AI

### When Working with tenantStore

1. **Don't modify tenantData directly**: Use editorStore for editing
2. **tenantStore is READ-ONLY** during editing: Source of initial data only
3. **Use modern save-pages endpoint**: Not legacy individual save functions
4. **Check loading state**: Before accessing tenantData
5. **Handle errors gracefully**: Show user-friendly messages

### Data Flow Direction

```
DATABASE
  ↓ (fetch)
tenantStore.tenantData
  ↓ (transfer)
editorStore (all states)
  ↓ (editing)
tempData + component states
  ↓ (save)
build payload from editorStore
  ↓ (POST)
DATABASE
```

**Notice**: tenantStore NOT updated during editing. It's only the initial data source.

### Common Patterns

**Pattern 1**: Check if data loaded

```typescript
const tenantData = useTenantStore(s => s.tenantData);
const loading = useTenantStore(s => s.loadingTenantData);

if (loading || !tenantData) {
  return <Loading />;
}
```

**Pattern 2**: Extract component data

```typescript
const getTenantComponentData = () => {
  if (!tenantData?.componentSettings) return {};

  // Search all pages
  for (const page of Object.values(tenantData.componentSettings)) {
    for (const comp of Object.values(page)) {
      if (comp.type === myType && comp.id === myId) {
        return comp.data;
      }
    }
  }

  return {};
};
```

**Pattern 3**: Use as fallback

```typescript
const mergedData = {
  ...defaultData, // Priority 1 (lowest)
  ...tenantComponentData, // Priority 2
  ...storeData, // Priority 3
  ...currentStoreData, // Priority 4 (highest)
};
```

---

## Summary

The tenantStore provides:

1. **API integration**: Fetch and save tenant data
2. **Caching**: Prevent duplicate requests
3. **Loading states**: UI feedback during async operations
4. **Error handling**: Graceful failure management
5. **Data structure**: Organized by pages and components

**Key Principles**:

- tenantStore fetches, editorStore edits
- Global components stored separately
- componentSettings organized by page
- Modern save uses single endpoint for all pages
- Cache prevents unnecessary API calls

**Integration**:

- Fetched data loaded into editorStore
- Components read from editorStore, not tenantStore
- Saves use editorStore data, not tenantStore
- tenantStore is initial data source only

Understanding tenantStore is essential for:

- API integration
- Database synchronization
- Initial data loading
- Error handling
- Performance optimization
