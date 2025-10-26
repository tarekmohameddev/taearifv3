# Drag & Drop System - Complete Reference

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Core Components](#core-components)
4. [Position Tracking](#position-tracking)
5. [Drag Operations](#drag-operations)
6. [Drop Operations](#drop-operations)
7. [Position Validation](#position-validation)

---

## Overview

The Live Editor implements an advanced drag & drop system using **@dnd-kit** library. The system supports:
- **Component reordering**: Move existing components within page
- **New component addition**: Drag from sidebar to page
- **Position tracking**: Precise index calculation
- **Validation**: Ensure positions remain consistent
- **Visual feedback**: Drop indicators and animations

### Technology Stack

- **@dnd-kit/react**: React integration
- **@dnd-kit/dom**: DOM manipulation
- **@dnd-kit/abstract**: Core abstractions
- **Custom position tracker**: Enhanced position management

---

## Architecture

### System Layers

```
┌─────────────────────────────────────────────────────────────┐
│            EnhancedLiveEditorDragDropContext                │
│  - Main drag & drop provider                                │
│  - Event handling (onDragStart, onDragEnd)                  │
│  - Position calculation                                      │
└─────────────────┬───────────────────────────────────────────┘
                  │
      ┌───────────┴───────────┬─────────────────┐
      ▼                       ▼                 ▼
┌──────────────┐    ┌──────────────┐   ┌──────────────┐
│ ZoneStore    │    │ Sensors      │   │ Position     │
│ Provider     │    │ (Pointer,    │   │ Tracker      │
│              │    │  Keyboard)   │   │              │
└──────────────┘    └──────────────┘   └──────────────┘
      │                                         │
      ▼                                         ▼
┌──────────────┐                      ┌──────────────┐
│ Drop Zones   │                      │ Validation   │
│ - Root       │                      │ - Positions  │
│ - Nested     │                      │ - Conflicts  │
└──────────────┘                      └──────────────┘
      │
      ▼
┌──────────────┐
│ Draggable    │
│ Components   │
│ - Page items │
│ - Sidebar    │
└──────────────┘
```

### File Structure

```
services-liveeditor/live-editor/dragDrop/
├── EnhancedLiveEditorDragDropContext.tsx  # Main context
├── DraggableComponent.tsx                  # Draggable wrapper
├── LiveEditorDropZone.tsx                  # Drop zone component
├── DraggableDrawerItem.tsx                 # Sidebar draggable
├── enhanced-position-tracker.ts            # Position management
├── zoneStore.ts                            # Zone state management
├── zoneContext.tsx                         # Zone context
└── useSensors.ts                           # Input sensors
```

---

## Core Components

### 1. EnhancedLiveEditorDragDropContext

**Location**: `services-liveeditor/live-editor/dragDrop/EnhancedLiveEditorDragDropContext.tsx`

**Purpose**: Main provider for drag & drop functionality

**Props**:
```typescript
interface EnhancedLiveEditorDragDropContextProps {
  children: React.ReactNode;
  components: any[];                    // Current page components
  onComponentMove?: (                   // Move callback
    sourceIndex: number,
    sourceZone: string,
    finalIndex: number,
    destinationZone: string,
    updatedComponents?: any[],
    debugInfo?: PositionDebugInfo
  ) => void;
  onComponentAdd?: (data: {            // Add callback
    type: string;
    index: number;
    zone: string;
  }) => void;
  onPositionDebug?: (debugInfo: PositionDebugInfo) => void;
  id?: string;
  iframeRef?: React.RefObject<HTMLIFrameElement>;
}
```

**Implementation**:

```typescript
export function EnhancedLiveEditorDragDropContext({
  children,
  components,
  onComponentMove,
  onComponentAdd,
  onPositionDebug,
  iframeRef
}) {
  const sensors = useLiveEditorSensors();
  const zoneStore = useMemo(() => createZoneStore(), []);
  
  const handleEnhancedMove = useCallback((
    sourceIndex,
    sourceZone,
    destinationIndex,
    destinationZone
  ) => {
    // Use position tracker
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
    } else {
      onPositionDebug?.(result.debugInfo);
    }
  }, [components, onComponentMove, onPositionDebug]);
  
  return (
    <DragDropProvider
      sensors={sensors}
      onDragEnd={(event, manager) => {
        // Handle drag end logic...
      }}
      onDragStart={(event, manager) => {
        // Handle drag start logic...
      }}
    >
      <ZoneStoreProvider store={zoneStore}>
        <DropZoneProvider>
          {children}
        </DropZoneProvider>
      </ZoneStoreProvider>
    </DragDropProvider>
  );
}
```

### 2. LiveEditorDraggableComponent

**Location**: `services-liveeditor/live-editor/dragDrop/DraggableComponent.tsx`

**Purpose**: Wrapper for draggable page components

**Usage**:
```typescript
<LiveEditorDraggableComponent
  id={component.id}
  componentType={component.componentName}
  depth={1}
  index={index}
  zoneCompound="root"
  isLoading={false}
  isSelected={selectedComponentId === component.id}
  label={component.componentName}
  onEditClick={() => handleEditClick(component.id)}
  onDeleteClick={() => handleDeleteClick(component.id)}
  inDroppableZone={true}
>
  {(ref) => (
    <div ref={ref}>
      <CachedComponent {...} />
    </div>
  )}
</LiveEditorDraggableComponent>
```

**Features**:
- Drag handle overlay (appears on hover)
- Edit and Delete buttons
- Visual selection indicator
- Loading state
- Drag preview

### 3. LiveEditorDropZone

**Location**: `services-liveeditor/live-editor/dragDrop/LiveEditorDropZone.tsx`

**Purpose**: Drop target area for components

**Usage**:
```typescript
<LiveEditorDropZone
  zone="root"
  minEmptyHeight={pageComponents.length === 0 ? 200 : 50}
  className="space-y-4"
>
  {pageComponents.map(component => (
    <LiveEditorDraggableComponent key={component.id} ... />
  ))}
</LiveEditorDropZone>
```

**Features**:
- Accept drops from draggable components
- Show drop indicators
- Calculate drop position
- Handle empty state

### 4. DraggableDrawerItem

**Location**: `services-liveeditor/live-editor/dragDrop/DraggableDrawerItem.tsx`

**Purpose**: Draggable component cards in ComponentsSidebar

**Usage**:
```typescript
<DraggableDrawerItem
  componentType="hero"
  section="homepage"
  data={{
    label: "Hero",
    description: "Main banner section",
    icon: "hero"
  }}
>
  <div className="component-card">
    <div className="icon">🌟</div>
    <div className="info">
      <h3>Hero</h3>
      <p>Main banner section</p>
    </div>
  </div>
</DraggableDrawerItem>
```

**Features**:
- Drag from sidebar to page
- Visual drag preview
- Component metadata

---

## Position Tracking

### Position Tracker

**Location**: `services-liveeditor/live-editor/dragDrop/enhanced-position-tracker.ts`

**Purpose**: Track and validate component positions

**API**:
```typescript
export const positionTracker = {
  // Record state for history
  recordState: (components, operation) => void;
  
  // Track component move with validation
  trackComponentMove: (
    components,
    sourceIndex,
    sourceZone,
    finalIndex,
    destinationZone
  ) => {
    success: boolean;
    updatedComponents: any[];
    debugInfo: PositionDebugInfo;
  };
  
  // Validate positions
  validatePositions: (components) => ValidationResult;
  
  // Generate debug report
  generateReport: () => Report;
  
  // Enable debug mode
  setDebugMode: (enabled: boolean) => void;
};
```

### trackComponentMove Implementation

```typescript
export function trackComponentMove(
  components: any[],
  sourceIndex: number,
  sourceZone: string,
  finalIndex: number,
  destinationZone: string
) {
  console.log("📍 Position Tracker: Move Request", {
    sourceIndex,
    sourceZone,
    finalIndex,
    destinationZone,
    componentsCount: components.length
  });
  
  // STEP 1: Validate inputs
  if (!Array.isArray(components)) {
    return {
      success: false,
      updatedComponents: components,
      debugInfo: {
        operation: {
          type: "move",
          componentName: "unknown",
          sourceIndex,
          destinationIndex: finalIndex,
          timestamp: Date.now()
        },
        calculatedIndex: finalIndex,
        finalIndex: finalIndex,
        adjustmentReason: "Invalid components array"
      }
    };
  }
  
  if (sourceIndex < 0 || sourceIndex >= components.length) {
    return {
      success: false,
      updatedComponents: components,
      debugInfo: {
        operation: {...},
        adjustmentReason: "Invalid source index"
      }
    };
  }
  
  // STEP 2: Extract component being moved
  const movingComponent = components[sourceIndex];
  
  if (!movingComponent) {
    return {
      success: false,
      updatedComponents: components,
      debugInfo: {
        operation: {...},
        adjustmentReason: "Component not found at source index"
      }
    };
  }
  
  // STEP 3: Calculate actual target index
  let adjustedFinalIndex = finalIndex;
  let adjustmentReason = "";
  
  // If moving down (finalIndex > sourceIndex), adjust for removal
  if (finalIndex > sourceIndex) {
    adjustedFinalIndex = finalIndex - 1;
    adjustmentReason = "Adjusted for source removal (moving down)";
  }
  
  // Clamp to valid range
  adjustedFinalIndex = Math.max(0, Math.min(
    adjustedFinalIndex,
    components.length - 1
  ));
  
  // STEP 4: Perform move
  const newComponents = [...components];
  
  // Remove from source
  newComponents.splice(sourceIndex, 1);
  
  // Insert at destination
  newComponents.splice(adjustedFinalIndex, 0, movingComponent);
  
  // STEP 5: Update positions
  const updatedComponents = newComponents.map((comp, index) => ({
    ...comp,
    position: index,
    layout: {
      ...comp.layout,
      row: index
    }
  }));
  
  // STEP 6: Create debug info
  const debugInfo: PositionDebugInfo = {
    operation: {
      type: "move",
      componentName: movingComponent.componentName || "unknown",
      sourceIndex,
      sourceZone,
      destinationIndex: finalIndex,
      destinationZone,
      timestamp: Date.now()
    },
    calculatedIndex: finalIndex,
    finalIndex: adjustedFinalIndex,
    adjustmentReason,
    beforeState: components.map((c, i) => ({
      id: c.id,
      position: i,
      name: c.componentName
    })),
    afterState: updatedComponents.map((c, i) => ({
      id: c.id,
      position: i,
      name: c.componentName
    }))
  };
  
  console.log("✅ Position Tracker: Move Complete", debugInfo);
  
  // STEP 7: Record operation
  recordState(updatedComponents, "enhanced-move");
  
  return {
    success: true,
    updatedComponents,
    debugInfo
  };
}
```

### Position Validation

```typescript
export function validateComponentPositions(components: any[]) {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Check 1: Sequential positions
  const positions = components.map(c => c.position);
  const expected = Array.from({ length: components.length }, (_, i) => i);
  
  const hasSequential = positions.every((pos, idx) => pos === idx);
  
  if (!hasSequential) {
    issues.push("Positions are not sequential");
    suggestions.push("Run handleResetPositions() to fix");
  }
  
  // Check 2: No duplicates
  const uniquePositions = new Set(positions);
  
  if (uniquePositions.size !== positions.length) {
    issues.push("Duplicate positions detected");
    
    const duplicates = positions.filter(
      (pos, idx) => positions.indexOf(pos) !== idx
    );
    suggestions.push(`Duplicates at: ${duplicates.join(", ")}`);
  }
  
  // Check 3: No gaps
  for (let i = 0; i < components.length; i++) {
    if (!positions.includes(i)) {
      issues.push(`Gap at position ${i}`);
      suggestions.push("Positions should be 0, 1, 2, ... without gaps");
      break;
    }
  }
  
  // Check 4: Layout matches position
  components.forEach((comp, idx) => {
    if (comp.layout?.row !== comp.position) {
      issues.push(
        `Component ${comp.id} layout.row (${comp.layout?.row}) ` +
        `doesn't match position (${comp.position})`
      );
    }
  });
  
  return {
    isValid: issues.length === 0,
    issues,
    suggestions,
    components: components.map(c => ({
      id: c.id,
      position: c.position,
      layoutRow: c.layout?.row
    }))
  };
}
```

---

## Drag Operations

### Drag Start

```
USER GRABS COMPONENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: User Hovers Component
────────────────────────────────────────────────
<LiveEditorDraggableComponent>
  └─ Shows drag handle overlay on hover
     with Edit and Delete buttons


STEP 2: User Clicks Drag Handle
────────────────────────────────────────────────
Drag handle clicked
  ↓
@dnd-kit detects drag intent
  ↓
onDragStart event fires


STEP 3: onDragStart Handler
────────────────────────────────────────────────
EnhancedLiveEditorDragDropContext.onDragStart(event, manager):
  const { source } = event.operation;
  
  console.log("🖐️ Drag started:", {
    sourceId: source.id,
    sourceType: source.type,
    sourceData: source.data
  });
  
  // Execute registered listener (if exists)
  const listener = dragListeners[source.id];
  if (listener) {
    listener(event);
  }
  
  // Check if new component from sidebar
  const isNewComponent = 
    source.id.startsWith("new-component") ||
    source.id.startsWith("drawer-item-");
  
  console.log("🆕 Is new component:", isNewComponent);


STEP 4: Visual Feedback
────────────────────────────────────────────────
Component being dragged:
  ├─ Reduced opacity
  ├─ Drag preview shown
  └─ Cursor changes to "grabbing"

Drop zones:
  ├─ Highlight on hover
  ├─ Show drop indicator
  └─ Indicate valid/invalid drop


RESULT: Drag initiated ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Drag Move

```
USER MOVES COMPONENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CONTINUOUS PROCESS:
────────────────────────────────────────────────
While dragging:
  ↓
@dnd-kit tracks cursor position
  ↓
Calculates which drop zone is under cursor
  ↓
Determines insertion index based on Y coordinate
  ↓
Shows visual drop indicator at calculated position
  ↓
Updates in real-time as cursor moves
```

---

## Drop Operations

### Drop on Page

```
USER RELEASES COMPONENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: onDragEnd Event Fires
────────────────────────────────────────────────
EnhancedLiveEditorDragDropContext.onDragEnd(event, manager):
  const { source, target } = event.operation;
  
  if (!source || event.canceled) {
    return;  // Drag was canceled
  }


STEP 2: Get iframe Document
────────────────────────────────────────────────
  const iframeDoc = iframeRef?.current?.contentDocument;
  
  if (!iframeDoc) {
    console.error("iframe document not available");
    return;
  }


STEP 3: Determine if New Component
────────────────────────────────────────────────
  const isNewComponent = 
    source.id.toString().startsWith("new-component") ||
    source.id.toString().startsWith("drawer-item-");
  
  const sourceComponentId = source.id.toString();


STEP 4: Get Target Information
────────────────────────────────────────────────
  if (target) {
    const targetComponentId = target.id.toString();
    let targetZone = target.id.toString();
    let targetIndex = 0;
    let realTargetIndex = 0;


STEP 5A: Handle Droppable/Dropzone Target
────────────────────────────────────────────────
    if (target.type === "droppable" || target.type === "dropzone") {
      
      // Special: Root dropzone
      if (target.type === "dropzone" && targetComponentId === "root") {
        const dragY = event.operation.shape?.current?.y || 0;
        
        // Get all component elements in iframe
        const allElements = Array.from(
          iframeDoc.querySelectorAll("[data-component-id]")
        ).map(el => ({
          id: el.getAttribute("data-component-id"),
          index: parseInt(el.getAttribute("data-index") || "0"),
          top: el.getBoundingClientRect().top,
          bottom: el.getBoundingClientRect().bottom,
          element: el
        })).sort((a, b) => a.top - b.top);
        
        // Find insertion point based on mouse Y
        let calculatedIndex = 0;
        for (const item of allElements) {
          if (dragY < item.top) {
            calculatedIndex = item.index;
            break;
          }
          calculatedIndex = item.index + 1;
        }
        
        targetIndex = calculatedIndex;
        realTargetIndex = calculatedIndex;
        targetZone = "main";
        
      } else {
        // Regular droppable target
        const targetElement = iframeDoc.getElementById(targetComponentId);
        
        if (targetElement) {
          const rect = targetElement.getBoundingClientRect();
          const dragY = event.operation.shape?.current?.y || 0;
          const midpoint = rect.top + rect.height / 2;
          
          // Get sorted elements
          const allElements = Array.from(
            iframeDoc.querySelectorAll("[data-component-id]")
          ).map(el => ({
            id: el.getAttribute("data-component-id"),
            index: parseInt(el.getAttribute("data-index") || "0"),
            top: el.getBoundingClientRect().top
          })).sort((a, b) => a.top - b.top);
          
          // Find target in sorted list
          const targetElementIndex = allElements.findIndex(
            item => item.id === targetComponentId
          );
          
          if (targetElementIndex >= 0) {
            // Insert before or after based on cursor position
            targetIndex = dragY > midpoint
              ? targetElementIndex + 1
              : targetElementIndex;
            
            realTargetIndex = targetIndex;
          }
        }
      }
    }


STEP 5B: Handle Component Target
────────────────────────────────────────────────
    else if (target.type === "component") {
      // Similar logic to droppable...
      const targetElement = iframeDoc.getElementById(targetComponentId);
      
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const dragY = event.operation.shape?.current?.y || 0;
        const midpoint = rect.top + rect.height / 2;
        
        // Calculate index based on position relative to midpoint
        // ... (similar to above)
      }
    }


STEP 6: Execute Operation
────────────────────────────────────────────────
    if (isNewComponent) {
      // ADD NEW COMPONENT
      console.log("➕ Adding new component:", {
        type: source.data.componentType,
        index: targetIndex,
        zone: targetZone
      });
      
      onComponentAdd?.({
        type: source.data.componentType || source.data.type,
        index: targetIndex,
        zone: targetZone
      });
      
    } else {
      // MOVE EXISTING COMPONENT
      const actualSourceIndex = components.findIndex(
        c => c.id === sourceComponentId
      );
      
      if (actualSourceIndex !== -1) {
        console.log("🔄 Moving component:", {
          from: actualSourceIndex,
          to: targetIndex
        });
        
        handleEnhancedMove(
          actualSourceIndex,
          "main",
          targetIndex,
          "main"
        );
      }
    }
  }


STEP 7: Reset Drag Operation
────────────────────────────────────────────────
  manager.dragOperation.reset();


RESULT: Component dropped successfully ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Position Calculation

```
POSITION CALCULATION ALGORITHM:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GIVEN:
  components = [A, B, C, D, E]  (indices 0, 1, 2, 3, 4)
  sourceIndex = 1 (component B)
  dragY = 250px (mouse Y coordinate)


STEP 1: Get All Component Elements
────────────────────────────────────────────────
const allElements = iframe.querySelectorAll("[data-component-id]");

Result:
[
  { id: "A", index: 0, top: 0,   bottom: 100 },
  { id: "B", index: 1, top: 100, bottom: 200 },  ← Dragging
  { id: "C", index: 2, top: 200, bottom: 300 },
  { id: "D", index: 3, top: 300, bottom: 400 },
  { id: "E", index: 4, top: 400, bottom: 500 }
]


STEP 2: Sort by Top Position
────────────────────────────────────────────────
sortedElements = elements.sort((a, b) => a.top - b.top);

Result (same in this case):
[A(0-100), B(100-200), C(200-300), D(300-400), E(400-500)]


STEP 3: Find Insertion Point
────────────────────────────────────────────────
dragY = 250px

for (const item of sortedElements) {
  if (dragY < item.top) {
    // Cursor is above this element
    targetIndex = item.index;
    break;
  }
  // Cursor is below this element
  targetIndex = item.index + 1;
}

Iteration:
  dragY (250) < A.top (0)? No
  dragY (250) < B.top (100)? No
  dragY (250) < C.top (200)? No
  dragY (250) < D.top (300)? Yes! → targetIndex = 3

Result: targetIndex = 3


STEP 4: Adjust for Source Removal
────────────────────────────────────────────────
sourceIndex = 1
targetIndex = 3

Since targetIndex (3) > sourceIndex (1):
  // Component will be removed from index 1 first
  // So index 3 becomes index 2 after removal
  adjustedIndex = targetIndex - 1 = 2

Result: adjustedFinalIndex = 2


STEP 5: Perform Move
────────────────────────────────────────────────
Before: [A, B, C, D, E]
         0  1  2  3  4

Remove B from index 1:
  [A, C, D, E]
   0  1  2  3

Insert B at index 2:
  [A, C, B, D, E]
   0  1  2  3  4

After positions:
  [A(0), C(1), B(2), D(3), E(4)]


RESULT: B moved to position 2 ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Drop Indicators

### Visual Feedback During Drag

```typescript
// Drop indicator component (conceptual)
function DropIndicator({ position, zone }) {
  return (
    <div
      className="drop-indicator"
      style={{
        position: "absolute",
        top: position.y,
        left: 0,
        right: 0,
        height: "4px",
        backgroundColor: "#3B82F6",
        zIndex: 9999
      }}
    />
  );
}
```

**Positioning**:
```
Components in iframe:
┌─────────────┐
│ Component A │ ← top: 0px
├─────────────┤
│ Component B │ ← top: 100px
├─────────────┤   ← If dragY = 150px, indicator here
│ Component C │ ← top: 200px
├─────────────┤
│ Component D │ ← top: 300px
└─────────────┘
```

---

## Position Validation

### Validation Rules

1. **Sequential**: Positions must be 0, 1, 2, 3, ... (no gaps)
2. **Unique**: No duplicate positions
3. **Matching**: position property must equal layout.row
4. **In Range**: All positions between 0 and length-1

### Validation Flow

```
AFTER DRAG & DROP:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: Update pageComponents
────────────────────────────────────────────────
setPageComponents(updatedComponents);


STEP 2: Validate Positions
────────────────────────────────────────────────
useEffect(() => {
  if (pageComponents.length > 0) {
    const validation = validateComponentPositions(pageComponents);
    setPositionValidation(validation);
    
    if (!validation.isValid) {
      console.warn("⚠️ Position validation failed:", validation.issues);
    }
  }
}, [pageComponents]);


STEP 3: Auto-Fix if Needed
────────────────────────────────────────────────
if (!validation.isValid) {
  // Option 1: Auto-fix
  const fixedComponents = pageComponents.map((comp, index) => ({
    ...comp,
    position: index,
    layout: {
      ...comp.layout,
      row: index
    }
  }));
  
  setPageComponents(fixedComponents);
  
  // Option 2: Show warning to user
  // (Current implementation shows in debug panel)
}


RESULT: Positions validated and fixed ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Manual Position Reset

```typescript
const handleResetPositions = useCallback(() => {
  const resetComponents = pageComponents.map((comp, index) => ({
    ...comp,
    position: index,
    layout: {
      ...comp.layout,
      row: index
    }
  }));
  
  setPageComponents(resetComponents);
  positionTracker.recordState(resetComponents, "manual-reset");
  
  // Update store
  setTimeout(() => {
    const store = useEditorStore.getState();
    store.forceUpdatePageComponents(currentPage, resetComponents);
  }, 0);
  
  const validation = validateComponentPositions(resetComponents);
  setPositionValidation(validation);
  
  console.log("🔄 Positions reset:", validation);
}, [pageComponents]);
```

**When to Use**:
- Positions corrupted after complex operations
- Duplicate positions detected
- Gaps in position sequence
- layout.row doesn't match position

---

## Debug Features

### Debug Panel (Development Only)

```typescript
{showDebugPanel && process.env.NODE_ENV === "development" && (
  <div className="debug-panel">
    {/* Position Validation */}
    <div className="validation-status">
      Position Validation: {positionValidation.isValid ? "✅ Valid" : "❌ Invalid"}
      
      {!positionValidation.isValid && (
        <div>
          {positionValidation.issues.map(issue => (
            <div className="error">{issue}</div>
          ))}
          {positionValidation.suggestions.map(suggestion => (
            <div className="suggestion">💡 {suggestion}</div>
          ))}
        </div>
      )}
    </div>
    
    {/* Current Components */}
    <div className="components-list">
      <h4>Current Components ({pageComponents.length})</h4>
      {pageComponents.map((comp, index) => (
        <div key={comp.id} className={selectedComponentId === comp.id ? "selected" : ""}>
          {index}: {comp.componentName || comp.name}
          <div>ID: {comp.id.slice(0, 8)}...</div>
          <div>Position: {comp.position ?? "undefined"}</div>
        </div>
      ))}
    </div>
    
    {/* Last Move Operation */}
    {debugInfo && (
      <div className="last-move">
        <h4>Last Move Operation</h4>
        <div>Component: {debugInfo.operation.componentName}</div>
        <div>From: {debugInfo.operation.sourceIndex}</div>
        <div>To: {debugInfo.calculatedIndex}</div>
        <div>Final: {debugInfo.finalIndex}</div>
        {debugInfo.adjustmentReason && (
          <div>Reason: {debugInfo.adjustmentReason}</div>
        )}
      </div>
    )}
    
    {/* Quick Actions */}
    <div className="actions">
      <button onClick={handleResetPositions}>
        Reset Positions
      </button>
      <button onClick={() => positionTracker.setDebugMode(true)}>
        Enable Verbose Logging
      </button>
      <button onClick={() => generatePositionReport()}>
        Generate Full Report
      </button>
    </div>
  </div>
)}
```

### Console Logging

```typescript
// In EnhancedLiveEditorDragDropContext
console.log("🔍 [DRAG DEBUG] Target is droppable:", targetComponentId);
console.log("🔍 [DRAG DEBUG] Drag Y position:", dragY);
console.log("🔍 [DRAG DEBUG] Sorted elements:", sortedElements);
console.log("🔍 [DRAG DEBUG] Calculated index:", targetIndex);

// In positionTracker
console.log("📍 Position Tracker: Move Request", {
  sourceIndex,
  finalIndex,
  componentsCount: components.length
});
console.log("✅ Position Tracker: Move Complete", debugInfo);
```

---

## Position Tracker State

### State Recording

```typescript
// Record state before and after operations
positionTracker.recordState(components, "enhanced-move");

// Internal storage:
const history = [];

export const recordState = (components, operation) => {
  const snapshot = {
    timestamp: Date.now(),
    operation,
    components: components.map(c => ({
      id: c.id,
      position: c.position,
      name: c.componentName
    }))
  };
  
  history.push(snapshot);
  
  // Keep last 50 operations
  if (history.length > 50) {
    history.shift();
  }
};
```

### Position Report Generation

```typescript
export function generatePositionReport() {
  const report = {
    timestamp: new Date().toISOString(),
    totalOperations: history.length,
    operations: history.map(h => ({
      operation: h.operation,
      timestamp: new Date(h.timestamp).toLocaleTimeString(),
      componentCount: h.components.length,
      positions: h.components.map(c => ({
        id: c.id,
        position: c.position,
        name: c.name
      }))
    })),
    currentState: {
      // Current component positions
    }
  };
  
  console.log("📊 Position Report:", report);
  return report;
}
```

---

## Advanced Features

### Feature 1: Auto-Scroll During Drag

```typescript
// Implemented by @dnd-kit AutoScroller plugin
const plugins = [
  ...defaultPreset.plugins,
  new AutoScroller({
    threshold: 0.2,      // Scroll when within 20% of edge
    acceleration: 0.5    // Scroll speed
  })
];
```

**Behavior**:
- Drag near top edge → Auto-scroll up
- Drag near bottom edge → Auto-scroll down
- Smooth acceleration

### Feature 2: Drag Handle Overlay

```typescript
// In DraggableComponent
<div className="drag-handle-overlay">
  <div className="drag-handle">
    <GripVerticalIcon />  {/* Drag icon */}
  </div>
  
  <div className="component-actions">
    <button onClick={onEditClick}>
      <EditIcon />
    </button>
    <button onClick={onDeleteClick}>
      <DeleteIcon />
    </button>
  </div>
</div>
```

**Visibility**:
- Hidden by default
- Shows on component hover
- Positioned absolutely over component
- High z-index for click priority

### Feature 3: Multi-Zone Support

```typescript
// Support multiple drop zones (future enhancement)
<DropZone zone="main">
  {mainComponents.map(...)}
</DropZone>

<DropZone zone="sidebar">
  {sidebarComponents.map(...)}
</DropZone>

// Track zone in operations
handleEnhancedMove(
  sourceIndex,
  "main",        // Source zone
  targetIndex,
  "sidebar"      // Destination zone
);
```

---

## Important Notes for AI

### Position Calculation Rules

1. **Always sort by visual position** (top coordinate), not by index
2. **Adjust index when moving down** (subtract 1 for removal)
3. **Clamp to valid range** (0 to length - 1)
4. **Update both position and layout.row** (keep in sync)

### Event Handling

1. **Check for cancelation**: `if (event.canceled) return;`
2. **Validate source and target**: `if (!source || !target) return;`
3. **Get iframe document**: Required for position calculation
4. **Reset operation**: `manager.dragOperation.reset()`

### Common Issues

**Issue 1**: Component moves to wrong position
- **Cause**: Not sorting elements by visual position
- **Fix**: Sort by `top` coordinate before calculating index

**Issue 2**: Position validation fails after move
- **Cause**: Not updating position properties
- **Fix**: Map over components and set `position: index`

**Issue 3**: Drag handle not clickable
- **Cause**: z-index too low or pointer-events disabled
- **Fix**: Ensure high z-index and pointer-events: auto

---

## Summary

The drag & drop system provides:

1. **Intuitive reordering**: Visual drag & drop interface
2. **Precise positioning**: Accurate index calculation
3. **Validation**: Ensure positions stay consistent
4. **Debug tools**: Track and diagnose position issues
5. **Multi-zone support**: Ready for complex layouts

**Key Components**:
- EnhancedLiveEditorDragDropContext: Main provider
- LiveEditorDraggableComponent: Draggable wrapper
- LiveEditorDropZone: Drop target
- positionTracker: Position management
- validateComponentPositions: Position validation

Understanding this system enables:
- Debugging drag issues
- Adding new drag sources
- Implementing complex layouts
- Optimizing drag performance

