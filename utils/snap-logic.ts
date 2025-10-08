// Snap Logic Utilities

import { SnapPoint, PhysicalComponent, ComponentType, SnapTerminal, TerminalPosition } from '@/types/component.types';
import { COMPONENT_PATTERNS, GRID_CONFIG } from '@/config/components.config';

/**
 * Initialize the snap grid with all available snap points
 */
export function initializeSnapGrid(): SnapPoint[][] {
  const grid: SnapPoint[][] = [];
  
  for (let row = 0; row < GRID_CONFIG.ROWS; row++) {
    grid[row] = [];
    for (let col = 0; col < GRID_CONFIG.COLS; col++) {
      grid[row][col] = {
        id: `snap-${row}-${col}`,
        row,
        col,
        x: col * GRID_CONFIG.CELL_SIZE,
        y: row * GRID_CONFIG.CELL_SIZE,
        occupied: false
      };
    }
  }
  
  return grid;
}

/**
 * Get valid snap points for placing a component
 * NO VALIDATION - all grid intersections are clickable
 */
export function getValidSnapPoints(
  componentType: ComponentType,
  snapGrid: SnapPoint[][],
  existingComponents: Map<string, PhysicalComponent>,
  orientation: 0 | 90 | 180 | 270 = 0
): SnapPoint[] {
  // Return ALL snap points - no validation
  const validPoints: SnapPoint[] = [];
  
  for (let row = 0; row < snapGrid.length; row++) {
    for (let col = 0; col < snapGrid[row].length; col++) {
      validPoints.push(snapGrid[row][col]);
    }
  }
  
  return validPoints;
}

/**
 * Check if a component can be placed at a given anchor point
 */
function canPlaceComponent(
  anchorPoint: SnapPoint,
  width: number,
  height: number,
  snapGrid: SnapPoint[][],
  allowTerminalSnapping: boolean = false
): boolean {
  // Check all snap points needed for this component
  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      const row = anchorPoint.row + dy;
      const col = anchorPoint.col + dx;
      
      // Check bounds
      if (row >= snapGrid.length || col >= snapGrid[0].length || row < 0 || col < 0) {
        return false;
      }
      
      const point = snapGrid[row][col];
      
      // Check if occupied
      if (point.occupied) {
        // If terminal snapping is allowed, we can place on occupied points
        // This allows components to snap onto existing terminal connection points
        if (!allowTerminalSnapping) {
          return false;
        }
      }
    }
  }
  
  return true;
}

/**
 * Get snap points occupied by a component at a given position
 */
export function getOccupiedSnapPoints(
  anchorPoint: SnapPoint,
  componentType: ComponentType,
  snapGrid: SnapPoint[][],
  orientation: 0 | 90 | 180 | 270
): SnapPoint[] {
  const pattern = COMPONENT_PATTERNS[componentType];
  const { width, height } = getOrientedDimensions(pattern.width, pattern.height, orientation);
  const occupiedPoints: SnapPoint[] = [];
  
  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      const row = anchorPoint.row + dy;
      const col = anchorPoint.col + dx;
      
      if (row >= 0 && row < snapGrid.length && col >= 0 && col < snapGrid[0].length) {
        occupiedPoints.push(snapGrid[row][col]);
      }
    }
  }
  
  return occupiedPoints;
}

/**
 * Get terminal positions for a component
 */
export function getTerminals(
  component: PhysicalComponent,
  snapGrid: SnapPoint[][]
): SnapTerminal[] {
  const pattern = COMPONENT_PATTERNS[component.type];
  const terminals: SnapTerminal[] = [];
  
  // Get component's snap points
  const snapPoints = component.snapPoints;
  if (snapPoints.length === 0) return [];
  
  // Find anchor point (top-left)
  const anchorPoint = snapPoints[0];
  const { width, height } = getOrientedDimensions(pattern.width, pattern.height, component.orientation);
  
  // Map terminal positions to snap points
  pattern.terminals.forEach((terminalPos, index) => {
    const snapPoint = getTerminalSnapPoint(anchorPoint, terminalPos, width, height, snapGrid);
    
    if (snapPoint) {
      terminals.push({
        id: `${component.id}-terminal-${index}`,
        componentId: component.id,
        position: terminalPos,
        snapPoint,
        isOccupied: false
      });
    }
  });
  
  return terminals;
}

/**
 * Get snap point for a specific terminal position
 */
function getTerminalSnapPoint(
  anchorPoint: SnapPoint,
  position: TerminalPosition,
  width: number,
  height: number,
  snapGrid: SnapPoint[][]
): SnapPoint | null {
  let row = anchorPoint.row;
  let col = anchorPoint.col;
  
  switch (position) {
    case 'left':
      // Already at anchor
      break;
    case 'right':
      col += width - 1;
      break;
    case 'top':
      // Already at anchor
      break;
    case 'bottom':
      row += height - 1;
      break;
    case 'top-left':
      // Already at anchor
      break;
    case 'top-right':
      col += width - 1;
      break;
    case 'bottom-left':
      row += height - 1;
      break;
    case 'bottom-right':
      row += height - 1;
      col += width - 1;
      break;
    case 'middle-right':
      row += Math.floor(height / 2);
      col += width - 1;
      break;
    case 'center-right':
      row += Math.floor(height / 2);
      col += width - 1;
      break;
    case 'center-left':
      row += Math.floor(height / 2);
      // Already at left edge
      break;
    case 'center':
      row += Math.floor(height / 2);
      col += Math.floor(width / 2);
      break;
  }
  
  if (row >= 0 && row < snapGrid.length && col >= 0 && col < snapGrid[0].length) {
    return snapGrid[row][col];
  }
  
  return null;
}

/**
 * Get dimensions based on orientation
 */
function getOrientedDimensions(
  width: number,
  height: number,
  orientation: 0 | 90 | 180 | 270
): { width: number; height: number } {
  if (orientation === 90 || orientation === 270) {
    return { width: height, height: width };
  }
  return { width, height };
}

/**
 * Find nearest snap point to pixel coordinates
 */
export function findNearestSnapPoint(
  x: number,
  y: number,
  snapGrid: SnapPoint[][]
): SnapPoint | null {
  const col = Math.round(x / GRID_CONFIG.CELL_SIZE);
  const row = Math.round(y / GRID_CONFIG.CELL_SIZE);
  
  if (row >= 0 && row < snapGrid.length && col >= 0 && col < snapGrid[0].length) {
    return snapGrid[row][col];
  }
  
  return null;
}

/**
 * Find the best snap position for a component to align with existing component terminals
 */
export function findTerminalSnapPosition(
  componentType: ComponentType,
  targetPoint: SnapPoint,
  existingComponents: Map<string, PhysicalComponent>,
  snapGrid: SnapPoint[][],
  orientation: 0 | 90 | 180 | 270 = 0
): SnapPoint | null {
  const pattern = COMPONENT_PATTERNS[componentType];
  const SNAP_THRESHOLD = GRID_CONFIG.CELL_SIZE * 0.5; // Half a cell
  
  // Get all terminal positions for the component
  const componentTerminals = pattern.terminals;
  
  // Try each possible placement around the target point
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const testRow = targetPoint.row + dy;
      const testCol = targetPoint.col + dx;
      
      if (testRow >= 0 && testRow < snapGrid.length && 
          testCol >= 0 && testCol < snapGrid[0].length) {
        
        const testPoint = snapGrid[testRow][testCol];
        
        // Check if component can be placed here (allow terminal snapping)
        if (canPlaceComponent(testPoint, pattern.width, pattern.height, snapGrid, true)) {
          // Check if any terminals would align with existing component terminals
          const { width, height } = getOrientedDimensions(pattern.width, pattern.height, orientation);
          
          for (const terminalPos of componentTerminals) {
            const terminalSnapPoint = getTerminalSnapPoint(testPoint, terminalPos, width, height, snapGrid);
            
            if (terminalSnapPoint) {
              // Check if this terminal aligns with any existing component terminal
              for (const [_, existingComponent] of existingComponents) {
                for (const terminal of existingComponent.terminals) {
                  const distance = Math.sqrt(
                    Math.pow(terminalSnapPoint.x - terminal.snapPoint.x, 2) +
                    Math.pow(terminalSnapPoint.y - terminal.snapPoint.y, 2)
                  );
                  
                  if (distance < SNAP_THRESHOLD) {
                    return testPoint; // Found a snap position!
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
  return null; // No snap position found
}

/**
 * Find the best snap position for a component to align with existing components
 */
export function findComponentSnapPosition(
  componentType: ComponentType,
  targetPoint: SnapPoint,
  existingComponents: Map<string, PhysicalComponent>,
  snapGrid: SnapPoint[][],
  orientation: 0 | 90 | 180 | 270 = 0
): SnapPoint | null {
  const pattern = COMPONENT_PATTERNS[componentType];
  const SNAP_THRESHOLD = GRID_CONFIG.CELL_SIZE * 0.5; // Half a cell
  
  // Get all terminal positions for the component
  const componentTerminals = pattern.terminals;
  
  // Try each possible placement around the target point
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const testRow = targetPoint.row + dy;
      const testCol = targetPoint.col + dx;
      
      if (testRow >= 0 && testRow < snapGrid.length && 
          testCol >= 0 && testCol < snapGrid[0].length) {
        
        const testPoint = snapGrid[testRow][testCol];
        
        // Check if component can be placed here (allow terminal snapping)
        if (canPlaceComponent(testPoint, pattern.width, pattern.height, snapGrid, true)) {
          // Check if any terminals would align with existing component terminals
          const { width, height } = getOrientedDimensions(pattern.width, pattern.height, orientation);
          
          for (const terminalPos of componentTerminals) {
            const terminalSnapPoint = getTerminalSnapPoint(testPoint, terminalPos, width, height, snapGrid);
            
            if (terminalSnapPoint) {
              // Check if this terminal aligns with any existing component terminal
              for (const [_, existingComponent] of existingComponents) {
                for (const terminal of existingComponent.terminals) {
                  const distance = Math.sqrt(
                    Math.pow(terminalSnapPoint.x - terminal.snapPoint.x, 2) +
                    Math.pow(terminalSnapPoint.y - terminal.snapPoint.y, 2)
                  );
                  
                  if (distance < SNAP_THRESHOLD) {
                    return testPoint; // Found a snap position!
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
  return null; // No snap position found
}

/**
 * Update grid occupation status
 */
export function updateGridOccupation(
  snapGrid: SnapPoint[][],
  components: Map<string, PhysicalComponent>
): SnapPoint[][] {
  // Create a deep copy of the grid
  const newGrid = snapGrid.map(row => 
    row.map(point => ({ ...point, occupied: false, componentId: undefined }))
  );
  
  // Mark occupied points
  components.forEach(component => {
    component.snapPoints.forEach(point => {
      if (point && typeof point.row === 'number' && typeof point.col === 'number' &&
          point.row >= 0 && point.row < newGrid.length && 
          point.col >= 0 && point.col < newGrid[0].length) {
        newGrid[point.row][point.col].occupied = true;
        (newGrid[point.row][point.col] as any).componentId = component.id;
      }
    });
  });
  
  return newGrid;
}

/**
 * Find terminal snap position that allows overlapping
 */
export function findOverlapTerminalSnapPosition(
  componentType: ComponentType,
  targetPoint: SnapPoint,
  existingComponents: Map<string, PhysicalComponent>,
  snapGrid: SnapPoint[][],
  orientation: 0 | 90 | 180 | 270 = 0
): SnapPoint | null {
  const pattern = COMPONENT_PATTERNS[componentType];
  const SNAP_THRESHOLD = GRID_CONFIG.CELL_SIZE * 0.5; // Half a cell
  
  // Get all terminal positions for the component
  const componentTerminals = pattern.terminals;
  
  // Try each possible placement around the target point
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const testRow = targetPoint.row + dy;
      const testCol = targetPoint.col + dx;
      
      if (testRow >= 0 && testRow < snapGrid.length && 
          testCol >= 0 && testCol < snapGrid[0].length) {
        
        const testPoint = snapGrid[testRow][testCol];
        const { width, height } = getOrientedDimensions(pattern.width, pattern.height, orientation);
        
        // Check if any terminals would align with existing component terminals
        for (const terminalPos of componentTerminals) {
          const terminalSnapPoint = getTerminalSnapPoint(testPoint, terminalPos, width, height, snapGrid);
          
          if (terminalSnapPoint) {
            // Check if this terminal aligns with any existing component terminal
            for (const [_, existingComponent] of existingComponents) {
              for (const terminal of existingComponent.terminals) {
                const distance = Math.sqrt(
                  Math.pow(terminalSnapPoint.x - terminal.snapPoint.x, 2) +
                  Math.pow(terminalSnapPoint.y - terminal.snapPoint.y, 2)
                );
                
                if (distance < SNAP_THRESHOLD) {
                  return testPoint; // Found a snap position!
                }
              }
            }
          }
        }
      }
    }
  }
  
  return null; // No snap position found
}

