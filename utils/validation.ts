import { Component, Wire, Circuit, GridPosition } from '@/types';

/**
 * Validates if the user's circuit matches the target circuit exactly
 * Checks: component types, grid positions, and wire connections
 */
export function validateCircuit(
  userComponents: Component[],
  userWires: Wire[],
  targetCircuit: Circuit
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // 1. Check if component types match (excluding battery holder which is pre-placed)
  const targetTypes = targetCircuit.targetComponents
    .filter(c => c.type !== 'battery_holder')
    .map(c => c.type)
    .sort();
  
  const userTypes = userComponents
    .filter(c => c.type !== 'battery_holder')
    .map(c => c.type)
    .sort();

  if (JSON.stringify(targetTypes) !== JSON.stringify(userTypes)) {
    errors.push('Component types do not match the target circuit');
    return { isValid: false, errors };
  }

  // 2. Check if all components are in correct grid positions
  // Create a map of component types to their positions
  const targetPositionMap = new Map<string, GridPosition>();
  targetCircuit.targetComponents.forEach(comp => {
    const key = `${comp.type}-${comp.gridPosition.x}-${comp.gridPosition.y}`;
    targetPositionMap.set(key, comp.gridPosition);
  });

  const userPositionMap = new Map<string, GridPosition>();
  userComponents.forEach(comp => {
    const key = `${comp.type}-${comp.gridPosition.x}-${comp.gridPosition.y}`;
    userPositionMap.set(key, comp.gridPosition);
  });

  // Check if positions match
  let positionsMatch = true;
  targetCircuit.targetComponents.forEach(targetComp => {
    const userComp = userComponents.find(
      uc => uc.type === targetComp.type &&
      uc.gridPosition.x === targetComp.gridPosition.x &&
      uc.gridPosition.y === targetComp.gridPosition.y
    );
    if (!userComp) {
      positionsMatch = false;
    }
  });

  if (!positionsMatch) {
    errors.push('Component positions do not match the target circuit');
  }

  // 3. Check wire connections - must match exactly
  if (userWires.length !== targetCircuit.targetWires.length) {
    errors.push('Number of wire connections does not match');
  } else {
    // Create normalized wire connection sets for comparison
    const normalizeWire = (wire: Wire) => {
      const [from, to] = [wire.fromConnectionPointId, wire.toConnectionPointId].sort();
      return `${from}-${to}`;
    };

    const targetWireSet = new Set(targetCircuit.targetWires.map(normalizeWire));
    const userWireSet = new Set(userWires.map(normalizeWire));

    // Check if all target wires exist in user wires
    for (const targetWire of targetWireSet) {
      if (!userWireSet.has(targetWire)) {
        errors.push('Wire connections do not match the target circuit');
        break;
      }
    }

    // Check if user has extra wires
    for (const userWire of userWireSet) {
      if (!targetWireSet.has(userWire)) {
        errors.push('Extra wire connections detected');
        break;
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Check if a grid position is valid (within 7x5 grid)
 */
export function isValidGridPosition(position: GridPosition): boolean {
  return position.x >= 0 && position.x < 7 && position.y >= 0 && position.y < 5;
}

/**
 * Snap a pixel position to the nearest grid cell
 */
export function snapToGrid(pixelX: number, pixelY: number, cellSize: number): GridPosition {
  return {
    x: Math.max(0, Math.min(6, Math.round(pixelX / cellSize))),
    y: Math.max(0, Math.min(4, Math.round(pixelY / cellSize))),
  };
}

/**
 * Convert grid position to pixel coordinates
 */
export function gridToPixel(gridPos: GridPosition, cellSize: number): { x: number; y: number } {
  return {
    x: gridPos.x * cellSize,
    y: gridPos.y * cellSize,
  };
}

/**
 * Check if a grid position (and the cells a component would occupy) is available
 */
export function isGridPositionOccupied(
  position: GridPosition,
  componentType: import('@/types').ComponentType,
  components: Component[],
  excludeComponentId?: string
): boolean {
  const { COMPONENT_SIZES } = require('@/types');
  const size = COMPONENT_SIZES[componentType];
  
  // Check if component would fit within grid bounds
  if (position.x + size.width > 7 || position.y + size.height > 5) {
    return true; // Out of bounds
  }

  // Check each cell the component would occupy
  for (let dx = 0; dx < size.width; dx++) {
    for (let dy = 0; dy < size.height; dy++) {
      const checkX = position.x + dx;
      const checkY = position.y + dy;
      
      // Check if any existing component occupies this cell
      const occupied = components.some(comp => {
        if (comp.id === excludeComponentId) return false;
        
        const compSize = COMPONENT_SIZES[comp.type];
        return (
          checkX >= comp.gridPosition.x &&
          checkX < comp.gridPosition.x + compSize.width &&
          checkY >= comp.gridPosition.y &&
          checkY < comp.gridPosition.y + compSize.height
        );
      });
      
      if (occupied) return true;
    }
  }

  return false;
}

/**
 * Get all grid cells occupied by a component
 */
export function getOccupiedCells(component: Component): GridPosition[] {
  const { COMPONENT_SIZES } = require('@/types');
  const size = COMPONENT_SIZES[component.type];
  const cells: GridPosition[] = [];
  
  for (let dx = 0; dx < size.width; dx++) {
    for (let dy = 0; dy < size.height; dy++) {
      cells.push({
        x: component.gridPosition.x + dx,
        y: component.gridPosition.y + dy,
      });
    }
  }
  
  return cells;
}

