# Common Patterns and Best Practices

## Table of Contents
1. [Component Patterns](#component-patterns)
2. [State Management Patterns](#state-management-patterns)
3. [Update Patterns](#update-patterns)
4. [Render Patterns](#render-patterns)
5. [Error Handling Patterns](#error-handling-patterns)
6. [Performance Patterns](#performance-patterns)

---

## Component Patterns

### Pattern 1: Component with Store Integration

**Standard implementation for any component**:

```typescript
"use client";
import { useEffect } from "react";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { getDefaultHeroData } from "@/context-liveeditor/editorStoreFunctions/heroFunctions";

interface ComponentProps {
  useStore?: boolean;
  variant?: string;
  id?: string;
  [key: string]: any;
}

export default function MyComponent(props: ComponentProps = {}) {
  // ═══════════════════════════════════════════════════════════
  // 1. DETERMINE UNIQUE ID
  // ═══════════════════════════════════════════════════════════
  const variantId = props.variant || "myComponent1";
  const uniqueId = props.id || variantId;
  
  // ═══════════════════════════════════════════════════════════
  // 2. CONNECT TO STORES
  // ═══════════════════════════════════════════════════════════
  const ensureComponentVariant = useEditorStore(s => s.ensureComponentVariant);
  const getComponentData = useEditorStore(s => s.getComponentData);
  const myComponentStates = useEditorStore(s => s.myComponentStates);
  
  const tenantData = useTenantStore(s => s.tenantData);
  
  // ═══════════════════════════════════════════════════════════
  // 3. INITIALIZE IN STORE
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    if (props.useStore) {
      const initialData = {
        ...getDefaultMyComponentData(),
        ...props
      };
      
      ensureComponentVariant("myComponent", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore]);
  
  // ═══════════════════════════════════════════════════════════
  // 4. GET TENANT COMPONENT DATA
  // ═══════════════════════════════════════════════════════════
  const getTenantComponentData = () => {
    if (!tenantData?.componentSettings) return {};
    
    for (const [page, components] of Object.entries(tenantData.componentSettings)) {
      if (typeof components === "object") {
        for (const [id, comp] of Object.entries(components as any)) {
          if (
            comp.type === "myComponent" &&
            id === props.id
          ) {
            return comp.data;
          }
        }
      }
    }
    
    return {};
  };
  
  const tenantComponentData = getTenantComponentData();
  
  // ═══════════════════════════════════════════════════════════
  // 5. MERGE DATA (PRIORITY SYSTEM)
  // ═══════════════════════════════════════════════════════════
  const defaultData = getDefaultMyComponentData();
  
  const storeData = props.useStore
    ? getComponentData("myComponent", uniqueId) || {}
    : {};
  
  const currentStoreData = props.useStore
    ? myComponentStates[uniqueId] || {}
    : {};
  
  const mergedData = {
    ...defaultData,
    ...props,
    ...tenantComponentData,
    ...storeData,
    ...currentStoreData
  };
  
  // ═══════════════════════════════════════════════════════════
  // 6. RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <section className="my-component">
      <h1>{mergedData.content?.title}</h1>
      {/* ... rest of component */}
    </section>
  );
}
```

---

### Pattern 2: Component with Multiple Variants

**Support different themes/variants**:

```typescript
// In functions file
export const getDefaultMyComponent1Data = (): ComponentData => ({
  // Variant 1 defaults
  layout: "grid",
  columns: 3
});

export const getDefaultMyComponent2Data = (): ComponentData => ({
  // Variant 2 defaults
  layout: "list",
  columns: 1
});

export const getDefaultMyComponentData = (variant?: string): ComponentData => {
  switch (variant) {
    case "myComponent2":
      return getDefaultMyComponent2Data();
    case "myComponent1":
    default:
      return getDefaultMyComponent1Data();
  }
};

// In component
const defaultData = getDefaultMyComponentData(props.componentName || variantId);
```

---

### Pattern 3: Component with Conditional Rendering

**Show/hide elements based on settings**:

```typescript
export default function MyComponent(props) {
  const mergedData = getMergedData();
  
  return (
    <section>
      {mergedData.visible && (
        <>
          {/* Main content */}
          <h1>{mergedData.content?.title}</h1>
          
          {/* Conditional sections */}
          {mergedData.settings?.showSubtitle && (
            <p>{mergedData.content?.subtitle}</p>
          )}
          
          {mergedData.settings?.showCTA && (
            <button>{mergedData.cta?.text}</button>
          )}
          
          {mergedData.layout?.includeBackground && (
            <div className="background" style={{
              backgroundImage: `url(${mergedData.background?.image})`
            }} />
          )}
        </>
      )}
    </section>
  );
}
```

---

## State Management Patterns

### Pattern 1: Initialize Component in Store

**When component first renders with useStore**:

```typescript
useEffect(() => {
  if (props.useStore) {
    // Prepare initial data
    const initialData = {
      ...getDefaultData(),   // Start with defaults
      ...props,              // Override with props
      visible: props.visible !== undefined 
        ? props.visible 
        : true             // Ensure required fields
    };
    
    // Ensure in store
    ensureComponentVariant(
      "myComponent",      // type
      uniqueId,           // component.id (UUID)
      initialData         // initial data
    );
  }
}, [uniqueId, props.useStore]);
```

---

### Pattern 2: Get Component Data

**Retrieve data with fallback**:

```typescript
const getMyComponentData = () => {
  if (!props.useStore) {
    return props;  // Use props directly
  }
  
  const store = useEditorStore.getState();
  
  // Try store first
  const storeData = store.getComponentData("myComponent", uniqueId);
  
  // Fallback to props
  if (!storeData || Object.keys(storeData).length === 0) {
    return props;
  }
  
  return storeData;
};
```

---

### Pattern 3: Update Component Data

**Update specific field**:

```typescript
const updateField = (path: string, value: any) => {
  const store = useEditorStore.getState();
  
  store.updateComponentByPath(
    "myComponent",   // type
    uniqueId,        // component.id
    path,            // "content.title"
    value            // "New Value"
  );
};

// Usage
updateField("content.title", "New Title");
updateField("colors.background", "#FFFFFF");
updateField("settings.enabled", true);
```

---

### Pattern 4: Deep Merge Data

**Merge nested objects without losing data**:

```typescript
const deepMerge = (target: any, source: any): any => {
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

// Usage
const mergedData = deepMerge(
  deepMerge(defaultData, storeData),
  tempData
);
```

---

## Update Patterns

### Pattern 1: Path-Based Update

**Update nested field via dot notation**:

```typescript
// Simple path
updateByPath("title", "New Title");

// Nested path
updateByPath("content.title", "New Title");

// Array index
updateByPath("menu[0].text", "Home");

// Deep nesting
updateByPath("content.stats.stat1.value", "100+");

// Object in array
updateByPath("testimonials[2].author.name", "John Doe");
```

---

### Pattern 2: Batch Updates

**Update multiple fields at once**:

```typescript
const batchUpdate = (updates: Record<string, any>) => {
  const store = useEditorStore.getState();
  
  // Get current data
  const currentData = store.getComponentData(type, id);
  
  // Apply all updates
  let updatedData = { ...currentData };
  
  for (const [path, value] of Object.entries(updates)) {
    updatedData = updateValueByPath(updatedData, path, value);
  }
  
  // Set updated data
  store.setComponentData(type, id, updatedData);
};

// Usage
batchUpdate({
  "content.title": "New Title",
  "content.subtitle": "New Subtitle",
  "colors.background": "#FFFFFF",
  "settings.enabled": true
});
```

---

### Pattern 3: Conditional Update

**Update only if condition met**:

```typescript
const conditionalUpdate = (path: string, value: any, condition: () => boolean) => {
  if (condition()) {
    updateByPath(path, value);
  } else {
    console.warn("Update condition not met:", path);
  }
};

// Usage
conditionalUpdate(
  "content.title",
  "New Title",
  () => mergedData.settings?.allowTitleEdit !== false
);
```

---

### Pattern 4: Deferred Store Update

**Update store after state update (prevent render cycles)**:

```typescript
const handleUserAction = () => {
  // Update local state immediately
  setPageComponents(updatedComponents);
  
  // Update store after render (deferred)
  setTimeout(() => {
    const store = useEditorStore.getState();
    store.forceUpdatePageComponents(currentPage, updatedComponents);
  }, 0);
};
```

**Why setTimeout(fn, 0)?**
- Prevents React render cycle errors
- Allows local state to update first
- Store update happens in next tick

---

## Render Patterns

### Pattern 1: Cached Component Rendering

**Prevent unnecessary re-renders**:

```typescript
export function CachedComponent({
  componentName,
  section,
  data
}) {
  // Create cache key from name + data
  const cacheKey = useMemo(
    () => `${componentName}-${JSON.stringify(data)}`,
    [componentName, data]
  );
  
  // Memoize component
  return useMemo(() => {
    const Component = COMPONENTS[section]?.[componentName];
    
    if (!Component) {
      return <div>Component not found: {componentName}</div>;
    }
    
    return <Component {...data} />;
  }, [cacheKey]);
}
```

---

### Pattern 2: Force Re-Render

**Force component to re-render**:

```typescript
const [forceUpdate, setForceUpdate] = useState(0);

// Trigger re-render
const triggerReRender = () => {
  setForceUpdate(Date.now());
};

// Use in key
<CachedComponent
  key={`${component.id}-${forceUpdate}`}
  componentName={component.componentName}
  data={mergedData}
/>
```

---

### Pattern 3: Conditional Component Loading

**Load component only when needed**:

```typescript
const [shouldLoad, setShouldLoad] = useState(false);

useEffect(() => {
  // Lazy load after initial render
  const timer = setTimeout(() => {
    setShouldLoad(true);
  }, 100);
  
  return () => clearTimeout(timer);
}, []);

return (
  <div>
    {shouldLoad ? (
      <HeavyComponent {...data} />
    ) : (
      <Skeleton />
    )}
  </div>
);
```

---

### Pattern 4: Device-Responsive Rendering

**Adapt rendering to device type**:

```typescript
export default function MyComponent(props) {
  const deviceType = props.deviceType || "laptop";
  
  const getResponsiveValue = (values: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  }) => {
    switch (deviceType) {
      case "phone":
        return values.mobile || values.desktop || "";
      case "tablet":
        return values.tablet || values.desktop || "";
      case "laptop":
      default:
        return values.desktop || "";
    }
  };
  
  return (
    <section
      className={
        deviceType === "phone" ? "text-sm px-4" :
        deviceType === "tablet" ? "text-base px-6" :
        "text-lg px-8"
      }
      style={{
        height: getResponsiveValue(mergedData.height),
        padding: getResponsiveValue(mergedData.padding)
      }}
    >
      {/* Content */}
    </section>
  );
}
```

---

## Error Handling Patterns

### Pattern 1: Try-Catch with Logging

```typescript
const handleOperation = async () => {
  try {
    console.log("🚀 Starting operation");
    
    const result = await riskyOperation();
    
    console.log("✅ Operation successful:", result);
    return result;
    
  } catch (error) {
    console.error("❌ Operation failed:", error);
    
    // Log to debug system
    debugLogger.log("OPERATION", "ERROR", {
      error: error.message,
      stack: error.stack
    });
    
    // Show user notification
    toast.error("Operation failed. Please try again.");
    
    // Return safe fallback
    return null;
  }
};
```

---

### Pattern 2: Validation Before Operation

```typescript
const handleSave = () => {
  // Validate component exists
  if (!selectedComponent) {
    console.error("No component selected");
    toast.error("Please select a component to edit");
    return;
  }
  
  // Validate data
  if (!tempData || Object.keys(tempData).length === 0) {
    console.warn("No changes to save");
    toast.info("No changes detected");
    return;
  }
  
  // Validate required fields
  const requiredFields = ["title", "visible"];
  const missingFields = requiredFields.filter(
    field => !tempData[field]
  );
  
  if (missingFields.length > 0) {
    console.error("Missing required fields:", missingFields);
    toast.error(`Missing: ${missingFields.join(", ")}`);
    return;
  }
  
  // All validations passed - proceed
  performSave();
};
```

---

### Pattern 3: Graceful Degradation

```typescript
const getValue = (path: string, fallback: any = "") => {
  try {
    const value = getValueByPath(data, path);
    return value !== undefined ? value : fallback;
  } catch (error) {
    console.warn("Error getting value:", path, error);
    return fallback;
  }
};

// Usage
<h1>{getValue("content.title", "Default Title")}</h1>
<img src={getValue("background.image", "/placeholder.jpg")} />
```

---

### Pattern 4: Error Boundaries

```typescript
class ComponentErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error("Component error:", error, errorInfo);
    debugLogger.log("ERROR_BOUNDARY", "CATCH", {
      error: error.message,
      componentStack: errorInfo.componentStack
    });
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h3>Component Error</h3>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Usage
<ComponentErrorBoundary>
  <MyComponent {...data} />
</ComponentErrorBoundary>
```

---

## Performance Patterns

### Pattern 1: Memoization

**Memoize expensive calculations**:

```typescript
const expensiveComputation = useMemo(() => {
  console.log("Computing expensive value...");
  
  return processLargeDataset(mergedData);
}, [mergedData]);  // Only recompute when mergedData changes
```

---

### Pattern 2: Debounced Updates

**Delay updates for high-frequency inputs**:

```typescript
import { useDebouncedCallback } from "use-debounce";

const debouncedUpdate = useDebouncedCallback(
  (path, value) => {
    updateByPath(path, value);
  },
  300  // Wait 300ms after last change
);

// Usage in color picker
<input
  type="color"
  onChange={(e) => debouncedUpdate("colors.primary", e.target.value)}
/>
```

---

### Pattern 3: Lazy Loading

**Load components only when needed**:

```typescript
const MyComponent = lazy(() => import("./MyComponent"));

function Wrapper() {
  return (
    <Suspense fallback={<Skeleton />}>
      <MyComponent {...data} />
    </Suspense>
  );
}
```

---

### Pattern 4: Virtual Scrolling (for large lists)

**Render only visible items**:

```typescript
import { useVirtualizer } from "@tanstack/react-virtual";

function LargeList({ items }) {
  const parentRef = useRef(null);
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50  // Estimated item height
  });
  
  return (
    <div ref={parentRef} style={{ height: "400px", overflow: "auto" }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`
            }}
          >
            {items[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Best Practices

### Best Practice 1: Always Validate Inputs

```typescript
// ✅ GOOD
const updateValue = (path: string, value: any) => {
  if (!path || path.trim() === "") {
    console.error("Invalid path:", path);
    return;
  }
  
  if (value === undefined) {
    console.warn("Undefined value for path:", path);
    return;
  }
  
  updateByPath(path, value);
};

// ❌ BAD
const updateValue = (path, value) => {
  updateByPath(path, value);  // No validation!
};
```

---

### Best Practice 2: Use TypeScript Types

```typescript
// ✅ GOOD - Type-safe
interface ComponentData {
  visible: boolean;
  content: {
    title: string;
    subtitle?: string;
  };
  colors: {
    background: string;
    text: string;
  };
}

const updateComponent = (data: ComponentData) => {
  // TypeScript ensures correct structure
};

// ❌ BAD - No type safety
const updateComponent = (data: any) => {
  // Could be anything!
};
```

---

### Best Practice 3: Consistent Naming

```typescript
// ✅ GOOD - Clear and consistent
const handleComponentUpdate = (id: string, data: ComponentData) => {...}
const handleComponentDelete = (id: string) => {...}
const handleComponentThemeChange = (id: string, theme: string) => {...}

// ❌ BAD - Inconsistent
const updateComp = (i, d) => {...}
const removeComponent = (compId) => {...}
const switchTheme = (id, newTheme) => {...}
```

---

### Best Practice 4: Descriptive Console Logs

```typescript
// ✅ GOOD - Clear context
console.log("🔄 [handleSave] Merging data:", {
  existing: existingData,
  store: storeData,
  temp: tempData,
  merged: mergedData
});

// ❌ BAD - No context
console.log(mergedData);
```

---

### Best Practice 5: Clean Up Side Effects

```typescript
// ✅ GOOD - Cleanup registered
useEffect(() => {
  const interval = setInterval(() => {
    updateCSSVariables();
  }, 1000);
  
  const observer = observeStyleChanges();
  
  // Cleanup function
  return () => {
    clearInterval(interval);
    observer.disconnect();
  };
}, []);

// ❌ BAD - No cleanup (memory leak!)
useEffect(() => {
  setInterval(() => {
    updateCSSVariables();
  }, 1000);
  
  observeStyleChanges();
  
  // Missing return statement!
}, []);
```

---

### Best Practice 6: Handle Async Operations

```typescript
// ✅ GOOD - Proper async handling
const loadData = async () => {
  setLoading(true);
  
  try {
    const data = await fetchData();
    setData(data);
  } catch (error) {
    setError(error);
  } finally {
    setLoading(false);  // Always runs
  }
};

// ❌ BAD - No error handling
const loadData = async () => {
  const data = await fetchData();  // Could fail!
  setData(data);
};
```

---

### Best Practice 7: Avoid Direct State Mutation

```typescript
// ✅ GOOD - Immutable update
const addItem = (item) => {
  setItems([...items, item]);
};

const removeItem = (index) => {
  const newItems = items.slice();
  newItems.splice(index, 1);
  setItems(newItems);
};

// ❌ BAD - Direct mutation
const addItem = (item) => {
  items.push(item);  // Mutates array!
  setItems(items);   // React won't detect change
};
```

---

### Best Practice 8: Check for Null/Undefined

```typescript
// ✅ GOOD - Safe access
const title = component?.data?.content?.title || "Default Title";

// Or with explicit check
const getTitle = () => {
  if (!component) return "Default Title";
  if (!component.data) return "Default Title";
  if (!component.data.content) return "Default Title";
  return component.data.content.title || "Default Title";
};

// ❌ BAD - Can crash
const title = component.data.content.title;  // TypeError if undefined!
```

---

## Advanced Patterns

### Pattern 1: Optimistic Updates

**Update UI immediately, sync with server later**:

```typescript
const handleOptimisticUpdate = async (id, newData) => {
  // 1. Update UI immediately
  setPageComponents(current =>
    current.map(c => c.id === id ? { ...c, data: newData } : c)
  );
  
  // 2. Show optimistic feedback
  toast.success("Updated!");
  
  // 3. Sync with server (in background)
  try {
    await saveToServer(id, newData);
    console.log("✅ Server sync successful");
  } catch (error) {
    // 4. Revert on error
    console.error("❌ Server sync failed, reverting");
    setPageComponents(current =>
      current.map(c => c.id === id ? { ...c, data: oldData } : c)
    );
    toast.error("Save failed. Changes reverted.");
  }
};
```

---

### Pattern 2: Undo/Redo System

**Track history for undo/redo**:

```typescript
const useHistory = (initialState) => {
  const [history, setHistory] = useState([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const current = history[currentIndex];
  
  const setState = (newState) => {
    // Remove future history (if user made changes after undo)
    const newHistory = history.slice(0, currentIndex + 1);
    
    // Add new state
    newHistory.push(newState);
    
    // Limit history size
    const limitedHistory = newHistory.slice(-50);
    
    setHistory(limitedHistory);
    setCurrentIndex(limitedHistory.length - 1);
  };
  
  const undo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const redo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  return {
    state: current,
    setState,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1
  };
};

// Usage
const { state: pageComponents, setState: setPageComponents, undo, redo } = 
  useHistory(initialComponents);
```

---

### Pattern 3: Auto-Save

**Automatically save changes after delay**:

```typescript
const useAutoSave = (data, saveFunction, delay = 3000) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      setSaving(true);
      
      try {
        await saveFunction(data);
        setLastSaved(new Date());
        console.log("✅ Auto-saved");
      } catch (error) {
        console.error("❌ Auto-save failed:", error);
      } finally {
        setSaving(false);
      }
    }, delay);
    
    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay]);
  
  return { saving, lastSaved };
};

// Usage
const { saving, lastSaved } = useAutoSave(
  pageComponents,
  (data) => savePagesToDatabase(data),
  5000  // 5 seconds
);
```

---

### Pattern 4: Retry Logic

**Retry failed operations**:

```typescript
const retry = async (
  operation: () => Promise<any>,
  maxRetries = 3,
  delayMs = 1000
) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxRetries}`);
      
      const result = await operation();
      
      console.log(`✅ Success on attempt ${attempt}`);
      return result;
      
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        throw error;  // Final attempt failed
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
};

// Usage
const data = await retry(
  () => fetchTenantData(tenantId),
  3,     // 3 attempts
  2000   // 2 seconds between attempts
);
```

---

## Summary

Common patterns enable:

1. **Consistent implementations**: All components follow same patterns
2. **Reduced bugs**: Proven patterns less error-prone
3. **Better performance**: Optimized patterns for speed
4. **Easier maintenance**: Familiar patterns easier to update
5. **Clearer code**: Well-known patterns self-documenting

**Key Takeaways**:
- Use established patterns when possible
- Validate all inputs and outputs
- Handle errors gracefully
- Log important operations
- Optimize for performance
- Clean up side effects
- Type safety with TypeScript
- Consistent naming conventions

**When Adding Features**:
1. Check if existing pattern applies
2. Follow pattern structure
3. Add necessary validation
4. Include error handling
5. Add debug logging
6. Test thoroughly

