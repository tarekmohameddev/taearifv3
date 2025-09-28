// This file is for debugging drag and drop issues.

// Logic from services/live-editor/dragDrop/enhanced-position-tracker.ts
class EnhancedPositionTracker {
  trackComponentMove(
    components,
    sourceIndex,
    sourceZone,
    destinationIndex,
    destinationZone
  ) {
    try {
      const workingComponents = [...components];
      const [movedComponent] = workingComponents.splice(sourceIndex, 1);
      workingComponents.splice(destinationIndex, 0, movedComponent);

      const updatedComponents = workingComponents.map((comp, index) => ({
        ...comp,
        position: index,
        layout: {
          ...comp.layout,
          row: index,
        },
      }));

      return {
        success: true,
        updatedComponents,
        debugInfo: {
          finalIndex: destinationIndex,
        },
      };
    } catch (error) {
      return { success: false, updatedComponents: components };
    }
  }
}
const positionTracker = new EnhancedPositionTracker();

// Sample data representing pageComponents
const initialComponents = [
  { id: "a", componentName: "Hero", position: 0, layout: { row: 0 } },
  { id: "b", componentName: "About", position: 1, layout: { row: 1 } },
  { id: "c", componentName: "Services", position: 2, layout: { row: 2 } },
  { id: "d", componentName: "Portfolio", position: 3, layout: { row: 3 } },
  { id: "e", componentName: "Contact", position: 4, layout: { row: 4 } },
];

function simulateMove(sourceIndex, destinationIndex) {
  console.log(`\n--- Simulating move from index ${sourceIndex} to ${destinationIndex} ---`);
  console.log(
    "Initial state:",
    initialComponents.map((c) => ({ id: c.id, pos: c.position }))
  );

  const result = positionTracker.trackComponentMove(
    initialComponents,
    sourceIndex,
    "main",
    destinationIndex,
    "main"
  );

  if (result.success) {
    console.log(
      "Final state:",
      result.updatedComponents.map((c) => ({ id: c.id, pos: c.position }))
    );
  } else {
    console.error("Move simulation failed.");
  }
}

// --- Start Simulation ---
console.log("Drag and drop debug file started.");

// Simulation 1: Move "Hero" (0) to be after "About" (1), so destination is 2
// In splice, to insert after index 1, the destination index should be 2 if we remove first.
// But if we use index based on list, destination is just 1. Let's see what happens.
// If I drag item 0 and drop it on item 1, the drop target index is 1.
// Let's test moving item at index 0 to index 2
simulateMove(0, 2);

// Simulation 2: Move "Contact" (4) to the top (0)
// To do this I need to refresh the component list.
// For this test I will just use the initial list.
simulateMove(4, 0);

// Simulation 3: Move "About" (1) to be last (5)
simulateMove(1, 4);

// The issue seems to be how destinationIndex is calculated.
// When an item is moved down, the destination index needs to be adjusted.
// e.g. move 0 to position 2.
// 1. remove item at 0. array is now [b, c, d, e]. length 4
// 2. insert at index 2. array is now [b, c, ITEM, d, e].
// This seems correct.

// Let's re-read the code in EnhancedLiveEditorDragDropContext.
// It seems `targetIndex` is what's being calculated incorrectly.
// `onComponentMove` is called with `result.debugInfo.finalIndex`
// which is `destinationIndex` in my simulation.

// The issue is likely in `EnhancedLiveEditorDragDropContext`'s `onDragEnd`.
// The logic for calculating `targetIndex` seems complex and might be faulty.

console.log("\nDebug session finished.");
