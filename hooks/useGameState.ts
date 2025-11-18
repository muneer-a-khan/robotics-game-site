'use client';

// Game State Hook

import { useCallback } from 'react';
import { useGameContext } from '@/contexts/GameContext';
import { ComponentType, PhysicalComponent, SnapPoint } from '@/types/component.types';
import { Difficulty } from '@/types/game.types';
import { getOccupiedSnapPoints, getTerminals } from '@/utils/snap-logic';
import { COMPONENT_PATTERNS, GRID_CONFIG } from '@/config/components.config';

export function useGameState() {
  const { state, dispatch } = useGameContext();
  
  const selectComponent = useCallback((type: ComponentType | null) => {
    dispatch({ type: 'SELECT_COMPONENT', payload: type });
  }, [dispatch]);
  
  const placeComponent = useCallback((
    componentType: ComponentType,
    terminal1: SnapPoint,
    terminal2: SnapPoint,
    orientation: 0 | 90 | 180 | 270 = 0
  ) => {
    const componentId = `${componentType}-${Date.now()}`;
    const pattern = COMPONENT_PATTERNS[componentType];

    // Auto-calculate orientation based on terminal positions
    const deltaX = Math.abs(terminal2.x - terminal1.x);
    const deltaY = Math.abs(terminal2.y - terminal1.y);

    // If the connection is more vertical than horizontal, rotate 90 degrees
    const calculatedOrientation = deltaY > deltaX ? 90 : 0;

    // Use calculated orientation if no explicit orientation provided
    const finalOrientation = orientation === 0 ? calculatedOrientation : orientation;

    // VALIDATION: Check that distance between terminals matches component size
    const gridDistanceX = Math.abs(terminal2.col - terminal1.col);
    const gridDistanceY = Math.abs(terminal2.row - terminal1.row);

    // Get required size based on orientation
    const requiredWidth = finalOrientation === 90 || finalOrientation === 270
      ? pattern.height
      : pattern.width;
    const requiredHeight = finalOrientation === 90 || finalOrientation === 270
      ? pattern.width
      : pattern.height;

    // Validate horizontal or vertical placement
    const isHorizontal = gridDistanceY === 0 && gridDistanceX === requiredWidth - 1;
    const isVertical = gridDistanceX === 0 && gridDistanceY === requiredHeight - 1;

    if (!isHorizontal && !isVertical) {
      alert(
        `Invalid placement!\n\n` +
        `${pattern.displayName} requires ${requiredWidth} grid points in a ${finalOrientation === 90 || finalOrientation === 270 ? 'vertical' : 'horizontal'} line.\n` +
        `You selected points that are ${gridDistanceX + 1} units apart horizontally and ${gridDistanceY + 1} units apart vertically.\n\n` +
        `Please select exactly ${requiredWidth} consecutive points in a straight line.`
      );
      return null;
    }
    
    // Calculate component position to be centered on the line between terminals
    const centerX = (terminal1.x + terminal2.x) / 2;
    const centerY = (terminal1.y + terminal2.y) / 2;
    
    // Create a virtual anchor point at the center
    const anchorPoint: SnapPoint = {
      id: `center-${componentId}`,
      row: Math.round(centerY / GRID_CONFIG.CELL_SIZE),
      col: Math.round(centerX / GRID_CONFIG.CELL_SIZE),
      x: centerX,
      y: centerY,
      occupied: false,
    };
    
    // Get occupied snap points (but we'll override the positioning)
    const snapPoints = getOccupiedSnapPoints(
      anchorPoint,
      componentType,
      state.snapGrid,
      finalOrientation
    );
    
    // Create component with custom positioning
    const component: PhysicalComponent = {
      id: componentId,
      type: componentType,
      state: 'placed',
      snapPoints: [terminal1, terminal2], // Only use the two selected terminals
      terminals: [
        {
          id: `terminal-1-${componentId}`,
          componentId,
          position: finalOrientation === 90 ? 'top' : 'left',
          snapPoint: terminal1,
          isOccupied: true,
        },
        {
          id: `terminal-2-${componentId}`,
          componentId,
          position: finalOrientation === 90 ? 'bottom' : 'right',
          snapPoint: terminal2,
          isOccupied: true,
        }
      ],
      orientation: finalOrientation,
      isLocked: componentType === 'battery_holder',
      image: COMPONENT_PATTERNS[componentType].image,
      // Custom positioning for line placement - use consistent component dimensions
      customPosition: {
        x: centerX,
        y: centerY,
        width: COMPONENT_PATTERNS[componentType].width * GRID_CONFIG.CELL_SIZE,
        height: COMPONENT_PATTERNS[componentType].height * GRID_CONFIG.CELL_SIZE,
      }
    };
    
    dispatch({
      type: 'PLACE_COMPONENT',
      payload: {
        component,
        snapPointIds: [terminal1.id, terminal2.id],
      },
    });
    
    return component;
  }, [state.snapGrid, dispatch]);
  
  const placeMusicCircuit = useCallback((
    componentType: ComponentType,
    terminals: SnapPoint[]
  ) => {
    const componentId = `${componentType}-${Date.now()}`;
    const pattern = COMPONENT_PATTERNS[componentType];

    // VALIDATION: Check that we have exactly 5 terminals for music IC
    if (terminals.length !== 5) {
      alert(
        `Invalid placement!\n\n` +
        `${pattern.displayName} requires exactly 5 terminals.\n` +
        `You selected ${terminals.length} terminals.`
      );
      return null;
    }

    // VALIDATION: Check that terminals form a valid 2×2 pattern
    const minCol = Math.min(...terminals.map(t => t.col));
    const maxCol = Math.max(...terminals.map(t => t.col));
    const minRow = Math.min(...terminals.map(t => t.row));
    const maxRow = Math.max(...terminals.map(t => t.row));

    const widthInGrid = maxCol - minCol;
    const heightInGrid = maxRow - minRow;

    // Music IC is 2×2, so should span 1 grid unit in each direction (0 to 1 = 2 points)
    const isValidHorizontal = widthInGrid === 1 && heightInGrid === 1;
    const isValidVertical = widthInGrid === 1 && heightInGrid === 1;

    if (!isValidHorizontal && !isValidVertical) {
      alert(
        `Invalid placement!\n\n` +
        `${pattern.displayName} requires terminals forming a 2×2 grid pattern.\n` +
        `Your selected terminals span ${widthInGrid + 1}×${heightInGrid + 1} grid units.\n\n` +
        `Please select 5 terminals: 2 on bottom corners, 3 on top edge (left, center, right).`
      );
      return null;
    }

    // Calculate component position to be centered on the terminals
    const centerX = terminals.reduce((sum, t) => sum + t.x, 0) / terminals.length;
    const centerY = terminals.reduce((sum, t) => sum + t.y, 0) / terminals.length;

    // Determine orientation based on terminal arrangement
    // If terminals are more spread vertically than horizontally, rotate 90 degrees
    const deltaX = Math.max(...terminals.map(t => t.x)) - Math.min(...terminals.map(t => t.x));
    const deltaY = Math.max(...terminals.map(t => t.y)) - Math.min(...terminals.map(t => t.y));
    const orientation = deltaY > deltaX ? 90 : 0;
    
    // Create a virtual anchor point at the center
    const anchorPoint: SnapPoint = {
      id: `center-${componentId}`,
      row: Math.round(centerY / GRID_CONFIG.CELL_SIZE),
      col: Math.round(centerX / GRID_CONFIG.CELL_SIZE),
      x: centerX,
      y: centerY,
      occupied: false,
    };
    
    // Get occupied snap points
    const snapPoints = getOccupiedSnapPoints(
      anchorPoint,
      componentType,
      state.snapGrid,
      orientation
    );

    // Create terminals with proper positions based on the pattern and orientation
    // (pattern already defined at the top of function for validation)

    // Map terminal positions based on orientation
    const mapTerminalPositions = (basePositions: string[], orientation: number) => {
      if (orientation === 90) {
        // Rotate positions 90 degrees clockwise
        // Original top edge (3 terminals) becomes right side
        // Original bottom edge (2 terminals) becomes left side
        const positionMap: Record<string, string> = {
          'top-left': 'top-right',      // top-left -> top-right
          'top-center': 'center-right', // top-center -> center-right
          'top-right': 'bottom-right',  // top-right -> bottom-right
          'bottom-left': 'top-left',    // bottom-left -> top-left
          'bottom-right': 'bottom-left' // bottom-right -> bottom-left
        };
        return basePositions.map(pos => positionMap[pos] || pos);
      }
      return basePositions;
    };
    
    const adjustedPositions = mapTerminalPositions(pattern.terminals, orientation);
    
    const createdTerminals = terminals.map((terminal, index) => ({
      id: `terminal-${index}-${componentId}`,
      componentId,
      position: adjustedPositions[index] as any,
      snapPoint: terminal,
      isOccupied: true,
    }));
    
    // Create component with custom positioning
    const component: PhysicalComponent = {
      id: componentId,
      type: componentType,
      state: 'placed',
      snapPoints: terminals,
      terminals: createdTerminals,
      orientation: orientation as 0 | 90 | 180 | 270,
      isLocked: componentType === 'battery_holder',
      image: COMPONENT_PATTERNS[componentType].image,
      // Custom positioning for music circuits
      customPosition: {
        x: centerX,
        y: centerY,
        width: COMPONENT_PATTERNS[componentType].width * GRID_CONFIG.CELL_SIZE,
        height: COMPONENT_PATTERNS[componentType].height * GRID_CONFIG.CELL_SIZE,
      }
    };
    
    dispatch({
      type: 'PLACE_COMPONENT',
      payload: {
        component,
        snapPointIds: terminals.map(t => t.id),
      },
    });
    
    return component;
  }, [state.snapGrid, dispatch]);
  
  const placeBatteryHolder = useCallback((
    componentType: ComponentType,
    terminals: SnapPoint[]
  ) => {
    const componentId = `${componentType}-${Date.now()}`;
    
    // Calculate component position to align corners with terminals
    const minX = Math.min(...terminals.map(t => t.x));
    const maxX = Math.max(...terminals.map(t => t.x));
    const minY = Math.min(...terminals.map(t => t.y));
    const maxY = Math.max(...terminals.map(t => t.y));
    
    // Position component so its corners align with the terminal positions
    const componentX = minX;
    const componentY = minY;
    
    // Determine orientation based on terminal arrangement
    // If terminals are more spread vertically than horizontally, rotate 90 degrees
    const deltaX = Math.max(...terminals.map(t => t.x)) - Math.min(...terminals.map(t => t.x));
    const deltaY = Math.max(...terminals.map(t => t.y)) - Math.min(...terminals.map(t => t.y));
    const orientation = deltaY > deltaX ? 90 : 0;
    
    // Create a virtual anchor point at the top-left corner
    const anchorPoint: SnapPoint = {
      id: `anchor-${componentId}`,
      row: Math.round(componentY / GRID_CONFIG.CELL_SIZE),
      col: Math.round(componentX / GRID_CONFIG.CELL_SIZE),
      x: componentX,
      y: componentY,
      occupied: false,
    };
    
    // Get occupied snap points
    const snapPoints = getOccupiedSnapPoints(
      anchorPoint,
      componentType,
      state.snapGrid,
      orientation
    );
    
    // Create terminals with proper positions based on the pattern and orientation
    const pattern = COMPONENT_PATTERNS[componentType];
    
    // Map terminal positions based on orientation
    const mapTerminalPositions = (basePositions: string[], orientation: number) => {
      if (orientation === 90) {
        // Rotate positions 90 degrees clockwise
        // Original corners become rotated corners
        const positionMap: Record<string, string> = {
          'top-left': 'bottom-left',
          'top-right': 'top-left',
          'bottom-left': 'bottom-right',
          'bottom-right': 'top-right'
        };
        return basePositions.map(pos => positionMap[pos] || pos);
      }
      return basePositions;
    };
    
    const adjustedPositions = mapTerminalPositions(pattern.terminals, orientation);
    
    const createdTerminals = terminals.map((terminal, index) => ({
      id: `terminal-${index}-${componentId}`,
      componentId,
      position: adjustedPositions[index] as any,
      snapPoint: terminal,
      isOccupied: true,
    }));
    
    // Create component with custom positioning
    const component: PhysicalComponent = {
      id: componentId,
      type: componentType,
      state: 'placed',
      snapPoints: terminals,
      terminals: createdTerminals,
      orientation: orientation as 0 | 90 | 180 | 270,
      isLocked: false, // Battery holder is no longer locked
      image: COMPONENT_PATTERNS[componentType].image,
      // Custom positioning for battery holder - align corners with terminal positions
      customPosition: {
        x: componentX,
        y: componentY,
        width: maxX - minX,
        height: maxY - minY,
      }
    };
    
    dispatch({
      type: 'PLACE_COMPONENT',
      payload: {
        component,
        snapPointIds: terminals.map(t => t.id),
      },
    });
    
    return component;
  }, [state.snapGrid, dispatch]);
  
  const placeBatteryHolderWithOrientation = useCallback((
    componentType: ComponentType,
    terminals: SnapPoint[],
    orientation: 0 | 90
  ) => {
    const componentId = `${componentType}-${Date.now()}`;
    const pattern = COMPONENT_PATTERNS[componentType];

    // VALIDATION: Check that we have exactly 4 terminals for battery holder
    if (terminals.length !== 4) {
      alert(
        `Invalid placement!\n\n` +
        `${pattern.displayName} requires exactly 4 terminals (one on each corner).\n` +
        `You selected ${terminals.length} terminals.`
      );
      return null;
    }

    // Calculate component position to align corners with terminals
    const minX = Math.min(...terminals.map(t => t.x));
    const maxX = Math.max(...terminals.map(t => t.x));
    const minY = Math.min(...terminals.map(t => t.y));
    const maxY = Math.max(...terminals.map(t => t.y));

    // VALIDATION: Check that terminals form a valid rectangle
    const minCol = Math.min(...terminals.map(t => t.col));
    const maxCol = Math.max(...terminals.map(t => t.col));
    const minRow = Math.min(...terminals.map(t => t.row));
    const maxRow = Math.max(...terminals.map(t => t.row));

    const widthInGrid = maxCol - minCol;
    const heightInGrid = maxRow - minRow;

    // Battery holder is 2×2, so should span 1 grid unit in each direction
    const expectedWidth = orientation === 0 ? pattern.width - 1 : pattern.height - 1;
    const expectedHeight = orientation === 0 ? pattern.height - 1 : pattern.width - 1;

    if (widthInGrid !== expectedWidth || heightInGrid !== expectedHeight) {
      alert(
        `Invalid placement!\n\n` +
        `${pattern.displayName} with ${orientation === 0 ? 'horizontal' : 'vertical'} orientation requires a ${expectedWidth + 1}×${expectedHeight + 1} rectangle.\n` +
        `Your selected terminals form a ${widthInGrid + 1}×${heightInGrid + 1} rectangle.\n\n` +
        `Please select 4 terminals forming the corners of a ${expectedWidth + 1}×${expectedHeight + 1} rectangle.`
      );
      return null;
    }

    // Position component so its corners align with the terminal positions
    const componentX = minX;
    const componentY = minY;

    // Create a virtual anchor point at the top-left corner
    const anchorPoint: SnapPoint = {
      id: `anchor-${componentId}`,
      row: Math.round(componentY / GRID_CONFIG.CELL_SIZE),
      col: Math.round(componentX / GRID_CONFIG.CELL_SIZE),
      x: componentX,
      y: componentY,
      occupied: false,
    };

    // Get occupied snap points
    const snapPoints = getOccupiedSnapPoints(
      anchorPoint,
      componentType,
      state.snapGrid,
      orientation
    );

    // Create terminals with proper positions based on the pattern and orientation
    // (pattern already defined at the top of function for validation)
    
    // Map terminal positions based on orientation
    const mapTerminalPositions = (basePositions: string[], orientation: number) => {
      if (orientation === 90) {
        // Rotate positions 90 degrees clockwise
        // Original corners become rotated corners
        const positionMap: Record<string, string> = {
          'top-left': 'bottom-left',
          'top-right': 'top-left',
          'bottom-left': 'bottom-right',
          'bottom-right': 'top-right'
        };
        return basePositions.map(pos => positionMap[pos] || pos);
      }
      return basePositions;
    };
    
    const adjustedPositions = mapTerminalPositions(pattern.terminals, orientation);
    
    const createdTerminals = terminals.map((terminal, index) => ({
      id: `terminal-${index}-${componentId}`,
      componentId,
      position: adjustedPositions[index] as any,
      snapPoint: terminal,
      isOccupied: true,
    }));
    
    // Create component with custom positioning
    const component: PhysicalComponent = {
      id: componentId,
      type: componentType,
      state: 'placed',
      snapPoints: terminals,
      terminals: createdTerminals,
      orientation: orientation,
      isLocked: false, // Battery holder is no longer locked
      image: COMPONENT_PATTERNS[componentType].image,
      // Custom positioning for battery holder - align corners with terminal positions
      customPosition: {
        x: componentX,
        y: componentY,
        width: maxX - minX,
        height: maxY - minY,
      }
    };
    
    dispatch({
      type: 'PLACE_COMPONENT',
      payload: {
        component,
        snapPointIds: terminals.map(t => t.id),
      },
    });
    
    return component;
  }, [state.snapGrid, dispatch]);
  
  const removeComponent = useCallback((componentId: string) => {
    dispatch({ type: 'REMOVE_COMPONENT', payload: componentId });
  }, [dispatch]);
  
  const rotateComponent = useCallback((componentId: string) => {
    dispatch({ type: 'ROTATE_COMPONENT', payload: componentId });
  }, [dispatch]);
  
  const highlightSnapPoints = useCallback((snapPointIds: string[]) => {
    dispatch({ type: 'HIGHLIGHT_SNAP_POINTS', payload: snapPointIds });
  }, [dispatch]);
  
  const startGame = useCallback((
    sessionId: string,
    difficulty: Difficulty,
    circuitNumber: number
  ) => {
    dispatch({
      type: 'START_GAME',
      payload: { sessionId, difficulty, circuitNumber },
    });
  }, [dispatch]);
  
  const stopTimer = useCallback(() => {
    dispatch({ type: 'STOP_TIMER' });
  }, [dispatch]);
  
  const setValidationErrors = useCallback((errors: string[]) => {
    dispatch({ type: 'SET_VALIDATION_ERRORS', payload: errors });
  }, [dispatch]);
  
  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, [dispatch]);
  
  return {
    // State
    ...state,
    
    // Actions
    selectComponent,
    placeComponent,
    placeMusicCircuit,
    placeBatteryHolder,
    placeBatteryHolderWithOrientation,
    removeComponent,
    rotateComponent,
    highlightSnapPoints,
    startGame,
    stopTimer,
    setValidationErrors,
    resetGame,
    dispatch,
  };
}

