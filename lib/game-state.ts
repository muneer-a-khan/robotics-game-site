// Game State Management with Reducer

import { GameState, GameAction } from '@/types/game.types';
import { PhysicalComponent, SnapPoint } from '@/types/component.types';
import { initializeSnapGrid, updateGridOccupation } from '@/utils/snap-logic';
import { detectConnections } from '@/utils/connection-validator';
import { GRID_CONFIG } from '@/config/components.config';


/**
 * Initial game state
 */
export function getInitialGameState(): GameState {
  const snapGrid = initializeSnapGrid();
  const components = new Map();
  
  // No automatic battery placement - user will place it manually
  
  return {
    sessionId: null,
    currentCircuit: 1,
    difficulty: 'easy',
    snapGrid,
    components,
    connections: [],
    selectedComponent: null,
    highlightedSnapPoints: [],
    validationErrors: [],
    timeRemaining: 180,
    isPlaying: false,
    startTime: null,
  };
}

/**
 * Game state reducer
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const { sessionId, difficulty, circuitNumber } = action.payload;
      return {
        ...state,
        sessionId,
        difficulty,
        currentCircuit: circuitNumber,
        isPlaying: true,
        startTime: Date.now(),
        timeRemaining: 180,
        validationErrors: [],
      };
    }

    case 'SELECT_COMPONENT': {
      return {
        ...state,
        selectedComponent: action.payload,
        highlightedSnapPoints: [], // Will be calculated by useEffect
      };
    }

    case 'HIGHLIGHT_SNAP_POINTS': {
      return {
        ...state,
        highlightedSnapPoints: action.payload,
      };
    }

    case 'PLACE_COMPONENT': {
      const { component, snapPointIds } = action.payload;
      const newComponents = new Map(state.components);
      newComponents.set(component.id, component);
      
      // Update grid occupation
      const updatedGrid = updateGridOccupation(state.snapGrid, newComponents);
      
      // Auto-detect connections
      const connections = detectConnections(newComponents);
      
      return {
        ...state,
        components: newComponents,
        snapGrid: updatedGrid,
        connections,
        selectedComponent: null,
        highlightedSnapPoints: [],
      };
    }

    case 'REMOVE_COMPONENT': {
      const componentId = action.payload;
      const newComponents = new Map(state.components);
      newComponents.delete(componentId);
      
      // Update grid occupation
      const updatedGrid = updateGridOccupation(state.snapGrid, newComponents);
      
      // Auto-detect connections (will exclude removed component)
      const connections = detectConnections(newComponents);
      
      return {
        ...state,
        components: newComponents,
        snapGrid: updatedGrid,
        connections,
      };
    }

    case 'ROTATE_COMPONENT': {
      const componentId = action.payload;
      const newComponents = new Map(state.components);
      const component = newComponents.get(componentId);
      
      if (!component) return state;
      
      // Rotate orientation
      const newOrientation = ((component.orientation + 90) % 360) as 0 | 90 | 180 | 270;
      
      const rotatedComponent = {
        ...component,
        orientation: newOrientation,
      };
      
      newComponents.set(componentId, rotatedComponent);
      
      // Re-detect connections
      const connections = detectConnections(newComponents);
      
      return {
        ...state,
        components: newComponents,
        connections,
      };
    }

    case 'UPDATE_CONNECTIONS': {
      return {
        ...state,
        connections: action.payload,
      };
    }

    case 'SET_VALIDATION_ERRORS': {
      return {
        ...state,
        validationErrors: action.payload,
      };
    }

    case 'TICK_TIMER': {
      const newTime = Math.max(0, state.timeRemaining - 1);
      return {
        ...state,
        timeRemaining: newTime,
        isPlaying: newTime > 0,
      };
    }

    case 'STOP_TIMER': {
      return {
        ...state,
        isPlaying: false,
      };
    }

    case 'RESET_GAME': {
      return getInitialGameState();
    }

    default:
      return state;
  }
}

