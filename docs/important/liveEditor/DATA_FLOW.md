# Live Editor Data Flow - Complete Analysis

## Table of Contents

1. [Overview](#overview)
2. [Component Lifecycle Data Flow](#component-lifecycle-data-flow)
3. [Editing Session Data Flow](#editing-session-data-flow)
4. [Save Operation Data Flow](#save-operation-data-flow)
5. [Drag & Drop Data Flow](#drag--drop-data-flow)
6. [Database Synchronization](#database-synchronization)
7. [Critical Data Paths](#critical-data-paths)

---

## Overview

The Live Editor orchestrates complex data flows across multiple stores, components, and persistence layers. Understanding these flows is essential for debugging, extending, and maintaining the system.

### Data Flow Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  - LiveEditorUI (iframe, sidebars)                          │
│  - Component rendering                                       │
│  - User interactions                                         │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                    STATE LAYER                               │
│  - React useState (local state)                             │
│  - Zustand stores (editorStore, tenantStore)                │
│  - Component type states (heroStates, etc.)                 │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                    LOGIC LAYER                               │
│  - Component functions (heroFunctions, etc.)                │
│  - Event handlers (LiveEditorHandlers)                      │
│  - Side effects (LiveEditorEffects)                         │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                    PERSISTENCE LAYER                         │
│  - API calls (axiosInstance)                                │
│  - Database (MongoDB via API)                               │
│  - tenantStore (API integration)                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Lifecycle Data Flow

### Phase 1: Initial Page Load

```
USER NAVIGATES TO /live-editor/homepage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: Authentication Check
────────────────────────────────────────────────
LiveEditorEffects.tsx:
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");  // Redirect if not logged in
    }
  }, [user, authLoading]);


STEP 2: Extract Tenant ID
────────────────────────────────────────────────
LiveEditorHooks.tsx:
  const tenantId = useTenantStore(s => s.tenantId);
  const slug = useParams().slug || "homepage";


STEP 3: Fetch Tenant Data
────────────────────────────────────────────────
LiveEditorEffects.tsx:
  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);  ← API call
    }
  }, [tenantId, fetchTenantData]);

tenantStore.fetchTenantData():
  ├─ Check cache: Already loaded for this tenantId?
  │  └─ Yes → Skip request
  │  └─ No → Continue
  ├─ POST /v1/tenant-website/getTenant
  ├─ Response: { componentSettings, globalComponentsData, ... }
  └─ set({ tenantData: response.data })


STEP 4: Load Data into editorStore
────────────────────────────────────────────────
LiveEditorEffects.tsx:
  useEffect(() => {
    if (!initialized && !authLoading && !tenantLoading && tenantData) {
      editorStore.loadFromDatabase(tenantData);

      // Load page components
      if (tenantData.componentSettings?.[slug]) {
        const dbComponents = Object.entries(
          tenantData.componentSettings[slug]
        ).map(([id, comp]) => ({
          id,
          type: comp.type,
          componentName: comp.componentName,
          data: comp.data,
          position: comp.position || 0
        }));

        setPageComponents(dbComponents);
      } else {
        // No saved data - use defaults
        setPageComponents(createInitialComponents(slug));
      }

      setInitialized(true);
    }
  }, [initialized, authLoading, tenantLoading, tenantData, slug]);

editorStore.loadFromDatabase():
  ├─ Load global components:
  │  ├─ globalHeaderData = tenantData.globalHeaderData || defaults
  │  ├─ globalFooterData = tenantData.globalFooterData || defaults
  │  └─ globalComponentsData = tenantData.globalComponentsData || defaults
  │
  ├─ Load page components:
  │  └─ For each page in componentSettings:
  │      ├─ pageComponentsByPage[page] = components array
  │      └─ For each component:
  │          └─ Load into component type state:
  │              heroStates[comp.id] = comp.data
  │              headerStates[comp.id] = comp.data
  │              ... etc.
  │
  └─ Initialize missing defaults (e.g., inputs2)


STEP 5: Component Rendering
────────────────────────────────────────────────
LiveEditorUI.tsx:
  {pageComponents.map(component => {
    // Get data from store
    const storeData = useEditorStore.getState()
      .getComponentData(component.type, component.id);

    const mergedData = storeData || component.data;

    return (
      <CachedComponent
        key={component.id}
        componentName={component.componentName}
        data={{
          ...mergedData,
          useStore: true,
          variant: component.id
        }}
      />
    );
  })}


STEP 6: Component Initialization (in each component)
────────────────────────────────────────────────
hero1.tsx (example):
  useEffect(() => {
    if (props.useStore) {
      const initialData = {
        ...getDefaultHeroData(),
        ...props
      };

      ensureComponentVariant("hero", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore]);


STEP 7: Data Merge in Component
────────────────────────────────────────────────
hero1.tsx:
  const storeData = props.useStore
    ? getComponentData("hero", uniqueId) || {}
    : {};

  const currentStoreData = props.useStore
    ? heroStates[uniqueId] || {}
    : {};

  const defaultData = getDefaultHeroData();

  const mergedData = {
    ...defaultData,
    ...props,
    ...tenantComponentData,
    ...storeData,
    ...currentStoreData  // Highest priority
  };


STEP 8: Component Renders
────────────────────────────────────────────────
  return (
    <section style={{ backgroundColor: mergedData.colors?.background }}>
      <h1>{mergedData.content?.title}</h1>
      <p>{mergedData.content?.subtitle}</p>
      {/* ... rest of component */}
    </section>
  );


RESULT: Page fully loaded and rendered ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Editing Session Data Flow

### Complete Edit Cycle

```
USER CLICKS COMPONENT TO EDIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: Click Event
────────────────────────────────────────────────
User clicks hero component in iframe
  ↓
LiveEditorDraggableComponent onClick
  ↓
onEditClick(component.id)  // Passed from LiveEditorUI


STEP 2: State Updates
────────────────────────────────────────────────
LiveEditorHandlers.handleEditClick(componentId):
  setSelectedComponentId(componentId);
  setSidebarView("edit-component");
  setSidebarOpen(true);

State changes:
  selectedComponentId: null → "uuid-1234"
  sidebarView: "main" → "edit-component"
  sidebarOpen: false → true


STEP 3: Sidebar Opens with Animation
────────────────────────────────────────────────
LiveEditorUI.tsx:
  <AnimatePresence>
    {sidebarOpen && (
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
      >
        <EditorSidebar
          isOpen={sidebarOpen}
          selectedComponent={selectedComponent}
          ...
        />
      </motion.div>
    )}
  </AnimatePresence>


STEP 4: EditorSidebar Initialization
────────────────────────────────────────────────
EditorSidebar/index.tsx useEffect triggers:

  selectedComponent = {
    id: "uuid-1234",
    type: "hero",
    componentName: "hero1",
    data: {...}
  }

  view = "edit-component"

  // Check component type
  if (selectedComponent.id === "global-header") {
    // Global header flow...
  } else if (selectedComponent.id === "global-footer") {
    // Global footer flow...
  } else {
    // REGULAR COMPONENT FLOW

    const store = useEditorStore.getState();

    // Get default data
    const defaultData = createDefaultData(
      "hero",      // type
      "hero1"      // componentName
    );

    // Use component.id as unique identifier
    const uniqueVariantId = "uuid-1234";

    // Determine data to use
    const dataToUse =
      selectedComponent.data && Object.keys(selectedComponent.data).length > 0
        ? selectedComponent.data
        : defaultData;

    // Ensure component exists in store
    store.ensureComponentVariant("hero", uniqueVariantId, dataToUse);

    // Get current data from store
    const currentComponentData = store.getComponentData("hero", uniqueVariantId);

    // Initialize tempData for editing
    setTempData(currentComponentData || {});
  }


STEP 5: Structure Loading
────────────────────────────────────────────────
AdvancedSimpleSwitcher receives:
  type = "hero"
  componentName = "hero1"
  componentId = "uuid-1234"

useEffect(() => {
  loadStructure("hero");
}, ["hero"]);

loadStructure("hero"):
  ├─ import(`@/componentsStructure/hero`)
  ├─ Extract: heroStructure
  ├─ Translate: translateComponentStructure(heroStructure, t)
  ├─ Find variant: variants.find(v => v.id === "hero1")
  └─ setStructure({ ...translated, currentVariant: hero1Variant })


STEP 6: Field Rendering
────────────────────────────────────────────────
DynamicFieldsRenderer:
  fields = hero1Variant.fields  // or simpleFields if mode=simple

  For each field:
    renderField(field, basePath)
      ↓
    Determine path: "content.title"
      ↓
    Get value: getValueByPath("content.title")
      ├─ Source: tempData (initialized from store)
      ├─ Navigate: tempData.content.title
      └─ Return: "Discover Your Perfect Property"
      ↓
    Render field:
      <input
        value="Discover Your Perfect Property"
        onChange={(e) => updateValue("content.title", e.target.value)}
      />


STEP 7: User Edits Field
────────────────────────────────────────────────
User types: "Find Your Dream Home"
  ↓
onChange event fires
  ↓
updateValue("content.title", "Find Your Dream Home")
  ↓
DynamicFieldsRenderer.updateValue():
  // Check special cases (imagePosition, etc.)
  // None match, continue...

  if (onUpdateByPath) {
    // Regular component, not global
    updateByPath("content.title", "Find Your Dream Home");
  }
  ↓
editorStore.updateByPath("content.title", "Find Your Dream Home"):
  set((state) => {
    const segments = ["content", "title"];
    let newData = { ...state.tempData };

    // Navigate
    newData.content.title = "Find Your Dream Home";

    return { tempData: newData };
  })
  ↓
tempData updated:
  {
    ...existingTempData,
    content: {
      ...existingContent,
      title: "Find Your Dream Home"  ← Updated!
    }
  }


STEP 8: Real-Time Preview (NOT YET)
────────────────────────────────────────────────
❌ Component in iframe does NOT immediately show change

Why? Component reads from heroStates[id], not from tempData:

hero1.tsx:
  const storeData = getComponentData("hero", uniqueId);
  const mergedData = { ...defaultData, ...storeData };

  // storeData DOES NOT include tempData!
  // tempData only merged on SAVE

Result: User sees old title in iframe ❌


ISSUE RESOLUTION:
────────────────────────────────────────────────
To enable real-time preview, component must re-read on tempData change.

Current behavior: Preview updates on SAVE, not during editing.

This is INTENTIONAL to allow:
  - Cancel without affecting preview
  - Multiple simultaneous edits
  - Atomic saves


STEP 9: User Clicks "Save Changes"
────────────────────────────────────────────────
(See "Save Operation Data Flow" section below)


RESULT: Editing session complete ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Save Operation Data Flow

### Complete Save Flow

```
USER CLICKS "SAVE CHANGES" IN EDITORSIDEBAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: handleSave() Triggered
────────────────────────────────────────────────
EditorSidebar/index.tsx:
  const handleSave = () => {
    if (!selectedComponent) return;

    console.log("🚀 Save initiated");


STEP 2: Mark Changes Made
────────────────────────────────────────────────
    setHasChangesMade(true);

    // This triggers:
    // 1. Unsaved changes warning dialog
    // 2. UI indicator that changes need publishing

    console.log("✅ hasChangesMade set to true");


STEP 3: Get Store State
────────────────────────────────────────────────
    const store = useEditorStore.getState();
    const currentPage = store.currentPage || "homepage";

    console.log("📍 Current page:", currentPage);


STEP 4: Determine Latest tempData
────────────────────────────────────────────────
    const latestTempData =
      selectedComponent.id === "global-header" ||
      selectedComponent.id === "global-footer"
        ? store.tempData || tempData  // Global: Check store first
        : tempData;                     // Regular: Use local tempData

    console.log("📦 Latest tempData:", latestTempData);


STEP 5A: Save Global Header (if applicable)
────────────────────────────────────────────────
    if (selectedComponent.id === "global-header") {
      logChange(
        selectedComponent.id,
        "header1",
        "header",
        latestTempData,
        "GLOBAL_HEADER"
      );

      // Update individual global header
      setGlobalHeaderData(latestTempData);

      // Update unified global components
      setGlobalComponentsData({
        ...globalComponentsData,
        header: latestTempData
      });

      // Notify parent (trigger re-render)
      onComponentUpdate(selectedComponent.id, latestTempData);

      console.log("✅ Global header saved");

      onClose();
      return;
    }


STEP 5B: Save Global Footer (if applicable)
────────────────────────────────────────────────
    if (selectedComponent.id === "global-footer") {
      logChange(
        selectedComponent.id,
        "footer1",
        "footer",
        latestTempData,
        "GLOBAL_FOOTER"
      );

      setGlobalFooterData(latestTempData);
      setGlobalComponentsData({
        ...globalComponentsData,
        footer: latestTempData
      });
      onComponentUpdate(selectedComponent.id, latestTempData);

      console.log("✅ Global footer saved");

      onClose();
      return;
    }


STEP 5C: Save Regular Component
────────────────────────────────────────────────
    // Use component.id as unique identifier
    const uniqueVariantId = selectedComponent.id;  // "uuid-1234"

    console.log("🔑 Unique variant ID:", uniqueVariantId);


STEP 6: Gather Data Sources
────────────────────────────────────────────────
    // Get store data (from heroStates)
    const storeData = store.getComponentData(
      selectedComponent.type,    // "hero"
      uniqueVariantId            // "uuid-1234"
    );

    // Get current page components
    const currentPageComponents =
      store.pageComponentsByPage[currentPage] || [];

    // Find existing component in page
    const existingComponent = currentPageComponents.find(
      comp => comp.id === selectedComponent.id
    );

    console.log("📊 Data sources:", {
      existingData: existingComponent?.data,
      storeData,
      latestTempData
    });


STEP 7: CRITICAL - Deep Merge Data
────────────────────────────────────────────────
    const mergedData = existingComponent?.data
      ? deepMerge(
          deepMerge(existingComponent.data, storeData),
          latestTempData
        )
      : deepMerge(storeData, latestTempData);

    console.log("🔧 Merged data:", mergedData);

    // Example merge:
    // existingData = { visible: true, content: { title: "Old", subtitle: "Sub" } }
    // storeData = { content: { title: "Old", font: "Tajawal" } }
    // tempData = { content: { title: "New" } }
    //
    // Merge result:
    // {
    //   visible: true,                    ← From existingData
    //   content: {
    //     title: "New",                   ← From tempData (highest priority)
    //     subtitle: "Sub",                ← From existingData (preserved)
    //     font: "Tajawal"                 ← From storeData (preserved)
    //   }
    // }


STEP 8: Update Component State
────────────────────────────────────────────────
    store.setComponentData(
      selectedComponent.type,    // "hero"
      uniqueVariantId,           // "uuid-1234"
      mergedData
    );

    // This executes heroFunctions.setData():
    // return {
    //   heroStates: {
    //     ...state.heroStates,
    //     "uuid-1234": mergedData
    //   },
    //   pageComponentsByPage: {
    //     ...state.pageComponentsByPage,
    //     [currentPage]: updatedComponents  ← Also updated!
    //   }
    // };

    console.log("✅ Component state updated");


STEP 9: Update Page Components Array
────────────────────────────────────────────────
    const updatedPageComponents = currentPageComponents.map(comp => {
      if (comp.id === selectedComponent.id) {
        return { ...comp, data: mergedData };
      }
      return comp;
    });

    store.forceUpdatePageComponents(currentPage, updatedPageComponents);

    console.log("✅ pageComponentsByPage updated");


STEP 10: Notify Parent Component
────────────────────────────────────────────────
    onComponentUpdate(selectedComponent.id, mergedData);

    // This triggers in LiveEditorUI:
    const handleComponentUpdate = (id, newData) => {
      setPageComponents(current =>
        current.map(c => c.id === id ? { ...c, data: newData } : c)
      );
    };

    console.log("✅ Parent notified, local state updated");


STEP 11: Sync tempData
────────────────────────────────────────────────
    setTempData(mergedData);

    // Keep tempData in sync with saved data
    // Allows continued editing without reloading

    console.log("✅ tempData synced");


STEP 12: Close Sidebar
────────────────────────────────────────────────
    onClose();

    // Sidebar slides out with animation
    // User sees updated component in iframe

    console.log("✅ Save complete, sidebar closed");
  };


RESULT: Changes saved and visible ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Data Merge Visualization

```
BEFORE SAVE:
────────────────────────────────────────────────
existingComponent.data (from pageComponentsByPage):
{
  visible: true,
  content: {
    title: "Old Title",
    subtitle: "Old Subtitle"
  },
  layout: {
    padding: "16px"
  }
}

storeData (from heroStates[id]):
{
  visible: true,
  content: {
    title: "Old Title",
    subtitle: "Old Subtitle",
    font: {
      title: { family: "Tajawal" }
    }
  },
  layout: {
    padding: "16px"
  },
  animations: {
    enabled: true
  }
}

latestTempData (from editing session):
{
  content: {
    title: "New Title"  ← User edited this
  }
}

MERGE PROCESS:
────────────────────────────────────────────────
Step 1: deepMerge(existingComponent.data, storeData)
Result:
{
  visible: true,
  content: {
    title: "Old Title",
    subtitle: "Old Subtitle",
    font: { title: { family: "Tajawal" } }  ← Added from store
  },
  layout: {
    padding: "16px"
  },
  animations: { enabled: true }  ← Added from store
}

Step 2: deepMerge(result, latestTempData)
Result:
{
  visible: true,
  content: {
    title: "New Title",              ← Updated from tempData ✓
    subtitle: "Old Subtitle",        ← Preserved ✓
    font: { title: { family: "Tajawal" } }  ← Preserved ✓
  },
  layout: {
    padding: "16px"                  ← Preserved ✓
  },
  animations: { enabled: true }      ← Preserved ✓
}

AFTER SAVE:
────────────────────────────────────────────────
All stores now contain merged data:
  - heroStates["uuid-1234"] = mergedData
  - pageComponentsByPage["homepage"][0].data = mergedData
  - pageComponents[0].data = mergedData (local state)

Component renders with new title ✓
All other fields preserved ✓
```

---

## Drag & Drop Data Flow

### Reordering Components

```
USER DRAGS COMPONENT TO NEW POSITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: Drag Start
────────────────────────────────────────────────
User grabs component in iframe
  ↓
EnhancedLiveEditorDragDropContext.onDragStart()
  ↓
setActiveId(component.id)


STEP 2: Drag Move
────────────────────────────────────────────────
User moves component over drop zone
  ↓
Visual drop indicator shown
  ↓
Position calculated based on mouse Y coordinate


STEP 3: Drag End
────────────────────────────────────────────────
User releases component
  ↓
EnhancedLiveEditorDragDropContext.onDragEnd(event)
  ↓
Extract data:
  sourceId = dragged component ID
  targetId = drop target ID
  dragY = mouse Y position

  ↓
Calculate positions:
  const allElements = iframe.querySelectorAll("[data-component-id]")
    .sort((a, b) => a.top - b.top);

  // Find where to insert based on dragY
  for (const el of allElements) {
    if (dragY < el.top) {
      targetIndex = el.index;
      break;
    }
    targetIndex = el.index + 1;
  }

  ↓
Find source index:
  sourceIndex = components.findIndex(c => c.id === sourceId);


STEP 4: Execute Move
────────────────────────────────────────────────
  handleEnhancedMove(sourceIndex, "main", targetIndex, "main")
    ↓
  positionTracker.trackComponentMove(
    components,
    sourceIndex,
    "main",
    targetIndex,
    "main"
  )
    ↓
  Returns:
    {
      success: true,
      updatedComponents: [...],  // Components in new order
      debugInfo: {...}           // Debug information
    }


STEP 5: Update State
────────────────────────────────────────────────
  onComponentMove(
    sourceIndex,
    "main",
    targetIndex,
    "main",
    result.updatedComponents,
    result.debugInfo
  )
    ↓
  handleMoveComponent():
    setPageComponents(result.updatedComponents);

    // Update store (deferred)
    setTimeout(() => {
      store.forceUpdatePageComponents(slug, result.updatedComponents);
    }, 0);


STEP 6: Components Re-Render
────────────────────────────────────────────────
  pageComponents updated with new order
    ↓
  iframe re-renders components in new positions
    ↓
  User sees visual change ✓


RESULT: Component moved successfully ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Adding New Component via Drag

```
USER DRAGS COMPONENT FROM SIDEBAR TO PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: Drag From ComponentsSidebar
────────────────────────────────────────────────
<DraggableDrawerItem
  componentType="hero"
  data={{ label: "Hero", ... }}
>
  {/* Component preview */}
</DraggableDrawerItem>


STEP 2: Drop on Page
────────────────────────────────────────────────
onComponentAdd({
  type: "hero",
  index: 2,     // Insert at position 2
  zone: "main"
})


STEP 3: Create Component Instance
────────────────────────────────────────────────
handleAddComponent({ type, index, zone }):
  const componentName = `${type}1`;  // hero → hero1
  const componentId = uuidv4();      // Generate UUID

  const newComponent = {
    id: componentId,
    type: "hero",
    name: "Hero",
    componentName: "hero1",
    data: createDefaultData("hero", "hero1"),
    layout: {
      row: index,
      col: 0,
      span: 2
    }
  };


STEP 4: Insert at Index
────────────────────────────────────────────────
  const updatedComponents = [...pageComponents];
  updatedComponents.splice(index, 0, newComponent);

  setPageComponents(updatedComponents);


STEP 5: Initialize in Store
────────────────────────────────────────────────
  setTimeout(() => {
    const store = useEditorStore.getState();

    // Ensure component in store
    store.ensureComponentVariant("hero", componentId, newComponent.data);

    // Update page components
    const updated = [...store.pageComponentsByPage[currentPage], newComponent];
    store.forceUpdatePageComponents(currentPage, updated);
  }, 0);


STEP 6: Component Renders
────────────────────────────────────────────────
  New component appears in iframe at specified position
  With default data
  Ready to be edited ✓


RESULT: Component added successfully ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Database Synchronization

### Publish to Database Flow

```
USER CLICKS "PUBLISH" IN APP HEADER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: Trigger Save Dialog
────────────────────────────────────────────────
App header button onClick:
  editorStore.openSaveDialogFn();

  // This calls the registered save function:
  const saveFn = () => {
    store.forceUpdatePageComponents(slug, pageComponents);
  };


STEP 2: SaveConfirmationDialog Opens
────────────────────────────────────────────────
<SaveConfirmationDialog
  open={showDialog}
  onConfirm={confirmSave}
  onClose={closeDialog}
/>


STEP 3: User Confirms
────────────────────────────────────────────────
User clicks "Confirm Save"
  ↓
confirmSave() executes


STEP 4: Build Payload
────────────────────────────────────────────────
const state = useEditorStore.getState();

const payload = {
  tenantId: tenantId || "",

  // All page components
  pages: state.pageComponentsByPage,
  // {
  //   "homepage": [...],
  //   "about-us": [...],
  //   "contact": [...]
  // }

  // Global components
  globalComponentsData: state.globalComponentsData
  // {
  //   header: {...},
  //   footer: {...}
  // }
};

console.log("📤 Payload:", payload);


STEP 5: Send to API
────────────────────────────────────────────────
await axiosInstance.post(
  "/v1/tenant-website/save-pages",
  payload
)
  .then(response => {
    console.log("✅ Save successful:", response);

    closeDialog();
    toast.success("Changes saved successfully!");

    // Reset change tracking
    state.setHasChangesMade(false);
  })
  .catch(error => {
    console.error("❌ Save failed:", error);
    toast.error("Failed to save changes");
  });


STEP 6: Database Updated
────────────────────────────────────────────────
Backend receives payload:
  ├─ Extract tenantId
  ├─ Extract pages
  ├─ Extract globalComponentsData
  ├─ Validate data
  ├─ Update MongoDB:
  │  ├─ tenants.componentSettings = pages
  │  ├─ tenants.globalComponentsData = globalComponentsData
  │  └─ tenants.updatedAt = new Date()
  └─ Return success response


STEP 7: UI Feedback
────────────────────────────────────────────────
  Toast notification: "Changes saved successfully!"
  Dialog closes
  hasChangesMade = false
  No more unsaved changes warning ✓


RESULT: All changes persisted to database ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Critical Data Paths

### Path 1: Component to iframe

```
Component Data in Store
  ↓
heroStates["uuid-1234"] = {
  content: { title: "Welcome" }
}
  ↓
LiveEditorUI reads store:
  const storeData = useEditorStore.getState()
    .getComponentData("hero", "uuid-1234");
  ↓
Pass to CachedComponent:
  <CachedComponent
    data={{
      ...storeData,
      useStore: true,
      variant: "uuid-1234"
    }}
  />
  ↓
hero1.tsx reads data:
  const storeData = getComponentData("hero", uniqueId);
  const mergedData = { ...defaultData, ...storeData };
  ↓
Render in JSX:
  <h1>{mergedData.content.title}</h1>
  ↓
Appears in iframe: "Welcome"
```

### Path 2: User Edit to Preview

```
User types in EditorSidebar
  ↓
updateValue("content.title", "New Title")
  ↓
updateByPath("content.title", "New Title")
  ↓
editorStore.tempData updated:
  tempData.content.title = "New Title"
  ↓
Component in iframe:
  ❌ Does NOT read tempData
  ✓ Reads heroStates[id] (unchanged)
  ↓
Preview NOT updated until SAVE
  ↓
On SAVE:
  mergedData = deepMerge(existing, store, tempData)
  heroStates[id] = mergedData
  ↓
NOW component reads new data
  ↓
Preview updates ✓
```

**Design Choice**: Delayed preview allows cancel without side effects

### Path 3: Database to Component

```
Database (MongoDB)
  ↓
tenants.componentSettings.homepage = [
  {
    id: "uuid-1234",
    type: "hero",
    componentName: "hero1",
    data: { content: { title: "Saved Title" } }
  }
]
  ↓
API GET /v1/tenant-website/getTenant
  ↓
tenantStore.fetchTenantData():
  set({ tenantData: response.data })
  ↓
editorStore.loadFromDatabase(tenantData)
  ↓
heroStates["uuid-1234"] = component.data
pageComponentsByPage["homepage"] = [component, ...]
  ↓
setPageComponents(dbComponents)
  ↓
Components render in iframe with database data ✓
```

### Path 4: Component to Database

```
User makes changes
  ↓
Changes saved to:
  - heroStates[id]
  - pageComponentsByPage[page]
  ↓
hasChangesMade = true
  ↓
User clicks "Publish"
  ↓
Build payload:
  {
    pages: pageComponentsByPage,
    globalComponentsData
  }
  ↓
POST /v1/tenant-website/save-pages
  ↓
Backend updates MongoDB:
  tenants.componentSettings = pages
  tenants.globalComponentsData = globalComponentsData
  ↓
Changes persisted ✓
  ↓
Next load: Data from database ✓
```

---

## Store Synchronization Flows

### Flow 1: Component Edit → All Stores

```
updateComponentByPath("hero", "uuid-1234", "content.title", "New")
  ↓
heroFunctions.updateByPath():
  ├─ Update heroStates["uuid-1234"].content.title = "New"
  └─ Update pageComponentsByPage[currentPage][index].data.content.title = "New"
  ↓
Both stores synchronized ✓
```

### Flow 2: Theme Change → All Stores

```
handleComponentThemeChange(id, "hero2")
  ↓
Local state update:
  setPageComponents(current =>
    current.map(c => c.id === id ? { ...c, componentName: "hero2", data: newData } : c)
  )
  ↓
Store update (deferred):
  setTimeout(() => {
    store.setComponentData("hero", id, newData);
    store.forceUpdatePageComponents(currentPage, updatedComponents);
  }, 0);
  ↓
All synchronized:
  - pageComponents[index] (local state)
  - heroStates[id] (component state)
  - pageComponentsByPage[page][index] (page aggregation)
```

### Flow 3: Global Component Edit → Save

```
Edit global header menu
  ↓
updateByPath("menu[0].text", "New Text")
  ↓
editorStore.updateByPath():
  // Check currentPage === "global-header"
  newData = deepMerge(globalHeaderData, tempData)
  newData.menu[0].text = "New Text"
  return { tempData: newData }
  ↓
tempData updated (NOT globalHeaderData yet)
  ↓
User clicks "Save Changes"
  ↓
setGlobalHeaderData(tempData)
setGlobalComponentsData({ header: tempData })
  ↓
Now globalHeaderData has new menu ✓
  ↓
Header component re-renders with new menu ✓
```

---

## Important Notes for AI

### Data Flow Principles

1. **tempData is temporary**: Only persisted on save
2. **Component states are authoritative**: Components read from heroStates, not tempData
3. **pageComponentsByPage is source of truth**: For database persistence
4. **Global components separate**: Not in pageComponentsByPage
5. **Deep merge prevents data loss**: Always use for save operations

### Update Timing

1. **Immediate updates**: Local React state (pageComponents)
2. **Deferred updates**: Store updates via setTimeout(fn, 0)
3. **Batch updates**: Multiple changes in single save operation
4. **Async updates**: Database saves via API

### Synchronization Points

Every data mutation must update:

1. **Component type state** (heroStates[id])
2. **Page aggregation** (pageComponentsByPage[page])
3. **Local state** (pageComponents) - via onComponentUpdate callback

Missing any of these causes desync and data loss!

---

## Debug Checklist

### Data Not Showing in EditorSidebar

```typescript
// Check 1: Is tempData initialized?
console.log("tempData:", useEditorStore.getState().tempData);

// Check 2: Is component in store?
console.log("Store data:", store.getComponentData(type, id));

// Check 3: Is getValueByPath returning correct value?
console.log("Value at path:", getValueByPath("content.title"));

// Check 4: Is data source correct?
console.log("Data source:", {
  currentData,
  tempData,
  componentData: getComponentData(type, id),
});
```

### Changes Not Saving

```typescript
// Check 1: Is handleSave being called?
console.log("🚀 handleSave called");

// Check 2: Is merge working?
console.log("Merge inputs:", { existing, store, temp });
console.log("Merge result:", mergedData);

// Check 3: Are stores being updated?
console.log("After setComponentData:", store.heroStates[id]);
console.log("After forceUpdate:", store.pageComponentsByPage[page]);

// Check 4: Is parent notified?
console.log("onComponentUpdate called with:", id, mergedData);
```

### Preview Not Updating

```typescript
// Check 1: Is component reading from store?
console.log("Component reads:", storeData);

// Check 2: Is store data updated?
console.log("Store has:", store.getComponentData(type, id));

// Check 3: Is component re-rendering?
console.log("Component key:", `${component.id}-${forceUpdate}`);
```

---

## Summary

Live Editor data flow involves multiple stores and complex synchronization:

**Key Flows**:

1. **Load**: Database → tenantStore → editorStore → Components
2. **Edit**: User Input → tempData → (on save) → Component States
3. **Save**: Component States → pageComponentsByPage → API → Database
4. **Preview**: Component States → Component Rendering → iframe

**Critical Rules**:

- Use component.id as identifier (UUID)
- Deep merge when saving
- Update all relevant stores
- Check for global components
- Use setTimeout for store updates from handlers

Understanding these flows is essential for working effectively with the Live Editor system.
