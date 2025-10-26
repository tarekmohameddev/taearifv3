# EditorSidebar Documentation Index

## Overview

This directory contains comprehensive documentation specifically for the **EditorSidebar** subsystem - the editing interface of the Live Editor.

---

## Documentation Files

### 1. [OVERVIEW.md](./OVERVIEW.md)
**EditorSidebar Introduction**

**Contents**:
- Architecture and file structure
- Component hierarchy
- Three views (main, add-section, edit-component)
- Simple vs Advanced modes
- Main components (EditorSidebar, AdvancedSimpleSwitcher)
- Initialization and save handlers
- Resize functionality
- Constants and configuration

**Read first** to understand EditorSidebar structure and purpose.

---

### 2. [FIELD_RENDERERS.md](./FIELD_RENDERERS.md)
**Field Rendering System**

**Contents**:
- Field type system (text, color, image, array, object, etc.)
- Simple field renderers (color, image, boolean, number)
- Complex field renderers (array, object)
- Specialized renderers (background)
- Rendering logic and path building
- Value retrieval and update logic
- Special cases (imagePosition, global components)
- Nested arrays and objects (recursive rendering)

**Essential for**: Understanding field rendering, adding custom field types.

---

### 3. [DATA_FLOW.md](./DATA_FLOW.md)
**EditorSidebar Data Flow**

**Contents**:
- Opening sidebar flow (complete step-by-step)
- Real-time editing flow
- Saving changes flow (detailed process)
- Data source resolution (priority system)
- Update path routing
- Special cases (halfTextHalfImage, contactCards)
- Data synchronization points
- Visual merge diagrams

**Critical for**: Understanding how edits propagate, debugging save issues.

---

### 4. [COMPONENTS.md](./COMPONENTS.md)
**EditorSidebar Components**

**Contents**:
- Complete component hierarchy
- AdvancedSimpleSwitcher (structure loading, mode switching)
- DynamicFieldsRenderer (form generation)
- Field renderers (detailed implementation)
- Theme selectors (component, page, card)
- Helper components (reset, translations)
- Advanced patterns (recursive, conditional, validation)

**Important for**: Understanding component implementation, extending functionality.

---

## Quick Reference

### Key Components

| Component | Purpose | File |
|-----------|---------|------|
| EditorSidebar | Main container | `index.tsx` |
| AdvancedSimpleSwitcher | Mode switching | `components/AdvancedSimpleSwitcher.tsx` |
| DynamicFieldsRenderer | Form generation | `components/DynamicFieldsRenderer.tsx` |
| ArrayFieldRenderer | Array editing | `components/FieldRenderers/ArrayFieldRenderer.tsx` |
| ObjectFieldRenderer | Object editing | `components/FieldRenderers/ObjectFieldRenderer.tsx` |
| ColorFieldRenderer | Color picking | `components/FieldRenderers.tsx` |
| ImageFieldRenderer | Image upload | `components/FieldRenderers.tsx` |

### Key Concepts

**tempData**: Temporary editing state, merged on save

**Three views**:
- `"main"`: Global settings
- `"add-section"`: Add component
- `"edit-component"`: Edit component

**Two modes**:
- `"simple"`: Subset of fields
- `"advanced"`: All fields

**Data sources** (priority):
1. currentData
2. globalComponentsData (for globals)
3. tempData (during editing)
4. componentData (from store)

---

## Common Operations

### Open Sidebar for Editing

```typescript
setSelectedComponentId(component.id);
setSidebarView("edit-component");
setSidebarOpen(true);
```

### Update Field

```typescript
updateByPath("content.title", "New Title");  // Updates tempData
```

### Save Changes

```typescript
const merged = deepMerge(
  deepMerge(existingData, storeData),
  tempData
);

store.setComponentData(type, id, merged);
onComponentUpdate(id, merged);
```

### Cancel Editing

```typescript
setTempData({});
onClose();
```

---

## Important Rules

### Rule 1: Always Initialize tempData
```typescript
useEffect(() => {
  if (view === "edit-component") {
    const data = store.getComponentData(type, id);
    setTempData(data || {});
  }
}, [selectedComponent, view]);
```

### Rule 2: Deep Merge on Save
```typescript
// ✅ CORRECT
const merged = deepMerge(deepMerge(a, b), c);

// ❌ WRONG
const merged = { ...a, ...b, ...c };
```

### Rule 3: Check for Global Components
```typescript
if (selectedComponent.id === "global-header") {
  // Special handling
}
```

### Rule 4: Update All Stores
```typescript
store.setComponentData(type, id, data);
store.forceUpdatePageComponents(page, updated);
```

---

## Learning Path

**For EditorSidebar Understanding**:

1. Read [OVERVIEW.md](./OVERVIEW.md) - Understand structure
2. Read [FIELD_RENDERERS.md](./FIELD_RENDERERS.md) - Learn field types
3. Read [DATA_FLOW.md](./DATA_FLOW.md) - Trace data movement
4. Read [COMPONENTS.md](./COMPONENTS.md) - Study components

**Total Time**: ~3-4 hours for complete understanding

---

## Related Documentation

### Parent Documentation
- [../README.md](../README.md) - Main Live Editor docs
- [../QUICK_START.md](../QUICK_START.md) - Quick overview
- [../CORE_CONCEPTS.md](../CORE_CONCEPTS.md) - Essential concepts

### Related Systems
- [../STATE_MANAGEMENT.md](../STATE_MANAGEMENT.md) - Store architecture
- [../DATA_FLOW.md](../DATA_FLOW.md) - Complete data flow
- [../COMPONENT_ARCHITECTURE.md](../COMPONENT_ARCHITECTURE.md) - Component system

---

## Summary

EditorSidebar documentation covers:

✅ Complete architecture and design  
✅ All field renderer types  
✅ Complete data flow (open, edit, save)  
✅ All components and their responsibilities  
✅ Special cases and edge cases  
✅ Common patterns and best practices  

**Key Takeaways**:
- EditorSidebar is the primary editing interface
- Uses dynamic field rendering based on structure definitions
- Manages tempData for draft changes
- Deep merges on save to prevent data loss
- Supports simple and advanced editing modes
- Handles regular and global components differently

**For AI**: These docs enable you to understand, debug, and extend the EditorSidebar system.

---

**Status**: ✅ Complete (4 documents)  
**Quality**: ⭐⭐⭐⭐⭐ Comprehensive and detailed

