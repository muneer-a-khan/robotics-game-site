'use client';

import { Component, Wire, ConnectionPoint, ComponentType, GridPosition, COMPONENT_METADATA, COMPONENT_SIZES, getConnectionPointsForType } from '@/types';
import { useState, useRef } from 'react';
import { gridToPixel, snapToGrid, isGridPositionOccupied } from '@/utils/validation';

interface GridCircuitBoardProps {
  components: Component[];
  wires: Wire[];
  onComponentPlace: (component: Component) => void;
  onComponentMove: (componentId: string, gridPosition: GridPosition) => void;
  onComponentRotate: (componentId: string) => void;
  onComponentRemove: (componentId: string) => void;
  onComponentSelect: (componentId: string | null) => void;
  onWireCreate: (wire: Wire) => void;
  onWireRemove: (wireId: string) => void;
  selectedComponentId: string | null;
  isWireMode: boolean;
  onDropToRemove?: (componentId: string) => void;
}

const GRID_COLS = 7;
const GRID_ROWS = 5;
const CELL_SIZE = 120; // pixels per cell (increased for better visibility)

export default function GridCircuitBoard({
  components,
  wires,
  onComponentPlace,
  onComponentMove,
  onComponentRotate,
  onComponentRemove,
  onComponentSelect,
  onWireCreate,
  onWireRemove,
  selectedComponentId,
  isWireMode,
}: GridCircuitBoardProps) {
  const [draggedComponent, setDraggedComponent] = useState<Component | null>(null);
  const [selectedConnectionPoint, setSelectedConnectionPoint] = useState<ConnectionPoint | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const handleComponentDragStart = (component: Component) => {
    setDraggedComponent(component);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const findSnapPosition = (
    component: Component,
    tentativeGridPos: GridPosition
  ): GridPosition => {
    const SNAP_THRESHOLD = CELL_SIZE * 0.5; // Snap within half a cell
    
    // Create temporary component at tentative position to get its connection points
    const tempComponent = { ...component, gridPosition: tentativeGridPos };
    const tempConnectionPoints = tempComponent.connectionPoints.map(cp => ({
      ...cp,
      pixelPos: getConnectionPointPixelPosition(tempComponent, cp.position),
    }));

    // Check all existing components for nearby connection points
    for (const existingComp of components) {
      if (existingComp.id === component.id) continue; // Skip self
      
      const existingConnectionPoints = existingComp.connectionPoints.map(cp => ({
        ...cp,
        pixelPos: getConnectionPointPixelPosition(existingComp, cp.position),
      }));

      // Check each temp connection point against existing connection points
      for (const tempCP of tempConnectionPoints) {
        for (const existingCP of existingConnectionPoints) {
          const dx = tempCP.pixelPos.x - existingCP.pixelPos.x;
          const dy = tempCP.pixelPos.y - existingCP.pixelPos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < SNAP_THRESHOLD) {
            // Found a snap target! Calculate grid offset needed
            const offsetX = Math.round(dx / CELL_SIZE);
            const offsetY = Math.round(dy / CELL_SIZE);
            
            const snappedPos = {
              x: tentativeGridPos.x - offsetX,
              y: tentativeGridPos.y - offsetY,
            };

            // Verify snapped position is valid
            const size = COMPONENT_SIZES[component.type];
            if (snappedPos.x >= 0 && snappedPos.y >= 0 &&
                snappedPos.x + size.width <= GRID_COLS &&
                snappedPos.y + size.height <= GRID_ROWS) {
              return snappedPos;
            }
          }
        }
      }
    }

    return tentativeGridPos; // No snap found, use original position
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!boardRef.current) return;

    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let gridPos = snapToGrid(x, y, CELL_SIZE);

    if (draggedComponent) {
      // Try to snap to align with existing connection points
      gridPos = findSnapPosition(draggedComponent, gridPos);
      
      // Moving existing component - check if position is within bounds
      const size = COMPONENT_SIZES[draggedComponent.type];
      if (gridPos.x + size.width > GRID_COLS || gridPos.y + size.height > GRID_ROWS) {
        alert('Component doesn\'t fit within the board!');
        setDraggedComponent(null);
        return;
      }
      onComponentMove(draggedComponent.id, gridPos);
    } else {
      // Placing new component from toolbox
      const componentType = e.dataTransfer.getData('componentType') as ComponentType;
      if (componentType) {
        // Check max count
        const metadata = COMPONENT_METADATA[componentType];
        const currentCount = components.filter(c => c.type === componentType).length;
        
        if (currentCount >= metadata.maxCount) {
          alert(`Maximum ${metadata.maxCount} ${metadata.displayName} allowed per circuit`);
          setDraggedComponent(null);
          return;
        }

        // Check if position is within bounds (allow overlaps for aligned connection points)
        const size = COMPONENT_SIZES[componentType];
        if (gridPos.x + size.width > GRID_COLS || gridPos.y + size.height > GRID_ROWS) {
          alert('Component doesn\'t fit within the board!');
          setDraggedComponent(null);
          return;
        }

        const newComponentId = `${componentType}-${Date.now()}`;
        const newComponent: Component = {
          id: newComponentId,
          type: componentType,
          gridPosition: gridPos,
          orientation: 0,
          connectionPoints: getConnectionPointsForType(componentType, newComponentId),
        };
        
        // Try to snap to align with existing connection points
        const snappedPos = findSnapPosition(newComponent, gridPos);
        newComponent.gridPosition = snappedPos;
        
        onComponentPlace(newComponent);
      }
    }

    setDraggedComponent(null);
  };

  const handleComponentClick = (component: Component, e: React.MouseEvent) => {
    e.stopPropagation();
    onComponentSelect(component.id);
  };

  const handleComponentDoubleClick = (component: Component, e: React.MouseEvent) => {
    e.stopPropagation();
    if (component.type !== 'battery_holder') {
      onComponentRotate(component.id);
    }
  };

  const handleComponentRightClick = (component: Component, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (component.type !== 'battery_holder') {
      if (confirm(`Remove ${COMPONENT_METADATA[component.type].displayName}?`)) {
        onComponentRemove(component.id);
      }
    }
  };

  const handleConnectionPointClick = (connectionPoint: ConnectionPoint, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isWireMode) return;

    if (!selectedConnectionPoint) {
      // First click - select connection point
      setSelectedConnectionPoint(connectionPoint);
    } else {
      // Second click - create wire
      if (selectedConnectionPoint.componentId === connectionPoint.componentId) {
        alert('Cannot connect a component to itself');
        setSelectedConnectionPoint(null);
        return;
      }

      // Check if wire already exists
      const wireExists = wires.some(
        w =>
          (w.fromConnectionPointId === selectedConnectionPoint.id && w.toConnectionPointId === connectionPoint.id) ||
          (w.fromConnectionPointId === connectionPoint.id && w.toConnectionPointId === selectedConnectionPoint.id)
      );

      if (wireExists) {
        alert('Wire connection already exists');
        setSelectedConnectionPoint(null);
        return;
      }

      const newWire: Wire = {
        id: `wire-${Date.now()}`,
        fromConnectionPointId: selectedConnectionPoint.id,
        toConnectionPointId: connectionPoint.id,
      };

      onWireCreate(newWire);
      setSelectedConnectionPoint(null);
    }
  };

  const getComponentPixelPosition = (component: Component): { x: number; y: number; width: number; height: number } => {
    const basePixel = gridToPixel(component.gridPosition, CELL_SIZE);
    const size = COMPONENT_SIZES[component.type];
    
    // Special case: Battery holder extends left off the board
    if (component.type === 'battery_holder') {
      return {
        x: basePixel.x - CELL_SIZE, // Shift left by 1 cell
        y: basePixel.y,
        width: 3 * CELL_SIZE, // Still 3 cells wide visually
        height: 2 * CELL_SIZE,
      };
    }
    
    return {
      x: basePixel.x,
      y: basePixel.y,
      width: size.width * CELL_SIZE,
      height: size.height * CELL_SIZE,
    };
  };

  const getConnectionPointPixelPosition = (component: Component, cpPosition: ConnectionPoint['position']): { x: number; y: number } => {
    const { x: baseX, y: baseY, width: componentWidth, height: componentHeight } = getComponentPixelPosition(component);
    
    const centerX = baseX + componentWidth / 2;
    const centerY = baseY + componentHeight / 2;

    switch (cpPosition) {
      case 'top':
        return { x: centerX, y: baseY };
      case 'bottom':
        return { x: centerX, y: baseY + componentHeight };
      case 'left':
        return { x: baseX, y: centerY };
      case 'right':
        return { x: baseX + componentWidth, y: centerY };
      case 'top-left':
        return { x: baseX, y: baseY };
      case 'top-right':
        return { x: baseX + componentWidth, y: baseY };
      case 'bottom-left':
        return { x: baseX, y: baseY + componentHeight };
      case 'bottom-right':
        return { x: baseX + componentWidth, y: baseY + componentHeight };
      case 'middle-right':
        return { x: baseX + componentWidth, y: centerY };
      default:
        return { x: centerX, y: centerY };
    }
  };

  return (
    <div
      ref={boardRef}
      className="relative bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border-4 border-amber-800 overflow-hidden"
      style={{ width: GRID_COLS * CELL_SIZE, height: GRID_ROWS * CELL_SIZE }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => {
        onComponentSelect(null);
        setSelectedConnectionPoint(null);
      }}
    >
      {/* Grid lines */}
      <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, width: GRID_COLS * CELL_SIZE, height: GRID_ROWS * CELL_SIZE }}>
        {/* Vertical lines */}
        {Array.from({ length: GRID_COLS + 1 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={i * CELL_SIZE}
            y1={0}
            x2={i * CELL_SIZE}
            y2={GRID_ROWS * CELL_SIZE}
            stroke="rgba(120, 53, 15, 0.4)"
            strokeWidth="2"
          />
        ))}
        {/* Horizontal lines */}
        {Array.from({ length: GRID_ROWS + 1 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1={0}
            y1={i * CELL_SIZE}
            x2={GRID_COLS * CELL_SIZE}
            y2={i * CELL_SIZE}
            stroke="rgba(120, 53, 15, 0.4)"
            strokeWidth="2"
          />
        ))}
      </svg>

      {/* Wires */}
      <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, width: GRID_COLS * CELL_SIZE, height: GRID_ROWS * CELL_SIZE }}>
        {wires.map((wire) => {
          const fromComponent = components.find(c => c.connectionPoints.some(cp => cp.id === wire.fromConnectionPointId));
          const toComponent = components.find(c => c.connectionPoints.some(cp => cp.id === wire.toConnectionPointId));
          
          if (!fromComponent || !toComponent) return null;

          const fromCP = fromComponent.connectionPoints.find(cp => cp.id === wire.fromConnectionPointId);
          const toCP = toComponent.connectionPoints.find(cp => cp.id === wire.toConnectionPointId);

          if (!fromCP || !toCP) return null;

          const fromPos = getConnectionPointPixelPosition(fromComponent, fromCP.position);
          const toPos = getConnectionPointPixelPosition(toComponent, toCP.position);

          return (
            <g key={wire.id}>
              {/* Shadow/outline for better visibility */}
              <line
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke="#000000"
                strokeWidth="8"
                strokeLinecap="round"
                opacity="0.3"
              />
              {/* Main wire */}
              <line
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke="#2563EB"
                strokeWidth="6"
                strokeLinecap="round"
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Remove this wire?')) {
                    onWireRemove(wire.id);
                  }
                }}
                className="pointer-events-auto hover:stroke-red-500 transition-colors"
              />
            </g>
          );
        })}
      </svg>

      {/* Components */}
      {components.map((component) => {
        const metadata = COMPONENT_METADATA[component.type];
        const { x, y, width, height } = getComponentPixelPosition(component);
        const isSelected = selectedComponentId === component.id;
        const isWire = component.type === 'wire';

        return (
          <div
            key={component.id}
            draggable={component.type !== 'battery_holder'}
            onDragStart={() => handleComponentDragStart(component)}
            onClick={(e) => handleComponentClick(component, e)}
            onDoubleClick={(e) => handleComponentDoubleClick(component, e)}
            onContextMenu={(e) => handleComponentRightClick(component, e)}
            className={`absolute transition-all ${
              component.type === 'battery_holder' ? 'cursor-default' : 'cursor-move hover:scale-105'
            } ${isSelected ? 'ring-4 ring-blue-500 ring-opacity-75 z-20' : isWire ? 'z-5' : 'z-10'}`}
            style={{
              left: x,
              top: y,
              width: width,
              height: height,
              transform: `rotate(${component.orientation}deg)`,
            }}
          >
            {/* Component body */}
            <div
              className="w-full h-full rounded-lg shadow-lg flex flex-col items-center justify-center text-white font-bold p-1 border-2 border-gray-800"
              style={{ backgroundColor: metadata.color }}
            >
              <span className="text-center text-xs leading-tight px-1">{metadata.displayName}</span>
            </div>

            {/* Connection points */}
            {component.connectionPoints.map((cp) => {
              const cpPos = getConnectionPointPixelPosition(component, cp.position);
              const { x: componentX, y: componentY } = getComponentPixelPosition(component);
              const isSelectedCP = selectedConnectionPoint?.id === cp.id;

              return (
                <div
                  key={cp.id}
                  onClick={(e) => handleConnectionPointClick(cp, e)}
                  className={`absolute w-6 h-6 rounded-full border-3 transition-all cursor-pointer hover:scale-150 ${
                    isSelectedCP
                      ? 'bg-yellow-400 border-yellow-600 scale-150 shadow-lg'
                      : 'bg-white border-gray-800 shadow-md'
                  }`}
                  style={{
                    left: cpPos.x - componentX - 12,
                    top: cpPos.y - componentY - 12,
                    zIndex: 30,
                    borderWidth: '3px',
                  }}
                  title={`Connection point: ${cp.position}`}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

