# Troubleshooting Guide

## Table of Contents

1. [Common Issues](#common-issues)
2. [Data Issues](#data-issues)
3. [Rendering Issues](#rendering-issues)
4. [Store Issues](#store-issues)
5. [Drag & Drop Issues](#drag--drop-issues)
6. [Global Component Issues](#global-component-issues)
7. [Performance Issues](#performance-issues)

---

## Common Issues

### Issue 1: Changes Not Saving

**Symptoms**:

- User edits component
- Clicks "Save Changes"
- Changes don't persist after reload

**Possible Causes**:

#### Cause A: tempData Not Initialized

**Check**:

```typescript
console.log("tempData on save:", useEditorStore.getState().tempData);
```

**Solution**:

```typescript
// In EditorSidebar initialization
useEffect(() => {
  if (view === "edit-component" && selectedComponent) {
    const store = useEditorStore.getState();
    const currentData = store.getComponentData(type, id);

    setTempData(currentData || {}); // ✅ Initialize tempData
  }
}, [selectedComponent, view]);
```

#### Cause B: Shallow Merge Instead of Deep Merge

**Check**:

```typescript
console.log("Merge result:", {
  existing: existingData,
  store: storeData,
  temp: tempData,
  merged: mergedData,
});

// Look for missing nested fields in merged
```

**Solution**:

```typescript
// ❌ WRONG - Shallow merge
const merged = { ...existing, ...store, ...temp };

// ✅ CORRECT - Deep merge
const merged = deepMerge(deepMerge(existing, store), temp);
```

#### Cause C: Store Not Updated

**Check**:

```typescript
setTimeout(() => {
  console.log(
    "Store after save:",
    useEditorStore.getState().getComponentData(type, id),
  );
}, 100);
```

**Solution**:

```typescript
// Ensure both stores updated
store.setComponentData(type, id, mergedData); // Component state
store.forceUpdatePageComponents(page, updated); // Page components
```

#### Cause D: Parent Not Notified

**Check**:

```typescript
console.log("onComponentUpdate called:", id, mergedData);
```

**Solution**:

```typescript
// Ensure callback called
if (onComponentUpdate) {
  onComponentUpdate(selectedComponent.id, mergedData);
} else {
  console.warn("No onComponentUpdate callback!");
}
```

---

### Issue 2: Component Not Rendering in iframe

**Symptoms**:

- Component appears in list but not in iframe
- White screen or empty section

**Possible Causes**:

#### Cause A: Component Not in ComponentsList

**Check**:

```typescript
import { COMPONENTS } from "@/lib-liveeditor/ComponentsList";
console.log("Component registered:", !!COMPONENTS[componentType]);
```

**Solution**:
Add to ComponentsList.tsx

#### Cause B: Component File Not Found

**Check**:

```typescript
// Check import path
const componentPath = `components/tenant/${type}/${componentName}.tsx`;
console.log("Component path:", componentPath);
```

**Solution**:
Ensure component file exists at correct path

#### Cause C: Invalid Data Structure

**Check**:

```typescript
console.log("Component data:", mergedData);
console.log("Required fields:", Object.keys(getDefaultData()));
```

**Solution**:
Ensure data has all required fields

#### Cause D: iframe Not Ready

**Check**:

```typescript
console.log("iframe ready:", iframeReady);
console.log("styles loaded:", stylesLoaded);
```

**Solution**:

```typescript
{iframeReady && stylesLoaded && (
  <Component {...data} />
)}
```

---

### Issue 3: EditorSidebar Not Opening

**Symptoms**:

- Click component to edit
- Sidebar doesn't open

**Possible Causes**:

#### Cause A: selectedComponentId Not Set

**Check**:

```typescript
console.log("Selected component ID:", selectedComponentId);
```

**Solution**:

```typescript
const handleEditClick = (componentId) => {
  console.log("Setting selected:", componentId);
  setSelectedComponentId(componentId);
  setSidebarView("edit-component");
  setSidebarOpen(true);
};
```

#### Cause B: View Not Changed

**Check**:

```typescript
console.log("Sidebar view:", sidebarView);
console.log("Sidebar open:", sidebarOpen);
```

**Solution**:
Ensure both view and open state updated

#### Cause C: Animation Blocking

**Check**:
Check CSS for display issues

**Solution**:

```typescript
// Ensure AnimatePresence not blocking
<AnimatePresence>
  {sidebarOpen && (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      style={{ position: "fixed" }}  // ✅ Ensure positioned
    >
      <EditorSidebar ... />
    </motion.div>
  )}
</AnimatePresence>
```

---

## Data Issues

### Issue 4: Data Lost After Save

**Symptoms**:

- Save changes
- Some fields disappear

**Diagnosis**:

```typescript
// Before save
console.log("Before save:", {
  existing: existingComponent.data,
  store: storeData,
  temp: tempData,
});

// After save
console.log("After save:", mergedData);

// Compare
const lostFields = Object.keys(existingComponent.data).filter(
  (key) => !(key in mergedData),
);

console.log("Lost fields:", lostFields);
```

**Root Cause**: Shallow merge or missing data source

**Solution**:

```typescript
// Include ALL data sources in merge
const mergedData = deepMerge(
  deepMerge(deepMerge(defaultData, existingComponent.data), storeData),
  tempData,
);
```

---

### Issue 5: Duplicate Component IDs

**Symptoms**:

- Components have same ID
- Updates affect wrong component

**Diagnosis**:

```typescript
const checkDuplicateIds = (components) => {
  const ids = components.map((c) => c.id);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);

  if (duplicates.length > 0) {
    console.error("Duplicate IDs found:", duplicates);
    return true;
  }

  return false;
};

const hasDuplicates = checkDuplicateIds(pageComponents);
```

**Solution**:

```typescript
// Always use UUID for new components
import { v4 as uuidv4 } from "uuid";

const newComponent = {
  id: uuidv4(), // ✅ Unique ID
  type,
  componentName,
  data,
};

// ❌ WRONG
const newComponent = {
  id: componentName, // Not unique!
  type,
  componentName,
  data,
};
```

---

### Issue 6: Wrong Data Source

**Symptoms**:

- EditorSidebar shows wrong values
- Component renders wrong content

**Diagnosis**:

```typescript
// Check all data sources
console.log("Data sources:", {
  currentData,
  tempData: useEditorStore.getState().tempData,
  storeData: useEditorStore.getState().getComponentData(type, id),
  propsData: component.data,
  globalData: useEditorStore.getState().globalHeaderData,
});
```

**Solution**:
Follow correct priority:

```typescript
const data =
  currentData || // Explicit override
  (isGlobal ? globalComponentsData[type] : null) || // Global components
  tempData || // During editing
  getComponentData(type, id) || // From store
  {}; // Fallback
```

---

## Rendering Issues

### Issue 7: Styles Not Applying in iframe

**Symptoms**:

- Components render but without styles
- Tailwind classes not working

**Diagnosis**:

```typescript
// Check iframe has styles
const iframeDoc = iframeRef.current?.contentDocument;
const iframeStyles = iframeDoc?.querySelectorAll(
  'style, link[rel="stylesheet"]',
);
const parentStyles = document.querySelectorAll('style, link[rel="stylesheet"]');

console.log("Styles comparison:", {
  iframe: iframeStyles?.length,
  parent: parentStyles?.length,
  match: iframeStyles?.length === parentStyles?.length,
});
```

**Solution**:

```typescript
// Force style recopy
stylesInitializedRef.current = false;
copyStylesToIframe(iframeDoc);

// Or increase wait time
const checkStylesLoaded = () => {
  if (iframeStyles.length >= parentStyles.length) {
    setStylesLoaded(true);
  } else {
    setTimeout(checkStylesLoaded, 100); // Increase from 50ms
  }
};
```

---

### Issue 8: Component Not Re-Rendering

**Symptoms**:

- Data updated in store
- Component doesn't reflect changes

**Diagnosis**:

```typescript
// Check component key
console.log("Component key:", component.id);

// Check if data reference changed
const oldData = useRef();
console.log("Data changed:", oldData.current !== component.data);
oldData.current = component.data;
```

**Solution**:

```typescript
// Option 1: Force re-render with key
<Component
  key={`${component.id}-${forceUpdate}`}
  data={data}
/>

// Option 2: Use state instead of props
const [componentData, setComponentData] = useState(data);

useEffect(() => {
  setComponentData(data);
}, [data]);

// Option 3: Deep clone data
const clonedData = JSON.parse(JSON.stringify(data));
```

---

### Issue 9: CSS Variables Not Updating

**Symptoms**:

- Theme changes don't reflect in iframe
- Colors stay old

**Diagnosis**:

```typescript
// Check CSS variable values
const iframeDoc = iframeRef.current?.contentDocument;
const iframeVars = getComputedStyle(iframeDoc.documentElement).getPropertyValue(
  "--primary-color",
);
const parentVars = getComputedStyle(document.documentElement).getPropertyValue(
  "--primary-color",
);

console.log("CSS Variables:", {
  parent: parentVars,
  iframe: iframeVars,
  match: parentVars === iframeVars,
});
```

**Solution**:

```typescript
// Force CSS variable update
updateCSSVariables(iframeDoc);

// Or decrease interval
const interval = setInterval(() => {
  updateCSSVariables(iframeDoc);
}, 500); // 500ms instead of 1000ms
```

---

## Store Issues

### Issue 10: Store Desynchronization

**Symptoms**:

- heroStates has one value
- pageComponentsByPage has different value

**Diagnosis**:

```typescript
const checkSync = (type, id, page) => {
  const store = useEditorStore.getState();

  const componentStateData = store[`${type}States`]?.[id];
  const pageComponentData = store.pageComponentsByPage[page]?.find(
    (c) => c.id === id,
  )?.data;

  const synced =
    JSON.stringify(componentStateData) === JSON.stringify(pageComponentData);

  console.log("Store sync check:", {
    synced,
    componentStateData,
    pageComponentData,
  });

  return synced;
};

checkSync("hero", "uuid-123", "homepage");
```

**Solution**:

```typescript
// Ensure component functions update BOTH stores
setData: (state, variantId, data) => {
  const updatedComponents = state.pageComponentsByPage[state.currentPage].map(
    (comp) => (comp.id === variantId ? { ...comp, data } : comp),
  );

  return {
    heroStates: {
      ...state.heroStates,
      [variantId]: data,
    },
    pageComponentsByPage: {
      ...state.pageComponentsByPage,
      [state.currentPage]: updatedComponents,
    },
  };
};
```

---

### Issue 11: Global Component Not Updating

**Symptoms**:

- Edit global header
- Changes don't show

**Diagnosis**:

```typescript
console.log("Component ID:", selectedComponent.id);
console.log(
  "Is global:",
  selectedComponent.id === "global-header" ||
    selectedComponent.id === "global-footer",
);

console.log("Global data:", {
  globalHeaderData: useEditorStore.getState().globalHeaderData,
  globalFooterData: useEditorStore.getState().globalFooterData,
  globalComponentsData: useEditorStore.getState().globalComponentsData,
});
```

**Solution**:

```typescript
// Ensure using correct update function
if (selectedComponent.id === "global-header") {
  // ✅ CORRECT
  updateGlobalComponentByPath("header", path, value);

  // ❌ WRONG
  // updateComponentByPath("header", id, path, value);
}
```

---

## Drag & Drop Issues

### Issue 12: Component Drops at Wrong Position

**Symptoms**:

- Drag component
- Drops at unexpected index

**Diagnosis**:

```typescript
// Enable drag debug logging
const DEBUG = true;

// Check position calculation
console.log("Position calculation:", {
  dragY,
  sortedElements: sortedElements.map((el) => ({
    id: el.id,
    top: el.top,
    index: el.index,
  })),
  calculatedIndex,
  adjustedIndex,
});
```

**Solution**:

```typescript
// Ensure elements sorted by visual position (top)
const sortedElements = Array.from(
  iframeDoc.querySelectorAll("[data-component-id]"),
)
  .map((el) => ({
    id: el.getAttribute("data-component-id"),
    index: parseInt(el.getAttribute("data-index") || "0"),
    top: el.getBoundingClientRect().top,
  }))
  .sort((a, b) => a.top - b.top); // ✅ Sort by top!
```

---

### Issue 13: Position Validation Fails

**Symptoms**:

- After drag & drop, validation shows errors
- Positions not sequential

**Diagnosis**:

```typescript
const validation = validateComponentPositions(pageComponents);

console.log("Validation:", {
  isValid: validation.isValid,
  issues: validation.issues,
  suggestions: validation.suggestions,
  positions: pageComponents.map((c) => c.position),
});
```

**Solution**:

```typescript
// Reset positions to sequential
const resetPositions = () => {
  const fixed = pageComponents.map((comp, index) => ({
    ...comp,
    position: index,
    layout: {
      ...comp.layout,
      row: index,
    },
  }));

  setPageComponents(fixed);

  setTimeout(() => {
    store.forceUpdatePageComponents(currentPage, fixed);
  }, 0);
};
```

---

## Global Component Issues

### Issue 14: Global Header Changes Lost

**Symptoms**:

- Edit global header
- Save changes
- After reload, changes gone

**Diagnosis**:

```typescript
// Check if saved to correct store
console.log("After save:", {
  globalHeaderData: useEditorStore.getState().globalHeaderData,
  globalComponentsData: useEditorStore.getState().globalComponentsData.header,
  inPayload: payload.globalComponentsData?.header,
});
```

**Solution**:

```typescript
// Ensure ALL global stores updated
if (selectedComponent.id === "global-header") {
  setGlobalHeaderData(latestTempData); // ✅ Individual store
  setGlobalComponentsData({
    // ✅ Unified store
    ...globalComponentsData,
    header: latestTempData,
  });

  // ✅ Ensure in save payload
  const payload = {
    pages: pageComponentsByPage,
    globalComponentsData: {
      header: latestTempData, // ← Must be here!
      footer: globalComponentsData.footer,
    },
  };
}
```

---

### Issue 15: Global Component Not Excluded from pageComponentsByPage

**Symptoms**:

- Global header appears in page components
- Duplicated on save

**Diagnosis**:

```typescript
const globalInPages = Object.values(
  useEditorStore.getState().pageComponentsByPage,
).some((components) =>
  components.some((c) => c.id === "global-header" || c.id === "global-footer"),
);

console.log("Global in pages:", globalInPages); // Should be false!
```

**Solution**:

```typescript
// Filter out global components when setting page components
const setPageComponentsForPage = (page, components) => {
  const filtered = components.filter(
    (c) => c.id !== "global-header" && c.id !== "global-footer",
  );

  store.forceUpdatePageComponents(page, filtered);
};
```

---

## Performance Issues

### Issue 16: Slow Rendering

**Symptoms**:

- iframe lags when scrolling
- Editing feels slow

**Diagnosis**:

```typescript
// Measure component render time
const renderStart = performance.now();

useEffect(() => {
  const renderTime = performance.now() - renderStart;
  console.log(`Render time: ${renderTime}ms`);

  if (renderTime > 100) {
    console.warn("Slow render detected!");
  }
}, []);
```

**Solutions**:

1. **Use memoization**:

```typescript
const MemoizedComponent = React.memo(MyComponent, (prev, next) => {
  return JSON.stringify(prev.data) === JSON.stringify(next.data);
});
```

2. **Lazy load heavy components**:

```typescript
const HeavyComponent = lazy(() => import("./HeavyComponent"));

<Suspense fallback={<Skeleton />}>
  <HeavyComponent {...data} />
</Suspense>
```

3. **Debounce updates**:

```typescript
const debouncedUpdate = useDebouncedCallback(
  (path, value) => updateByPath(path, value),
  300,
);
```

---

### Issue 17: Memory Leaks

**Symptoms**:

- Memory usage increases over time
- Browser becomes slow

**Diagnosis**:

```typescript
// Check for uncleaned effects
const checkEffects = () => {
  // Look for useEffect without cleanup
  // Check for setInterval without clearInterval
  // Check for addEventListener without removeEventListener
};
```

**Solution**:

```typescript
// ✅ GOOD - Cleanup registered
useEffect(() => {
  const interval = setInterval(fn, 1000);
  const listener = () => {};
  document.addEventListener("click", listener);

  return () => {
    clearInterval(interval);
    document.removeEventListener("click", listener);
  };
}, []);
```

---

## Quick Fixes

### Quick Fix 1: Reset Everything

```typescript
const resetAllStores = () => {
  const editorStore = useEditorStore.getState();

  // Clear tempData
  editorStore.setTempData({});

  // Clear change tracking
  editorStore.setHasChangesMade(false);

  // Close dialogs
  editorStore.closeDialog();

  // Reload from database
  const tenantData = useTenantStore.getState().tenantData;
  if (tenantData) {
    editorStore.loadFromDatabase(tenantData);
  }

  console.log("🔄 All stores reset");
};
```

---

### Quick Fix 2: Force Re-Sync

```typescript
const forceSyncStores = () => {
  const store = useEditorStore.getState();

  // Re-sync pageComponentsByPage with component states
  for (const [page, components] of Object.entries(store.pageComponentsByPage)) {
    const synced = components.map((comp) => {
      const storeData = store.getComponentData(comp.type, comp.id);
      return {
        ...comp,
        data: storeData || comp.data,
      };
    });

    store.forceUpdatePageComponents(page, synced);
  }

  console.log("✅ Stores re-synchronized");
};
```

---

### Quick Fix 3: Reload iframe

```typescript
const reloadIframe = () => {
  if (iframeRef.current) {
    const src = iframeRef.current.src;
    iframeRef.current.src = "";

    setTimeout(() => {
      iframeRef.current.src = src;
    }, 10);
  }
};
```

---

## Debug Commands (Browser Console)

### Get Store State

```javascript
// Get editor store
window.editorStore = useEditorStore.getState();

// Get tenant store
window.tenantStore = useTenantStore.getState();

// Inspect
console.log(window.editorStore);
console.log(window.tenantStore);
```

### Inspect Component

```javascript
// Find component by ID
const findComponent = (id) => {
  const store = useEditorStore.getState();

  for (const [page, components] of Object.entries(store.pageComponentsByPage)) {
    const found = components.find((c) => c.id === id);
    if (found) {
      return { page, component: found };
    }
  }

  return null;
};

// Usage
const result = findComponent("uuid-123");
console.log(result);
```

### Dump All Data

```javascript
const dumpAllData = () => {
  const editor = useEditorStore.getState();
  const tenant = useTenantStore.getState();

  const dump = {
    timestamp: new Date().toISOString(),

    pages: editor.pageComponentsByPage,
    globalComponents: editor.globalComponentsData,

    componentStates: {
      hero: editor.heroStates,
      header: editor.headerStates,
      footer: editor.footerStates,
      // ... all states
    },

    tempData: editor.tempData,
    currentPage: editor.currentPage,
    hasChanges: editor.hasChangesMade,

    tenant: {
      id: tenant.tenantId,
      data: tenant.tenantData,
    },
  };

  console.log("📊 Complete dump:", dump);

  // Download as JSON
  const blob = new Blob([JSON.stringify(dump, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `live-editor-dump-${Date.now()}.json`;
  a.click();
};
```

---

## Prevention Tips

### Tip 1: Always Validate Before Operations

```typescript
const safeOperation = (component, operation) => {
  // Validate component
  if (!component || !component.id) {
    console.error("Invalid component");
    return;
  }

  // Validate component type
  if (!COMPONENTS[component.type]) {
    console.error("Unknown component type:", component.type);
    return;
  }

  // Perform operation
  operation(component);
};
```

---

### Tip 2: Use TypeScript Strictly

```typescript
// Define strict interfaces
interface ComponentData {
  visible: boolean; // Required
  content: {
    title: string; // Required
    subtitle?: string; // Optional
  };
}

// TypeScript prevents errors
const updateComponent = (data: ComponentData) => {
  // Can't pass wrong structure
};
```

---

### Tip 3: Log Critical Operations

```typescript
const criticalOperation = () => {
  console.log("🚀 Critical operation starting");

  try {
    const result = performOperation();

    console.log("✅ Critical operation successful:", result);
    debugLogger.log("CRITICAL", "SUCCESS", result);

    return result;
  } catch (error) {
    console.error("❌ Critical operation failed:", error);
    debugLogger.log("CRITICAL", "ERROR", { error: error.message });

    throw error;
  }
};
```

---

### Tip 4: Test Edge Cases

```typescript
const testEdgeCases = () => {
  // Test with empty data
  testWithData({});

  // Test with null
  testWithData(null);

  // Test with undefined
  testWithData(undefined);

  // Test with invalid structure
  testWithData({ wrong: "structure" });

  // Test with very long arrays
  testWithData({ items: new Array(1000).fill({}) });
};
```

---

## Recovery Procedures

### Procedure 1: Recover Lost Changes

```typescript
const recoverChanges = () => {
  // Get change logs
  const changes = getAllChangeLogs();

  if (changes.length === 0) {
    console.log("No changes to recover");
    return;
  }

  // Get last change
  const lastChange = changes[changes.length - 1];

  console.log("Last change:", lastChange);

  // Restore from last change
  const store = useEditorStore.getState();
  store.setComponentData(
    lastChange.componentType,
    lastChange.componentId,
    lastChange.after,
  );

  console.log("✅ Changes recovered");
};
```

---

### Procedure 2: Fix Corrupted Positions

```typescript
const fixPositions = () => {
  const store = useEditorStore.getState();

  for (const [page, components] of Object.entries(store.pageComponentsByPage)) {
    const fixed = components
      .sort((a, b) => (a.position || 0) - (b.position || 0))
      .map((comp, index) => ({
        ...comp,
        position: index,
        layout: {
          ...comp.layout,
          row: index,
        },
      }));

    store.forceUpdatePageComponents(page, fixed);
  }

  console.log("✅ All positions fixed");
};
```

---

### Procedure 3: Restore From Database

```typescript
const restoreFromDatabase = async () => {
  const tenantId = useTenantStore.getState().tenantId;

  if (!tenantId) {
    console.error("No tenant ID");
    return;
  }

  // Clear all local state
  useEditorStore.setState({
    tempData: {},
    hasChangesMade: false,
    heroStates: {},
    headerStates: {},
    // ... clear all component states
  });

  // Re-fetch from database
  await useTenantStore.getState().fetchTenantData(tenantId);

  // Reload into stores
  const tenantData = useTenantStore.getState().tenantData;
  useEditorStore.getState().loadFromDatabase(tenantData);

  console.log("✅ Restored from database");
};
```

---

## Summary

This troubleshooting guide covers:

1. **Common issues**: Most frequent problems and solutions
2. **Data issues**: Store synchronization, data loss
3. **Rendering issues**: iframe, styles, re-rendering
4. **Store issues**: Desynchronization, global components
5. **Drag & drop issues**: Position calculation, validation
6. **Performance issues**: Slow rendering, memory leaks
7. **Quick fixes**: Reset, re-sync, reload
8. **Debug commands**: Browser console helpers
9. **Prevention tips**: Avoid issues before they happen
10. **Recovery procedures**: Fix corrupted state

**When Encountering Issues**:

1. Identify symptoms
2. Use diagnosis steps
3. Apply appropriate solution
4. Verify fix worked
5. Add logging to prevent recurrence

**For AI**:

- Reference this guide when debugging
- Follow diagnostic procedures systematically
- Apply proven solutions
- Add new issues/solutions as discovered
