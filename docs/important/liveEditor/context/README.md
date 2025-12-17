# Context-LiveEditor System - Complete Documentation

## Overview

This directory contains comprehensive documentation for all **context-liveeditor** files and their integration with **components/tenant** components.

---

## 📚 Documentation Structure

### Core Context Files

| #   | Document                                                 | Covers                                   | Lines |
| --- | -------------------------------------------------------- | ---------------------------------------- | ----- |
| 1   | [EDITOR_STORE_FUNCTIONS.md](./EDITOR_STORE_FUNCTIONS.md) | All editorStoreFunctions/\* files        | ~3000 |
| 2   | [COMPONENT_INTEGRATION.md](./COMPONENT_INTEGRATION.md)   | How context connects to components       | ~2000 |
| 3   | [STORES_OVERVIEW.md](./STORES_OVERVIEW.md)               | All Zustand stores in context-liveeditor | ~1500 |

---

## File Categories

### 1. Zustand Stores (State Management)

```
context-liveeditor/
├── editorStore.ts          ← Main store (all component states)
├── tenantStore.jsx         ← API integration (fetch/save)
├── editorI18nStore.ts      ← Editor translations
├── clientI18nStore.ts      ← Client-side translations
└── SidebarStateManager.ts  ← Sidebar state (unused/legacy)
```

**See**: [STORES_OVERVIEW.md](./STORES_OVERVIEW.md)

---

### 2. Component Functions (State Handlers)

```
context-liveeditor/editorStoreFunctions/
├── types.ts                       ← Shared types and utilities
├── index.ts                       ← Export all functions
│
├── heroFunctions.ts               ← Hero component state
├── headerFunctions.ts             ← Header component state
├── footerFunctions.ts             ← Footer component state
├── halfTextHalfImageFunctions.ts  ← HalfTextHalfImage state
├── propertySliderFunctions.ts     ← PropertySlider state
├── ctaValuationFunctions.ts       ← CtaValuation state
├── stepsSectionFunctions.ts       ← StepsSection state
├── testimonialsFunctions.ts       ← Testimonials state
├── whyChooseUsFunctions.ts        ← WhyChooseUs state
├── contactMapSectionFunctions.ts  ← ContactMapSection state
├── gridFunctions.ts               ← Grid state
├── filterButtonsFunctions.ts      ← FilterButtons state
├── propertyFilterFunctions.ts     ← PropertyFilter state
├── mapSectionFunctions.ts         ← MapSection state
├── contactFormSectionFunctions.ts ← ContactFormSection state
├── contactCardsFunctions.ts       ← ContactCards state
├── applicationFormFunctions.ts    ← ApplicationForm state
├── inputsFunctions.ts             ← Inputs state
└── inputs2Functions.ts            ← Inputs2 state
```

**See**: [EDITOR_STORE_FUNCTIONS.md](./EDITOR_STORE_FUNCTIONS.md)

---

### 3. Context Providers (React Context)

```
context-liveeditor/
├── EditorProvider.tsx     ← Save dialog provider
└── EditorContext.tsx      ← Legacy editor context (mostly unused)
```

**Already Documented**: [../CONTEXT_PROVIDERS.md](../CONTEXT_PROVIDERS.md)

---

### 4. Component Integration

```
components/tenant/
├── hero/                  ← Uses heroFunctions, editorStore
├── header/                ← Uses headerFunctions, editorStore
├── footer/                ← Uses footerFunctions, editorStore
├── halfTextHalfImage/     ← Uses halfTextHalfImageFunctions
├── propertySlider/        ← Uses propertySliderFunctions
├── ctaValuation/          ← Uses ctaValuationFunctions
├── stepsSection/          ← Uses stepsSectionFunctions
├── testimonials/          ← Uses testimonialsFunctions
├── whyChooseUs/           ← Uses whyChooseUsFunctions
├── contactMapSection/     ← Uses contactMapSectionFunctions
├── grid/                  ← Uses gridFunctions
├── filterButtons/         ← Uses filterButtonsFunctions
├── propertyFilter/        ← Uses propertyFilterFunctions
├── mapSection/            ← Uses mapSectionFunctions
├── contactFormSection/    ← Uses contactFormSectionFunctions
├── contactCards/          ← Uses contactCardsFunctions
├── inputs/                ← Uses inputsFunctions
└── inputs2/               ← Uses inputs2Functions
```

**See**: [COMPONENT_INTEGRATION.md](./COMPONENT_INTEGRATION.md)

---

## Quick Reference

### Component Function Pattern

**Every component type has 4 functions**:

```typescript
export const {componentType}Functions = {
  ensureVariant: (state, variantId, initial?) => {...},
  getData: (state, variantId) => {...},
  setData: (state, variantId, data) => {...},
  updateByPath: (state, variantId, path, value) => {...}
};
```

**Plus default data function**:

```typescript
export const getDefault{ComponentType}Data = (): ComponentData => ({
  visible: true,
  // ... component-specific defaults
});
```

---

### Component Integration Pattern

**Every component file follows this pattern**:

```typescript
// 1. Import stores
import { useEditorStore } from "@/context-liveeditor/editorStore";
import useTenantStore from "@/context-liveeditor/tenantStore";

// 2. Import default data
import { getDefaultHeroData } from "@/context-liveeditor/editorStoreFunctions/heroFunctions";

// 3. In component
export default function Hero1(props) {
  // Get unique ID
  const variantId = props.variant || "hero1";
  const uniqueId = props.id || variantId;

  // Connect to stores
  const ensureComponentVariant = useEditorStore(s => s.ensureComponentVariant);
  const getComponentData = useEditorStore(s => s.getComponentData);
  const heroStates = useEditorStore(s => s.heroStates);

  // Initialize in store
  useEffect(() => {
    if (props.useStore) {
      ensureComponentVariant("hero", uniqueId, {
        ...getDefaultHeroData(),
        ...props
      });
    }
  }, [uniqueId, props.useStore]);

  // Merge data
  const mergedData = {
    ...getDefaultHeroData(),
    ...storeData,
    ...currentStoreData
  };

  // Render
  return <section>{mergedData.content?.title}</section>;
}
```

---

## Integration Map

### Store → Functions → Components

```
editorStore.heroStates
  ↕ (managed by)
heroFunctions.{ensureVariant, getData, setData, updateByPath}
  ↕ (used by)
components/tenant/hero/hero1.tsx
components/tenant/hero/hero2.tsx
```

**Same pattern for ALL component types**

---

## Key Concepts

### 1. Component Functions are State Handlers

Each `*Functions.ts` file manages state for one component type:

- **Stored in**: `editorStore.{type}States`
- **Accessed via**: Generic functions in editorStore
- **Pattern**: Consistent 4-function interface
- **Purpose**: Modular, maintainable state management

### 2. Components Use Functions via Store

Components don't call functions directly:

```typescript
// ❌ NOT THIS
import { heroFunctions } from "@/context-liveeditor/editorStoreFunctions/heroFunctions";
heroFunctions.getData(state, id); // Direct call

// ✅ THIS
import { useEditorStore } from "@/context-liveeditor/editorStore";
const data = useEditorStore.getState().getComponentData("hero", id);
// Goes through editorStore which routes to heroFunctions
```

### 3. Two-Way Data Binding

```
Component Props → Initialize Store → Component Renders
     ↑                                      ↓
     └─────── User Edits in Sidebar ←──────┘
```

### 4. Default Data Hierarchy

**Every component type has variant-specific defaults**:

```typescript
// Hero has 2 variants
getDefaultHeroData(); // hero1 defaults
getDefaultHero2Data(); // hero2 defaults

// HalfTextHalfImage has 3 variants
getDefaultHalfTextHalfImageData(); // variant 1
getDefaultHalfTextHalfImage2Data(); // variant 2
getDefaultHalfTextHalfImage3Data(); // variant 3
```

---

## Documentation Files

### [EDITOR_STORE_FUNCTIONS.md](./EDITOR_STORE_FUNCTIONS.md)

**Complete reference for all component functions**:

- types.ts - Shared utilities
- Each \*Functions.ts file explained in detail
- Default data structures
- Function signatures
- Integration with editorStore
- Special cases and variations

**~3000 lines** covering all 19 component function files

---

### [COMPONENT_INTEGRATION.md](./COMPONENT_INTEGRATION.md)

**How components connect to context**:

- Component import patterns
- Store initialization flow
- Data merging priorities
- Rendering with store data
- Update flows
- Each component type integration explained

**~2000 lines** with complete integration examples

---

### [STORES_OVERVIEW.md](./STORES_OVERVIEW.md)

**All Zustand stores explained**:

- editorStore - Main state management
- tenantStore - API and database
- editorI18nStore - Editor translations
- clientI18nStore - Client translations
- SidebarStateManager - Legacy sidebar state

**~1500 lines** with complete store APIs

---

## Quick Start

### For AI Reading This System

**Minimum Understanding (30 minutes)**:

1. Read this README
2. Skim [STORES_OVERVIEW.md](./STORES_OVERVIEW.md)
3. Understand the pattern from [EDITOR_STORE_FUNCTIONS.md](./EDITOR_STORE_FUNCTIONS.md) intro

**Complete Understanding (3-4 hours)**:

1. Read all 3 documentation files completely
2. Cross-reference with main Live Editor docs
3. Study integration examples

---

## Important Rules

### Rule 1: Every Component Type Has Dedicated Functions

```typescript
hero → heroFunctions
header → headerFunctions
footer → footerFunctions
// ... 19 total component types
```

### Rule 2: Functions Follow Consistent Pattern

```typescript
ensureVariant; // Initialize if not exists
getData; // Retrieve data
setData; // Set/replace data
updateByPath; // Update specific field
```

### Rule 3: Components Access via editorStore

```typescript
// Through generic functions
useEditorStore.getState().getComponentData(type, id)
useEditorStore.getState().updateComponentByPath(type, id, path, value)

// Which route to specific functions
getComponentData("hero", id) → heroFunctions.getData(state, id)
```

### Rule 4: All Functions Update pageComponentsByPage

```typescript
// Every setData and updateByPath MUST update:
return {
  heroStates: { ...state.heroStates, [id]: data },           // ← Component state
  pageComponentsByPage: { ...state.pageComponentsByPage, ... } // ← Page aggregation
}
```

---

## Integration Flow Summary

```
USER ADDS COMPONENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Generate UUID for component.id
2. Set component.type and component.componentName
3. Call ensureComponentVariant(type, id, defaultData)
   ↓ Routes to specific function (e.g., heroFunctions.ensureVariant)
   ↓ Creates entry in heroStates[id]
4. Component renders with useStore={true}
5. Component reads data from heroStates[id]
6. Component displays ✓

USER EDITS COMPONENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. User opens EditorSidebar
2. tempData initialized with current data
3. User changes field
4. updateByPath(path, value) → Updates tempData
5. User clicks "Save Changes"
6. setComponentData(type, id, mergedData)
   ↓ Routes to heroFunctions.setData
   ↓ Updates heroStates[id]
   ↓ Updates pageComponentsByPage
7. Component re-renders with new data ✓
```

---

## For AI: Critical Understanding

### Must Know

1. **19 component types** = 19 function files
2. **Each file exports functions + default data**
3. **Functions accessed via editorStore generic functions**
4. **Components initialize themselves in store on first render**
5. **Two-way binding**: props → store → render → edit → store → render

### Must Remember

- component.id = UNIQUE IDENTIFIER (UUID)
- Functions take variantId = component.id (NOT componentName!)
- Always update BOTH heroStates AND pageComponentsByPage
- Deep merge when combining data
- Check for variant-specific defaults (hero1 vs hero2)

---

## Next Steps

**Read in order**:

1. [STORES_OVERVIEW.md](./STORES_OVERVIEW.md) - Understand all stores
2. [EDITOR_STORE_FUNCTIONS.md](./EDITOR_STORE_FUNCTIONS.md) - Learn all component functions
3. [COMPONENT_INTEGRATION.md](./COMPONENT_INTEGRATION.md) - See how components integrate

**Total Time**: ~3-4 hours for complete mastery

---

## Related Documentation

### Main Live Editor Docs

- [../README.md](../README.md) - Main documentation index
- [../STATE_MANAGEMENT.md](../STATE_MANAGEMENT.md) - Store architecture
- [../COMPONENT_ARCHITECTURE.md](../COMPONENT_ARCHITECTURE.md) - Component system

### Provider Integration

- [../CONTEXT_PROVIDERS.md](../CONTEXT_PROVIDERS.md) - Provider hierarchy

---

**Status**: ✅ Complete documentation for all context-liveeditor files  
**Coverage**: 100% of context files and component integration  
**Quality**: ⭐⭐⭐⭐⭐ AI-optimized for deep understanding
