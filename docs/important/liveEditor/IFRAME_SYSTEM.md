# iframe System - Complete Reference

## Table of Contents
1. [Overview](#overview)
2. [AutoFrame Component](#autoframe-component)
3. [Style Synchronization](#style-synchronization)
4. [Portal Rendering](#portal-rendering)
5. [Responsive Preview](#responsive-preview)
6. [Performance Optimization](#performance-optimization)

---

## Overview

The Live Editor uses an **isolated iframe** to render the website preview. This provides:
- **Style isolation**: Editor UI styles don't affect preview
- **Real-world simulation**: Preview matches production environment
- **Responsive testing**: Switch between device sizes
- **Security**: Sandboxed execution environment

### Why iframe?

**Without iframe**:
```
┌─────────────────────────────────────┐
│  Editor UI                          │
│  ├─ Tailwind CSS (editor styles)   │
│  ├─ Components                      │
│  └─ Website Preview                 │
│     └─ Tailwind CSS (conflicts!)   │
│        └─ Components render wrong   │
└─────────────────────────────────────┘
```

**With iframe**:
```
┌─────────────────────────────────────┐
│  Editor UI                          │
│  └─ Tailwind CSS (editor styles)   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  iframe (isolated)          │   │
│  │  └─ Tailwind CSS (preview)  │   │
│  │     └─ Components ✓         │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## AutoFrame Component

**Location**: `LiveEditorUI.tsx` (inline component)

**Purpose**: Advanced iframe wrapper with automatic style synchronization

### Props

```typescript
interface AutoFrameProps {
  children: React.ReactNode;
  className: string;
  style?: React.CSSProperties;
  frameRef: React.RefObject<HTMLIFrameElement>;
  onReady?: () => void;
  onNotReady?: () => void;
}
```

### State

```typescript
const [loaded, setLoaded] = useState(false);
const [mountTarget, setMountTarget] = useState<HTMLElement | null>(null);
const [stylesLoaded, setStylesLoaded] = useState(false);
const stylesInitializedRef = useRef(false);
```

### Implementation

```typescript
const AutoFrame = ({
  children,
  className,
  style,
  frameRef,
  onReady,
  onNotReady
}) => {
  const [loaded, setLoaded] = useState(false);
  const [mountTarget, setMountTarget] = useState(null);
  const [stylesLoaded, setStylesLoaded] = useState(false);
  const stylesInitializedRef = useRef(false);
  
  // ═══════════════════════════════════════════════════════════
  // FUNCTION 1: Copy Styles from Parent Window to iframe
  // ═══════════════════════════════════════════════════════════
  const copyStylesToIframe = useCallback((iframeDoc: Document) => {
    // Prevent duplicate copies
    if (stylesInitializedRef.current) {
      return;
    }
    
    // Get all style elements from parent
    const styleElements = document.querySelectorAll(
      'style, link[rel="stylesheet"]'
    );
    const iframeHead = iframeDoc.head;
    
    // Clear iframe head first
    iframeHead.innerHTML = "";
    
    // Copy all styles
    styleElements.forEach(styleEl => {
      if (styleEl.tagName === "STYLE") {
        // Clone inline <style> tags
        const clonedStyle = styleEl.cloneNode(true) as HTMLStyleElement;
        iframeHead.appendChild(clonedStyle);
        
      } else if (styleEl.tagName === "LINK") {
        // Clone <link rel="stylesheet"> tags
        const linkEl = styleEl as HTMLLinkElement;
        const clonedLink = linkEl.cloneNode(true) as HTMLLinkElement;
        iframeHead.appendChild(clonedLink);
      }
    });
    
    // Copy CSS custom properties (variables)
    const parentComputedStyle = getComputedStyle(document.documentElement);
    
    for (let i = 0; i < parentComputedStyle.length; i++) {
      const property = parentComputedStyle[i];
      
      if (property.startsWith("--")) {
        const value = parentComputedStyle.getPropertyValue(property);
        iframeDoc.documentElement.style.setProperty(property, value);
      }
    }
    
    // Add iframe-specific styles
    const additionalStyles = document.createElement("style");
    additionalStyles.textContent = `
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        min-height: 100vh;
        overflow-x: hidden;
        overflow-y: auto;
      }
      * {
        box-sizing: border-box;
      }
      #frame-root {
        width: 100%;
        height: 100%;
        min-height: 100vh;
        overflow-x: hidden;
        overflow-y: auto;
      }
      html {
        overflow-x: hidden;
        overflow-y: auto;
      }
    `;
    iframeHead.appendChild(additionalStyles);
    
    // Copy important meta tags
    const metaTags = document.querySelectorAll(
      'meta[name="viewport"], meta[charset]'
    );
    metaTags.forEach(metaTag => {
      const clonedMeta = metaTag.cloneNode(true) as HTMLMetaElement;
      iframeHead.appendChild(clonedMeta);
    });
    
    // Mark as initialized
    stylesInitializedRef.current = true;
  }, []);
  
  // ═══════════════════════════════════════════════════════════
  // FUNCTION 2: Observe Style Changes in Parent
  // ═══════════════════════════════════════════════════════════
  const observeStyleChanges = useCallback((iframeDoc: Document) => {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              
              if (element.matches('style, link[rel="stylesheet"]')) {
                // New style added to parent - copy to iframe
                const clonedElement = element.cloneNode(true) as HTMLElement;
                iframeDoc.head.appendChild(clonedElement);
              }
            }
          });
        }
      });
    });
    
    // Watch parent document.head for changes
    observer.observe(document.head, {
      childList: true,
      subtree: true
    });
    
    return observer;
  }, []);
  
  // ═══════════════════════════════════════════════════════════
  // FUNCTION 3: Update CSS Variables Periodically
  // ═══════════════════════════════════════════════════════════
  const updateCSSVariables = useCallback((iframeDoc: Document) => {
    const parentComputedStyle = getComputedStyle(document.documentElement);
    
    for (let i = 0; i < parentComputedStyle.length; i++) {
      const property = parentComputedStyle[i];
      
      if (property.startsWith("--")) {
        const value = parentComputedStyle.getPropertyValue(property);
        iframeDoc.documentElement.style.setProperty(property, value);
      }
    }
  }, []);
  
  // ═══════════════════════════════════════════════════════════
  // EFFECT: Initialize iframe When Loaded
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    if (frameRef.current && loaded) {
      const doc = frameRef.current.contentDocument;
      const win = frameRef.current.contentWindow;
      
      if (doc && win) {
        // STEP 1: Copy styles
        copyStylesToIframe(doc);
        
        // STEP 2: Set mount target
        setMountTarget(doc.getElementById("frame-root"));
        
        // STEP 3: Observe style changes
        const styleObserver = observeStyleChanges(doc);
        
        // STEP 4: Update CSS variables periodically
        const cssVariablesInterval = setInterval(() => {
          updateCSSVariables(doc);
        }, 1000);  // Every 1 second
        
        // STEP 5: Check if styles loaded
        const checkStylesLoaded = () => {
          const iframeStyles = doc.querySelectorAll(
            'style, link[rel="stylesheet"]'
          );
          const parentStyles = document.querySelectorAll(
            'style, link[rel="stylesheet"]'
          );
          
          if (iframeStyles.length >= parentStyles.length) {
            setStylesLoaded(true);
            if (onReady) onReady();
          } else {
            setTimeout(checkStylesLoaded, 50);
          }
        };
        
        setTimeout(checkStylesLoaded, 100);
        
        // CLEANUP
        return () => {
          styleObserver.disconnect();
          clearInterval(cssVariablesInterval);
        };
      } else {
        if (onNotReady) onNotReady();
      }
    }
  }, [frameRef, loaded, copyStylesToIframe, observeStyleChanges]);
  
  // ═══════════════════════════════════════════════════════════
  // CLEANUP: Reset on Unmount
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    return () => {
      stylesInitializedRef.current = false;
    };
  }, []);
  
  // ═══════════════════════════════════════════════════════════
  // RENDER: iframe with Portal
  // ═══════════════════════════════════════════════════════════
  return (
    <iframe
      className={className}
      style={{ ...style, overflow: "auto" }}
      srcDoc='<!DOCTYPE html><html><head></head><body><div id="frame-root" data-live-editor-entry></div></body></html>'
      ref={frameRef}
      onLoad={() => setLoaded(true)}
    >
      {loaded && mountTarget && stylesLoaded &&
        createPortal(children, mountTarget)
      }
    </iframe>
  );
};
```

---

## Style Synchronization

### Why Synchronize Styles?

React components in iframe need the same styles as parent window:
- Tailwind CSS classes
- Component styles
- CSS variables
- Theme tokens

**Without sync**: Components render unstyled or broken

**With sync**: Components render identically to production

### Style Copying Process

```
INITIALIZATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: iframe Loads
────────────────────────────────────────────────
<iframe
  srcDoc='<!DOCTYPE html><html><head></head><body>...</body></html>'
  onLoad={() => setLoaded(true)}
/>
  ↓
loaded = true
  ↓
useEffect with [frameRef, loaded] triggers


STEP 2: Get iframe Document
────────────────────────────────────────────────
const doc = frameRef.current.contentDocument;
const win = frameRef.current.contentWindow;


STEP 3: Copy All Style Elements
────────────────────────────────────────────────
const styleElements = document.querySelectorAll(
  'style, link[rel="stylesheet"]'
);

styleElements.forEach(styleEl => {
  if (styleEl.tagName === "STYLE") {
    // Inline styles
    const clonedStyle = styleEl.cloneNode(true);
    iframeDoc.head.appendChild(clonedStyle);
    
  } else if (styleEl.tagName === "LINK") {
    // External stylesheets
    const clonedLink = styleEl.cloneNode(true);
    iframeDoc.head.appendChild(clonedLink);
  }
});

Result:
  Parent <head>:
    <style>/* Tailwind */</style>
    <style>/* Global CSS */</style>
    <link rel="stylesheet" href="/styles.css" />
  
  iframe <head>:
    <style>/* Tailwind */</style>  ← Copied
    <style>/* Global CSS */</style>  ← Copied
    <link rel="stylesheet" href="/styles.css" />  ← Copied


STEP 4: Copy CSS Variables
────────────────────────────────────────────────
const parentComputedStyle = getComputedStyle(document.documentElement);

for (let i = 0; i < parentComputedStyle.length; i++) {
  const property = parentComputedStyle[i];
  
  if (property.startsWith("--")) {
    const value = parentComputedStyle.getPropertyValue(property);
    iframeDoc.documentElement.style.setProperty(property, value);
  }
}

Result:
  Parent:
    --primary-color: #3B82F6
    --secondary-color: #10B981
    --font-family: "Tajawal"
  
  iframe:
    --primary-color: #3B82F6  ← Copied
    --secondary-color: #10B981  ← Copied
    --font-family: "Tajawal"  ← Copied


STEP 5: Add iframe-Specific Styles
────────────────────────────────────────────────
const additionalStyles = document.createElement("style");
additionalStyles.textContent = `
  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
  }
  
  #frame-root {
    width: 100%;
    height: 100%;
    min-height: 100vh;
  }
`;
iframeDoc.head.appendChild(additionalStyles);


STEP 6: Copy Meta Tags
────────────────────────────────────────────────
const metaTags = document.querySelectorAll(
  'meta[name="viewport"], meta[charset]'
);

metaTags.forEach(metaTag => {
  const clonedMeta = metaTag.cloneNode(true);
  iframeDoc.head.appendChild(clonedMeta);
});


RESULT: iframe has all necessary styles ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Ongoing Synchronization

```
CONTINUOUS UPDATES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MECHANISM 1: Style Change Observer
────────────────────────────────────────────────
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach(node => {
        if (node matches 'style, link[rel="stylesheet"]') {
          // New style added to parent
          const clone = node.cloneNode(true);
          iframeDoc.head.appendChild(clone);
        }
      });
    }
  });
});

observer.observe(document.head, {
  childList: true,
  subtree: true
});

Example:
  Parent adds new <style> (e.g., from dynamic import)
    ↓
  MutationObserver detects addition
    ↓
  Clone and append to iframe
    ↓
  iframe styles stay in sync ✓


MECHANISM 2: CSS Variables Interval
────────────────────────────────────────────────
const interval = setInterval(() => {
  updateCSSVariables(iframeDoc);
}, 1000);

Every 1 second:
  ↓
Get all CSS variables from parent
  ↓
Copy to iframe
  ↓
Dynamic theme changes reflected ✓


CLEANUP on Unmount:
────────────────────────────────────────────────
return () => {
  observer.disconnect();
  clearInterval(interval);
};
```

---

## Portal Rendering

### React Portal Mechanism

**Standard React**: Components render in parent DOM

**With Portal**: Components render in different DOM tree (iframe)

### Implementation

```typescript
return (
  <iframe
    ref={frameRef}
    srcDoc='<!DOCTYPE html><html><head></head><body><div id="frame-root"></div></body></html>'
    onLoad={() => setLoaded(true)}
  >
    {loaded && mountTarget && stylesLoaded &&
      createPortal(children, mountTarget)
    }
  </iframe>
);
```

### Portal Flow

```
STEP 1: iframe Loads
────────────────────────────────────────────────
<iframe srcDoc="..." onLoad={onLoad} />
  ↓
onLoad event fires
  ↓
setLoaded(true)


STEP 2: Get Mount Target
────────────────────────────────────────────────
const doc = frameRef.current.contentDocument;
const target = doc.getElementById("frame-root");
setMountTarget(target);


STEP 3: Wait for Styles
────────────────────────────────────────────────
checkStylesLoaded():
  const iframeStyles = doc.querySelectorAll('style, link');
  const parentStyles = document.querySelectorAll('style, link');
  
  if (iframeStyles.length >= parentStyles.length) {
    setStylesLoaded(true);
  } else {
    setTimeout(checkStylesLoaded, 50);  // Retry
  }


STEP 4: Create Portal
────────────────────────────────────────────────
{loaded && mountTarget && stylesLoaded &&
  createPortal(children, mountTarget)
}

React Portal:
  ├─ Render children (React components)
  ├─ Mount to mountTarget (#frame-root in iframe)
  └─ Event bubbling still works with parent


RESULT: React components render inside iframe ✓
```

### Portal Benefits

1. **React Context Works**: Providers in parent still accessible
2. **Event Handling Works**: onClick, onChange events bubble up
3. **State Management Works**: Zustand stores accessible
4. **Hooks Work**: useState, useEffect, custom hooks all functional

**Example**:
```typescript
// Parent component (outside iframe)
const [count, setCount] = useState(0);

// Component inside iframe (via portal)
function InsideIframe() {
  // This works! State from parent accessible
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

createPortal(<InsideIframe />, iframeTarget);
```

---

## Responsive Preview

### Device Types

```typescript
type DeviceType = "phone" | "tablet" | "laptop";

const getDeviceDimensions = (t) => ({
  phone: {
    width: 375,
    height: 667,
    name: t("live_editor.responsive.mobile")
  },
  tablet: {
    width: 768,
    height: 1024,
    name: t("live_editor.responsive.tablet")
  },
  laptop: {
    width: "100%",
    height: "100%",
    name: t("live_editor.responsive.desktop")
  }
});
```

### Device Switching

```typescript
const [selectedDevice, setSelectedDevice] = useState<DeviceType>("laptop");

const handleDeviceChange = (device: DeviceType) => {
  setSelectedDevice(device);
  
  // Force re-render of specific components
  setTimeout(() => {
    const componentsToRefresh = [
      "hero1", "hero2", "header1", ...
    ];
    
    const updatedComponents = pageComponents.map(comp => {
      if (componentsToRefresh.includes(comp.componentName)) {
        return {
          ...comp,
          forceUpdate: Date.now(),  // Force re-render
          deviceType: device        // Pass device type
        };
      }
      return comp;
    });
    
    setPageComponents(updatedComponents);
    
    // Update store
    setTimeout(() => {
      store.forceUpdatePageComponents(currentPage, updatedComponents);
    }, 0);
  }, 100);
};
```

### Device Styling

```typescript
<div
  className={`iframe-container ${
    selectedDevice === "phone" ? "max-w-[375px]" :
    selectedDevice === "tablet" ? "max-w-[768px]" :
    "w-full"
  }`}
  style={{
    width: deviceDimensions[selectedDevice].width,
    height: deviceDimensions[selectedDevice].height,
    maxWidth: selectedDevice === "laptop" ? "100%" : "100%",
    maxHeight: selectedDevice === "laptop" ? "100%" : "calc(100vh - 200px)"
  }}
>
  <AutoFrame ... />
</div>
```

### Device Preview Controls

```typescript
<div className="device-controls">
  {/* Mobile */}
  <button
    onClick={() => handleDeviceChange("phone")}
    className={selectedDevice === "phone" ? "active" : ""}
  >
    <MobileIcon />
  </button>
  
  {/* Tablet */}
  <button
    onClick={() => handleDeviceChange("tablet")}
    className={selectedDevice === "tablet" ? "active" : ""}
  >
    <TabletIcon />
  </button>
  
  {/* Desktop */}
  <button
    onClick={() => handleDeviceChange("laptop")}
    className={selectedDevice === "laptop" ? "active" : ""}
  >
    <DesktopIcon />
  </button>
</div>

<div className="device-name">
  {deviceDimensions[selectedDevice].name}
</div>
```

### Responsive Component Behavior

Components can adapt to device type:

```typescript
// In hero1.tsx
export default function Hero1(props) {
  const deviceType = props.deviceType || "laptop";
  
  return (
    <section
      className={
        deviceType === "phone" ? "text-sm" :
        deviceType === "tablet" ? "text-base" :
        "text-lg"
      }
      style={{
        height: 
          deviceType === "phone" ? "90vh" :
          deviceType === "tablet" ? "90vh" :
          "90vh"
      }}
    >
      {/* Component content */}
    </section>
  );
}
```

**Device Type Passed**:
```typescript
<CachedComponent
  data={{
    ...mergedData,
    deviceType: selectedDevice  // ← Passed to component
  }}
/>
```

---

## Performance Optimization

### Optimization 1: CachedComponent

**Purpose**: Prevent unnecessary re-renders

```typescript
export function CachedComponent({
  componentName,
  section,
  data
}) {
  const cacheKey = `${componentName}-${JSON.stringify(data)}`;
  
  return useMemo(() => {
    const Component = COMPONENTS[section]?.[componentName];
    
    if (!Component) {
      return <div>Component not found: {componentName}</div>;
    }
    
    return <Component {...data} />;
  }, [componentName, data, cacheKey]);
}
```

**How It Works**:
- Create cache key from componentName + data
- useMemo prevents re-render if key unchanged
- Only re-renders when data actually changes

**Benefits**:
- Reduces iframe re-renders
- Improves scrolling performance
- Faster editing experience

### Optimization 2: Debounced Updates

For high-frequency updates (e.g., color picker dragging):

```typescript
const debouncedUpdate = useMemo(
  () => debounce((path, value) => {
    updateValue(path, value);
  }, 300),  // Wait 300ms after last change
  [updateValue]
);
```

### Optimization 3: Selective Re-Rendering

Only re-render components that changed:

```typescript
<CachedComponent
  key={`${component.id}-${component.forceUpdate || 0}-${selectedDevice}`}
  //   └─ Component ID (stable)
  //                └─ Force update timestamp (when needed)
  //                              └─ Device type (triggers re-render on switch)
  componentName={component.componentName}
  data={mergedData}
/>
```

**Key Breakdown**:
- `component.id`: Stable identifier
- `forceUpdate`: Timestamp to force re-render
- `selectedDevice`: Triggers re-render on device change

### Optimization 4: Style Copy Prevention

```typescript
const stylesInitializedRef = useRef(false);

const copyStylesToIframe = useCallback((iframeDoc) => {
  // Skip if already copied
  if (stylesInitializedRef.current) {
    return;
  }
  
  // ... copy styles ...
  
  stylesInitializedRef.current = true;
}, []);
```

**Prevents**: Duplicate style copies on re-renders

---

## iframe Lifecycle

### Complete Lifecycle

```
MOUNT:
  ├─ iframe element created
  ├─ srcDoc loaded
  ├─ onLoad event fires
  ├─ loaded = true
  ├─ copyStylesToIframe()
  ├─ setMountTarget()
  ├─ observeStyleChanges()
  ├─ Start CSS variables interval
  ├─ Wait for styles to load
  ├─ stylesLoaded = true
  ├─ onReady() callback
  └─ createPortal(children, mountTarget)

ACTIVE:
  ├─ Components render in iframe
  ├─ User interactions handled
  ├─ Style changes monitored
  ├─ CSS variables updated every 1s
  └─ Re-renders on data changes

UNMOUNT:
  ├─ Stop CSS variables interval
  ├─ Disconnect MutationObserver
  ├─ Reset stylesInitializedRef
  └─ iframe removed from DOM
```

---

## Common Issues and Solutions

### Issue 1: Styles Not Loading

**Symptoms**: Components render unstyled in iframe

**Debug**:
```typescript
console.log("iframe styles:", 
  iframeDoc.querySelectorAll('style, link').length
);
console.log("Parent styles:", 
  document.querySelectorAll('style, link').length
);
```

**Solutions**:
1. Increase `checkStylesLoaded` timeout
2. Force style copy: `stylesInitializedRef.current = false`
3. Check MutationObserver is running
4. Verify external stylesheets loading

### Issue 2: CSS Variables Not Updating

**Symptoms**: Theme changes not reflected in iframe

**Debug**:
```typescript
const iframeVars = getComputedStyle(iframeDoc.documentElement)
  .getPropertyValue("--primary-color");
const parentVars = getComputedStyle(document.documentElement)
  .getPropertyValue("--primary-color");

console.log("iframe --primary-color:", iframeVars);
console.log("Parent --primary-color:", parentVars);
```

**Solutions**:
1. Check interval is running
2. Verify updateCSSVariables called
3. Force manual update: `updateCSSVariables(iframeDoc)`

### Issue 3: Portal Not Rendering

**Symptoms**: iframe empty, components not visible

**Debug**:
```typescript
console.log("loaded:", loaded);
console.log("mountTarget:", mountTarget);
console.log("stylesLoaded:", stylesLoaded);
console.log("frameRef.current:", frameRef.current);
```

**Solutions**:
1. Verify all three conditions true: loaded && mountTarget && stylesLoaded
2. Check #frame-root exists in iframe
3. Ensure frameRef.current not null

### Issue 4: Events Not Working

**Symptoms**: Clicks/inputs in iframe not responding

**Debug**:
```typescript
// Check event bubbling
iframeDoc.getElementById("test-button")?.addEventListener("click", (e) => {
  console.log("Click detected in iframe:", e);
});
```

**Solutions**:
1. Verify portal created successfully
2. Check React event handlers attached
3. Ensure no pointer-events: none on elements

---

## Advanced Patterns

### Pattern 1: Custom CSS Injection

Inject component-specific CSS:

```typescript
const injectCustomCSS = (iframeDoc, css) => {
  const styleEl = document.createElement("style");
  styleEl.textContent = css;
  iframeDoc.head.appendChild(styleEl);
};

// Usage
injectCustomCSS(iframeDoc, `
  .hero-section {
    animation: fadeIn 1s ease-in-out;
  }
`);
```

### Pattern 2: Script Injection

For components needing external scripts:

```typescript
const injectScript = (iframeDoc, src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    iframeDoc.head.appendChild(script);
  });
};

// Usage
await injectScript(iframeDoc, "https://maps.googleapis.com/maps/api/js");
```

### Pattern 3: Font Loading

Ensure fonts load in iframe:

```typescript
const copyFonts = (iframeDoc) => {
  const fontLinks = document.querySelectorAll(
    'link[rel="stylesheet"][href*="fonts.googleapis.com"]'
  );
  
  fontLinks.forEach(link => {
    const clonedLink = link.cloneNode(true);
    iframeDoc.head.appendChild(clonedLink);
  });
};
```

---

## Important Notes for AI

### Key Principles

1. **Isolation**: iframe provides style isolation from parent
2. **Synchronization**: Styles must be copied and kept in sync
3. **Portal**: React Portal enables component rendering in iframe
4. **Performance**: Cache components, debounce updates
5. **Responsiveness**: Support multiple device previews

### When Modifying iframe System

1. **Always check all three conditions** before portal:
   ```typescript
   {loaded && mountTarget && stylesLoaded && createPortal(...)}
   ```

2. **Never mutate iframe directly**: Use React Portal

3. **Clean up observers and intervals**: Prevent memory leaks
   ```typescript
   return () => {
     observer.disconnect();
     clearInterval(interval);
   };
   ```

4. **Handle iframe document null**: Always check before accessing
   ```typescript
   const doc = frameRef.current?.contentDocument;
   if (!doc) return;
   ```

### Common Mistakes

❌ **Mistake 1**: Forgetting to copy CSS variables
```typescript
// WRONG - Only copies style elements
copyStylesToIframe(iframeDoc);

// CORRECT - Also copies CSS variables
copyStylesToIframe(iframeDoc);
updateCSSVariables(iframeDoc);
```

❌ **Mistake 2**: Not observing style changes
```typescript
// WRONG - Styles copied once, new styles missed
copyStylesToIframe(iframeDoc);

// CORRECT - Monitor and copy new styles
copyStylesToIframe(iframeDoc);
const observer = observeStyleChanges(iframeDoc);
```

❌ **Mistake 3**: Rendering before styles ready
```typescript
// WRONG - Components render unstyled
{loaded && mountTarget && createPortal(...)}

// CORRECT - Wait for styles
{loaded && mountTarget && stylesLoaded && createPortal(...)}
```

---

## Summary

The iframe system provides:

1. **Style Isolation**: Editor UI and preview don't conflict
2. **Real-World Preview**: Matches production environment
3. **Responsive Testing**: Switch between device sizes
4. **Automatic Synchronization**: Styles stay in sync
5. **React Portal Integration**: Components render naturally

**Key Components**:
- AutoFrame: iframe wrapper with sync logic
- copyStylesToIframe: Initial style copy
- observeStyleChanges: Ongoing sync
- updateCSSVariables: Theme variable sync
- createPortal: React component rendering

Understanding this system is essential for:
- Debugging rendering issues
- Adding new preview features
- Optimizing performance
- Handling style conflicts

