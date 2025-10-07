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
 */
export function getValidSnapPoints(
  componentType: ComponentType,
  snapGrid: SnapPoint[][],
  existingComponents: Map<string, PhysicalComponent>,
  orientation: 0 | 90 | 180 | 270 = 0
): SnapPoint[] {
  const pattern = COMPONENT_PATTERNS[componentType];
  const validPoints: SnapPoint[] = [];
  
  // Get actual dimensions based on orientation
  const { width, height } = getOrientedDimensions(pattern.width, pattern.height, orientation);
  
  // Iterate through all snap points
  for (let row = 0; row < snapGrid.length; row++) {
    for (let col = 0; col < snapGrid[row].length; col++) {
      const anchorPoint = snapGrid[row][col];
      
      // Check if component fits starting from this point
      if (canPlaceComponent(anchorPoint, width, height, snapGrid)) {
        validPoints.push(anchorPoint);
      }
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
  snapGrid: SnapPoint[][]
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
        return false;
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
      if (point.row >= 0 && point.row < newGrid.length && 
          point.col >= 0 && point.col < newGrid[0].length) {
        newGrid[point.row][point.col].occupied = true;
        newGrid[point.row][point.col].componentId = component.id;
      }
    });
  });
  
  return newGrid;
}

