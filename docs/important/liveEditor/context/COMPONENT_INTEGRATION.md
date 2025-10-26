# Component Integration with Context - Complete Guide

## Critical Understanding for AI

This document explains how `components/tenant/*` integrate with `context-liveeditor/*`.

**Flow**: Component → editorStore → Component Functions → Store State → Re-render

---

## Table of Contents

1. [Integration Overview](#integration-overview)
2. [Component File Pattern](#component-file-pattern)
3. [Data Flow](#data-flow)
4. [Integration Examples](#integration-examples)
5. [Component-Context Mapping](#component-context-mapping)
6. [Special Cases](#special-cases)

---

## Integration Overview

### The Big Picture

```
┌────────────────────────────────────────────────────────────┐
│                    COMPONENT LIFECYCLE                      │
└────────────────────────────────────────────────────────────┘

1. COMPONENT MOUNT
   ↓
   components/tenant/hero/hero1.tsx
   ├─ Import: useEditorStore, useTenantStore
   ├─ Import: getDefaultHeroData
   └─ Render: Get uniqueId from props

2. INITIALIZATION (useEffect)
   ↓
   ensureComponentVariant("hero", uniqueId, propsData)
   ├─ Routes to: heroFunctions.ensureVariant
   ├─ Creates: heroStates[uniqueId] = data
   └─ Updates: pageComponentsByPage[currentPage]

3. DATA RETRIEVAL
   ↓
   const heroStates = useEditorStore(s => s.heroStates)
   const storeData = heroStates[uniqueId]
   
4. DATA MERGING
   ↓
   const mergedData = {
     ...getDefaultHeroData(),
     ...storeData,
     ...currentStoreData,
     ...props
   }

5. RENDERING
   ↓
   <section>{mergedData.content?.title}</section>

6. USER EDITS (via EditorSidebar)
   ↓
   updateComponentByPath("hero", uniqueId, "content.title", "New Title")
   ├─ Routes to: heroFunctions.updateByPath
   ├─ Updates: heroStates[uniqueId].content.title
   └─ Updates: pageComponentsByPage[currentPage]

7. RE-RENDER
   ↓
   Component re-renders with new data (step 3-5 repeat)

8. SAVE
   ↓
   EditorProvider collects pageComponentsByPage → API → Database
```

---

## Component File Pattern

### Standard Component Structure

```typescript
"use client";

// ═══════════════════════════════════════════════════════════
// 1. IMPORTS
// ═══════════════════════════════════════════════════════════
import { useEffect, useState } from "react";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { getDefaultHeroData } from "@/context-liveeditor/editorStoreFunctions/heroFunctions";

// ═══════════════════════════════════════════════════════════
// 2. PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface HeroProps {
  visible?: boolean;
  height?: { desktop?: string; tablet?: string; mobile?: string };
  // ... all component-specific props
  
  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
}

// ═══════════════════════════════════════════════════════════
// 3. COMPONENT FUNCTION
// ═══════════════════════════════════════════════════════════
export default function Hero1(props: HeroProps) {
  
  // ─────────────────────────────────────────────────────────
  // 3.1 EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "hero1";
  const uniqueId = props.id || variantId;
  
  // ─────────────────────────────────────────────────────────
  // 3.2 CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(s => s.ensureComponentVariant);
  const getComponentData = useEditorStore(s => s.getComponentData);
  const heroStates = useEditorStore(s => s.heroStates);
  const globalHeaderData = useEditorStore(s => s.globalHeaderData);
  
  const tenantData = useTenantStore(s => s.tenantData);
  
  // ─────────────────────────────────────────────────────────
  // 3.3 INITIALIZE IN STORE (on mount)
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (props.useStore) {
      // Prepare initial data from props
      const initialData = {
        ...getDefaultHeroData(),
        ...props
      };
      
      // Initialize in store
      ensureComponentVariant("hero", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore]);
  
  // ─────────────────────────────────────────────────────────
  // 3.4 RETRIEVE DATA FROM STORE
  // ─────────────────────────────────────────────────────────
  const storeData = heroStates[uniqueId];
  const currentStoreData = getComponentData("hero", uniqueId);
  
  // ─────────────────────────────────────────────────────────
  // 3.5 MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  const mergedData = {
    ...getDefaultHeroData(),    // 1. Defaults (lowest priority)
    ...storeData,                // 2. Store state
    ...currentStoreData,         // 3. Current store data
    ...props                     // 4. Props (highest priority)
  };
  
  // ─────────────────────────────────────────────────────────
  // 3.6 RENDER
  // ─────────────────────────────────────────────────────────
  return (
    <section className="hero">
      <h1>{mergedData.content?.title}</h1>
      <p>{mergedData.content?.subtitle}</p>
      {/* ... rest of component */}
    </section>
  );
}
```

---

## Data Flow

### Flow 1: Component Initialization

```
USER ADDS COMPONENT TO PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. LiveEditor generates UUID
   ├─ component.id = "abc-123-def-456"
   ├─ component.type = "hero"
   └─ component.componentName = "hero1"

2. Component mounts with props:
   <Hero1 
     id="abc-123-def-456"
     variant="hero1"
     useStore={true}
     {...defaultData}
   />

3. useEffect runs:
   ensureComponentVariant("hero", "abc-123-def-456", {
     ...getDefaultHeroData(),
     ...props
   })

4. Routes to heroFunctions.ensureVariant:
   ├─ Check: heroStates["abc-123-def-456"] exists?
   ├─ No → Initialize
   ├─ Yes → Skip (already exists)
   └─ Return: { heroStates: { "abc-123-def-456": data } }

5. editorStore.set() updates state:
   heroStates["abc-123-def-456"] = {
     visible: true,
     height: { desktop: "90vh", ... },
     background: { image: "...", ... },
     content: { title: "...", subtitle: "..." },
     // ... full component data
   }

6. Component retrieves data:
   const heroStates = useEditorStore(s => s.heroStates)
   const storeData = heroStates["abc-123-def-456"]

7. Component merges data:
   const mergedData = {
     ...getDefaultHeroData(),
     ...storeData,
     ...props
   }

8. Component renders:
   <section>
     <h1>{mergedData.content?.title}</h1>
   </section>

✅ COMPONENT INITIALIZED AND RENDERED
```

### Flow 2: User Edits Component

```
USER EDITS IN EDITORSIDEBAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. User opens EditorSidebar
   ├─ EditorSidebar receives: selectedComponent
   ├─ selectedComponent.id = "abc-123-def-456"
   ├─ selectedComponent.type = "hero"
   └─ selectedComponent.data = { current data }

2. EditorSidebar initializes tempData:
   setTempData(selectedComponent.data)

3. User changes field (e.g., title):
   ├─ Input onChange fires
   ├─ Calls: updateByPath("content.title", "New Title")
   └─ Updates: tempData.content.title = "New Title"

4. User clicks "Save Changes":
   ├─ Merge: finalData = deepMerge(globalData, tempData)
   ├─ Call: setComponentData("hero", "abc-123-def-456", finalData)
   └─ Routes to: heroFunctions.setData

5. heroFunctions.setData updates:
   ├─ heroStates["abc-123-def-456"] = finalData
   └─ pageComponentsByPage[currentPage] updated too

6. editorStore.set() triggers re-render:
   ├─ heroStates subscription fires
   └─ Component re-renders

7. Component retrieves new data:
   const storeData = heroStates["abc-123-def-456"]
   // Now has "New Title"

8. Component re-renders:
   <h1>New Title</h1>  // ✅ Updated!

✅ EDIT REFLECTED IN COMPONENT
```

### Flow 3: Save to Database

```
USER CLICKS "SAVE"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. User clicks Save button (in LiveEditor)
   ├─ Calls: requestSave()
   └─ Sets: showDialog = true

2. EditorProvider renders SaveConfirmationDialog
   ├─ User clicks "Confirm"
   └─ Calls: confirmSave()

3. confirmSave collects state:
   const state = useEditorStore.getState()
   const payload = {
     tenantId: "tenant123",
     pages: state.pageComponentsByPage,
     globalComponentsData: state.globalComponentsData,
     WebsiteLayout: state.WebsiteLayout
   }

4. Example payload.pages:
   {
     "homepage": [
       {
         id: "abc-123-def-456",
         type: "hero",
         componentName: "hero1",
         position: 0,
         data: {
           visible: true,
           content: { title: "New Title", ... },
           // ... full hero data
         }
       },
       // ... more components
     ],
     "about-us": [...]
   }

5. POST to API:
   axios.post("/v1/tenant-website/save-pages", payload)

6. Backend processes:
   ├─ Extract pages
   ├─ Extract globalComponentsData
   ├─ Extract WebsiteLayout
   ├─ Save to database:
   │   ├─ componentSettings = pages
   │   ├─ globalComponentsData = globalComponentsData
   │   └─ WebsiteLayout = WebsiteLayout
   └─ Return: { success: true }

7. Frontend success:
   ├─ closeDialog()
   ├─ toast.success("Changes saved successfully!")
   └─ setHasChangesMade(false)

✅ DATA PERSISTED TO DATABASE
```

### Flow 4: Load from Database

```
USER OPENS LIVE EDITOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. LiveEditor mounts
   ├─ Gets tenantId from URL or auth
   └─ Calls: fetchTenantData(tenantId)

2. fetchTenantData fetches from API:
   POST /v1/tenant-website/getTenant { websiteName: tenantId }

3. API returns:
   {
     username: "tenant123",
     componentSettings: {
       "homepage": {
         "abc-123-def-456": {
           type: "hero",
           componentName: "hero1",
           data: { ... },
           position: 0
         },
         // ... more components
       },
       "about-us": { ... }
     },
     globalComponentsData: {
       header: { ... },
       footer: { ... }
     },
     WebsiteLayout: {
       metaTags: { pages: [...] }
     }
   }

4. tenantStore sets: tenantData = response.data

5. editorStore.loadFromDatabase(tenantData):
   ├─ Load globalComponentsData
   ├─ Load WebsiteLayout
   ├─ Parse componentSettings:
   │   ├─ For each page:
   │   │   ├─ Extract components
   │   │   ├─ Add to pageComponentsByPage[page]
   │   │   └─ Initialize in component states:
   │   │       ├─ heroStates["abc-123-def-456"] = data
   │   │       ├─ headerStates[...] = data
   │   │       └─ ... all components
   └─ Store initialized ✓

6. Components mount:
   ├─ useStore={true}
   ├─ Call ensureComponentVariant
   ├─ Data already exists in store
   └─ Skip initialization

7. Components render with loaded data ✓

✅ DATA LOADED FROM DATABASE
```

---

## Integration Examples

### Example 1: Hero Component

**File**: `components/tenant/hero/hero1.tsx`

```typescript
"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { getDefaultHeroData } from "@/context-liveeditor/editorStoreFunctions/heroFunctions";

export default function Hero1(props) {
  // Unique ID
  const variantId = props.variant || "hero1";
  const uniqueId = props.id || variantId;
  
  // Store connections
  const ensureComponentVariant = useEditorStore(s => s.ensureComponentVariant);
  const heroStates = useEditorStore(s => s.heroStates);
  
  // Initialize
  useEffect(() => {
    if (props.useStore) {
      ensureComponentVariant("hero", uniqueId, {
        ...getDefaultHeroData(),
        ...props
      });
    }
  }, [uniqueId, props.useStore]);
  
  // Retrieve data
  const storeData = heroStates[uniqueId];
  
  // Merge
  const mergedData = {
    ...getDefaultHeroData(),
    ...storeData,
    ...props
  };
  
  // Render
  return (
    <section 
      style={{ 
        height: mergedData.height?.desktop,
        backgroundImage: `url(${mergedData.background?.image})`
      }}
    >
      <h1>{mergedData.content?.title}</h1>
      <p>{mergedData.content?.subtitle}</p>
      {mergedData.searchForm?.enabled && (
        <SearchForm config={mergedData.searchForm} />
      )}
    </section>
  );
}
```

**Context Integration**:

```
Hero1 Component
  ↓
useEditorStore.heroStates["abc-123"]
  ↓
heroFunctions.ensureVariant / getData / setData / updateByPath
  ↓
editorStore.heroStates = { "abc-123": { ... } }
  ↓
editorStore.pageComponentsByPage["homepage"] = [
  { id: "abc-123", type: "hero", data: { ... } }
]
  ↓
EditorProvider → API → Database
```

---

### Example 2: Header Component (Global)

**File**: `components/tenant/header/header1.tsx`

```typescript
"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import { getDefaultHeaderData } from "@/context-liveeditor/editorStoreFunctions/headerFunctions";

export default function Header1(props) {
  const uniqueId = props.id || "header1";
  
  // Store connections
  const ensureComponentVariant = useEditorStore(s => s.ensureComponentVariant);
  const headerStates = useEditorStore(s => s.headerStates);
  const globalHeaderData = useEditorStore(s => s.globalHeaderData);
  
  // Initialize
  useEffect(() => {
    if (props.useStore) {
      ensureComponentVariant("header", uniqueId, {
        ...getDefaultHeaderData(),
        ...props
      });
    }
  }, [uniqueId, props.useStore]);
  
  // Retrieve data
  const storeData = headerStates[uniqueId];
  
  // Merge (with global data priority)
  const mergedData = {
    ...getDefaultHeaderData(),
    ...storeData,
    ...globalHeaderData,  // ← GLOBAL DATA PRIORITY
    ...props
  };
  
  // Render
  return (
    <header style={{ background: mergedData.background?.colors?.from }}>
      <Logo data={mergedData.logo} />
      <Nav menu={mergedData.menu} />
    </header>
  );
}
```

**Context Integration (Global)**:

```
Header1 Component
  ↓
useEditorStore.globalHeaderData
  ↓
headerFunctions (updates globalHeaderData instead of headerStates)
  ↓
editorStore.globalHeaderData = { ... }
editorStore.globalComponentsData.header = { ... }
  ↓
EditorProvider → API → Database (globalComponentsData.header)
```

**Key Difference**: Global components (header/footer) use `globalHeaderData` and `globalFooterData` which are shared across ALL pages.

---

### Example 3: HalfTextHalfImage (Multiple Variants)

**File**: `components/tenant/halfTextHalfImage/halfTextHalfImage1.tsx`

```typescript
"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import { getDefaultHalfTextHalfImageData } from "@/context-liveeditor/editorStoreFunctions/halfTextHalfImageFunctions";

export default function HalfTextHalfImage1(props) {
  const uniqueId = props.id || "halfTextHalfImage1";
  
  // Store connections
  const ensureComponentVariant = useEditorStore(s => s.ensureComponentVariant);
  const halfTextHalfImageStates = useEditorStore(s => s.halfTextHalfImageStates);
  
  // Initialize
  useEffect(() => {
    if (props.useStore) {
      ensureComponentVariant("halfTextHalfImage", uniqueId, {
        ...getDefaultHalfTextHalfImageData(),
        ...props
      });
    }
  }, [uniqueId, props.useStore]);
  
  // Retrieve data
  const storeData = halfTextHalfImageStates[uniqueId];
  
  // Merge
  const mergedData = {
    ...getDefaultHalfTextHalfImageData(),
    ...storeData,
    ...props
  };
  
  // Render
  return (
    <section>
      <div className="text-side">
        <h2>{mergedData.content?.title}</h2>
        <p>{mergedData.content?.description}</p>
        <button>{mergedData.content?.button?.text}</button>
      </div>
      <div className="image-side">
        <img src={mergedData.image?.src} alt={mergedData.image?.alt} />
      </div>
    </section>
  );
}
```

**Multiple Variants**:

```
halfTextHalfImage1.tsx → getDefaultHalfTextHalfImageData()
halfTextHalfImage2.tsx → getDefaultHalfTextHalfImage2Data()
halfTextHalfImage3.tsx → getDefaultHalfTextHalfImage3Data()
```

**Context decides which default to use**:

```typescript
// In halfTextHalfImageFunctions.ensureVariant
const defaultData = variantId === "halfTextHalfImage2"
  ? getDefaultHalfTextHalfImage2Data()
  : variantId === "halfTextHalfImage3"
  ? getDefaultHalfTextHalfImage3Data()
  : getDefaultHalfTextHalfImageData();
```

---

## Component-Context Mapping

### Complete Mapping Table

| Component Directory | Component Type | Functions File | Store Property | Variants |
|---------------------|----------------|----------------|----------------|----------|
| components/tenant/hero | hero | heroFunctions.ts | heroStates | 2 |
| components/tenant/header | header | headerFunctions.ts | headerStates, globalHeaderData | 1 |
| components/tenant/footer | footer | footerFunctions.ts | footerStates, globalFooterData | 1 |
| components/tenant/halfTextHalfImage | halfTextHalfImage | halfTextHalfImageFunctions.ts | halfTextHalfImageStates | 3 |
| components/tenant/propertySlider | propertySlider | propertySliderFunctions.ts | propertySliderStates | 1 |
| components/tenant/ctaValuation | ctaValuation | ctaValuationFunctions.ts | ctaValuationStates | 1 |
| components/tenant/stepsSection | stepsSection | stepsSectionFunctions.ts | stepsSectionStates | 1 |
| components/tenant/testimonials | testimonials | testimonialsFunctions.ts | testimonialsStates | 1 |
| components/tenant/whyChooseUs | whyChooseUs | whyChooseUsFunctions.ts | whyChooseUsStates | 1 |
| components/tenant/contactMapSection | contactMapSection | contactMapSectionFunctions.ts | contactMapSectionStates | 1 |
| components/tenant/grid | grid | gridFunctions.ts | gridStates | 1 |
| components/tenant/filterButtons | filterButtons | filterButtonsFunctions.ts | filterButtonsStates | 1 |
| components/tenant/propertyFilter | propertyFilter | propertyFilterFunctions.ts | propertyFilterStates | 1 |
| components/tenant/mapSection | mapSection | mapSectionFunctions.ts | mapSectionStates | 1 |
| components/tenant/contactFormSection | contactFormSection | contactFormSectionFunctions.ts | contactFormSectionStates | 1 |
| components/tenant/contactCards | contactCards | contactCardsFunctions.ts | contactCardsStates | 1 |
| components/tenant/inputs | inputs | inputsFunctions.ts | inputsStates | 1 |
| components/tenant/inputs2 | inputs2 | inputs2Functions.ts | inputs2States | 1 |
| components/tenant/property/applicationForm | applicationForm | applicationFormFunctions.ts | applicationFormStates | 1 |

---

## Special Cases

### Case 1: Global Components (Header & Footer)

**Behavior**: Shared across ALL pages

**Store Properties**:
- `globalHeaderData` - Current global header
- `globalFooterData` - Current global footer
- `globalComponentsData.header` - Unified header
- `globalComponentsData.footer` - Unified footer

**Update Functions**:
```typescript
updateGlobalHeaderByPath(path, value)
updateGlobalFooterByPath(path, value)
updateGlobalComponentByPath("header", path, value)
```

**Merge Priority in Component**:
```typescript
const mergedData = {
  ...getDefaultHeaderData(),
  ...storeData,
  ...globalHeaderData,  // ← Global data overrides
  ...props
};
```

**Save Payload**:
```json
{
  "globalComponentsData": {
    "header": { ... },
    "footer": { ... }
  },
  "pages": { ... }
}
```

---

### Case 2: Multiple Variants (Hero, HalfTextHalfImage)

**Hero Variants**:
- `hero1` - Full hero with search form
- `hero2` - Simple hero for interior pages

**HalfTextHalfImage Variants**:
- `halfTextHalfImage1` - Basic text/image split
- `halfTextHalfImage2` - With stats counters
- `halfTextHalfImage3` - Simplified for about pages

**Variant Detection**:
```typescript
// In component
const variantId = props.variant || "hero1";

// In functions
const defaultData = variantId === "hero2"
  ? getDefaultHero2Data()
  : getDefaultHeroData();
```

**Store Structure**:
```typescript
heroStates: {
  "abc-hero1-instance": { ... hero1 data ... },
  "def-hero2-instance": { ... hero2 data ... }
}
```

---

### Case 3: Complex Forms (inputs2, contactCards)

**Extended Functions**:

```typescript
// contactCardsFunctions has 20+ helper functions
addContactCard(currentData, card)
removeContactCard(currentData, index)
updateContactCard(currentData, index, updates)
validate(data) // Returns { isValid, errors }
reorderCards(currentData, fromIndex, toIndex)
```

**Usage in EditorSidebar**:

```typescript
import { contactCardsFunctions } from "@/context-liveeditor/editorStoreFunctions";

// Add card
const newData = contactCardsFunctions.addContactCard(tempData, newCard);
setTempData(newData);

// Validate before save
const { isValid, errors } = contactCardsFunctions.validate(tempData);
if (!isValid) {
  toast.error(errors.join(", "));
  return;
}

// Save
setComponentData("contactCards", componentId, newData);
```

---

### Case 4: Logging and Debugging (halfTextHalfImage)

**Debug Logs**:

```typescript
// In halfTextHalfImageFunctions.ensureVariant
logEditorStore("ENSURE_VARIANT_CALLED", variantId, "unknown", {
  variantId,
  hasInitial: !!(initial && Object.keys(initial).length > 0),
  initialKeys: initial ? Object.keys(initial) : [],
  existingData: state.halfTextHalfImageStates[variantId]
    ? Object.keys(state.halfTextHalfImageStates[variantId])
    : [],
  allVariants: Object.keys(state.halfTextHalfImageStates)
});
```

**View Logs in Browser**:

```javascript
// In browser console
localStorage.getItem("editor-debug-logs")
// Or
window.debugLogger.getAllLogs()
window.debugLogger.getChangeLogsAsString()
```

---

## Data Priority and Merging

### Merge Order (Lowest to Highest Priority)

```typescript
const mergedData = {
  ...getDefaultData(),        // 1. Component defaults (lowest)
  ...storeData,               // 2. Store state
  ...currentStoreData,        // 3. Current store data
  ...globalData,              // 4. Global data (header/footer only)
  ...props                    // 5. Props (highest priority)
};
```

### Deep Merge for Global Components

```typescript
// In EditorSidebar when saving global components
const finalData = deepMerge(globalComponentsData.header, tempData);

// deepMerge function
const deepMerge = (target, source) => {
  if (!source || typeof source !== "object") return target || source;
  if (!target || typeof target !== "object") return source;
  
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
        result[key] = deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  
  return result;
};
```

**Why Deep Merge?**: Prevents overwriting nested objects completely

**Example**:

```typescript
// Without deep merge
target = { content: { title: "Old", subtitle: "Keep" } }
source = { content: { title: "New" } }
result = { content: { title: "New" } }  // ❌ Lost subtitle!

// With deep merge
target = { content: { title: "Old", subtitle: "Keep" } }
source = { content: { title: "New" } }
result = { content: { title: "New", subtitle: "Keep" } }  // ✅ Preserved!
```

---

## Summary for AI

### Integration Pattern

**Every component follows this pattern**:

1. Import stores and default data
2. Extract unique ID from props
3. Connect to editorStore
4. Initialize in store (useEffect)
5. Retrieve data from store
6. Merge data (defaults → store → props)
7. Render with merged data
8. Re-render on store updates

### Key Points

- **Component ID**: Unique identifier (UUID) for each instance
- **Store Connection**: Via useEditorStore hooks
- **Initialization**: ensureComponentVariant on mount
- **Data Retrieval**: Direct from store state (e.g., heroStates[id])
- **Data Merging**: Multiple sources with priority order
- **Updates**: Via updateComponentByPath → store → re-render
- **Saving**: pageComponentsByPage → API → Database
- **Loading**: Database → tenantStore → editorStore → components

### Special Behaviors

- **Global components**: Use globalHeaderData/globalFooterData
- **Multiple variants**: Different defaults based on variantId
- **Complex forms**: Extended helper functions
- **Debugging**: Extensive logging (halfTextHalfImage)

---

**For AI**: Understand this integration pattern and you'll understand how ALL components work in the Live Editor system.

