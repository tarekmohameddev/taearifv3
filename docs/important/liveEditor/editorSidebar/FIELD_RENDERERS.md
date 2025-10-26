# Field Renderers - Complete Reference

## Table of Contents
1. [Overview](#overview)
2. [Field Type System](#field-type-system)
3. [Simple Field Renderers](#simple-field-renderers)
4. [Complex Field Renderers](#complex-field-renderers)
5. [Specialized Renderers](#specialized-renderers)
6. [Rendering Logic](#rendering-logic)

---

## Overview

Field Renderers are specialized React components responsible for rendering and managing specific field types in the EditorSidebar. Each renderer:
- Displays appropriate UI for the field type
- Handles user input and validation
- Updates data via path-based callbacks
- Provides visual feedback (validation, state)

### Renderer Types

```
Simple Renderers (in FieldRenderers.tsx)
├── ColorFieldRenderer
├── ImageFieldRenderer
├── BooleanFieldRenderer
└── NumberFieldRenderer

Complex Renderers (in FieldRenderers/)
├── ArrayFieldRenderer
├── ObjectFieldRenderer
├── BackgroundFieldRenderer
└── SimpleBackgroundFieldRenderer

Inline Renderers (in DynamicFieldsRenderer.tsx)
├── Text Input
├── Textarea
└── Select Dropdown
```

---

## Field Type System

### Field Definition Types

```typescript
export type FieldType =
  | "text"        // Single-line text input
  | "textarea"    // Multi-line text input
  | "number"      // Numeric input with +/- buttons
  | "boolean"     // Toggle switch
  | "color"       // Color picker
  | "image"       // Image URL input with upload
  | "select"      // Dropdown with options
  | "array"       // Array of objects/primitives
  | "object";     // Nested object with fields
```

### Base Field Definition

```typescript
interface FieldDefinitionBase {
  key: string;          // "content.title" or "menu[0].text"
  label: string;        // "Title"
  type: FieldType;      // "text"
  placeholder?: string; // "Enter title..."
  min?: number;         // Minimum value/length
  max?: number;         // Maximum value/length
  defaultValue?: any;   // Default when field is empty
  description?: string; // Help text
  condition?: {         // Conditional rendering
    field: string;      // "background.type"
    value: any;         // "gradient"
  };
}
```

### Array Field Definition

```typescript
interface ArrayFieldDefinition extends FieldDefinitionBase {
  type: "array";
  of: FieldDefinition[];      // Field definitions for each item
  minItems?: number;          // Minimum array length
  maxItems?: number;          // Maximum array length
  addLabel?: string;          // "Add Menu Item"
  itemLabel?: string;         // "Menu Item"
  itemType?: "text" | "object";  // Array element type
}
```

### Object Field Definition

```typescript
interface ObjectFieldDefinition extends FieldDefinitionBase {
  type: "object";
  fields: FieldDefinition[];  // Nested field definitions
}
```

---

## Simple Field Renderers

### ColorFieldRenderer

**Purpose**: Color picker with hex input and transparency support

**Props**:
```typescript
{
  label: string;      // "Background Color"
  path: string;       // "colors.background"
  value: string;      // "#FFFFFF" or "transparent"
  updateValue: (path, value) => void;
}
```

**Implementation**:

```typescript
export const ColorFieldRenderer = ({ label, path, value, updateValue }) => {
  const hasHex = typeof value === "string" && value.startsWith("#");
  const colorValue = hasHex ? value : "#000000";
  
  return (
    <div className="color-field">
      {/* Label */}
      <span>{label}</span>
      
      {/* Color circle preview */}
      <div className="relative w-16 h-16">
        <div
          className="color-preview"
          style={{ backgroundColor: hasHex ? colorValue : "transparent" }}
        >
          {!hasHex && <span>Transparent</span>}
        </div>
        
        {/* Hidden color input */}
        <input
          type="color"
          value={hasHex ? colorValue : "#000000"}
          onChange={(e) => updateValue(path, e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
      
      {/* Hex code input */}
      <input
        type="text"
        value={value || ""}
        onChange={(e) => updateValue(path, e.target.value)}
        className="hex-input"
        placeholder="#FFFFFF"
      />
      
      {/* Transparent button */}
      <button
        onClick={() => updateValue(path, "transparent")}
        className={value === "transparent" ? "active" : ""}
      >
        Transparent
      </button>
      
      {/* Copy button */}
      <button onClick={() => navigator.clipboard.writeText(value)}>
        Copy Color
      </button>
    </div>
  );
};
```

**Features**:
- Visual color circle with current color
- Click to open native color picker
- Manual hex code input
- Set to transparent
- Copy hex code to clipboard
- Validation (hex format)

### ImageFieldRenderer

**Purpose**: Image URL input with upload capability

**Props**:
```typescript
{
  label: string;      // "Background Image"
  path: string;       // "background.image"
  value: string;      // "https://..."
  updateValue: (path, value) => void;
}
```

**Implementation**:

```typescript
export const ImageFieldRenderer = ({ label, path, value, updateValue }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("context", "template");
      
      const response = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      if (response.data.status === "success") {
        updateValue(path, response.data.data.url);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="image-field">
      <span>{label}</span>
      
      {/* Preview */}
      <div className="w-20 h-20 preview">
        {value ? (
          <img src={value} alt="preview" />
        ) : (
          <div>No image</div>
        )}
      </div>
      
      {/* URL input */}
      <input
        type="text"
        value={value || ""}
        onChange={(e) => updateValue(path, e.target.value)}
        placeholder="https://example.com/image.jpg"
      />
      
      {/* Upload button */}
      <button onClick={() => fileInputRef.current?.click()}>
        {isUploading ? "Uploading..." : "Upload Image"}
      </button>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileUpload(e.target.files[0])}
        className="hidden"
      />
      
      {/* Open in new tab */}
      {value && (
        <a href={value} target="_blank">Open Image</a>
      )}
    </div>
  );
};
```

**Features**:
- Image preview (20x20 thumbnail)
- Manual URL input
- File upload to server
- Upload progress indicator
- Open image in new tab

**Upload Flow**:
```
1. User clicks "Upload Image"
   ↓
2. File input triggered
   ↓
3. User selects file
   ↓
4. handleFileUpload(file)
   ↓
5. FormData created with file
   ↓
6. POST to /upload
   ↓
7. Server returns URL
   ↓
8. updateValue(path, url)
   ↓
9. Image URL saved
   ↓
10. Preview updated
```

### BooleanFieldRenderer

**Purpose**: Toggle switch for boolean values

**Props**:
```typescript
{
  label: string;      // "Visible"
  path: string;       // "visible"
  value: boolean;     // true or false
  updateValue: (path, value) => void;
}
```

**Implementation**:

```typescript
export const BooleanFieldRenderer = ({ label, path, value, updateValue }) => {
  return (
    <div className="boolean-field">
      {/* Label with icon */}
      <label>
        <div className={`icon ${value ? "enabled" : "disabled"}`}>
          {value ? <CheckIcon /> : <XIcon />}
        </div>
        <span>{label}</span>
      </label>
      
      {/* Toggle switch */}
      <button
        onClick={() => updateValue(path, !value)}
        className={`toggle ${value ? "on" : "off"}`}
      >
        <span className={`slider ${value ? "right" : "left"}`} />
      </button>
      
      {/* Status text */}
      <p>{value ? "Enabled" : "Disabled"}</p>
    </div>
  );
};
```

**Features**:
- Visual toggle switch
- Color-coded states (green = on, gray = off)
- Icon feedback (checkmark or X)
- Status text

### NumberFieldRenderer

**Purpose**: Numeric input with increment/decrement buttons

**Props**:
```typescript
{
  label: string;      // "Opacity"
  path: string;       // "background.overlay.opacity"
  value: number;      // 0.45
  updateValue: (path, value) => void;
}
```

**Implementation**:

```typescript
export const NumberFieldRenderer = ({ label, path, value, updateValue }) => {
  return (
    <div className="number-field">
      <label>{label}</label>
      
      <div className="controls">
        {/* Decrement */}
        <button onClick={() => updateValue(path, (value || 0) - 1)}>
          <MinusIcon />
        </button>
        
        {/* Number input */}
        <input
          type="number"
          value={value ?? 0}
          onChange={(e) => updateValue(path, parseInt(e.target.value) || 0)}
          className="number-input"
        />
        
        {/* Increment */}
        <button onClick={() => updateValue(path, (value || 0) + 1)}>
          <PlusIcon />
        </button>
      </div>
      
      <p>Current value: {value ?? 0}</p>
    </div>
  );
};
```

**Features**:
- +/- buttons for easy incrementing
- Direct number input
- Current value display
- Handles undefined/null as 0

---

## Complex Field Renderers

### ArrayFieldRenderer

**Purpose**: Manage arrays of objects or primitives

**Location**: `FieldRenderers/ArrayFieldRenderer.tsx`

**Props**:
```typescript
{
  def: FieldDefinition;          // Array field definition
  normalizedPath: string;        // "menu"
  value: any[];                  // Current array
  updateValue: (path, value) => void;
  getValueByPath: (path) => any;
  renderField: (def, basePath?) => ReactNode;
}
```

#### Primitive Arrays

For simple string arrays:

```typescript
// Definition
{
  key: "features",
  label: "Features",
  type: "array",
  itemType: "text"
}

// Rendered as:
[Input Field] [Remove]
[Input Field] [Remove]
[Add] button
```

**Implementation**:
```typescript
if (arrDef.itemType === "text") {
  const items = Array.isArray(value) ? value : [];
  
  const addItem = () => updateValue(path, [...items, ""]);
  
  const updateItem = (idx, v) => {
    const next = items.slice();
    next[idx] = v;
    updateValue(path, next);
  };
  
  const removeItem = (idx) => {
    const next = items.slice();
    next.splice(idx, 1);
    updateValue(path, next);
  };
  
  return (
    <div>
      <div className="header">
        <span>{def.label}</span>
        <button onClick={addItem}>Add</button>
      </div>
      {items.map((item, idx) => (
        <div key={idx}>
          <input
            value={item}
            onChange={(e) => updateItem(idx, e.target.value)}
          />
          <button onClick={() => removeItem(idx)}>Remove</button>
        </div>
      ))}
    </div>
  );
}
```

#### Object Arrays

For arrays of complex objects:

```typescript
// Definition
{
  key: "menu",
  label: "Menu Items",
  type: "array",
  itemLabel: "Menu Item",
  addLabel: "Add Menu Item",
  of: [
    { key: "id", label: "ID", type: "text" },
    { key: "text", label: "Text", type: "text" },
    { key: "url", label: "URL", type: "text" },
    { key: "type", label: "Type", type: "select", options: [...] }
  ]
}

// Rendered as expandable items with all fields
```

**Implementation**:

```typescript
const items = Array.isArray(value) ? value : [];

// Generate default item from field definitions
const generateDefaultItem = () => {
  const newItem = {};
  if (arrDef.of && Array.isArray(arrDef.of)) {
    for (const f of arrDef.of) {
      switch (f.type) {
        case "text": newItem[f.key] = f.defaultValue || ""; break;
        case "number": newItem[f.key] = f.defaultValue || 0; break;
        case "boolean": newItem[f.key] = f.defaultValue || false; break;
        case "color": newItem[f.key] = f.defaultValue || "#000000"; break;
        // ... more types
      }
    }
  }
  return newItem;
};

const addItem = () => {
  updateValue(normalizedPath, [...items, generateDefaultItem()]);
};

return (
  <div className="array-field">
    {/* Header */}
    <div className="header">
      <span>{def.label} ({items.length} items)</span>
      <button onClick={expandAll}>Expand All</button>
      <button onClick={collapseAll}>Collapse All</button>
      <button onClick={addItem}>Add</button>
    </div>
    
    {/* Items */}
    {items.map((item, idx) => (
      <div key={idx} className="array-item">
        {/* Item header */}
        <div className="item-header">
          <button onClick={() => toggleExpanded(idx)}>
            {expanded[idx] ? "▼" : "▶"}
          </button>
          <span>{getItemTitle(item, idx)}</span>
          
          {/* Actions */}
          <button onClick={() => move(idx, -1)}>Move Up</button>
          <button onClick={() => move(idx, 1)}>Move Down</button>
          <button onClick={() => duplicate(idx)}>Duplicate</button>
          <button onClick={() => clear(idx)}>Clear</button>
          <button onClick={() => remove(idx)}>Delete</button>
        </div>
        
        {/* Item fields (when expanded) */}
        {expanded[idx] && (
          <div className="item-fields">
            {arrDef.of.map((fieldDef) => (
              <div key={fieldDef.key}>
                {renderField(fieldDef, `${normalizedPath}.${idx}`)}
              </div>
            ))}
          </div>
        )}
      </div>
    ))}
    
    {/* Empty state */}
    {items.length === 0 && (
      <div className="empty-state">
        <p>No {arrDef.itemLabel || "items"} yet</p>
        <button onClick={addItem}>
          Add {arrDef.itemLabel || "Item"}
        </button>
      </div>
    )}
  </div>
);
```

**Features**:
- **Expand/Collapse**: Individual items and all at once
- **Reorder**: Move up/down buttons
- **Duplicate**: Copy item
- **Clear**: Reset item to defaults
- **Delete**: Remove item from array
- **Validation**: Check required fields
- **Smart titles**: Extract title from item data (title.en, text, name, etc.)
- **Type badges**: Show item type (link, dropdown, mega_menu)
- **Nested arrays**: Support arrays within arrays (submenus)

#### Nested Arrays

For complex structures like menu with submenus:

```typescript
// Definition
{
  key: "menu",
  type: "array",
  of: [
    { key: "text", type: "text" },
    { key: "url", type: "text" },
    { key: "type", type: "select", options: [...] },
    {
      key: "submenu",
      type: "array",
      of: [
        { key: "title", type: "text" },
        {
          key: "items",
          type: "array",
          of: [
            { key: "text", type: "text" },
            { key: "url", type: "text" }
          ]
        }
      ]
    }
  ]
}
```

**Rendering**:
```typescript
const renderNestedArray = (field, itemPath, item) => {
  if (field.type !== "array") return null;
  
  const nestedItems = Array.isArray(item[field.key]) 
    ? item[field.key] 
    : [];
  
  return (
    <div className="nested-array">
      <div className="header">
        <h5>{field.label}</h5>
        <span>{nestedItems.length} items</span>
        <button onClick={() => addNestedItem()}>
          Add {field.itemLabel}
        </button>
      </div>
      
      {nestedItems.map((nestedItem, idx) => (
        <div key={idx} className="nested-item">
          <button onClick={() => toggleNested(idx)}>Expand/Collapse</button>
          <span>{field.itemLabel} {idx + 1}</span>
          <button onClick={() => removeNested(idx)}>Remove</button>
          
          {expanded[idx] && field.of.map((nestedField) => (
            <div key={nestedField.key}>
              {renderField(nestedField, `${itemPath}.${field.key}.${idx}`)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
```

### ObjectFieldRenderer

**Purpose**: Manage nested object structures

**Location**: `FieldRenderers/ObjectFieldRenderer.tsx`

**Props**:
```typescript
{
  def: FieldDefinition;          // Object field definition
  normalizedPath: string;        // "content"
  value: any;                    // Current object
  updateValue: (path, value) => void;
  getValueByPath: (path) => any;
  renderField: (def, basePath?) => ReactNode;
}
```

**Implementation**:

```typescript
export function ObjectFieldRenderer({
  def,
  normalizedPath,
  value,
  updateValue,
  getValueByPath,
  renderField
}) {
  const [expanded, setExpanded] = useState({});
  const objDef = def as ObjectFieldDefinition;
  
  const isOpen = expanded[normalizedPath] ?? false;
  const toggle = () => {
    setExpanded(s => ({ ...s, [normalizedPath]: !isOpen }));
  };
  
  return (
    <div className="object-field">
      {/* Header */}
      <button onClick={toggle} className="object-header">
        <span>{def.label}</span>
        <span>{objDef.fields?.length || 0} fields</span>
        <span className={isOpen ? "rotate-180" : ""}>▼</span>
      </button>
      
      {/* Fields (when expanded) */}
      {isOpen && (
        <div className="object-fields">
          {/* Special: Card theme selector */}
          {def.key === "card" && (
            <CardThemeSelector
              currentTheme={getValueByPath(`${normalizedPath}.theme`)}
              onThemeChange={(theme) => 
                updateValue(`${normalizedPath}.theme`, theme)
              }
            />
          )}
          
          {/* Special: Background controls */}
          {def.key === "background" && (
            <div>
              {/* Background type selector */}
              {renderField(
                objDef.fields.find(f => f.key === "type"),
                normalizedPath
              )}
              
              {/* Conditional color pickers */}
              {getValueByPath(`${normalizedPath}.type`) === "solid" && (
                <ColorFieldRenderer
                  label="Color"
                  path={`${normalizedPath}.colors.from`}
                  value={getValueByPath(`${normalizedPath}.colors.from`)}
                  updateValue={updateValue}
                />
              )}
              
              {getValueByPath(`${normalizedPath}.type`) === "gradient" && (
                <>
                  <ColorFieldRenderer
                    label="From"
                    path={`${normalizedPath}.colors.from`}
                    value={getValueByPath(`${normalizedPath}.colors.from`)}
                    updateValue={updateValue}
                  />
                  <ColorFieldRenderer
                    label="To"
                    path={`${normalizedPath}.colors.to`}
                    value={getValueByPath(`${normalizedPath}.colors.to`)}
                    updateValue={updateValue}
                  />
                </>
              )}
            </div>
          )}
          
          {/* Render all other fields */}
          {objDef.fields
            .filter(f => {
              // Filter out fields handled specially
              if (def.key === "background" && (f.key === "type" || f.key === "colors")) {
                return false;
              }
              return true;
            })
            .map(f => (
              <div key={f.key}>
                {renderField(f, `${normalizedPath}.${f.key}`)}
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}
```

**Features**:
- **Collapsible**: Click header to expand/collapse
- **Field count**: Shows number of nested fields
- **Special handling**: card, background, menu objects
- **Recursive**: Can contain nested objects and arrays

**Special Object Types**:

1. **card**: Shows CardThemeSelector
2. **background**: Shows conditional color pickers based on type
3. **menu**: Shows menu management info

---

## Specialized Renderers

### BackgroundFieldRenderer

**Purpose**: Specialized renderer for background configuration

**Types Supported**:
- **solid**: Single color background
- **gradient**: Two-color gradient
- **image**: Background image with overlay
- **custom**: Custom CSS value

**Implementation**:

```typescript
export function BackgroundFieldRenderer({
  backgroundField,
  getValueByPath,
  updateValue,
  renderField
}) {
  return (
    <div className="background-field">
      <label>Background</label>
      
      {/* Background Type Selector */}
      {renderField(
        backgroundField.fields.find(f => f.key === "type"),
        "background"
      )}
      
      {/* Solid: Single color */}
      {getValueByPath("background.type") === "solid" && (
        <ColorFieldRenderer
          label="Color"
          path="background.colors.from"
          value={getValueByPath("background.colors.from")}
          updateValue={updateValue}
        />
      )}
      
      {/* Gradient: Two colors */}
      {getValueByPath("background.type") === "gradient" && (
        <div className="gradient-colors">
          <ColorFieldRenderer
            label="From"
            path="background.colors.from"
            value={getValueByPath("background.colors.from")}
            updateValue={updateValue}
          />
          <ColorFieldRenderer
            label="To"
            path="background.colors.to"
            value={getValueByPath("background.colors.to")}
            updateValue={updateValue}
          />
        </div>
      )}
      
      {/* Other background fields (image, overlay, etc.) */}
      {backgroundField.fields
        .filter(f => f.key !== "type" && f.key !== "colors")
        .map(field => (
          <div key={field.key}>
            {renderField(field, "background")}
          </div>
        ))
      }
    </div>
  );
}
```

**Conditional Rendering**:
- Type selector ALWAYS shown
- Color fields shown ONLY when type matches
- Other fields shown based on type

### SimpleBackgroundFieldRenderer

**Purpose**: Handle flattened background fields (for simpleFields mode)

**Structure**:
```typescript
// Simple mode fields (flattened)
[
  { key: "background.type", type: "select" },
  { key: "background.colors.from", type: "color" },
  { key: "background.colors.to", type: "color" }
]

// Instead of nested:
{
  key: "background",
  type: "object",
  fields: [...]
}
```

**Implementation**:
```typescript
export function SimpleBackgroundFieldRenderer({
  fields,
  getValueByPath,
  updateValue,
  renderField
}) {
  const hasBgType = fields.some(f => f.key === "background.type");
  const hasBgFrom = fields.some(f => f.key === "background.colors.from");
  const hasBgTo = fields.some(f => f.key === "background.colors.to");
  
  if (!hasBgType && !hasBgFrom && !hasBgTo) return null;
  
  return (
    <div className="simple-background">
      <label>Background</label>
      
      {/* Type selector */}
      {hasBgType && renderField(
        fields.find(f => f.key === "background.type")
      )}
      
      {/* Conditional colors */}
      {getValueByPath("background.type") === "solid" && (
        <ColorFieldRenderer
          label="Color"
          path="background.colors.from"
          value={getValueByPath("background.colors.from")}
          updateValue={updateValue}
        />
      )}
      
      {getValueByPath("background.type") === "gradient" && (
        <>
          <ColorFieldRenderer label="From" ... />
          <ColorFieldRenderer label="To" ... />
        </>
      )}
    </div>
  );
}
```

**Use Case**: Simple mode in AdvancedSimpleSwitcher uses flattened fields

---

## Rendering Logic

### Field Rendering Flow

```
DynamicFieldsRenderer.renderField()
  ↓
Check field.condition (if exists)
  ├─ Condition not met? → return null
  └─ Condition met? → Continue
  ↓
Determine path
  path = basePath ? `${basePath}.${def.key}` : def.key
  ↓
Get current value
  value = getValueByPath(path)
  ↓
Switch on field.type
  ├─ "text" → Render text input
  ├─ "textarea" → Render textarea
  ├─ "number" → Return NumberFieldRenderer
  ├─ "boolean" → Return BooleanFieldRenderer
  ├─ "color" → Return ColorFieldRenderer
  ├─ "image" → Return ImageFieldRenderer
  ├─ "select" → Render select dropdown
  ├─ "array" → Return ArrayFieldRenderer
  └─ "object" → Return ObjectFieldRenderer
```

### Path Building

**Simple Path**:
```typescript
def.key = "title"
basePath = undefined
→ path = "title"
```

**Nested Path**:
```typescript
def.key = "title"
basePath = "content"
→ path = "content.title"
```

**Array Element Path**:
```typescript
def.key = "text"
basePath = "menu.0"
→ path = "menu.0.text"
```

**Deep Nesting**:
```typescript
def.key = "value"
basePath = "content.stats.stat1"
→ path = "content.stats.stat1.value"
```

**Duplicate Key Prevention**:
```typescript
// If basePath already ends with def.key, don't add again
if (basePath.endsWith(`.${def.key}`) || basePath === def.key) {
  path = basePath;  // Don't duplicate
} else {
  path = `${basePath}.${def.key}`;
}
```

### Value Retrieval Logic

```typescript
getValueByPath(path) {
  // 1. Validate path
  if (!path || typeof path !== "string") {
    console.warn("Invalid path:", path);
    return undefined;
  }
  
  // 2. Normalize and split path
  const segments = normalizePath(path).split(".").filter(Boolean);
  
  // 3. Determine data source
  let cursor;
  
  if (currentData && Object.keys(currentData).length > 0) {
    // Priority 1: currentData (passed from parent)
    cursor = currentData;
  } else if (variantId === "global-header") {
    // Priority 2: Global header data
    cursor = globalComponentsData?.header || tempData || {};
  } else if (variantId === "global-footer") {
    // Priority 3: Global footer data
    cursor = globalComponentsData?.footer || tempData || {};
  } else if (componentType && variantId) {
    // Priority 4: Component state data
    const componentData = getComponentData(componentType, variantId);
    
    // Use tempData if available (for live editing)
    cursor = tempData && Object.keys(tempData).length > 0
      ? tempData
      : currentData || componentData || {};
  } else {
    // Fallback: tempData
    cursor = tempData || {};
  }
  
  // 4. Navigate path
  for (const seg of segments) {
    if (cursor == null) return undefined;
    cursor = cursor[seg];
  }
  
  return cursor;
}
```

**Priority Order**:
1. currentData (explicit override)
2. globalComponentsData (for global components)
3. tempData (during editing)
4. componentData (from store)
5. {} (empty fallback)

### Value Update Logic

```typescript
updateValue(path, value) {
  // Special handling for halfTextHalfImage imagePosition
  if (
    path === "content.imagePosition" &&
    componentType === "halfTextHalfImage"
  ) {
    // Update BOTH paths for consistency
    if (onUpdateByPath) {
      onUpdateByPath("content.imagePosition", value);
      onUpdateByPath("imagePosition", value);
    } else {
      updateComponentByPath(type, id, "content.imagePosition", value);
      updateComponentByPath(type, id, "imagePosition", value);
    }
    return;
  }
  
  // Regular flow
  if (onUpdateByPath) {
    // For regular components, update tempData
    if (
      componentType &&
      variantId &&
      variantId !== "global-header" &&
      variantId !== "global-footer"
    ) {
      updateByPath(path, value);  // Updates tempData in store
    } else {
      onUpdateByPath(path, value);  // For global components
    }
  } else {
    // Fallback
    if (variantId === "global-header") {
      updateByPath(path, value);
    } else if (variantId === "global-footer") {
      updateByPath(path, value);
    } else {
      updateByPath(path, value);
    }
  }
}
```

**Update Flow**:
```
User changes field
  ↓
updateValue(path, value)
  ↓
Check for special cases
  ├─ halfTextHalfImage imagePosition → Update both paths
  └─ Regular field → Continue
  ↓
Determine update target
  ├─ onUpdateByPath provided?
  │  ├─ Yes, global component? → onUpdateByPath(path, value)
  │  └─ Yes, regular component? → updateByPath(path, value)
  └─ No callback? → updateByPath(path, value)
  ↓
Store updated (tempData)
  ↓
Component re-renders in iframe
```

---

## Inline Renderers (in DynamicFieldsRenderer.tsx)

### Text Input

```typescript
case "text":
  return (
    <div className="text-field">
      <label>
        <span>{def.label}</span>
        {def.description && <p>{def.description}</p>}
      </label>
      
      <div className="input-wrapper">
        <input
          type="text"
          value={value || ""}
          onChange={(e) => updateValue(normalizedPath, e.target.value)}
          placeholder={def.placeholder}
          className={value ? "has-value" : ""}
        />
        
        {value && <CheckIcon className="success-icon" />}
      </div>
      
      {/* Validation */}
      {def.min && value && value.length < def.min && (
        <p className="error">
          Minimum {def.min} characters required ({value.length}/{def.min})
        </p>
      )}
      
      {def.max && value && value.length > def.max && (
        <p className="error">
          Maximum {def.max} characters ({value.length}/{def.max})
        </p>
      )}
      
      {def.max && value && value.length <= def.max && (
        <p className="info">
          {value.length}/{def.max} characters
        </p>
      )}
    </div>
  );
```

**Features**:
- Success icon when field has value
- Character count validation
- Min/max length enforcement
- Visual feedback (green border when valid)

### Textarea

```typescript
case "textarea":
  return (
    <div className="textarea-field">
      <label>
        <span>{def.label}</span>
        {def.description && <p>{def.description}</p>}
      </label>
      
      <div className="textarea-wrapper">
        <textarea
          value={value || ""}
          onChange={(e) => updateValue(normalizedPath, e.target.value)}
          placeholder={def.placeholder}
          rows={4}
          className={value ? "has-value" : ""}
        />
        
        {value && <CheckIcon className="success-icon" />}
      </div>
      
      {/* Validation (same as text) */}
    </div>
  );
```

### Select Dropdown

```typescript
case "select":
  return (
    <div className="select-field">
      <label>
        <span>{def.label}</span>
        {def.description && <p>{def.description}</p>}
      </label>
      
      <div className="select-wrapper">
        <select
          value={value || def.options?.[0]?.value || ""}
          onChange={(e) => updateValue(normalizedPath, e.target.value)}
          className={value ? "has-value" : ""}
        >
          {(def.options || []).map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        
        <DropdownIcon className="dropdown-arrow" />
        {value && <CheckIcon className="success-icon" />}
      </div>
      
      {/* Debug info (development only) */}
      {process.env.NODE_ENV === "development" && (
        <div className="debug-info">
          <div>Current: {value || "undefined"}</div>
          <div>Options: {JSON.stringify(def.options)}</div>
          <div>Path: {normalizedPath}</div>
        </div>
      )}
    </div>
  );
```

**Features**:
- Custom styled dropdown
- Shows first option as default if no value
- Visual feedback when value selected
- Debug panel in development mode

---

## Advanced Patterns

### Pattern 1: Conditional Field Visibility

```typescript
// In field definition
{
  key: "searchForm.fields.purpose.options",
  label: "Purpose Options",
  type: "array",
  condition: {
    field: "searchForm.fields.purpose.enabled",
    value: true
  }
}

// In renderField
if (def.condition) {
  const conditionValue = getValueByPath(def.condition.field);
  if (conditionValue !== def.condition.value) {
    return null;  // Hide field
  }
}
```

**Use Cases**:
- Show gradient colors only when type is "gradient"
- Show submenu fields only when type is "dropdown" or "mega_menu"
- Show options only when type is "select" or "radio"

### Pattern 2: Dynamic Item Titles

For arrays, generate readable titles:

```typescript
const getItemTitle = (item, idx) => {
  // Try multiple patterns
  const patterns = [
    item?.title?.en,
    item?.title,
    item?.text?.en,
    item?.text,
    item?.name,
    item?.label,
    item?.id
  ];
  
  const candidate = patterns.find(
    p => p && typeof p === "string" && p.trim().length > 0
  );
  
  const base = candidate 
    ? candidate.trim()
    : `${arrDef.itemLabel || "Item"} ${idx + 1}`;
  
  // Truncate long titles
  return base.length > 50 ? base.substring(0, 47) + "..." : base;
};
```

### Pattern 3: Nested Array Rendering

For arrays within array items:

```typescript
// menu[0].submenu[0].items[0]
renderNestedArray(field, itemPath, item) {
  const nestedItems = item[field.key] || [];
  
  return (
    <div>
      <h5>{field.label}</h5>
      <span>{nestedItems.length} items</span>
      
      {nestedItems.map((nested, idx) => (
        <div key={idx}>
          {/* Render nested item fields */}
          {field.of.map(nestedField => (
            renderField(
              nestedField,
              `${itemPath}.${field.key}.${idx}`
            )
          ))}
        </div>
      ))}
      
      <button onClick={addNestedItem}>Add Nested Item</button>
    </div>
  );
}
```

### Pattern 4: Item Validation

```typescript
const validateItem = (item, index) => {
  const errors = [];
  
  if (arrDef.of && Array.isArray(arrDef.of)) {
    for (const f of arrDef.of) {
      if (
        f.type === "text" &&
        (!item[f.key] || item[f.key].trim() === "")
      ) {
        // Check if it's a critical field
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
    errors
  };
};
```

**Visual Feedback**:
```typescript
const validation = validateItem(item, idx);

<div className={`item ${validation.isValid ? "valid" : "invalid"}`}>
  {!validation.isValid && (
    <span className="error">{validation.errors[0]}</span>
  )}
</div>
```

---

## Special Cases

### Special Case 1: halfTextHalfImage imagePosition

**Problem**: Component has TWO paths for same data:
- `content.imagePosition`
- `imagePosition` (top-level)

**Solution**: Update BOTH paths simultaneously

```typescript
if (
  path === "content.imagePosition" &&
  componentType === "halfTextHalfImage"
) {
  onUpdateByPath("content.imagePosition", value);
  onUpdateByPath("imagePosition", value);
  return;
}
```

### Special Case 2: contactCards with No Cards

**Problem**: API might return component without cards array

**Solution**: Check for cards before using, fallback to defaults

```typescript
if (selectedComponent.type === "contactCards") {
  const hasCards = 
    selectedComponent.data?.cards &&
    Array.isArray(selectedComponent.data.cards) &&
    selectedComponent.data.cards.length > 0;
  
  dataToUse = hasCards ? selectedComponent.data : defaultData;
}
```

### Special Case 3: Global Component Editing

**Problem**: Global components need different update paths

**Solution**: Check component ID and route accordingly

```typescript
if (selectedComponent.id === "global-header") {
  updateGlobalComponentByPath("header", path, value);
} else if (selectedComponent.id === "global-footer") {
  updateGlobalComponentByPath("footer", path, value);
} else {
  updateComponentByPath(type, id, path, value);
}
```

### Special Case 4: Background Field in Simple Mode

**Problem**: Simple mode has flattened fields, advanced mode has nested

**Solution**: Two separate renderers

```typescript
// Advanced mode (nested)
const backgroundField = fields.find(f => f.key === "background");
if (backgroundField) {
  return <BackgroundFieldRenderer backgroundField={backgroundField} ... />;
}

// Simple mode (flattened)
if (!backgroundField) {
  return <SimpleBackgroundFieldRenderer fields={fields} ... />;
}
```

---

## Important Notes for AI

### When Creating New Field Renderer

1. **Accept standard props**:
   ```typescript
   {
     label: string;
     path: string;
     value: any;
     updateValue: (path, value) => void;
   }
   ```

2. **Call updateValue, not onChange**:
   ```typescript
   // ✅ CORRECT
   <input onChange={(e) => updateValue(path, e.target.value)} />
   
   // ❌ WRONG
   <input onChange={(e) => onChange(e.target.value)} />
   ```

3. **Handle null/undefined values**:
   ```typescript
   value={value || ""}          // For strings
   value={value ?? 0}           // For numbers
   value={!!value}              // For booleans
   ```

4. **Provide visual feedback**:
   - Success state (green border, checkmark)
   - Error state (red border, error message)
   - Loading state (spinner for async operations)

### When Using Field Renderers

1. **Pass normalized path**:
   ```typescript
   const normalizedPath = normalizePath(path);
   <ColorFieldRenderer path={normalizedPath} ... />
   ```

2. **Get value before passing**:
   ```typescript
   const value = getValueByPath(normalizedPath);
   <ColorFieldRenderer value={value} ... />
   ```

3. **Pass updateValue callback**:
   ```typescript
   <ColorFieldRenderer
     updateValue={(p, v) => updateValue(p, v)}
   />
   ```

### Common Mistakes to Avoid

❌ **Mistake 1**: Using componentName as identifier
```typescript
// WRONG
renderField(def, selectedComponent.componentName)

// CORRECT
renderField(def, selectedComponent.id)
```

❌ **Mistake 2**: Shallow object spread in nested updates
```typescript
// WRONG
const updated = { ...obj, content: { title: "New" } };

// CORRECT
const updated = updateValueByPath(obj, "content.title", "New");
```

❌ **Mistake 3**: Not handling undefined in arrays
```typescript
// WRONG
value.map(...)  // Crashes if value is undefined

// CORRECT
(Array.isArray(value) ? value : []).map(...)
```

❌ **Mistake 4**: Forgetting to normalize paths
```typescript
// WRONG
const value = getValueByPath("menu.[0].text");

// CORRECT
const value = getValueByPath(normalizePath("menu.[0].text"));
// → "menu.0.text"
```

---

## Summary

Field Renderers are the core UI layer of the EditorSidebar:

1. **Each field type has specialized renderer** (color, image, array, etc.)
2. **All renderers follow consistent pattern** (label, value, updateValue)
3. **Complex renderers support nesting** (arrays of objects, objects with arrays)
4. **Path-based updates enable precise control** (dot notation with array indices)
5. **Conditional rendering reduces UI complexity** (show fields only when relevant)
6. **Validation provides immediate feedback** (min/max, required fields)
7. **Special cases handled explicitly** (global components, imagePosition)

Understanding these renderers is crucial for extending the EditorSidebar with new field types or component types.

