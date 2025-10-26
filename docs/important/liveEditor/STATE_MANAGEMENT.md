# State Management - Deep Dive

## Table of Contents
1. [Overview](#overview)
2. [Store Architecture](#store-architecture)
3. [State Types](#state-types)
4. [Component State Functions](#component-state-functions)
5. [Global Components Management](#global-components-management)
6. [Page Components Management](#page-components-management)
7. [Temporary Data (tempData)](#temporary-data-tempdata)
8. [Store Synchronization](#store-synchronization)
9. [Database Integration](#database-integration)

---

## Overview

The Live Editor uses **Zustand** for state management with a sophisticated multi-layered architecture. The system maintains separate state slices for each component type while providing unified access patterns.

### Core Stores

1. **editorStore** (`context-liveeditor/editorStore.ts`)
   - Central state management
   - All component states
   - Global components
   - Page aggregation
   - Temporary editing data

2. **tenantStore** (`context-liveeditor/tenantStore.jsx`)
   - Tenant data from API
   - Database loading/saving
   - Tenant-specific settings

3. **editorI18nStore** (`context-liveeditor/editorI18nStore.ts`)
   - Localization/translations
   - Language switching

---

## Store Architecture

### editorStore Structure

```typescript
interface EditorStore {
  // =================================================================
  // SAVE DIALOG STATE
  // =================================================================
  showDialog: boolean;
  openSaveDialogFn: OpenDialogFn;
  setOpenSaveDialog: (fn: OpenDialogFn) => void;
  requestSave: () => void;
  closeDialog: () => void;
  
  // =================================================================
  // CHANGE TRACKING
  // =================================================================
  hasChangesMade: boolean;
  setHasChangesMade: (hasChanges: boolean) => void;
  
  // =================================================================
  // CURRENT PAGE TRACKING
  // =================================================================
  currentPage: string;  // e.g., "homepage", "about-us", "global-header"
  setCurrentPage: (page: string) => void;
  
  // =================================================================
  // TEMPORARY EDITING STATE
  // =================================================================
  tempData: ComponentData;
  setTempData: (data: ComponentData) => void;
  updateTempField: (field, key, value) => void;
  updateByPath: (path: string, value: any) => void;
  
  // =================================================================
  // GLOBAL COMPONENTS (Header & Footer)
  // =================================================================
  globalHeaderData: ComponentData;
  globalFooterData: ComponentData;
  setGlobalHeaderData: (data: ComponentData) => void;
  setGlobalFooterData: (data: ComponentData) => void;
  updateGlobalHeaderByPath: (path: string, value: any) => void;
  updateGlobalFooterByPath: (path: string, value: any) => void;
  
  // Unified global components data
  globalComponentsData: {
    header: ComponentData;
    footer: ComponentData;
  };
  setGlobalComponentsData: (data) => void;
  updateGlobalComponentByPath: (type, path, value) => void;
  
  // =================================================================
  // COMPONENT TYPE STATES (One per component type)
  // =================================================================
  heroStates: Record<string, ComponentData>;
  headerStates: Record<string, ComponentData>;
  footerStates: Record<string, ComponentData>;
  halfTextHalfImageStates: Record<string, ComponentData>;
  propertySliderStates: Record<string, ComponentData>;
  ctaValuationStates: Record<string, ComponentData>;
  testimonialsStates: Record<string, ComponentData>;
  // ... and more
  
  // =================================================================
  // GENERIC COMPONENT FUNCTIONS
  // =================================================================
  ensureComponentVariant: (type, variantId, initial?) => void;
  getComponentData: (type, variantId) => ComponentData;
  setComponentData: (type, variantId, data) => void;
  updateComponentByPath: (type, variantId, path, value) => void;
  
  // =================================================================
  // SPECIFIC COMPONENT FUNCTIONS (Legacy, but still used)
  // =================================================================
  ensureHeroVariant: (variantId, initial?) => void;
  getHeroData: (variantId) => ComponentData;
  setHeroData: (variantId, data) => void;
  updateHeroByPath: (variantId, path, value) => void;
  // ... repeated for each component type
  
  // =================================================================
  // PAGE AGGREGATION
  // =================================================================
  pageComponentsByPage: Record<string, ComponentInstance[]>;
  setPageComponentsForPage: (page, components) => void;
  forceUpdatePageComponents: (slug, components) => void;
  
  // =================================================================
  // DATABASE OPERATIONS
  // =================================================================
  loadFromDatabase: (tenantData) => void;
  
  // =================================================================
  // PAGE MANAGEMENT
  // =================================================================
  createPage: (pageData) => void;
  getAllPages: () => string[];
  deletePage: (slug) => void;
  
  // =================================================================
  // META TAGS / SEO
  // =================================================================
  WebsiteLayout: {
    metaTags: {
      pages: Array<{
        path: string;
        TitleAr: string;
        TitleEn: string;
        DescriptionAr: string;
        DescriptionEn: string;
        // ... more meta fields
      }>;
    };
  };
  setWebsiteLayout: (data) => void;
  addPageToWebsiteLayout: (pageData) => void;
}
```

---

## State Types

### 1. Component Type States

**Purpose**: Store data for each component instance, grouped by component type

**Structure**:
```typescript
heroStates: {
  "uuid-1234": {           // Component instance ID (UUID)
    visible: true,
    content: {
      title: "Welcome"
    },
    // ... component data
  },
  "uuid-5678": {           // Another instance
    visible: true,
    content: {
      title: "Different Title"
    }
  }
}
```

**Key Points**:
- Key is component.id (UUID), NOT componentName
- Each instance has completely independent data
- Multiple instances of same type can exist on same page
- Data persists across re-renders

### 2. Global Component States

**Purpose**: Store header and footer data shared across ALL pages

**Structure**:
```typescript
globalHeaderData: {
  visible: true,
  logo: {
    type: "image+text",
    text: "Company Name",
    image: "/logo.svg"
  },
  menu: [
    { id: "home", type: "link", text: "Home", url: "/" },
    { id: "about", type: "link", text: "About", url: "/about" }
  ],
  // ... more header data
}

globalFooterData: {
  visible: true,
  content: {
    companyInfo: {...},
    quickLinks: {...},
    contactInfo: {...}
  },
  // ... more footer data
}
```

**Key Points**:
- NOT stored in pageComponentsByPage
- Edited with special IDs: `"global-header"` and `"global-footer"`
- Saved separately in API payload
- Unified in `globalComponentsData` object

### 3. Page Components By Page

**Purpose**: Aggregate all components for each page for database persistence

**Structure**:
```typescript
pageComponentsByPage: {
  "homepage": [
    {
      id: "uuid-1",
      type: "hero",
      name: "Hero",
      componentName: "hero1",
      data: {...},
      position: 0,
      layout: { row: 0, col: 0, span: 2 }
    },
    {
      id: "uuid-2",
      type: "halfTextHalfImage",
      name: "Half Text Half Image",
      componentName: "halfTextHalfImage1",
      data: {...},
      position: 1,
      layout: { row: 1, col: 0, span: 2 }
    }
  ],
  "about-us": [
    // About page components
  ],
  "contact": [
    // Contact page components
  ]
}
```

**Key Points**:
- Keys are page slugs ("homepage", "about-us", etc.)
- Values are arrays of component instances
- Position property indicates render order
- This is what gets saved to database
- Does NOT include global header/footer

### 4. Temporary Data (tempData)

**Purpose**: Hold draft changes while editing, before saving

**Lifecycle**:
1. User clicks component to edit
2. tempData initialized with component's current data
3. User makes changes → tempData updated
4. User clicks "Save Changes" → tempData merged into component states
5. User clicks "Cancel" → tempData discarded

**Usage**:
```typescript
// Initialize when opening editor
setTempData(currentComponentData);

// Update as user types
updateByPath("content.title", "New Title");

// Save changes
const mergedData = deepMerge(existingData, storeData, tempData);
setComponentData(type, id, mergedData);

// Cancel - just clear tempData
setTempData({});
```

---

## Component State Functions

### Pattern Overview

Each component type has 4 core functions:

```typescript
export const heroFunctions = {
  ensureVariant,  // Initialize if not exists
  getData,        // Retrieve data
  setData,        // Set/replace data
  updateByPath    // Update specific field
};
```

### 1. ensureVariant

**Purpose**: Ensure component exists in store with proper initialization

**Signature**:
```typescript
ensureVariant: (
  state: any,
  variantId: string,
  initial?: ComponentData
) => Partial<EditorStore>
```

**Logic**:
```typescript
ensureVariant: (state, variantId, initial?) => {
  // Priority 1: If initial data provided, ALWAYS use it
  if (initial && Object.keys(initial).length > 0) {
    return {
      heroStates: {
        ...state.heroStates,
        [variantId]: initial
      }
    };
  }
  
  // Priority 2: If variant already exists, do nothing
  if (
    state.heroStates[variantId] &&
    Object.keys(state.heroStates[variantId]).length > 0
  ) {
    return {}; // No changes needed
  }
  
  // Priority 3: Create with default data
  const defaultData = getDefaultHeroData();
  const data = initial || state.tempData || defaultData;
  
  return {
    heroStates: {
      ...state.heroStates,
      [variantId]: data
    }
  };
}
```

**When Called**:
- Component first render with `useStore={true}`
- Opening EditorSidebar for a component
- Adding new component to page
- Loading from database

**Important**:
- variantId is component.id (UUID), not componentName
- Always returns partial state (only fields that changed)
- Never mutates existing state

### 2. getData

**Purpose**: Retrieve component data from store

**Signature**:
```typescript
getData: (state: any, variantId: string) => ComponentData
```

**Logic**:
```typescript
getData: (state, variantId) => {
  return state.heroStates[variantId] || {};
}
```

**When Called**:
- Component rendering to get current data
- EditorSidebar loading data for editing
- Merging data from multiple sources

**Important**:
- Returns empty object if not found (never undefined)
- Does NOT initialize missing variants
- Fast, synchronous operation

### 3. setData

**Purpose**: Set/replace component data completely

**Signature**:
```typescript
setData: (
  state: any,
  variantId: string,
  data: ComponentData
) => Partial<EditorStore>
```

**Logic**:
```typescript
setData: (state, variantId, data) => {
  const currentPage = state.currentPage;
  const updatedPageComponents = 
    state.pageComponentsByPage[currentPage] || [];
  
  // Update page components to keep in sync
  const updatedComponents = updatedPageComponents.map((comp) => {
    if (comp.type === "hero" && comp.id === variantId) {
      return { ...comp, data: data };
    }
    return comp;
  });
  
  return {
    heroStates: {
      ...state.heroStates,
      [variantId]: data
    },
    pageComponentsByPage: {
      ...state.pageComponentsByPage,
      [currentPage]: updatedComponents
    }
  };
}
```

**When Called**:
- Saving changes from EditorSidebar
- Resetting component to defaults
- Changing component theme
- Loading from database

**Important**:
- Completely replaces component data
- Updates BOTH component state AND pageComponentsByPage
- Synchronizes page components array

### 4. updateByPath

**Purpose**: Update a specific field via dot-notation path

**Signature**:
```typescript
updateByPath: (
  state: any,
  variantId: string,
  path: string,
  value: any
) => Partial<EditorStore>
```

**Logic**:
```typescript
updateByPath: (state, variantId, path, value) => {
  const source = state.heroStates[variantId] || {};
  const newData = updateDataByPath(source, path, value);
  
  const currentPage = state.currentPage;
  const updatedPageComponents = 
    state.pageComponentsByPage[currentPage] || [];
  
  const updatedComponents = updatedPageComponents.map((comp) => {
    if (comp.type === "hero" && comp.id === variantId) {
      return { ...comp, data: newData };
    }
    return comp;
  });
  
  return {
    heroStates: {
      ...state.heroStates,
      [variantId]: newData
    },
    pageComponentsByPage: {
      ...state.pageComponentsByPage,
      [currentPage]: updatedComponents
    }
  };
}
```

**Path Examples**:
```typescript
"content.title"                    // Simple nested path
"menu[0].text"                    // Array element
"background.overlay.opacity"      // Deep nesting
"content.stats.stat1.value"       // Multiple levels
```

**When Called**:
- User typing in EditorSidebar fields
- Real-time updates during editing
- Programmatic field updates

**Important**:
- Uses updateDataByPath() helper for path parsing
- Handles arrays with bracket notation: `[0]`, `[1]`
- Creates missing intermediate objects/arrays
- Updates BOTH component state AND pageComponentsByPage

---

## Global Components Management

### Why Special Handling?

Global components (header/footer) are unique:
- Shared across ALL pages
- Do NOT belong to any specific page
- NOT included in `pageComponentsByPage`
- Edited with special IDs: `"global-header"` and `"global-footer"`
- Saved in separate fields in API payload

### State Storage

**Three separate storage locations**:

1. **globalHeaderData** / **globalFooterData**
   - Individual stores for backward compatibility
   - Direct access: `useEditorStore((s) => s.globalHeaderData)`

2. **globalComponentsData**
   - Unified object: `{ header: {...}, footer: {...} }`
   - Modern approach for cleaner API

3. **Temporary during editing**
   - When editing global header: `tempData` holds draft changes
   - `currentPage` set to `"global-header"` or `"global-footer"`

### Update Functions

#### updateGlobalHeaderByPath

```typescript
updateGlobalHeaderByPath: (path, value) =>
  set((state) => {
    const segments = path
      .replace(/\[(\d+)\]/g, ".$1")
      .split(".")
      .filter(Boolean);
    
    // Get current data or use defaults
    let currentData = state.globalHeaderData;
    if (!currentData || Object.keys(currentData).length === 0) {
      currentData = getDefaultHeaderData();
    }
    
    // Deep clone to avoid mutations
    let newData = { ...currentData };
    let cursor = newData;
    
    // Navigate to target path
    for (let i = 0; i < segments.length - 1; i++) {
      const key = segments[i];
      const nextIsIndex = !isNaN(Number(segments[i + 1]));
      
      // Create structure as needed
      if (cursor[key] == null) {
        cursor[key] = nextIsIndex ? [] : {};
      }
      cursor = cursor[key];
    }
    
    // Set final value
    const lastKey = segments[segments.length - 1];
    cursor[lastKey] = value;
    
    // Force new reference for React re-render
    return {
      globalHeaderData: JSON.parse(JSON.stringify(newData))
    };
  })
```

**Key Points**:
- Uses default data if current data empty
- Deep clones to avoid mutations
- Creates intermediate structures automatically
- Forces new reference with JSON.parse(JSON.stringify())

#### updateGlobalComponentByPath

```typescript
updateGlobalComponentByPath: (componentType, path, value) =>
  set((state) => {
    const segments = path
      .replace(/\[(\d+)\]/g, ".$1")
      .split(".")
      .filter(Boolean);
    
    // Get current data or defaults
    let currentData = state.globalComponentsData[componentType];
    if (!currentData || Object.keys(currentData).length === 0) {
      currentData = componentType === "header"
        ? getDefaultHeaderData()
        : getDefaultFooterData();
    }
    
    // Deep clone and navigate
    let newData = JSON.parse(JSON.stringify(currentData));
    let cursor = newData;
    
    for (let i = 0; i < segments.length - 1; i++) {
      const key = segments[i];
      const nextIsIndex = !isNaN(Number(segments[i + 1]));
      
      if (cursor[key] == null) {
        cursor[key] = nextIsIndex ? [] : {};
      }
      cursor = cursor[key];
    }
    
    cursor[segments[segments.length - 1]] = value;
    
    return {
      globalComponentsData: {
        ...state.globalComponentsData,
        [componentType]: newData
      }
    };
  })
```

### Editing Flow for Global Components

```
1. User clicks header in iframe
   ↓
2. handleEditClick("global-header")
   ↓
3. EditorSidebar opens
   ↓
4. setCurrentPage("global-header")
   ↓
5. setTempData(globalHeaderData)
   ↓
6. User edits fields
   ↓
7. updateByPath("menu[0].text", "New Text")
   ↓ (Updates tempData)
8. User clicks "Save Changes"
   ↓
9. setGlobalHeaderData(tempData)
   ↓
10. setGlobalComponentsData({ ...existing, header: tempData })
    ↓
11. onComponentUpdate("global-header", tempData)
```

---

## Page Components Management

### pageComponentsByPage

**Purpose**: Track all components for each page

**Structure**:
```typescript
{
  "homepage": [
    {
      id: "uuid-abc",
      type: "hero",
      name: "Hero",
      componentName: "hero1",
      data: {...},
      position: 0
    },
    {
      id: "uuid-def",
      type: "halfTextHalfImage",
      name: "Half Text Half Image",
      componentName: "halfTextHalfImage3",
      data: {...},
      position: 1
    }
  ],
  "about-us": [...]
}
```

### setPageComponentsForPage

```typescript
setPageComponentsForPage: (page, components) =>
  set((state) => {
    const withPositions = components.map((c, index) => ({
      ...c,
      position: index
    }));
    
    return {
      pageComponentsByPage: {
        ...state.pageComponentsByPage,
        [page]: withPositions
      }
    };
  })
```

**When Called**:
- Initial page load
- After drag & drop reordering
- After adding/deleting components

### forceUpdatePageComponents

```typescript
forceUpdatePageComponents: (slug, components) =>
  set((state) => {
    return {
      pageComponentsByPage: {
        ...state.pageComponentsByPage,
        [slug]: components
      }
    };
  })
```

**When Called**:
- Save button in EditorSidebar
- Component theme change
- Component reset
- Drag & drop completion

**Difference from setPageComponentsForPage**:
- Does NOT add position property
- Directly uses provided components array
- Used when components already have correct positions

---

## Temporary Data (tempData)

### Purpose

Hold draft changes while editing in EditorSidebar, without affecting live preview until "Save Changes" is clicked.

### Lifecycle

```
1. Component Edit Initiated
   ↓
2. Initialize tempData
   setTempData(component.data || defaultData)
   ↓
3. User Makes Changes
   updateByPath("content.title", "New Title")
   ↓ (Updates tempData only)
4a. User Saves
    mergedData = deepMerge(existing, store, tempData)
    setComponentData(type, id, mergedData)
    setTempData({})  // Clear
    ↓
4b. User Cancels
    setTempData({})  // Clear without saving
```

### Update Functions

#### updateByPath (for tempData)

```typescript
updateByPath: (path, value) =>
  set((state) => {
    const segments = path
      .replace(/\[(\d+)\]/g, ".$1")
      .split(".")
      .filter(Boolean);
    
    // Initialize with current data
    let newData = { ...(state.tempData || {}) };
    
    // Special handling for global components
    if (state.currentPage === "global-header") {
      // Merge with globalHeaderData to preserve existing fields
      newData = deepMerge(state.globalHeaderData, state.tempData);
    } else if (state.currentPage === "global-footer") {
      newData = deepMerge(state.globalFooterData, state.tempData);
    }
    
    // Navigate and update
    let cursor = newData;
    for (let i = 0; i < segments.length - 1; i++) {
      const key = segments[i];
      const nextIsIndex = !isNaN(Number(segments[i + 1]));
      
      if (cursor[key] == null) {
        cursor[key] = nextIsIndex ? [] : {};
      }
      cursor = cursor[key];
    }
    
    cursor[segments[segments.length - 1]] = value;
    
    return { tempData: newData };
  })
```

**Key Points**:
- Only updates tempData, not component states
- Deep merges with global data for global components
- Creates intermediate structures automatically
- Does NOT trigger immediate save

---

## Store Synchronization

### The Synchronization Challenge

The system maintains consistency between:
1. Component type states (heroStates, headerStates, etc.)
2. pageComponentsByPage
3. Local React state (pageComponents in LiveEditor)
4. tempData during editing

### Synchronization Points

#### Point 1: Component Data Update

When updating via `setComponentData` or `updateComponentByPath`:

```typescript
// These functions MUST update:
1. Component type state (e.g., heroStates[id])
2. pageComponentsByPage[currentPage][index].data

// Example from setData:
return {
  heroStates: {
    ...state.heroStates,
    [variantId]: data
  },
  pageComponentsByPage: {
    ...state.pageComponentsByPage,
    [currentPage]: updatedComponents  // ← Also updated!
  }
};
```

#### Point 2: EditorSidebar Save

When user clicks "Save Changes" in EditorSidebar:

```typescript
handleSave() {
  const store = useEditorStore.getState();
  const storeData = store.getComponentData(type, id);
  
  // Merge all data sources
  const mergedData = deepMerge(
    existingComponent.data,  // Old data
    storeData,              // Store updates
    tempData                // Latest edits
  );
  
  // Update store
  store.setComponentData(type, id, mergedData);
  
  // Update pageComponentsByPage
  store.forceUpdatePageComponents(currentPage, updatedComponents);
  
  // Update local state
  onComponentUpdate(id, mergedData);
}
```

#### Point 3: Drag & Drop

When user reorders components:

```typescript
handleDragEndLocal(event) {
  setPageComponents((current) => {
    const newComponents = applyDragDropLogic(current);
    
    // Update store immediately
    setTimeout(() => {
      const store = useEditorStore.getState();
      store.forceUpdatePageComponents(slug, newComponents);
    }, 0);
    
    return newComponents;
  });
}
```

**Note**: setTimeout with 0ms prevents render cycle issues

#### Point 4: Component Addition

When adding new component:

```typescript
handleAddSection(type) {
  const newComponent = {
    id: uuidv4(),
    type,
    componentName: `${type}1`,
    data: createDefaultData(type)
  };
  
  // Add to local state
  setPageComponents([...current, newComponent]);
  
  // Sync with store (deferred to avoid render cycles)
  setTimeout(() => {
    const store = useEditorStore.getState();
    const updated = [...store.pageComponentsByPage[currentPage], newComponent];
    store.forceUpdatePageComponents(currentPage, updated);
  }, 0);
}
```

### Why setTimeout(fn, 0)?

**Problem**: Direct store updates from event handlers can cause React render cycles

**Solution**: Defer store updates to next tick

```typescript
// ❌ BAD - Can cause render cycle
handleClick() {
  setLocalState(newValue);
  store.updateStore(newValue);  // Immediate
}

// ✅ GOOD - Deferred update
handleClick() {
  setLocalState(newValue);
  setTimeout(() => {
    store.updateStore(newValue);
  }, 0);
}
```

---

## Database Integration

### Loading from Database

#### Flow:
```
1. User logs in and navigates to /live-editor/homepage
   ↓
2. useTenantStore fetches tenant data
   fetchTenantData(tenantId)
   ↓
3. API returns tenantData with componentSettings
   ↓
4. LiveEditorEffects detects tenantData ready
   ↓
5. editorStore.loadFromDatabase(tenantData)
   ↓
6. Data loaded into:
   - globalHeaderData
   - globalFooterData
   - globalComponentsData
   - heroStates, headerStates, etc.
   - pageComponentsByPage
   ↓
7. setPageComponents() updates local state
   ↓
8. Components render in iframe with loaded data
```

#### loadFromDatabase Implementation

```typescript
loadFromDatabase: (tenantData) =>
  set((state) => {
    const newState = { ...state };
    
    // Load global components
    if (tenantData.globalHeaderData) {
      newState.globalHeaderData = tenantData.globalHeaderData;
    }
    
    if (tenantData.globalFooterData) {
      newState.globalFooterData = tenantData.globalFooterData;
    }
    
    if (tenantData.globalComponentsData) {
      newState.globalComponentsData = tenantData.globalComponentsData;
    }
    
    // Load page components
    Object.entries(tenantData.componentSettings).forEach(
      ([page, pageSettings]) => {
        const components = Object.entries(pageSettings).map(
          ([id, comp]) => ({
            id,
            ...comp,
            position: comp.position ?? 0
          })
        );
        
        newState.pageComponentsByPage[page] = components;
        
        // Load into component type stores
        components.forEach((comp) => {
          switch (comp.type) {
            case "hero":
              newState.heroStates = heroFunctions.setData(
                newState,
                comp.id,      // ✅ Use comp.id, not componentName
                comp.data
              ).heroStates;
              break;
            // ... repeat for all component types
          }
        });
      }
    );
    
    return newState;
  })
```

**Critical**: Uses `comp.id` as variant identifier, NOT `comp.componentName`

### Saving to Database

#### Flow:
```
1. User makes changes (edits, adds, deletes components)
   ↓
2. hasChangesMade set to true
   ↓
3. User clicks "Publish" or "Save" button
   ↓
4. editorStore.openSaveDialogFn() called
   ↓
5. SaveConfirmationDialog opens
   ↓
6. User confirms
   ↓
7. Create payload:
   {
     tenantId,
     pages: pageComponentsByPage,
     globalComponentsData: { header, footer }
   }
   ↓
8. POST to /v1/tenant-website/save-pages
   ↓
9. Database updated
   ↓
10. hasChangesMade reset to false
```

#### Save Function Registration

```typescript
// In LiveEditorEffects.tsx
useEffect(() => {
  const saveFn = () => {
    // Force update store with current state
    useEditorStore.getState()
      .forceUpdatePageComponents(slug, pageComponents);
  };
  
  // Register save function
  useEditorStore.getState().setOpenSaveDialog(saveFn);
  
  // Cleanup on unmount
  return () => {
    useEditorStore.getState().setOpenSaveDialog(() => {});
  };
}, [slug, pageComponents]);
```

**Why?**: Allows external components (like app header) to trigger save

---

## Common Operations

### Operation 1: Initialize Component in Store

```typescript
// Component wants to use store
useEffect(() => {
  if (props.useStore) {
    const initialData = {
      ...getDefaultHeroData(),
      ...props
    };
    
    ensureComponentVariant("hero", uniqueId, initialData);
  }
}, [uniqueId, props.useStore]);
```

### Operation 2: Get Component Data

```typescript
// Get data for rendering
const storeData = useEditorStore.getState()
  .getComponentData("hero", component.id);

const mergedData = storeData || component.data;

return <Hero {...mergedData} />;
```

### Operation 3: Update Component Field

```typescript
// Update title field
useEditorStore.getState().updateComponentByPath(
  "hero",               // type
  "uuid-1234",          // component ID
  "content.title",      // path
  "New Title"           // value
);

// This updates:
// - heroStates["uuid-1234"].content.title
// - pageComponentsByPage[currentPage][index].data.content.title
```

### Operation 4: Change Component Theme

```typescript
handleComponentThemeChange(id, newTheme) {
  setPageComponents((current) =>
    current.map((c) => {
      if (c.id === id) {
        const newDefaultData = createDefaultData(c.type, newTheme);
        
        // Update store asynchronously
        setTimeout(() => {
          store.setComponentData(c.type, c.id, newDefaultData);
          store.forceUpdatePageComponents(currentPage, updatedComponents);
        }, 0);
        
        return {
          ...c,
          componentName: newTheme,
          data: newDefaultData
        };
      }
      return c;
    })
  );
}
```

### Operation 5: Reset Component

```typescript
handleComponentReset(id) {
  setPageComponents((current) =>
    current.map((c) => {
      if (c.id === id) {
        const defaultData = createDefaultData(c.type, c.componentName);
        
        // Update store asynchronously
        setTimeout(() => {
          store.setComponentData(c.type, id, defaultData);
          store.forceUpdatePageComponents(currentPage, updatedComponents);
        }, 0);
        
        return {
          ...c,
          data: defaultData
        };
      }
      return c;
    })
  );
}
```

---

## Important Rules for AI

### Rule 1: Always Use component.id as Identifier
```typescript
// ✅ CORRECT
getComponentData("hero", component.id)
updateComponentByPath("hero", component.id, path, value)

// ❌ WRONG
getComponentData("hero", component.componentName)
updateComponentByPath("hero", "hero1", path, value)
```

**Why**: Multiple instances can have same componentName but different IDs

### Rule 2: Update ALL Relevant Stores

```typescript
// When updating component data, MUST update:

// 1. Component type state
heroStates[id] = newData;

// 2. pageComponentsByPage
pageComponentsByPage[currentPage][index].data = newData;

// Implemented in component functions:
setData: (state, variantId, data) => ({
  heroStates: { ...state.heroStates, [variantId]: data },
  pageComponentsByPage: {
    ...state.pageComponentsByPage,
    [state.currentPage]: updatedComponents
  }
})
```

### Rule 3: Use setTimeout for Store Updates from Handlers

```typescript
// In event handlers:
setTimeout(() => {
  const store = useEditorStore.getState();
  store.forceUpdatePageComponents(slug, components);
}, 0);
```

### Rule 4: Deep Merge When Combining Data

```typescript
// ✅ CORRECT - Deep merge
const mergedData = deepMerge(
  deepMerge(existingData, storeData),
  tempData
);

// ❌ WRONG - Shallow merge (loses nested data)
const mergedData = {
  ...existingData,
  ...storeData,
  ...tempData
};
```

### Rule 5: Check for Global Components

```typescript
// ALWAYS check if editing global component
if (selectedComponent.id === "global-header") {
  // Use global header functions
  updateGlobalHeaderByPath(path, value);
} else if (selectedComponent.id === "global-footer") {
  // Use global footer functions
  updateGlobalFooterByPath(path, value);
} else {
  // Use regular component functions
  updateComponentByPath(type, id, path, value);
}
```

### Rule 6: Initialize Before Accessing

```typescript
// Ensure component exists before getting data
ensureComponentVariant(type, id, initialData);

// Then safe to get
const data = getComponentData(type, id);
```

---

## Debug Tips

### Check Current State

```typescript
// In browser console
const state = useEditorStore.getState();

console.log("Page Components:", state.pageComponentsByPage.homepage);
console.log("Hero States:", state.heroStates);
console.log("Global Header:", state.globalHeaderData);
console.log("Temp Data:", state.tempData);
console.log("Current Page:", state.currentPage);
console.log("Has Changes:", state.hasChangesMade);
```

### Trace Data Flow

```typescript
// Add console logs to track data flow
console.log("🔍 [Component] Initializing:", { id, type, componentName });
console.log("🔍 [Store] Ensuring variant:", { type, variantId, initial });
console.log("🔍 [Update] Path update:", { path, value, currentData });
console.log("🔍 [Save] Merging data:", { existing, store, temp, merged });
```

### Common Issues

**Issue**: Component not updating in iframe
- **Check**: Is component state being updated?
- **Check**: Is pageComponentsByPage being updated?
- **Check**: Is component re-rendering (check key prop)?

**Issue**: Data lost after save
- **Check**: Is deep merge used (not shallow)?
- **Check**: Are all stores updated (not just one)?
- **Check**: Is tempData being merged into final data?

**Issue**: Global component changes not persisting
- **Check**: Is globalComponentsData being updated?
- **Check**: Is save payload including globalComponentsData?
- **Check**: Is component ID "global-header" or "global-footer"?

---

## Summary

The Live Editor state management system is complex but follows consistent patterns:

1. **Each component type has dedicated state** (heroStates, headerStates, etc.)
2. **Each component instance identified by UUID** (component.id)
3. **Generic functions route to component-specific functions** (via switch statements)
4. **All updates must synchronize multiple stores** (component state + pageComponentsByPage)
5. **Global components have special handling** (separate from page components)
6. **tempData holds drafts** (merged on save)
7. **Database operations use pageComponentsByPage** (source of truth)

Understanding these principles is essential for working with the Live Editor effectively.

