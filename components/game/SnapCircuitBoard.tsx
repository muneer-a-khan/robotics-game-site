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
  const [isOverlapMode, setIsOverlapMode] = useState(false);
  const [overlapSourceComponent, setOverlapSourceComponent] = useState<PhysicalComponent | null>(null);
  
  // Reset terminal selection when no component is selected
  useEffect(() => {
    if (!selectedComponent) {
      setFirstTerminal(null);
    }
  }, [selectedComponent]);
  
  const handleSnapPointClick = (point: SnapPoint) => {
    console.log('SnapPoint clicked:', point.id, 'selectedComponent:', selectedComponent, 'firstTerminal:', firstTerminal?.id, 'isOverlapMode:', isOverlapMode);
    
    if (!selectedComponent && !isOverlapMode) {
      console.log('No component selected and not in overlap mode, ignoring click');
      return;
    }

    if (isOverlapMode) {
      // In overlap mode - check if this is a connection point of an existing component
      const clickedComponent = componentsArray.find(comp => 
        comp.terminals.some(terminal => terminal.snapPoint.id === point.id)
      );
      
      if (clickedComponent && !overlapSourceComponent) {
        // First click on a component's connection point - enter overlap mode
        console.log('Starting overlap mode with component:', clickedComponent.id);
        setOverlapSourceComponent(clickedComponent);
        setFirstTerminal(point);
        setIsOverlapMode(true);
      } else if (overlapSourceComponent && firstTerminal) {
        // Second click - place component with overlap
        console.log('Placing component with overlap from', overlapSourceComponent.id, 'to', point.id);
        const component = placeComponent(selectedComponent || 'wire', firstTerminal, point);
        
        if (component) {
          trackAction({
            actionType: 'place',
            componentType: component.type,
            componentId: component.id,
            snapPointIds: component.snapPoints.map(p => p.id),
            orientation: component.orientation,
          });
        }
        
        // Reset overlap mode
        setFirstTerminal(null);
        setIsOverlapMode(false);
        setOverlapSourceComponent(null);
      }
    } else if (selectedComponent) {
      // Normal placement mode
      if (!firstTerminal) {
        // First terminal selected
        console.log('Setting first terminal:', point.id);
        setFirstTerminal(point);
      } else {
        // Second terminal selected - place component
        console.log('Placing component with terminals:', firstTerminal.id, 'and', point.id);
        const component = placeComponent(selectedComponent, firstTerminal, point);

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
    }
  };
  
  const componentsArray = Array.from(components.values());
  
  return (
    <div className="relative">
      {/* Instructions */}
      {selectedComponent && !isOverlapMode && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            {firstTerminal
              ? `Now click the second terminal for your ${selectedComponent} component`
              : `Click the first terminal for your ${selectedComponent} component`
            }
          </p>
        </div>
      )}
      
      {isOverlapMode && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-800">
            {overlapSourceComponent && firstTerminal
              ? `Now click any point to place a component that will overlap with ${overlapSourceComponent.type}`
              : `Click on a connection point of an existing component to start overlap mode`
            }
          </p>
          <p className="text-xs text-orange-600 mt-1">
            Orange points = will cause overlap, Green points = normal placement
          </p>
        </div>
      )}
      
      {/* Overlap Mode Toggle */}
      <div className="mb-4">
        <button
          onClick={() => {
            setIsOverlapMode(!isOverlapMode);
            setFirstTerminal(null);
            setOverlapSourceComponent(null);
          }}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isOverlapMode
              ? 'bg-orange-600 hover:bg-orange-700 text-white'
              : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
        >
          {isOverlapMode ? '🔄 Overlap Mode ON' : '🔗 Enable Overlap Mode'}
        </button>
      </div>
      
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
          <div className="absolute inset-0" style={{ zIndex: 20 }}>
            <SnapPointGrid
              points={snapGrid}
              highlighted={[]} // No highlighting - all points are always clickable
              firstTerminal={firstTerminal}
              isOverlapMode={isOverlapMode}
              onPointClick={handleSnapPointClick}
            />
          </div>

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

