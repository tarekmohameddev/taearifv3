# Component Loading System

## Overview

The application uses a **dynamic component loading system** that:

- Loads React components on-demand using `lazy()` imports
- Supports multiple component variants (e.g., `hero1`, `hero2`, `hero3`)
- Manages component data, positions, and configurations
- Provides fallback handling for missing components
- Implements skeleton loading states during component load

---

## Core Concepts

### Component Structure

Each component has:

1. **Base Name**: Component type (e.g., `hero`, `header`, `footer`)
2. **Variant Number**: Visual variation (e.g., `1`, `2`, `3`)
3. **Full Component Name**: Base + Number (e.g., `hero1`, `header2`)
4. **Data**: Component-specific configuration
5. **Position**: Display order on page

### Component Naming Convention

```
Format: {baseName}{number}

Examples:
- hero1, hero2, hero3
- header1, header2
- footer1
- halfTextHalfImage1, halfTextHalfImage2
- grid1, grid2
```

---

## Component Definitions

### Central Component Registry

**File: `lib-liveeditor/ComponentsList.tsx`**

```typescript
export const COMPONENTS: Record<string, ComponentType> = {
  hero: {
    id: "hero",
    name: "hero",
    displayName: "Hero",
    description: "Main banner section with compelling headline",
    category: "banner",
    section: "homepage",
    subPath: "hero",
    icon: "🌟",
    defaultTheme: "hero1",
    variants: [
      { id: "hero1", name: "Hero Variant 1" },
      { id: "hero2", name: "Hero Variant 2" },
      { id: "hero3", name: "Hero Variant 3" },
    ],
  },
  header: {
    id: "header",
    name: "header",
    displayName: "Header",
    category: "navigation",
    section: "homepage",
    subPath: "header",
    variants: [
      /* ... */
    ],
  },
  // ... more components
};
```

**Component Properties:**

- `id`: Unique identifier
- `name`: Component name (same as id)
- `displayName`: Human-readable name
- `description`: Component purpose
- `category`: Classification (banner, navigation, content, etc.)
- `section`: Page section (homepage, for-rent, etc.)
- `subPath`: File path in components directory
- `variants`: Available visual variations
- `defaultTheme`: Default variant to use

### Section Definitions

```typescript
export const SECTIONS: Record<string, SectionType> = {
  homepage: {
    id: "homepage",
    name: "homepage",
    displayName: "الصفحة الرئيسية",
    path: "homepage",
    description: "مكونات الصفحة الرئيسية للموقع",
    icon: "🏠",
    components: [
      "header",
      "hero",
      "halfTextHalfImage",
      "propertySlider",
      "ctaValuation",
      "stepsSection",
      "whyChooseUs",
      "testimonials",
      "contactMapSection",
      "footer",
      "grid",
      "filterButtons",
      // ... more components
    ],
  },
  // More sections: "for-rent", "for-sale", "about-us", etc.
};
```

---

## Dynamic Component Loading

### The `loadComponent()` Function

**File: `app/HomePageWrapper.tsx`**

```typescript
import { lazy } from "react";

const loadComponent = (section: string, componentName: string) => {
  // Validate componentName
  if (!componentName || typeof componentName !== "string") {
    return null;
  }

  // Extract base name and number from componentName
  // Example: "hero2" → baseName = "hero", number = "2"
  const match = componentName.match(/^(.*?)(\d+)$/);
  if (!match) {
    return null;
  }

  const baseName = match[1];
  const number = match[2];

  // Get section path (e.g., "homepage")
  const sectionPath = getSectionPath(section) || section;

  if (!sectionPath) {
    console.error("Invalid section:", section);
    return null;
  }

  // Get component sub-path from registry
  const subPath = getComponentSubPath(baseName);

  if (!subPath) {
    console.error("Invalid component type:", baseName);

    // Fallback to hero directory
    const fallbackPath = "hero";
    const fallbackFullPath = `${fallbackPath}/${componentName}`;

    return lazy(() =>
      import(`@/components/tenant/${fallbackFullPath}`).catch(() => ({
        default: (props: any) => (
          <div className="p-8 bg-yellow-50 border-2 border-yellow-300">
            <div className="text-yellow-600 text-lg font-semibold">
              Unknown Component: {baseName}
            </div>
            <div className="text-gray-600 text-sm">
              Component file: {componentName} (fallback: {fallbackFullPath})
            </div>
          </div>
        ),
      })),
    );
  }

  // Build full path to component
  const fullPath = `${subPath}/${componentName}`;

  // Return lazy-loaded component
  return lazy(() =>
    import(`@/components/tenant/${fullPath}`).catch(() => ({
      default: () => <div>Component {componentName} not found</div>,
    })),
  );
};
```

### Step-by-Step Breakdown

#### Step 1: Parse Component Name

```typescript
const componentName = "hero2";
const match = componentName.match(/^(.*?)(\d+)$/);

// Result:
// match[0] = "hero2" (full match)
// match[1] = "hero" (base name)
// match[2] = "2" (number)
```

#### Step 2: Get Sub-Path from Registry

```typescript
const baseName = "hero";
const subPath = getComponentSubPath(baseName);

// From COMPONENTS registry:
// COMPONENTS["hero"].subPath = "hero"
// subPath = "hero"
```

#### Step 3: Build Full Import Path

```typescript
const fullPath = `${subPath}/${componentName}`;
// fullPath = "hero/hero2"
```

#### Step 4: Lazy Load Component

```typescript
const Component = lazy(() => import(`@/components/tenant/${fullPath}`));

// Resolves to:
// import("@/components/tenant/hero/hero2")
```

**File Structure:**

```
components/tenant/
  ├── hero/
  │   ├── hero1.tsx
  │   ├── hero2.tsx
  │   └── hero3.tsx
  ├── header/
  │   ├── header1.tsx
  │   └── header2.tsx
  ├── footer/
  │   └── footer1.tsx
  └── ... (more component directories)
```

---

## Component Data Structure

### Tenant Component Settings

**Stored in Backend:**

```json
{
  "componentSettings": {
    "homepage": {
      "hero-1": {
        "componentName": "hero1",
        "type": "hero",
        "position": 1,
        "data": {
          "title": "عنوان البطل",
          "subtitle": "نص فرعي",
          "buttonText": "ابدأ الآن",
          "backgroundImage": "https://..."
        }
      },
      "header-1": {
        "componentName": "header1",
        "type": "header",
        "position": 0,
        "data": {
          "logo": {
            "image": "https://...",
            "alt": "شعار الشركة"
          },
          "menuItems": [...]
        }
      }
    }
  }
}
```

### Component List Processing

**File: `app/HomePageWrapper.tsx`**

```typescript
const componentsList = useMemo(() => {
  if (!tenantData) return null;

  if (
    tenantData?.componentSettings &&
    typeof tenantData.componentSettings === "object" &&
    tenantData.componentSettings.homepage &&
    Object.keys(tenantData.componentSettings.homepage).length > 0
  ) {
    const pageSettings = tenantData.componentSettings.homepage;

    const components = Object.entries(pageSettings)
      .map(([id, component]: [string, any]) => {
        // Validate componentName
        if (
          !component.componentName ||
          typeof component.componentName !== "string"
        ) {
          // Fallback to default
          const fallbackName = `${component.type || "hero"}1`;
          return {
            id,
            componentName: fallbackName,
            data: component.data,
            position: component.position,
          };
        }

        return {
          id,
          componentName: component.componentName,
          data: component.data,
          position: component.position,
        };
      })
      .sort((a, b) => (a.position || 0) - (b.position || 0));

    return components;
  }

  // If no componentSettings, use default components
  return defaultComponentsList;
}, [tenantData]);
```

**Output:**

```javascript
[
  {
    id: "header-1",
    componentName: "header1",
    data: { logo: {...}, menuItems: [...] },
    position: 0
  },
  {
    id: "hero-1",
    componentName: "hero1",
    data: { title: "...", subtitle: "..." },
    position: 1
  },
  {
    id: "grid-1",
    componentName: "grid1",
    data: { columns: 3, items: [...] },
    position: 2
  }
]
```

---

## Rendering Components

### Component Rendering Flow

```typescript
export default function HomePageWrapper({ tenantId }) {
  const componentsList = useMemo(() => {
    // ... get components list
  }, [tenantData]);

  // Filter out global components (header, footer)
  const filteredComponentsList = componentsList.filter((comp: any) => {
    if (comp.componentName?.startsWith("header")) return false;
    if (comp.componentName?.startsWith("footer")) return false;
    return true;
  });

  return (
    <div>
      {/* Global Header */}
      <StaticHeader1 />

      {/* Page Content */}
      <main>
        {filteredComponentsList.map((comp: any) => {
          // Load component dynamically
          const Cmp = loadComponent("homepage", comp.componentName);

          if (!Cmp) {
            return <Fragment key={comp.id} />;
          }

          return (
            <Suspense
              key={comp.id}
              fallback={<SkeletonLoader componentName={comp.componentName} />}
            >
              <Cmp {...(comp.data as any)} useStore variant={comp.id} />
            </Suspense>
          );
        })}
      </main>

      {/* Global Footer */}
      <StaticFooter1 />
    </div>
  );
}
```

### Props Passed to Component

```typescript
<Cmp
  {...(comp.data as any)}  // Spread all component data
  useStore                 // Flag to use Zustand store
  variant={comp.id}        // Unique variant ID
/>
```

**Example for hero1:**

```typescript
<Hero1
  title="عنوان البطل"
  subtitle="نص فرعي"
  buttonText="ابدأ الآن"
  backgroundImage="https://..."
  useStore={true}
  variant="hero-1"
/>
```

---

## Suspense and Lazy Loading

### Why Suspense?

```typescript
import { Suspense, lazy } from "react";

const Hero1 = lazy(() => import("@/components/tenant/hero/hero1"));

<Suspense fallback={<LoadingSpinner />}>
  <Hero1 />
</Suspense>
```

**Benefits:**

1. **Code Splitting**: Each component in separate bundle
2. **Lazy Loading**: Component loaded only when needed
3. **Better Performance**: Smaller initial bundle size
4. **Graceful Loading**: Fallback UI while loading

### Loading Flow

```
Component requested
  ↓
Suspense boundary catches
  ↓
Shows fallback (skeleton)
  ↓
Component bundle downloads
  ↓
Component code executes
  ↓
Suspense resolves
  ↓
Component renders
```

---

## Skeleton Loading States

### Skeleton Loader Component

**File: `components/skeleton/index.tsx`**

```typescript
export function SkeletonLoader({ componentName }: { componentName: string }) {
  // Match skeleton to component type
  const baseName = componentName.match(/^(.*?)(\d+)$/)?.[1];

  switch (baseName) {
    case "hero":
      return <HeroSkeleton1 />;
    case "header":
      return <StaticHeaderSkeleton1 />;
    case "grid":
      return <GridSkeleton1 />;
    case "filterButtons":
      return <FilterButtonsSkeleton1 />;
    case "halfTextHalfImage":
      return <HalfTextHalfImageSkeleton1 />;
    case "contactCards":
      return <ContactCardsSkeleton1 />;
    default:
      return <DefaultSkeleton />;
  }
}
```

### Example: HeroSkeleton1

```typescript
export function HeroSkeleton1() {
  return (
    <div className="w-full h-[600px] bg-gray-100 animate-pulse">
      <div className="container mx-auto h-full flex flex-col justify-center items-center">
        {/* Title skeleton */}
        <div className="h-12 bg-gray-300 rounded w-3/4 mb-4"></div>

        {/* Subtitle skeleton */}
        <div className="h-6 bg-gray-300 rounded w-1/2 mb-8"></div>

        {/* Button skeleton */}
        <div className="h-12 bg-gray-300 rounded w-40"></div>
      </div>
    </div>
  );
}
```

### Page-Level Loading States

**File: `app/HomePageWrapper.tsx`**

```typescript
if (shouldShowLoading || !componentsList) {
  return (
    <I18nProvider>
      <div className="min-h-screen flex flex-col" dir="rtl">
        {/* Header Skeleton */}
        <StaticHeaderSkeleton1 />

        {/* Page-specific Skeleton Content */}
        <main className="flex-1">
          <HeroSkeleton1 />
        </main>
      </div>
    </I18nProvider>
  );
}
```

---

## Fallback Handling

### Level 1: Component Not Found

```typescript
const loadComponent = (section: string, componentName: string) => {
  // ... validation ...

  const fullPath = `${subPath}/${componentName}`;

  return lazy(() =>
    import(`@/components/tenant/${fullPath}`).catch(() => ({
      default: () => (
        <div className="p-8 border border-red-300 bg-red-50">
          <p className="text-red-600">
            Component {componentName} not found
          </p>
        </div>
      ),
    })),
  );
};
```

### Level 2: Invalid Component Type

```typescript
const subPath = getComponentSubPath(baseName);

if (!subPath) {
  // Use fallback path
  const fallbackPath = "hero";
  const fallbackFullPath = `${fallbackPath}/${componentName}`;

  return lazy(() =>
    import(`@/components/tenant/${fallbackFullPath}`).catch(() => ({
      default: (props: any) => (
        <div className="p-8 bg-yellow-50 border border-yellow-300">
          <div className="text-yellow-600 font-semibold">
            Unknown Component: {baseName}
          </div>
          <div className="text-gray-600 text-sm">
            Component file: {componentName} (fallback: {fallbackFullPath})
          </div>
        </div>
      ),
    })),
  );
}
```

### Level 3: Null Component

```typescript
{filteredComponentsList.map((comp: any) => {
  const Cmp = loadComponent("homepage", comp.componentName);

  if (!Cmp) {
    return <Fragment key={comp.id} />; // Render nothing
  }

  return <Cmp key={comp.id} {...comp.data} />;
})}
```

### Level 4: Empty Component List

```typescript
{Array.isArray(filteredComponentsList) && filteredComponentsList.length > 0 ? (
  filteredComponentsList.map((comp) => {
    // ... render components
  })
) : (
  <div className="p-8 text-center text-gray-500">
    No components
  </div>
)}
```

---

## Default Components

### Default Components Definition

**File: `lib-liveeditor/defaultComponents.js`**

```javascript
import defaultData from "../lib/defaultData.json";

export const PAGE_DEFINITIONS = defaultData.componentSettings;
```

**File: `lib/defaultData.json`**

```json
{
  "componentSettings": {
    "homepage": {
      "header-default": {
        "componentName": "header1",
        "type": "header",
        "position": 0,
        "data": {
          "logo": {
            "image": "/logo.png",
            "alt": "Logo"
          }
        }
      },
      "hero-default": {
        "componentName": "hero1",
        "type": "hero",
        "position": 1,
        "data": {
          "title": "Welcome",
          "subtitle": "Default hero content"
        }
      }
    }
  }
}
```

### Using Default Components

```typescript
const componentsList = useMemo(() => {
  // Try to get from tenant data first
  if (tenantData?.componentSettings?.homepage) {
    return /* ... process tenant components */;
  }

  // Fallback to default components
  const defaultComponentsList = Object.entries(PAGE_DEFINITIONS.homepage).map(
    ([key, component], index) => {
      return {
        id: `default-${index}`,
        componentName: component.componentName,
        data: component.data || {},
        position: component.position || index,
      };
    },
  );

  return defaultComponentsList;
}, [tenantData]);
```

---

## Component Centering System

### Centering Configuration

**File: `lib/ComponentsInCenter.ts`**

```typescript
const COMPONENTS_TO_CENTER = [
  "contactCards1",
  "contactFormSection1",
  "inputs1",
  "inputs2",
  // ... more components
];

export function shouldCenterComponent(componentName: string): boolean {
  return COMPONENTS_TO_CENTER.includes(componentName);
}

export function getCenterWrapperClasses(componentName: string): string {
  if (shouldCenterComponent(componentName)) {
    return "flex justify-center items-center min-h-screen";
  }
  return "";
}

export function getCenterWrapperStyles(componentName: string): object {
  if (shouldCenterComponent(componentName)) {
    return {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };
  }
  return {};
}
```

### Using Centering

```typescript
{filteredComponentsList.map((comp: any) => {
  const Cmp = loadComponent("homepage", comp.componentName);

  const centerWrapperClasses = getCenterWrapperClasses(comp.componentName);
  const centerWrapperStyles = getCenterWrapperStyles(comp.componentName);

  const componentElement = (
    <Suspense fallback={<SkeletonLoader componentName={comp.componentName} />}>
      <Cmp {...comp.data} useStore variant={comp.id} />
    </Suspense>
  );

  // Wrap in centering div if needed
  if (shouldCenterComponent(comp.componentName)) {
    return (
      <div
        key={comp.id}
        className={centerWrapperClasses}
        style={centerWrapperStyles as React.CSSProperties}
      >
        {componentElement}
      </div>
    );
  }

  return <Fragment key={comp.id}>{componentElement}</Fragment>;
})}
```

---

## Global vs Page Components

### Global Components

**Not in componentsList, rendered separately:**

```typescript
return (
  <div>
    {/* Global Header - always shown */}
    <StaticHeader1 />

    {/* Page components */}
    <main>
      {componentsList.map(/* ... */)}
    </main>

    {/* Global Footer - always shown */}
    <StaticFooter1 />
  </div>
);
```

### Filtering Global Components

```typescript
const filteredComponentsList = componentsList.filter((comp: any) => {
  // Remove header and footer from page components
  if (comp.componentName?.startsWith("header")) return false;
  if (comp.componentName?.startsWith("footer")) return false;
  return true;
});
```

**Why?**

- Header and footer are global (same across all pages)
- Loaded from `globalComponentsData` instead of `componentSettings`
- Always rendered at fixed positions

---

## Component Data Sources

### Source 1: Tenant-Specific Data

```typescript
const tenantData = useTenantStore((s) => s.tenantData);

// tenantData.componentSettings.homepage['hero-1'].data
```

### Source 2: Default Data

```typescript
import { PAGE_DEFINITIONS } from "@/lib-liveeditor/defaultComponents";

// PAGE_DEFINITIONS.homepage['hero-default'].data
```

### Source 3: Props (Direct)

```typescript
<Hero1 title="Custom Title" subtitle="Custom Subtitle" />
```

### Priority Order

1. **Props** (if passed directly) - Highest priority
2. **Tenant Data** (from componentSettings)
3. **Default Data** (from PAGE_DEFINITIONS)
4. **Hardcoded Defaults** (in component file) - Lowest priority

---

## Complete Component Loading Flow

```
1. Page loads (e.g., HomePageWrapper)
   ↓
2. Fetch tenant data from API/store
   ↓
3. Extract componentSettings for current page
   ↓
4. Process components:
   - Parse componentSettings object
   - Extract: id, componentName, data, position
   - Sort by position
   ↓
5. Filter out global components (header, footer)
   ↓
6. Map over component list:
   ↓
   For each component:
   ├─ Call loadComponent(section, componentName)
   │  ├─ Parse componentName → baseName + number
   │  ├─ Get subPath from registry
   │  ├─ Build fullPath
   │  └─ Return lazy(() => import(fullPath))
   │
   ├─ Check if component should be centered
   │
   ├─ Wrap in Suspense
   │  ├─ Fallback: SkeletonLoader
   │  └─ Component: Lazy-loaded component
   │
   └─ Pass props:
      ├─ Spread component.data
      ├─ useStore flag
      └─ variant ID
   ↓
7. Render components in order
   ↓
8. Display skeletons while loading
   ↓
9. Replace skeletons with actual components
   ↓
10. Page fully rendered
```

---

## Helper Functions

### getComponentSubPath()

```typescript
export const getComponentSubPath = (baseName: string): string | undefined => {
  const component = COMPONENTS[baseName];
  return component?.subPath;
};

// Example:
getComponentSubPath("hero"); // → "hero"
getComponentSubPath("halfTextHalfImage"); // → "halfTextHalfImage"
```

### getSectionPath()

```typescript
export const getSectionPath = (section: string): string => {
  const sectionObj = SECTIONS[section];
  return sectionObj ? sectionObj.path : section;
};

// Example:
getSectionPath("homepage"); // → "homepage"
getSectionPath("for-rent"); // → "for-rent"
```

### getComponentById()

```typescript
export const getComponentById = (id: string): ComponentType | undefined => {
  return COMPONENTS[id];
};

// Example:
getComponentById("hero"); // → { id: "hero", name: "hero", ... }
```

---

## Performance Optimizations

### 1. Code Splitting

Each component is in its own bundle:

```
hero1.tsx → hero1.bundle.js (loaded only when needed)
hero2.tsx → hero2.bundle.js
header1.tsx → header1.bundle.js
```

### 2. Lazy Loading

Components loaded only when scrolled into view (with Suspense).

### 3. Memoization

```typescript
const componentsList = useMemo(() => {
  // ... expensive processing
}, [tenantData]);
```

### 4. Fragment Optimization

```typescript
if (!Cmp) {
  return <Fragment key={comp.id} />; // No DOM node
}
```

---

## Error Boundaries

### Component-Level Error Boundary

```typescript
class ComponentErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Component error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 border border-red-300">
          <p className="text-red-600">Something went wrong loading this component.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage:
<ComponentErrorBoundary>
  <Suspense fallback={<Skeleton />}>
    <DynamicComponent />
  </Suspense>
</ComponentErrorBoundary>
```

---

## Summary

### Key Concepts

1. **Dynamic Loading**: Components loaded on-demand using `lazy()`
2. **Naming Convention**: `{baseName}{number}` (e.g., `hero1`)
3. **Data Sources**: Tenant data → Default data → Hardcoded
4. **Fallback Chain**: Multiple levels of error handling
5. **Skeleton States**: Graceful loading experience
6. **Code Splitting**: Each component is separate bundle
7. **Global vs Page**: Header/footer separate from page components

### Component Flow

```
ComponentName (e.g., "hero2")
  ↓
Parse → baseName="hero", number="2"
  ↓
Get subPath from registry → "hero"
  ↓
Build fullPath → "hero/hero2"
  ↓
Lazy import → import("@/components/tenant/hero/hero2")
  ↓
Wrap in Suspense + Skeleton
  ↓
Pass data as props
  ↓
Render component
```

### Best Practices

1. **Always wrap in Suspense** for lazy-loaded components
2. **Provide skeleton fallback** for better UX
3. **Handle errors gracefully** with multiple fallback levels
4. **Memoize component lists** to avoid re-processing
5. **Filter global components** to avoid duplication
6. **Use Fragment for null cases** to avoid empty DOM nodes

This system enables a flexible, performant, and maintainable component architecture that scales with the application's needs.
