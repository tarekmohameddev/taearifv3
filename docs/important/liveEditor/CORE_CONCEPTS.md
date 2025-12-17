# Core Concepts - Essential Understanding for AI

## Table of Contents

1. [Critical Identifiers](#critical-identifiers)
2. [Data Priority System](#data-priority-system)
3. [Store Architecture](#store-architecture)
4. [Update Flow](#update-flow)
5. [Global vs Page Components](#global-vs-page-components)
6. [The Three-Way Merge](#the-three-way-merge)
7. [Path-Based Updates](#path-based-updates)
8. [Component Lifecycle](#component-lifecycle)

---

## Critical Identifiers

### The Three IDs

Every component instance has THREE identifiers:

```typescript
{
  id: "3f4a8b2c-5d6e-4f7a-8b9c-0d1e2f3a4b5c",  // UUID
  type: "hero",                                  // Component type
  componentName: "hero1"                         // Variant name
}
```

#### 1. component.id (UUID)

**Purpose**: PRIMARY unique identifier for component INSTANCE

**Format**: UUID v4 (e.g., `"3f4a8b2c-5d6e-4f7a-8b9c-0d1e2f3a4b5c"`)

**Usage**:

```typescript
// ✅ ALWAYS use for store operations
getComponentData("hero", component.id);
updateComponentByPath("hero", component.id, path, value);

// ❌ NEVER use componentName
getComponentData("hero", component.componentName); // WRONG!
```

**Critical Rule**:

```
component.id = UNIQUE IDENTIFIER (like primary key in database)
Use for ALL store operations
```

#### 2. component.type

**Purpose**: Component category/classification

**Format**: camelCase string (e.g., `"hero"`, `"halfTextHalfImage"`)

**Usage**:

```typescript
// Determines which store to use
switch (component.type) {
  case "hero":
    return heroFunctions.getData(state, component.id);
  case "header":
    return headerFunctions.getData(state, component.id);
}

// Determines which React component folder
// components/tenant/{type}/{componentName}.tsx
```

**Critical Rule**:

```
component.type = CATEGORY (determines store and functions)
Used for routing to correct component functions
```

#### 3. component.componentName

**Purpose**: Specific variant/theme identifier

**Format**: type + number (e.g., `"hero1"`, `"hero2"`, `"halfTextHalfImage3"`)

**Usage**:

```typescript
// Determines which React component to render
const Component = dynamic(
  () => import(`@/components/tenant/${type}/${componentName}`),
);

// Determines default data function
const defaultData =
  componentName === "hero2" ? getDefaultHero2Data() : getDefaultHeroData();
```

**Critical Rule**:

```
component.componentName = VARIANT (determines visual theme and defaults)
Used for rendering and default data selection
NOT for store operations!
```

### Why This Matters

```typescript
// SCENARIO: Two hero components on same page

// Component 1
{
  id: "uuid-abc",           // ← Unique
  type: "hero",             // ← Same
  componentName: "hero1"    // ← Same
}

// Component 2
{
  id: "uuid-def",           // ← Unique
  type: "hero",             // ← Same
  componentName: "hero1"    // ← Same (can be!)
}

// If we used componentName as identifier:
heroStates["hero1"] = data  // ❌ Both components would share same data!

// Using component.id:
heroStates["uuid-abc"] = data1  // ✅ Each has own data
heroStates["uuid-def"] = data2  // ✅ Independent
```

---

## Data Priority System

### Rendering Priority (Highest to Lowest)

```
When component renders, data merged in this order:

5. currentStoreData          ← HIGHEST PRIORITY
   (from heroStates[id])

4. storeData
   (from getComponentData)

3. tenantComponentData
   (from database)

2. props
   (passed to component)

1. defaultData               ← LOWEST PRIORITY
   (from getDefaultHeroData)
```

**Example**:

```typescript
const mergedData = {
  ...defaultData, // Priority 1
  ...props, // Priority 2
  ...tenantComponentData, // Priority 3
  ...storeData, // Priority 4
  ...currentStoreData, // Priority 5 (wins!)
};
```

**Result**:

```
defaultData = { visible: true, title: "Default" }
props = { title: "Prop Title" }
storeData = { title: "Store Title", subtitle: "Store Sub" }

merged = {
  visible: true,        ← From defaultData (only one with it)
  title: "Store Title", ← From storeData (overrides default and props)
  subtitle: "Store Sub" ← From storeData
}
```

### Saving Priority (Highest to Lowest)

```
When saving edits, data merged in this order:

3. tempData                  ← HIGHEST PRIORITY
   (latest edits)

2. storeData
   (previous edits)

1. existingComponent.data    ← LOWEST PRIORITY
   (original data)
```

**Example**:

```typescript
const mergedData = deepMerge(
  deepMerge(existingComponent.data, storeData),
  tempData,
);
```

---

## Store Architecture

### Multi-Layer State

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  pageComponents (React useState)                            │
│  - Local state in LiveEditor                                │
│  - Immediate updates for UI responsiveness                  │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                    EDITING LAYER                             │
│  tempData (editorStore)                                     │
│  - Temporary editing state                                   │
│  - Holds drafts before save                                 │
│  - Cleared on cancel or merged on save                      │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                  COMPONENT STATE LAYER                       │
│  heroStates, headerStates, etc. (editorStore)               │
│  - Component-specific states                                 │
│  - Persistent across edits                                   │
│  - Source for rendering                                      │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                  AGGREGATION LAYER                           │
│  pageComponentsByPage (editorStore)                         │
│  - Components grouped by page                                │
│  - Source of truth for database                             │
│  - What gets saved to API                                    │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                  PERSISTENCE LAYER                           │
│  tenantData.componentSettings (tenantStore)                 │
│  - Data from database                                        │
│  - Initial data source                                       │
│  - Not modified during editing                              │
└─────────────────────────────────────────────────────────────┘
```

### Why Multiple Layers?

1. **Presentation**: Fast, immediate UI updates
2. **Editing**: Draft changes without affecting preview
3. **Component State**: Persistent, renderable data
4. **Aggregation**: Organized for database persistence
5. **Persistence**: Original database data

**Flow**:

```
Database → tenantStore → editorStore → tempData → UI
         (load)        (init)        (edit)    (display)

UI → tempData → componentStates → pageComponentsByPage → Database
  (edit)      (save)           (aggregate)           (persist)
```

---

## Update Flow

### The Update Chain

```
USER EDITS FIELD IN EDITORSIDEBAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field onChange
  ↓
updateValue(path, value)
  ↓
updateByPath(path, value)
  ↓
editorStore.updateByPath()
  ↓
tempData updated
  ↓
(User sees change in field, but NOT in preview yet)
  ↓
User clicks "Save Changes"
  ↓
handleSave()
  ↓
Merge: existing + store + tempData
  ↓
setComponentData(type, id, merged)
  ↓
heroStates[id] updated
pageComponentsByPage[page] updated
  ↓
onComponentUpdate(id, merged)
  ↓
pageComponents updated (local state)
  ↓
Component re-renders in iframe
  ↓
User sees change in preview ✓
```

**Key Insight**: Preview updates on SAVE, not during editing

**Why?**: Allows cancel without side effects

---

## Global vs Page Components

### Page Components

```typescript
// Regular components belong to specific pages
{
  id: "uuid-abc",              // Unique UUID
  type: "hero",
  componentName: "hero1",
  data: {...}
}

// Storage:
pageComponentsByPage["homepage"] = [component1, component2, ...]

// Editing:
updateComponentByPath("hero", "uuid-abc", path, value)

// Save payload:
{
  pages: {
    homepage: [component1, component2, ...]
  }
}
```

### Global Components

```typescript
// Global components shared across ALL pages
{
  id: "global-header",         // Special ID!
  type: "header",
  componentName: "header1",
  data: {...}
}

// Storage:
globalComponentsData.header = data

// Editing:
updateGlobalComponentByPath("header", path, value)

// Save payload:
{
  globalComponentsData: {
    header: {...},
    footer: {...}
  }
}
```

### Critical Differences

| Aspect          | Page Components         | Global Components           |
| --------------- | ----------------------- | --------------------------- |
| ID              | UUID (e.g., "uuid-abc") | Special ("global-header")   |
| Storage         | pageComponentsByPage    | globalComponentsData        |
| Update Function | updateComponentByPath   | updateGlobalComponentByPath |
| Save Location   | pages field in payload  | globalComponentsData field  |
| Scope           | Single page             | All pages                   |

**Rule**: ALWAYS check if component is global before operations

```typescript
if (component.id === "global-header" || component.id === "global-footer") {
  // Global handling
  updateGlobalComponentByPath(type, path, value);
} else {
  // Regular handling
  updateComponentByPath(type, id, path, value);
}
```

---

## The Three-Way Merge

### Why Three-Way Merge?

Data comes from three sources when saving:

```typescript
1. existingComponent.data (from pageComponentsByPage)
   - Original data when component was added/loaded
   - May have fields not in store

2. storeData (from heroStates[id])
   - Data from previous edits
   - May have fields not in existing or temp

3. tempData (from current editing session)
   - Latest edits
   - May only have changed fields
```

**Problem with Shallow Merge**:

```typescript
const existing = {
  visible: true,
  content: { title: "Old", subtitle: "Old Sub" },
  layout: { padding: "16px" },
};

const temp = {
  content: { title: "New" },
};

// ❌ Shallow merge
const merged = { ...existing, ...temp };
// Result: {
//   visible: true,
//   content: { title: "New" },    ← Lost subtitle!
//   layout: { padding: "16px" }
// }

// ✅ Deep merge
const merged = deepMerge(existing, temp);
// Result: {
//   visible: true,
//   content: { title: "New", subtitle: "Old Sub" },  ← Preserved!
//   layout: { padding: "16px" }
// }
```

### Deep Merge Implementation

```typescript
const deepMerge = (target: any, source: any): any => {
  // Handle non-objects
  if (!source || typeof source !== "object") {
    return target || source;
  }
  if (!target || typeof target !== "object") {
    return source;
  }

  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key]) // Don't deep merge arrays
      ) {
        // Recursively merge nested objects
        result[key] = deepMerge(target[key], source[key]);
      } else {
        // Replace primitive values and arrays
        result[key] = source[key];
      }
    }
  }

  return result;
};
```

**Usage**:

```typescript
const merged = deepMerge(
  deepMerge(existingComponent.data, storeData),
  tempData,
);
```

---

## Path-Based Updates

### Path Syntax

```
Paths use dot notation with array indices:

Simple:         "title"
Nested:         "content.title"
Array element:  "menu[0].text"
Deep nesting:   "content.stats.stat1.value"
Array in array: "menu[0].submenu[0].items[0].text"
```

### Path Parsing

```typescript
// Input: "menu[0].text"
const path = "menu[0].text";

// Step 1: Replace brackets
const normalized = path.replace(/\[(\d+)\]/g, ".$1");
// Result: "menu.0.text"

// Step 2: Split on dots
const segments = normalized.split(".").filter(Boolean);
// Result: ["menu", "0", "text"]

// Step 3: Navigate object
let cursor = data;
for (const segment of segments) {
  cursor = cursor[segment];
}
// Result: data.menu[0].text
```

### Path-Based Update

```typescript
updateByPath("menu[0].text", "New Text");

// Internally:
// 1. Parse: ["menu", "0", "text"]
// 2. Clone data
// 3. Navigate: data.menu[0].text = "New Text"
// 4. Return cloned data
```

**Benefits**:

- Precise updates to nested data
- No need to know structure beforehand
- Consistent API across all components
- Easy debugging (log path + value)

---

## Component Lifecycle

### Complete Lifecycle

```
PHASE 1: CREATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
User adds component
  ↓
Generate UUID: component.id = uuidv4()
  ↓
Set type and componentName
  ↓
Create default data: createDefaultData(type, componentName)
  ↓
Add to pageComponents (local state)
  ↓
Initialize in store: ensureComponentVariant(type, id, defaultData)
  ↓
Component renders in iframe


PHASE 2: LOADING FROM DATABASE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Fetch tenantData from API
  ↓
loadFromDatabase(tenantData)
  ↓
Extract components from componentSettings
  ↓
Load into pageComponentsByPage
  ↓
Load into component type states (heroStates, etc.)
  ↓
setPageComponents (local state)
  ↓
Components render with database data


PHASE 3: EDITING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
User clicks component
  ↓
Open EditorSidebar
  ↓
Load component data into tempData
  ↓
User edits fields
  ↓
updateByPath() updates tempData
  ↓
User clicks "Save Changes"
  ↓
Merge: existing + store + tempData
  ↓
setComponentData() updates heroStates and pageComponentsByPage
  ↓
onComponentUpdate() updates pageComponents (local)
  ↓
Component re-renders with new data


PHASE 4: PERSISTENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
User clicks "Publish"
  ↓
Build payload from pageComponentsByPage
  ↓
POST to /v1/tenant-website/save-pages
  ↓
Database updated
  ↓
hasChangesMade = false
  ↓
Changes persisted ✓


PHASE 5: DELETION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
User clicks delete
  ↓
Show confirmation dialog
  ↓
User confirms
  ↓
Remove from pageComponents (local)
  ↓
Remove from pageComponentsByPage (store)
  ↓
Remove from component type state (heroStates)
  ↓
Component disappears from iframe
```

---

## The Update Flow

### Real-Time Update vs Save-Based Update

```
REAL-TIME UPDATE (NOT IMPLEMENTED):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
User types in field
  ↓
updateByPath() updates tempData
  ↓
Component reads tempData
  ↓
Preview updates immediately
  ↓
User can see changes as they type

Problem: Can't cancel without reverting preview


SAVE-BASED UPDATE (CURRENT IMPLEMENTATION):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
User types in field
  ↓
updateByPath() updates tempData
  ↓
Component reads heroStates (NOT tempData)
  ↓
Preview stays unchanged
  ↓
User clicks "Save Changes"
  ↓
tempData merged into heroStates
  ↓
Preview updates

Benefit: Can cancel without affecting preview ✓
```

**Design Choice**: Current system uses save-based updates for better UX

---

## Path Examples

### Simple Paths

```typescript
"visible"; // Top-level property
"title"; // Top-level property
```

### Nested Paths

```typescript
"content.title"; // data.content.title
"colors.background"; // data.colors.background
"layout.padding.top"; // data.layout.padding.top
```

### Array Paths

```typescript
"menu[0]"; // data.menu[0] (entire object)
"menu[0].text"; // data.menu[0].text
"menu[0].url"; // data.menu[0].url
```

### Complex Paths

```typescript
"menu[0].submenu[0].items[0].text";
// data.menu[0].submenu[0].items[0].text

"content.stats.stat1.value";
// data.content.stats.stat1.value

"background.overlay.colors.from";
// data.background.overlay.colors.from
```

### Path Normalization

```typescript
// Input paths (various formats)
"menu.[0].text"        // Extra dots
"content..title"       // Double dots
"menu[0].[1].text"     // Mixed notation

// Normalized
normalizePath("menu.[0].text")     → "menu.0.text"
normalizePath("content..title")    → "content.title"
normalizePath("menu[0].[1].text")  → "menu.0.1.text"
```

---

## Essential Rules for AI

### Rule 1: component.id is ALWAYS the Identifier

```typescript
// ✅ CORRECT - Use component.id
store.getComponentData(component.type, component.id);
store.updateComponentByPath(component.type, component.id, path, value);

// ❌ WRONG - Don't use componentName
store.getComponentData(component.type, component.componentName);
```

### Rule 2: Deep Merge When Saving

```typescript
// ✅ CORRECT
const merged = deepMerge(deepMerge(a, b), c);

// ❌ WRONG
const merged = { ...a, ...b, ...c };
```

### Rule 3: Update ALL Stores

```typescript
// ✅ CORRECT - Both stores updated
return {
  heroStates: { ...state.heroStates, [id]: data },
  pageComponentsByPage: { ...state.pageComponentsByPage, [page]: updated },
};

// ❌ WRONG - Only one store
return {
  heroStates: { ...state.heroStates, [id]: data },
};
```

### Rule 4: Check for Global Components

```typescript
// ✅ CORRECT
if (component.id === "global-header") {
  updateGlobalComponentByPath("header", path, value);
} else {
  updateComponentByPath(type, id, path, value);
}

// ❌ WRONG - Treats all as regular
updateComponentByPath(type, id, path, value);
```

### Rule 5: setTimeout for Store Updates from Handlers

```typescript
// ✅ CORRECT
handleClick() {
  setLocalState(value);

  setTimeout(() => {
    store.updateStore(value);
  }, 0);
}

// ❌ WRONG - Can cause render cycles
handleClick() {
  setLocalState(value);
  store.updateStore(value);  // Immediate
}
```

### Rule 6: Validate Before Operations

```typescript
// ✅ CORRECT
if (!component || !component.id) {
  console.error("Invalid component");
  return;
}

performOperation(component);

// ❌ WRONG - No validation
performOperation(component); // Could crash!
```

### Rule 7: Use Normalized Paths

```typescript
// ✅ CORRECT
const path = normalizePath("menu.[0].text");
updateByPath(path, value);

// ❌ WRONG - Unnormalized
updateByPath("menu.[0].text", value);
```

### Rule 8: Handle Null/Undefined

```typescript
// ✅ CORRECT
const title = data?.content?.title || "Default";

// ❌ WRONG - Can crash
const title = data.content.title;
```

---

## Quick Reference Card

### Component Identifiers

```
component.id          → UUID (unique identifier) → USE FOR STORE OPS
component.type        → "hero" (category) → USE FOR ROUTING
component.componentName → "hero1" (variant) → USE FOR RENDERING
```

### Data Priority (Rendering)

```
currentStoreData > storeData > tenantData > props > defaults
```

### Data Priority (Saving)

```
tempData > storeData > existingData
```

### Store Layers

```
pageComponents (local) → tempData → componentStates → pageComponentsByPage → database
```

### Update Flow

```
Edit → tempData → Save → componentStates → Preview
```

### Global Components

```
IDs: "global-header", "global-footer"
Storage: globalComponentsData
Update: updateGlobalComponentByPath
```

### Path Syntax

```
"title"                    → Simple
"content.title"            → Nested
"menu[0].text"            → Array
"content.stats.stat1.value" → Deep
```

### Common Functions

```
ensureComponentVariant(type, id, initial)
getComponentData(type, id)
setComponentData(type, id, data)
updateComponentByPath(type, id, path, value)
```

---

## Mental Model for AI

### Think of the System As:

```
LIVE EDITOR = MULTI-LAYER CACHE SYSTEM

Layer 1 (UI):          Fast, immediate
Layer 2 (Editing):     Temporary, discardable
Layer 3 (Component):   Persistent, authoritative
Layer 4 (Aggregation): Organized, saveable
Layer 5 (Database):    Permanent, source of truth

Updates flow UP (editing) and DOWN (loading)
Saves flow DOWN (persisting)
```

### Decision Tree for Operations

```
WHEN UPDATING DATA:
  Is it global component?
    Yes → updateGlobalComponentByPath()
    No → Is it during editing?
      Yes → updateByPath() [tempData]
      No → updateComponentByPath() [componentStates]

WHEN GETTING DATA:
  Is it for rendering?
    Yes → Use currentStoreData (heroStates)
    No → Is it for editing?
      Yes → Use tempData
      No → Use pageComponentsByPage

WHEN SAVING:
  Is it global?
    Yes → setGlobalComponentsData()
    No → setComponentData() + forceUpdatePageComponents()

Always:
  - Deep merge when combining
  - Update all relevant stores
  - Validate inputs
  - Handle null/undefined
  - Log important operations
```

---

## Summary

These core concepts are ESSENTIAL for AI understanding:

1. **component.id is PRIMARY** - Use for all store operations
2. **Data has priority order** - Merge in correct order
3. **Multiple store layers** - Each serves specific purpose
4. **tempData is temporary** - Only persisted on save
5. **Global components special** - Different IDs, storage, updates
6. **Deep merge required** - Prevent data loss
7. **Path-based updates** - Consistent API for nested data
8. **Store synchronization** - Update all relevant stores

**For AI**:

- Memorize these concepts
- Apply in all Live Editor operations
- Reference when uncertain
- Follow rules strictly

**For Development**:

- Quick reference for key concepts
- Mental model for system design
- Decision tree for operations
- Rules to prevent bugs
