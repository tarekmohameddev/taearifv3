# Debug and Logging System

## Table of Contents
1. [Overview](#overview)
2. [Debug Logger](#debug-logger)
3. [Change Tracking](#change-tracking)
4. [Debug Panel](#debug-panel)
5. [Console Logging Patterns](#console-logging-patterns)
6. [Common Debug Scenarios](#common-debug-scenarios)

---

## Overview

The Live Editor includes a comprehensive **debug and logging system** for tracking operations, changes, and troubleshooting issues. The system provides:
- **Centralized logging**: All operations logged to single system
- **Change tracking**: Before/after comparison for data changes
- **Debug panel**: Visual interface for viewing logs
- **Log export**: Download logs for analysis
- **Development-only**: Disabled in production for performance

**Location**: `lib-liveeditor/debugLogger.ts`

---

## Debug Logger

### Architecture

```typescript
class DebugLogger {
  private logs: DebugLog[] = [];           // All operations
  private changeLogs: ChangeLog[] = [];    // Data changes
  private previousStates: Map<string, any> = new Map();  // State tracking
  private isEnabled: boolean;              // Only in development
  private maxLogs: number = 1000;          // Prevent memory issues
}
```

### Log Types

#### DebugLog

```typescript
interface DebugLog {
  timestamp: string;        // ISO timestamp
  source: string;           // "COMPONENT_ADD", "EDITOR_STORE", etc.
  action: string;           // "ADD_COMPONENT", "UPDATE_DATA", etc.
  data: any;                // Operation data
  componentId?: string;     // Component UUID
  componentName?: string;   // Component variant
  componentType?: string;   // Component type
}
```

#### ChangeLog

```typescript
interface ChangeLog {
  timestamp: string;
  componentId: string;
  componentName: string;
  componentType: string;
  before: any;              // State before change
  after: any;               // State after change
  changeType: "GLOBAL_HEADER" | "GLOBAL_FOOTER" | "COMPONENT_UPDATE";
}
```

### Core Methods

#### log()

**Purpose**: Record general operation

```typescript
debugLogger.log(
  source: string,      // "SIDEBAR", "EDITOR_STORE", etc.
  action: string,      // "OPEN", "UPDATE_DATA", etc.
  data: any,           // Operation details
  componentInfo?: {
    componentId?: string;
    componentName?: string;
    componentType?: string;
  }
)
```

**Example**:
```typescript
debugLogger.log(
  "SIDEBAR",
  "OPEN",
  { view: "edit-component", componentId: "uuid-123" },
  {
    componentId: "uuid-123",
    componentName: "hero1",
    componentType: "hero"
  }
);
```

**Log Format**:
```
[2025-10-26 14:30:15.234] [SIDEBAR] [OPEN] [ID:uuid-123] [NAME:hero1] [TYPE:hero]
{
  "view": "edit-component",
  "componentId": "uuid-123"
}
================================================================================
```

#### logChange()

**Purpose**: Track data changes with before/after comparison

```typescript
debugLogger.logChange(
  componentId: string,
  componentName: string,
  componentType: string,
  newData: any,
  changeType: "GLOBAL_HEADER" | "GLOBAL_FOOTER" | "COMPONENT_UPDATE"
)
```

**Example**:
```typescript
// In EditorSidebar handleSave
logChange(
  selectedComponent.id,
  selectedComponent.componentName,
  selectedComponent.type,
  mergedData,
  "COMPONENT_UPDATE"
);
```

**Change Log Format**:
```
[2025-10-26 14:30:20.456] [ID:uuid-123] [NAME:hero1] [TYPE:hero] [CHANGE:COMPONENT_UPDATE]

BEFORE:
{
  "content": {
    "title": "Old Title"
  }
}

AFTER:
{
  "content": {
    "title": "New Title"
  }
}
================================================================================
```

### Helper Methods

#### Component Logging

```typescript
// Log component addition
debugLogger.logComponentAdd(
  componentId,
  componentName,
  componentType,
  data
);

// Log component change (theme switch, etc.)
debugLogger.logComponentChange(
  componentId,
  oldTheme,
  newTheme,
  data
);

// Log component render
debugLogger.logComponentRender(
  componentId,
  componentName,
  componentType,
  data
);
```

#### Store Logging

```typescript
// Log editorStore operations
debugLogger.logEditorStore(
  "UPDATE_BY_PATH",
  componentId,
  componentName,
  { path, value }
);

// Log tenantStore operations
debugLogger.logTenantStore(
  "FETCH_DATA",
  tenantId,
  tenantName,
  { success: true }
);
```

#### Sidebar Logging

```typescript
// Log sidebar operations
debugLogger.logSidebar(
  "SAVE_CHANGES",
  componentId,
  componentName,
  { mergedData }
);
```

#### User Action Logging

```typescript
// Log user interactions
debugLogger.logUserAction(
  "CLICK_EDIT",
  componentId,
  componentName,
  { timestamp: Date.now() }
);
```

### Log Management

#### Get Logs

```typescript
// Get all logs as array
const logs = debugLogger.getAllLogs();

// Get logs as formatted string
const logsString = debugLogger.getLogsAsString();

// Get change logs
const changeLogs = debugLogger.getAllChangeLogs();
const changeLogsString = debugLogger.getChangeLogsAsString();
```

#### Clear Logs

```typescript
// Clear all operation logs
debugLogger.clearLog();

// Clear change logs
debugLogger.clearChangeLogs();
```

#### Download Logs

```typescript
// Download as text file
debugLogger.downloadLogs();

// Creates file: debug-log-2025-10-26.txt
```

---

## Change Tracking

### How Change Tracking Works

```
CHANGE TRACKING FLOW:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: Initial State Recorded
────────────────────────────────────────────────
Component first loaded:
  componentId: "uuid-123"
  componentName: "hero1"
  data: { content: { title: "Old Title" } }

logChange("uuid-123", "hero1", "hero", data, "COMPONENT_UPDATE")
  ↓
previousStates.set("uuid-123_hero1", data)
  ↓
No previous state → Record as initial state


STEP 2: User Makes Changes
────────────────────────────────────────────────
User edits title to "New Title"
  ↓
Save changes
  ↓
newData: { content: { title: "New Title" } }


STEP 3: Compare and Log
────────────────────────────────────────────────
logChange("uuid-123", "hero1", "hero", newData, "COMPONENT_UPDATE")
  ↓
Get previous: previousStates.get("uuid-123_hero1")
  ↓
Compare: JSON.stringify(previous) !== JSON.stringify(newData)
  ↓
Different! Create change log:
  {
    timestamp: "2025-10-26 14:30:20.456",
    componentId: "uuid-123",
    componentName: "hero1",
    componentType: "hero",
    before: { content: { title: "Old Title" } },
    after: { content: { title: "New Title" } },
    changeType: "COMPONENT_UPDATE"
  }
  ↓
Add to changeLogs array
  ↓
Update previousStates with new data


STEP 4: View Changes
────────────────────────────────────────────────
const changes = getChangeLogsAsString();

Output:
  === CHANGES DETECTED ===
  
  [2025-10-26 14:30:20.456] [ID:uuid-123] [NAME:hero1] [TYPE:hero] [CHANGE:COMPONENT_UPDATE]
  
  BEFORE:
  {
    "content": {
      "title": "Old Title"
    }
  }
  
  AFTER:
  {
    "content": {
      "title": "New Title"
    }
  }
  ================================================================================


RESULT: All changes tracked ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Change Types

1. **GLOBAL_HEADER**: Changes to global header
2. **GLOBAL_FOOTER**: Changes to global footer
3. **COMPONENT_UPDATE**: Changes to regular components

**Usage**:
```typescript
// In EditorSidebar handleSave
if (selectedComponent.id === "global-header") {
  logChange(
    selectedComponent.id,
    "header1",
    "header",
    latestTempData,
    "GLOBAL_HEADER"
  );
} else if (selectedComponent.id === "global-footer") {
  logChange(
    selectedComponent.id,
    "footer1",
    "footer",
    latestTempData,
    "GLOBAL_FOOTER"
  );
} else {
  logChange(
    selectedComponent.id,
    selectedComponent.componentName,
    selectedComponent.type,
    mergedData,
    "COMPONENT_UPDATE"
  );
}
```

---

## Debug Panel

### Debug Controls Component

**Location**: `components/tenant/live-editor/debug/DebugControls.tsx`

**Purpose**: Visual interface for debugging in development mode

```typescript
export function DebugControls({
  pageComponents,
  positionValidation,
  debugInfo,
  selectedComponentId,
  onResetPositions
}) {
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [logs, setLogs] = useState<DebugLog[]>([]);
  const [changeLogs, setChangeLogs] = useState<ChangeLog[]>([]);
  
  // Refresh logs periodically
  useEffect(() => {
    if (showDebugPanel) {
      const interval = setInterval(() => {
        setLogs(getDebugLogs());
        setChangeLogs(getAllChangeLogs());
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [showDebugPanel]);
  
  return (
    <div className="debug-controls">
      {/* Toggle button */}
      <button
        onClick={() => setShowDebugPanel(!showDebugPanel)}
        className="debug-toggle"
      >
        🐛 Debug {showDebugPanel ? "▼" : "▶"}
      </button>
      
      {/* Debug panel */}
      {showDebugPanel && (
        <div className="debug-panel">
          {/* Tab navigation */}
          <Tabs defaultValue="validation">
            <TabsList>
              <TabsTrigger value="validation">Validation</TabsTrigger>
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="changes">Changes</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>
            
            {/* Validation tab */}
            <TabsContent value="validation">
              <div className="validation-status">
                <h4>Position Validation</h4>
                <div className={positionValidation.isValid ? "valid" : "invalid"}>
                  {positionValidation.isValid ? "✅ Valid" : "❌ Invalid"}
                </div>
                
                {!positionValidation.isValid && (
                  <div className="issues">
                    <h5>Issues:</h5>
                    {positionValidation.issues.map((issue, i) => (
                      <div key={i} className="error">{issue}</div>
                    ))}
                    
                    <h5>Suggestions:</h5>
                    {positionValidation.suggestions.map((suggestion, i) => (
                      <div key={i} className="suggestion">💡 {suggestion}</div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Components tab */}
            <TabsContent value="components">
              <div className="components-list">
                <h4>Current Components ({pageComponents.length})</h4>
                
                {pageComponents.map((comp, index) => (
                  <div
                    key={comp.id}
                    className={selectedComponentId === comp.id ? "selected" : ""}
                  >
                    <div className="component-header">
                      <span className="index">{index}</span>
                      <span className="name">{comp.componentName || comp.name}</span>
                    </div>
                    
                    <div className="component-details">
                      <div>ID: {comp.id.slice(0, 8)}...</div>
                      <div>Type: {comp.type}</div>
                      <div>Position: {comp.position ?? "undefined"}</div>
                      <div>Layout Row: {comp.layout?.row ?? "undefined"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {/* Changes tab */}
            <TabsContent value="changes">
              <div className="changes-list">
                <div className="header">
                  <h4>Changes ({changeLogs.length})</h4>
                  <button onClick={() => clearChangeLogs()}>
                    Clear
                  </button>
                </div>
                
                {changeLogs.map((log, i) => (
                  <div key={i} className="change-log">
                    <div className="change-header">
                      <span>{log.timestamp}</span>
                      <span className="badge">{log.changeType}</span>
                    </div>
                    
                    <div className="change-details">
                      <div>Component: {log.componentName}</div>
                      <div>Type: {log.componentType}</div>
                      <div>ID: {log.componentId.slice(0, 8)}...</div>
                    </div>
                    
                    <details>
                      <summary>View Changes</summary>
                      
                      <div className="diff">
                        <div className="before">
                          <h5>Before:</h5>
                          <pre>{JSON.stringify(log.before, null, 2)}</pre>
                        </div>
                        
                        <div className="after">
                          <h5>After:</h5>
                          <pre>{JSON.stringify(log.after, null, 2)}</pre>
                        </div>
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {/* Logs tab */}
            <TabsContent value="logs">
              <div className="logs-list">
                <div className="header">
                  <h4>Logs ({logs.length})</h4>
                  <button onClick={() => clearDebugLog()}>
                    Clear
                  </button>
                  <button onClick={() => downloadDebugLog()}>
                    Download
                  </button>
                </div>
                
                {logs.slice(-50).reverse().map((log, i) => (
                  <div key={i} className="log-entry">
                    <div className="log-header">
                      <span className="timestamp">{log.timestamp}</span>
                      <span className="source">{log.source}</span>
                      <span className="action">{log.action}</span>
                    </div>
                    
                    {log.componentId && (
                      <div className="component-info">
                        {log.componentName} ({log.componentType})
                      </div>
                    )}
                    
                    <details>
                      <summary>View Data</summary>
                      <pre>{JSON.stringify(log.data, null, 2)}</pre>
                    </details>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {/* Actions tab */}
            <TabsContent value="actions">
              <div className="actions-panel">
                <h4>Debug Actions</h4>
                
                <div className="action-group">
                  <h5>Positions</h5>
                  <button onClick={onResetPositions}>
                    Reset All Positions
                  </button>
                  <button onClick={() => {
                    console.log("Current positions:", 
                      pageComponents.map(c => ({ id: c.id, pos: c.position }))
                    );
                  }}>
                    Log Positions to Console
                  </button>
                </div>
                
                <div className="action-group">
                  <h5>Logs</h5>
                  <button onClick={() => clearDebugLog()}>
                    Clear All Logs
                  </button>
                  <button onClick={() => clearChangeLogs()}>
                    Clear Change Logs
                  </button>
                  <button onClick={() => downloadDebugLog()}>
                    Download Logs
                  </button>
                </div>
                
                <div className="action-group">
                  <h5>Store State</h5>
                  <button onClick={() => {
                    const state = useEditorStore.getState();
                    console.log("Editor Store State:", state);
                  }}>
                    Log Store State
                  </button>
                  <button onClick={() => {
                    const state = useTenantStore.getState();
                    console.log("Tenant Store State:", state);
                  }}>
                    Log Tenant State
                  </button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
```

---

## Console Logging Patterns

### Pattern 1: Operation Logging

```typescript
// At start of operation
console.log("🚀 [Operation] Starting:", operationName, params);

// During operation
console.log("🔄 [Operation] Processing:", currentStep, data);

// At end of operation
console.log("✅ [Operation] Complete:", result);

// On error
console.error("❌ [Operation] Error:", error);
```

### Pattern 2: Data Flow Logging

```typescript
// Data source
console.log("📦 [Data] Source:", { type: "store", data: storeData });

// Data merge
console.log("🔧 [Data] Merge:", {
  existing: existingData,
  store: storeData,
  temp: tempData,
  merged: mergedData
});

// Data update
console.log("💾 [Data] Update:", { path, oldValue, newValue });
```

### Pattern 3: Component Lifecycle Logging

```typescript
// Component mount
console.log("🎨 [Component] Mount:", { id, type, componentName });

// Component data init
console.log("📥 [Component] Data Init:", { id, data });

// Component update
console.log("🔄 [Component] Update:", { id, changes });

// Component unmount
console.log("🗑️ [Component] Unmount:", { id });
```

### Pattern 4: Store Operation Logging

```typescript
// Store get
console.log("🔍 [Store] Get:", { type, id, data });

// Store set
console.log("💾 [Store] Set:", { type, id, newData });

// Store update by path
console.log("✏️ [Store] Update:", { type, id, path, value });
```

### Pattern 5: User Action Logging

```typescript
// User click
console.log("👆 [User] Click:", { target, componentId });

// User edit
console.log("✏️ [User] Edit:", { field, oldValue, newValue });

// User save
console.log("💾 [User] Save:", { componentId, changes });
```

---

## Common Debug Scenarios

### Scenario 1: Component Not Updating

**Debug Steps**:

```typescript
// 1. Check if store data updated
console.log("Store data:", 
  useEditorStore.getState().getComponentData(type, id)
);

// 2. Check if pageComponentsByPage updated
console.log("Page components:", 
  useEditorStore.getState().pageComponentsByPage[currentPage]
);

// 3. Check if local state updated
console.log("Local pageComponents:", pageComponents);

// 4. Check component key (for re-render)
console.log("Component key:", `${component.id}-${forceUpdate}`);

// 5. Check tempData
console.log("Temp data:", useEditorStore.getState().tempData);

// 6. Check merge result
console.log("Merged data:", mergedData);
```

### Scenario 2: Save Not Working

**Debug Steps**:

```typescript
// 1. Check handleSave called
console.log("🚀 handleSave called");

// 2. Check data sources
console.log("Data sources:", {
  existingData: existingComponent?.data,
  storeData: store.getComponentData(type, id),
  tempData: store.tempData
});

// 3. Check merge result
console.log("Merged data:", mergedData);

// 4. Check store update
setTimeout(() => {
  console.log("After setComponentData:", 
    store.getComponentData(type, id)
  );
}, 100);

// 5. Check pageComponentsByPage
setTimeout(() => {
  console.log("After forceUpdate:", 
    store.pageComponentsByPage[currentPage]
  );
}, 100);

// 6. Check parent notified
console.log("onComponentUpdate called:", id, mergedData);
```

### Scenario 3: Drag & Drop Issues

**Debug Steps**:

```typescript
// 1. Check source and target
console.log("Drag & Drop:", {
  source: { id: source.id, type: source.type },
  target: { id: target.id, type: target.type }
});

// 2. Check position calculation
console.log("Position calc:", {
  dragY,
  sortedElements,
  calculatedIndex,
  adjustedIndex
});

// 3. Check move execution
console.log("Move:", {
  from: sourceIndex,
  to: targetIndex,
  adjustedTo: adjustedFinalIndex
});

// 4. Check updated components
console.log("Updated components:", 
  updatedComponents.map(c => ({ id: c.id, pos: c.position }))
);

// 5. Check validation
console.log("Validation:", validateComponentPositions(updatedComponents));
```

### Scenario 4: Global Component Issues

**Debug Steps**:

```typescript
// 1. Check component ID
console.log("Component ID:", selectedComponent.id);
console.log("Is global:", 
  selectedComponent.id === "global-header" ||
  selectedComponent.id === "global-footer"
);

// 2. Check global data
console.log("Global header:", useEditorStore.getState().globalHeaderData);
console.log("Global footer:", useEditorStore.getState().globalFooterData);
console.log("Unified global:", useEditorStore.getState().globalComponentsData);

// 3. Check tempData during edit
console.log("Temp data:", useEditorStore.getState().tempData);

// 4. Check save flow
console.log("Saving global header:", latestTempData);
console.log("After save:", useEditorStore.getState().globalComponentsData.header);
```

---

## Advanced Debugging

### State Snapshot

```typescript
// Take complete snapshot of editor state
const takeSnapshot = () => {
  const editorState = useEditorStore.getState();
  const tenantState = useTenantStore.getState();
  
  const snapshot = {
    timestamp: new Date().toISOString(),
    
    editor: {
      currentPage: editorState.currentPage,
      hasChanges: editorState.hasChangesMade,
      tempData: editorState.tempData,
      
      globalComponents: {
        header: editorState.globalHeaderData,
        footer: editorState.globalFooterData
      },
      
      componentStates: {
        heroStates: editorState.heroStates,
        headerStates: editorState.headerStates,
        // ... all component states
      },
      
      pages: editorState.pageComponentsByPage
    },
    
    tenant: {
      tenantId: tenantState.tenantId,
      loading: tenantState.loadingTenantData,
      hasData: !!tenantState.tenantData
    }
  };
  
  console.log("📸 Snapshot:", snapshot);
  return snapshot;
};
```

### Compare Snapshots

```typescript
const compareSnapshots = (snapshot1, snapshot2) => {
  const differences = [];
  
  // Compare component states
  for (const type in snapshot1.editor.componentStates) {
    const state1 = snapshot1.editor.componentStates[type];
    const state2 = snapshot2.editor.componentStates[type];
    
    for (const id in state1) {
      if (JSON.stringify(state1[id]) !== JSON.stringify(state2[id])) {
        differences.push({
          type: "component_state",
          componentType: type,
          componentId: id,
          before: state1[id],
          after: state2[id]
        });
      }
    }
  }
  
  // Compare pages
  for (const page in snapshot1.editor.pages) {
    if (
      JSON.stringify(snapshot1.editor.pages[page]) !==
      JSON.stringify(snapshot2.editor.pages[page])
    ) {
      differences.push({
        type: "page",
        page,
        before: snapshot1.editor.pages[page],
        after: snapshot2.editor.pages[page]
      });
    }
  }
  
  console.log("🔍 Differences:", differences);
  return differences;
};
```

### Performance Monitoring

```typescript
// Measure operation time
const measureOperation = async (name, operation) => {
  const start = performance.now();
  
  const result = await operation();
  
  const end = performance.now();
  const duration = end - start;
  
  console.log(`⏱️ [Performance] ${name}: ${duration.toFixed(2)}ms`);
  
  if (duration > 100) {
    console.warn(`⚠️ Slow operation: ${name} took ${duration}ms`);
  }
  
  return result;
};

// Usage
await measureOperation("Save All Pages", async () => {
  await savePagesToDatabase(payload);
});
```

---

## Important Notes for AI

### When to Use Debug Logger

1. **Major operations**: Save, load, delete, theme change
2. **State updates**: Any change to editorStore or tenantStore
3. **User actions**: Click, edit, drag & drop
4. **Error conditions**: Catch blocks, validation failures
5. **Data merges**: Before/after significant merges

### When to Use Console Logs

1. **Development debugging**: Quick checks during development
2. **Flow tracing**: Track execution path
3. **Value inspection**: Check intermediate values
4. **Error details**: Log error context

### Log Level Guidelines

```typescript
// Information (normal operations)
console.log("✅ Operation complete");

// Warning (potential issues)
console.warn("⚠️ Unusual condition detected");

// Error (actual problems)
console.error("❌ Operation failed:", error);

// Debug (detailed tracing)
console.debug("🔍 Debug info:", details);
```

### Emojis for Log Clarity

```typescript
🚀 - Operation start
✅ - Success
❌ - Error
⚠️ - Warning
🔍 - Debug/Inspect
🔄 - Processing/Update
💾 - Save
📥 - Load
📦 - Data
🔧 - Merge/Transform
👆 - User action
🎨 - Component/UI
📍 - Position/Location
⏱️ - Performance
📸 - Snapshot
```

---

## Summary

The debug and logging system provides:

1. **Centralized logging**: All operations tracked
2. **Change tracking**: Before/after comparisons
3. **Visual debug panel**: UI for viewing logs
4. **Log export**: Download for analysis
5. **Development-only**: No performance impact in production

**Key Features**:
- Automatic state tracking
- Change detection
- Formatted log output
- Memory management (max 1000 logs)
- Easy integration with codebase

**Usage**:
- Import debugLogger or helper functions
- Call appropriate log method
- View in debug panel or console
- Download for detailed analysis

Understanding the debug system enables:
- Faster debugging
- Better error tracking
- Performance monitoring
- Change auditing
- Issue reproduction

