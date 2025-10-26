# EditorSidebar - Comprehensive Overview

## Table of Contents
1. [Introduction](#introduction)
2. [Architecture](#architecture)
3. [Main Components](#main-components)
4. [Views and Modes](#views-and-modes)
5. [Data Flow](#data-flow)
6. [Field Rendering System](#field-rendering-system)

---

## Introduction

The **EditorSidebar** is a dynamic, right-side panel that provides the interface for editing component properties. It features:
- **Multiple views**: Main settings, Add section, Edit component
- **Simple/Advanced modes**: Progressive disclosure of complexity
- **Dynamic field rendering**: Auto-generated forms based on component structure
- **Real-time updates**: Changes visible immediately in iframe
- **Resizable**: User can adjust sidebar width

### Purpose

The EditorSidebar serves as the primary interface for:
- Editing component content (text, images, colors)
- Modifying component layout and styling
- Managing nested data structures (arrays, objects)
- Switching component themes
- Resetting components to defaults
- Adding new sections to pages

---

## Architecture

### File Structure

```
EditorSidebar/
├── index.tsx                           # Main sidebar component
├── constants.ts                        # Available sections, icons
├── utils.ts                            # Helper functions
├── types.ts                            # TypeScript interfaces
├── TranslationFields.tsx               # i18n field component
├── TranslationExample.tsx              # Translation demo
├── TranslationTestComponent.tsx        # Translation testing
├── I18nExample.tsx                     # i18n usage example
├── UnifiedSidebar.tsx                  # Alternative sidebar implementation
└── components/
    ├── AdvancedSimpleSwitcher.tsx      # Simple/Advanced mode switcher
    ├── DynamicFieldsRenderer.tsx       # Dynamic form generator
    └── FieldRenderers/
        ├── ArrayFieldRenderer.tsx      # Array field handler
        ├── ObjectFieldRenderer.tsx     # Object field handler
        ├── BackgroundFieldRenderer.tsx # Background field handler
        └── index.tsx                   # Renderer exports
```

### Component Hierarchy

```
EditorSidebar (index.tsx)
│
├── View: "main"
│   ├── PageThemeSelector
│   ├── Color/Font Settings
│   └── "Add New Section" button
│
├── View: "add-section"
│   └── List of AVAILABLE_SECTIONS
│       └── Click → onSectionAdd(type)
│
└── View: "edit-component"
    ├── Theme Settings
    │   ├── ThemeSelector (switch variants)
    │   └── ResetConfirmDialog
    │
    └── Content Settings
        └── AdvancedSimpleSwitcher
            ├── Simple/Advanced toggle
            └── DynamicFieldsRenderer
                ├── Text fields
                ├── Number fields
                ├── Color fields
                ├── Image fields
                ├── Boolean toggles
                ├── Select dropdowns
                ├── Array fields
                └── Object fields
```

---

## Main Components

### 1. EditorSidebar (index.tsx)

**Role**: Main container and controller

**Props**:
```typescript
interface EditorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  view: "main" | "add-section" | "edit-component";
  setView: (view) => void;
  selectedComponent: ComponentInstance | null;
  onComponentUpdate: (id: string, newData: ComponentData) => void;
  onComponentThemeChange?: (id: string, newTheme: string) => void;
  onPageThemeChange?: (themeId, components) => void;
  onSectionAdd: (type: string) => void;
  onComponentReset?: (id: string) => void;
  width: number;
  setWidth: (w: number) => void;
}
```

**State Management**:
```typescript
const {
  tempData,              // Draft changes
  setTempData,           // Initialize draft
  updateByPath,          // Update field in draft
  globalHeaderData,      // Global header data
  globalFooterData,      // Global footer data
  updateGlobalHeaderByPath,  // Update global header
  updateGlobalFooterByPath,  // Update global footer
  globalComponentsData,  // Unified global data
  setGlobalComponentsData,   // Set unified global data
  setCurrentPage,        // Track which page/component editing
  setHasChangesMade      // Mark changes made
} = useEditorStore();
```

**Key Responsibilities**:
1. **View Management**: Switch between main, add-section, edit-component
2. **Data Initialization**: Load component data into tempData when editing starts
3. **Resize Handling**: Allow user to drag sidebar edge to resize
4. **Save Logic**: Merge tempData with existing data and persist
5. **Cancel Logic**: Discard tempData and close sidebar

### 2. AdvancedSimpleSwitcher

**Role**: Toggle between Simple and Advanced editing modes

**Location**: `components/AdvancedSimpleSwitcher.tsx`

**How It Works**:

```typescript
export function AdvancedSimpleSwitcher({
  type,              // Component type (e.g., "hero")
  componentName,     // Variant name (e.g., "hero1")
  componentId,       // Component UUID
  onUpdateByPath,    // Update callback
  currentData        // Current component data
}) {
  const [mode, setMode] = useState<"simple" | "advanced">("simple");
  const [structure, setStructure] = useState(null);
  
  // Load component structure
  useEffect(() => {
    const loadStructure = async () => {
      const structureModule = await import(
        `@/componentsStructure/${type}`
      );
      const loadedStructure = structureModule[`${type}Structure`];
      setStructure(translateComponentStructure(loadedStructure, t));
    };
    
    loadStructure();
  }, [type]);
  
  // Find matching variant
  const variant = structure.variants.find(v => v.id === componentName);
  
  // Select fields based on mode
  const fields = mode === "simple" && variant.simpleFields
    ? variant.simpleFields
    : variant.fields;
  
  return (
    <div>
      {/* Simple/Advanced toggle */}
      <div className="mode-switcher">
        <button onClick={() => setMode("simple")}>Simple</button>
        <button onClick={() => setMode("advanced")}>Advanced</button>
      </div>
      
      {/* Render fields */}
      <DynamicFieldsRenderer
        fields={fields}
        componentType={type}
        variantId={componentId}
        onUpdateByPath={onUpdateByPath}
        currentData={currentData}
      />
    </div>
  );
}
```

**Simple vs Advanced**:
- **Simple Mode**: Shows subset of most common fields (defined in `simpleFields`)
- **Advanced Mode**: Shows ALL fields (defined in `fields`)

**Structure Loading**:
1. Dynamic import: `import(`@/componentsStructure/${type}`)`
2. Extract structure: `structureModule[${type}Structure]`
3. Translate labels: `translateComponentStructure(loaded, t)`
4. Find variant: `structure.variants.find(v => v.id === componentName)`

### 3. DynamicFieldsRenderer

**Role**: Generate form fields dynamically based on structure definition

**Location**: `components/DynamicFieldsRenderer.tsx`

**Props**:
```typescript
interface DynamicFieldsRendererProps {
  fields: FieldDefinition[];          // Fields to render
  componentType?: string;             // Component type
  variantId?: string;                 // Component ID
  onUpdateByPath?: (path, value) => void;  // Update callback
  currentData?: any;                  // Current values
}
```

**Core Logic**:

```typescript
export function DynamicFieldsRenderer({
  fields,
  componentType,
  variantId,
  onUpdateByPath,
  currentData
}) {
  const { tempData, updateByPath, getComponentData } = useEditorStore();
  
  // Get value from path
  const getValueByPath = useCallback((path) => {
    const segments = path.split(".").filter(Boolean);
    
    // Determine data source
    let cursor;
    if (currentData && Object.keys(currentData).length > 0) {
      cursor = currentData;
    } else if (variantId === "global-header") {
      cursor = globalComponentsData?.header || tempData || {};
    } else if (variantId === "global-footer") {
      cursor = globalComponentsData?.footer || tempData || {};
    } else if (componentType && variantId) {
      const componentData = getComponentData(componentType, variantId);
      cursor = tempData || currentData || componentData || {};
    } else {
      cursor = tempData || {};
    }
    
    // Navigate path
    for (const seg of segments) {
      if (cursor == null) return undefined;
      cursor = cursor[seg];
    }
    
    return cursor;
  }, [currentData, tempData, componentType, variantId]);
  
  // Update value at path
  const updateValue = useCallback((path, value) => {
    if (onUpdateByPath) {
      // For regular components, update tempData for immediate feedback
      if (
        componentType &&
        variantId &&
        variantId !== "global-header" &&
        variantId !== "global-footer"
      ) {
        updateByPath(path, value);  // Updates tempData
      } else {
        onUpdateByPath(path, value);  // For global components
      }
    } else {
      updateByPath(path, value);
    }
  }, [onUpdateByPath, updateByPath, componentType, variantId]);
  
  // Render each field based on type
  const renderField = (def: FieldDefinition, basePath?: string) => {
    const path = basePath ? `${basePath}.${def.key}` : def.key;
    const value = getValueByPath(path);
    
    switch (def.type) {
      case "text":
        return <TextInput value={value} onChange={...} />;
      case "number":
        return <NumberInput value={value} onChange={...} />;
      case "color":
        return <ColorFieldRenderer ... />;
      case "image":
        return <ImageFieldRenderer ... />;
      case "boolean":
        return <BooleanFieldRenderer ... />;
      case "select":
        return <SelectField ... />;
      case "array":
        return <ArrayFieldRenderer ... />;
      case "object":
        return <ObjectFieldRenderer ... />;
    }
  };
  
  return (
    <div className="space-y-4">
      {fields.map((field, i) => (
        <div key={i}>{renderField(field)}</div>
      ))}
    </div>
  );
}
```

**Key Responsibilities**:
- **Value Retrieval**: Get current value from appropriate data source
- **Value Updates**: Route updates to correct store function
- **Field Rendering**: Delegate to specialized renderers based on type
- **Path Management**: Handle nested paths correctly

---

## Views and Modes

### View 1: "main"

**Purpose**: Global settings and quick actions

**Content**:
```
┌─────────────────────────────────┐
│  🎨 Theme Settings              │
│                                 │
│  ┌─────────────────────────┐   │
│  │  Page Theme Selector    │   │
│  │  - Apply theme to all   │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │  Primary Color          │   │
│  │  [color picker]         │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │  Default Font           │   │
│  │  [select dropdown]      │   │
│  └─────────────────────────┘   │
│                                 │
│  [Add New Section]              │
└─────────────────────────────────┘
```

**User Actions**:
- Change page theme → Applies to all components on page
- Adjust global colors/fonts (future feature)
- Click "Add New Section" → Switch to "add-section" view

### View 2: "add-section"

**Purpose**: Add new components to page

**Content**:
```
┌─────────────────────────────────┐
│  🏗️ Add Section                 │
│  Choose a section to add        │
│                                 │
│  ┌─────────────────────────┐   │
│  │  🌟 Hero                │   │
│  │  Main banner section    │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │  🖼️ Half Text Half Image│   │
│  │  Text and image layout  │   │
│  └─────────────────────────┘   │
│                                 │
│  ... (all available sections)   │
│                                 │
│  [Back to Settings]             │
└─────────────────────────────────┘
```

**User Actions**:
- Click section → onSectionAdd(type) → Component added to page
- Click "Back to Settings" → Return to "main" view

**Component List**:
Loaded from `AVAILABLE_SECTIONS` in constants.ts:
```typescript
export const AVAILABLE_SECTIONS = [
  {
    type: "hero",
    name: "Hero",
    section: "homepage",
    component: "hero",
    description: "Main banner section"
  },
  // ... more sections
];
```

### View 3: "edit-component"

**Purpose**: Edit selected component's properties

**Content**:
```
┌─────────────────────────────────┐
│  🎨 Component Theme (commented) │
│  [ThemeSelector]                │
│  [ResetConfirmDialog]           │
│                                 │
│  ✏️ Content Settings            │
│                                 │
│  ┌─────────────────────────┐   │
│  │  Simple | Advanced      │   │
│  └─────────────────────────┘   │
│                                 │
│  [Dynamic Fields Based on       │
│   Component Structure]          │
│                                 │
│  - Text inputs                  │
│  - Color pickers                │
│  - Image uploaders              │
│  - Array editors                │
│  - Object editors               │
│                                 │
│  [Save Changes]                 │
│  [Cancel]                       │
└─────────────────────────────────┘
```

**User Actions**:
- Toggle Simple/Advanced mode
- Edit fields (triggers updateByPath)
- Click "Save Changes" → Merge and persist data
- Click "Cancel" → Discard changes

---

## Main Components

### EditorSidebar Component (index.tsx)

#### Initialization Effect

```typescript
useEffect(() => {
  if (view === "edit-component" && selectedComponent) {
    // Handle global components
    if (selectedComponent.id === "global-header") {
      const defaultData = getDefaultHeaderData();
      const dataToUse = 
        globalComponentsData?.header || 
        globalHeaderData || 
        defaultData;
      
      setCurrentPage("global-header");
      setTempData(dataToUse);
      return;
    }
    
    if (selectedComponent.id === "global-footer") {
      const defaultData = getDefaultFooterData();
      const dataToUse = 
        globalComponentsData?.footer || 
        globalFooterData || 
        defaultData;
      
      setCurrentPage("global-footer");
      setTempData(dataToUse);
      return;
    }
    
    // Handle regular components
    const store = useEditorStore.getState();
    const defaultData = createDefaultData(
      selectedComponent.type,
      selectedComponent.componentName
    );
    
    const uniqueVariantId = selectedComponent.id;  // UUID
    
    // Determine data to use
    let dataToUse;
    if (selectedComponent.type === "contactCards") {
      // Special handling for contactCards - check if cards array exists
      const hasCards = 
        selectedComponent.data?.cards &&
        Array.isArray(selectedComponent.data.cards) &&
        selectedComponent.data.cards.length > 0;
      
      dataToUse = hasCards ? selectedComponent.data : defaultData;
    } else {
      dataToUse = 
        selectedComponent.data && Object.keys(selectedComponent.data).length > 0
          ? selectedComponent.data
          : defaultData;
    }
    
    // Initialize in store
    store.ensureComponentVariant(
      selectedComponent.type,
      uniqueVariantId,
      dataToUse
    );
    
    // Load into tempData
    const currentComponentData = store.getComponentData(
      selectedComponent.type,
      uniqueVariantId
    );
    setTempData(currentComponentData || {});
  }
}, [selectedComponent, view]);
```

**Logic Breakdown**:
1. **Check if editing**: `view === "edit-component"`
2. **Global component check**: Special IDs `"global-header"` or `"global-footer"`
3. **Data priority**: globalComponentsData > globalHeaderData > defaultData
4. **Set current page**: Tracks what's being edited
5. **Initialize tempData**: Load current data for editing
6. **Regular components**: Use `component.id` as unique identifier
7. **Ensure in store**: Call `ensureComponentVariant()`
8. **Load tempData**: From store, not from selectedComponent.data directly

#### Save Handler

```typescript
const handleSave = () => {
  if (!selectedComponent) return;
  
  // Mark changes made
  setHasChangesMade(true);
  
  const store = useEditorStore.getState();
  const currentPage = store.currentPage || "homepage";
  
  // Get latest tempData
  const latestTempData = 
    selectedComponent.id === "global-header" ||
    selectedComponent.id === "global-footer"
      ? store.tempData || tempData
      : tempData;
  
  // GLOBAL HEADER
  if (selectedComponent.id === "global-header") {
    setGlobalHeaderData(latestTempData);
    setGlobalComponentsData({
      ...globalComponentsData,
      header: latestTempData
    });
    onComponentUpdate(selectedComponent.id, latestTempData);
    onClose();
    return;
  }
  
  // GLOBAL FOOTER
  if (selectedComponent.id === "global-footer") {
    setGlobalFooterData(latestTempData);
    setGlobalComponentsData({
      ...globalComponentsData,
      footer: latestTempData
    });
    onComponentUpdate(selectedComponent.id, latestTempData);
    onClose();
    return;
  }
  
  // REGULAR COMPONENTS
  const uniqueVariantId = selectedComponent.id;
  
  // Get store data
  const storeData = store.getComponentData(
    selectedComponent.type,
    uniqueVariantId
  );
  
  // Get existing component from page
  const currentPageComponents = 
    store.pageComponentsByPage[currentPage] || [];
  const existingComponent = currentPageComponents.find(
    (comp) => comp.id === selectedComponent.id
  );
  
  // CRITICAL: Deep merge all data sources
  const mergedData = existingComponent?.data
    ? deepMerge(
        deepMerge(existingComponent.data, storeData),
        latestTempData
      )
    : deepMerge(storeData, latestTempData);
  
  // Update store
  store.setComponentData(
    selectedComponent.type,
    uniqueVariantId,
    mergedData
  );
  
  // Update pageComponentsByPage
  const updatedPageComponents = currentPageComponents.map((comp) => {
    if (comp.id === selectedComponent.id) {
      return { ...comp, data: mergedData };
    }
    return comp;
  });
  
  store.forceUpdatePageComponents(currentPage, updatedPageComponents);
  
  // Notify parent
  onComponentUpdate(selectedComponent.id, mergedData);
  
  // Update tempData to stay in sync
  setTempData(mergedData);
  
  onClose();
};
```

**Save Logic Explained**:

1. **Mark changes**: `setHasChangesMade(true)` triggers unsaved changes warning
2. **Get latest data**: Use store.tempData for global components
3. **Branch by type**: Global components vs regular components
4. **Global components**: Update both individual and unified global data
5. **Regular components**: 
   - Get existing data from page
   - Get store data from component state
   - **Deep merge** all three sources: existing → store → tempData
6. **Update stores**: Both component state AND pageComponentsByPage
7. **Notify parent**: Trigger re-render in LiveEditorUI
8. **Close sidebar**: End editing session

**Why Deep Merge?**

```typescript
// Shallow merge (WRONG)
const merged = {
  ...existingData,    // { content: { title: "Old", subtitle: "Old Sub" } }
  ...tempData         // { content: { title: "New" } }
};
// Result: { content: { title: "New" } }  ← subtitle LOST!

// Deep merge (CORRECT)
const merged = deepMerge(existingData, tempData);
// Result: { content: { title: "New", subtitle: "Old Sub" } }  ✅
```

#### Resize Handler

```typescript
const handleMouseDown = (e) => {
  e.preventDefault();
  isResizing.current = true;
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};

const handleMouseMove = useCallback((e) => {
  if (isResizing.current && sidebarRef.current) {
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth > 400 && newWidth < 1000) {
      setWidth(newWidth);
    }
  }
}, [setWidth]);

const handleMouseUp = useCallback(() => {
  isResizing.current = false;
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
}, [handleMouseMove]);
```

**Implementation**:
- Resize handle on left edge of sidebar
- Minimum width: 400px
- Maximum width: 1000px
- Smooth dragging with mousemove listener

---

## Field Rendering System

### Field Type Hierarchy

```
FieldDefinition (Base)
├── text / textarea
├── number
├── boolean
├── color
├── image
├── select
├── array → ArrayFieldDefinition
│   └── of: FieldDefinition[]
└── object → ObjectFieldDefinition
    └── fields: FieldDefinition[]
```

### Field Definition Structure

```typescript
// Simple field
{
  key: "content.title",
  label: "Title",
  type: "text",
  placeholder: "Enter title...",
  min: 3,
  max: 100
}

// Select field
{
  key: "layout.direction",
  label: "Direction",
  type: "select",
  options: [
    { label: "Left to Right", value: "ltr" },
    { label: "Right to Left", value: "rtl" }
  ]
}

// Object field
{
  key: "content",
  label: "Content",
  type: "object",
  fields: [
    { key: "title", label: "Title", type: "text" },
    { key: "subtitle", label: "Subtitle", type: "textarea" }
  ]
}

// Array field
{
  key: "menu",
  label: "Menu Items",
  type: "array",
  itemLabel: "Menu Item",
  addLabel: "Add Menu Item",
  of: [
    { key: "text", label: "Text", type: "text" },
    { key: "url", label: "URL", type: "text" },
    { key: "type", label: "Type", type: "select", options: [...] }
  ]
}
```

### Conditional Rendering

Fields can have conditions:

```typescript
{
  key: "background.colors.to",
  label: "Gradient End Color",
  type: "color",
  condition: {
    field: "background.type",  // Check this field
    value: "gradient"          // Show only if equals "gradient"
  }
}
```

**Implementation**:
```typescript
renderField(def, basePath?) {
  // Check condition
  if (def.condition) {
    const conditionValue = getValueByPath(def.condition.field);
    if (conditionValue !== def.condition.value) {
      return null;  // Don't render
    }
  }
  
  // Render field...
}
```

---

## Data Flow in EditorSidebar

### Opening Sidebar for Editing

```
1. User clicks component in iframe
   ↓
2. handleEditClick(component.id)
   ↓
3. setSelectedComponentId(component.id)
   ↓
4. setSidebarView("edit-component")
   ↓
5. setSidebarOpen(true)
   ↓
6. EditorSidebar useEffect detects view change
   ↓
7. Check if global component
   ├─ Yes → Load globalHeaderData/globalFooterData
   └─ No → Load from component states
   ↓
8. store.ensureComponentVariant(type, id, data)
   ↓
9. currentData = store.getComponentData(type, id)
   ↓
10. setTempData(currentData)
    ↓
11. AdvancedSimpleSwitcher loads component structure
    ↓
12. DynamicFieldsRenderer renders fields
    ↓
13. Fields displayed - ready for editing
```

### Real-Time Editing

```
1. User types in field (e.g., Title input)
   ↓
2. onChange event → updateValue(path, newValue)
   ↓
3. DynamicFieldsRenderer.updateValue()
   ↓
4. Check component type
   ├─ Global? → updateByPath(path, value)  [updates tempData]
   └─ Regular? → updateByPath(path, value)  [updates tempData]
   ↓
5. tempData updated in editorStore
   ↓
6. Component in iframe reads data
   ├─ For global: reads globalComponentsData (via tempData)
   └─ For regular: reads componentStates (NOT tempData directly)
   ↓
7. Component re-renders with NEW value
   ↓
8. User sees change immediately in iframe
```

**Key Point**: Regular components DON'T read tempData directly. They read from component states. tempData is merged into component states on SAVE.

### Saving Changes

```
1. User clicks "Save Changes"
   ↓
2. handleSave() called
   ↓
3. setHasChangesMade(true)
   ↓
4. Get latestTempData from store
   ↓
5. Branch by component type
   │
   ├─ Global Header
   │  ├─ setGlobalHeaderData(tempData)
   │  ├─ setGlobalComponentsData({ header: tempData })
   │  └─ onComponentUpdate("global-header", tempData)
   │
   ├─ Global Footer
   │  ├─ setGlobalFooterData(tempData)
   │  ├─ setGlobalComponentsData({ footer: tempData })
   │  └─ onComponentUpdate("global-footer", tempData)
   │
   └─ Regular Component
      ├─ Get storeData from component state
      ├─ Get existingData from pageComponentsByPage
      ├─ mergedData = deepMerge(existing, store, temp)
      ├─ store.setComponentData(type, id, mergedData)
      │  ├─ Updates heroStates[id]
      │  └─ Updates pageComponentsByPage[page][index].data
      ├─ store.forceUpdatePageComponents(page, updated)
      └─ onComponentUpdate(id, mergedData)
   ↓
6. tempData cleared or updated with merged data
   ↓
7. Sidebar closes
   ↓
8. Changes persisted in store
```

---

## Constants and Configuration

### AVAILABLE_SECTIONS (constants.ts)

Defines which component types can be added:

```typescript
export const AVAILABLE_SECTIONS: AvailableSection[] = 
  getComponentsBySection("homepage").map((component) => ({
    type: component.id,           // "hero"
    name: component.displayName,  // "Hero"
    section: component.section,   // "homepage"
    component: component.name,    // "hero"
    description: component.description
  }));
```

**Loaded from**: `ComponentsList.tsx` via `getComponentsBySection()`

**Translated Version**:
```typescript
export const getAvailableSectionsTranslated = (t) => {
  return getComponentsBySectionTranslated("homepage", t).map((component) => ({
    type: component.id,
    name: component.displayName,  // Now translated
    section: component.section,
    component: component.name,
    description: component.description  // Now translated
  }));
};
```

### SECTION_ICONS (constants.ts)

Maps component types to emoji icons:

```typescript
export const SECTION_ICONS: Record<string, string> = {
  hero: "🌟",
  header: "📄",
  halfTextHalfImage: "🖼️",
  propertySlider: "🏠",
  // ... more
};

export const getSectionIcon = (type: string): string => {
  return SECTION_ICONS[type] || "🎯";
};
```

---

## Utility Functions (utils.ts)

### createDefaultData

**Purpose**: Generate default data for component types

```typescript
export const createDefaultData = (
  type: string,
  componentName?: string
): ComponentData => {
  const component = getComponentById(type);
  
  if (!component) {
    // Fallback for unknown components
    return {
      texts: { title: `${type} Title` },
      colors: { background: "#FFFFFF" }
    };
  }
  
  // Component-specific defaults
  switch (type) {
    case "hero":
      return {
        visible: true,
        height: { desktop: "90vh", tablet: "90vh", mobile: "90vh" },
        background: {
          image: "https://example.com/hero.jpg",
          overlay: { enabled: true, opacity: "0.45" }
        },
        content: {
          title: "Discover Your Perfect Property",
          subtitle: "We offer the best real estate options"
        },
        // ... extensive default configuration
      };
    
    case "header":
      return {
        visible: true,
        logo: { type: "image+text", text: "Company" },
        menu: [
          { id: "home", type: "link", text: "Home", url: "/" }
        ],
        // ... header defaults
      };
    
    case "halfTextHalfImage":
      // Check componentName to select appropriate defaults
      if (componentName === "halfTextHalfImage2") {
        return getDefaultHalfTextHalfImage2Data();
      } else if (componentName === "halfTextHalfImage3") {
        return getDefaultHalfTextHalfImage3Data();
      } else {
        return getDefaultHalfTextHalfImageData();
      }
    
    case "contactCards":
      return {
        visible: true,
        cards: [
          {
            icon: { src: "/address.svg", alt: "Address" },
            title: { text: "Address" },
            content: { type: "text", text: "Saudi Arabia" }
          },
          {
            icon: { src: "/email.svg", alt: "Email" },
            title: { text: "Email" },
            content: {
              type: "links",
              links: [{ text: "info@example.com", href: "mailto:..." }]
            }
          }
        ]
      };
    
    default:
      return {
        visible: true,
        texts: { title: `${type} Title` },
        colors: { background: "#FFFFFF" }
      };
  }
};
```

**Key Points**:
- Imports default data functions from `editorStoreFunctions/`
- Handles component variants (hero1, hero2, etc.)
- Returns complete, valid component data
- Used when adding new components or resetting

### normalizePath

**Purpose**: Clean and standardize dot-notation paths

```typescript
export const normalizePath = (path: string): string => {
  return path.replace(/\.\[(\d+)\]\./g, ".$1.");
};

// Examples:
normalizePath("menu.[0].text")     → "menu.0.text"
normalizePath("slides.[2].title")  → "slides.2.title"
```

### getValueByPath

**Purpose**: Retrieve value from nested object via path

```typescript
export const getValueByPath = (obj: any, path: string): any => {
  const segments = normalizePath(path).split(".").filter(Boolean);
  
  let cursor = obj;
  for (const seg of segments) {
    if (cursor == null) return undefined;
    cursor = cursor[seg];
  }
  return cursor;
};

// Example:
const data = {
  content: {
    title: "Welcome",
    stats: {
      stat1: { value: "100+" }
    }
  }
};

getValueByPath(data, "content.title")           → "Welcome"
getValueByPath(data, "content.stats.stat1.value") → "100+"
```

### updateValueByPath

**Purpose**: Set value in nested object via path

```typescript
export const updateValueByPath = (
  obj: any,
  path: string,
  value: any
): any => {
  const segments = normalizePath(path).split(".").filter(Boolean);
  const result = { ...obj };
  let cursor = result;
  
  for (let i = 0; i < segments.length - 1; i++) {
    const seg = segments[i];
    if (!(seg in cursor)) {
      cursor[seg] = {};
    }
    cursor = cursor[seg];
  }
  
  cursor[segments[segments.length - 1]] = value;
  return result;
};
```

---

## Advanced Features

### Resizable Sidebar

The sidebar can be resized by dragging the left edge:

```typescript
<div
  className="w-3 cursor-col-resize"
  onMouseDown={handleMouseDown}
>
  <div className="resize-handle" />
</div>
```

**Constraints**:
- Min width: 400px
- Max width: 1000px
- Smooth dragging experience

### Theme Selectors

Three types of theme selectors:

1. **PageThemeSelector**: Apply coordinated theme to entire page
2. **ThemeSelector**: Change component variant (hero1 → hero2)
3. **CardThemeSelector**: Specialized themes for card components

**Example**:
```typescript
<PageThemeSelector
  onThemeChange={(themeId, components) => {
    // components = { hero: "hero2", header: "header1", ... }
    if (onPageThemeChange) {
      onPageThemeChange(themeId, components);
    }
  }}
/>
```

### Reset Confirmation

Before resetting component, show confirmation dialog:

```typescript
<ResetConfirmDialog
  componentType={selectedComponent.type}
  componentName={selectedComponent.componentName}
  onConfirmReset={() => {
    if (onComponentReset) {
      onComponentReset(selectedComponent.id);
    }
  }}
/>
```

**Warning Shown**:
- All customizations will be lost
- Colors, text, layout settings reset
- Cannot be undone
- Restores default configuration

---

## Important Notes for AI

### When Working with EditorSidebar

1. **Always initialize tempData** before editing
2. **Always deep merge** when saving
3. **Check for global components** with special IDs
4. **Use component.id** as unique identifier, not componentName
5. **Update callback** might be `onUpdateByPath` or direct `updateByPath`

### Data Source Priority

When getting value in DynamicFieldsRenderer:

```
currentData (if provided)
  ↓
globalComponentsData (for global components)
  ↓
tempData (during editing)
  ↓
componentStates (from store)
  ↓
{} (empty fallback)
```

### Update Target Priority

When updating value in DynamicFieldsRenderer:

```
For Global Components:
  updateByPath(path, value)  → Updates tempData

For Regular Components:
  updateByPath(path, value)  → Updates tempData
  (NOT updateComponentByPath - that's for direct store updates)
```

**Why?**: We want to update tempData for immediate preview, then merge into component states on save.

---

## Next Steps

For detailed information on specific subsystems:
- **Field Renderers**: See `FIELD_RENDERERS.md`
- **Data Flow**: See `DATA_FLOW.md`
- **Components**: See `COMPONENTS.md`

