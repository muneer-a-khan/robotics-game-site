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
      orientation
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
      // Custom positioning for line placement
      customPosition: {
        x: centerX,
        y: centerY,
        width: Math.abs(terminal2.x - terminal1.x) + GRID_CONFIG.CELL_SIZE,
        height: Math.abs(terminal2.y - terminal1.y) + GRID_CONFIG.CELL_SIZE,
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

