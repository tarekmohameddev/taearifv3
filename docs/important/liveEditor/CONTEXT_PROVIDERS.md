# Context Providers and Integration

## Table of Contents
1. [Overview](#overview)
2. [Provider Hierarchy](#provider-hierarchy)
3. [Context Providers](#context-providers)
4. [Zustand Stores vs React Context](#zustand-stores-vs-react-context)
5. [Provider Wrappers](#provider-wrappers)
6. [DragDrop Context System](#dragdrop-context-system)
7. [Integration Flow](#integration-flow)

---

## Overview

The Live Editor uses a **hybrid approach** combining:
- **Zustand stores**: For state management (editorStore, tenantStore, i18nStore)
- **React Context**: For component tree integration and dependency injection
- **Custom providers**: For specific functionality (DragDrop, Editor, Auth)

### Why Hybrid Approach?

**Zustand Advantages**:
- ✅ No provider wrapper needed
- ✅ Less boilerplate
- ✅ Better performance (selective subscriptions)
- ✅ DevTools support

**React Context Advantages**:
- ✅ Tree-scoped data
- ✅ Dependency injection
- ✅ Integration with third-party libraries
- ✅ Component lifecycle coupling

**Best of Both**: Use Zustand for global state, Context for tree-scoped features

---

## Provider Hierarchy

### Complete Provider Tree

```
app/live-editor/layout.tsx (Root)
│
├─ I18nProvider
│  │  Purpose: i18n translations
│  │  Scope: Entire Live Editor
│  │
│  └─ AuthProvider
│     │  Purpose: User authentication
│     │  Scope: Access control, user data
│     │
│     └─ EditorProvider
│        │  Purpose: Save dialog management
│        │  Scope: Save operations
│        │
│        └─ [Live Editor Content]
│           │
│           ├─ EnhancedLiveEditorDragDropContext
│           │  │  Purpose: Drag & drop functionality
│           │  │  Scope: Page components area
│           │  │
│           │  └─ ZoneStoreProvider
│           │     │  Purpose: Drop zone tracking
│           │     │
│           │     └─ DropZoneProvider
│           │        └─ [Components in iframe]
│           │
│           └─ [Rest of UI]
```

### Visual Representation

```
┌─────────────────────────────────────────────────────────────┐
│                     I18nProvider                             │
│  Provides: Translation functions, locale management         │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   AuthProvider                         │ │
│  │  Provides: User data, authentication functions        │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │               EditorProvider                     │ │ │
│  │  │  Provides: Save dialog, save confirmation       │ │ │
│  │  │                                                  │ │ │
│  │  │  ┌────────────────────────────────────────────┐ │ │ │
│  │  │  │        LiveEditor Component              │ │ │ │
│  │  │  │                                           │ │ │ │
│  │  │  │  ┌─────────────────────────────────────┐ │ │ │ │
│  │  │  │  │  EnhancedLiveEditorDragDropContext│ │ │ │ │
│  │  │  │  │  - DragDropProvider              │ │ │ │ │
│  │  │  │  │  - ZoneStoreProvider             │ │ │ │ │
│  │  │  │  │  - DropZoneProvider              │ │ │ │ │
│  │  │  │  └─────────────────────────────────────┘ │ │ │ │
│  │  │  │                                           │ │ │ │
│  │  │  └────────────────────────────────────────────┘ │ │ │
│  │  │                                                  │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Context Providers

### 1. I18nProvider

**Location**: `components/providers/I18nProvider.tsx`

**Purpose**: Provide internationalization context

**Implementation** (Simplified):
```typescript
import { createContext, useContext } from "react";
import { useEditorI18nStore } from "@/context-liveeditor/editorI18nStore";

const I18nContext = createContext(undefined);

export function I18nProvider({ children }) {
  const { locale, setLocale, t } = useEditorI18nStore();
  
  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
};
```

**What it provides**:
- `locale`: Current language ("ar" or "en")
- `setLocale`: Change language function
- `t`: Translation function

**Used in**:
- Language switchers
- Translated component labels
- UI text throughout editor

---

### 2. AuthProvider

**Location**: `context/AuthContext.js`

**Purpose**: Provide authentication context

**Implementation**:
```typescript
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/users/login", {
        email,
        password
      });
      
      const userData = response.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      toast.success("تم تسجيل الدخول بنجاح!");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "فشل تسجيل الدخول";
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      await axios.post("/api/users/logout");
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      setLoading(false);
    }
  };
  
  const fetchUser = async (username) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/users/fetchUsername", {
        username
      });
      
      const userData = response.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || "فشل تحميل البيانات");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      register,
      logout,
      fetchUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
```

**What it provides**:
- `user`: Current user data
- `loading`: Authentication loading state
- `error`: Authentication errors
- `login`: Login function
- `register`: Register function
- `logout`: Logout function
- `fetchUser`: Fetch user data function

**Used in**:
- LiveEditorEffects (authentication check)
- EditorProvider (get tenantId)
- Navigation bar (user menu)

---

### 3. EditorProvider

**Location**: `context-liveeditor/EditorProvider.tsx`

**Purpose**: Manage save dialog and save operations

**Implementation**:
```typescript
"use client";
import { ReactNode } from "react";
import toast from "react-hot-toast";
import SaveConfirmationDialog from "@/components/SaveConfirmationDialog";
import { useEditorStore } from "./editorStore";
import useAuthStore from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";

export function EditorProvider({ children }: { children: ReactNode }) {
  // ═══════════════════════════════════════════════════════════
  // CONNECT TO STORES
  // ═══════════════════════════════════════════════════════════
  const { showDialog, closeDialog, openSaveDialogFn } = useEditorStore();
  const { userData } = useAuthStore();
  
  const tenantId = userData?.username;
  
  // ═══════════════════════════════════════════════════════════
  // SAVE CONFIRMATION HANDLER
  // ═══════════════════════════════════════════════════════════
  const confirmSave = async () => {
    // STEP 1: Execute page-specific save logic
    openSaveDialogFn();
    
    // STEP 2: Get all data from editorStore
    const state = useEditorStore.getState();
    
    // STEP 3: Build payload
    const payload = {
      tenantId: tenantId || "",
      pages: state.pageComponentsByPage,
      globalComponentsData: state.globalComponentsData,
      WebsiteLayout: state.WebsiteLayout || {
        metaTags: { pages: [] }
      }
    };
    
    // STEP 4: Send to API
    await axiosInstance
      .post("/v1/tenant-website/save-pages", payload)
      .then(() => {
        closeDialog();
        toast.success("Changes saved successfully!");
      })
      .catch((e) => {
        console.error("[Save All] Error:", e);
        closeDialog();
        toast.error(
          e.response?.data?.message || "Failed to save changes"
        );
      });
  };
  
  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <>
      {children}
      <SaveConfirmationDialog
        open={showDialog}
        isThemeConfirmation={false}
        onClose={closeDialog}
        onConfirm={confirmSave}
      />
    </>
  );
}
```

**What it provides**:
- Save confirmation dialog (global)
- Automatic save payload building
- API integration for saves
- Toast notifications

**Used in**:
- App header "Publish" button
- Anywhere requestSave() is called

**Key Integration**:
```typescript
// In app header or anywhere
const { requestSave } = useEditorStore();

<button onClick={() => requestSave()}>
  Publish Changes
</button>

// This triggers:
// 1. showDialog = true
// 2. SaveConfirmationDialog appears
// 3. User confirms
// 4. confirmSave() executes
// 5. API call to save all pages
```

---

### 4. EnhancedLiveEditorDragDropContext

**Location**: `services-liveeditor/live-editor/dragDrop/EnhancedLiveEditorDragDropContext.tsx`

**Purpose**: Provide drag & drop functionality

**Implementation**:
```typescript
import { DragDropProvider } from "@dnd-kit/react";
import { ZoneStoreProvider, DropZoneProvider } from "./zoneContext";

export function EnhancedLiveEditorDragDropContext({
  children,
  components,
  onComponentMove,
  onComponentAdd,
  iframeRef
}) {
  const sensors = useLiveEditorSensors();
  const zoneStore = useMemo(() => createZoneStore(), []);
  
  const [dragListeners, setDragListeners] = useState({});
  
  const handleEnhancedMove = useCallback((
    sourceIndex,
    sourceZone,
    destinationIndex,
    destinationZone
  ) => {
    const result = trackComponentMove(
      components,
      sourceIndex,
      sourceZone,
      destinationIndex,
      destinationZone
    );
    
    if (result.success) {
      onComponentMove?.(
        sourceIndex,
        sourceZone,
        destinationIndex,
        destinationZone,
        result.updatedComponents,
        result.debugInfo
      );
    }
  }, [components, onComponentMove]);
  
  return (
    <dragListenerContext.Provider value={{ dragListeners, setDragListeners }}>
      <DragDropProvider
        sensors={sensors}
        onDragEnd={(event, manager) => {
          // Handle drag end...
          const { source, target } = event.operation;
          
          if (isNewComponent) {
            onComponentAdd?.({
              type: source.data.componentType,
              index: targetIndex,
              zone: targetZone
            });
          } else {
            handleEnhancedMove(
              actualSourceIndex,
              "main",
              targetIndex,
              "main"
            );
          }
          
          manager.dragOperation.reset();
        }}
        onDragStart={(event, manager) => {
          // Handle drag start...
        }}
      >
        <ZoneStoreProvider store={zoneStore}>
          <DropZoneProvider value={nextContextValue}>
            {children}
          </DropZoneProvider>
        </ZoneStoreProvider>
      </DragDropProvider>
    </dragListenerContext.Provider>
  );
}
```

**Nested Providers**:
1. **dragListenerContext**: Manage drag listeners
2. **DragDropProvider**: @dnd-kit main provider
3. **ZoneStoreProvider**: Drop zone state
4. **DropZoneProvider**: Drop zone configuration

**What it provides**:
- Drag & drop functionality
- Drag listeners registry
- Drop zone tracking
- Position calculation
- Move/add callbacks

**Used in**:
- LiveEditorUI (wraps iframe content)
- DraggableComponent (component wrappers)
- DropZone (drop areas)

---

## Zustand Stores vs React Context

### Zustand Stores (Global State)

**Location**: `context-liveeditor/`

```typescript
// editorStore.ts - Created with Zustand
export const useEditorStore = create<EditorStore>((set, get) => ({
  tempData: {},
  heroStates: {},
  pageComponentsByPage: {},
  // ... all state and functions
}));

// Usage: Direct access, no provider needed
import { useEditorStore } from "@/context-liveeditor/editorStore";

function MyComponent() {
  // Subscribe to specific slice
  const tempData = useEditorStore(s => s.tempData);
  
  // Or get entire store
  const store = useEditorStore.getState();
  
  return <div>{tempData.title}</div>;
}
```

**Stores**:
1. **editorStore**: All component states, page management, temp data
2. **tenantStore**: Tenant data, API integration
3. **editorI18nStore**: Locale and translations

**Characteristics**:
- No provider wrapper needed
- Can be accessed from anywhere
- Selective subscriptions (performance)
- Single source of truth

---

### React Context (Tree-Scoped Features)

**Location**: `context/`, `context-liveeditor/`

```typescript
// Create context
const MyContext = createContext(undefined);

// Provider component
export function MyProvider({ children }) {
  const [state, setState] = useState(initialValue);
  
  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  );
}

// Hook for consumption
export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within MyProvider");
  }
  return context;
};

// Usage: Must be inside provider
function MyComponent() {
  const { state, setState } = useMyContext();
  return <div>{state}</div>;
}
```

**Contexts**:
1. **AuthContext**: User authentication
2. **EditorContext** (in EditorProvider): Save dialog
3. **dragListenerContext**: Drag listeners
4. **DropZoneContext**: Drop zone configuration

**Characteristics**:
- Requires provider wrapper
- Scoped to provider tree
- Easier dependency injection
- Component lifecycle integration

---

## Provider Wrappers

### Live Editor Layout Provider Wrapping

**Location**: `app/live-editor/layout.tsx`

```typescript
export default function LiveEditorLayout({ children }) {
  const { setLocale } = useEditorLocale();
  
  // ═══════════════════════════════════════════════════════════
  // RENDER WITH NESTED PROVIDERS
  // ═══════════════════════════════════════════════════════════
  return (
    <I18nProvider>
      <AuthProvider>
        <EditorProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col" dir="ltr">
            {/* Toaster for notifications */}
            <Toaster position="top-center" reverseOrder={false} />
            
            {/* Navigation bar */}
            <EditorNavBar />
            
            {/* Main content area */}
            <main className="flex-1" dir="ltr">
              {children}
            </main>
          </div>
        </EditorProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
```

**Wrapping Order (Outside to Inside)**:
```
I18nProvider
  └─ Provides translations to all children
     └─ AuthProvider
        └─ Provides user authentication to all children
           └─ EditorProvider
              └─ Provides save dialog to all children
                 └─ App content (children)
```

**Why This Order?**
1. **I18n first**: Everything needs translations
2. **Auth second**: Need to check user before anything
3. **Editor third**: Needs auth data (tenantId from user)
4. **Content last**: Can use all providers

---

### Live Editor Component Provider Wrapping

**Location**: `components/tenant/live-editor/LiveEditorUI.tsx`

```typescript
export function LiveEditorUI({ state, computed, handlers }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  return (
    <div className="live-editor-container">
      {/* Components Sidebar */}
      <ComponentsSidebar />
      
      {/* Main editor area with DragDrop */}
      <div className="editor-main">
        <EnhancedLiveEditorDragDropContext
          components={state.pageComponents}
          onComponentMove={handlers.handleDragEndLocal}
          onComponentAdd={handlers.handleAddComponent}
          iframeRef={iframeRef}
        >
          <AutoFrame frameRef={iframeRef}>
            {/* Global Header */}
            <CachedComponent
              componentName="header1"
              data={{
                ...globalHeaderData,
                useStore: true,
                variant: "global-header"
              }}
            />
            
            {/* Page Components */}
            <LiveEditorDropZone zone="root">
              {state.pageComponents.map((component, index) => (
                <LiveEditorDraggableComponent
                  key={component.id}
                  id={component.id}
                  index={index}
                  onEditClick={handlers.handleEditClick}
                  onDeleteClick={handlers.handleDeleteClick}
                >
                  {(ref) => (
                    <div ref={ref}>
                      <CachedComponent
                        componentName={component.componentName}
                        data={{
                          ...mergedData,
                          useStore: true,
                          variant: component.id
                        }}
                      />
                    </div>
                  )}
                </LiveEditorDraggableComponent>
              ))}
            </LiveEditorDropZone>
            
            {/* Global Footer */}
            <CachedComponent
              componentName="footer1"
              data={{
                ...globalFooterData,
                useStore: true,
                variant: "global-footer"
              }}
            />
          </AutoFrame>
        </EnhancedLiveEditorDragDropContext>
      </div>
      
      {/* Editor Sidebar */}
      <EditorSidebar />
    </div>
  );
}
```

---

## DragDrop Context System

### Zone Context Architecture

```
EnhancedLiveEditorDragDropContext
│
├─ dragListenerContext
│  └─ Tracks drag listeners for each draggable
│
├─ DragDropProvider (@dnd-kit)
│  └─ Main drag & drop functionality
│
├─ ZoneStoreProvider
│  └─ Manages drop zone states
│
└─ DropZoneProvider
   └─ Provides zone configuration
```

### ZoneStoreProvider

**Location**: `services-liveeditor/live-editor/dragDrop/zoneContext.tsx`

```typescript
import { create } from "zustand";
import { createContext, useContext } from "react";

// Zone store creation
export const createZoneStore = () => create((set) => ({
  zones: {},
  previews: {},
  
  registerZone: (id, config) => set((state) => ({
    zones: { ...state.zones, [id]: config }
  })),
  
  unregisterZone: (id) => set((state) => {
    const { [id]: removed, ...rest } = state.zones;
    return { zones: rest };
  }),
  
  setPreview: (zoneId, preview) => set((state) => ({
    previews: { ...state.previews, [zoneId]: preview }
  })),
  
  clearPreview: (zoneId) => set((state) => {
    const { [zoneId]: removed, ...rest } = state.previews;
    return { previews: rest };
  })
}));

// Zone store context
const ZoneStoreContext = createContext(null);

export function ZoneStoreProvider({ children, store }) {
  return (
    <ZoneStoreContext.Provider value={store}>
      {children}
    </ZoneStoreContext.Provider>
  );
}

export const useZoneStore = () => {
  const store = useContext(ZoneStoreContext);
  if (!store) {
    throw new Error("useZoneStore must be used within ZoneStoreProvider");
  }
  return store;
};
```

### DropZoneProvider

```typescript
// Drop zone context type
export interface DropZoneContext {
  mode: "edit" | "preview";
  areaId: string;
  depth: number;
}

const DropZoneContext = createContext<DropZoneContext>({
  mode: "edit",
  areaId: "root",
  depth: 0
});

export function DropZoneProvider({ children, value }) {
  return (
    <DropZoneContext.Provider value={value}>
      {children}
    </DropZoneContext.Provider>
  );
}

export const useDropZone = () => {
  return useContext(DropZoneContext);
};
```

**Usage in DropZone**:
```typescript
export function LiveEditorDropZone({ zone, children }) {
  const parentContext = useDropZone();
  const zoneStore = useZoneStore();
  
  // Register zone
  useEffect(() => {
    zoneStore.getState().registerZone(zone, {
      id: zone,
      parentId: parentContext.areaId,
      depth: parentContext.depth + 1
    });
    
    return () => {
      zoneStore.getState().unregisterZone(zone);
    };
  }, [zone]);
  
  const nextContext = {
    mode: parentContext.mode,
    areaId: zone,
    depth: parentContext.depth + 1
  };
  
  return (
    <DropZoneProvider value={nextContext}>
      <div data-dropzone={zone}>
        {children}
      </div>
    </DropZoneProvider>
  );
}
```

---

## Integration Flow

### Complete Context Flow

```
APPLICATION STARTUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: Root Layout Renders
────────────────────────────────────────────────────────────────
app/live-editor/layout.tsx
  ↓
Wraps children with providers:
  <I18nProvider>
    <AuthProvider>
      <EditorProvider>
        {children}
      </EditorProvider>
    </AuthProvider>
  </I18nProvider>


STEP 2: Providers Initialize
────────────────────────────────────────────────────────────────
I18nProvider:
  ├─ Connects to useEditorI18nStore (Zustand)
  ├─ Provides: { locale, setLocale, t }
  └─ Makes available to all children via useI18n()

AuthProvider:
  ├─ Loads user from localStorage
  ├─ Provides: { user, loading, login, logout, ... }
  └─ Makes available to all children via useAuth()

EditorProvider:
  ├─ Connects to useEditorStore (Zustand)
  ├─ Connects to useAuthStore (Zustand)
  ├─ Provides: Save dialog rendering
  └─ Manages save operations


STEP 3: Page Component Renders
────────────────────────────────────────────────────────────────
app/live-editor/[slug]/page.tsx
  ↓
<LiveEditor />


STEP 4: LiveEditor Initializes
────────────────────────────────────────────────────────────────
components/tenant/live-editor/LiveEditor.tsx
  ↓
Uses hooks:
  - useLiveEditorState() → Local state
  - useEditorStore() → Zustand store
  - useAuth() → From AuthProvider ✓
  - useTenantStore() → Zustand store
  - useEditorT() → From I18nProvider ✓


STEP 5: LiveEditorUI Wraps with DragDrop
────────────────────────────────────────────────────────────────
components/tenant/live-editor/LiveEditorUI.tsx
  ↓
<EnhancedLiveEditorDragDropContext>
  <ZoneStoreProvider>
    <DropZoneProvider>
      [iframe content]
    </DropZoneProvider>
  </ZoneStoreProvider>
</EnhancedLiveEditorDragDropContext>


STEP 6: Components Access Context
────────────────────────────────────────────────────────────────
Any child component can now use:
  
  const { user, loading } = useAuth();           ← From AuthProvider
  const { locale, t } = useI18n();               ← From I18nProvider
  const { requestSave } = useEditorStore();      ← Zustand (no provider)
  const tempData = useEditorStore(s => s.tempData);  ← Zustand
  const zoneStore = useZoneStore();              ← From ZoneStoreProvider


RESULT: All contexts available to components ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Context Access Patterns

### Pattern 1: Access Auth Context

```typescript
import { useAuth } from "@/context/AuthContext";

function MyComponent() {
  const { user, loading, login, logout } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;
  
  return (
    <div>
      <p>Welcome, {user.username}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Pattern 2: Access i18n Context

```typescript
import { useEditorT } from "@/context-liveeditor/editorI18nStore";

function MyComponent() {
  const t = useEditorT();
  
  return (
    <div>
      <h1>{t("live_editor.title")}</h1>
      <button>{t("live_editor.save")}</button>
    </div>
  );
}
```

### Pattern 3: Access Zustand Store (No Context Needed)

```typescript
import { useEditorStore } from "@/context-liveeditor/editorStore";

function MyComponent() {
  // Option 1: Subscribe to specific property
  const tempData = useEditorStore(s => s.tempData);
  
  // Option 2: Get store imperatively
  const handleSave = () => {
    const store = useEditorStore.getState();
    store.setComponentData(type, id, data);
  };
  
  return <div>{tempData.title}</div>;
}
```

### Pattern 4: Access DragDrop Context

```typescript
import { useZoneStore, useDropZone } from "@/services-liveeditor/live-editor/dragDrop/zoneContext";

function MyComponent() {
  const zoneStore = useZoneStore();
  const dropZone = useDropZone();
  
  const registerMyZone = () => {
    zoneStore.getState().registerZone("my-zone", {
      id: "my-zone",
      parentId: dropZone.areaId,
      depth: dropZone.depth + 1
    });
  };
  
  return <div>Zone: {dropZone.areaId}</div>;
}
```

---

## EditorProvider Deep Dive

### Save Dialog Management

```
SAVE TRIGGER FLOW:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: User Clicks "Publish" in Nav Bar
────────────────────────────────────────────────────────────────
<button onClick={() => requestSave()}>
  Publish
</button>

// requestSave is from editorStore
const { requestSave } = useEditorStore();


STEP 2: editorStore.requestSave()
────────────────────────────────────────────────────────────────
requestSave: () => set({ showDialog: true })

// This updates editorStore.showDialog to true


STEP 3: EditorProvider Detects showDialog Change
────────────────────────────────────────────────────────────────
const { showDialog, closeDialog, openSaveDialogFn } = useEditorStore();

// showDialog is now true
// EditorProvider re-renders


STEP 4: SaveConfirmationDialog Appears
────────────────────────────────────────────────────────────────
<SaveConfirmationDialog
  open={showDialog}          // ← true
  onClose={closeDialog}
  onConfirm={confirmSave}
/>

// Dialog becomes visible to user


STEP 5: User Confirms Save
────────────────────────────────────────────────────────────────
User clicks "Confirm" button
  ↓
confirmSave() executes


STEP 6: confirmSave Execution
────────────────────────────────────────────────────────────────
const confirmSave = async () => {
  // Call page-specific save function
  openSaveDialogFn();  // Updates store with current page data
  
  // Get all data from store
  const state = useEditorStore.getState();
  
  // Build payload
  const payload = {
    tenantId,
    pages: state.pageComponentsByPage,
    globalComponentsData: state.globalComponentsData,
    WebsiteLayout: state.WebsiteLayout
  };
  
  // Save to API
  await axiosInstance.post("/v1/tenant-website/save-pages", payload);
  
  // Close dialog and show success
  closeDialog();
  toast.success("Changes saved successfully!");
};


RESULT: All pages saved to database ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Save Function Registration

```typescript
// In LiveEditorEffects.tsx
useEffect(() => {
  const saveFn = () => {
    // Force update store with current local state
    const store = useEditorStore.getState();
    store.forceUpdatePageComponents(slug, pageComponents);
  };
  
  // Register save function with editorStore
  useEditorStore.getState().setOpenSaveDialog(saveFn);
  
  // Cleanup on unmount
  return () => {
    useEditorStore.getState().setOpenSaveDialog(() => {});
  };
}, [slug, pageComponents]);
```

**Purpose**: Allows EditorProvider to trigger page-specific save logic before API call

---

## Context vs Store Decision Guide

### Use React Context When:

✅ **Tree-scoped data**: Data only relevant to specific component tree
```typescript
// Example: Drop zone configuration
<DropZoneProvider value={{ mode: "edit", areaId: "root" }}>
  {children}
</DropZoneProvider>
```

✅ **Dependency injection**: Provide implementations to children
```typescript
// Example: Auth implementation
<AuthProvider>
  {/* Children get auth functions */}
</AuthProvider>
```

✅ **Third-party library integration**: Library expects context
```typescript
// Example: @dnd-kit requires DragDropProvider
<DragDropProvider>
  {children}
</DragDropProvider>
```

### Use Zustand Store When:

✅ **Global application state**: Needed throughout app
```typescript
// Example: editorStore
const tempData = useEditorStore(s => s.tempData);
```

✅ **Complex state logic**: Multiple actions and derived state
```typescript
// Example: Component state functions
store.updateComponentByPath(type, id, path, value);
```

✅ **Performance critical**: Need selective subscriptions
```typescript
// Only re-render when tempData changes, not entire store
const tempData = useEditorStore(s => s.tempData);
```

✅ **Outside React tree**: Need to access from utilities
```typescript
// Can access from anywhere
const store = useEditorStore.getState();
store.setComponentData(type, id, data);
```

---

## Integration Points

### Point 1: Layout Providers

```typescript
// app/live-editor/layout.tsx
<I18nProvider>           ← Translations
  <AuthProvider>         ← User authentication
    <EditorProvider>     ← Save dialog
      <LiveEditor />     ← Uses all providers
    </EditorProvider>
  </AuthProvider>
</I18nProvider>
```

### Point 2: DragDrop Providers

```typescript
// LiveEditorUI.tsx
<EnhancedLiveEditorDragDropContext>  ← Drag & drop
  <ZoneStoreProvider>                ← Zone tracking
    <DropZoneProvider>               ← Zone config
      <iframe>                       ← Rendered content
        {components}
      </iframe>
    </DropZoneProvider>
  </ZoneStoreProvider>
</EnhancedLiveEditorDragDropContext>
```

### Point 3: Store Access

```typescript
// Any component in tree
function MyComponent() {
  // Direct Zustand access (no provider)
  const tempData = useEditorStore(s => s.tempData);
  const tenantData = useTenantStore(s => s.tenantData);
  
  // Context access (requires provider)
  const { user } = useAuth();
  const t = useEditorT();
  
  return <div>{user.username} - {t("title")}</div>;
}
```

---

## Important Notes for AI

### Provider Rules

1. **Order matters**: Outer providers can't use inner providers
2. **Error if missing**: useContext throws if provider not found
3. **Zustand needs no provider**: Can be used anywhere
4. **Context is tree-scoped**: Only available to children

### Common Integration Mistakes

❌ **Mistake 1**: Using context outside provider
```typescript
// WRONG - No AuthProvider in tree
function MyComponent() {
  const { user } = useAuth();  // Throws error!
}
```

❌ **Mistake 2**: Wrong provider order
```typescript
// WRONG - EditorProvider needs AuthProvider
<EditorProvider>
  <AuthProvider>  {/* Should be outer! */}
    {children}
  </AuthProvider>
</EditorProvider>
```

❌ **Mistake 3**: Accessing Zustand like Context
```typescript
// WRONG - Zustand doesn't need provider
const MyContext = createContext(useEditorStore);

// CORRECT - Direct access
const data = useEditorStore(s => s.tempData);
```

### Best Practices

✅ **Wrap at appropriate level**: Don't wrap entire app if only needed in section
```typescript
// GOOD - Only wrap Live Editor
<AuthProvider>
  <LiveEditor />
</AuthProvider>

// NOT IDEAL - Wraps entire app unnecessarily
<AuthProvider>
  <App>
    <LiveEditor />  {/* Deep nested */}
  </App>
</AuthProvider>
```

✅ **Use Context for tree-scoped**: Drop zones, mode configuration
✅ **Use Zustand for global**: Component states, page data
✅ **Combine both**: Access Zustand from Context providers (like EditorProvider does)

---

## Summary

The Live Editor context system provides:

1. **I18nProvider**: Translations throughout editor
2. **AuthProvider**: User authentication and data
3. **EditorProvider**: Save dialog and save operations
4. **DragDrop Providers**: Drag & drop functionality
5. **Zustand Stores**: Global state (no providers needed)

**Provider Hierarchy**:
```
I18nProvider
  └─ AuthProvider
     └─ EditorProvider
        └─ Live Editor
           └─ EnhancedLiveEditorDragDropContext
              └─ ZoneStoreProvider
                 └─ DropZoneProvider
                    └─ Components
```

**Key Integration Points**:
- Layout wraps with I18n, Auth, Editor providers
- LiveEditorUI wraps iframe with DragDrop providers
- Components access via hooks (useAuth, useI18n, useEditorStore)
- EditorProvider connects Zustand to React Context for save dialog

**For AI**:
- Understand provider hierarchy
- Know which provider provides what
- Access correctly (Context hooks vs Zustand hooks)
- Follow integration patterns
- Don't confuse Zustand with Context

Understanding this system is essential for:
- Accessing user data
- Triggering save operations
- Implementing drag & drop
- Using translations
- Debugging context issues

