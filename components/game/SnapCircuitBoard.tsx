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
    placeMusicCircuit,
    removeComponent,
    highlightSnapPoints,
  } = useGameState();
  
  const { getValidPointIds } = useSnapLogic();
  const { trackAction } = useActionTracking(sessionId);
  
  // State for two-terminal clicking
  const [firstTerminal, setFirstTerminal] = useState<SnapPoint | null>(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  
  // State for 5-point selection (music circuits)
  const [selectedTerminals, setSelectedTerminals] = useState<SnapPoint[]>([]);
  const isMusicCircuit = selectedComponent && ['music_ic', 'alarm_ic', 'space_war_ic'].includes(selectedComponent);
  
  // Reset terminal selection when no component is selected
  useEffect(() => {
    if (!selectedComponent) {
      setFirstTerminal(null);
      setSelectedTerminals([]);
    }
  }, [selectedComponent]);
  
  // Reset delete mode when component is selected
  useEffect(() => {
    if (selectedComponent) {
      setIsDeleteMode(false);
    }
  }, [selectedComponent]);
  
  const handleSnapPointClick = (point: SnapPoint) => {
    console.log('SnapPoint clicked:', point.id, 'selectedComponent:', selectedComponent, 'firstTerminal:', firstTerminal?.id, 'isDeleteMode:', isDeleteMode);
    
    if (!selectedComponent && !isDeleteMode) {
      console.log('No component selected and not in delete mode, ignoring click');
      return;
    }

    if (isDeleteMode) {
      // In delete mode - find all components that share this connection point
      const overlappingComponents = componentsArray.filter(comp => 
        comp.terminals.some(terminal => terminal.snapPoint.id === point.id)
      );
      
      if (overlappingComponents.length > 0) {
        // Find the topmost component (most recently placed)
        // Components are rendered in order, so the last one in the array is on top
        const topmostComponent = overlappingComponents[overlappingComponents.length - 1];
        
        // Allow deletion of all components including battery holder
        
        // Show confirmation with component count if multiple components overlap
        const confirmMessage = overlappingComponents.length > 1 
          ? `Delete ${topmostComponent.type} component? (${overlappingComponents.length} components overlap at this point - deleting the topmost one)`
          : `Delete ${topmostComponent.type} component?`;
          
        if (confirm(confirmMessage)) {
          console.log('Deleting topmost component:', topmostComponent.id, 'out of', overlappingComponents.length, 'overlapping components');
          removeComponent(topmostComponent.id);
          
          // Track action
          trackAction({
            actionType: 'remove',
            componentType: topmostComponent.type,
            componentId: topmostComponent.id,
            snapPointIds: topmostComponent.snapPoints.map(p => p.id),
            orientation: topmostComponent.orientation,
          });
        }
      }
    } else if (selectedComponent) {
      // Normal placement mode
      if (isMusicCircuit) {
        // 5-point selection for music circuits
        if (selectedTerminals.length < 5) {
          // Add terminal if not already selected
          if (!selectedTerminals.find(t => t.id === point.id)) {
            setSelectedTerminals([...selectedTerminals, point]);
            console.log(`Selected terminal ${selectedTerminals.length + 1}/5:`, point.id);
          }
        }
        
        // If we have 5 terminals, place the component
        if (selectedTerminals.length === 4) { // We just added the 5th one
          const allTerminals = [...selectedTerminals, point];
          console.log('Placing music circuit with 5 terminals:', allTerminals.map(t => t.id));
          
          // Place component with all 5 terminals
          const component = placeMusicCircuit(selectedComponent, allTerminals);
          
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
          setSelectedTerminals([]);
        }
      } else {
        // 2-point selection for regular components
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
    }
  };
  
  const componentsArray = Array.from(components.values());
  
  return (
    <div className="relative">
      {/* Instructions */}
      {selectedComponent && !isDeleteMode && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            {isMusicCircuit ? (
              selectedTerminals.length === 0
                ? `Click 5 terminals for your ${selectedComponent} component (2 on bottom corners, 3 on top edge). Component will auto-rotate if terminals are vertical.`
                : `Selected ${selectedTerminals.length}/5 terminals for your ${selectedComponent} component`
            ) : (
              firstTerminal
                ? `Now click the second terminal for your ${selectedComponent} component`
                : `Click the first terminal for your ${selectedComponent} component`
            )}
          </p>
        </div>
      )}
      
      {isDeleteMode && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            Click on any connection point of a component to delete it.
          </p>
        </div>
      )}
      
      {/* Delete Mode Toggle */}
      <div className="mb-4">
        <button
          onClick={() => {
            setIsDeleteMode(!isDeleteMode);
            setFirstTerminal(null);
            setSelectedTerminals([]);
          }}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isDeleteMode
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
        >
          {isDeleteMode ? '🗑️ Delete Mode ON' : '🗑️ Enable Delete Mode'}
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
              isDeleteMode={isDeleteMode}
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

