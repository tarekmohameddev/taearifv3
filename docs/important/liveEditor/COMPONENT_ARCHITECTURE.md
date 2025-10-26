# Component Architecture - Complete Reference

## Table of Contents
1. [Overview](#overview)
2. [Component Registry System](#component-registry-system)
3. [Component Structure Definitions](#component-structure-definitions)
4. [Component Functions Pattern](#component-functions-pattern)
5. [Component Implementation Pattern](#component-implementation-pattern)
6. [Adding New Component Types](#adding-new-component-types)

---

## Overview

The Live Editor uses a **registry-based architecture** where all component types are centrally managed. This provides:
- **Single source of truth**: ComponentsList.tsx defines all components
- **Consistent patterns**: All components follow same structure
- **Easy extensibility**: Add new components by following pattern
- **Type safety**: TypeScript interfaces ensure correctness

### Component Layers

```
┌─────────────────────────────────────────────────────────────┐
│                  COMPONENT REGISTRY                          │
│  ComponentsList.tsx                                         │
│  - Defines all component types                              │
│  - Maps to structures and functions                         │
└─────────────────┬───────────────────────────────────────────┘
                  │
      ┌───────────┴───────────┬─────────────────┐
      ▼                       ▼                 ▼
┌──────────────┐    ┌──────────────┐   ┌──────────────┐
│  Structure   │    │  Functions   │   │  Component   │
│  Definition  │    │  Module      │   │  Files       │
│              │    │              │   │              │
│ hero.ts      │    │ heroFunc.ts  │   │ hero1.tsx    │
│              │    │              │   │ hero2.tsx    │
└──────────────┘    └──────────────┘   └──────────────┘
      │                       │                 │
      └───────────────────────┴─────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   editorStore.ts      │
              │  - Component states   │
              │  - Generic functions  │
              └───────────────────────┘
```

---

## Component Registry System

### ComponentsList.tsx

**Location**: `lib-liveeditor/ComponentsList.tsx`

**Purpose**: Central registry of all component types

#### Structure

```typescript
// Component type definition
export interface ComponentType {
  id: string;              // "hero"
  name: string;            // "hero"
  displayName: string;     // "Hero"
  description: string;     // "Main banner section..."
  category: string;        // "banner"
  section: string;         // "homepage"
  subPath: string;         // "hero"
  variants: any[];         // From structure
  icon: string;            // "🌟"
  hasStore?: boolean;      // (optional) has dedicated store
  hasStructure?: boolean;  // (optional) has structure definition
  defaultTheme?: string;   // "hero1"
}

// Main registry
export const COMPONENTS: Record<string, ComponentType> = {
  hero: {
    id: "hero",
    name: "hero",
    displayName: "Hero",
    description: "Main banner section with compelling headline and call-to-action",
    category: "banner",
    section: "homepage",
    subPath: "hero",
    icon: "🌟",
    defaultTheme: "hero1",
    ...heroStructure  // Spreads variants and other structure data
  },
  
  header: {
    id: "header",
    name: "header",
    displayName: "Header",
    description: "Navigation bar with logo, menu, and user actions",
    category: "navigation",
    section: "homepage",
    subPath: "header",
    icon: "📄",
    ...headerStructure
  },
  
  halfTextHalfImage: {
    id: "halfTextHalfImage",
    name: "halfTextHalfImage",
    displayName: "Half Text Half Image",
    description: "Section with text content and image side by side",
    category: "content",
    section: "homepage",
    subPath: "halfTextHalfImage",
    icon: "🖼️",
    ...halfTextHalfImageStructure
  },
  
  // ... more components
};
```

#### Helper Functions

```typescript
// Get component by ID
export const getComponentById = (id: string): ComponentType | undefined => {
  return COMPONENTS[id];
};

// Get all components for a section
export const getComponentsBySection = (sectionId: string): ComponentType[] => {
  return Object.values(COMPONENTS).filter(comp => comp.section === sectionId);
};

// Get display name
export const getComponentDisplayName = (type: string): string => {
  const component = COMPONENTS[type];
  return component ? component.displayName : type;
};

// Get default theme
export const getComponentDefaultTheme = (type: string): string => {
  const component = COMPONENTS[type];
  return component ? component.defaultTheme || `${type}1` : `${type}1`;
};

// Validate component type
export const isValidComponentType = (type: string): boolean => {
  return type in COMPONENTS;
};
```

#### With i18n Support

```typescript
// Get components with translations
export const getComponents = (
  t: (key: string) => string
): Record<string, ComponentType> => ({
  hero: {
    id: "hero",
    name: "hero",
    displayName: t("components.hero.display_name"),
    description: t("components.hero.description"),
    category: "banner",
    section: "homepage",
    subPath: "hero",
    icon: "🌟",
    ...heroStructure
  },
  // ... more components with translations
});

// Get translated component by ID
export const getComponentByIdTranslated = (
  id: string,
  t: (key: string) => string
): ComponentType | undefined => {
  const components = getComponents(t);
  return components[id];
};
```

---

## Component Structure Definitions

### Structure File Pattern

**Location**: `componentsStructure/{componentType}.ts`

**Example**: `componentsStructure/hero.ts`

```typescript
import { ComponentStructure } from "./types";

export const heroStructure: ComponentStructure = {
  componentType: "hero",
  
  variants: [
    // ═══════════════════════════════════════════════════════════
    // VARIANT 1: Hero with Search Form
    // ═══════════════════════════════════════════════════════════
    {
      id: "hero1",
      name: "Hero with Search Form",
      description: "Full-height hero with background and search form",
      componentPath: "components/tenant/hero/hero1.tsx",
      
      // All editable fields
      fields: [
        {
          key: "visible",
          label: "Visible",
          type: "boolean"
        },
        {
          key: "height",
          label: "Height",
          type: "object",
          fields: [
            {
              key: "desktop",
              label: "Desktop Height",
              type: "text",
              placeholder: "90vh"
            },
            {
              key: "tablet",
              label: "Tablet Height",
              type: "text",
              placeholder: "90vh"
            },
            {
              key: "mobile",
              label: "Mobile Height",
              type: "text",
              placeholder: "90vh"
            }
          ]
        },
        {
          key: "background",
          label: "Background",
          type: "object",
          fields: [
            {
              key: "image",
              label: "Background Image",
              type: "image"
            },
            {
              key: "overlay",
              label: "Overlay Settings",
              type: "object",
              fields: [
                {
                  key: "enabled",
                  label: "Enable Overlay",
                  type: "boolean"
                },
                {
                  key: "opacity",
                  label: "Opacity",
                  type: "text",
                  placeholder: "0.45"
                },
                {
                  key: "color",
                  label: "Overlay Color",
                  type: "color"
                }
              ]
            }
          ]
        },
        {
          key: "content",
          label: "Content",
          type: "object",
          fields: [
            {
              key: "title",
              label: "Title",
              type: "text",
              placeholder: "Discover Your Perfect Property",
              min: 10,
              max: 100
            },
            {
              key: "subtitle",
              label: "Subtitle",
              type: "textarea",
              placeholder: "We offer the best...",
              max: 200
            }
          ]
        }
        // ... more fields
      ],
      
      // Simplified fields for "Simple" mode
      simpleFields: [
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
        {
          key: "content.subtitle",
          label: "Subtitle",
          type: "textarea"
        },
        {
          key: "background.image",
          label: "Background Image",
          type: "image"
        }
      ]
    },
    
    // ═══════════════════════════════════════════════════════════
    // VARIANT 2: Simple Hero Banner
    // ═══════════════════════════════════════════════════════════
    {
      id: "hero2",
      name: "Simple Hero Banner",
      description: "Fixed-height hero banner without search form",
      componentPath: "components/tenant/hero/hero2.tsx",
      
      fields: [
        // Different field set for hero2
      ],
      
      simpleFields: [
        // Simplified fields for hero2
      ]
    }
  ]
};
```

### Field Definition Types

```typescript
// Base field
{
  key: "title",               // Property path
  label: "Title",             // Display label
  type: "text",               // Field type
  placeholder: "Enter...",    // Placeholder text
  min: 3,                     // Min length/value
  max: 100,                   // Max length/value
  defaultValue: "Default",    // Default value
  description: "Help text",   // Description
  condition: {                // Conditional rendering
    field: "type",
    value: "advanced"
  }
}

// Object field
{
  key: "content",
  label: "Content",
  type: "object",
  fields: [                   // Nested fields
    { key: "title", type: "text", ... },
    { key: "subtitle", type: "textarea", ... }
  ]
}

// Array field
{
  key: "menu",
  label: "Menu Items",
  type: "array",
  itemLabel: "Menu Item",     // Label for items
  addLabel: "Add Menu Item",  // Add button label
  minItems: 1,                // Minimum items
  maxItems: 10,               // Maximum items
  of: [                       // Item field definitions
    { key: "text", type: "text", ... },
    { key: "url", type: "text", ... }
  ]
}
```

---

## Component Functions Pattern

### Functions Module

**Location**: `context-liveeditor/editorStoreFunctions/{componentType}Functions.ts`

**Example**: `heroFunctions.ts`

```typescript
import { ComponentData } from "@/lib/types";
import { updateDataByPath } from "./types";

// ═══════════════════════════════════════════════════════════
// DEFAULT DATA FUNCTIONS
// ═══════════════════════════════════════════════════════════

export const getDefaultHeroData = (): ComponentData => ({
  visible: true,
  height: {
    desktop: "90vh",
    tablet: "90vh",
    mobile: "90vh"
  },
  background: {
    image: "https://dalel-lovat.vercel.app/images/hero.webp",
    overlay: {
      enabled: true,
      opacity: "0.45",
      color: "#000000"
    }
  },
  content: {
    title: "Discover Your Perfect Property",
    subtitle: "We offer the best real estate options",
    font: {
      title: {
        family: "Tajawal",
        size: { desktop: "5xl", tablet: "4xl", mobile: "2xl" },
        weight: "extrabold",
        color: "#ffffff"
      }
    }
  },
  searchForm: {
    enabled: true,
    position: "bottom",
    // ... extensive configuration
  },
  animations: {
    title: { enabled: true, type: "fade-up", duration: 600 },
    subtitle: { enabled: true, type: "fade-up", duration: 600 }
  }
});

// Variant-specific defaults
export const getDefaultHero2Data = (): ComponentData => ({
  visible: true,
  height: { desktop: "229px", tablet: "229px", mobile: "229px" },
  background: {
    image: "https://dalel-lovat.vercel.app/images/hero.webp",
    overlay: { enabled: true, opacity: "0.6", color: "#000000" }
  },
  content: {
    title: "About Us",
    description: "Your trusted partner in real estate"
  }
  // ... hero2-specific structure
});

// ═══════════════════════════════════════════════════════════
// COMPONENT FUNCTIONS
// ═══════════════════════════════════════════════════════════

export const heroFunctions = {
  // ─────────────────────────────────────────────────────────
  // ENSURE VARIANT: Initialize component if not exists
  // ─────────────────────────────────────────────────────────
  ensureVariant: (
    state: any,
    variantId: string,
    initial?: ComponentData
  ) => {
    console.log("🔍 heroFunctions.ensureVariant called:", {
      variantId,
      hasInitial: !!initial,
      existingData: state.heroStates[variantId]
    });
    
    // Priority 1: Use initial data if provided
    if (initial && Object.keys(initial).length > 0) {
      return {
        heroStates: {
          ...state.heroStates,
          [variantId]: initial
        }
      };
    }
    
    // Priority 2: Component already exists
    if (
      state.heroStates[variantId] &&
      Object.keys(state.heroStates[variantId]).length > 0
    ) {
      return {};  // No changes needed
    }
    
    // Priority 3: Create with defaults
    const defaultData = variantId === "hero2"
      ? getDefaultHero2Data()
      : getDefaultHeroData();
    
    const data = initial || state.tempData || defaultData;
    
    return {
      heroStates: {
        ...state.heroStates,
        [variantId]: data
      }
    };
  },
  
  // ─────────────────────────────────────────────────────────
  // GET DATA: Retrieve component data
  // ─────────────────────────────────────────────────────────
  getData: (state: any, variantId: string) => {
    return state.heroStates[variantId] || {};
  },
  
  // ─────────────────────────────────────────────────────────
  // SET DATA: Set/replace component data
  // ─────────────────────────────────────────────────────────
  setData: (
    state: any,
    variantId: string,
    data: ComponentData
  ) => {
    const currentPage = state.currentPage;
    const updatedPageComponents = 
      state.pageComponentsByPage[currentPage] || [];
    
    // Update page components to keep in sync
    const updatedComponents = updatedPageComponents.map((comp: any) => {
      if (comp.type === "hero" && comp.id === variantId) {
        return { ...comp, data: data };
      }
      return comp;
    });
    
    return {
      heroStates: {
        ...state.heroStates,
        [variantId]: data
      },
      pageComponentsByPage: {
        ...state.pageComponentsByPage,
        [currentPage]: updatedComponents
      }
    };
  },
  
  // ─────────────────────────────────────────────────────────
  // UPDATE BY PATH: Update specific field via path
  // ─────────────────────────────────────────────────────────
  updateByPath: (
    state: any,
    variantId: string,
    path: string,
    value: any
  ) => {
    const source = state.heroStates[variantId] || {};
    const newData = updateDataByPath(source, path, value);
    
    const currentPage = state.currentPage;
    const updatedPageComponents = 
      state.pageComponentsByPage[currentPage] || [];
    
    const updatedComponents = updatedPageComponents.map((comp: any) => {
      if (comp.type === "hero" && comp.id === variantId) {
        return { ...comp, data: newData };
      }
      return comp;
    });
    
    return {
      heroStates: {
        ...state.heroStates,
        [variantId]: newData
      },
      pageComponentsByPage: {
        ...state.pageComponentsByPage,
        [currentPage]: updatedComponents
      }
    };
  }
};
```

### Integration in editorStore

```typescript
// In editorStore.ts

// Component state
heroStates: {},

// Generic function routes to specific functions
ensureComponentVariant: (componentType, variantId, initial) =>
  set((state) => {
    switch (componentType) {
      case "hero":
        return heroFunctions.ensureVariant(state, variantId, initial);
      
      case "header":
        return headerFunctions.ensureVariant(state, variantId, initial);
      
      case "halfTextHalfImage":
        return halfTextHalfImageFunctions.ensureVariant(state, variantId, initial);
      
      // ... more component types
      
      default:
        // Fallback for unknown types
        const defaultData = createDefaultData(componentType);
        return {
          componentStates: {
            ...state.componentStates,
            [componentType]: {
              ...state.componentStates[componentType],
              [variantId]: initial || defaultData
            }
          }
        };
    }
  }),

// Similar routing for getData, setData, updateByPath
getComponentData: (componentType, variantId) => {
  const state = get();
  
  switch (componentType) {
    case "hero":
      return heroFunctions.getData(state, variantId);
    
    case "header":
      return headerFunctions.getData(state, variantId);
    
    // ... more cases
    
    default:
      return state.componentStates[componentType]?.[variantId] || {};
  }
},

setComponentData: (componentType, variantId, data) =>
  set((state) => {
    let newState;
    
    switch (componentType) {
      case "hero":
        newState = heroFunctions.setData(state, variantId, data);
        break;
      
      // ... more cases
      
      default:
        newState = {
          componentStates: {
            ...state.componentStates,
            [componentType]: {
              ...state.componentStates[componentType],
              [variantId]: data
            }
          }
        };
    }
    
    // Update pageComponents
    const updatedComponents = updatePageComponents(state, componentType, variantId, data);
    
    return {
      ...newState,
      pageComponentsByPage: {
        ...state.pageComponentsByPage,
        [state.currentPage]: updatedComponents
      }
    };
  }),

updateComponentByPath: (componentType, variantId, path, value) =>
  set((state) => {
    let newState;
    
    switch (componentType) {
      case "hero":
        newState = heroFunctions.updateByPath(state, variantId, path, value);
        break;
      
      // ... more cases
    }
    
    return newState;
  })
```

---

## Component Implementation Pattern

### Standard Component Structure

**Location**: `components/tenant/{componentType}/{componentName}.tsx`

**Example**: `components/tenant/hero/hero1.tsx`

```typescript
"use client";
import { useEffect } from "react";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { getDefaultHeroData } from "@/context-liveeditor/editorStoreFunctions/heroFunctions";

interface HeroProps {
  useStore?: boolean;      // Enable store integration
  variant?: string;        // Variant identifier (UUID or name)
  id?: string;             // Component instance ID
  deviceType?: string;     // "phone" | "tablet" | "laptop"
  forceUpdate?: number;    // Timestamp to force re-render
  [key: string]: any;      // Allow any props
}

export default function Hero1(props: HeroProps = {}) {
  // ═══════════════════════════════════════════════════════════
  // STEP 1: Determine Unique ID
  // ═══════════════════════════════════════════════════════════
  const variantId = props.variant || "hero1";
  const uniqueId = props.id || variantId;
  
  // ═══════════════════════════════════════════════════════════
  // STEP 2: Connect to Stores
  // ═══════════════════════════════════════════════════════════
  const ensureComponentVariant = useEditorStore(s => s.ensureComponentVariant);
  const getComponentData = useEditorStore(s => s.getComponentData);
  const heroStates = useEditorStore(s => s.heroStates);
  
  const tenantData = useTenantStore(s => s.tenantData);
  const tenantId = useTenantStore(s => s.tenantId);
  const fetchTenantData = useTenantStore(s => s.fetchTenantData);
  
  // ═══════════════════════════════════════════════════════════
  // STEP 3: Initialize in Store
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    if (props.useStore) {
      const initialData = {
        ...getDefaultHeroData(),  // Defaults
        ...props                  // Override with props
      };
      
      ensureComponentVariant("hero", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant]);
  
  // ═══════════════════════════════════════════════════════════
  // STEP 4: Fetch Tenant Data (if needed)
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);
  
  // ═══════════════════════════════════════════════════════════
  // STEP 5: Extract Tenant Component Data
  // ═══════════════════════════════════════════════════════════
  const getTenantComponentData = () => {
    if (!tenantData?.componentSettings) return {};
    
    // Search in all pages
    for (const [pageSlug, pageComponents] of Object.entries(
      tenantData.componentSettings
    )) {
      if (typeof pageComponents === "object") {
        for (const [componentId, component] of Object.entries(
          pageComponents as any
        )) {
          if (
            component.type === "hero" &&
            component.componentName === variantId &&
            componentId === props.id
          ) {
            return component.data;
          }
        }
      }
    }
    
    return {};
  };
  
  const tenantComponentData = getTenantComponentData();
  
  // ═══════════════════════════════════════════════════════════
  // STEP 6: Get Store Data
  // ═══════════════════════════════════════════════════════════
  const storeData = props.useStore
    ? getComponentData("hero", uniqueId) || {}
    : {};
  
  const currentStoreData = props.useStore
    ? heroStates[uniqueId] || {}
    : {};
  
  // ═══════════════════════════════════════════════════════════
  // STEP 7: Merge Data (Priority System)
  // ═══════════════════════════════════════════════════════════
  const defaultData = getDefaultHeroData();
  
  const mergedData = {
    ...defaultData,           // Priority 1 (lowest)
    ...props,                 // Priority 2
    ...tenantComponentData,   // Priority 3
    ...storeData,             // Priority 4
    ...currentStoreData,      // Priority 5 (highest)
    
    // Deep merge nested objects
    content: {
      ...defaultData.content,
      ...(props.content || {}),
      ...(tenantComponentData.content || {}),
      ...(storeData.content || {}),
      ...(currentStoreData.content || {}),
      
      font: {
        ...defaultData.content?.font,
        ...(props.content?.font || {}),
        ...(tenantComponentData.content?.font || {}),
        ...(storeData.content?.font || {}),
        ...(currentStoreData.content?.font || {})
      }
    },
    
    background: {
      ...defaultData.background,
      ...(props.background || {}),
      ...(tenantComponentData.background || {}),
      ...(storeData.background || {}),
      ...(currentStoreData.background || {})
    }
    
    // ... more nested merges
  };
  
  // ═══════════════════════════════════════════════════════════
  // STEP 8: Render Component
  // ═══════════════════════════════════════════════════════════
  return (
    <section
      className="hero-section"
      style={{
        height: mergedData.height?.desktop || "90vh",
        backgroundImage: `url(${mergedData.background?.image})`,
        backgroundColor: mergedData.background?.color || "transparent"
      }}
    >
      <div className="hero-overlay" style={{
        opacity: mergedData.background?.overlay?.opacity || 0.45,
        backgroundColor: mergedData.background?.overlay?.color || "#000000"
      }} />
      
      <div className="hero-content">
        <h1 style={{
          fontFamily: mergedData.content?.font?.title?.family,
          fontSize: mergedData.content?.font?.title?.size?.desktop,
          color: mergedData.content?.font?.title?.color
        }}>
          {mergedData.content?.title || "Default Title"}
        </h1>
        
        <p style={{
          fontFamily: mergedData.content?.font?.subtitle?.family,
          fontSize: mergedData.content?.font?.subtitle?.size?.desktop,
          color: mergedData.content?.font?.subtitle?.color
        }}>
          {mergedData.content?.subtitle || "Default Subtitle"}
        </p>
        
        {mergedData.searchForm?.enabled && (
          <SearchForm {...mergedData.searchForm} />
        )}
      </div>
    </section>
  );
}
```

### Key Principles

1. **useStore prop**: Controls whether component uses editorStore
2. **Unique ID**: Use props.id or props.variant as identifier
3. **Default data**: Import from functions module
4. **Multi-source merge**: Combine default, props, tenant, store data
5. **Deep nesting**: Manually merge nested objects
6. **Conditional rendering**: Check flags (enabled, visible, etc.)

---

## Adding New Component Types

### Complete Step-by-Step Guide

```
GOAL: Add new component type "testimonials"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: Create Structure Definition
────────────────────────────────────────────────
File: componentsStructure/testimonials.ts

import { ComponentStructure } from "./types";

export const testimonialsStructure: ComponentStructure = {
  componentType: "testimonials",
  
  variants: [
    {
      id: "testimonials1",
      name: "Testimonials Carousel",
      fields: [
        {
          key: "visible",
          label: "Visible",
          type: "boolean"
        },
        {
          key: "header",
          label: "Header",
          type: "object",
          fields: [
            {
              key: "title",
              label: "Section Title",
              type: "text",
              placeholder: "What Our Clients Say"
            },
            {
              key: "subtitle",
              label: "Section Subtitle",
              type: "textarea"
            }
          ]
        },
        {
          key: "testimonials",
          label: "Testimonials",
          type: "array",
          itemLabel: "Testimonial",
          addLabel: "Add Testimonial",
          of: [
            {
              key: "name",
              label: "Client Name",
              type: "text"
            },
            {
              key: "role",
              label: "Client Role",
              type: "text"
            },
            {
              key: "content",
              label: "Testimonial Content",
              type: "textarea"
            },
            {
              key: "rating",
              label: "Rating (1-5)",
              type: "number"
            },
            {
              key: "image",
              label: "Client Photo",
              type: "image"
            }
          ]
        }
      ],
      
      simpleFields: [
        {
          key: "visible",
          label: "Visible",
          type: "boolean"
        },
        {
          key: "header.title",
          label: "Title",
          type: "text"
        },
        {
          key: "testimonials",
          label: "Testimonials",
          type: "array",
          of: [
            { key: "name", label: "Name", type: "text" },
            { key: "content", label: "Content", type: "textarea" }
          ]
        }
      ]
    }
  ]
};


STEP 2: Create Functions Module
────────────────────────────────────────────────
File: context-liveeditor/editorStoreFunctions/testimonialsFunctions.ts

import { ComponentData } from "@/lib/types";
import { updateDataByPath } from "./types";

export const getDefaultTestimonialsData = (): ComponentData => ({
  visible: true,
  header: {
    title: "What Our Clients Say",
    subtitle: "Real feedback from satisfied customers"
  },
  testimonials: [
    {
      name: "John Doe",
      role: "Property Buyer",
      content: "Excellent service! Found my dream home quickly.",
      rating: 5,
      image: "/testimonials/john.jpg"
    },
    {
      name: "Jane Smith",
      role: "Property Seller",
      content: "Professional and reliable. Highly recommended!",
      rating: 5,
      image: "/testimonials/jane.jpg"
    }
  ],
  carousel: {
    autoplay: true,
    interval: 5000,
    showDots: true,
    showArrows: true
  }
});

export const testimonialsFunctions = {
  ensureVariant: (state, variantId, initial?) => {
    if (
      state.testimonialsStates[variantId] &&
      Object.keys(state.testimonialsStates[variantId]).length > 0
    ) {
      return {};
    }
    
    const defaultData = getDefaultTestimonialsData();
    const data = initial || state.tempData || defaultData;
    
    return {
      testimonialsStates: {
        ...state.testimonialsStates,
        [variantId]: data
      }
    };
  },
  
  getData: (state, variantId) => {
    return state.testimonialsStates[variantId] || {};
  },
  
  setData: (state, variantId, data) => {
    const currentPage = state.currentPage;
    const updatedPageComponents = 
      state.pageComponentsByPage[currentPage] || [];
    
    const updatedComponents = updatedPageComponents.map(comp => {
      if (comp.type === "testimonials" && comp.id === variantId) {
        return { ...comp, data };
      }
      return comp;
    });
    
    return {
      testimonialsStates: {
        ...state.testimonialsStates,
        [variantId]: data
      },
      pageComponentsByPage: {
        ...state.pageComponentsByPage,
        [currentPage]: updatedComponents
      }
    };
  },
  
  updateByPath: (state, variantId, path, value) => {
    const source = state.testimonialsStates[variantId] || {};
    const newData = updateDataByPath(source, path, value);
    
    const currentPage = state.currentPage;
    const updatedPageComponents = 
      state.pageComponentsByPage[currentPage] || [];
    
    const updatedComponents = updatedPageComponents.map(comp => {
      if (comp.type === "testimonials" && comp.id === variantId) {
        return { ...comp, data: newData };
      }
      return comp;
    });
    
    return {
      testimonialsStates: {
        ...state.testimonialsStates,
        [variantId]: newData
      },
      pageComponentsByPage: {
        ...state.pageComponentsByPage,
        [currentPage]: updatedComponents
      }
    };
  }
};


STEP 3: Update editorStore Interface
────────────────────────────────────────────────
File: context-liveeditor/editorStore.ts

// Add imports
import { testimonialsFunctions } from "./editorStoreFunctions/testimonialsFunctions";
import { testimonialsStructure } from "@/componentsStructure/testimonials";

// Add to interface
interface EditorStore {
  // ... existing properties
  
  // Testimonials states
  testimonialsStates: Record<string, ComponentData>;
  ensureTestimonialsVariant: (variantId, initial?) => void;
  getTestimonialsData: (variantId) => ComponentData;
  setTestimonialsData: (variantId, data) => void;
  updateTestimonialsByPath: (variantId, path, value) => void;
}

// Add to initial state
export const useEditorStore = create<EditorStore>((set, get) => ({
  // ... existing state
  
  testimonialsStates: {},
  
  // Add to switch statements
  ensureComponentVariant: (type, id, initial) =>
    set((state) => {
      switch (type) {
        // ... existing cases
        
        case "testimonials":
          return testimonialsFunctions.ensureVariant(state, id, initial);
        
        default:
          // Fallback...
      }
    }),
  
  getComponentData: (type, id) => {
    const state = get();
    switch (type) {
      // ... existing cases
      
      case "testimonials":
        return testimonialsFunctions.getData(state, id);
      
      default:
        // Fallback...
    }
  },
  
  // Similar for setComponentData and updateComponentByPath
  
  // Legacy specific functions (for direct access)
  ensureTestimonialsVariant: (id, initial) =>
    set(state => testimonialsFunctions.ensureVariant(state, id, initial)),
  
  getTestimonialsData: (id) => {
    const state = get();
    return testimonialsFunctions.getData(state, id);
  },
  
  setTestimonialsData: (id, data) =>
    set(state => testimonialsFunctions.setData(state, id, data)),
  
  updateTestimonialsByPath: (id, path, value) =>
    set(state => testimonialsFunctions.updateByPath(state, id, path, value))
}));


STEP 4: Add to ComponentsList
────────────────────────────────────────────────
File: lib-liveeditor/ComponentsList.tsx

import { testimonialsStructure } from "@/componentsStructure/testimonials";

export const COMPONENTS: Record<string, ComponentType> = {
  // ... existing components
  
  testimonials: {
    id: "testimonials",
    name: "testimonials",
    displayName: "Testimonials",
    description: "Customer testimonials and reviews carousel",
    category: "content",
    section: "homepage",
    subPath: "testimonials",
    icon: "💬",
    ...testimonialsStructure  // Spreads variants
  }
};


STEP 5: Create React Component
────────────────────────────────────────────────
File: components/tenant/testimonials/testimonials1.tsx

export default function Testimonials1(props: TestimonialsProps = {}) {
  const variantId = props.variant || "testimonials1";
  const uniqueId = props.id || variantId;
  
  // Connect to stores
  const ensureComponentVariant = useEditorStore(s => s.ensureComponentVariant);
  const getComponentData = useEditorStore(s => s.getComponentData);
  const testimonialsStates = useEditorStore(s => s.testimonialsStates);
  
  // Initialize
  useEffect(() => {
    if (props.useStore) {
      const initialData = {
        ...getDefaultTestimonialsData(),
        ...props
      };
      ensureComponentVariant("testimonials", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore]);
  
  // Merge data
  const defaultData = getDefaultTestimonialsData();
  const storeData = props.useStore
    ? getComponentData("testimonials", uniqueId) || {}
    : {};
  
  const mergedData = {
    ...defaultData,
    ...props,
    ...storeData
  };
  
  // Render
  return (
    <section className="testimonials-section">
      <div className="header">
        <h2>{mergedData.header?.title}</h2>
        <p>{mergedData.header?.subtitle}</p>
      </div>
      
      <div className="carousel">
        {mergedData.testimonials?.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <img src={testimonial.image} alt={testimonial.name} />
            <p className="content">{testimonial.content}</p>
            <p className="name">{testimonial.name}</p>
            <p className="role">{testimonial.role}</p>
            <div className="rating">{"⭐".repeat(testimonial.rating)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}


STEP 6: Add to Utils (for default data)
────────────────────────────────────────────────
File: components/tenant/live-editor/EditorSidebar/utils.ts

import { getDefaultTestimonialsData } from "@/context-liveeditor/editorStoreFunctions/testimonialsFunctions";

export const createDefaultData = (type, componentName?) => {
  switch (type) {
    // ... existing cases
    
    case "testimonials":
      return getDefaultTestimonialsData();
    
    default:
      // Fallback...
  }
};


STEP 7: Add to LoadFromDatabase
────────────────────────────────────────────────
File: context-liveeditor/editorStore.ts

loadFromDatabase: (tenantData) =>
  set((state) => {
    const newState = { ...state };
    
    // ... existing loading logic
    
    // Load testimonials data
    Object.entries(tenantData.componentSettings).forEach(
      ([page, pageSettings]) => {
        if (pageSettings) {
          Object.entries(pageSettings).forEach(([id, comp]) => {
            if (comp.data && comp.componentName) {
              switch (comp.type) {
                // ... existing cases
                
                case "testimonials":
                  newState.testimonialsStates = 
                    testimonialsFunctions.setData(
                      newState,
                      comp.id,        // Use comp.id!
                      comp.data
                    ).testimonialsStates;
                  break;
              }
            }
          });
        }
      }
    );
    
    return newState;
  })


STEP 8: Test Component
────────────────────────────────────────────────
1. Add to page via drag & drop
2. Edit in EditorSidebar
3. Verify real-time updates
4. Save changes
5. Reload page
6. Verify data persisted


RESULT: New component type fully integrated ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Component Variants

### Multiple Variants per Type

Components can have multiple visual variants:

```typescript
// heroStructure has 2 variants
export const heroStructure = {
  componentType: "hero",
  variants: [
    {
      id: "hero1",
      name: "Hero with Search Form",
      fields: [...]  // hero1-specific fields
    },
    {
      id: "hero2",
      name: "Simple Hero Banner",
      fields: [...]  // hero2-specific fields (different!)
    }
  ]
};
```

**How Variants Work**:

1. **Same component type**: Both use "hero" type
2. **Different default data**: hero1 uses getDefaultHeroData(), hero2 uses getDefaultHero2Data()
3. **Different fields**: hero1 has search form fields, hero2 doesn't
4. **Different React components**: hero1.tsx vs hero2.tsx

**Switching Variants**:
```typescript
handleComponentThemeChange(id, "hero2") {
  // Get hero2 default data
  const newData = createDefaultData("hero", "hero2");
  
  // Update component
  return {
    ...component,
    componentName: "hero2",  // Changed from hero1
    data: newData            // hero2 defaults
  };
}
```

---

## Component Categories

Components grouped by category:

```typescript
Categories:
├─ banner:        hero
├─ navigation:    header, footer
├─ content:       halfTextHalfImage, propertySlider, testimonials, whyChooseUs
├─ contact:       contactCards, contactFormSection, contactMapSection
├─ interaction:   filterButtons, propertyFilter
├─ form:          inputs, inputs2, applicationForm
└─ layout:        grid, mapSection
```

**Get by Category**:
```typescript
const contentComponents = getComponentsByCategory("content");
// Returns: [halfTextHalfImage, propertySlider, testimonials, ...]
```

---

## Component Sections

Components grouped by page section:

```typescript
Sections:
└─ homepage:
   ├─ header
   ├─ hero
   ├─ halfTextHalfImage
   ├─ propertySlider
   ├─ ctaValuation
   ├─ stepsSection
   ├─ testimonials
   ├─ whyChooseUs
   ├─ contactCards
   ├─ contactFormSection
   ├─ contactMapSection
   ├─ footer
   └─ ... more
```

**Get by Section**:
```typescript
const homepageComponents = getComponentsBySection("homepage");
// Returns all components available for homepage
```

**Used in**: ComponentsSidebar to show available components for current page

---

## Important Notes for AI

### Component Implementation Checklist

When creating a new component:

- [ ] Create structure in `componentsStructure/`
- [ ] Create functions in `editorStoreFunctions/`
- [ ] Add to ComponentsList.tsx registry
- [ ] Add state to editorStore interface
- [ ] Add to editorStore switches (ensure, get, set, update)
- [ ] Add to loadFromDatabase function
- [ ] Add to createDefaultData in utils.ts
- [ ] Create React component(s) in components/tenant/
- [ ] Export from componentsStructure/index.ts
- [ ] Test: add, edit, save, reload

### Common Patterns

**Pattern 1**: Component with multiple variants
```typescript
// Use variant-specific default data
const defaultData = componentName === "hero2"
  ? getDefaultHero2Data()
  : getDefaultHeroData();
```

**Pattern 2**: Component with nested arrays
```typescript
// Support recursive field rendering
{
  key: "menu",
  type: "array",
  of: [
    {
      key: "submenu",
      type: "array",  // Nested array
      of: [
        // Fields for submenu items
      ]
    }
  ]
}
```

**Pattern 3**: Component with conditional fields
```typescript
// Show field only when condition met
{
  key: "searchForm.fields",
  label: "Search Fields",
  type: "object",
  condition: {
    field: "searchForm.enabled",
    value: true
  }
}
```

### Naming Conventions

- **File names**: camelCase (hero.ts, halfTextHalfImage.ts)
- **Function exports**: camelCase with suffix (heroFunctions, getDefaultHeroData)
- **Component names**: PascalCase (Hero1, HalfTextHalfImage1)
- **Structure exports**: camelCase with suffix (heroStructure)
- **State properties**: camelCase with suffix (heroStates)

---

## Summary

The component architecture provides:

1. **Central registry**: ComponentsList.tsx as single source
2. **Structure definitions**: Declarative field definitions
3. **Function modules**: Consistent CRUD operations
4. **Store integration**: Generic functions route to specific
5. **React components**: Visual implementation
6. **Variant support**: Multiple themes per type
7. **Easy extension**: Follow pattern to add new types

**Key Files**:
- `ComponentsList.tsx`: Registry
- `componentsStructure/{type}.ts`: Structure definition
- `editorStoreFunctions/{type}Functions.ts`: Store functions
- `components/tenant/{type}/{name}.tsx`: React component
- `editorStore.ts`: Store integration

Understanding this architecture enables:
- Adding new component types
- Creating component variants
- Modifying component behavior
- Debugging component issues
- Optimizing component performance

