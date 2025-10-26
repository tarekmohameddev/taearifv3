# Practical Examples - Real-World Scenarios

## Table of Contents
1. [Complete Component Implementation](#complete-component-implementation)
2. [Adding New Component Type](#adding-new-component-type)
3. [Implementing Custom Field Renderer](#implementing-custom-field-renderer)
4. [Advanced Editing Flow](#advanced-editing-flow)
5. [Custom Save Logic](#custom-save-logic)
6. [Complex Data Structures](#complex-data-structures)

---

## Complete Component Implementation

### Example: Creating a "Gallery" Component

#### Step 1: Create Structure Definition

**File**: `componentsStructure/gallery.ts`

```typescript
import { ComponentStructure } from "./types";

export const galleryStructure: ComponentStructure = {
  componentType: "gallery",
  
  variants: [
    {
      id: "gallery1",
      name: "Grid Gallery",
      description: "Image gallery in grid layout",
      componentPath: "components/tenant/gallery/gallery1.tsx",
      
      fields: [
        {
          key: "visible",
          label: "Visible",
          type: "boolean",
          defaultValue: true
        },
        {
          key: "header",
          label: "Header",
          type: "object",
          fields: [
            {
              key: "title",
              label: "Gallery Title",
              type: "text",
              placeholder: "Our Gallery",
              min: 3,
              max: 100
            },
            {
              key: "subtitle",
              label: "Gallery Subtitle",
              type: "textarea",
              placeholder: "Explore our collection...",
              max: 200
            }
          ]
        },
        {
          key: "images",
          label: "Gallery Images",
          type: "array",
          itemLabel: "Image",
          addLabel: "Add Image",
          minItems: 1,
          maxItems: 50,
          of: [
            {
              key: "url",
              label: "Image URL",
              type: "image"
            },
            {
              key: "alt",
              label: "Alt Text",
              type: "text",
              placeholder: "Image description"
            },
            {
              key: "caption",
              label: "Caption",
              type: "text",
              placeholder: "Optional caption"
            },
            {
              key: "featured",
              label: "Featured",
              type: "boolean",
              defaultValue: false
            }
          ]
        },
        {
          key: "layout",
          label: "Layout Settings",
          type: "object",
          fields: [
            {
              key: "columns",
              label: "Columns",
              type: "object",
              fields: [
                {
                  key: "desktop",
                  label: "Desktop Columns",
                  type: "number",
                  min: 1,
                  max: 6,
                  defaultValue: 4
                },
                {
                  key: "tablet",
                  label: "Tablet Columns",
                  type: "number",
                  min: 1,
                  max: 4,
                  defaultValue: 3
                },
                {
                  key: "mobile",
                  label: "Mobile Columns",
                  type: "number",
                  min: 1,
                  max: 2,
                  defaultValue: 2
                }
              ]
            },
            {
              key: "gap",
              label: "Gap Between Images",
              type: "select",
              options: [
                { label: "Small", value: "4" },
                { label: "Medium", value: "8" },
                { label: "Large", value: "12" }
              ],
              defaultValue: "8"
            },
            {
              key: "aspectRatio",
              label: "Image Aspect Ratio",
              type: "select",
              options: [
                { label: "Square (1:1)", value: "1:1" },
                { label: "Landscape (16:9)", value: "16:9" },
                { label: "Portrait (3:4)", value: "3:4" }
              ],
              defaultValue: "1:1"
            }
          ]
        },
        {
          key: "lightbox",
          label: "Lightbox Settings",
          type: "object",
          fields: [
            {
              key: "enabled",
              label: "Enable Lightbox",
              type: "boolean",
              defaultValue: true
            },
            {
              key: "showCaptions",
              label: "Show Captions",
              type: "boolean",
              defaultValue: true,
              condition: {
                field: "lightbox.enabled",
                value: true
              }
            }
          ]
        },
        {
          key: "colors",
          label: "Color Settings",
          type: "object",
          fields: [
            {
              key: "background",
              label: "Background Color",
              type: "color",
              defaultValue: "#F3F4F6"
            },
            {
              key: "text",
              label: "Text Color",
              type: "color",
              defaultValue: "#1F2937"
            },
            {
              key: "border",
              label: "Border Color",
              type: "color",
              defaultValue: "#E5E7EB"
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
          key: "images",
          label: "Images",
          type: "array",
          of: [
            { key: "url", label: "Image URL", type: "image" },
            { key: "alt", label: "Alt Text", type: "text" }
          ]
        },
        {
          key: "layout.columns.desktop",
          label: "Columns",
          type: "number"
        }
      ]
    }
  ]
};
```

#### Step 2: Create Component Functions

**File**: `context-liveeditor/editorStoreFunctions/galleryFunctions.ts`

```typescript
import { ComponentData } from "@/lib/types";
import { updateDataByPath } from "./types";

export const getDefaultGalleryData = (): ComponentData => ({
  visible: true,
  header: {
    title: "Our Gallery",
    subtitle: "Explore our collection of beautiful properties"
  },
  images: [
    {
      url: "https://example.com/gallery/image1.jpg",
      alt: "Modern apartment",
      caption: "Luxury apartment in downtown",
      featured: true
    },
    {
      url: "https://example.com/gallery/image2.jpg",
      alt: "Villa exterior",
      caption: "Spacious villa with garden",
      featured: false
    },
    {
      url: "https://example.com/gallery/image3.jpg",
      alt: "Office space",
      caption: "Modern office in business district",
      featured: false
    }
  ],
  layout: {
    columns: {
      desktop: 4,
      tablet: 3,
      mobile: 2
    },
    gap: "8",
    aspectRatio: "1:1"
  },
  lightbox: {
    enabled: true,
    showCaptions: true
  },
  colors: {
    background: "#F3F4F6",
    text: "#1F2937",
    border: "#E5E7EB"
  }
});

export const galleryFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (
      state.galleryStates[variantId] &&
      Object.keys(state.galleryStates[variantId]).length > 0
    ) {
      return {};
    }
    
    const defaultData = getDefaultGalleryData();
    const data = initial || state.tempData || defaultData;
    
    return {
      galleryStates: {
        ...state.galleryStates,
        [variantId]: data
      }
    };
  },
  
  getData: (state: any, variantId: string) => {
    return state.galleryStates[variantId] || {};
  },
  
  setData: (state: any, variantId: string, data: ComponentData) => {
    const currentPage = state.currentPage;
    const updatedPageComponents = 
      state.pageComponentsByPage[currentPage] || [];
    
    const updatedComponents = updatedPageComponents.map((comp: any) => {
      if (comp.type === "gallery" && comp.id === variantId) {
        return { ...comp, data };
      }
      return comp;
    });
    
    return {
      galleryStates: {
        ...state.galleryStates,
        [variantId]: data
      },
      pageComponentsByPage: {
        ...state.pageComponentsByPage,
        [currentPage]: updatedComponents
      }
    };
  },
  
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source = state.galleryStates[variantId] || {};
    const newData = updateDataByPath(source, path, value);
    
    const currentPage = state.currentPage;
    const updatedPageComponents = 
      state.pageComponentsByPage[currentPage] || [];
    
    const updatedComponents = updatedPageComponents.map((comp: any) => {
      if (comp.type === "gallery" && comp.id === variantId) {
        return { ...comp, data: newData };
      }
      return comp;
    });
    
    return {
      galleryStates: {
        ...state.galleryStates,
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

#### Step 3: Update editorStore

**File**: `context-liveeditor/editorStore.ts`

```typescript
// Add imports
import { galleryFunctions } from "./editorStoreFunctions/galleryFunctions";
import { galleryStructure } from "@/componentsStructure/gallery";

// Add to interface
interface EditorStore {
  // ... existing properties
  
  // Gallery states
  galleryStates: Record<string, ComponentData>;
  ensureGalleryVariant: (variantId: string, initial?: ComponentData) => void;
  getGalleryData: (variantId: string) => ComponentData;
  setGalleryData: (variantId: string, data: ComponentData) => void;
  updateGalleryByPath: (variantId: string, path: string, value: any) => void;
}

// Add to create function
export const useEditorStore = create<EditorStore>((set, get) => ({
  // ... existing state
  
  galleryStates: {},
  
  // Update switches
  ensureComponentVariant: (type, id, initial) =>
    set((state) => {
      switch (type) {
        // ... existing cases
        
        case "gallery":
          return galleryFunctions.ensureVariant(state, id, initial);
        
        default:
          // Fallback...
      }
    }),
  
  getComponentData: (type, id) => {
    const state = get();
    
    switch (type) {
      // ... existing cases
      
      case "gallery":
        return galleryFunctions.getData(state, id);
      
      default:
        // Fallback...
    }
  },
  
  // Similar for setComponentData and updateComponentByPath
  
  // Specific functions
  ensureGalleryVariant: (id, initial) =>
    set(state => galleryFunctions.ensureVariant(state, id, initial)),
  
  getGalleryData: (id) => {
    const state = get();
    return galleryFunctions.getData(state, id);
  },
  
  setGalleryData: (id, data) =>
    set(state => galleryFunctions.setData(state, id, data)),
  
  updateGalleryByPath: (id, path, value) =>
    set(state => galleryFunctions.updateByPath(state, id, path, value))
}));
```

#### Step 4: Add to ComponentsList

**File**: `lib-liveeditor/ComponentsList.tsx`

```typescript
import { galleryStructure } from "@/componentsStructure/gallery";

export const COMPONENTS: Record<string, ComponentType> = {
  // ... existing components
  
  gallery: {
    id: "gallery",
    name: "gallery",
    displayName: "Gallery",
    description: "Image gallery with grid layout and lightbox",
    category: "content",
    section: "homepage",
    subPath: "gallery",
    icon: "🖼️",
    ...galleryStructure
  }
};

// Translated version
export const getComponents = (t: (key: string) => string) => ({
  // ... existing components
  
  gallery: {
    id: "gallery",
    name: "gallery",
    displayName: t("components.gallery.display_name"),
    description: t("components.gallery.description"),
    category: "content",
    section: "homepage",
    subPath: "gallery",
    icon: "🖼️",
    ...galleryStructure
  }
});
```

#### Step 5: Create React Component

**File**: `components/tenant/gallery/gallery1.tsx`

```typescript
"use client";
import { useEffect, useState } from "react";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { getDefaultGalleryData } from "@/context-liveeditor/editorStoreFunctions/galleryFunctions";
import Image from "next/image";

interface GalleryProps {
  useStore?: boolean;
  variant?: string;
  id?: string;
  [key: string]: any;
}

export default function Gallery1(props: GalleryProps = {}) {
  // ═══════════════════════════════════════════════════════════
  // 1. SETUP
  // ═══════════════════════════════════════════════════════════
  const variantId = props.variant || "gallery1";
  const uniqueId = props.id || variantId;
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  
  // ═══════════════════════════════════════════════════════════
  // 2. STORE CONNECTION
  // ═══════════════════════════════════════════════════════════
  const ensureComponentVariant = useEditorStore(s => s.ensureComponentVariant);
  const getComponentData = useEditorStore(s => s.getComponentData);
  const galleryStates = useEditorStore(s => s.galleryStates);
  
  const tenantData = useTenantStore(s => s.tenantData);
  
  // ═══════════════════════════════════════════════════════════
  // 3. INITIALIZATION
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    if (props.useStore) {
      const initialData = {
        ...getDefaultGalleryData(),
        ...props
      };
      
      ensureComponentVariant("gallery", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore]);
  
  // ═══════════════════════════════════════════════════════════
  // 4. DATA MERGING
  // ═══════════════════════════════════════════════════════════
  const getTenantComponentData = () => {
    if (!tenantData?.componentSettings) return {};
    
    for (const [page, components] of Object.entries(tenantData.componentSettings)) {
      if (typeof components === "object") {
        for (const [id, comp] of Object.entries(components as any)) {
          if (comp.type === "gallery" && id === props.id) {
            return comp.data;
          }
        }
      }
    }
    
    return {};
  };
  
  const defaultData = getDefaultGalleryData();
  const tenantComponentData = getTenantComponentData();
  const storeData = props.useStore
    ? getComponentData("gallery", uniqueId) || {}
    : {};
  const currentStoreData = props.useStore
    ? galleryStates[uniqueId] || {}
    : {};
  
  const mergedData = {
    ...defaultData,
    ...props,
    ...tenantComponentData,
    ...storeData,
    ...currentStoreData,
    
    // Deep merge nested objects
    header: {
      ...defaultData.header,
      ...(props.header || {}),
      ...(tenantComponentData.header || {}),
      ...(storeData.header || {}),
      ...(currentStoreData.header || {})
    },
    
    layout: {
      ...defaultData.layout,
      ...(props.layout || {}),
      ...(tenantComponentData.layout || {}),
      ...(storeData.layout || {}),
      ...(currentStoreData.layout || {}),
      
      columns: {
        ...defaultData.layout?.columns,
        ...(props.layout?.columns || {}),
        ...(tenantComponentData.layout?.columns || {}),
        ...(storeData.layout?.columns || {}),
        ...(currentStoreData.layout?.columns || {})
      }
    },
    
    colors: {
      ...defaultData.colors,
      ...(props.colors || {}),
      ...(tenantComponentData.colors || {}),
      ...(storeData.colors || {}),
      ...(currentStoreData.colors || {})
    },
    
    lightbox: {
      ...defaultData.lightbox,
      ...(props.lightbox || {}),
      ...(tenantComponentData.lightbox || {}),
      ...(storeData.lightbox || {}),
      ...(currentStoreData.lightbox || {})
    }
  };
  
  // ═══════════════════════════════════════════════════════════
  // 5. EVENT HANDLERS
  // ═══════════════════════════════════════════════════════════
  const openLightbox = (index: number) => {
    if (mergedData.lightbox?.enabled) {
      setSelectedImage(index);
      setLightboxOpen(true);
    }
  };
  
  const closeLightbox = () => {
    setLightboxOpen(false);
  };
  
  const nextImage = () => {
    const images = mergedData.images || [];
    setSelectedImage((selectedImage + 1) % images.length);
  };
  
  const prevImage = () => {
    const images = mergedData.images || [];
    setSelectedImage((selectedImage - 1 + images.length) % images.length);
  };
  
  // ═══════════════════════════════════════════════════════════
  // 6. RENDER
  // ═══════════════════════════════════════════════════════════
  if (!mergedData.visible) return null;
  
  const images = Array.isArray(mergedData.images) ? mergedData.images : [];
  const columns = mergedData.layout?.columns || { desktop: 4, tablet: 3, mobile: 2 };
  const gap = mergedData.layout?.gap || "8";
  
  return (
    <section
      className="gallery-section py-16"
      style={{
        backgroundColor: mergedData.colors?.background || "#F3F4F6"
      }}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        {mergedData.header?.title && (
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-bold mb-4"
              style={{ color: mergedData.colors?.text || "#1F2937" }}
            >
              {mergedData.header.title}
            </h2>
            
            {mergedData.header.subtitle && (
              <p
                className="text-xl"
                style={{ color: mergedData.colors?.text || "#1F2937" }}
              >
                {mergedData.header.subtitle}
              </p>
            )}
          </div>
        )}
        
        {/* Gallery Grid */}
        <div
          className={`grid gap-${gap}`}
          style={{
            gridTemplateColumns: `repeat(${columns.desktop}, minmax(0, 1fr))`
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="gallery-item cursor-pointer overflow-hidden rounded-lg"
              onClick={() => openLightbox(index)}
              style={{
                aspectRatio: mergedData.layout?.aspectRatio || "1:1",
                border: `1px solid ${mergedData.colors?.border || "#E5E7EB"}`
              }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={image.url}
                  alt={image.alt || "Gallery image"}
                  fill
                  className="object-cover transition-transform hover:scale-110"
                />
                
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                    <p className="text-white text-sm">{image.caption}</p>
                  </div>
                )}
                
                {image.featured && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                    Featured
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Lightbox */}
        {lightboxOpen && mergedData.lightbox?.enabled && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              className="absolute top-4 right-4 text-white text-3xl"
              onClick={closeLightbox}
            >
              ×
            </button>
            
            <button
              className="absolute left-4 text-white text-3xl"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              ‹
            </button>
            
            <div className="max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <Image
                src={images[selectedImage]?.url || ""}
                alt={images[selectedImage]?.alt || ""}
                width={1200}
                height={800}
                className="object-contain"
              />
              
              {mergedData.lightbox.showCaptions && images[selectedImage]?.caption && (
                <p className="text-white text-center mt-4">
                  {images[selectedImage].caption}
                </p>
              )}
            </div>
            
            <button
              className="absolute right-4 text-white text-3xl"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              ›
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
```

#### Step 6: Update Utils

**File**: `components/tenant/live-editor/EditorSidebar/utils.ts`

```typescript
import { getDefaultGalleryData } from "@/context-liveeditor/editorStoreFunctions/galleryFunctions";

export const createDefaultData = (type: string, componentName?: string) => {
  switch (type) {
    // ... existing cases
    
    case "gallery":
      return getDefaultGalleryData();
    
    default:
      // Fallback...
  }
};
```

#### Step 7: Update loadFromDatabase

**File**: `context-liveeditor/editorStore.ts`

```typescript
loadFromDatabase: (tenantData) =>
  set((state) => {
    const newState = { ...state };
    
    // ... existing loading logic
    
    // Load component data
    Object.entries(tenantData.componentSettings).forEach(([page, pageSettings]) => {
      if (pageSettings) {
        Object.entries(pageSettings).forEach(([id, comp]) => {
          if (comp.data && comp.componentName) {
            switch (comp.type) {
              // ... existing cases
              
              case "gallery":
                newState.galleryStates = galleryFunctions.setData(
                  newState,
                  comp.id,
                  comp.data
                ).galleryStates;
                break;
            }
          }
        });
      }
    });
    
    return newState;
  })
```

#### Step 8: Test

```typescript
// 1. Add to page
handleAddSection("gallery");

// 2. Edit in sidebar
// - Opens EditorSidebar
// - Shows gallery fields
// - Edit title, add images, adjust columns

// 3. Save
handleSave();

// 4. Verify in iframe
// - Gallery renders with edited data

// 5. Reload page
// - Data persists ✓
```

---

## Implementing Custom Field Renderer

### Example: ColorGradientRenderer

**Purpose**: Select gradient with multiple color stops

#### Step 1: Create Renderer Component

**File**: `components/tenant/live-editor/EditorSidebar/components/FieldRenderers/ColorGradientRenderer.tsx`

```typescript
import { useState } from "react";
import { ColorFieldRenderer } from "./index";
import { Button } from "@/components/ui/button";

interface ColorGradientRendererProps {
  label: string;
  path: string;
  value: {
    type: "linear" | "radial";
    angle?: number;
    stops: Array<{
      color: string;
      position: number;
    }>;
  };
  updateValue: (path: string, value: any) => void;
}

export function ColorGradientRenderer({
  label,
  path,
  value,
  updateValue
}: ColorGradientRendererProps) {
  const stops = value?.stops || [
    { color: "#3B82F6", position: 0 },
    { color: "#8B5CF6", position: 100 }
  ];
  
  const addStop = () => {
    const newStop = {
      color: "#000000",
      position: 50
    };
    
    updateValue(`${path}.stops`, [...stops, newStop]);
  };
  
  const removeStop = (index: number) => {
    if (stops.length <= 2) {
      alert("Gradient must have at least 2 color stops");
      return;
    }
    
    const newStops = stops.filter((_, i) => i !== index);
    updateValue(`${path}.stops`, newStops);
  };
  
  const updateStop = (index: number, field: string, value: any) => {
    const newStops = stops.map((stop, i) =>
      i === index ? { ...stop, [field]: value } : stop
    );
    
    updateValue(`${path}.stops`, newStops);
  };
  
  // Generate CSS gradient preview
  const gradientCSS = `linear-gradient(
    ${value?.angle || 90}deg,
    ${stops.map(s => `${s.color} ${s.position}%`).join(", ")}
  )`;
  
  return (
    <div className="gradient-renderer">
      <label className="block mb-2 font-medium">{label}</label>
      
      {/* Gradient Preview */}
      <div
        className="w-full h-24 rounded-lg mb-4"
        style={{ background: gradientCSS }}
      />
      
      {/* Gradient Type */}
      <div className="mb-4">
        <label className="text-sm">Type</label>
        <select
          value={value?.type || "linear"}
          onChange={(e) => updateValue(`${path}.type`, e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="linear">Linear</option>
          <option value="radial">Radial</option>
        </select>
      </div>
      
      {/* Angle (for linear) */}
      {value?.type === "linear" && (
        <div className="mb-4">
          <label className="text-sm">Angle (degrees)</label>
          <input
            type="number"
            value={value?.angle || 90}
            onChange={(e) => updateValue(`${path}.angle`, parseInt(e.target.value))}
            min={0}
            max={360}
            className="w-full p-2 border rounded"
          />
        </div>
      )}
      
      {/* Color Stops */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">Color Stops</label>
          <Button size="sm" onClick={addStop}>
            + Add Stop
          </Button>
        </div>
        
        {stops.map((stop, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            {/* Color picker */}
            <div className="flex-1">
              <ColorFieldRenderer
                label={`Stop ${index + 1}`}
                path={`${path}.stops.${index}.color`}
                value={stop.color}
                updateValue={(_, v) => updateStop(index, "color", v)}
              />
            </div>
            
            {/* Position slider */}
            <div className="w-24">
              <input
                type="range"
                min={0}
                max={100}
                value={stop.position}
                onChange={(e) => updateStop(index, "position", parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-center">{stop.position}%</div>
            </div>
            
            {/* Remove button */}
            <Button
              size="sm"
              variant="destructive"
              onClick={() => removeStop(index)}
              disabled={stops.length <= 2}
            >
              ×
            </Button>
          </div>
        ))}
      </div>
      
      {/* CSS Output (for reference) */}
      <details className="mt-4">
        <summary className="text-sm cursor-pointer">CSS Output</summary>
        <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
          {gradientCSS}
        </pre>
      </details>
    </div>
  );
}
```

#### Step 2: Add to DynamicFieldsRenderer

**File**: `components/tenant/live-editor/EditorSidebar/components/DynamicFieldsRenderer.tsx`

```typescript
import { ColorGradientRenderer } from "./FieldRenderers/ColorGradientRenderer";

// In renderField switch statement
switch (def.type) {
  // ... existing cases
  
  case "gradient":  // New type!
    return (
      <ColorGradientRenderer
        label={def.label}
        path={normalizedPath}
        value={value}
        updateValue={updateValue}
      />
    );
  
  // ... other cases
}
```

#### Step 3: Use in Structure

```typescript
// In component structure
{
  key: "background.gradient",
  label: "Background Gradient",
  type: "gradient",  // New type!
  defaultValue: {
    type: "linear",
    angle: 90,
    stops: [
      { color: "#3B82F6", position: 0 },
      { color: "#8B5CF6", position: 100 }
    ]
  }
}
```

---

## Advanced Editing Flow

### Example: Multi-Step Component Configuration

```typescript
// Component that guides user through setup
export function GuidedSetup({ onComplete }) {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({});
  
  const steps = [
    {
      title: "Basic Info",
      fields: ["visible", "header.title", "header.subtitle"]
    },
    {
      title: "Images",
      fields: ["images"]
    },
    {
      title: "Layout",
      fields: ["layout.columns", "layout.gap", "layout.aspectRatio"]
    },
    {
      title: "Colors",
      fields: ["colors.background", "colors.text"]
    }
  ];
  
  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      onComplete(config);
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  return (
    <div className="guided-setup">
      {/* Progress indicator */}
      <div className="progress">
        Step {step} of {steps.length}: {steps[step - 1].title}
      </div>
      
      {/* Current step fields */}
      <DynamicFieldsRenderer
        fields={getFieldsForStep(steps[step - 1].fields)}
        onUpdateByPath={(path, value) => {
          setConfig({ ...config, [path]: value });
        }}
        currentData={config}
      />
      
      {/* Navigation */}
      <div className="flex justify-between mt-4">
        <Button onClick={handleBack} disabled={step === 1}>
          Back
        </Button>
        <Button onClick={handleNext}>
          {step === steps.length ? "Complete" : "Next"}
        </Button>
      </div>
    </div>
  );
}
```

---

## Custom Save Logic

### Example: Validate Before Save

```typescript
const handleSaveWithValidation = () => {
  if (!selectedComponent) return;
  
  // ═══════════════════════════════════════════════════════════
  // 1. VALIDATE DATA
  // ═══════════════════════════════════════════════════════════
  const validation = validateComponentData(tempData, selectedComponent.type);
  
  if (!validation.isValid) {
    console.error("Validation failed:", validation.errors);
    
    // Show errors to user
    toast.error(`Validation failed: ${validation.errors[0]}`);
    
    // Highlight invalid fields
    setInvalidFields(validation.invalidFields);
    
    return;  // Don't save
  }
  
  // ═══════════════════════════════════════════════════════════
  // 2. TRANSFORM DATA (if needed)
  // ═══════════════════════════════════════════════════════════
  const transformedData = transformDataForSave(tempData);
  
  // ═══════════════════════════════════════════════════════════
  // 3. SAVE WITH CONFIRMATION
  // ═══════════════════════════════════════════════════════════
  showConfirmDialog({
    title: "Save Changes?",
    message: "This will update the component configuration.",
    onConfirm: () => {
      // Merge data
      const merged = deepMerge(
        deepMerge(existingData, storeData),
        transformedData
      );
      
      // Save
      store.setComponentData(type, id, merged);
      store.forceUpdatePageComponents(page, updatedComponents);
      
      // Log change
      logChange(id, componentName, type, merged, "COMPONENT_UPDATE");
      
      // Notify user
      toast.success("Changes saved successfully!");
      
      onClose();
    }
  });
};

// Validation function
const validateComponentData = (data, type) => {
  const errors = [];
  const invalidFields = [];
  
  // Type-specific validation
  switch (type) {
    case "hero":
      if (!data.content?.title || data.content.title.trim() === "") {
        errors.push("Title is required");
        invalidFields.push("content.title");
      }
      
      if (data.height?.desktop && !isValidCSSValue(data.height.desktop)) {
        errors.push("Invalid height value");
        invalidFields.push("height.desktop");
      }
      break;
    
    case "gallery":
      if (!data.images || data.images.length === 0) {
        errors.push("At least one image is required");
        invalidFields.push("images");
      }
      
      data.images?.forEach((img, i) => {
        if (!img.url) {
          errors.push(`Image ${i + 1} missing URL`);
          invalidFields.push(`images.${i}.url`);
        }
      });
      break;
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    invalidFields
  };
};

// Data transformation
const transformDataForSave = (data) => {
  // Clean up empty strings
  const cleaned = JSON.parse(JSON.stringify(data), (key, value) => {
    if (value === "") return undefined;
    return value;
  });
  
  // Add metadata
  cleaned._lastModified = Date.now();
  cleaned._modifiedBy = currentUser.id;
  
  return cleaned;
};
```

---

## Complex Data Structures

### Example: Nested Menu with Mega Menu

```typescript
// Structure definition
{
  key: "menu",
  label: "Navigation Menu",
  type: "array",
  itemLabel: "Menu Item",
  of: [
    {
      key: "id",
      label: "ID",
      type: "text"
    },
    {
      key: "type",
      label: "Menu Type",
      type: "select",
      options: [
        { label: "Simple Link", value: "link" },
        { label: "Dropdown", value: "dropdown" },
        { label: "Mega Menu", value: "mega_menu" }
      ]
    },
    {
      key: "text",
      label: "Text",
      type: "text"
    },
    {
      key: "url",
      label: "URL",
      type: "text",
      condition: {
        field: "type",
        value: "link"
      }
    },
    {
      key: "submenu",
      label: "Submenu",
      type: "array",
      itemLabel: "Submenu Group",
      condition: {
        field: "type",
        value: "mega_menu"
      },
      of: [
        {
          key: "title",
          label: "Group Title",
          type: "text"
        },
        {
          key: "items",
          label: "Links",
          type: "array",
          itemLabel: "Link",
          of: [
            {
              key: "text",
              label: "Link Text",
              type: "text"
            },
            {
              key: "url",
              label: "Link URL",
              type: "text"
            }
          ]
        }
      ]
    }
  ]
}

// Resulting data structure
{
  menu: [
    {
      id: "home",
      type: "link",
      text: "Home",
      url: "/"
    },
    {
      id: "services",
      type: "mega_menu",
      text: "Services",
      submenu: [
        {
          title: "Residential",
          items: [
            { text: "Apartments", url: "/apartments" },
            { text: "Villas", url: "/villas" }
          ]
        },
        {
          title: "Commercial",
          items: [
            { text: "Offices", url: "/offices" },
            { text: "Retail", url: "/retail" }
          ]
        }
      ]
    }
  ]
}
```

---

## Summary

These practical examples demonstrate:

1. **Complete component implementation**: From structure to React component
2. **Custom field renderers**: Specialized UI for complex fields
3. **Advanced editing flows**: Multi-step setup, guided configuration
4. **Custom save logic**: Validation, transformation, confirmation
5. **Complex data structures**: Nested arrays, conditional fields

**Key Takeaways**:
- Follow established patterns
- Implement all required parts (structure, functions, store, component)
- Test thoroughly at each step
- Add proper validation
- Include error handling
- Log important operations

**For AI**:
- Use as templates for new implementations
- Adapt patterns to specific needs
- Follow same structure and naming
- Include all necessary integrations
- Test edge cases

