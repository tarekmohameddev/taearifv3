# Context-LiveEditor Stores - Complete Overview

## Critical Understanding for AI

This document explains ALL Zustand stores in `context-liveeditor/` directory.

---

## Table of Contents
1. [editorStore](#editorstore)
2. [tenantStore](#tenantstore)
3. [editorI18nStore](#editori18nstore)
4. [clientI18nStore](#clienti18nstore)
5. [SidebarStateManager](#sidebarstatemanager)

---

## editorStore

**Location**: `context-liveeditor/editorStore.ts`

**Purpose**: MAIN state management for ALL component data

**Size**: ~2100 lines

### Store Structure

```typescript
interface EditorStore {
  // ═════════════════════════════════════════════════════════
  // COMPONENT TYPE STATES (19 component types)
  // ═════════════════════════════════════════════════════════
  heroStates: Record<string, ComponentData>;
  headerStates: Record<string, ComponentData>;
  footerStates: Record<string, ComponentData>;
  halfTextHalfImageStates: Record<string, ComponentData>;
  propertySliderStates: Record<string, ComponentData>;
  ctaValuationStates: Record<string, ComponentData>;
  stepsSectionStates: Record<string, ComponentData>;
  testimonialsStates: Record<string, ComponentData>;
  whyChooseUsStates: Record<string, ComponentData>;
  contactMapSectionStates: Record<string, ComponentData>;
  gridStates: Record<string, ComponentData>;
  filterButtonsStates: Record<string, ComponentData>;
  propertyFilterStates: Record<string, ComponentData>;
  mapSectionStates: Record<string, ComponentData>;
  contactFormSectionStates: Record<string, ComponentData>;
  contactCardsStates: Record<string, ComponentData>;
  applicationFormStates: Record<string, ComponentData>;
  inputsStates: Record<string, ComponentData>;
  inputs2States: Record<string, ComponentData>;
  
  // ═════════════════════════════════════════════════════════
  // GLOBAL COMPONENTS (header & footer shared across pages)
  // ═════════════════════════════════════════════════════════
  globalHeaderData: ComponentData;
  globalFooterData: ComponentData;
  globalComponentsData: {
    header: ComponentData;
    footer: ComponentData;
  };
  
  // ═════════════════════════════════════════════════════════
  // PAGE MANAGEMENT
  // ═════════════════════════════════════════════════════════
  pageComponentsByPage: Record<string, ComponentInstance[]>;
  currentPage: string;
  
  // ═════════════════════════════════════════════════════════
  // TEMPORARY EDITING STATE
  // ═════════════════════════════════════════════════════════
  tempData: ComponentData;
  hasChangesMade: boolean;
  
  // ═════════════════════════════════════════════════════════
  // SAVE DIALOG
  // ═════════════════════════════════════════════════════════
  showDialog: boolean;
  openSaveDialogFn: () => void;
  
  // ═════════════════════════════════════════════════════════
  // WEBSITE LAYOUT (SEO meta tags)
  // ═════════════════════════════════════════════════════════
  WebsiteLayout: {
    metaTags: {
      pages: Array<MetaTagPage>;
    };
  };
  
  // ═════════════════════════════════════════════════════════
  // STRUCTURES REGISTRY
  // ═════════════════════════════════════════════════════════
  structures: Record<string, any>;
}
```

### Key Functions

#### Generic Component Functions

**These route to specific component functions**:

```typescript
ensureComponentVariant(type: string, variantId: string, initial?: ComponentData)
  → Routes to heroFunctions.ensureVariant, headerFunctions.ensureVariant, etc.
  → Initializes component in appropriate state (heroStates, headerStates, etc.)

getComponentData(type: string, variantId: string): ComponentData
  → Routes to heroFunctions.getData, headerFunctions.getData, etc.
  → Returns data from appropriate state
  
setComponentData(type: string, variantId: string, data: ComponentData)
  → Routes to heroFunctions.setData, headerFunctions.setData, etc.
  → Updates component state AND pageComponentsByPage
  
updateComponentByPath(type: string, variantId: string, path: string, value: any)
  → Routes to heroFunctions.updateByPath, headerFunctions.updateByPath, etc.
  → Updates specific field AND pageComponentsByPage
```

**Routing Implementation**:

```typescript
getComponentData: (componentType, variantId) => {
  const state = get();
  
  switch (componentType) {
    case "hero":
      return heroFunctions.getData(state, variantId);
    case "header":
      return headerFunctions.getData(state, variantId);
    case "footer":
      return footerFunctions.getData(state, variantId);
    case "halfTextHalfImage":
      return halfTextHalfImageFunctions.getData(state, variantId);
    // ... 15 more cases
    default:
      return state.componentStates[componentType]?.[variantId] || {};
  }
}
```

#### Specific Component Functions (Legacy but still used)

**Direct access to specific component types**:

```typescript
// Hero
ensureHeroVariant(variantId, initial?)
getHeroData(variantId): ComponentData
setHeroData(variantId, data)
updateHeroByPath(variantId, path, value)

// Header
ensureHeaderVariant(variantId, initial?)
getHeaderData(variantId): ComponentData
setHeaderData(variantId, data)
updateHeaderByPath(variantId, path, value)

// ... Same pattern for all 19 component types
```

#### Global Component Functions

```typescript
setGlobalHeaderData(data: ComponentData)
setGlobalFooterData(data: ComponentData)
updateGlobalHeaderByPath(path: string, value: any)
updateGlobalFooterByPath(path: string, value: any)

setGlobalComponentsData(data: { header, footer })
updateGlobalComponentByPath(type: "header"|"footer", path, value)
```

#### Page Management Functions

```typescript
setPageComponentsForPage(page: string, components: ComponentInstance[])
  → Sets all components for a page
  → Adds position property to each

forceUpdatePageComponents(slug: string, components: ComponentInstance[])
  → Updates page components without adding positions
  → Used after edits/moves

createPage(pageData)
  → Creates new page with components

getAllPages(): string[]
  → Returns list of all page slugs

deletePage(slug: string)
  → Removes page from pageComponentsByPage
```

#### Temporary Data Functions

```typescript
setTempData(data: ComponentData)
  → Set temporary editing data

updateTempField(field, key, value)
  → Update simple field in tempData

updateByPath(path: string, value: any)
  → Update nested field in tempData
  → Deep merges with global data for global components
```

#### Database Functions

```typescript
loadFromDatabase(tenantData: any)
  → Loads all data from API response
  → Populates:
    - globalHeaderData, globalFooterData, globalComponentsData
    - All component type states (heroStates, etc.)
    - pageComponentsByPage
```

#### Save Dialog Functions

```typescript
setOpenSaveDialog(fn: () => void)
  → Registers save function from page

requestSave()
  → Sets showDialog = true

closeDialog()
  → Sets showDialog = false
```

#### Change Tracking

```typescript
setHasChangesMade(hasChanges: boolean)
  → Marks if user has unsaved changes
  → Triggers warning dialog on navigation
```

---

## tenantStore

**Location**: `context-liveeditor/tenantStore.jsx`

**Purpose**: API integration, fetch/save tenant data

**Size**: ~1028 lines

### Store Structure

```typescript
interface TenantStore {
  // ═════════════════════════════════════════════════════════
  // DATA STATE
  // ═════════════════════════════════════════════════════════
  tenantData: TenantData | null;
  tenant: any | null;
  tenantId: string | null;
  lastFetchedWebsite: string | null;
  
  // ═════════════════════════════════════════════════════════
  // LOADING STATE
  // ═════════════════════════════════════════════════════════
  loadingTenantData: boolean;
  loading: boolean;  // Alias
  error: string | null;
  
  // ═════════════════════════════════════════════════════════
  // FETCH FUNCTION
  // ═════════════════════════════════════════════════════════
  fetchTenantData: (websiteName: string) => Promise<void>;
  
  // ═════════════════════════════════════════════════════════
  // SETTERS
  // ═════════════════════════════════════════════════════════
  setTenant: (tenant: any) => void;
  setTenantId: (tenantId: string) => void;
  
  // ═════════════════════════════════════════════════════════
  // LEGACY UPDATE FUNCTIONS (mostly unused)
  // ═════════════════════════════════════════════════════════
  updateHeader: (headerData) => void;
  updateHero: (heroData) => void;
  updateFooter: (footerData) => void;
  // ... more legacy functions
  
  // ═════════════════════════════════════════════════════════
  // LEGACY SAVE FUNCTIONS (mostly unused)
  // ═════════════════════════════════════════════════════════
  saveHeaderChanges: (tenantId, data, variant) => Promise<void>;
  saveHeroChanges: (tenantId, data, variant) => Promise<void>;
  // ... more legacy save functions
}
```

### Key Function: fetchTenantData

```typescript
fetchTenantData: async (websiteName) => {
  const state = useTenantStore.getState();
  
  // STEP 1: Cache check - prevent duplicate requests
  if (
    state.loadingTenantData ||
    (state.tenantData && state.tenantData.username === websiteName)
  ) {
    console.log("Skipping fetch - already loaded");
    return;
  }
  
  // STEP 2: Set loading state
  set({ loadingTenantData: true, error: null });
  
  try {
    // STEP 3: API request
    const response = await axiosInstance.post(
      "/v1/tenant-website/getTenant",
      { websiteName }
    );
    
    const data = response.data || {};
    
    // STEP 4: Load into editorStore
    const { useEditorStore } = await import("./editorStore");
    const editorStore = useEditorStore.getState();
    
    if (data.globalComponentsData) {
      editorStore.setGlobalComponentsData(data.globalComponentsData);
    }
    
    if (data.WebsiteLayout) {
      editorStore.setWebsiteLayout(data.WebsiteLayout);
    }
    
    // STEP 5: Update tenantStore
    set({
      tenantData: data,
      loadingTenantData: false,
      lastFetchedWebsite: websiteName
    });
    
  } catch (error) {
    console.error("Error fetching tenant data:", error);
    set({
      error: error.message || "Failed to fetch",
      loadingTenantData: false
    });
  }
}
```

**Usage in LiveEditor**:

```typescript
// In LiveEditorEffects.tsx
const tenantId = useTenantStore(s => s.tenantId);
const fetchTenantData = useTenantStore(s => s.fetchTenantData);

useEffect(() => {
  if (tenantId) {
    fetchTenantData(tenantId);
  }
}, [tenantId]);
```

---

## editorI18nStore

**Location**: `context-liveeditor/editorI18nStore.ts`

**Purpose**: Translations for EDITOR interface

**Size**: ~110 lines

### Store Structure

```typescript
interface EditorI18nState {
  locale: Locale;  // "ar" | "en"
  translations: {
    ar: typeof arTranslations;
    en: typeof enTranslations;
  };
  setLocale: (locale: Locale) => void;
  t: (key: string, params?) => string;
  getCurrentTranslations: () => Translations;
}
```

### Key Features

**Persistent**: Saves locale to localStorage

```typescript
persist(
  (set, get) => ({...}),
  {
    name: "editor-i18n-storage",
    partialize: (state) => ({ locale: state.locale })
  }
)
```

**Translation Function**:

```typescript
t: (key: string, params?) => {
  const { locale, translations } = get();
  const current = translations[locale];
  
  // Navigate nested: "live_editor.save" → current.live_editor.save
  const keys = key.split(".");
  let value = current;
  
  for (const k of keys) {
    if (value && k in value) {
      value = value[k];
    } else {
      // Fallback to default locale
      value = translations[defaultLocale];
      // Try again...
      break;
    }
  }
  
  // Replace parameters: "Hello {{name}}" → "Hello John"
  if (params) {
    return value.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key]?.toString() || match;
    });
  }
  
  return value;
}
```

**Hooks**:

```typescript
// Get translation function
const t = useEditorT();

// Get locale management
const { locale, setLocale } = useEditorLocale();

// Get translations object
const translations = useEditorTranslations();
```

**Usage**:

```typescript
// In EditorSidebar
const t = useEditorT();

return (
  <button>{t("live_editor.save")}</button>
);
```

---

## clientI18nStore

**Location**: `context-liveeditor/clientI18nStore.ts`

**Purpose**: Translations for CLIENT-SIDE components (rendered websites)

**Size**: ~110 lines

### Difference from editorI18nStore

| Aspect | editorI18nStore | clientI18nStore |
|--------|-----------------|-----------------|
| Purpose | Editor UI translations | Client website translations |
| Storage Key | "editor-i18n-storage" | "client-i18n-storage" |
| Hooks | useEditorT, useEditorLocale | useClientT, useClientLocale |
| Used In | Live Editor interface | Tenant websites |

### Store Structure

**IDENTICAL to editorI18nStore** except storage key:

```typescript
interface ClientI18nState {
  locale: Locale;
  translations: typeof translations;
  setLocale: (locale: Locale) => void;
  t: (key, params?) => string;
  getCurrentTranslations: () => Translations;
}
```

**Hooks**:

```typescript
const t = useClientT();                      // Translation function
const { locale, setLocale } = useClientLocale();  // Locale management
const translations = useClientTranslations();     // Translations object
```

**Why Separate?**:

- Editor might be in English while client site in Arabic
- Independent locale preferences
- Prevents conflicts between editor and preview

---

## SidebarStateManager

**Location**: `context-liveeditor/SidebarStateManager.ts`

**Purpose**: LEGACY sidebar state management (mostly UNUSED)

**Size**: ~133 lines

### Store Structure

```typescript
interface SidebarStateManager {
  selectedComponent: ComponentInstanceWithPosition | null;
  currentPage: string;
  
  setSelectedComponent: (component) => void;
  setCurrentPage: (page) => void;
  
  updateComponentData: (componentId, path, value) => void;
  getComponentData: (componentId) => ComponentData | null;
  
  updateGlobalHeader: (path, value) => void;
  updateGlobalFooter: (path, value) => void;
  getGlobalHeaderData: () => ComponentData;
  getGlobalFooterData: () => ComponentData;
}
```

### Why LEGACY/UNUSED?

**Original Purpose**: Manage sidebar state separately from editorStore

**Current Status**: 
- editorStore now handles all state directly
- SidebarStateManager creates circular dependencies
- NOT used in current codebase
- Kept for backward compatibility only

**What to Use Instead**:

```typescript
// ❌ DON'T USE (Legacy)
const { updateComponentData } = useSidebarStateManager();

// ✅ USE (Current)
const store = useEditorStore.getState();
store.updateComponentByPath(type, id, path, value);
```

---

## Store Interaction Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        COMPONENT                             │
│  (e.g., hero1.tsx)                                          │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ├─→ useEditorStore()
                  │   ├─ ensureComponentVariant("hero", id, data)
                  │   ├─ getComponentData("hero", id)
                  │   └─ heroStates (direct access)
                  │
                  ├─→ useTenantStore()
                  │   ├─ tenantData (initial data from database)
                  │   └─ fetchTenantData(tenantId)
                  │
                  └─→ useEditorT() / useClientT()
                      └─ Translations for UI text
                      
┌─────────────────────────────────────────────────────────────┐
│                      EDITORSIDEBAR                           │
│  (editing interface)                                         │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ├─→ useEditorStore()
                  │   ├─ tempData (draft changes)
                  │   ├─ updateByPath(path, value)
                  │   └─ setComponentData(type, id, mergedData)
                  │
                  └─→ useEditorT()
                      └─ Editor UI translations
                      
┌─────────────────────────────────────────────────────────────┐
│                    EDITORPROVIDER                            │
│  (save dialog manager)                                       │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ├─→ useEditorStore()
                  │   ├─ showDialog
                  │   ├─ closeDialog()
                  │   ├─ openSaveDialogFn()
                  │   └─ pageComponentsByPage (for save payload)
                  │
                  └─→ useAuthStore()
                      └─ userData.username (tenantId)
```

---

## Store Access Patterns

### Pattern 1: Reactive Subscription (Re-renders on change)

```typescript
function MyComponent() {
  // Subscribes to tempData - component re-renders when tempData changes
  const tempData = useEditorStore(s => s.tempData);
  
  return <div>{tempData.title}</div>;
}
```

### Pattern 2: Imperative Access (No subscription)

```typescript
function handleClick() {
  // Gets current state without subscribing
  const store = useEditorStore.getState();
  const data = store.getComponentData("hero", id);
  
  console.log(data);
}
```

### Pattern 3: Multi-Property Subscription

```typescript
function MyComponent() {
  // Subscribes to multiple properties
  const { tempData, hasChangesMade, currentPage } = useEditorStore(s => ({
    tempData: s.tempData,
    hasChangesMade: s.hasChangesMade,
    currentPage: s.currentPage
  }));
  
  return <div>{currentPage} - {hasChangesMade ? "Modified" : "Clean"}</div>;
}
```

### Pattern 4: Selective Subscription (Performance)

```typescript
// ✅ GOOD - Only re-renders when heroStates[id] changes
const heroData = useEditorStore(s => s.heroStates[id]);

// ❌ BAD - Re-renders when ANY heroStates change
const heroStates = useEditorStore(s => s.heroStates);
const heroData = heroStates[id];
```

---

## Store Initialization

### editorStore Initialization

```typescript
export const useEditorStore = create<EditorStore>((set, get) => ({
  // Initial state
  showDialog: false,
  openSaveDialogFn: () => {},
  tempData: {},
  currentPage: "homepage",
  hasChangesMade: false,
  
  // Initialize global components with defaults
  globalHeaderData: getDefaultHeaderData(),
  globalFooterData: getDefaultFooterData(),
  globalComponentsData: {
    header: getDefaultHeaderData(),
    footer: getDefaultFooterData()
  },
  
  // Initialize WebsiteLayout
  WebsiteLayout: {
    metaTags: { pages: [] }
  },
  
  // Initialize structures registry
  structures: Object.keys(COMPONENTS).reduce((acc, type) => {
    acc[type] = COMPONENTS[type];
    return acc;
  }, {}),
  
  // Initialize all component states as empty
  heroStates: {},
  headerStates: {},
  footerStates: {},
  // ... all 19 types = {}
  
  // Initialize page components
  pageComponentsByPage: {},
  
  // ... all functions
}));
```

### tenantStore Initialization

```typescript
const useTenantStore = create((set) => ({
  tenantData: null,
  loadingTenantData: false,
  error: null,
  tenant: null,
  tenantId: null,
  lastFetchedWebsite: null,
  
  // Functions...
}));
```

### i18nStore Initialization

```typescript
export const useEditorI18nStore = create<EditorI18nState>()(
  persist(
    (set, get) => ({
      locale: defaultLocale,  // "ar"
      translations: { ar: arTranslations, en: enTranslations },
      
      // Functions...
    }),
    {
      name: "editor-i18n-storage",
      partialize: (state) => ({ locale: state.locale })
    }
  )
);
```

---

## Important Rules for AI

### Rule 1: editorStore is Authoritative

```
tenantStore → Fetches from API
editorStore → Manages editing
pageComponentsByPage → Source of truth for saves
```

**Don't modify tenantStore during editing!**

### Rule 2: Use Generic Functions

```typescript
// ✅ CORRECT - Use generic function
store.getComponentData("hero", id)

// ❌ WRONG - Don't access state directly
store.heroStates[id]
```

**Why?**: Generic functions might have additional logic (defaults, validation)

### Rule 3: Both i18n Stores Serve Different Purposes

```typescript
// For Editor UI
const t = useEditorT();
<button>{t("live_editor.save")}</button>

// For Client Websites
const t = useClientT();
<h1>{t("website.homepage.title")}</h1>
```

### Rule 4: SidebarStateManager is LEGACY

```typescript
// ❌ DON'T USE
import { useSidebarStateManager } from "@/context-liveeditor/SidebarStateManager";

// ✅ USE
import { useEditorStore } from "@/context-liveeditor/editorStore";
```

---

## Summary

### Store Responsibilities

**editorStore**:
- ALL component states (19 types)
- Global components (header/footer)
- Page management (pageComponentsByPage)
- Temporary editing (tempData)
- Save dialog state
- WebsiteLayout (SEO)

**tenantStore**:
- Fetch from API
- Cache tenant data
- Loading states
- Provides initial data to editorStore

**editorI18nStore**:
- Editor UI translations
- Locale management
- Persisted to localStorage

**clientI18nStore**:
- Client website translations
- Independent locale
- Persisted separately

**SidebarStateManager**:
- LEGACY - Don't use

### Key Characteristics

| Store | Provider Needed? | Persistent? | Purpose |
|-------|------------------|-------------|---------|
| editorStore | ❌ No (Zustand) | ❌ No | State management |
| tenantStore | ❌ No (Zustand) | ❌ No | API integration |
| editorI18nStore | ❌ No (Zustand) | ✅ Yes (locale) | Editor i18n |
| clientI18nStore | ❌ No (Zustand) | ✅ Yes (locale) | Client i18n |
| SidebarStateManager | ❌ No (Zustand) | ❌ No | Legacy/unused |

---

**For AI**: Understand these 5 stores and their distinct responsibilities. Focus on editorStore (main) and tenantStore (API). The i18n stores are for translations only.

