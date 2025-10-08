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
    
    // Calculate component position so connection points align with clicked snap points
    const componentPattern = COMPONENT_PATTERNS[componentType];
    
    // Calculate the distance between terminals
    const terminalDistance = Math.sqrt(
      Math.pow(terminal2.x - terminal1.x, 2) + Math.pow(terminal2.y - terminal1.y, 2)
    );
    
    // Calculate component dimensions based on terminal distance and component pattern
    const componentWidth = Math.max(terminalDistance, GRID_CONFIG.CELL_SIZE * componentPattern.width);
    const componentHeight = Math.max(GRID_CONFIG.CELL_SIZE * componentPattern.height, GRID_CONFIG.CELL_SIZE * 0.5);
    
    // Calculate the component's center position
    const centerX = (terminal1.x + terminal2.x) / 2;
    const centerY = (terminal1.y + terminal2.y) / 2;
    
    // Calculate the component's top-left position
    const componentX = centerX - componentWidth / 2;
    const componentY = centerY - componentHeight / 2;
    
    // Create component with connection-point-based positioning
    const component: PhysicalComponent = {
      id: componentId,
      type: componentType,
      state: 'placed',
      snapPoints: [terminal1, terminal2], // Only use the two selected terminals
      terminals: [
        {
          id: `terminal-1-${componentId}`,
          componentId,
          position: 'left',
          snapPoint: terminal1,
          isOccupied: true,
        },
        {
          id: `terminal-2-${componentId}`,
          componentId,
          position: 'right',
          snapPoint: terminal2,
          isOccupied: true,
        }
      ],
      orientation,
      isLocked: componentType === 'battery_holder',
      image: COMPONENT_PATTERNS[componentType].image,
      // Position component so its connection points align with the clicked snap points
      customPosition: {
        x: componentX,
        y: componentY,
        width: componentWidth,
        height: componentHeight,
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
    removeComponent,
    rotateComponent,
    highlightSnapPoints,
    startGame,
    stopTimer,
    setValidationErrors,
    resetGame,
  };
}

