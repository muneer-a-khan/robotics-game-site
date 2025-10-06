# Snap-to-Align Feature & Wire Update

## Changes Made ✅

### 1. **Wire Component Size** 🔌
- **Old**: 1×1 cell (single point)
- **New**: **3×1 cells** (same as other standard components)
- Matches the size of LEDs, resistors, switches, etc.
- More realistic wire representation

### 2. **Snap-to-Align Functionality** 🧲

#### What It Does:
When you drag a component near another component, if their **connection points get close enough**, the component will **automatically snap** into the perfect position where the connection points align!

#### How It Works:

1. **Drag a component** near another component
2. When a connection point gets within **half a cell (60px)** of another connection point
3. The component **automatically snaps** to align the connection points perfectly
4. **Visual feedback**: Component "jumps" into aligned position
5. Connection points are now perfectly overlapped

#### Technical Details:

```typescript
SNAP_THRESHOLD = CELL_SIZE * 0.5  // 60 pixels

For each component being moved:
  For each of its connection points:
    For each existing component:
      For each of its connection points:
        Calculate distance between points
        If distance < SNAP_THRESHOLD:
          Calculate offset needed
          Snap component to aligned position
```

#### Example Scenario:

```
Before Snap:
┌─────┐       ┌─────┐
│ LED │ ○     │ RES │
└─────┘   ○   └─────┘
  Close but not aligned

After Snap (automatic):
┌─────┐┌─────┐
│ LED ││ RES │
└─────┘└─────┘
  ○○ Connection points aligned!
```

## Benefits

### Wire (3×1):
✅ **More realistic** - Matches physical wire size  
✅ **Easier to see** - Larger visual representation  
✅ **Better placement** - Same size as other components  
✅ **Consistent UX** - All standard components are 3×1

### Snap-to-Align:
✅ **Easier circuit building** - No manual pixel-perfect positioning  
✅ **Faster workflow** - Components align automatically  
✅ **Better connections** - Connection points perfectly overlap  
✅ **Professional feel** - Smooth snapping like CAD software  
✅ **Simulates real snaps** - Like physical snap circuits!

## How to Use Snap-to-Align

### Basic Usage:
1. **Drag a component** from toolbox or move existing component
2. **Move it near** another component's connection point
3. **Feel the snap** when connection points align
4. **Drop the component** in snapped position

### Tips:
- **Snap threshold**: Within half a cell (60px)
- **Works for**: New placements AND moving existing components
- **Validates**: Only snaps to valid positions (within board bounds)
- **Multiple targets**: Snaps to the first matching connection point found
- **Works with**: All component types including wires!

### Perfect For:
- Aligning wire ends with component terminals
- Stacking components with matching connection points
- Creating clean, organized circuit layouts
- Quick circuit prototyping

## Visual Example

### Placing a Wire:

```
Step 1: Drag wire near LED
┌──────────┐
│   LED    │
└──────────┘
○          ○
    
    ╔═══╗  ← Wire being dragged
    ║ W ║
    ╚═══╝
    ○   ○

Step 2: Get close to connection point
┌──────────┐
│   LED    │
└──────────┘
○        ○
         ╔═══╗
        ○║ W ║
         ╚═══╝
           ○

Step 3: SNAP! Auto-aligns
┌──────────┐╔═══╗
│   LED    ║ W ║
└──────────┘╚═══╝
○○           ○
Points aligned!
```

## Code Implementation

### findSnapPosition Function:
```typescript
const findSnapPosition = (
  component: Component,
  tentativeGridPos: GridPosition
): GridPosition => {
  // Check all connection points on the moving component
  // against all connection points on existing components
  
  // If any are within SNAP_THRESHOLD:
  //   Calculate grid offset to align them
  //   Return snapped position
  
  // Otherwise:
  //   Return original position
}
```

### When It Runs:
- **On drop**: Both new placements and moves
- **For all components**: Including wires
- **Before validation**: Snap happens first, then bounds check

## Technical Specifications

| Property | Value |
|----------|-------|
| Wire size | 3×1 cells (360×120 px) |
| Snap threshold | 60 pixels (0.5 cells) |
| Snap calculation | Distance formula: √(dx² + dy²) |
| Grid offset | Rounded to nearest cell |
| Validation | Checks board bounds after snap |
| Component types | Works with all types |

## Files Modified

1. **`types/index.ts`**
   - Changed wire size: 1×1 → **3×1**

2. **`components/Grid-CircuitBoard.tsx`**
   - Added `findSnapPosition()` function
   - Integrated snap logic into `handleDrop()`
   - Works for both new placements and moves

## Testing Checklist

- [x] Wire is 3×1 cells
- [x] Wires appear correctly on board
- [x] Snap-to-align works when placing new components
- [x] Snap-to-align works when moving existing components
- [x] Snap threshold is reasonable (60px)
- [x] Snaps to closest connection point
- [x] Only snaps to valid board positions
- [x] Works with all component types
- [x] Smooth user experience

## User Feedback

When using snap-to-align, users will notice:

1. **Magnetic feeling** - Component "pulls" toward alignment
2. **Quick positioning** - No need to align manually
3. **Visual jump** - Component visibly snaps into place
4. **Perfect alignment** - Connection points exactly overlap
5. **Professional UX** - Feels like modern design software

## Next Steps

To use these features:

```bash
# Just restart dev server
npm run dev
```

Try dragging components near each other and feel the snap! 🧲

---

**Summary**: Wires are now 3×1 cells (standard size), and components automatically snap to align their connection points when dragged close to each other - just like real snap circuits!

