'use client';

// Snap Logic Hook

import { useCallback } from 'react';
import { useGameState } from './useGameState';
import { ComponentType } from '@/types/component.types';
import { getValidSnapPoints, findNearestSnapPoint } from '@/utils/snap-logic';

export function useSnapLogic() {
  const { snapGrid, components, selectedComponent } = useGameState();
  
  const getValidPoints = useCallback((
    componentType: ComponentType,
    orientation: 0 | 90 | 180 | 270 = 0
  ) => {
    return getValidSnapPoints(componentType, snapGrid, components, orientation);
  }, [snapGrid, components]);
  
  const findNearestPoint = useCallback((x: number, y: number) => {
    return findNearestSnapPoint(x, y, snapGrid);
  }, [snapGrid]);
  
  const getValidPointIds = useCallback((
    componentType: ComponentType,
    orientation: 0 | 90 | 180 | 270 = 0
  ) => {
    const validPoints = getValidSnapPoints(componentType, snapGrid, components, orientation);
    return validPoints.map(p => p.id);
  }, [snapGrid, components]);
  
  return {
    getValidPoints,
    findNearestPoint,
    getValidPointIds,
  };
}

