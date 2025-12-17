# Live Editor System - Comprehensive Overview

## Table of Contents

1. [System Introduction](#system-introduction)
2. [Core Philosophy](#core-philosophy)
3. [High-Level Architecture](#high-level-architecture)
4. [Key Features](#key-features)
5. [Main Components](#main-components)
6. [Technology Stack](#technology-stack)

---

## System Introduction

The **Live Editor** is a sophisticated, real-time website builder system that enables users to visually create and edit websites through an interactive drag-and-drop interface. The system provides instant visual feedback by rendering changes in an isolated iframe environment while maintaining full state synchronization across multiple data stores.

### Purpose

- Enable non-technical users to build professional websites
- Provide real-time visual feedback for all changes
- Maintain data consistency across complex state hierarchies
- Support multi-page editing with global components (header/footer)
- Persist all changes to database for production deployment

### Scope

The Live Editor handles:

- **Page Management**: Create, edit, and delete pages
- **Component Management**: Add, edit, delete, move, and theme components
- **State Management**: Multi-layered state with Zustand stores
- **Data Persistence**: Save to database and load from database
- **Real-time Preview**: Instant visual feedback in iframe
- **Responsive Design**: Preview across mobile, tablet, and desktop
- **Global Components**: Shared header/footer across all pages
- **i18n Support**: Multi-language editing (Arabic/English)

---

## Core Philosophy

### 1. **Separation of Concerns**

The system is divided into clear, modular layers:

- **UI Layer** (`LiveEditorUI.tsx`): Presentation and user interaction
- **State Layer** (`editorStore.ts`): Data management and persistence
- **Logic Layer** (`LiveEditorHandlers.tsx`, `LiveEditorEffects.tsx`): Business logic
- **Component Layer** (Individual components): Reusable UI elements

### 2. **Component-Based Architecture**

Every visual element is a component with:

- **Unique ID**: UUID-based identification
- **Type**: Component category (hero, header, footer, etc.)
- **ComponentName**: Specific variant (hero1, hero2, header1, etc.)
- **Data**: Component-specific configuration
- **Layout**: Position and sizing information

### 3. **Multi-Store State Management**

The system uses multiple Zustand stores:

- **editorStore**: Main store for all component states
- **tenantStore**: Tenant-specific data and API interactions
- **Individual Component States**: Each component type has dedicated state (heroStates, headerStates, etc.)

### 4. **Path-Based Updates**

All data updates use dot-notation paths:

```typescript
// Example paths:
"content.title"; // Simple path
"menu[0].text"; // Array index path
"background.colors.from"; // Nested object path
```

This enables:

- Precise updates to nested data
- Consistent update API across all components
- Easy debugging and tracking

### 5. **Default Data Hierarchy**

Data merging follows a strict priority:

```
currentStoreData (highest)
  ↓
storeData
  ↓
tenantComponentData (from database)
  ↓
props
  ↓
defaultData (lowest)
```

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     LiveEditor (Main)                        │
│  - Orchestrates all sub-systems                             │
│  - Combines hooks, effects, and handlers                    │
└─────────────────┬───────────────────────────────────────────┘
                  │
      ┌───────────┴───────────┬───────────────┬──────────────┐
      ▼                       ▼               ▼              ▼
┌──────────┐          ┌──────────┐    ┌──────────┐   ┌──────────┐
│   State  │          │ Computed │    │ Handlers │   │ Effects  │
│  (Hooks) │          │  Values  │    │ (Logic)  │   │ (Async)  │
└────┬─────┘          └────┬─────┘    └────┬─────┘   └────┬─────┘
     │                     │               │              │
     └─────────────────────┴───────────────┴──────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │   LiveEditorUI (View)  │
              │  - Main UI rendering   │
              │  - iframe management   │
              │  - Component display   │
              └────────┬───────────────┘
                       │
           ┌───────────┴───────────┐
           ▼                       ▼
    ┌─────────────┐         ┌─────────────┐
    │  AutoFrame  │         │ EditorSidebar│
    │  (iframe)   │         │  (Settings)  │
    └──────┬──────┘         └──────┬───────┘
           │                       │
           ▼                       ▼
    ┌─────────────┐         ┌─────────────┐
    │ Components  │         │   Fields    │
    │   Render    │         │  Renderers  │
    └─────────────┘         └─────────────┘
```

### Data Flow Overview

```
Database → tenantStore → editorStore → tempData → Component Rendering
                            ↓              ↓
                    pageComponentsByPage   ├→ User Edits
                            ↓              ↓
                    Save Button → Merge → Database
```

---

## Key Features

### 1. **Real-Time Preview**

- All changes render instantly in iframe
- Automatic style synchronization
- CSS variables copied from parent
- Responsive device preview (mobile, tablet, desktop)

### 2. **Advanced Drag & Drop**

- Component reordering within pages
- New component addition from sidebar
- Position tracking and validation
- Smart index calculation

### 3. **Multi-Level Editing**

- **Global Components**: Header and Footer shared across all pages
- **Page Components**: Unique to each page
- **Component Variants**: Multiple themes per component type

### 4. **Comprehensive State Management**

- **Component-level state**: Each component instance has unique state
- **Page-level state**: Components grouped by page
- **Global state**: Shared data across all pages
- **Temporary state**: Draft changes before saving

### 5. **Dynamic Field Rendering**

- Auto-generated forms based on component structure
- Support for all field types: text, number, color, image, array, object
- Nested object/array editing
- Conditional field visibility

### 6. **Theme System**

- **Component Themes**: Switch visual variants (hero1, hero2, etc.)
- **Page Themes**: Apply coordinated themes to entire pages
- **Card Themes**: Specialized themes for card-based components

### 7. **Validation & Error Handling**

- Position validation for drag & drop
- Field validation (min/max, required)
- Error states with retry mechanisms
- Debug panels for development

---

## Main Components

### 1. **LiveEditor.tsx**

**Role**: Main orchestrator component

**Responsibilities**:

- Combine all hooks (state, computed, handlers, effects)
- Pass coordinated data to UI layer
- Serve as entry point for the editor

**Structure**:

```typescript
export default function LiveEditor() {
  const state = useLiveEditorState();
  const computed = useLiveEditorComputed(state);
  const handlers = useLiveEditorHandlers(state);

  useLiveEditorEffects(state);

  return <LiveEditorUI state={state} computed={computed} handlers={handlers} />;
}
```

### 2. **LiveEditorUI.tsx**

**Role**: Main UI rendering component

**Responsibilities**:

- Render iframe with AutoFrame component
- Display header and footer (global components)
- Render page components in drag-drop zones
- Show ComponentsSidebar and EditorSidebar
- Handle device preview switching
- Display dialogs (delete, confirmation)

**Key Elements**:

- AutoFrame: iframe wrapper with style synchronization
- ComponentsSidebar: Left sidebar with draggable components
- EditorSidebar: Right sidebar for editing selected components
- Device Preview: Mobile/tablet/desktop switcher

### 3. **LiveEditorHooks.tsx**

**Role**: State management and computed values

**Exports**:

- `useLiveEditorState()`: All reactive state variables
- `useLiveEditorComputed()`: Derived/computed values

**State Variables**:

```typescript
- pageComponents: Array of components on current page
- selectedComponentId: ID of component being edited
- sidebarOpen: Whether sidebar is visible
- sidebarView: Which sidebar view is active
- initialized: Whether data loaded from database
- activeId: Currently dragged component ID
- dropIndicator: Visual drop indicator position
```

### 4. **LiveEditorEffects.tsx**

**Role**: Side effects and async operations

**Effects**:

1. **Authentication Effect**: Redirect to login if not authenticated
2. **Tenant Data Loading**: Fetch tenant data on mount
3. **Database Loading**: Load components from database into stores
4. **Component Names Update**: Sync component names from registry
5. **Store Sync**: Keep editorStore in sync with pageComponents
6. **Save Function Setup**: Register save function with store

### 5. **LiveEditorHandlers.tsx**

**Role**: Event handlers and business logic

**Handlers**:

- `handleEditClick`: Open sidebar to edit component
- `handleDeleteClick`: Show delete confirmation dialog
- `handleComponentUpdate`: Update component data
- `handleComponentThemeChange`: Switch component theme
- `handleComponentReset`: Reset component to defaults
- `handleAddSection`: Add new component to page
- `handlePageThemeChange`: Apply theme to all components
- `handleDragEndLocal`: Process drag & drop completion
- `confirmDelete/cancelDelete`: Delete confirmation flow
- `confirmDeletePage/cancelDeletePage`: Page deletion flow

### 6. **EditorSidebar (Module)**

**Role**: Component editing interface

**Structure**:

```
EditorSidebar/
├── index.tsx (Main sidebar component)
├── constants.ts (Available sections, icons)
├── utils.ts (Helper functions, default data creation)
├── types.ts (TypeScript interfaces)
└── components/
    ├── AdvancedSimpleSwitcher.tsx (Simple/Advanced mode toggle)
    ├── DynamicFieldsRenderer.tsx (Dynamic form generation)
    └── FieldRenderers/
        ├── ArrayFieldRenderer.tsx
        ├── ObjectFieldRenderer.tsx
        ├── BackgroundFieldRenderer.tsx
        └── index.tsx
```

**See**: `editorSidebar/OVERVIEW.md` for detailed sidebar documentation

### 7. **editorStore.ts**

**Role**: Central state management store

**Key Responsibilities**:

- Manage all component states
- Provide generic CRUD operations
- Handle global components (header/footer)
- Track page-wise components
- Load/save from/to database
- Manage temporary editing state

**See**: `STATE_MANAGEMENT.md` for detailed store documentation

---

## Technology Stack

### Core Technologies

- **React 18+**: Component framework
- **Next.js 14+**: Application framework
- **TypeScript**: Type safety
- **Zustand**: State management
- **Tailwind CSS**: Styling

### Drag & Drop

- **@dnd-kit/react**: React DnD integration
- **@dnd-kit/dom**: DOM manipulation
- **@dnd-kit/abstract**: Core abstractions

### UI Libraries

- **Framer Motion**: Animations
- **Radix UI**: Accessible components
- **Lucide React**: Icons
- **Sonner**: Toast notifications

### Utilities

- **uuid**: Unique ID generation
- **use-debounce**: Debounced callbacks
- **axios**: HTTP requests

---

## Key Concepts

### Component Instance

Every component on a page is an instance with:

```typescript
{
  id: "uuid-v4",              // Unique identifier
  type: "hero",               // Component type
  name: "Hero",               // Display name
  componentName: "hero1",     // Variant name
  data: {...},                // Component data
  layout: {                   // Position info
    row: 0,
    col: 0,
    span: 2
  }
}
```

### Component Data

Component-specific configuration stored in `data` property:

```typescript
{
  visible: true,
  content: {
    title: "Welcome",
    subtitle: "...",
  },
  colors: {
    background: "#FFFFFF",
  },
  layout: {
    padding: "16px",
  },
  // ... component-specific fields
}
```

### Global vs Page Components

- **Global Components**: Header and Footer - shared across ALL pages
  - Stored in `globalComponentsData.header` and `globalComponentsData.footer`
  - Edited with special ID: `"global-header"` or `"global-footer"`
  - Not included in `pageComponentsByPage`
- **Page Components**: Unique to each page
  - Stored in `pageComponentsByPage[slug]`
  - Each has unique UUID
  - Can be moved, deleted, themed independently

### Store Synchronization

The system maintains synchronization between:

1. **Local Component State**: React useState in LiveEditor
2. **Component Type States**: heroStates, headerStates, etc. in editorStore
3. **Page Components By Page**: Aggregated page data in editorStore
4. **Temp Data**: Temporary editing state in editorStore
5. **Database**: Persisted data on server

**Critical Rule**: All updates must propagate through ALL relevant stores to maintain consistency.

---

## Typical User Flow

### Adding a New Component

```
1. User clicks "Components" sidebar
2. User drags component from sidebar
3. User drops in page area
4. handleAddComponent() creates new instance with UUID
5. Component added to pageComponents state
6. editorStore.ensureComponentVariant() initializes store
7. Component renders in iframe with default data
8. User can click "Edit" to customize
```

### Editing a Component

```
1. User clicks component in iframe
2. handleEditClick() triggered with component ID
3. selectedComponentId state updated
4. EditorSidebar opens with component data
5. User changes fields (title, colors, etc.)
6. updateByPath() updates tempData in editorStore
7. Component re-renders in iframe with new data
8. User clicks "Save Changes"
9. handleSave() merges tempData into component states
10. editorStore.setComponentData() persists to store
11. EditorSidebar closes
```

### Saving to Database

```
1. User makes changes (hasChangesMade = true)
2. Dialog shown: "Changes not saved"
3. User clicks "Publish" or "Save" in app header
4. editorStore.openSaveDialogFn() triggered
5. SaveConfirmationDialog opens
6. User confirms save
7. Payload created:
   {
     tenantId: "...",
     pages: pageComponentsByPage,
     globalComponentsData: { header, footer }
   }
8. POST to /v1/tenant-website/save-pages
9. Database updated
10. hasChangesMade reset to false
```

---

## Component Lifecycle

### 1. **Initialization**

```typescript
// In component file (e.g., hero1.tsx)
useEffect(() => {
  if (props.useStore) {
    const initialData = {
      ...getDefaultHeroData(), // Default values
      ...props, // Props override
    };
    ensureComponentVariant("hero", uniqueId, initialData);
  }
}, [uniqueId, props.useStore]);
```

### 2. **Data Fetching**

```typescript
// In LiveEditorEffects.tsx
useEffect(() => {
  if (tenantId) {
    fetchTenantData(tenantId); // Load from API
  }
}, [tenantId]);

useEffect(() => {
  if (tenantData && !initialized) {
    editorStore.loadFromDatabase(tenantData); // Populate stores
    setInitialized(true);
  }
}, [tenantData, initialized]);
```

### 3. **Rendering**

```typescript
// In LiveEditorUI.tsx
{pageComponents.map((component) => {
  const storeData = useEditorStore.getState()
    .getComponentData(component.type, component.id);

  const mergedData = storeData || component.data;

  return (
    <CachedComponent
      key={component.id}
      componentName={component.componentName}
      data={{ ...mergedData, useStore: true, variant: component.id }}
    />
  );
})}
```

### 4. **Editing**

```typescript
// When user edits in EditorSidebar
updateComponentByPath(
  selectedComponent.type,
  selectedComponent.id,
  "content.title",
  "New Title",
);

// This triggers:
// 1. Update in component type state (e.g., heroStates)
// 2. Update in tempData
// 3. Update in pageComponentsByPage
// 4. Re-render in iframe
```

### 5. **Persistence**

```typescript
// On save
handleSave() {
  const mergedData = deepMerge(
    existingData,
    storeData,
    tempData
  );

  store.setComponentData(type, id, mergedData);
  store.forceUpdatePageComponents(slug, updatedComponents);
  onComponentUpdate(id, mergedData);
}
```

---

## Key Features Explained

### Real-Time Preview with iframe

**Why iframe?**

- Isolated rendering environment
- Prevents style conflicts with editor UI
- Simulates actual website environment
- Allows responsive preview

**How it works**:

1. AutoFrame creates iframe with empty HTML
2. copyStylesToIframe() copies all stylesheets from parent window
3. CSS variables synchronized every 1 second
4. React components rendered via createPortal()
5. Changes instantly visible in iframe

**Implementation**:

```typescript
<AutoFrame
  frameRef={iframeRef}
  onReady={() => setIframeReady(true)}
>
  {iframeContent}
</AutoFrame>

// Inside AutoFrame:
useEffect(() => {
  if (frameRef.current && loaded) {
    const doc = frameRef.current.contentDocument;
    copyStylesToIframe(doc);
    observeStyleChanges(doc);
    updateCSSVariables(doc);
  }
}, [frameRef, loaded]);
```

### Component Structure System

Each component type has a **structure definition** in `componentsStructure/`:

```typescript
// Example: heroStructure
export const heroStructure: ComponentStructure = {
  componentType: "hero",
  variants: [
    {
      id: "hero1",
      name: "Hero with Search Form",
      fields: [
        {
          key: "visible",
          label: "Visible",
          type: "boolean"
        },
        {
          key: "content.title",
          label: "Title",
          type: "text"
        },
        // ... more fields
      ],
      simpleFields: [
        // Subset of fields for "Simple" mode
      ]
    },
    {
      id: "hero2",
      name: "Hero Banner Only",
      fields: [...]
    }
  ]
};
```

**Structure defines**:

- Available variants
- Editable fields per variant
- Field types and validation
- Simple vs Advanced mode fields

### Store Functions Pattern

Each component type has dedicated functions:

```typescript
// In editorStoreFunctions/heroFunctions.ts
export const heroFunctions = {
  ensureVariant: (state, variantId, initial?) => {
    // Ensure component exists in store
    // Return new state with initialized data
  },

  getData: (state, variantId) => {
    // Retrieve component data
    // Return data or empty object
  },

  setData: (state, variantId, data) => {
    // Set/replace component data
    // Return new state
  },

  updateByPath: (state, variantId, path, value) => {
    // Update specific field via path
    // Return new state with updated data
  },
};
```

**Benefits**:

- Modular and maintainable
- Consistent API across all components
- Easy to add new component types
- Supports component-specific logic

---

## Critical Identifiers

### component.id (UUID)

- **Purpose**: Unique identifier for each component INSTANCE
- **Format**: UUID v4 (e.g., `"3f4a8b2c-..."`)
- **Usage**:
  - Key in React lists
  - Store lookups: `getComponentData(type, id)`
  - Update targeting: `updateComponentByPath(type, id, path, value)`
- **Critical**: This is the PRIMARY identifier for all operations

### component.type

- **Purpose**: Component category/type
- **Format**: camelCase string (e.g., `"hero"`, `"halfTextHalfImage"`)
- **Usage**:
  - Determines which store to use (`heroStates`, `halfTextHalfImageStates`)
  - Routes to component functions (`heroFunctions`, `halfTextHalfImageFunctions`)
  - Lookup in ComponentsList

### component.componentName

- **Purpose**: Specific variant/theme identifier
- **Format**: type + number (e.g., `"hero1"`, `"hero2"`, `"halfTextHalfImage3"`)
- **Usage**:
  - Determines which React component to render
  - Selects default data function (getDefaultHeroData vs getDefaultHero2Data)
  - Displayed in UI as theme name

---

## Navigation and Layout

### Layout Structure

The Live Editor uses a layout wrapper (`app/live-editor/layout.tsx`) that provides:

#### EditorNavBar Component

Main navigation bar with responsive design:

**Desktop View (≥ 768px)**:

- **Back to Dashboard Button**: Located at the far left, provides navigation back to `/dashboard`
  - Icon: Left arrow with smooth hover animation
  - Text: Localized "Dashboard" label
  - Hover effect: Arrow slides left on hover
- **Editor Title**: "Live Website Editor" with tenant ID
- **Pages Navigation**: Either dropdown (5+ pages) or inline links (< 5 pages)
- **Action Buttons**: Save Changes, Add Page, Preview, Live Preview, Language Switcher

**Mobile View (< 768px)**:

- **Row 1**:
  - Back to Dashboard button (left)
  - Editor Title (center)
  - Spacer for balance (right)
- **Row 2**:
  - Pages dropdown
  - Save button
  - Language switcher
  - Actions dropdown menu

**Features**:

- Fully responsive across all breakpoints
- Multilingual support (AR/EN) via i18n
- Sticky positioning (`sticky top-0 z-[51]`)
- Visual feedback for unsaved changes (pulsing Save button)
- Smooth transitions and hover effects

**Translation Keys**:

- `editor.title`: "Live Website Editor" / "محرر الموقع المباشر"
- `editor.dashboard`: "Dashboard" / "لوحة التحكم"
- `editor.back_to_dashboard`: "Back to Dashboard" / "العودة إلى لوحة التحكم"
- `editor.save_changes`: "Save Changes" / "حفظ التغييرات"
- `editor.add_page`: "Add Page" / "إضافة صفحة"

---

## File Organization

```
app/live-editor/
└── layout.tsx                        # Main layout wrapper with navigation

components/tenant/live-editor/
├── LiveEditor.tsx                    # Main orchestrator
├── LiveEditorUI.tsx                  # UI rendering
├── LiveEditorHooks.tsx               # State management
├── LiveEditorEffects.tsx             # Side effects
├── LiveEditorHandlers.tsx            # Event handlers
├── ThemeSelector.tsx                 # Component theme picker
├── PageThemeSelector.tsx             # Page theme picker
├── CardThemeSelector.tsx             # Card theme picker
├── ResetConfirmDialog.tsx            # Reset confirmation
├── LanguageDropdown.tsx              # Language switcher
└── EditorSidebar/                    # Sidebar module
    ├── index.tsx
    ├── constants.ts
    ├── utils.ts
    ├── types.ts
    └── components/
        ├── AdvancedSimpleSwitcher.tsx
        ├── DynamicFieldsRenderer.tsx
        └── FieldRenderers/
            ├── ArrayFieldRenderer.tsx
            ├── ObjectFieldRenderer.tsx
            └── BackgroundFieldRenderer.tsx

context-liveeditor/
├── editorStore.ts                    # Main Zustand store
├── tenantStore.jsx                   # Tenant data store
├── editorI18nStore.ts                # i18n translations
└── editorStoreFunctions/             # Component functions
    ├── types.ts
    ├── heroFunctions.ts
    ├── headerFunctions.ts
    ├── halfTextHalfImageFunctions.ts
    └── ... (one file per component type)

lib-liveeditor/
├── ComponentsList.tsx                # Central component registry
├── types.ts                          # TypeScript types
└── debugLogger.ts                    # Debug utilities

componentsStructure/
├── types.ts                          # Structure type definitions
├── hero.ts                           # Hero structure
├── header.ts                         # Header structure
├── halfTextHalfImage.ts              # Half text half image structure
└── ... (one file per component type)

services-liveeditor/live-editor/
├── dragDrop/
│   ├── EnhancedLiveEditorDragDropContext.tsx
│   ├── DraggableComponent.tsx
│   ├── LiveEditorDropZone.tsx
│   └── enhanced-position-tracker.ts
└── ... (other services)
```

---

## Important Notes for AI

### When Reading Code

1. **Component.id is ALWAYS the unique identifier** - not componentName
2. **componentName determines WHICH variant to render** - e.g., hero1 vs hero2
3. **type determines WHICH store functions to use** - e.g., heroFunctions vs headerFunctions
4. **tempData is for EDITING** - final data goes to component states
5. **pageComponentsByPage is the SOURCE OF TRUTH** for what's on each page

### When Making Changes

1. **Always update ALL relevant stores** (component state + pageComponentsByPage)
2. **Use setTimeout(() => {...}, 0)** when updating store from event handlers (prevents render cycles)
3. **Deep merge when combining data** (use deepMerge function, not spread)
4. **Validate paths** before using in updateByPath
5. **Check for global components** (global-header, global-footer) with special handling

### Common Patterns

**Pattern 1: Add new component type**

```typescript
// 1. Add to ComponentsList.tsx
// 2. Create structure in componentsStructure/
// 3. Create functions in editorStoreFunctions/
// 4. Add to editorStore.ts switches
// 5. Create React component in components/tenant/
```

**Pattern 2: Update component data**

```typescript
// ALWAYS use component.id, not componentName
store.updateComponentByPath(
  component.type, // e.g., "hero"
  component.id, // UUID (NOT componentName!)
  "content.title", // path
  "New Title", // value
);
```

**Pattern 3: Handle global components**

```typescript
if (selectedComponent.id === "global-header") {
  updateGlobalComponentByPath("header", path, value);
} else if (selectedComponent.id === "global-footer") {
  updateGlobalComponentByPath("footer", path, value);
} else {
  updateComponentByPath(type, id, path, value);
}
```

---

## Next Steps

For detailed information on specific subsystems:

- **State Management**: See `STATE_MANAGEMENT.md`
- **Data Flow**: See `DATA_FLOW.md`
- **EditorSidebar**: See `editorSidebar/OVERVIEW.md`
- **Drag & Drop**: See `DRAG_DROP_SYSTEM.md`
- **iframe System**: See `IFRAME_SYSTEM.md`
- **Component Architecture**: See `COMPONENT_ARCHITECTURE.md`
