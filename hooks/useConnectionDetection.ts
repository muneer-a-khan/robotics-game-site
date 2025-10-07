'use client';

// Connection Detection Hook

import { useCallback } from 'react';
import { useGameState } from './useGameState';
import { traceCircuit } from '@/utils/connection-validator';

export function useConnectionDetection() {
  const { components, connections } = useGameState();
  
  const getConnectedComponents = useCallback((componentId: string) => {
    return traceCircuit(componentId, connections, components);
  }, [connections, components]);
  
  const isComponentConnected = useCallback((componentId: string) => {
    return connections.some(
      c => c.fromComponent === componentId || c.toComponent === componentId
    );
  }, [connections]);
  
  const getComponentConnections = useCallback((componentId: string) => {
    return connections.filter(
      c => c.fromComponent === componentId || c.toComponent === componentId
    );
  }, [connections]);
  
  return {
    getConnectedComponents,
    isComponentConnected,
    getComponentConnections,
  };
}

