# API Reference - Complete Function Documentation

## Table of Contents

1. [editorStore API](#editorstore-api)
2. [tenantStore API](#tenantstore-api)
3. [Component Functions API](#component-functions-api)
4. [ComponentsList API](#componentslist-api)
5. [Utility Functions API](#utility-functions-api)
6. [Debug Logger API](#debug-logger-api)

---

## editorStore API

### State Properties

#### Component Type States

```typescript
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
```

**Structure**: `{ [componentId]: ComponentData }`

**Example**:

```typescript
{
  "uuid-abc": {
    visible: true,
    content: { title: "Welcome" }
  },
  "uuid-def": {
    visible: true,
    content: { title: "About Us" }
  }
}
```

#### Global Components

```typescript
globalHeaderData: ComponentData;
globalFooterData: ComponentData;
globalComponentsData: {
  header: ComponentData;
  footer: ComponentData;
}
```

#### Page Management

```typescript
pageComponentsByPage: Record<string, ComponentInstance[]>;
currentPage: string;
```

#### Temporary State

```typescript
tempData: ComponentData;
hasChangesMade: boolean;
showDialog: boolean;
```

---

### Generic Component Functions

#### ensureComponentVariant

**Purpose**: Initialize component in store if not exists

**Signature**:

```typescript
ensureComponentVariant: (
  componentType: string,
  variantId: string,
  initial?: ComponentData
) => void
```

**Parameters**:

- `componentType`: Component type ("hero", "header", etc.)
- `variantId`: Component UUID (component.id)
- `initial`: Optional initial data

**Example**:

```typescript
const store = useEditorStore.getState();

store.ensureComponentVariant("hero", "uuid-123", {
  visible: true,
  content: { title: "Welcome" },
});
```

**Behavior**:

- If component exists with data: No changes
- If component missing: Initialize with initial data or defaults
- If initial provided: ALWAYS use it (even if exists)

---

#### getComponentData

**Purpose**: Retrieve component data from store

**Signature**:

```typescript
getComponentData: (componentType: string, variantId: string) => ComponentData;
```

**Parameters**:

- `componentType`: Component type
- `variantId`: Component UUID

**Returns**: ComponentData or empty object {}

**Example**:

```typescript
const data = store.getComponentData("hero", "uuid-123");
console.log("Hero data:", data);

// Always returns object (never undefined)
const title = data.content?.title || "Default";
```

---

#### setComponentData

**Purpose**: Set/replace component data completely

**Signature**:

```typescript
setComponentData: (
  componentType: string,
  variantId: string,
  data: ComponentData
) => void
```

**Parameters**:

- `componentType`: Component type
- `variantId`: Component UUID
- `data`: New component data

**Example**:

```typescript
store.setComponentData("hero", "uuid-123", {
  visible: true,
  content: {
    title: "New Title",
    subtitle: "New Subtitle",
  },
});
```

**Side Effects**:

- Updates component type state (heroStates[id])
- Updates pageComponentsByPage[currentPage][index].data

---

#### updateComponentByPath

**Purpose**: Update specific field via dot-notation path

**Signature**:

```typescript
updateComponentByPath: (
  componentType: string,
  variantId: string,
  path: string,
  value: any
) => void
```

**Parameters**:

- `componentType`: Component type
- `variantId`: Component UUID
- `path`: Dot-notation path ("content.title")
- `value`: New value

**Example**:

```typescript
// Update title
store.updateComponentByPath("hero", "uuid-123", "content.title", "New Title");

// Update nested field
store.updateComponentByPath(
  "hero",
  "uuid-123",
  "background.overlay.opacity",
  "0.5",
);

// Update array element
store.updateComponentByPath("header", "uuid-456", "menu[0].text", "Home");
```

**Side Effects**:

- Updates component type state
- Updates pageComponentsByPage
- Creates intermediate structures if missing

---

### Global Component Functions

#### updateGlobalHeaderByPath

**Signature**:

```typescript
updateGlobalHeaderByPath: (path: string, value: any) => void
```

**Example**:

```typescript
store.updateGlobalHeaderByPath("logo.text", "My Company");
store.updateGlobalHeaderByPath("menu[0].url", "/home");
```

#### updateGlobalFooterByPath

**Signature**:

```typescript
updateGlobalFooterByPath: (path: string, value: any) => void
```

**Example**:

```typescript
store.updateGlobalFooterByPath("content.copyright", "© 2025");
```

#### updateGlobalComponentByPath

**Signature**:

```typescript
updateGlobalComponentByPath: (
  componentType: "header" | "footer",
  path: string,
  value: any
) => void
```

**Example**:

```typescript
store.updateGlobalComponentByPath("header", "visible", true);
store.updateGlobalComponentByPath("footer", "background.color", "#000");
```

---

### Page Management Functions

#### setPageComponentsForPage

**Purpose**: Set all components for a page

**Signature**:

```typescript
setPageComponentsForPage: (
  page: string,
  components: ComponentInstance[]
) => void
```

**Example**:

```typescript
store.setPageComponentsForPage("homepage", [
  {
    id: "uuid-1",
    type: "hero",
    componentName: "hero1",
    name: "Hero",
    data: {...}
  },
  {
    id: "uuid-2",
    type: "halfTextHalfImage",
    componentName: "halfTextHalfImage1",
    name: "Half Text Half Image",
    data: {...}
  }
]);
```

**Side Effects**:

- Adds position property to each component
- Updates pageComponentsByPage[page]

---

#### forceUpdatePageComponents

**Purpose**: Update page components (without adding positions)

**Signature**:

```typescript
forceUpdatePageComponents: (
  slug: string,
  components: ComponentInstance[]
) => void
```

**Example**:

```typescript
const updated = pageComponents.map((c) =>
  c.id === targetId ? { ...c, data: newData } : c,
);

store.forceUpdatePageComponents("homepage", updated);
```

**Difference from setPageComponentsForPage**:

- Does NOT add position property
- Expects components to already have positions
- Direct replacement of page components array

---

### Database Functions

#### loadFromDatabase

**Purpose**: Load tenant data into all stores

**Signature**:

```typescript
loadFromDatabase: (tenantData: any) => void
```

**Example**:

```typescript
const tenantData = await fetchTenantData(tenantId);
store.loadFromDatabase(tenantData);
```

**Side Effects**:

- Loads globalHeaderData, globalFooterData, globalComponentsData
- Loads all page components into pageComponentsByPage
- Loads component data into component type states (heroStates, etc.)

---

### Temporary Data Functions

#### updateByPath

**Purpose**: Update tempData via path

**Signature**:

```typescript
updateByPath: (path: string, value: any) => void
```

**Example**:

```typescript
// Used during editing in EditorSidebar
store.updateByPath("content.title", "New Title");
```

**Behavior**:

- Updates ONLY tempData
- Does NOT update component states
- Merges with global data if editing global component

---

### Save Dialog Functions

#### setOpenSaveDialog

**Purpose**: Register save function

**Signature**:

```typescript
setOpenSaveDialog: (fn: () => void) => void
```

**Example**:

```typescript
// In LiveEditorEffects
useEffect(() => {
  const saveFn = () => {
    store.forceUpdatePageComponents(slug, pageComponents);
  };

  store.setOpenSaveDialog(saveFn);

  return () => {
    store.setOpenSaveDialog(() => {});
  };
}, [slug, pageComponents]);
```

#### requestSave

**Signature**:

```typescript
requestSave: () => void
```

**Example**:

```typescript
// Trigger save dialog
store.requestSave();
```

#### closeDialog

**Signature**:

```typescript
closeDialog: () => void
```

---

## tenantStore API

### State Properties

```typescript
tenantData: TenantData | null;
loadingTenantData: boolean;
loading: boolean; // Alias for loadingTenantData
error: string | null;
tenant: any | null;
tenantId: string | null;
lastFetchedWebsite: string | null;
```

### Functions

#### fetchTenantData

**Purpose**: Fetch tenant data from API

**Signature**:

```typescript
fetchTenantData: (websiteName: string) => Promise<void>;
```

**Example**:

```typescript
const { fetchTenantData } = useTenantStore();

await fetchTenantData("tenant123");

// tenantData now populated
const data = useTenantStore.getState().tenantData;
```

**Behavior**:

- Checks cache first (prevents duplicate requests)
- Sets loading state
- Fetches from API
- Updates editorStore with global data
- Handles errors

#### setTenantId

**Signature**:

```typescript
setTenantId: (tenantId: string) => void
```

**Example**:

```typescript
const { setTenantId } = useTenantStore();
setTenantId("tenant123");
```

---

## Component Functions API

### Standard Component Functions

Each component type has these functions:

```typescript
// In editorStoreFunctions/{type}Functions.ts

export const {type}Functions = {
  ensureVariant: (state, variantId, initial?) => {...},
  getData: (state, variantId) => {...},
  setData: (state, variantId, data) => {...},
  updateByPath: (state, variantId, path, value) => {...}
};
```

### Example: heroFunctions

#### ensureVariant

```typescript
heroFunctions.ensureVariant(
  state, // Current store state
  "uuid-123", // Component UUID
  {
    // Initial data
    visible: true,
    content: { title: "Welcome" },
  },
);

// Returns: { heroStates: {...} }
```

#### getData

```typescript
const data = heroFunctions.getData(state, "uuid-123");

// Returns: ComponentData or {}
```

#### setData

```typescript
heroFunctions.setData(state, "uuid-123", {
  visible: true,
  content: { title: "Updated" },
});

// Returns:
// {
//   heroStates: {...},
//   pageComponentsByPage: {...}
// }
```

#### updateByPath

```typescript
heroFunctions.updateByPath(state, "uuid-123", "content.title", "New Title");

// Returns:
// {
//   heroStates: {...},
//   pageComponentsByPage: {...}
// }
```

---

## ComponentsList API

### Functions

#### getComponentById

**Signature**:

```typescript
getComponentById: (id: string) => ComponentType | undefined;
```

**Example**:

```typescript
const hero = getComponentById("hero");
console.log(hero.displayName); // "Hero"
```

#### getComponentsBySection

**Signature**:

```typescript
getComponentsBySection: (sectionId: string) => ComponentType[]
```

**Example**:

```typescript
const homepageComponents = getComponentsBySection("homepage");
// Returns all components for homepage
```

#### getComponentsByCategory

**Signature**:

```typescript
getComponentsByCategory: (category: string) => ComponentType[]
```

**Example**:

```typescript
const contentComponents = getComponentsByCategory("content");
// Returns: halfTextHalfImage, propertySlider, etc.
```

#### isValidComponentType

**Signature**:

```typescript
isValidComponentType: (type: string) => boolean;
```

**Example**:

```typescript
if (isValidComponentType("hero")) {
  // Component type exists
}
```

#### getComponentDefaultTheme

**Signature**:

```typescript
getComponentDefaultTheme: (type: string) => string;
```

**Example**:

```typescript
const theme = getComponentDefaultTheme("hero");
// Returns: "hero1"
```

### Translated Versions

#### getComponents

**Signature**:

```typescript
getComponents: (t: (key: string) => string) => Record<string, ComponentType>;
```

**Example**:

```typescript
const t = useEditorT();
const components = getComponents(t);

console.log(components.hero.displayName); // Translated!
```

#### getComponentByIdTranslated

**Signature**:

```typescript
getComponentByIdTranslated: (id: string, t: (key: string) => string) =>
  ComponentType | undefined;
```

**Example**:

```typescript
const t = useEditorT();
const hero = getComponentByIdTranslated("hero", t);
console.log(hero.displayName); // "بانر رئيسي" (Arabic)
```

---

## Utility Functions API

### Path Utilities

#### normalizePath

**Purpose**: Normalize dot-notation paths

**Signature**:

```typescript
normalizePath: (path: string) => string;
```

**Example**:

```typescript
normalizePath("menu.[0].text"); // "menu.0.text"
normalizePath("content..title"); // "content.title"
```

#### getValueByPath

**Purpose**: Get value from nested object via path

**Signature**:

```typescript
getValueByPath: (obj: any, path: string) => any;
```

**Example**:

```typescript
const data = {
  content: {
    title: "Welcome",
    stats: {
      stat1: { value: "100+" },
    },
  },
};

getValueByPath(data, "content.title"); // "Welcome"
getValueByPath(data, "content.stats.stat1.value"); // "100+"
```

#### updateValueByPath

**Purpose**: Set value in nested object via path

**Signature**:

```typescript
updateValueByPath: (obj: any, path: string, value: any) => any;
```

**Example**:

```typescript
const data = { content: { title: "Old" } };

const updated = updateValueByPath(data, "content.title", "New");
// Returns: { content: { title: "New" } }
```

---

### Data Utilities

#### createDefaultData

**Purpose**: Generate default data for component type

**Signature**:

```typescript
createDefaultData: (type: string, componentName?: string) => ComponentData;
```

**Example**:

```typescript
const data = createDefaultData("hero", "hero1");
// Returns complete default hero1 data

const data2 = createDefaultData("hero", "hero2");
// Returns complete default hero2 data
```

#### deepMerge

**Purpose**: Deep merge objects

**Signature**:

```typescript
deepMerge: (target: any, source: any) => any;
```

**Example**:

```typescript
const a = { content: { title: "A", subtitle: "Sub" } };
const b = { content: { title: "B" } };

const merged = deepMerge(a, b);
// Returns: { content: { title: "B", subtitle: "Sub" } }
//                              ↑ from b    ↑ preserved from a
```

---

## Debug Logger API

### Logging Functions

#### debugLogger.log

**Signature**:

```typescript
log: (
  source: string,
  action: string,
  data: any,
  componentInfo?: {
    componentId?: string;
    componentName?: string;
    componentType?: string;
  }
) => void
```

**Example**:

```typescript
debugLogger.log(
  "SIDEBAR",
  "SAVE_CHANGES",
  { mergedData },
  {
    componentId: "uuid-123",
    componentName: "hero1",
    componentType: "hero",
  },
);
```

#### debugLogger.logChange

**Signature**:

```typescript
logChange: (
  componentId: string,
  componentName: string,
  componentType: string,
  newData: any,
  changeType: "GLOBAL_HEADER" | "GLOBAL_FOOTER" | "COMPONENT_UPDATE"
) => void
```

**Example**:

```typescript
debugLogger.logChange(
  "uuid-123",
  "hero1",
  "hero",
  mergedData,
  "COMPONENT_UPDATE",
);
```

### Helper Functions

```typescript
logComponentAdd(componentId, componentName, componentType, data);
logComponentChange(componentId, oldName, newName, data);
logEditorStore(action, componentId, componentName, data);
logTenantStore(action, componentId, componentName, data);
logComponentRender(componentId, componentName, componentType, data);
logSidebar(action, componentId, componentName, data);
logUserAction(action, componentId, componentName, data);
```

### Log Retrieval

```typescript
getAllLogs(): DebugLog[]
getLogsAsString(): string
getAllChangeLogs(): ChangeLog[]
getChangeLogsAsString(): string
```

### Log Management

```typescript
clearLog(): void
clearChangeLogs(): void
downloadLogs(): void  // Download as text file
```

---

## Exported Helpers

### From debugLogger.ts

```typescript
import {
  logChange,
  logComponentAdd,
  logComponentChange,
  logEditorStore,
  logSidebar,
  getChangeLogsAsString,
  getAllChangeLogs,
  clearChangeLogs,
  downloadDebugLog,
} from "@/lib-liveeditor/debugLogger";
```

### From EditorSidebar/utils.ts

```typescript
import {
  createDefaultData,
  normalizePath,
  getValueByPath,
  updateValueByPath,
  getSectionIcon,
  getAvailableSectionsTranslated,
  translateComponentStructure,
} from "@/components/tenant/live-editor/EditorSidebar/utils";
```

### From ComponentsList.tsx

```typescript
import {
  COMPONENTS,
  SECTIONS,
  getComponentById,
  getComponentsBySection,
  getComponentsByCategory,
  getSectionById,
  getAllSections,
  getAllComponents,
  isValidComponentType,
  getComponentDisplayName,
  getComponentDefaultTheme,

  // Translated versions
  getComponents,
  getComponentByIdTranslated,
  getComponentsBySectionTranslated,
  getAllComponentsTranslated,
} from "@/lib-liveeditor/ComponentsList";
```

---

## Hook APIs

### useEditorStore

**Usage**:

```typescript
// Get specific property
const tempData = useEditorStore((s) => s.tempData);

// Get multiple properties
const { hasChangesMade, currentPage } = useEditorStore((s) => ({
  hasChangesMade: s.hasChangesMade,
  currentPage: s.currentPage,
}));

// Get entire store (avoid in components - causes re-renders)
const store = useEditorStore.getState();
```

### useTenantStore

**Usage**:

```typescript
// Get property
const tenantData = useTenantStore((s) => s.tenantData);

// Get function
const fetchTenantData = useTenantStore((s) => s.fetchTenantData);

// Get entire store
const store = useTenantStore.getState();
```

### useEditorI18nStore

**Usage**:

```typescript
// Translation function
const t = useEditorT();

// Locale management
const { locale, setLocale } = useEditorLocale();

// Current translations object
const translations = useEditorTranslations();
```

---

## Common API Combinations

### Combination 1: Initialize and Update Component

```typescript
const store = useEditorStore.getState();

// 1. Ensure exists
store.ensureComponentVariant("hero", id, defaultData);

// 2. Update field
store.updateComponentByPath("hero", id, "content.title", "New");

// 3. Get updated data
const updated = store.getComponentData("hero", id);
```

### Combination 2: Save Component Changes

```typescript
// 1. Get data sources
const storeData = store.getComponentData(type, id);
const existingData = component.data;
const tempData = store.tempData;

// 2. Merge
const merged = deepMerge(deepMerge(existingData, storeData), tempData);

// 3. Save
store.setComponentData(type, id, merged);

// 4. Update page
store.forceUpdatePageComponents(page, updatedComponents);

// 5. Clear temp
store.setTempData({});
```

### Combination 3: Load and Render Page

```typescript
// 1. Fetch tenant data
await fetchTenantData(tenantId);

// 2. Load into editor
const tenantData = useTenantStore.getState().tenantData;
store.loadFromDatabase(tenantData);

// 3. Get page components
const components = store.pageComponentsByPage[slug] || [];

// 4. Render
setPageComponents(components);
```

---

## Parameter Validation

### Required Parameters

All functions validate required parameters:

```typescript
// Example from updateComponentByPath
updateComponentByPath: (type, id, path, value) => {
  // Validate type
  if (!type || typeof type !== "string") {
    console.error("Invalid type:", type);
    return;
  }

  // Validate id
  if (!id || typeof id !== "string") {
    console.error("Invalid id:", id);
    return;
  }

  // Validate path
  if (!path || typeof path !== "string" || path.trim() === "") {
    console.error("Invalid path:", path);
    return;
  }

  // Proceed with update...
};
```

### Type Safety

TypeScript provides compile-time validation:

```typescript
// ✅ CORRECT - TypeScript validates
store.setComponentData("hero", "uuid-123", {
  visible: true,
  content: { title: "Welcome" },
});

// ❌ WRONG - TypeScript error
store.setComponentData("hero", 123, "invalid");
//                              ↑ Type error: expected string
```

---

## Return Values

### Void Functions

Most functions return `void` (no return value):

```typescript
store.updateComponentByPath(...);  // void
store.setComponentData(...);       // void
```

### Getter Functions

Getters return data or undefined:

```typescript
const data = store.getComponentData(type, id);
// Returns: ComponentData | {}

const component = getComponentById("hero");
// Returns: ComponentType | undefined
```

### Async Functions

Async functions return Promises:

```typescript
await fetchTenantData(tenantId);
// Returns: Promise<void>

const data = await retry(() => fetchData());
// Returns: Promise<any>
```

---

## Summary

The API reference provides:

1. **Complete function signatures**: All parameters and return types
2. **Usage examples**: Real-world usage patterns
3. **Side effects documentation**: What each function modifies
4. **Parameter validation**: Required vs optional parameters
5. **Type safety**: TypeScript types for all functions
6. **Common combinations**: Frequent usage patterns

**Key APIs**:

- **editorStore**: Main state management
- **tenantStore**: API and database integration
- **Component Functions**: Per-component CRUD operations
- **ComponentsList**: Component registry and helpers
- **Utilities**: Path manipulation, data merging
- **Debug Logger**: Logging and tracking

**For AI**:

- Use as reference when calling functions
- Verify parameter types and order
- Check return values
- Understand side effects
- Follow usage examples

**For Development**:

- Quick reference for function signatures
- Parameter documentation
- Return value types
- Usage patterns
- Integration examples
