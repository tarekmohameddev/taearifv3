# EditorSidebar Data Flow - Complete Reference

## Table of Contents

1. [Overview](#overview)
2. [Opening EditorSidebar Flow](#opening-editorsidebar-flow)
3. [Real-Time Editing Flow](#real-time-editing-flow)
4. [Saving Changes Flow](#saving-changes-flow)
5. [Data Source Resolution](#data-source-resolution)
6. [Update Path Routing](#update-path-routing)
7. [Special Cases](#special-cases)

---

## Overview

The EditorSidebar manages a complex data flow involving multiple stores, temporary states, and real-time updates. Understanding this flow is critical for debugging and extending the system.

### Key Participants

1. **selectedComponent**: The component being edited
2. **tempData**: Draft changes in editorStore
3. **componentStates**: Persistent data in editorStore (heroStates, etc.)
4. **pageComponentsByPage**: Page-aggregated data in editorStore
5. **globalComponentsData**: Global header/footer data
6. **DynamicFieldsRenderer**: Field rendering and value management

---

## Opening EditorSidebar Flow

### Step-by-Step Breakdown

```
STEP 1: User Clicks Component in iframe
────────────────────────────────────────────────
User action: Click on hero component
  ↓
handleEditClick(component.id)
  ↓
State updates:
  - setSelectedComponentId(component.id)
  - setSidebarView("edit-component")
  - setSidebarOpen(true)


STEP 2: EditorSidebar Initialization Effect Triggers
────────────────────────────────────────────────
useEffect(() => {
  if (view === "edit-component" && selectedComponent) {
    // Effect logic runs...
  }
}, [selectedComponent, view]);


STEP 3: Determine Component Type
────────────────────────────────────────────────
Check selectedComponent.id:

├─ CASE A: Global Header
│  └─ selectedComponent.id === "global-header"
│
├─ CASE B: Global Footer
│  └─ selectedComponent.id === "global-footer"
│
└─ CASE C: Regular Component
   └─ Any other UUID


STEP 4A: Initialize Global Header (if CASE A)
────────────────────────────────────────────────
const defaultData = getDefaultHeaderData();

const dataToUse =
  globalComponentsData?.header ||  // Try unified first
  globalHeaderData ||              // Try individual
  defaultData;                     // Fallback

setCurrentPage("global-header");   // Mark as editing global
setTempData(dataToUse);            // Load into draft
return;                            // Exit early


STEP 4B: Initialize Global Footer (if CASE B)
────────────────────────────────────────────────
const defaultData = getDefaultFooterData();

const dataToUse =
  globalComponentsData?.footer ||
  globalFooterData ||
  defaultData;

setCurrentPage("global-footer");
setTempData(dataToUse);
return;


STEP 4C: Initialize Regular Component (if CASE C)
────────────────────────────────────────────────
const store = useEditorStore.getState();
const defaultData = createDefaultData(
  selectedComponent.type,
  selectedComponent.componentName
);

const uniqueVariantId = selectedComponent.id;  // UUID!

// Special handling for certain component types
let dataToUse;

if (selectedComponent.type === "contactCards") {
  const hasCards =
    selectedComponent.data?.cards &&
    Array.isArray(selectedComponent.data.cards) &&
    selectedComponent.data.cards.length > 0;

  dataToUse = hasCards
    ? selectedComponent.data
    : defaultData;

} else if (selectedComponent.type === "contactFormSection") {
  const hasSocialLinks =
    selectedComponent.data?.content?.socialLinks &&
    Array.isArray(selectedComponent.data.content.socialLinks) &&
    selectedComponent.data.content.socialLinks.length > 0;

  dataToUse = hasSocialLinks
    ? selectedComponent.data
    : defaultData;

} else {
  // Standard logic
  dataToUse =
    selectedComponent.data && Object.keys(selectedComponent.data).length > 0
      ? selectedComponent.data
      : defaultData;
}

// Ensure component exists in store
store.ensureComponentVariant(
  selectedComponent.type,
  uniqueVariantId,
  dataToUse
);

// Get current data from store (NOT selectedComponent.data!)
const currentComponentData = store.getComponentData(
  selectedComponent.type,
  uniqueVariantId
);

setTempData(currentComponentData || {});


STEP 5: Load Component Structure
────────────────────────────────────────────────
AdvancedSimpleSwitcher receives:
  - type: selectedComponent.type
  - componentName: selectedComponent.componentName
  - componentId: selectedComponent.id

useEffect(() => {
  const loadStructure = async () => {
    // Dynamic import
    const structureModule = await import(
      `@/componentsStructure/${type}`
    );

    // Extract structure
    const structureName = `${type}Structure`;
    const loadedStructure = structureModule[structureName];

    // Translate labels
    const translatedStructure = translateComponentStructure(
      loadedStructure,
      t
    );

    // Find matching variant
    const targetVariant =
      translatedStructure.variants.find(v => v.id === componentName) ||
      translatedStructure.variants[0];

    setStructure({
      ...translatedStructure,
      currentVariant: targetVariant
    });
  };

  loadStructure();
}, [type]);


STEP 6: Render Fields
────────────────────────────────────────────────
DynamicFieldsRenderer receives:
  - fields: variant.fields (or variant.simpleFields)
  - componentType: type
  - variantId: componentId (UUID)
  - onUpdateByPath: callback function
  - currentData: tempData

For each field in fields:
  renderField(field, basePath)
    ↓
  Creates appropriate renderer (Text, Color, Array, etc.)
    ↓
  Renderer displays with current value from tempData


STEP 7: Sidebar Ready
────────────────────────────────────────────────
Sidebar now shows:
  - Component name/type
  - Simple/Advanced mode toggle
  - All editable fields
  - Save/Cancel buttons

User can now edit fields ✓
```

---

## Real-Time Editing Flow

### Detailed Flow

```
STEP 1: User Interacts with Field
────────────────────────────────────────────────
Example: User types in "Title" field

<input
  value={value}
  onChange={(e) => updateValue("content.title", e.target.value)}
/>

onChange event fires with new value


STEP 2: updateValue Called
────────────────────────────────────────────────
DynamicFieldsRenderer.updateValue(path, value)

Arguments:
  path = "content.title"
  value = "New Title Text"


STEP 3: Special Case Checks
────────────────────────────────────────────────
Check for special handling:

if (path === "content.imagePosition" && componentType === "halfTextHalfImage") {
  // Update BOTH paths
  onUpdateByPath("content.imagePosition", value);
  onUpdateByPath("imagePosition", value);
  return;
}

if (path === "layout.direction" && componentType === "halfTextHalfImage") {
  // Special handling
  onUpdateByPath("layout.direction", value);
  return;
}

// No special case, continue...


STEP 4: Route to Appropriate Update Function
────────────────────────────────────────────────
Determine which update function to use:

if (onUpdateByPath) {
  // Callback provided from parent

  if (
    componentType &&
    variantId &&
    variantId !== "global-header" &&
    variantId !== "global-footer"
  ) {
    // Regular components: Update tempData for immediate feedback
    updateByPath(path, value);

  } else {
    // Global components: Use provided callback
    onUpdateByPath(path, value);
  }

} else {
  // No callback, use store directly

  if (variantId === "global-header") {
    updateByPath(path, value);
  } else if (variantId === "global-footer") {
    updateByPath(path, value);
  } else {
    updateByPath(path, value);
  }
}


STEP 5: updateByPath Executes in editorStore
────────────────────────────────────────────────
updateByPath: (path, value) =>
  set((state) => {
    // Parse path
    const segments = path
      .replace(/\[(\d+)\]/g, ".$1")
      .split(".")
      .filter(Boolean);

    // Initialize newData
    let newData = { ...(state.tempData || {}) };

    // Special handling for global components
    if (
      state.currentPage === "global-header" ||
      path.includes("menu") ||
      path.includes("logo")
    ) {
      // Deep merge with globalHeaderData
      newData = deepMerge(state.globalHeaderData, state.tempData);
    } else if (state.currentPage === "global-footer") {
      newData = deepMerge(state.globalFooterData, state.tempData);
    }

    // Navigate path and update
    let cursor = newData;
    for (let i = 0; i < segments.length - 1; i++) {
      const key = segments[i];
      const nextIsIndex = !isNaN(Number(segments[i + 1]));

      // Create structure if missing
      if (cursor[key] == null) {
        cursor[key] = nextIsIndex ? [] : {};
      }

      cursor = cursor[key];
    }

    // Set final value
    cursor[segments[segments.length - 1]] = value;

    // Return updated tempData
    return { tempData: newData };
  })


STEP 6: tempData Updated
────────────────────────────────────────────────
editorStore.tempData now contains:
{
  ...existingTempData,
  content: {
    ...existingContent,
    title: "New Title Text"  // ← Updated!
  }
}


STEP 7: Component Re-Reads Data
────────────────────────────────────────────────
Component in iframe uses:

For Global Components:
  const data = useEditorStore(s => s.globalHeaderData);
  // or
  const data = useEditorStore(s => s.globalComponentsData.header);

  // During editing, this reflects tempData changes

For Regular Components:
  const storeData = useEditorStore.getState()
    .getComponentData(component.type, component.id);

  // This reads from heroStates[id], etc.
  // NOT from tempData directly!


STEP 8: Component Re-Renders in iframe
────────────────────────────────────────────────
<CachedComponent
  key={component.id}
  componentName={component.componentName}
  data={{
    ...mergedData,
    useStore: true,
    variant: component.id
  }}
/>

Component renders with NEW title ✓
User sees change immediately ✓
```

### Why Components Don't Read tempData Directly

**Important Concept**:

```typescript
// ❌ Components do NOT do this:
const data = useEditorStore((s) => s.tempData);

// ✅ Components DO this:
const data = useEditorStore
  .getState()
  .getComponentData(component.type, component.id);
```

**Reason**:

- tempData is for EDITING DRAFTS
- Component states (heroStates, etc.) are for RENDERING
- On save, tempData is MERGED into component states
- This separation allows:
  - Cancel without affecting live preview
  - Multiple components editing without conflicts
  - Clear distinction between draft and persisted

**Exception**: Global components during editing

```typescript
// Global header reads from globalHeaderData
// Which is merged with tempData during editing
const headerData = useEditorStore((s) => s.globalHeaderData);

// In updateByPath for global header:
if (state.currentPage === "global-header") {
  // Merge tempData into globalHeaderData
  newData = deepMerge(state.globalHeaderData, state.tempData);
}
```

---

## Saving Changes Flow

### Complete Save Process

```
STEP 1: User Clicks "Save Changes"
────────────────────────────────────────────────
<button onClick={handleSave}>Save Changes</button>


STEP 2: handleSave() Executes
────────────────────────────────────────────────
const handleSave = () => {
  if (!selectedComponent) return;


STEP 3: Mark Changes Made
────────────────────────────────────────────────
  setHasChangesMade(true);

  // This triggers:
  // 1. Unsaved changes dialog (if user tries to leave)
  // 2. UI indicator that changes need to be published


STEP 4: Get Store State
────────────────────────────────────────────────
  const store = useEditorStore.getState();
  const currentPage = store.currentPage || "homepage";


STEP 5: Get Latest tempData
────────────────────────────────────────────────
  const latestTempData =
    selectedComponent.id === "global-header" ||
    selectedComponent.id === "global-footer"
      ? store.tempData || tempData
      : tempData;


STEP 6: Branch by Component Type
────────────────────────────────────────────────

  ┌─ BRANCH A: Global Header
  │  if (selectedComponent.id === "global-header") {
  │
  │    logChange(id, "header1", "header", latestTempData, "GLOBAL_HEADER");
  │
  │    // Update individual store
  │    setGlobalHeaderData(latestTempData);
  │
  │    // Update unified store
  │    setGlobalComponentsData({
  │      ...globalComponentsData,
  │      header: latestTempData
  │    });
  │
  │    // Notify parent (triggers re-render in LiveEditorUI)
  │    onComponentUpdate(selectedComponent.id, latestTempData);
  │
  │    onClose();
  │    return;
  │  }
  │
  ├─ BRANCH B: Global Footer
  │  if (selectedComponent.id === "global-footer") {
  │
  │    logChange(id, "footer1", "footer", latestTempData, "GLOBAL_FOOTER");
  │
  │    setGlobalFooterData(latestTempData);
  │    setGlobalComponentsData({
  │      ...globalComponentsData,
  │      footer: latestTempData
  │    });
  │    onComponentUpdate(selectedComponent.id, latestTempData);
  │
  │    onClose();
  │    return;
  │  }
  │
  └─ BRANCH C: Regular Component
     (continues to STEP 7)


STEP 7: Get Data Sources (Regular Component)
────────────────────────────────────────────────
  const uniqueVariantId = selectedComponent.id;  // UUID

  // Get store data
  const storeData = store.getComponentData(
    selectedComponent.type,
    uniqueVariantId
  );

  // Get page components
  const currentPageComponents =
    store.pageComponentsByPage[currentPage] || [];

  // Find existing component
  const existingComponent = currentPageComponents.find(
    comp => comp.id === selectedComponent.id
  );


STEP 8: Merge Data Sources (Critical!)
────────────────────────────────────────────────
  const mergedData = existingComponent?.data
    ? deepMerge(
        deepMerge(existingComponent.data, storeData),
        latestTempData
      )
    : deepMerge(storeData, latestTempData);

  // Priority order:
  // 1. latestTempData (highest - latest edits)
  // 2. storeData (middle - previous edits)
  // 3. existingComponent.data (lowest - original data)


STEP 9: Update Component Store
────────────────────────────────────────────────
  store.setComponentData(
    selectedComponent.type,
    uniqueVariantId,
    mergedData
  );

  // This updates:
  // - heroStates[uniqueVariantId] = mergedData
  // - pageComponentsByPage[currentPage][index].data = mergedData


STEP 10: Update Page Components Array
────────────────────────────────────────────────
  const updatedPageComponents = currentPageComponents.map(comp => {
    if (comp.id === selectedComponent.id) {
      return { ...comp, data: mergedData };
    }
    return comp;
  });

  store.forceUpdatePageComponents(currentPage, updatedPageComponents);


STEP 11: Notify Parent Component
────────────────────────────────────────────────
  onComponentUpdate(selectedComponent.id, mergedData);

  // This triggers re-render in LiveEditorUI:
  setPageComponents((current) =>
    current.map(c =>
      c.id === id ? { ...c, data: newData } : c
    )
  );


STEP 12: Sync tempData
────────────────────────────────────────────────
  setTempData(mergedData);

  // Keep tempData in sync with saved data
  // Allows user to continue editing without reloading


STEP 13: Close Sidebar
────────────────────────────────────────────────
  onClose();

  // Sidebar slides out
  // User sees updated component in iframe ✓
  // Changes persisted in stores ✓
  // Ready to publish to database ✓
}
```

### Visual Representation

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA MERGE FLOW                          │
└─────────────────────────────────────────────────────────────┘

existingComponent.data    storeData              latestTempData
(from pageComponents)     (from heroStates)      (from editing)
────────────────────      ────────────────       ────────────────
{                         {                      {
  visible: true,            visible: true,         content: {
  content: {                content: {               title: "New Title"
    title: "Old Title",       title: "Old Title",  }
    subtitle: "Old Sub"       subtitle: "Old Sub", }
  },                          font: "Tajawal"
  layout: {                 },
    padding: "16px"         layout: {
  }                           padding: "16px"
}                           }
                          }

         │                        │                      │
         └────────┬───────────────┴──────────────────────┘
                  │
                  ▼
         deepMerge(deepMerge(existing, store), temp)
                  │
                  ▼
            ┌─────────────────┐
            │  MERGED RESULT  │
            └─────────────────┘
                  │
                  ▼
{
  visible: true,
  content: {
    title: "New Title",      ← From tempData
    subtitle: "Old Sub",     ← Preserved from store
    font: "Tajawal"          ← Preserved from store
  },
  layout: {
    padding: "16px"          ← Preserved from existing
  }
}
```

**Why Three-Way Merge?**

- **existingComponent.data**: Original data from page, may have fields not in store
- **storeData**: Data from component states, may have previous edits
- **tempData**: Latest edits from current session

Without three-way merge, we risk LOSING data from any of these sources!

---

## Data Source Resolution

### In DynamicFieldsRenderer.getValueByPath()

**Decision Tree**:

```
getValueByPath(path)
  ↓
┌─ Check 1: currentData provided?
│  ├─ Yes → Use currentData
│  └─ No → Continue
│     ↓
│  ┌─ Check 2: Is global header?
│  │  ├─ Yes → Use globalComponentsData.header || tempData
│  │  └─ No → Continue
│  │     ↓
│  │  ┌─ Check 3: Is global footer?
│  │  │  ├─ Yes → Use globalComponentsData.footer || tempData
│  │  │  └─ No → Continue
│  │  │     ↓
│  │  │  ┌─ Check 4: Has componentType and variantId?
│  │  │  │  ├─ Yes →
│  │  │  │  │  const componentData = getComponentData(type, id);
│  │  │  │  │  Use tempData || currentData || componentData
│  │  │  │  └─ No → Use tempData
│  │  │  │
│  │  │  └─ Result: cursor = selected data source
│  │  │
│  │  └─ Navigate path through cursor
│  │
│  └─ Return final value
│
└─ Return value
```

**Priority Summary**:

```
1. currentData (explicit override)
2. globalComponentsData (for global components)
3. tempData (during editing)
4. componentData from store (fallback)
5. {} (empty object fallback)
```

### Why This Complexity?

Different contexts need different data sources:

**Context 1: Initial Load**

- currentData passed from parent
- Use currentData to show existing values

**Context 2: Editing Global Header**

- variantId = "global-header"
- Use globalComponentsData.header
- Updates go to tempData
- On save, tempData → globalComponentsData

**Context 3: Editing Regular Component**

- variantId = component UUID
- Use tempData if available (live editing)
- Fallback to componentData from store
- Updates go to tempData
- On save, tempData merged into componentStates

---

## Update Path Routing

### From EditorSidebar.index.tsx

When user edits field in sidebar:

```typescript
// In EditorSidebar
<AdvancedSimpleSwitcher
  onUpdateByPath={(path, value) => {
    // Validation
    if (!path || path.trim() === "") {
      console.error("Invalid path:", path);
      return;
    }

    // Route based on component type
    if (selectedComponent.id === "global-header") {
      // Validate header paths
      const validPaths = ["visible", "position", "logo", "menu", ...];
      const pathRoot = path.split(".")[0];

      if (!validPaths.includes(pathRoot)) {
        console.warn("Potentially invalid header path:", path);
      }

      updateByPath(path, value);  // Update tempData

    } else if (selectedComponent.id === "global-footer") {
      // Validate footer paths
      const validPaths = ["visible", "background", "content", ...];
      const pathRoot = path.split(".")[0];

      if (!validPaths.includes(pathRoot)) {
        console.warn("Potentially invalid footer path:", path);
      }

      updateByPath(path, value);  // Update tempData

    } else {
      // Regular components
      if (
        path === "content.imagePosition" &&
        selectedComponent.type === "halfTextHalfImage"
      ) {
        // Special: Update both paths
        updateComponentByPath(type, id, "content.imagePosition", value);
        updateComponentByPath(type, id, "imagePosition", value);

      } else {
        // Standard update
        updateComponentByPath(type, id, path, value);
      }
    }
  }}
/>
```

**Key Points**:

1. **Path validation**: Check if path is valid for component type
2. **Special cases**: Handle known edge cases (imagePosition)
3. **Global vs Regular**: Different update functions
4. **Security**: Warn on potentially invalid paths

### From AdvancedSimpleSwitcher.tsx

```typescript
// In AdvancedSimpleSwitcher
<DynamicFieldsRenderer
  onUpdateByPath={handleUpdateByPath}
/>

const handleUpdateByPath = (path, value) => {
  if (onUpdateByPath) {
    // Use unified update function
    onUpdateByPath(path, value);
  } else {
    // Fallback routing
    if (selectedComponent?.id === "global-header") {
      updateGlobalComponentByPath("header", path, value);
    } else if (selectedComponent?.id === "global-footer") {
      updateGlobalComponentByPath("footer", path, value);
    } else {
      updateByPath(path, value);
    }
  }
};
```

### From DynamicFieldsRenderer.tsx

```typescript
// In DynamicFieldsRenderer
const updateValue = (path, value) => {
  // Special case handling...

  if (onUpdateByPath) {
    // Regular components: Update tempData
    if (
      componentType &&
      variantId &&
      variantId !== "global-header" &&
      variantId !== "global-footer"
    ) {
      updateByPath(path, value); // tempData update
    } else {
      onUpdateByPath(path, value); // Global component update
    }
  } else {
    updateByPath(path, value);
  }
};
```

**Callback Chain**:

```
Field Renderer onChange
  ↓
updateValue(path, value)
  ↓
onUpdateByPath(path, value)  [if provided]
  ↓
handleUpdateByPath(path, value)
  ↓
EditorSidebar onUpdateByPath callback
  ↓
updateComponentByPath(type, id, path, value) or updateByPath(path, value)
  ↓
editorStore.updateComponentByPath() or editorStore.updateByPath()
  ↓
Store state updated
```

---

## Special Cases

### Case 1: halfTextHalfImage imagePosition

**Problem**: Component has TWO properties for same data:

- `imagePosition` (top-level, legacy)
- `content.imagePosition` (nested, new structure)

**Solution**: Update BOTH simultaneously

```typescript
// In DynamicFieldsRenderer.updateValue
if (path === "content.imagePosition" && componentType === "halfTextHalfImage") {
  if (onUpdateByPath) {
    onUpdateByPath("content.imagePosition", value);
    onUpdateByPath("imagePosition", value); // ← Update both!
  } else {
    updateComponentByPath(type, id, "content.imagePosition", value);
    updateComponentByPath(type, id, "imagePosition", value);
  }
  return; // Early exit
}
```

**Why?**: Component reads from BOTH paths for backward compatibility

### Case 2: halfTextHalfImage layout.direction

**Problem**: Similar to imagePosition - dual paths

**Solution**: Explicit handling

```typescript
if (path === "layout.direction" && componentType === "halfTextHalfImage") {
  if (onUpdateByPath) {
    onUpdateByPath("layout.direction", value);
  } else {
    updateComponentByPath(type, id, "layout.direction", value);
  }
  return;
}
```

### Case 3: contactCards with Missing Cards

**Problem**: API might return component without `cards` array

**Solution**: Check before using, fallback to defaults

```typescript
// In EditorSidebar initialization
if (selectedComponent.type === "contactCards") {
  const hasCards =
    selectedComponent.data?.cards &&
    Array.isArray(selectedComponent.data.cards) &&
    selectedComponent.data.cards.length > 0;

  dataToUse = hasCards ? selectedComponent.data : defaultData; // ← Use defaults if no cards
}
```

**Why?**: Prevents errors when rendering ArrayFieldRenderer for cards

### Case 4: Global Component Path Validation

**Problem**: Need to validate paths are appropriate for component type

**Solution**: Whitelist valid path roots

```typescript
// In EditorSidebar onUpdateByPath
if (selectedComponent.id === "global-header") {
  const validHeaderPaths = [
    "visible",
    "position",
    "height",
    "background",
    "colors",
    "logo",
    "menu",
    "actions",
    "responsive",
    "animations",
  ];

  const pathRoot = path.split(".")[0];

  if (!validHeaderPaths.includes(pathRoot)) {
    console.warn("Potentially invalid header path:", path);
  }

  updateByPath(path, value);
}
```

**Why?**: Catch typos and prevent invalid data structure

### Case 5: Array Field Conditional Rendering

**Problem**: Some fields should only show for specific item types

**Example**: `options` field only relevant for "select" or "radio" type fields

**Solution**: Check field type before rendering

```typescript
// In ArrayFieldRenderer
{
  arrDef.of.map((f) => {
    // Conditional rendering for Options field
    if (f.key === "options" && f.label === "Field Options (for Select/Radio)") {
      const fieldType = getValueByPath(`${itemPath}.type`);

      if (fieldType !== "radio" && fieldType !== "select") {
        return null; // Don't render options field
      }
    }

    return renderField(f, itemPath);
  });
}
```

---

## Data Synchronization Points

### Point 1: Opening Sidebar

```
selectedComponent prop changes
  ↓
useEffect triggers
  ↓
Data loaded:
  - For global: globalComponentsData → tempData
  - For regular: componentStates → tempData
  ↓
DynamicFieldsRenderer gets tempData
  ↓
Fields display current values
```

### Point 2: Editing Fields

```
User types in field
  ↓
updateValue(path, value)
  ↓
updateByPath(path, value) in store
  ↓
tempData updated
  ↓
getValueByPath(path) returns new value
  ↓
Field shows new value immediately
```

### Point 3: Saving

```
handleSave()
  ↓
Merge: existing + store + tempData
  ↓
Update component state
  ↓
Update pageComponentsByPage
  ↓
Notify parent (onComponentUpdate)
  ↓
Parent updates pageComponents
  ↓
Component re-renders in iframe with saved data
```

### Point 4: Canceling

```
User clicks "Cancel"
  ↓
handleCancel()
  ├─ Global component?
  │  └─ Restore original: setTempData(globalHeaderData)
  └─ Regular component?
     └─ Clear draft: setTempData({})
  ↓
onClose()
  ↓
Sidebar closes
  ↓
tempData discarded
  ↓
Component in iframe unchanged ✓
```

---

## Update Flow Diagrams

### Regular Component Update

```
User types "New Title"
  ↓
onChange event
  ↓
updateValue("content.title", "New Title")
  ↓
  ┌─ onUpdateByPath provided?
  │  ├─ Yes → updateByPath("content.title", "New Title")
  │  └─ No → updateByPath("content.title", "New Title")
  │     ↓
  └─→ editorStore.updateByPath()
         ↓
      Parse path: ["content", "title"]
         ↓
      newData = { ...tempData }
         ↓
      Navigate: newData.content.title = "New Title"
         ↓
      Return: { tempData: newData }
         ↓
      tempData updated in store
         ↓
      Component re-reads via getValueByPath()
         ↓
      Returns "New Title"
         ↓
      Field displays "New Title"
         ↓
      NOT YET SAVED TO COMPONENT STATES
      (Only in tempData)
```

### Global Component Update

```
User edits menu item text
  ↓
updateValue("menu[0].text", "New Menu Text")
  ↓
onUpdateByPath("menu[0].text", "New Menu Text")
  ↓
EditorSidebar onUpdateByPath callback
  ↓
updateByPath("menu[0].text", "New Menu Text")
  ↓
editorStore.updateByPath()
  ↓
Parse: ["menu", "0", "text"]
  ↓
Check currentPage:
  currentPage === "global-header"
    ↓
  Deep merge with globalHeaderData:
    newData = deepMerge(globalHeaderData, tempData)
    ↓
  Navigate and update:
    newData.menu[0].text = "New Menu Text"
    ↓
  Return: { tempData: newData }
    ↓
  tempData updated
    ↓
  Header component reads globalHeaderData
    (which doesn't include tempData yet!)
    ↓
  On SAVE:
    setGlobalHeaderData(tempData)
    ↓
  Now globalHeaderData has new menu text ✓
```

**Key Difference**: Global components require save to update `globalHeaderData`, not just `tempData`

---

## Important Rules for AI

### Rule 1: Always Use Deep Merge for Save

```typescript
// ✅ CORRECT
const mergedData = deepMerge(
  deepMerge(existingComponent.data, storeData),
  latestTempData,
);

// ❌ WRONG - Loses nested data
const mergedData = {
  ...existingComponent.data,
  ...storeData,
  ...latestTempData,
};
```

### Rule 2: Check Component ID for Global Components

```typescript
// ✅ CORRECT
if (selectedComponent.id === "global-header") {
  // Handle as global
}

// ❌ WRONG - componentName is not unique identifier
if (selectedComponent.componentName === "header1") {
  // This might match multiple components!
}
```

### Rule 3: Update tempData, Not Component States Directly

```typescript
// ✅ CORRECT - During editing
updateByPath(path, value); // Updates tempData

// ❌ WRONG - During editing
updateComponentByPath(type, id, path, value); // Updates component states
```

**Exception**: Only update component states on SAVE, not during editing

### Rule 4: Initialize tempData Before Editing

```typescript
// ✅ CORRECT
useEffect(() => {
  if (view === "edit-component" && selectedComponent) {
    const data = store.getComponentData(type, id);
    setTempData(data || {});
  }
}, [selectedComponent, view]);

// ❌ WRONG - tempData not initialized
// User edits → tempData empty → data lost on save!
```

### Rule 5: Clear tempData on Cancel

```typescript
// ✅ CORRECT
handleCancel() {
  setTempData({});  // Clear drafts
  onClose();
}

// ❌ WRONG - tempData persists
handleCancel() {
  onClose();  // tempData still has old edits!
}
```

---

## Debugging Data Flow

### Check What Data Source is Being Used

```typescript
// In DynamicFieldsRenderer.getValueByPath
console.log("🔍 Data Source Resolution:", {
  path,
  currentDataKeys: currentData ? Object.keys(currentData) : null,
  tempDataKeys: tempData ? Object.keys(tempData) : null,
  variantId,
  isGlobalHeader: variantId === "global-header",
  isGlobalFooter: variantId === "global-footer",
  selectedSource: cursor ? "determined" : "none",
});
```

### Trace Update Path

```typescript
// In DynamicFieldsRenderer.updateValue
console.log("🔍 Update Value:", {
  path,
  value,
  componentType,
  variantId,
  isGlobal: variantId === "global-header" || variantId === "global-footer",
  hasCallback: !!onUpdateByPath,
  willUpdateTempData: true,
});
```

### Verify Save Merge

```typescript
// In EditorSidebar.handleSave
console.log("🔧 Merge Process:", {
  existingData: existingComponent?.data,
  storeData,
  latestTempData,
  mergedData,
  mergePriority: "existing < store < tempData",
});
```

### Check Store Synchronization

```typescript
// After save
const state = useEditorStore.getState();
console.log("✅ Post-Save Verification:", {
  componentState: state.heroStates[id],
  pageComponent: state.pageComponentsByPage[currentPage].find(
    (c) => c.id === id,
  ),
  dataMatches:
    JSON.stringify(state.heroStates[id]) ===
    JSON.stringify(
      state.pageComponentsByPage[currentPage].find((c) => c.id === id)?.data,
    ),
});
```

---

## Summary

The EditorSidebar data flow is complex but follows clear patterns:

1. **Opening**: Load data from appropriate source into tempData
2. **Editing**: All changes go to tempData (not component states)
3. **Saving**: Merge tempData into component states and pageComponentsByPage
4. **Canceling**: Discard tempData without affecting stores

**Key Principles**:

- tempData is for drafts
- Component states are for rendering
- pageComponentsByPage is source of truth for pages
- Global components have separate handling
- Deep merge prevents data loss
- Path-based updates enable precision
- Synchronization keeps all stores aligned

Understanding this flow is essential for:

- Adding new component types
- Debugging save issues
- Implementing new field types
- Optimizing performance
- Maintaining data consistency
