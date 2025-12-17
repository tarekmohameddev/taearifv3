# EditorSidebar Components - Detailed Reference

## Table of Contents

1. [Component Hierarchy](#component-hierarchy)
2. [AdvancedSimpleSwitcher](#advancedsimpleswitcher)
3. [DynamicFieldsRenderer](#dynamicfieldsrenderer)
4. [Field Renderers](#field-renderers)
5. [Theme Selectors](#theme-selectors)
6. [Helper Components](#helper-components)

---

## Component Hierarchy

```
EditorSidebar (Container)
│
├─── Resize Handle
│    └─── Mouse drag listeners
│
├─── Header (Close button, Title)
│
├─── Body (Scrollable content area)
│    │
│    ├─── View: "main"
│    │    ├─── PageThemeSelector
│    │    ├─── Color/Font settings
│    │    └─── "Add New Section" button
│    │
│    ├─── View: "add-section"
│    │    └─── AVAILABLE_SECTIONS.map(section =>
│    │         <SectionCard onClick={onSectionAdd} />
│    │       )
│    │
│    └─── View: "edit-component"
│         ├─── [ThemeSelector] (commented out)
│         ├─── [ResetConfirmDialog] (commented out)
│         └─── AdvancedSimpleSwitcher
│              ├─── Simple/Advanced toggle
│              ├─── Structure loading
│              └─── DynamicFieldsRenderer
│                   ├─── BackgroundFieldRenderer
│                   ├─── Field iteration (map over fields)
│                   │    ├─── text → Text Input
│                   │    ├─── textarea → Textarea
│                   │    ├─── number → NumberFieldRenderer
│                   │    ├─── boolean → BooleanFieldRenderer
│                   │    ├─── color → ColorFieldRenderer
│                   │    ├─── image → ImageFieldRenderer
│                   │    ├─── select → Select Dropdown
│                   │    ├─── array → ArrayFieldRenderer
│                   │    │    ├─── Primitive arrays (string[])
│                   │    │    └─── Object arrays
│                   │    │         ├─── Item header (expand/collapse)
│                   │    │         ├─── Item actions (move, duplicate, delete)
│                   │    │         └─── Item fields (recursive renderField)
│                   │    │              └─── Nested arrays (submenu support)
│                   │    │
│                   │    └─── object → ObjectFieldRenderer
│                   │         ├─── Expandable header
│                   │         ├─── Special: CardThemeSelector (for card objects)
│                   │         ├─── Special: Background controls
│                   │         └─── Nested field iteration
│                   │              └─── Recursive renderField
│                   │
│                   └─── SimpleBackgroundFieldRenderer
│                        └─── Flattened background fields
│
└─── Footer (Action buttons)
     ├─── View: "edit-component"
     │    ├─── [Save Changes] button
     │    └─── [Cancel] button
     │
     └─── View: "add-section"
          └─── [Back to Settings] button
```

---

## AdvancedSimpleSwitcher

**Location**: `components/AdvancedSimpleSwitcher.tsx`

**Purpose**: Load component structure and toggle between simple/advanced editing modes

### Props

```typescript
interface AdvancedSimpleSwitcherProps {
  type: string; // Component type: "hero"
  componentName: string; // Variant: "hero1"
  componentId?: string; // UUID
  onUpdateByPath?: (path, value) => void; // Update callback
  currentData?: any; // Current component data
}
```

### State

```typescript
const [mode, setMode] = useState<"simple" | "advanced">("simple");
const [structure, setStructure] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### Structure Loading Process

```typescript
const loadStructure = async (componentType: string) => {
  try {
    setLoading(true);
    setError(null);

    // STEP 1: Verify component exists in ComponentsList
    const component = COMPONENTS[componentType];
    if (!component) {
      throw new Error(`Component "${componentType}" not found`);
    }

    let loadedStructure = null;

    // STEP 2: Dynamic import of structure file
    try {
      const structureModule = await import(
        `@/componentsStructure/${componentType}`
      );

      const structureName = `${componentType}Structure`;
      loadedStructure = structureModule[structureName];

      if (!loadedStructure) {
        throw new Error(`Structure "${structureName}" not found`);
      }
    } catch (importErr) {
      console.warn(`Failed to load ${componentType}, trying fallback`);

      // STEP 3: Fallback to header structure
      const fallbackModule = await import(`@/componentsStructure/header`);
      loadedStructure = fallbackModule.headerStructure;
    }

    // STEP 4: Validate structure format
    if (
      !loadedStructure ||
      !loadedStructure.variants ||
      !Array.isArray(loadedStructure.variants)
    ) {
      throw new Error(`Invalid structure format`);
    }

    // STEP 5: Translate structure labels
    const translatedStructure = translateComponentStructure(loadedStructure, t);

    // STEP 6: Find matching variant
    const targetVariant =
      translatedStructure.variants.find((v) => v.id === componentName) ||
      translatedStructure.variants[0]; // Fallback to first variant

    if (!targetVariant) {
      throw new Error(`No variant found for ${componentName}`);
    }

    // STEP 7: Set structure with current variant
    setStructure({
      ...translatedStructure,
      currentVariant: targetVariant,
    });
  } catch (err) {
    console.error(`Error loading structure:`, err);
    setError(err.message);
    setStructure(null);
  } finally {
    setLoading(false);
  }
};
```

**Error Handling**:

```typescript
// Loading State
if (loading) {
  return (
    <div className="loading-state">
      <h4>Loading Component Structure</h4>
      <p>Loading {type}...</p>
    </div>
  );
}

// Error State
if (error || !structure) {
  return (
    <div className="error-state">
      <h4>Structure Loading Error</h4>
      <p>{error || "Failed to load structure"}</p>

      {/* Retry button */}
      <button onClick={() => loadStructure(type)}>
        Retry Loading Structure
      </button>

      {/* Fallback button */}
      <button onClick={useFallbackStructure}>
        Use Fallback Structure
      </button>
    </div>
  );
}
```

### Mode Switching

```typescript
// Simple mode: Show subset of fields
// Advanced mode: Show all fields

const variant = structure.currentVariant;
const fields =
  mode === "simple" && variant.simpleFields?.length
    ? variant.simpleFields
    : variant.fields;

return (
  <div>
    {/* Mode toggle */}
    <div className="mode-switcher">
      <button
        className={mode === "simple" ? "active" : ""}
        onClick={() => setMode("simple")}
      >
        Simple
      </button>
      <button
        className={mode === "advanced" ? "active" : ""}
        onClick={() => setMode("advanced")}
      >
        Advanced
      </button>
    </div>

    {/* Render selected fields */}
    <DynamicFieldsRenderer
      fields={fields}
      componentType={type}
      variantId={componentId || componentName}
      onUpdateByPath={handleUpdateByPath}
      currentData={currentData}
    />
  </div>
);
```

### Update Handler

```typescript
const handleUpdateByPath = (path, value) => {
  if (onUpdateByPath) {
    // Use unified callback
    onUpdateByPath(path, value);
  } else {
    // Fallback routing
    if (selectedComponent?.id === "global-header") {
      updateGlobalComponentByPath("header", path, value);
    } else if (selectedComponent?.id === "global-footer") {
      updateGlobalComponentByPath("footer", path, value);
    } else {
      updateByPath(path, value);
    }
  }
};
```

**Routing Logic**:

1. Try onUpdateByPath callback (preferred)
2. Check if global component
3. Fallback to store updateByPath

---

## DynamicFieldsRenderer

**Location**: `components/DynamicFieldsRenderer.tsx`

**Purpose**: Render form fields dynamically based on structure definitions

### Props

```typescript
interface DynamicFieldsRendererProps {
  fields: FieldDefinition[]; // Fields to render
  componentType?: string; // "hero"
  variantId?: string; // Component UUID or "global-header"
  onUpdateByPath?: (path, value) => void;
  currentData?: any; // Initial/override data
}
```

### Core Functions

#### 1. getValueByPath

**Purpose**: Retrieve current value for a field

```typescript
const getValueByPath = useCallback((path: string) => {
  // STEP 1: Validate path
  if (!path || typeof path !== "string") {
    console.warn("Invalid path:", path);
    return undefined;
  }

  // STEP 2: Parse path into segments
  const segments = normalizePath(path).split(".").filter(Boolean);

  if (segments.length === 0) {
    console.warn("Empty path segments:", path);
    return undefined;
  }

  // STEP 3: Determine data source
  let cursor;

  if (currentData && Object.keys(currentData).length > 0) {
    // Priority 1: Explicit currentData
    cursor = currentData;

  } else if (variantId === "global-header") {
    // Priority 2: Global header
    cursor = globalComponentsData?.header || tempData || {};

    // Validation for global header
    const requiredFields = ["visible", "menu", "logo", "colors"];
    const missingFields = requiredFields.filter(f => !(f in cursor));
    if (missingFields.length > 0) {
      console.warn("Missing header fields:", missingFields);
    }

  } else if (variantId === "global-footer") {
    // Priority 3: Global footer
    cursor = globalComponentsData?.footer || tempData || {};

    // Validation for global footer
    const requiredFields = ["visible", "content", "styling"];
    const missingFields = requiredFields.filter(f => !(f in cursor));
    if (missingFields.length > 0) {
      console.warn("Missing footer fields:", missingFields);
    }

  } else if (componentType && variantId && COMPONENTS[componentType]) {
    // Priority 4: Regular component
    const componentData = getComponentData(componentType, variantId);

    // Prefer tempData for live editing
    if (tempData && Object.keys(tempData).length > 0) {
      cursor = tempData;
    } else if (currentData && Object.keys(currentData).length > 0) {
      cursor = currentData;
    } else {
      cursor = componentData || {};
    }

  } else {
    // Fallback: tempData
    cursor = tempData || {};
  }

  // STEP 4: Special handling for known paths
  if (path === "content.imagePosition" && cursor?.imagePosition) {
    return cursor.imagePosition;
  }

  if (path === "layout.direction" && cursor?.layout?.direction) {
    return cursor.layout.direction;
  }

  // STEP 5: Navigate path
  for (const seg of segments) {
    if (cursor == null) return undefined;
    cursor = cursor[seg];
  }

  return cursor;
}, [currentData, tempData, componentType, variantId, ...]);
```

#### 2. updateValue

**Purpose**: Update field value via path

```typescript
const updateValue = useCallback((path: string, value: any) => {
  // SPECIAL CASE 1: halfTextHalfImage imagePosition
  if (
    path === "content.imagePosition" &&
    componentType === "halfTextHalfImage"
  ) {
    // Update BOTH paths
    if (onUpdateByPath) {
      onUpdateByPath("content.imagePosition", value);
      onUpdateByPath("imagePosition", value);
    } else {
      updateComponentByPath(type, id, "content.imagePosition", value);
      updateComponentByPath(type, id, "imagePosition", value);
    }
    return;
  }

  // SPECIAL CASE 2: halfTextHalfImage layout.direction
  if (
    path === "layout.direction" &&
    componentType === "halfTextHalfImage"
  ) {
    if (onUpdateByPath) {
      onUpdateByPath("layout.direction", value);
    } else {
      updateComponentByPath(type, id, "layout.direction", value);
    }
    return;
  }

  // REGULAR FLOW
  if (onUpdateByPath) {
    // Callback provided
    if (
      componentType &&
      variantId &&
      variantId !== "global-header" &&
      variantId !== "global-footer"
    ) {
      // Regular component: Update tempData for immediate feedback
      updateByPath(path, value);
    } else {
      // Global component: Use callback
      onUpdateByPath(path, value);
    }
  } else {
    // No callback: Direct store update
    if (variantId === "global-header") {
      updateByPath(path, value);
    } else if (variantId === "global-footer") {
      updateByPath(path, value);
    } else {
      updateByPath(path, value);
    }
  }
}, [onUpdateByPath, updateByPath, componentType, variantId, ...]);
```

#### 3. renderField

**Purpose**: Render appropriate field component based on type

```typescript
const renderField = (def: FieldDefinition, basePath?: string) => {
  if (!def) return null;

  // STEP 1: Build path
  let path: string;
  if (basePath) {
    // Prevent duplicate keys
    if (basePath.endsWith(`.${def.key}`) || basePath === def.key) {
      path = basePath;
    } else {
      path = `${basePath}.${def.key}`;
    }
  } else {
    path = def.key;
  }

  const normalizedPath = normalizePath(path);

  // STEP 2: Get current value
  const value = getValueByPath(normalizedPath);

  // STEP 3: Check condition (if exists)
  if (def.condition) {
    const conditionValue = getValueByPath(def.condition.field);
    if (conditionValue !== def.condition.value) {
      return null;  // Don't render
    }
  }

  // STEP 4: Render based on type
  switch (def.type) {
    case "array":
      return (
        <ArrayFieldRenderer
          def={def}
          normalizedPath={normalizedPath}
          value={Array.isArray(value) ? value : []}
          updateValue={updateValue}
          getValueByPath={getValueByPath}
          renderField={renderField}  // Recursive!
        />
      );

    case "object":
      return (
        <ObjectFieldRenderer
          def={def}
          normalizedPath={normalizedPath}
          value={value}
          updateValue={updateValue}
          getValueByPath={getValueByPath}
          renderField={renderField}  // Recursive!
        />
      );

    case "text":
    case "image":
      if (def.type === "image") {
        return (
          <ImageFieldRenderer
            label={def.label}
            path={normalizedPath}
            value={value || ""}
            updateValue={updateValue}
          />
        );
      }
      return (
        <div className="text-field">
          <label>{def.label}</label>
          <input
            type="text"
            value={value || ""}
            onChange={(e) => updateValue(normalizedPath, e.target.value)}
            placeholder={def.placeholder}
          />
        </div>
      );

    case "textarea":
      return (
        <div className="textarea-field">
          <label>{def.label}</label>
          <textarea
            value={value || ""}
            onChange={(e) => updateValue(normalizedPath, e.target.value)}
            rows={4}
          />
        </div>
      );

    case "number":
      return (
        <NumberFieldRenderer
          label={def.label}
          path={normalizedPath}
          value={value ?? 0}
          updateValue={updateValue}
        />
      );

    case "boolean":
      return (
        <BooleanFieldRenderer
          label={def.label}
          path={normalizedPath}
          value={!!value}
          updateValue={updateValue}
        />
      );

    case "color":
      return (
        <ColorFieldRenderer
          label={def.label}
          path={normalizedPath}
          value={value || ""}
          updateValue={updateValue}
        />
      );

    case "select":
      return (
        <div className="select-field">
          <label>{def.label}</label>
          <select
            value={value || def.options?.[0]?.value || ""}
            onChange={(e) => updateValue(normalizedPath, e.target.value)}
          >
            {(def.options || []).map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );
  }

  return null;
};
```

### Background Field Handling

```typescript
// Find background field
const backgroundField = fields.find(f => f.key === "background");

return (
  <div>
    {/* Render background field (if exists) */}
    {backgroundField && (
      <BackgroundFieldRenderer
        backgroundField={backgroundField}
        getValueByPath={getValueByPath}
        updateValue={updateValue}
        renderField={renderField}
      />
    )}

    {/* Render simple background (if no nested background) */}
    {!backgroundField && (
      <SimpleBackgroundFieldRenderer
        fields={fields}
        getValueByPath={getValueByPath}
        updateValue={updateValue}
        renderField={renderField}
      />
    )}

    {/* Render all other fields */}
    {fields
      .filter(f =>
        f.key !== "background" &&
        f.key !== "background.type" &&
        f.key !== "background.colors.from" &&
        f.key !== "background.colors.to"
      )
      .map((f, i) => (
        <div key={i}>{renderField(f)}</div>
      ))
    }
  </div>
);
```

---

## Field Renderers

### ArrayFieldRenderer

**Location**: `FieldRenderers/ArrayFieldRenderer.tsx`

**Purpose**: Manage arrays of objects or primitives

#### State

```typescript
const [expanded, setExpanded] = useState<Record<string, boolean>>({});
const [allCollapsed, setAllCollapsed] = useState(false);
const [nestedExpanded, setNestedExpanded] = useState<Record<string, boolean>>(
  {},
);
const [fieldTypes, setFieldTypes] = useState<Record<string, string>>({});
```

#### Key Functions

**generateDefaultItem**:

```typescript
const generateDefaultItem = () => {
  const newItem = {};

  if (arrDef.of && Array.isArray(arrDef.of)) {
    for (const f of arrDef.of) {
      switch (f.type) {
        case "text":
          newItem[f.key] = f.defaultValue || "";
          break;
        case "number":
          newItem[f.key] = f.defaultValue || 0;
          break;
        case "boolean":
          newItem[f.key] = f.defaultValue || false;
          break;
        case "color":
          newItem[f.key] = f.defaultValue || "#000000";
          break;
        case "select":
          newItem[f.key] = f.defaultValue || f.options?.[0]?.value || "";
          break;
        case "object":
          newItem[f.key] = f.defaultValue || {};
          break;
        case "array":
          newItem[f.key] = f.defaultValue || [];
          break;
        default:
          newItem[f.key] = f.defaultValue || "";
      }
    }
  }

  return newItem;
};
```

**getItemTitle**:

```typescript
const getItemTitle = (item: any, idx: number) => {
  // Try multiple patterns for title
  const patterns = [
    item?.title?.en,
    item?.title,
    item?.text?.en,
    item?.text,
    item?.name?.en,
    item?.name,
    item?.label?.en,
    item?.label,
    item?.heading?.en,
    item?.heading,
    item?.id,
    item?.key,
    item?.value,
  ];

  const candidate = patterns.find(
    (p) => p && typeof p === "string" && p.trim().length > 0,
  );

  const base = candidate
    ? String(candidate).trim()
    : `${arrDef.itemLabel || "Item"} ${idx + 1}`;

  // Truncate long titles
  return base.length > 50 ? base.substring(0, 47) + "..." : base;
};
```

**getItemSubtitle**:

```typescript
const getItemSubtitle = (item: any) => {
  const parts = [];

  if (item?.type) {
    parts.push(`Type: ${item.type}`);
  }

  if (item?.submenu && Array.isArray(item.submenu)) {
    const totalSubItems = item.submenu.reduce((total, sub) => {
      return total + (Array.isArray(sub.items) ? sub.items.length : 0);
    }, 0);

    parts.push(`${item.submenu.length} submenu(s) (${totalSubItems} items)`);
  }

  if (item?.url) {
    parts.push(`URL: ${item.url}`);
  }

  return parts.join(" • ");
};
```

**validateItem**:

```typescript
const validateItem = (item: any, index: number) => {
  const errors = [];

  if (arrDef.of && Array.isArray(arrDef.of)) {
    for (const f of arrDef.of) {
      if (f.type === "text" && (!item[f.key] || item[f.key].trim() === "")) {
        // Only error for critical fields
        if (
          f.key.includes("title") ||
          f.key.includes("name") ||
          f.key.includes("text")
        ) {
          errors.push(`${f.label || f.key} is required`);
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
```

#### Item Actions

```typescript
// Add item
const addItem = () => {
  updateValue(normalizedPath, [...items, generateDefaultItem()]);
};

// Move item up
const move = (idx, direction) => {
  const newIdx = idx + direction;
  if (newIdx < 0 || newIdx >= items.length) return;

  const next = items.slice();
  const tmp = next[idx];
  next[idx] = next[newIdx];
  next[newIdx] = tmp;

  updateValue(normalizedPath, next);
};

// Duplicate item
const duplicateItem = (idx) => {
  const duplicated = { ...items[idx] };
  const newItems = [...items];
  newItems.splice(idx + 1, 0, duplicated);
  updateValue(normalizedPath, newItems);
};

// Clear item (reset to defaults)
const clearItem = (idx) => {
  const cleared = generateDefaultItem();
  const newItems = [...items];
  newItems[idx] = cleared;
  updateValue(normalizedPath, newItems);
};

// Remove item
const removeItem = (idx) => {
  const next = items.slice();
  next.splice(idx, 1);
  updateValue(normalizedPath, next);
};
```

#### Nested Array Support

For arrays within array items (e.g., menu with submenus):

```typescript
const renderNestedArray = (field, itemPath, item) => {
  if (field.type !== "array") return null;

  const nestedItems = Array.isArray(item[field.key])
    ? item[field.key]
    : [];

  const addNestedItem = () => {
    const newItem = field.of.reduce((acc, f) => {
      acc[f.key] = f.defaultValue || "";
      return acc;
    }, {});

    const updatedItem = { ...item };
    updatedItem[field.key] = [...nestedItems, newItem];
    updateValue(itemPath, updatedItem);
  };

  return (
    <div className="nested-array">
      <div className="header">
        <h5>{field.label}</h5>
        <span>{nestedItems.length} items</span>
        <button onClick={addNestedItem}>
          Add {field.itemLabel}
        </button>
      </div>

      {nestedItems.map((nestedItem, nestedIdx) => (
        <div key={nestedIdx} className="nested-item">
          <button onClick={() => toggleNestedItem(...)}>
            Expand/Collapse
          </button>
          <span>{field.itemLabel} {nestedIdx + 1}</span>
          <button onClick={() => removeNestedItem(...)}>Remove</button>

          {nestedExpanded[...] && field.of.map(nestedField => (
            <div key={nestedField.key}>
              {/* Conditional rendering */}
              {nestedField.key === "options" ? (
                // Only show if field type is select/radio
                getValueByPath(`${itemPath}.${field.key}.${nestedIdx}.type`) === "select" &&
                renderField(nestedField, `${itemPath}.${field.key}.${nestedIdx}`)
              ) : (
                renderField(nestedField, `${itemPath}.${field.key}.${nestedIdx}`)
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
```

**Use Case**: Menu items with mega-menu submenus containing items

```
menu[0]                        ← Array item
  ├── text: "Products"
  ├── type: "mega_menu"
  └── submenu[0]               ← Nested array
      ├── title: "Categories"
      └── items[0]             ← Deeply nested array
          ├── text: "Electronics"
          └── url: "/electronics"
```

---

## Theme Selectors

### ThemeSelector

**Purpose**: Change component variant (hero1 → hero2)

**Location**: `components/tenant/live-editor/ThemeSelector.tsx`

**How It Works**:

```typescript
export function ThemeSelector({
  componentType,      // "hero"
  currentTheme,       // "hero1"
  onThemeChange       // Callback when theme changes
}) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);
  const [themeOptions, setThemeOptions] = useState({});

  // Load available themes from ComponentsList
  useEffect(() => {
    const options = {};

    for (const type in COMPONENTS) {
      const component = COMPONENTS[type];

      if (component && component.variants) {
        options[type] = component.variants.map(variant => ({
          id: variant.id || variant,
          name: variant.name || `${component.displayName} ${variant.id}`,
          image: "/placeholder.svg",
          description: `${component.description} - ${variant.id} variant`,
          category: type
        }));
      }
    }

    setThemeOptions(options);
  }, []);

  const currentThemes = themeOptions[componentType] || [];

  const handleConfirm = () => {
    onThemeChange(selectedTheme);
    setIsOpen(false);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Change Theme</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose Theme</DialogTitle>
        </DialogHeader>

        {/* Theme grid */}
        <div className="theme-grid">
          {currentThemes.map(theme => (
            <div
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={selectedTheme === theme.id ? "selected" : ""}
            >
              <img src={theme.image} alt={theme.name} />
              <h4>{theme.name}</h4>
              <p>{theme.description}</p>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirm}>Apply Theme</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

**Theme Change Flow**:

```
User selects hero2
  ↓
setSelectedTheme("hero2")
  ↓
User clicks "Apply Theme"
  ↓
onThemeChange("hero2")
  ↓
handleComponentThemeChange(id, "hero2")
  ↓
Get new default data:
  const newData = createDefaultData("hero", "hero2");
  ↓
Update component:
  return {
    ...component,
    componentName: "hero2",
    data: newData
  };
  ↓
Update store:
  store.setComponentData(type, id, newData);
  ↓
Component re-renders with hero2 variant ✓
```

### PageThemeSelector

**Purpose**: Apply coordinated theme to entire page

**Location**: `components/tenant/live-editor/PageThemeSelector.tsx`

**Theme Definition**:

```typescript
const PAGE_THEME_OPTIONS = [
  {
    id: "theme1",
    name: "Modern Theme",
    components: {
      header: "header1",
      hero: "hero1",
      halfTextHalfImage: "halfTextHalfImage1",
      propertySlider: "propertySlider1",
      ctaValuation: "ctaValuation1",
    },
  },
  {
    id: "theme2",
    name: "Classic Theme",
    components: {
      header: "header2",
      hero: "hero2",
      halfTextHalfImage: "halfTextHalfImage1",
      propertySlider: "propertySlider1",
      ctaValuation: "ctaValuation1",
    },
  },
];
```

**Application Flow**:

```
User selects "Modern Theme"
  ↓
setSelectedTheme("theme1")
  ↓
User confirms
  ↓
onThemeChange("theme1", theme.components)
  ↓
handlePageThemeChange(themeId, components)
  ↓
For each component on page:
  if (components[c.type]) {
    const newTheme = components[c.type];
    const newData = createDefaultData(c.type, newTheme);

    return {
      ...c,
      componentName: newTheme,
      data: newData
    };
  }
  ↓
Update store for each component
  ↓
All components re-render with coordinated themes ✓
```

### CardThemeSelector

**Purpose**: Specialized themes for card components

**Location**: `components/tenant/live-editor/CardThemeSelector.tsx`

**Theme Options**:

```typescript
const CARD_THEME_OPTIONS = [
  {
    id: "card-default",
    name: "Default Card",
    preview: {
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      shadow: "0 1px 3px rgba(0,0,0,0.1)",
      textColor: "#374151",
    },
  },
  {
    id: "card-modern",
    name: "Modern Card",
    preview: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      shadow: "0 4px 6px rgba(0,0,0,0.07)",
      textColor: "#1f2937",
    },
  },
  // ... more themes
];
```

**Usage**:

```typescript
// In ObjectFieldRenderer
{def.key === "card" && (
  <CardThemeSelector
    currentTheme={getValueByPath(`${normalizedPath}.theme`) || "card-default"}
    onThemeChange={(theme) => updateValue(`${normalizedPath}.theme`, theme)}
  />
)}
```

---

## Helper Components

### ResetConfirmDialog

**Purpose**: Confirm before resetting component to defaults

**Location**: `components/tenant/live-editor/ResetConfirmDialog.tsx`

```typescript
export function ResetConfirmDialog({
  componentType,
  componentName,
  onConfirmReset
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onConfirmReset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button variant="outline">Reset</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Component Warning</DialogTitle>
        </DialogHeader>

        <div className="warning-content">
          <p>⚠️ This action cannot be undone!</p>

          <div className="will-remove">
            <strong>This will remove:</strong>
            <ul>
              <li>Custom text and content</li>
              <li>Color and styling changes</li>
              <li>Layout settings</li>
              <li>Theme selections</li>
              <li>All other customizations</li>
            </ul>
          </div>

          <div className="will-restore">
            <strong>This will restore:</strong>
            <p>Default configuration for this component</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Yes, Reset Component
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### TranslationFields

**Purpose**: Multi-language field editing (Arabic/English)

**Location**: `TranslationFields.tsx`

```typescript
export function TranslationFields({
  fieldKey,        // "hero.title"
  value,           // { ar: "عنوان", en: "Title" }
  onChange,        // Update callback
  label,           // "Title"
  type = "input",  // "input" or "textarea"
  placeholder
}) {
  const handleValueChange = (locale, newValue) => {
    onChange({
      ...value,
      [locale]: newValue
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{label || fieldKey}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ar">
          <TabsList>
            {locales.map(locale => (
              <TabsTrigger key={locale} value={locale}>
                {localeFlags[locale]} {localeNames[locale]}
              </TabsTrigger>
            ))}
          </TabsList>

          {locales.map(locale => (
            <TabsContent key={locale} value={locale}>
              <Label>{localeNames[locale]} {label}</Label>

              {type === "textarea" ? (
                <Textarea
                  value={value[locale] || ""}
                  onChange={(e) => handleValueChange(locale, e.target.value)}
                  placeholder={placeholder}
                />
              ) : (
                <Input
                  value={value[locale] || ""}
                  onChange={(e) => handleValueChange(locale, e.target.value)}
                  placeholder={placeholder}
                />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
```

**Use Case**: Components with multi-language content

```typescript
// Instead of single text field:
<input value={title} onChange={...} />

// Use translation field:
<TranslationFields
  fieldKey="title"
  value={{ ar: "عنوان", en: "Title" }}
  onChange={setTitle}
  type="input"
/>
```

---

## Advanced Patterns

### Pattern 1: Recursive Field Rendering

ArrayFieldRenderer and ObjectFieldRenderer call `renderField` recursively:

```typescript
// In ArrayFieldRenderer
{arrDef.of.map(fieldDef => (
  <div key={fieldDef.key}>
    {renderField(fieldDef, `${normalizedPath}.${idx}`)}
  </div>
))}

// This allows:
menu[0]                    ← Array item
  ├── text                 ← Text field
  ├── submenu              ← Nested array
  │   └── [0]              ← Nested array item
  │       └── items        ← Deeply nested array
  │           └── [0]      ← Deeply nested item
  │               ├── text ← Text field (rendered recursively)
  │               └── url  ← Text field (rendered recursively)
```

### Pattern 2: Conditional Field Visibility

**In Field Definition**:

```typescript
{
  key: "options",
  label: "Field Options",
  type: "array",
  condition: {
    field: "type",
    value: "select"
  }
}
```

**In renderField**:

```typescript
if (def.condition) {
  const conditionValue = getValueByPath(def.condition.field);
  if (conditionValue !== def.condition.value) {
    return null; // Hide field
  }
}
```

**In ArrayFieldRenderer**:

```typescript
{
  arrDef.of.map((f) => {
    // Special conditional rendering
    if (f.key === "options" && f.label === "Field Options (for Select/Radio)") {
      const fieldType = getValueByPath(`${itemPath}.type`);

      if (fieldType !== "radio" && fieldType !== "select") {
        return null; // Hide options field
      }
    }

    return renderField(f, itemPath);
  });
}
```

### Pattern 3: Item Type Tracking

Track field types in array items for conditional rendering:

```typescript
const [fieldTypes, setFieldTypes] = useState<Record<string, string>>({});

useEffect(() => {
  if (Array.isArray(value)) {
    const newFieldTypes = {};

    value.forEach((item, idx) => {
      if (item && typeof item === "object" && item.type) {
        newFieldTypes[`${normalizedPath}.${idx}`] = item.type;
      }
    });

    setFieldTypes(newFieldTypes);
  }
}, [value, normalizedPath]);

// Use in rendering
const currentFieldType =
  fieldTypes[`${normalizedPath}.${idx}`] ||
  value[idx]?.type ||
  getValueByPath(`${normalizedPath}.${idx}.type`);
```

### Pattern 4: Smart Default Generation

Generate intelligent defaults based on field definitions:

```typescript
const generateDefaultItem = () => {
  const newItem = {};

  if (arrDef.of && Array.isArray(arrDef.of)) {
    for (const f of arrDef.of) {
      // Use defaultValue if provided, otherwise type-appropriate default
      switch (f.type) {
        case "text":
          newItem[f.key] = f.defaultValue || "";
          break;
        case "number":
          newItem[f.key] = f.defaultValue || 0;
          break;
        case "boolean":
          newItem[f.key] =
            f.defaultValue !== undefined ? f.defaultValue : false;
          break;
        case "color":
          newItem[f.key] = f.defaultValue || "#000000";
          break;
        case "select":
          newItem[f.key] = f.defaultValue || f.options?.[0]?.value || "";
          break;
        case "object":
          newItem[f.key] = f.defaultValue || {};
          break;
        case "array":
          newItem[f.key] = f.defaultValue || [];
          break;
      }
    }
  }

  return newItem;
};
```

---

## Important Notes for AI

### When Adding New Field Renderer

1. **Follow prop signature**:

   ```typescript
   {
     label: string;
     path: string;
     value: any;
     updateValue: (path, value) => void;
   }
   ```

2. **Handle null/undefined**:

   ```typescript
   value={value || ""}           // Strings
   value={value ?? 0}            // Numbers
   value={!!value}               // Booleans
   value={Array.isArray(value) ? value : []}  // Arrays
   ```

3. **Provide visual feedback**:
   - Has value: Green border, checkmark icon
   - Empty: Gray border
   - Error: Red border, error message
   - Loading: Spinner, disabled state

4. **Call updateValue, not onChange**:
   ```typescript
   <input onChange={(e) => updateValue(path, e.target.value)} />
   ```

### When Modifying Data Flow

1. **Preserve data source priority**:
   - currentData (highest)
   - globalComponentsData (for globals)
   - tempData (for editing)
   - componentData (from store)

2. **Check for global components**:

   ```typescript
   if (variantId === "global-header" || variantId === "global-footer") {
     // Special handling
   }
   ```

3. **Use deep merge for saves**:

   ```typescript
   const merged = deepMerge(existing, store, temp);
   ```

4. **Update all stores on save**:
   ```typescript
   store.setComponentData(type, id, data);  // Component state
   store.forceUpdatePageComponents(page, [...]);  // Page components
   ```

### Common Pitfalls

❌ **Pitfall 1**: Forgetting to normalize path

```typescript
// WRONG
getValueByPath("menu.[0].text");

// CORRECT
getValueByPath(normalizePath("menu.[0].text"));
```

❌ **Pitfall 2**: Using shallow merge

```typescript
// WRONG
const merged = { ...a, ...b, ...c };

// CORRECT
const merged = deepMerge(deepMerge(a, b), c);
```

❌ **Pitfall 3**: Not handling arrays in path navigation

```typescript
// WRONG
cursor = cursor[segment]; // Fails for "menu[0]"

// CORRECT
const segments = path.replace(/\[(\d+)\]/g, ".$1").split(".");
// "menu[0]" → "menu.0"
```

❌ **Pitfall 4**: Direct tempData mutation

```typescript
// WRONG
tempData.content.title = "New";
setTempData(tempData);

// CORRECT
updateByPath("content.title", "New");
```

---

## Summary

EditorSidebar components work together to provide dynamic editing:

1. **AdvancedSimpleSwitcher**: Loads structure, toggles mode
2. **DynamicFieldsRenderer**: Generates form from structure
3. **Field Renderers**: Handle specific field types
4. **Theme Selectors**: Switch component variants
5. **Helper Components**: Reset, translations, validation

**Key Principles**:

- Structure-driven rendering (fields from structure definitions)
- Path-based updates (dot notation with arrays)
- Recursive rendering (nested objects and arrays)
- Conditional visibility (show/hide based on other fields)
- Real-time feedback (immediate updates to tempData)
- Save-based persistence (merge tempData on save)

Understanding these components enables:

- Adding new field types
- Customizing field renderers
- Implementing new component types
- Debugging editing issues
- Optimizing render performance
