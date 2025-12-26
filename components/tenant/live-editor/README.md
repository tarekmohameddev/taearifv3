# Live Editor System - Complete Documentation

## 📋 Overview

This directory contains the complete Live Editor system for building and editing websites dynamically. The system is built with React, TypeScript, Zustand for state management, and uses a component-based architecture.

## 📁 Directory Structure

```
components/tenant/live-editor/
├── README.md                          # This file - Complete documentation
├── LiveEditor.tsx                     # Main entry point component
├── LiveEditorHooks.tsx                # State and computed hooks
├── LiveEditorEffects.tsx               # Side effects and data loading
├── LiveEditorHandlers.tsx              # Event handlers
├── LiveEditorUI/                      # Main UI component (modular structure)
│   ├── index.tsx                      # Main component (~476 lines)
│   ├── types.ts                       # TypeScript types & interfaces
│   ├── constants.ts                   # Constants (device dimensions, maps)
│   ├── componentLoaders.ts            # Header/Footer component loaders
│   ├── AutoFrame/
│   │   └── AutoFrame.tsx             # Iframe wrapper component
│   ├── hooks/
│   │   ├── useStaticPageDetection.ts # Static page detection
│   │   ├── useGlobalComponents.ts    # Global header/footer logic
│   │   ├── useBackendDataState.ts    # Backend data state management
│   │   ├── useDeviceManagement.ts    # Device selection & dimensions
│   │   └── useComponentHandlers.ts   # Component event handlers
│   └── components/
│       ├── LiveEditorHeader.tsx      # Header toolbar UI
│       ├── LiveEditorIframeContent.tsx # Iframe content rendering
│       ├── Dialogs/
│       │   ├── DeleteComponentDialog.tsx
│       │   ├── DeletePageDialog.tsx
│       │   └── ChangesMadeDialog.tsx
│       └── DebugPanel.tsx            # Debug panel component
├── EditorSidebar/                     # Sidebar for editing components
├── ComponentsSidebar/                 # Sidebar for adding components
└── debug/                             # Debug utilities
```

## 🏗️ Architecture Overview

### Component Hierarchy

```
LiveEditor (Main Entry)
  └── LiveEditorUI
      ├── ComponentsSidebar (Left)
      ├── Main Content Area
      │   ├── LiveEditorHeader (Toolbar)
      │   └── AutoFrame
      │       └── LiveEditorIframeContent
      │           ├── Global Header
      │           ├── Page Components (Draggable)
      │           └── Global Footer
      └── EditorSidebar (Right)
```

### Data Flow

```
User Action
  ↓
LiveEditorHandlers (Event Handlers)
  ↓
LiveEditorHooks (State Updates)
  ↓
LiveEditorEffects (Side Effects)
  ↓
editorStore (Zustand Store)
  ↓
LiveEditorUI (Re-render)
  ↓
Iframe Content (Visual Update)
```

## 📦 Core Components

### 1. LiveEditor.tsx
**Purpose:** Main entry point that orchestrates all parts of the Live Editor.

**Responsibilities:**
- Initializes state using `useLiveEditorState`
- Computes derived values using `useLiveEditorComputed`
- Sets up event handlers using `useLiveEditorHandlers`
- Manages side effects using `useLiveEditorEffects`
- Renders `LiveEditorUI` component

**Key Exports:**
- `default LiveEditor` - Main component

### 2. LiveEditorUI/index.tsx
**Purpose:** Main UI component that renders the editor interface.

**Responsibilities:**
- Manages UI state (sidebar, dialogs, debug panel)
- Coordinates between ComponentsSidebar, EditorSidebar, and iframe
- Handles device switching (phone/tablet/laptop)
- Manages drag & drop context
- Renders all dialogs and debug panels

**Key Features:**
- Responsive layout with animated sidebars
- Device preview (phone/tablet/laptop)
- Component drag & drop
- Real-time editing
- Debug tools (development only)

**Dependencies:**
- All hooks from `hooks/` directory
- All UI components from `components/` directory
- `AutoFrame` for iframe rendering

### 3. LiveEditorHooks.tsx
**Purpose:** Manages state and computed values.

**Exports:**
- `useLiveEditorState()` - Main state hook
- `useLiveEditorComputed(state)` - Computed values hook

**State Includes:**
- `pageComponents` - Array of components on current page
- `selectedComponentId` - Currently selected component
- `sidebarOpen` - Sidebar visibility
- `sidebarView` - Current sidebar view (edit-component, add-section, etc.)
- `deleteDialogOpen` - Delete confirmation dialog state
- `deletePageDialogOpen` - Delete page confirmation dialog state
- And more...

**Computed Values:**
- `selectedComponent` - Currently selected component object
- `pageTitle` - Current page title
- `isPredefinedPage` - Whether current page is predefined

### 4. LiveEditorEffects.tsx
**Purpose:** Manages side effects and data synchronization.

**Key Responsibilities:**
- Loads tenant data from database
- Syncs page components with editorStore
- Handles static pages (project, property)
- Prioritizes data sources (store vs database)
- Forces updates after theme changes
- Manages component initialization

**Important Logic:**
- **Static Pages Priority:** After theme change, prioritizes `staticPagesData` from store over `tenantData.StaticPages`
- **Theme Change Detection:** Uses `themeChangeTimestamp` to detect recent theme changes
- **Data Loading Order:**
  1. Check if page is static
  2. If theme recently changed, use `staticPagesData` from store
  3. Otherwise, load from `tenantData.StaticPages` or `pageComponentsByPage`

### 5. LiveEditorHandlers.tsx
**Purpose:** Event handlers for user actions.

**Key Handlers:**
- `handleEditClick(id)` - Opens sidebar to edit component
- `handleDeleteClick(id)` - Opens delete confirmation dialog
- `handleAddComponent(data)` - Adds new component to page
- `handleMoveComponent(...)` - Moves component via drag & drop
- `handleComponentUpdate(id, data)` - Updates component data
- `handleComponentThemeChange(id, newTheme)` - Changes component theme
- `handleDeletePage()` - Deletes current page
- `handlePageThemeChange(themeNumber)` - Changes entire page theme
- And more...

## 🎣 Custom Hooks (LiveEditorUI/hooks/)

### useStaticPageDetection
**Purpose:** Detects if current page is a static page.

**Returns:** `boolean` - `true` if page is static

**Static Pages:**
- `"project"` - Project detail page
- `"property"` - Property detail page
- Any page with data in `staticPagesData`

### useGlobalComponents
**Purpose:** Manages global header and footer components.

**Returns:**
```typescript
{
  globalHeaderVariant: string;
  globalFooterVariant: string;
  HeaderComponent: React.ComponentType;
  FooterComponent: React.ComponentType;
  globalHeaderData: any;
  globalFooterData: any;
}
```

**Key Logic:**
- Prioritizes store variant after theme change
- Falls back to tenantData for initial load
- Loads components dynamically based on variant
- Initializes default data if missing

### useBackendDataState
**Purpose:** Manages merged component data for iframe rendering.

**Returns:**
```typescript
{
  backendDataState: {
    componentsWithMergedData: Array<Component>;
    globalHeaderData: any;
    globalFooterData: any;
  };
  setBackendDataState: (state) => void;
}
```

**Key Logic:**
- Merges component data from store and props
- For static pages, syncs `id` and `componentName` from `staticPagesData`
- Filters out header/footer components (rendered separately)
- Updates when theme changes or components change

### useDeviceManagement
**Purpose:** Manages device selection and dimensions.

**Returns:**
```typescript
{
  selectedDevice: DeviceType; // "phone" | "tablet" | "laptop"
  setSelectedDevice: (device) => void;
  handleDeviceChange: (device) => void;
  deviceDimensions: DeviceDimensions;
  screenWidth: number;
}
```

**Features:**
- Tracks screen width for responsive behavior
- Forces component re-render when device changes
- Updates components that need device-specific rendering

### useComponentHandlers
**Purpose:** Component event handlers (add, move, reset positions).

**Returns:**
```typescript
{
  handleAddComponent: (data) => void;
  handleMoveComponent: (...) => void;
  handlePositionDebug: (info) => void;
  handleResetPositions: () => void;
  getComponentNameWithOne: (type) => string;
}
```

**Features:**
- Adds components with proper initialization
- Moves components with position tracking
- Validates positions after moves
- Resets all component positions

## 🎨 UI Components (LiveEditorUI/components/)

### LiveEditorHeader
**Purpose:** Toolbar at top of editor.

**Features:**
- Components sidebar toggle
- Device preview controls (phone/tablet/laptop)
- Action buttons (settings, add section, delete page)
- Debug toggle (development only)
- Responsive layout (desktop/mobile)

### LiveEditorIframeContent
**Purpose:** Renders content inside iframe.

**Structure:**
```
- Global Header (clickable for editing)
- Drop Zone (for drag & drop)
  - Page Components (draggable, editable)
- Global Footer (clickable for editing)
```

**Features:**
- Responsive layout based on selected device
- Click handlers for editing header/footer
- Component rendering with merged data
- Animation support (framer-motion)

### Dialogs
**DeleteComponentDialog:** Confirms component deletion
**DeletePageDialog:** Confirms page deletion (with confirmation text)
**ChangesMadeDialog:** Notifies user of unsaved changes

### DebugPanel
**Purpose:** Development tool for debugging component positions.

**Features:**
- Position validation
- Changes status
- Current components list
- Last move operation details
- Quick actions (reset, toggle logging, etc.)

## 🔧 Utilities

### componentLoaders.ts
**Purpose:** Dynamically loads header and footer components.

**Functions:**
- `loadHeaderComponent(componentName)` - Loads header component with caching
- `loadFooterComponent(componentName)` - Loads footer component with caching

**Caching:** Uses `Map` to cache loaded components for performance.

**Loading Strategy:**
1. Check cache first
2. Handle special cases (StaticHeader1, StaticFooter1)
3. Try direct import for known components
4. Fallback to dynamic import

### AutoFrame/AutoFrame.tsx
**Purpose:** Wraps iframe and handles style copying.

**Features:**
- Copies all styles from parent to iframe
- Copies CSS variables
- Observes style changes
- Forces RTL direction
- Creates portal for React content

## 🔄 State Management

### EditorStore (Zustand)
**Location:** `context-liveeditor/editorStore.ts`

**Key State:**
- `pageComponentsByPage` - Components for each page
- `staticPagesData` - Static page components
- `globalHeaderData` - Global header data
- `globalFooterData` - Global footer data
- `globalHeaderVariant` - Header variant name
- `globalFooterVariant` - Footer variant name
- `themeChangeTimestamp` - Timestamp of last theme change
- `hasChangesMade` - Whether there are unsaved changes

**Key Actions:**
- `setPageComponents(page, components)` - Updates page components
- `setStaticPageData(slug, data)` - Updates static page data
- `getComponentData(type, id)` - Gets component data
- `setComponentData(type, id, data)` - Sets component data
- `setCurrentTheme(themeNumber)` - Changes current theme

### TenantStore (Zustand)
**Location:** `context-liveeditor/tenantStore.ts`

**Key State:**
- `tenantData` - Complete tenant data from database
- Includes: `componentSettings`, `globalComponentsData`, `StaticPages`

## 📝 Key Concepts

### Static Pages
Static pages are special pages with fixed API endpoints (e.g., `/project/[id]`, `/property/[id]`).

**Characteristics:**
- Have components stored in `staticPagesData`
- Components have `id` matching `componentName`
- Theme changes affect component variants (e.g., `projectDetails1` → `projectDetails2`)
- Data is loaded with priority from store after theme changes

### Component Data Merging
Component data is merged from multiple sources:

1. **Default Data** - From component structure
2. **Props Data** - From `pageComponents` array
3. **Store Data** - From `editorStore` (highest priority)

**For Static Pages:**
- `id` and `componentName` are synced from `staticPagesData`
- Ensures consistency after theme changes

### Theme Changes
When theme changes:

1. `themeChangeTimestamp` is updated
2. `staticPagesData` is updated with new component variants
3. Component states are updated with new `id` and `componentName`
4. `forceUpdate` is added to trigger re-renders
5. `LiveEditorEffects` prioritizes store data over database data

### Drag & Drop
Uses `EnhancedLiveEditorDragDropContext` for drag & drop:

- Tracks component positions
- Validates positions after moves
- Provides debug information
- Handles zone-based dropping

## 🚀 Adding New Features

### Adding a New Component Type

1. **Create Component Files:**
   - `components/tenant/{componentType}/{componentType}1.tsx`
   - `context-liveeditor/editorStoreFunctions/{componentType}Functions.ts`
   - `componentsStructure/{componentType}.ts`

2. **Register Component:**
   - Add to `lib-liveeditor/ComponentsList.tsx`
   - Export in `componentsStructure/index.ts`
   - Export functions in `context-liveeditor/editorStoreFunctions/index.ts`

3. **Update EditorStore:**
   - Add switch cases in `editorStore.ts` for component operations

### Adding a New Dialog

1. Create component in `LiveEditorUI/components/Dialogs/`
2. Add state in `LiveEditorUI/index.tsx`
3. Add handler in `LiveEditorHandlers.tsx`
4. Render dialog in `LiveEditorUI/index.tsx`

### Adding a New Hook

1. Create file in `LiveEditorUI/hooks/`
2. Export hook function
3. Import and use in `LiveEditorUI/index.tsx`

## 🐛 Debugging

### Debug Panel
Enable in development mode:
- Click debug button in header
- View position validation
- Check component list
- See last move operation

### Console Logs
Key log prefixes:
- `[LiveEditorUI]` - Main UI component
- `[LiveEditorEffects]` - Side effects
- `[Header Component]` - Header loading
- `[Footer Component]` - Footer loading

### Common Issues

**Components not updating:**
- Check `themeChangeTimestamp` - may need force update
- Verify `staticPagesData` is updated for static pages
- Check component `id` matches `componentName` for static pages

**Theme not changing:**
- Verify `setCurrentTheme` is called
- Check `staticPagesData` is updated
- Ensure `forceUpdate` is added to components

**Sidebar not opening:**
- Check `sidebarOpen` state
- Verify `setSidebarView` is called
- Check `sidebarWidth` is set

## 📚 Related Documentation

- `docs/important/liveEditor/` - Complete Live Editor documentation
- `docs/important/components/` - Component system documentation
- `docs/important/liveEditor/caching/` - State management documentation

## 🔗 Key Files Reference

- **State Management:** `context-liveeditor/editorStore.ts`
- **Theme Changes:** `services-liveeditor/live-editor/themeChangeService.ts`
- **Drag & Drop:** `services-liveeditor/live-editor/dragDrop/`
- **Component Loading:** `lib-liveeditor/ComponentsList.tsx`
- **Component Structures:** `componentsStructure/`

## 💡 Best Practices

1. **Always use hooks** - Don't access store directly in components
2. **Merge data properly** - Use `mergedData` from `useBackendDataState`
3. **Handle static pages** - Check `isStaticPage` before operations
4. **Update both stores** - Update `pageComponentsByPage` and component states
5. **Use forceUpdate** - Add `forceUpdate: Date.now()` when forcing re-renders
6. **Sync id and componentName** - For static pages, ensure they match
7. **Prioritize store data** - After theme changes, use store data over database

## 🎯 Quick Reference

### Get Component Data
```typescript
const store = useEditorStore.getState();
const data = store.getComponentData(componentType, componentId);
```

### Update Component Data
```typescript
const store = useEditorStore.getState();
store.setComponentData(componentType, componentId, newData);
```

### Check if Static Page
```typescript
const isStatic = useStaticPageDetection(slug);
```

### Get Global Components
```typescript
const { HeaderComponent, FooterComponent } = useGlobalComponents();
```

### Add Component
```typescript
handleAddComponent({
  type: "hero",
  zone: "root",
  index: 0,
  variant: "hero1"
});
```

---

**Last Updated:** 2025-12-26
**Maintainer:** AI Assistant
**Version:** 2.0 (Modular Structure)

