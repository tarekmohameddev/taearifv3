# Quick Start Guide for AI

## 5-Minute Overview

### What is the Live Editor?

A real-time website builder that lets users:
- Drag & drop components to build pages
- Edit components visually in sidebar
- Preview changes in isolated iframe
- Save to database for production

### Key Files (Must Know)

```
LiveEditor.tsx              → Main entry point
LiveEditorUI.tsx            → UI rendering (iframe, sidebars)
editorStore.ts              → State management (all data)
ComponentsList.tsx          → Component registry
EditorSidebar/index.tsx     → Editing interface
```

### Key Concepts (Critical)

1. **component.id = UUID** → Use for ALL store operations
2. **Deep merge when saving** → Prevents data loss
3. **tempData = drafts** → Merged on save, cleared on cancel
4. **Global components special** → IDs: "global-header", "global-footer"
5. **Update all stores** → componentStates + pageComponentsByPage

---

## Essential Operations

### Add Component

```typescript
const newComponent = {
  id: uuidv4(),              // ← Generate UUID
  type: "hero",              // ← Component type
  componentName: "hero1",    // ← Variant
  data: createDefaultData("hero", "hero1")
};

setPageComponents([...current, newComponent]);

setTimeout(() => {
  store.ensureComponentVariant("hero", newComponent.id, newComponent.data);
  store.forceUpdatePageComponents(page, [...current, newComponent]);
}, 0);
```

### Edit Component

```typescript
// 1. Open sidebar
setSelectedComponentId(component.id);
setSidebarView("edit-component");

// 2. User edits
updateByPath("content.title", "New Title");  // Updates tempData

// 3. Save
const merged = deepMerge(
  deepMerge(existingData, storeData),
  tempData
);

store.setComponentData(type, id, merged);
store.forceUpdatePageComponents(page, updated);
```

### Save to Database

```typescript
const payload = {
  tenantId,
  pages: store.pageComponentsByPage,
  globalComponentsData: store.globalComponentsData
};

await axios.post("/v1/tenant-website/save-pages", payload);
```

---

## Common Mistakes

### ❌ Mistake 1: Using componentName as ID

```typescript
// WRONG
getComponentData("hero", "hero1")

// CORRECT
getComponentData("hero", component.id)  // UUID!
```

### ❌ Mistake 2: Shallow Merge

```typescript
// WRONG
const merged = { ...a, ...b, ...c }

// CORRECT
const merged = deepMerge(deepMerge(a, b), c)
```

### ❌ Mistake 3: Updating Only One Store

```typescript
// WRONG
return { heroStates: { ...state.heroStates, [id]: data } }

// CORRECT
return {
  heroStates: { ...state.heroStates, [id]: data },
  pageComponentsByPage: { ...state.pageComponentsByPage, [page]: updated }
}
```

### ❌ Mistake 4: Not Checking Global Components

```typescript
// WRONG
updateComponentByPath(type, id, path, value)  // Fails for globals!

// CORRECT
if (id === "global-header" || id === "global-footer") {
  updateGlobalComponentByPath(type, path, value);
} else {
  updateComponentByPath(type, id, path, value);
}
```

---

## Quick Reference

### Get Component Data

```typescript
const data = useEditorStore.getState().getComponentData(type, id);
```

### Update Component Field

```typescript
useEditorStore.getState().updateComponentByPath(
  type,
  id,
  "content.title",
  "New Title"
);
```

### Update Global Component

```typescript
useEditorStore.getState().updateGlobalComponentByPath(
  "header",
  "menu[0].text",
  "Home"
);
```

### Add to Page

```typescript
store.setPageComponentsForPage(page, [...components, newComponent]);
```

### Save Changes

```typescript
store.setComponentData(type, id, mergedData);
store.forceUpdatePageComponents(page, updatedComponents);
```

---

## When Things Go Wrong

### Changes Not Saving?
→ Check: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) → "Changes Not Saving"

### Component Not Rendering?
→ Check: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) → "Component Not Rendering"

### Drag & Drop Issues?
→ Check: [DRAG_DROP_SYSTEM.md](./DRAG_DROP_SYSTEM.md) → "Position Calculation"

### Global Component Issues?
→ Check: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) → "Global Component Issues"

---

## Documentation Map

### Start Here
- [OVERVIEW.md](./OVERVIEW.md) - High-level understanding
- [CORE_CONCEPTS.md](./CORE_CONCEPTS.md) - Essential concepts

### Deep Dives
- [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) - Store architecture
- [DATA_FLOW.md](./DATA_FLOW.md) - Data movement
- [COMPONENT_ARCHITECTURE.md](./COMPONENT_ARCHITECTURE.md) - Component system

### Subsystems
- [IFRAME_SYSTEM.md](./IFRAME_SYSTEM.md) - Preview rendering
- [DRAG_DROP_SYSTEM.md](./DRAG_DROP_SYSTEM.md) - Drag & drop
- [I18N_TRANSLATION_SYSTEM.md](./I18N_TRANSLATION_SYSTEM.md) - Translations

### EditorSidebar
- [editorSidebar/OVERVIEW.md](./editorSidebar/OVERVIEW.md) - Sidebar overview
- [editorSidebar/FIELD_RENDERERS.md](./editorSidebar/FIELD_RENDERERS.md) - Field types
- [editorSidebar/DATA_FLOW.md](./editorSidebar/DATA_FLOW.md) - Sidebar data flow

### Reference
- [API_REFERENCE.md](./API_REFERENCE.md) - All functions
- [COMMON_PATTERNS.md](./COMMON_PATTERNS.md) - Code patterns
- [PRACTICAL_EXAMPLES.md](./PRACTICAL_EXAMPLES.md) - Real examples
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Fix issues
- [DEBUG_AND_LOGGING.md](./DEBUG_AND_LOGGING.md) - Debug tools

---

## Next Steps

1. **Read OVERVIEW.md** - Understand the system
2. **Read CORE_CONCEPTS.md** - Learn essentials
3. **Read STATE_MANAGEMENT.md** - Understand stores
4. **Try adding a component** - Follow PRACTICAL_EXAMPLES.md
5. **Debug an issue** - Use TROUBLESHOOTING.md

---

## Summary

**The Live Editor in 3 Sentences**:

1. Components are identified by UUID (component.id), categorized by type, and themed by componentName
2. Data flows from database → tenantStore → editorStore → tempData → UI, with saves going in reverse
3. All updates must synchronize multiple stores (componentStates + pageComponentsByPage), use deep merge, and check for global components

**Remember**:
- component.id = PRIMARY KEY
- Deep merge = DATA SAFETY
- All stores = CONSISTENCY
- Global check = CORRECTNESS

