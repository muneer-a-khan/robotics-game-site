'use client';

// Main Snap Circuit Board Component

import { useEffect, useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSnapLogic } from '@/hooks/useSnapLogic';
import { useActionTracking } from '@/hooks/useActionTracking';
import { SnapPoint } from '@/types/component.types';
import { GRID_CONFIG } from '@/config/components.config';
import { findOverlapTerminalSnapPosition } from '@/utils/snap-logic';
import { SnapPointGrid } from './SnapPointGrid';
import { PhysicalComponent } from './PhysicalComponent';
import { WireRenderer } from './WireRenderer';

export function SnapCircuitBoard() {
  const {
    snapGrid,
    components,
    connections,
    selectedComponent,
    highlightedSnapPoints,
    sessionId,
    placeComponent,
    highlightSnapPoints,
  } = useGameState();
  
  const { getValidPointIds } = useSnapLogic();
  const { trackAction } = useActionTracking(sessionId);
  
  // State for two-terminal clicking
  const [firstTerminal, setFirstTerminal] = useState<SnapPoint | null>(null);
  
  // Update highlighted snap points when component is selected
  useEffect(() => {
    if (selectedComponent) {
      // Show all snap points (no validation)
      const allIds = snapGrid.flat().map(point => point.id);
      highlightSnapPoints(allIds);
    } else {
      highlightSnapPoints([]);
      setFirstTerminal(null); // Reset terminal selection
    }
  }, [selectedComponent, snapGrid, highlightSnapPoints]);
  
  const handleSnapPointClick = (point: SnapPoint) => {
    if (!selectedComponent) {
      return;
    }
    
    if (!firstTerminal) {
      // First terminal selected
      setFirstTerminal(point);
    } else {
      // Check if terminals are adjacent (not allowed)
      const isAdjacent = Math.abs(firstTerminal.row - point.row) <= 1 && 
                        Math.abs(firstTerminal.col - point.col) <= 1;
      
      if (isAdjacent) {
        // Reset selection if terminals are too close
        setFirstTerminal(null);
        return;
      }
      
      // Try to find a snap position that aligns with existing component terminals
      const snapPosition = findOverlapTerminalSnapPosition(
        selectedComponent,
        point,
        components,
        snapGrid,
        0 // default orientation
      );
      
      // Use snap position if found, otherwise use the clicked point
      const finalPosition = snapPosition || point;
      
      // Second terminal selected - place component
      const component = placeComponent(selectedComponent, firstTerminal, finalPosition);
      
      // Track action
      if (component) {
        trackAction({
          actionType: 'place',
          componentType: component.type,
          componentId: component.id,
          snapPointIds: component.snapPoints.map(p => p.id),
          orientation: component.orientation,
        });
      }
      
      // Reset selection
      setFirstTerminal(null);
    }
  };
  
  const componentsArray = Array.from(components.values());
  
  return (
    <div className="relative">
      {/* Instructions */}
      {selectedComponent && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            {firstTerminal 
              ? `Now click the second terminal for your ${selectedComponent} component (must be at least 2 grid spaces away)`
              : `Click the first terminal for your ${selectedComponent} component`
            }
          </p>
        </div>
      )}
      
      {/* Column labels (1-10) */}
      <div className="flex justify-start mb-2 ml-8">
        {GRID_CONFIG.COL_LABELS.map((label, index) => (
          <div
            key={`col-${index}`}
            className="text-center font-bold text-sm text-amber-900"
            style={{ width: GRID_CONFIG.CELL_SIZE }}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="flex">
        {/* Row labels (A-G) */}
        <div className="flex flex-col justify-start mr-2">
          {GRID_CONFIG.ROW_LABELS.map((label, index) => (
            <div
              key={`row-${index}`}
              className="flex items-center justify-center font-bold text-sm text-amber-900"
              style={{ height: GRID_CONFIG.CELL_SIZE }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Main board */}
        <div
          className="relative bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border-4 border-amber-800 overflow-visible"
          style={{
            width: GRID_CONFIG.COLS * GRID_CONFIG.CELL_SIZE,
            height: GRID_CONFIG.ROWS * GRID_CONFIG.CELL_SIZE,
          }}
        >
          {/* Grid lines */}
          <svg 
            className="absolute inset-0 pointer-events-none" 
            style={{ zIndex: 0 }}
            width={GRID_CONFIG.COLS * GRID_CONFIG.CELL_SIZE}
            height={GRID_CONFIG.ROWS * GRID_CONFIG.CELL_SIZE}
          >
            {/* Vertical lines */}
            {Array.from({ length: GRID_CONFIG.COLS + 1 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={i * GRID_CONFIG.CELL_SIZE}
                y1={0}
                x2={i * GRID_CONFIG.CELL_SIZE}
                y2={GRID_CONFIG.ROWS * GRID_CONFIG.CELL_SIZE}
                stroke="rgba(120, 53, 15, 0.3)"
                strokeWidth="1"
              />
            ))}
            {/* Horizontal lines */}
            {Array.from({ length: GRID_CONFIG.ROWS + 1 }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1={0}
                y1={i * GRID_CONFIG.CELL_SIZE}
                x2={GRID_CONFIG.COLS * GRID_CONFIG.CELL_SIZE}
                y2={i * GRID_CONFIG.CELL_SIZE}
                stroke="rgba(120, 53, 15, 0.3)"
                strokeWidth="1"
              />
            ))}
          </svg>

          {/* Snap point grid */}
          <SnapPointGrid
            points={snapGrid}
            highlighted={highlightedSnapPoints}
            firstTerminal={firstTerminal}
            onPointClick={handleSnapPointClick}
          />

          {/* Wire connections */}
          <WireRenderer connections={connections} components={components} />

          {/* Placed components */}
          <div className="absolute inset-0" style={{ zIndex: 10 }}>
            {componentsArray.map((component, index) => (
              <PhysicalComponent 
                key={component.id} 
                component={component}
                zIndex={10 + index} // Later components appear on top
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

